from dotenv import load_dotenv
load_dotenv()

from sqlmodel import Session
from app.database import engine
from app import crud, schemas

# Test creating a task
with Session(engine) as session:
    try:
        task_create = schemas.TaskCreate(title="Test task")
        result = crud.create_task(db=session, task=task_create)
        print(f"Success! Created task: {result}")
        print(f"Task ID: {result.id}")
        print(f"Task Title: {result.title}")
        print(f"Task Priority: {result.priority}")
        print(f"Task Created At: {result.created_at}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()