from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, Enum as SQLEnum, ARRAY, String
import enum

class PriorityEnum(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class RecurrenceEnum(str, enum.Enum):
    NONE = "NONE"
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    completed: bool = Field(default=False)
    priority: str = Field(default="MEDIUM", sa_column=Column(SQLEnum('LOW', 'MEDIUM', 'HIGH', name='priority'), nullable=False))
    tags: Optional[List[str]] = Field(default=None, sa_column=Column(ARRAY(String), nullable=True))
    due_datetime: Optional[datetime] = Field(default=None, nullable=True)
    recurrence: str = Field(default="NONE", sa_column=Column(SQLEnum('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', name='recurrence'), nullable=False))
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)