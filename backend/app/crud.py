from sqlmodel import Session, select
from datetime import datetime
from . import models, schemas

def get_tasks(db: Session):
    return db.exec(select(models.Task)).all()

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(title=task.title)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, db_task: models.Task, task_in: schemas.TaskUpdate):
    if task_in.title is not None:
        db_task.title = task_in.title
    if task_in.completed is not None:
        db_task.completed = task_in.completed
    if task_in.priority is not None:
        db_task.priority = task_in.priority
    db_task.updated_at = datetime.utcnow()
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, db_task: models.Task):
    db.delete(db_task)
    db.commit()
    return db_task

def get_task(db: Session, task_id: int):
    return db.get(models.Task, task_id)
