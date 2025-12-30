from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TaskBase(BaseModel):
    title: str

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    due_datetime: Optional[datetime] = None
    recurrence: Optional[str] = None

class TaskInDB(TaskBase):
    id: int
    completed: bool
    priority: str
    tags: Optional[List[str]] = None
    due_datetime: Optional[datetime] = None
    recurrence: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
