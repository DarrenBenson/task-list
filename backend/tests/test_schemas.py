"""Unit tests for Pydantic schemas.

Covers TS0001 test cases:
- TC010: Empty title is rejected
- TC011: Whitespace-only title is rejected
- TC012: Title at max length (200 chars) is accepted
- TC013: Title exceeding max length (201 chars) is rejected
"""

import pytest
from pydantic import ValidationError

from app.schemas import TaskCreate, TaskUpdate


class TestTaskCreateSchema:
    """Tests for TaskCreate schema validation."""

    def test_valid_task_with_title_and_description(self):
        """Valid task creation data is accepted."""
        task = TaskCreate(title="Call dentist", description="Book appointment")
        assert task.title == "Call dentist"
        assert task.description == "Book appointment"

    def test_valid_task_title_only(self):
        """Task with only title is valid."""
        task = TaskCreate(title="Buy groceries")
        assert task.title == "Buy groceries"
        assert task.description is None

    def test_empty_title_rejected(self):
        """TC010: Empty title is rejected."""
        with pytest.raises(ValidationError) as exc_info:
            TaskCreate(title="")

        errors = exc_info.value.errors()
        assert len(errors) > 0
        assert any("min_length" in str(e) or "at least 1" in str(e) for e in errors)

    def test_whitespace_only_title_rejected(self):
        """TC011: Whitespace-only title is rejected."""
        with pytest.raises(ValidationError) as exc_info:
            TaskCreate(title="   ")

        errors = exc_info.value.errors()
        assert len(errors) > 0
        assert any("blank" in str(e).lower() for e in errors)

    def test_title_at_max_length_accepted(self, max_length_title: str):
        """TC012: Title at max length (200 chars) is accepted."""
        task = TaskCreate(title=max_length_title)
        assert len(task.title) == 200

    def test_title_exceeding_max_length_rejected(self, over_max_length_title: str):
        """TC013: Title exceeding max length (201 chars) is rejected."""
        with pytest.raises(ValidationError) as exc_info:
            TaskCreate(title=over_max_length_title)

        errors = exc_info.value.errors()
        assert len(errors) > 0
        assert any("max_length" in str(e) or "at most 200" in str(e) for e in errors)

    def test_description_max_length_accepted(self):
        """Description at max length (2000 chars) is accepted."""
        desc = "B" * 2000
        task = TaskCreate(title="Test", description=desc)
        assert len(task.description) == 2000

    def test_description_exceeding_max_length_rejected(self):
        """Description exceeding max length is rejected."""
        desc = "B" * 2001
        with pytest.raises(ValidationError):
            TaskCreate(title="Test", description=desc)


class TestTaskUpdateSchema:
    """Tests for TaskUpdate schema validation."""

    def test_partial_update_title_only(self):
        """Can update title only."""
        update = TaskUpdate(title="New title")
        assert update.title == "New title"
        assert update.description is None
        assert update.is_complete is None

    def test_partial_update_is_complete(self):
        """Can update is_complete only."""
        update = TaskUpdate(is_complete=True)
        assert update.is_complete is True
        assert update.title is None

    def test_empty_title_rejected_on_update(self):
        """Empty title rejected on update."""
        with pytest.raises(ValidationError):
            TaskUpdate(title="")

    def test_whitespace_only_title_rejected_on_update(self):
        """Whitespace-only title rejected on update."""
        with pytest.raises(ValidationError) as exc_info:
            TaskUpdate(title="   ")

        errors = exc_info.value.errors()
        assert any("blank" in str(e).lower() for e in errors)

    def test_update_with_all_fields(self):
        """Can provide all fields for update."""
        update = TaskUpdate(
            title="Updated",
            description="New desc",
            is_complete=True,
            position=5,
        )
        assert update.title == "Updated"
        assert update.description == "New desc"
        assert update.is_complete is True
        assert update.position == 5
