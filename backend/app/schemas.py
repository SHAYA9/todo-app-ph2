from pydantic import BaseModel, Json
from typing import Optional, List
from datetime import datetime

from .models import PriorityEnum

class TaskBase(BaseModel):
    title: str
    priority: Optional[PriorityEnum] = PriorityEnum.medium
    tags: Optional[List[str]] = []
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[PriorityEnum] = None
    tags: Optional[List[str]] = None
    due_date: Optional[datetime] = None

class TaskInDB(TaskBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
