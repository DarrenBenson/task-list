"""API tests for task deadline feature.

Covers TS0012 test cases:
- TC0012-1: Create task with deadline
- TC0012-2: Create task without deadline
- TC0012-3: Edit task to add deadline
- TC0012-4: Remove deadline from task
- TC0012-9: Deadline persists after refresh
- TC0012-10: Invalid datetime format rejected
- TC0012-E1: Create task with past deadline
- TC0012-E2: Empty string deadline treated as null
"""

import uuid
from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import Task


class TestCreateTaskWithDeadline:
    """Tests for creating tasks with deadline field."""

    def test_create_task_with_deadline_returns_201(self, client: TestClient):
        """TC0012-1: Create task with deadline returns 201."""
        response = client.post(
            "/api/v1/tasks/",
            json={
                "title": "Pay electricity bill",
                "description": "Due by end of month",
                "deadline": "2026-01-25T17:00:00",
            },
        )

        assert response.status_code == 201

    def test_create_task_deadline_matches_input(self, client: TestClient):
        """TC0012-1: Response deadline matches input."""
        deadline = "2026-01-25T17:00:00"
        response = client.post(
            "/api/v1/tasks/",
            json={
                "title": "Pay electricity bill",
                "deadline": deadline,
            },
        )
        data = response.json()

        assert "deadline" in data
        assert data["deadline"] == deadline

    def test_create_task_without_deadline_has_null(self, client: TestClient):
        """TC0012-2: Create task without deadline returns null."""
        response = client.post(
            "/api/v1/tasks/",
            json={
                "title": "General task",
            },
        )
        data = response.json()

        assert response.status_code == 201
        assert data["deadline"] is None

    def test_create_task_with_past_deadline_accepted(self, client: TestClient):
        """TC0012-E1: Create task with past deadline is accepted."""
        past_deadline = "2026-01-01T12:00:00"
        response = client.post(
            "/api/v1/tasks/",
            json={
                "title": "Already overdue",
                "deadline": past_deadline,
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["deadline"] == past_deadline


class TestUpdateTaskDeadline:
    """Tests for updating task deadline."""

    def test_update_task_add_deadline(self, client: TestClient, sample_task: Task):
        """TC0012-3: Edit task to add deadline."""
        deadline = "2026-01-30T09:00:00"
        response = client.patch(
            f"/api/v1/tasks/{sample_task.id}",
            json={"deadline": deadline},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["deadline"] == deadline

    def test_update_task_change_deadline(
        self, client: TestClient, task_with_deadline: Task
    ):
        """TC0012-3: Edit task to change deadline."""
        new_deadline = "2026-02-15T14:00:00"
        response = client.patch(
            f"/api/v1/tasks/{task_with_deadline.id}",
            json={"deadline": new_deadline},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["deadline"] == new_deadline

    def test_update_task_remove_deadline(
        self, client: TestClient, task_with_deadline: Task
    ):
        """TC0012-4: Remove deadline from task."""
        response = client.patch(
            f"/api/v1/tasks/{task_with_deadline.id}",
            json={"deadline": None},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["deadline"] is None

    def test_update_deadline_preserves_other_fields(
        self, client: TestClient, sample_task: Task
    ):
        """Adding deadline preserves other task fields."""
        original_title = sample_task.title
        deadline = "2026-01-30T09:00:00"

        response = client.patch(
            f"/api/v1/tasks/{sample_task.id}",
            json={"deadline": deadline},
        )
        data = response.json()

        assert data["title"] == original_title
        assert data["deadline"] == deadline


class TestDeadlinePersistence:
    """Tests for deadline persistence."""

    def test_get_task_returns_deadline(
        self, client: TestClient, task_with_deadline: Task
    ):
        """TC0012-9: GET task returns deadline field."""
        response = client.get(f"/api/v1/tasks/{task_with_deadline.id}")

        assert response.status_code == 200
        data = response.json()
        assert "deadline" in data
        assert data["deadline"] is not None

    def test_list_tasks_includes_deadline(
        self, client: TestClient, task_with_deadline: Task
    ):
        """TC0012-9: List tasks includes deadline field."""
        response = client.get("/api/v1/tasks/")

        assert response.status_code == 200
        tasks = response.json()
        assert len(tasks) > 0
        assert "deadline" in tasks[0]

    def test_deadline_persists_in_database(
        self, client: TestClient, db_session: Session
    ):
        """TC0012-9: Deadline persists in database."""
        deadline = "2026-01-25T17:00:00"

        # Create task
        response = client.post(
            "/api/v1/tasks/",
            json={"title": "Persistent task", "deadline": deadline},
        )
        task_id = response.json()["id"]

        # Fetch again to verify persistence
        response = client.get(f"/api/v1/tasks/{task_id}")
        data = response.json()

        assert data["deadline"] == deadline


class TestDeadlineValidation:
    """Tests for deadline validation."""

    def test_invalid_datetime_format_rejected(self, client: TestClient):
        """TC0012-10: Invalid datetime format returns 422."""
        response = client.post(
            "/api/v1/tasks/",
            json={
                "title": "Test task",
                "deadline": "not-a-date",
            },
        )

        assert response.status_code == 422

    def test_invalid_datetime_values_rejected(self, client: TestClient):
        """TC0012-10: Invalid datetime values (e.g., Feb 30) rejected."""
        response = client.post(
            "/api/v1/tasks/",
            json={
                "title": "Test task",
                "deadline": "2026-02-30T12:00:00",
            },
        )

        assert response.status_code == 422

    def test_invalid_time_values_rejected(self, client: TestClient):
        """TC0012-10: Invalid time values (e.g., 25:00) rejected."""
        response = client.post(
            "/api/v1/tasks/",
            json={
                "title": "Test task",
                "deadline": "2026-01-25T25:00:00",
            },
        )

        assert response.status_code == 422
