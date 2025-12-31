from dotenv import load_dotenv
load_dotenv() # Load environment variables from .env

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from typing import List, Optional

from . import crud, models, schemas
from .database import engine

models.SQLModel.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    with Session(engine) as session:
        yield session



@app.get("/tasks/upcoming", response_model=List[schemas.TaskInDB])
def read_upcoming_tasks(
    minutes_offset: int = 15,
    db: Session = Depends(get_db)
):
    return crud.get_upcoming_tasks(db=db, minutes_offset=minutes_offset)

@app.delete("/tasks/{task_id}", response_model=schemas.TaskInDB)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return crud.delete_task(db=db, db_task=db_task)

@app.put("/tasks/{task_id}", response_model=schemas.TaskInDB)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return crud.update_task(db=db, db_task=db_task, task_in=task)

@app.post("/tasks/", response_model=schemas.TaskInDB)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db=db, task=task)

@app.get("/tasks", response_model=List[schemas.TaskInDB])
def read_tasks(
    search: Optional[str] = None,
    completed: Optional[bool] = None,
    priority: Optional[models.PriorityEnum] = None,
    has_due_date: Optional[bool] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud.get_tasks(
        db=db,
        search=search,
        completed=completed,
        priority=priority,
        has_due_date=has_due_date,
        sort_by=sort_by,
        sort_order=sort_order
    )

@app.get("/")
def read_root():
    return {"Hello": "World"}
