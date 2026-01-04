import enum
from pydantic import Json
from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSON # Correct import for JSONB type
from uuid import UUID

class PriorityEnum(str, enum.Enum):
    high = "high"
    medium = "medium"
    low = "low"

class RecurrenceTypeEnum(str, enum.Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    completed: bool = Field(default=False)
    priority: PriorityEnum = Field(default=PriorityEnum.medium, sa_column=Column(SQLEnum(PriorityEnum), nullable=False))
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False)) # Use JSON from dialects
    due_datetime: Optional[datetime] = Field(default=None, nullable=True)
    recurrence_type: Optional[RecurrenceTypeEnum] = Field(default=None, sa_column=Column(SQLEnum(RecurrenceTypeEnum), nullable=True))
    recurrence_id: Optional[UUID] = Field(default=None, index=True) # Use UUID for recurrence_id
    is_archived: bool = Field(default=False)
    user_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)