from sqlmodel import Session, select, asc, desc
from datetime import datetime
from typing import Optional, List

from . import models, schemas

def get_tasks(
    db: Session,
    search: Optional[str] = None,
    completed: Optional[bool] = None,
    priority: Optional[models.PriorityEnum] = None,
    has_due_date: Optional[bool] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "asc" # Default to ascending
):
    query = select(models.Task)

    if search:
        query = query.where(models.Task.title.ilike(f"%{search}%"))
    if completed is not None:
        query = query.where(models.Task.completed == completed)
    if priority is not None:
        query = query.where(models.Task.priority == priority)
    if has_due_date is not None:
        if has_due_date:
            query = query.where(models.Task.due_date.isnot(None))
        else:
            query = query.where(models.Task.due_date.is_(None))
    
    if sort_by:
        sort_column = None
        if sort_by == "title":
            sort_column = models.Task.title
        elif sort_by == "priority":
            # Sorting by enum value, custom logic might be needed for specific order (high, medium, low)
            # For now, it will sort alphabetically by the string value
            sort_column = models.Task.priority
        elif sort_by == "due_date":
            sort_column = models.Task.due_date
        
        if sort_column:
            if sort_order == "desc":
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))

    return db.exec(query).all()

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(
        title=task.title,
        priority=task.priority,
        tags=task.tags,
        due_date=task.due_date
    )
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
    if task_in.tags is not None:
        db_task.tags = task_in.tags
    if task_in.due_date is not None:
        db_task.due_date = task_in.due_date
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
