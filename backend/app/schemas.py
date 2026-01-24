"""Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    deadline: Optional[datetime] = None

    @field_validator("title")
    @classmethod
    def title_not_whitespace(cls, v: str) -> str:
        """Validate that title is not whitespace-only."""
        if not v.strip():
            raise ValueError("title cannot be blank")
        return v


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""

    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    is_complete: Optional[bool] = None
    position: Optional[int] = None
    deadline: Optional[datetime] = None

    @field_validator("title")
    @classmethod
    def title_not_whitespace(cls, v: Optional[str]) -> Optional[str]:
        """Validate that title is not whitespace-only if provided."""
        if v is not None and not v.strip():
            raise ValueError("title cannot be blank")
        return v


class TaskResponse(BaseModel):
    """Schema for task responses."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: Optional[str]
    is_complete: bool
    position: int
    deadline: Optional[datetime]
    created_at: datetime
    updated_at: datetime


class ReorderRequest(BaseModel):
    """Schema for reordering tasks."""

    task_ids: List[str] = Field(..., min_length=1)
