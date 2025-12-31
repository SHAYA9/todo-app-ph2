from pydantic import BaseModel, Json
from typing import Optional, List
from datetime import datetime
from uuid import UUID # Import UUID

from .models import PriorityEnum, RecurrenceTypeEnum # Import RecurrenceTypeEnum

class TaskBase(BaseModel):
    title: str
    priority: Optional[PriorityEnum] = PriorityEnum.medium
    tags: Optional[List[str]] = []
    due_datetime: Optional[datetime] = None # Renamed from due_date
    recurrence_type: Optional[RecurrenceTypeEnum] = None
    recurrence_id: Optional[UUID] = None # Added recurrence_id
    is_archived: bool = False # Added is_archived

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[PriorityEnum] = None
    tags: Optional[List[str]] = None
    due_datetime: Optional[datetime] = None # Renamed from due_date
    recurrence_type: Optional[RecurrenceTypeEnum] = None
    recurrence_id: Optional[UUID] = None
    is_archived: Optional[bool] = None # Added is_archived to allow updating

class TaskInDB(TaskBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
