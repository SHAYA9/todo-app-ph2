from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy import Column, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSON # Correct import for JSONB type
import enum

class PriorityEnum(str, enum.Enum):
    high = "high"
    medium = "medium"
    low = "low"

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    completed: bool = Field(default=False)
    priority: PriorityEnum = Field(default=PriorityEnum.medium, sa_column=Column(SQLEnum(PriorityEnum), nullable=False))
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False)) # Use JSON from dialects
    due_date: Optional[datetime] = Field(default=None, nullable=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)