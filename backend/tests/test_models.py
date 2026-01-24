"""Unit tests for Task model.

Covers TS0001 test cases:
- TC002: Task database model is defined correctly
"""

import uuid

from sqlalchemy.orm import Session

from app.models import Task


class TestTaskModel:
    """TC002: Task database model is defined correctly."""

    def test_task_has_uuid_primary_key(self, db_session: Session):
        """Task has id field as UUID primary key."""
        task = Task(title="Test", position=1)
        db_session.add(task)
        db_session.commit()

        # Verify id is a valid UUID string
        assert task.id is not None
        assert len(task.id) == 36
        uuid.UUID(task.id)  # Raises if not valid UUID

    def test_task_title_max_200_chars(self, db_session: Session):
        """Task has title field max 200 chars, not nullable."""
        title = "A" * 200
        task = Task(title=title, position=1)
        db_session.add(task)
        db_session.commit()

        assert task.title == title
        assert len(task.title) == 200

    def test_task_description_nullable(self, db_session: Session):
        """Task has description field max 2000 chars, nullable."""
        # Test with None
        task1 = Task(title="No description", position=1, description=None)
        db_session.add(task1)
        db_session.commit()
        assert task1.description is None

        # Test with value
        desc = "A" * 2000
        task2 = Task(title="With description", position=2, description=desc)
        db_session.add(task2)
        db_session.commit()
        assert task2.description == desc

    def test_task_is_complete_default_false(self, db_session: Session):
        """Task has is_complete boolean defaulting to False."""
        task = Task(title="Test", position=1)
        db_session.add(task)
        db_session.commit()

        assert task.is_complete is False

    def test_task_position_required(self, db_session: Session):
        """Task has position integer not nullable."""
        task = Task(title="Test", position=42)
        db_session.add(task)
        db_session.commit()

        assert task.position == 42

    def test_task_has_timestamps(self, db_session: Session):
        """Task has created_at and updated_at timestamps."""
        task = Task(title="Test", position=1)
        db_session.add(task)
        db_session.commit()

        assert task.created_at is not None
        assert task.updated_at is not None

    def test_task_repr(self, db_session: Session):
        """Task has readable string representation."""
        task = Task(title="My Task", position=1, is_complete=True)
        db_session.add(task)
        db_session.commit()

        repr_str = repr(task)
        assert "Task" in repr_str
        assert "My Task" in repr_str
        assert "complete=True" in repr_str
