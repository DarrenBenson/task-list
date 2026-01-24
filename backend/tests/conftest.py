"""Pytest configuration and shared fixtures.

Implements test fixtures for TS0001 test cases:
- In-memory SQLite database
- Test client with TestClient
- Sample task data fixtures
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import Base, get_db
from app.main import app
from app.models import Task


# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    """Create a fresh database session for each test.

    Creates tables before test, drops after.
    """
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session: Session):
    """Create test client with database session override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_task(db_session: Session) -> Task:
    """Create a single sample task in the database."""
    task = Task(
        title="Call dentist",
        description="Book cleaning appointment",
        position=1,
        is_complete=False,
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task


@pytest.fixture
def completed_task(db_session: Session) -> Task:
    """Create a completed task in the database."""
    task = Task(
        title="Finished task",
        description=None,
        position=1,
        is_complete=True,
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task


@pytest.fixture
def multiple_tasks(db_session: Session) -> list[Task]:
    """Create multiple tasks for list testing."""
    tasks = [
        Task(title="Task 1", position=1, is_complete=False),
        Task(title="Task 2", position=2, is_complete=True),
        Task(title="Task 3", position=3, is_complete=False),
    ]
    for task in tasks:
        db_session.add(task)
    db_session.commit()
    for task in tasks:
        db_session.refresh(task)
    return tasks


# Test data fixtures matching TS0001 spec
@pytest.fixture
def valid_task_data() -> dict:
    """Valid task creation data."""
    return {
        "title": "Call dentist",
        "description": "Book cleaning appointment",
    }


@pytest.fixture
def task_title_only() -> dict:
    """Task with title only, no description."""
    return {
        "title": "Buy groceries",
    }


@pytest.fixture
def max_length_title() -> str:
    """Title at maximum allowed length (200 chars)."""
    return "A" * 200


@pytest.fixture
def over_max_length_title() -> str:
    """Title exceeding maximum allowed length (201 chars)."""
    return "A" * 201


@pytest.fixture
def task_with_deadline(db_session: Session) -> Task:
    """Create a task with a deadline set."""
    from datetime import datetime

    task = Task(
        title="Task with deadline",
        description="Has a deadline set",
        position=1,
        is_complete=False,
        deadline=datetime(2026, 1, 25, 17, 0, 0),
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task


@pytest.fixture
def task_overdue(db_session: Session) -> Task:
    """Create a task with a past deadline (overdue)."""
    from datetime import datetime

    task = Task(
        title="Overdue task",
        description="Deadline has passed",
        position=1,
        is_complete=False,
        deadline=datetime(2026, 1, 20, 12, 0, 0),
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task
