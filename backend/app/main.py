import os
from dotenv import load_dotenv

# Only load .env file in local development
if not os.getenv("VERCEL_ENV"):
    load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from typing import List, Optional
from pywebpush import webpush, WebPushException
import json

from . import crud, models, schemas, auth

# Create tables on startup (Railway, Hugging Face, local dev)
# Skip for Vercel serverless to avoid on every function invocation
from .database import engine
if not os.getenv("VERCEL_ENV"):
    models.SQLModel.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API", version="1.0.0")

# Configure CORS for different deployment environments
origins = [
    "http://localhost:3000",  # Local development frontend
    "http://localhost:8000",  # Local backend testing
    "http://localhost:7860",  # Hugging Face Spaces
]

# Detect deployment environment
is_vercel = os.getenv("VERCEL_ENV")
is_huggingface = os.getenv("SPACE_ID") or os.getenv("SPACE_AUTHOR_NAME")
is_railway = os.getenv("RAILWAY_ENVIRONMENT")

# Add environment-specific origins
if is_vercel:
    origins.extend([
        "https://*.vercel.app",
        "https://vercel.app",
    ])
elif is_huggingface:
    # Hugging Face Spaces
    space_host = os.getenv("SPACE_HOST", "")
    if space_host:
        origins.append(f"https://{space_host}")
    origins.append("https://*.hf.space")
elif is_railway:
    # Railway deployment - use environment variable for CORS
    cors_origins_env = os.getenv("CORS_ORIGINS", "")
    if cors_origins_env:
        # Split comma-separated origins
        origins.extend([origin.strip() for origin in cors_origins_env.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if not (is_vercel or is_huggingface or is_railway) else ["*"],  # Allow all in cloud
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    with Session(engine) as session:
        yield session



# Authentication endpoints
@app.post("/auth/signup", response_model=schemas.TokenResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = auth.get_password_hash(user.password)
    db_user = crud.create_user(db=db, user=user, hashed_password=hashed_password)
    
    # Create access token
    access_token = auth.create_access_token(data={"sub": str(db_user.id)})
    
    return schemas.TokenResponse(
        access_token=access_token,
        user=schemas.UserResponse.model_validate(db_user)
    )

@app.post("/auth/signin", response_model=schemas.TokenResponse)
def signin(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    # Get user by email
    db_user = crud.get_user_by_email(db, email=credentials.email)
    if not db_user or not auth.verify_password(credentials.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = auth.create_access_token(data={"sub": str(db_user.id)})
    
    return schemas.TokenResponse(
        access_token=access_token,
        user=schemas.UserResponse.model_validate(db_user)
    )

# Protected task endpoints
@app.get("/api/{user_id}/tasks/upcoming", response_model=List[schemas.TaskInDB])
def read_upcoming_tasks(
    user_id: int,
    minutes_offset: int = 15,
    current_user_id: int = Depends(auth.get_current_user_id),
    db: Session = Depends(get_db)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return crud.get_upcoming_tasks(db=db, user_id=current_user_id, minutes_offset=minutes_offset)

@app.delete("/api/{user_id}/tasks/{task_id}", response_model=schemas.TaskInDB)
def delete_task(
    user_id: int,
    task_id: int,
    current_user_id: int = Depends(auth.get_current_user_id),
    db: Session = Depends(get_db)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None or db_task.user_id != current_user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    return crud.delete_task(db=db, db_task=db_task)

@app.put("/api/{user_id}/tasks/{task_id}", response_model=schemas.TaskInDB)
def update_task(
    user_id: int,
    task_id: int,
    task: schemas.TaskUpdate,
    current_user_id: int = Depends(auth.get_current_user_id),
    db: Session = Depends(get_db)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None or db_task.user_id != current_user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    return crud.update_task(db=db, db_task=db_task, task_in=task)

@app.post("/api/{user_id}/tasks", response_model=schemas.TaskInDB)
def create_task(
    user_id: int,
    task: schemas.TaskCreate,
    current_user_id: int = Depends(auth.get_current_user_id),
    db: Session = Depends(get_db)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    db_task = crud.create_task(db=db, task=task, user_id=current_user_id)
    
    if db_task.due_datetime:
        send_notification(db_task, db)

    return db_task

@app.get("/api/{user_id}/tasks/{task_id}", response_model=schemas.TaskInDB)
def read_task(
    user_id: int,
    task_id: int,
    current_user_id: int = Depends(auth.get_current_user_id),
    db: Session = Depends(get_db)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None or db_task.user_id != current_user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.get("/api/{user_id}/tasks", response_model=List[schemas.TaskInDB])
def read_tasks(
    user_id: int,
    search: Optional[str] = None,
    completed: Optional[bool] = None,
    priority: Optional[models.PriorityEnum] = None,
    has_due_date: Optional[bool] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
    current_user_id: int = Depends(auth.get_current_user_id),
    db: Session = Depends(get_db)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return crud.get_tasks(
        db=db,
        user_id=current_user_id,
        search=search,
        completed=completed,
        priority=priority,
        has_due_date=has_due_date,
        sort_by=sort_by,
        sort_order=sort_order
    )

@app.patch("/api/{user_id}/tasks/{task_id}/complete", response_model=schemas.TaskInDB)
def toggle_task_completion(
    user_id: int,
    task_id: int,
    current_user_id: int = Depends(auth.get_current_user_id),
    db: Session = Depends(get_db)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None or db_task.user_id != current_user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return crud.update_task(db=db, db_task=db_task, task_in=schemas.TaskUpdate(completed=not db_task.completed))

@app.post("/api/subscribe")
def subscribe(subscription: dict, current_user_id: int = Depends(auth.get_current_user_id), db: Session = Depends(get_db)):
    crud.create_push_subscription(db, subscription, current_user_id)
    return {"message": "Subscription successful"}

def send_notification(task: models.Task, db: Session):
    subscriptions = crud.get_push_subscriptions_by_user(db, task.user_id)
    for sub in subscriptions:
        try:
            webpush(
                subscription_info=sub.subscription_info,
                data=json.dumps({
                    "title": f"Task Due: {task.title}",
                    "body": f"Priority: {task.priority}\nDue: {task.due_datetime}",
                    "icon": "/favicon.ico",
                    "data": {"taskId": task.id}
                }),
                vapid_private_key=os.getenv("VAPID_PRIVATE_KEY"),
                vapid_claims={"sub": f"mailto:{os.getenv('VAPID_CLAIM_EMAIL')}"}
            )
        except WebPushException as ex:
            print(f"Error sending notification: {ex}")
            if ex.response and ex.response.status_code == 410:
                # Subscription is no longer valid, remove from DB
                crud.delete_push_subscription(db, sub.id)


@app.get("/")
def read_root():
    return {"Hello": "World"}
