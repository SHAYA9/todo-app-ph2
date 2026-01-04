from sqlmodel import Session, select, asc, desc
from datetime import datetime, timedelta
from typing import Optional, List
from uuid import UUID, uuid4

from . import models, schemas

# Helper function to calculate next due_datetime
def calculate_next_due_datetime(current_due: datetime, recurrence_type: models.RecurrenceTypeEnum) -> datetime:
    if recurrence_type == models.RecurrenceTypeEnum.daily:
        return current_due + timedelta(days=1)
    elif recurrence_type == models.RecurrenceTypeEnum.weekly:
        return current_due + timedelta(weeks=1)
    elif recurrence_type == models.RecurrenceTypeEnum.monthly:
        # Simple monthly calculation: add 1 month. More complex logic needed for end-of-month handling.
        # For prototype, assuming same day of next month.
        year = current_due.year
        month = current_due.month + 1
        if month > 12:
            month = 1
            year += 1
        return current_due.replace(year=year, month=month)
    return current_due

def get_tasks(
    db: Session,
    user_id: int,
    search: Optional[str] = None,
    completed: Optional[bool] = None,
    priority: Optional[models.PriorityEnum] = None,
    has_due_date: Optional[bool] = None,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "asc", # Default to ascending
    include_archived: bool = False # New parameter to include archived tasks
):
    query = select(models.Task).where(models.Task.user_id == user_id)

    # By default, do not show archived tasks
    if not include_archived:
        query = query.where(models.Task.is_archived == False)

    if search:
        query = query.where(models.Task.title.ilike(f"%{search}%"))
    if completed is not None:
        query = query.where(models.Task.completed == completed)
    if priority is not None:
        query = query.where(models.Task.priority == priority)
    if has_due_date is not None:
        if has_due_date:
            query = query.where(models.Task.due_datetime.isnot(None))
        else:
            query = query.where(models.Task.due_datetime.is_(None))
    
    if sort_by:
        sort_column = None
        if sort_by == "title":
            sort_column = models.Task.title
        elif sort_by == "priority":
            sort_column = models.Task.priority
        elif sort_by == "due_datetime": # Changed from due_date
            sort_column = models.Task.due_datetime
        
        if sort_column:
            if sort_order == "desc":
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))

    return db.exec(query).all()

def create_task(db: Session, task: schemas.TaskCreate, user_id: int):
    # If recurrence_id is not provided for a recurring task, generate one
    if task.recurrence_type and task.recurrence_id is None:
        task.recurrence_id = uuid4()

    db_task = models.Task(
        title=task.title,
        priority=task.priority,
        tags=task.tags,
        due_datetime=task.due_datetime,
        recurrence_type=task.recurrence_type,
        recurrence_id=task.recurrence_id,
        is_archived=task.is_archived,
        user_id=user_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, db_task: models.Task, task_in: schemas.TaskUpdate):
    # Initialize variable to track if a new recurring task was created
    newly_created_task = None
    
    # Always update completed status if provided in the input
    if task_in.completed is not None:
        db_task.completed = task_in.completed

    # If the task is being marked as uncompleted, ensure it's not archived.
    # This specifically addresses the scenario where a recurring task might have been archived
    # upon completion, but now is being marked uncompleted.
    if task_in.completed is False:
        db_task.is_archived = False

    # Handle completion of recurring tasks
    if task_in.completed is True and db_task.recurrence_type:
        if db_task.due_datetime is None:
            # Cannot create next instance without a due_datetime
            # Just mark current as archived if this happens (completed is already set above)
            db_task.is_archived = True
        else:
            # Calculate next due_datetime
            next_due = calculate_next_due_datetime(db_task.due_datetime, db_task.recurrence_type)

            # Ensure recurrence_id is set
            if db_task.recurrence_id is None:
                db_task.recurrence_id = uuid4()

            # Create new recurring task instance
            new_task = models.Task(
                title=db_task.title,
                priority=db_task.priority,
                tags=db_task.tags,
                due_datetime=next_due,
                recurrence_type=db_task.recurrence_type,
                recurrence_id=db_task.recurrence_id,
                is_archived=False,
                completed=False,
                user_id=db_task.user_id
            )
            db.add(new_task) # Add the new task instance
            newly_created_task = new_task # Store reference to the newly created task

            # Archive the current task instance (completed is already set above)
            db_task.is_archived = True
            
    # Apply other updates
    if task_in.title is not None:
        db_task.title = task_in.title
    if task_in.priority is not None:
        db_task.priority = task_in.priority
    if task_in.tags is not None:
        db_task.tags = task_in.tags
    if task_in.due_datetime is not None:
        db_task.due_datetime = task_in.due_datetime
    if task_in.recurrence_type is not None:
        db_task.recurrence_type = task_in.recurrence_type
        # If recurrence is stopped (set to None/empty), clear recurrence_id
        if task_in.recurrence_type is None and db_task.recurrence_id:
            db_task.recurrence_id = None
    if task_in.recurrence_id is not None:
        db_task.recurrence_id = task_in.recurrence_id
    if task_in.is_archived is not None:
        db_task.is_archived = task_in.is_archived

    db_task.updated_at = datetime.utcnow()
    db.add(db_task) # Ensure db_task is also in session for its updates
    db.commit()

    # Always refresh and return the original task (the one that was updated/completed)
    # The newly created recurring instance will appear when tasks are fetched next time
    db.refresh(db_task)
    if newly_created_task:
        db.refresh(newly_created_task)
    return db_task

def delete_task(db: Session, db_task: models.Task):
    db.delete(db_task)
    db.commit()
    return db_task

def get_task(db: Session, task_id: int):
    return db.get(models.Task, task_id)

def get_upcoming_tasks(db: Session, user_id: int, minutes_offset: int = 15) -> List[models.Task]:
    now = datetime.utcnow()
    time_limit = now + timedelta(minutes=minutes_offset)

    query = select(models.Task).where(
        models.Task.user_id == user_id,
        models.Task.completed == False,
        models.Task.is_archived == False,
        models.Task.due_datetime.isnot(None),
        models.Task.due_datetime <= time_limit,
        models.Task.due_datetime >= now # Only tasks in the future or very recent past within tolerance
    ).order_by(asc(models.Task.due_datetime))
    
    return db.exec(query).all()

# User CRUD operations
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    query = select(models.User).where(models.User.email == email)
    return db.exec(query).first()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str) -> models.User:
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
