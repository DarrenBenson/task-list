"""API tests for task endpoints.

Covers TS0001 test cases:
- TC007: Valid task is created via API
- TC009: Task with description is created
- TC010: Empty title is rejected
- TC011: Whitespace-only title is rejected
- TC012: Title at max length is accepted
- TC013: Title exceeding max length is rejected
- TC014: Task list displays on page load
- TC020: User can edit task title via API
- TC021: User can edit task description via API
- TC022: Edit validation rejects empty title
- TC027: Confirmed deletion removes task via API
"""

import uuid

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import Task


class TestCreateTask:
    """Tests for POST /api/v1/tasks/ endpoint."""

    def test_create_task_valid_returns_201(self, client: TestClient, valid_task_data: dict):
        """TC007: Valid task is created via API - Response status is 201."""
        response = client.post("/api/v1/tasks/", json=valid_task_data)

        assert response.status_code == 201

    def test_create_task_returns_valid_uuid(self, client: TestClient, task_title_only: dict):
        """TC007: Response contains valid UUID id."""
        response = client.post("/api/v1/tasks/", json=task_title_only)
        data = response.json()

        assert "id" in data
        # Verify it's a valid UUID
        uuid.UUID(data["id"])

    def test_create_task_title_matches_input(self, client: TestClient, valid_task_data: dict):
        """TC007: Title matches input."""
        response = client.post("/api/v1/tasks/", json=valid_task_data)
        data = response.json()

        assert data["title"] == valid_task_data["title"]

    def test_create_task_is_complete_false(self, client: TestClient, task_title_only: dict):
        """TC007: is_complete is false."""
        response = client.post("/api/v1/tasks/", json=task_title_only)
        data = response.json()

        assert data["is_complete"] is False

    def test_create_task_position_assigned(self, client: TestClient, task_title_only: dict):
        """TC007: position is assigned."""
        response = client.post("/api/v1/tasks/", json=task_title_only)
        data = response.json()

        assert "position" in data
        assert data["position"] == 1

    def test_create_task_timestamps_set(self, client: TestClient, task_title_only: dict):
        """TC007: timestamps are set."""
        response = client.post("/api/v1/tasks/", json=task_title_only)
        data = response.json()

        assert "created_at" in data
        assert "updated_at" in data
        assert data["created_at"] is not None
        assert data["updated_at"] is not None

    def test_create_task_with_description(self, client: TestClient, valid_task_data: dict):
        """TC009: Task with description is created."""
        response = client.post("/api/v1/tasks/", json=valid_task_data)

        assert response.status_code == 201
        data = response.json()
        assert data["description"] == valid_task_data["description"]

    def test_create_task_empty_title_rejected(self, client: TestClient):
        """TC010: Empty title is rejected."""
        response = client.post("/api/v1/tasks/", json={"title": ""})

        assert response.status_code == 422

    def test_create_task_whitespace_title_rejected(self, client: TestClient):
        """TC011: Whitespace-only title is rejected."""
        response = client.post("/api/v1/tasks/", json={"title": "   "})

        assert response.status_code == 422
        data = response.json()
        assert "detail" in data

    def test_create_task_max_length_title_accepted(
        self, client: TestClient, max_length_title: str
    ):
        """TC012: Title at max length (200 chars) is accepted."""
        response = client.post("/api/v1/tasks/", json={"title": max_length_title})

        assert response.status_code == 201
        data = response.json()
        assert len(data["title"]) == 200

    def test_create_task_over_max_length_rejected(
        self, client: TestClient, over_max_length_title: str
    ):
        """TC013: Title exceeding max length (201 chars) is rejected."""
        response = client.post("/api/v1/tasks/", json={"title": over_max_length_title})

        assert response.status_code == 422

    def test_create_multiple_tasks_increments_position(self, client: TestClient):
        """Multiple created tasks have incrementing positions."""
        client.post("/api/v1/tasks/", json={"title": "Task 1"})
        response2 = client.post("/api/v1/tasks/", json={"title": "Task 2"})
        response3 = client.post("/api/v1/tasks/", json={"title": "Task 3"})

        assert response2.json()["position"] == 2
        assert response3.json()["position"] == 3


class TestListTasks:
    """Tests for GET /api/v1/tasks/ endpoint."""

    def test_list_tasks_returns_200(self, client: TestClient):
        """TC014: Response status is 200."""
        response = client.get("/api/v1/tasks/")

        assert response.status_code == 200

    def test_list_tasks_returns_array(self, client: TestClient):
        """TC014: Response is array of tasks."""
        response = client.get("/api/v1/tasks/")

        assert isinstance(response.json(), list)

    def test_list_tasks_empty_returns_empty_array(self, client: TestClient):
        """Empty database returns empty array."""
        response = client.get("/api/v1/tasks/")

        assert response.json() == []

    def test_list_tasks_returns_all_tasks(
        self, client: TestClient, multiple_tasks: list[Task]
    ):
        """Returns all tasks in database."""
        response = client.get("/api/v1/tasks/")

        assert len(response.json()) == 3

    def test_list_tasks_sorted_by_position(
        self, client: TestClient, multiple_tasks: list[Task]
    ):
        """TC014: Tasks sorted by position ascending."""
        response = client.get("/api/v1/tasks/")
        tasks = response.json()

        positions = [t["position"] for t in tasks]
        assert positions == sorted(positions)


class TestGetTask:
    """Tests for GET /api/v1/tasks/{task_id} endpoint."""

    def test_get_task_returns_200(self, client: TestClient, sample_task: Task):
        """Existing task returns 200."""
        response = client.get(f"/api/v1/tasks/{sample_task.id}")

        assert response.status_code == 200

    def test_get_task_returns_task_data(self, client: TestClient, sample_task: Task):
        """Returns task data matching database."""
        response = client.get(f"/api/v1/tasks/{sample_task.id}")
        data = response.json()

        assert data["id"] == sample_task.id
        assert data["title"] == sample_task.title
        assert data["description"] == sample_task.description

    def test_get_task_not_found_returns_404(self, client: TestClient):
        """Non-existent task returns 404."""
        fake_id = str(uuid.uuid4())
        response = client.get(f"/api/v1/tasks/{fake_id}")

        assert response.status_code == 404


class TestUpdateTask:
    """Tests for PATCH /api/v1/tasks/{task_id} endpoint."""

    def test_update_task_title_returns_200(self, client: TestClient, sample_task: Task):
        """TC020: Response status is 200."""
        response = client.patch(
            f"/api/v1/tasks/{sample_task.id}",
            json={"title": "Updated title"},
        )

        assert response.status_code == 200

    def test_update_task_title_is_updated(self, client: TestClient, sample_task: Task):
        """TC020: Title is updated."""
        new_title = "Call dentist - Dr Smith"
        response = client.patch(
            f"/api/v1/tasks/{sample_task.id}",
            json={"title": new_title},
        )
        data = response.json()

        assert data["title"] == new_title

    def test_update_task_updated_at_refreshed(
        self, client: TestClient, sample_task: Task, db_session: Session
    ):
        """TC020: updated_at timestamp is refreshed."""
        original_updated_at = sample_task.updated_at

        response = client.patch(
            f"/api/v1/tasks/{sample_task.id}",
            json={"title": "New title"},
        )
        data = response.json()

        # updated_at should be different (or at least set)
        assert data["updated_at"] is not None
        # Convert ISO string from JSON to datetime for comparison if needed, 
        # or just compare as strings if they are different.
        # SQLite datetime might not have enough precision if it's too fast, 
        # but usually it's fine.
        assert data["updated_at"] != original_updated_at.isoformat()

    def test_update_task_description(self, client: TestClient, sample_task: Task):
        """TC021: Description is updated."""
        new_description = "Book for next Tuesday"
        response = client.patch(
            f"/api/v1/tasks/{sample_task.id}",
            json={"description": new_description},
        )

        assert response.status_code == 200
        assert response.json()["description"] == new_description

    def test_update_task_empty_title_rejected(
        self, client: TestClient, sample_task: Task
    ):
        """TC022: Edit validation rejects empty title."""
        response = client.patch(
            f"/api/v1/tasks/{sample_task.id}",
            json={"title": ""},
        )

        assert response.status_code == 422

    def test_update_task_whitespace_title_rejected(
        self, client: TestClient, sample_task: Task
    ):
        """Whitespace-only title rejected on update."""
        response = client.patch(
            f"/api/v1/tasks/{sample_task.id}",
            json={"title": "   "},
        )

        assert response.status_code == 422

    def test_update_task_is_complete(self, client: TestClient, sample_task: Task):
        """Can toggle is_complete via PATCH."""
        response = client.patch(
            f"/api/v1/tasks/{sample_task.id}",
            json={"is_complete": True},
        )

        assert response.status_code == 200
        assert response.json()["is_complete"] is True

    def test_update_task_not_found_returns_404(self, client: TestClient):
        """Non-existent task returns 404."""
        fake_id = str(uuid.uuid4())
        response = client.patch(
            f"/api/v1/tasks/{fake_id}",
            json={"title": "New title"},
        )

        assert response.status_code == 404

    def test_update_task_partial_preserves_other_fields(
        self, client: TestClient, sample_task: Task
    ):
        """Partial update preserves non-updated fields."""
        original_description = sample_task.description

        response = client.patch(
            f"/api/v1/tasks/{sample_task.id}",
            json={"title": "New title"},
        )
        data = response.json()

        assert data["description"] == original_description


class TestDeleteTask:
    """Tests for DELETE /api/v1/tasks/{task_id} endpoint."""

    def test_delete_task_returns_204(self, client: TestClient, sample_task: Task):
        """TC027: Response status is 204."""
        response = client.delete(f"/api/v1/tasks/{sample_task.id}")

        assert response.status_code == 204

    def test_delete_task_body_empty(self, client: TestClient, sample_task: Task):
        """TC027: Response body is empty."""
        response = client.delete(f"/api/v1/tasks/{sample_task.id}")

        assert response.content == b""

    def test_delete_task_no_longer_exists(self, client: TestClient, sample_task: Task):
        """TC027: Task no longer exists in database."""
        client.delete(f"/api/v1/tasks/{sample_task.id}")

        # Verify task is gone
        get_response = client.get(f"/api/v1/tasks/{sample_task.id}")
        assert get_response.status_code == 404

    def test_delete_task_get_returns_404(self, client: TestClient, sample_task: Task):
        """TC027: GET for same task returns 404."""
        task_id = sample_task.id
        client.delete(f"/api/v1/tasks/{task_id}")

        response = client.get(f"/api/v1/tasks/{task_id}")
        assert response.status_code == 404

    def test_delete_task_not_found_returns_404(self, client: TestClient):
        """Deleting non-existent task returns 404."""
        fake_id = str(uuid.uuid4())
        response = client.delete(f"/api/v1/tasks/{fake_id}")

        assert response.status_code == 404


class TestReorderTasks:
    """Tests for PUT /api/v1/tasks/reorder endpoint.

    Covers US0007 acceptance criteria:
    - AC5: API bulk reorder endpoint
    """

    def test_reorder_tasks_returns_200(
        self, client: TestClient, multiple_tasks: list[Task]
    ):
        """Valid reorder returns 200 OK."""
        task_ids = [t.id for t in multiple_tasks]
        # Reverse the order
        new_order = list(reversed(task_ids))

        response = client.put("/api/v1/tasks/reorder", json={"task_ids": new_order})

        assert response.status_code == 200

    def test_reorder_tasks_returns_updated_tasks(
        self, client: TestClient, multiple_tasks: list[Task]
    ):
        """Reorder returns array of updated tasks."""
        task_ids = [t.id for t in multiple_tasks]
        new_order = list(reversed(task_ids))

        response = client.put("/api/v1/tasks/reorder", json={"task_ids": new_order})
        data = response.json()

        assert isinstance(data, list)
        assert len(data) == 3

    def test_reorder_tasks_positions_sequential(
        self, client: TestClient, multiple_tasks: list[Task]
    ):
        """Positions are sequential (1, 2, 3...) after reorder."""
        task_ids = [t.id for t in multiple_tasks]
        new_order = list(reversed(task_ids))

        response = client.put("/api/v1/tasks/reorder", json={"task_ids": new_order})
        data = response.json()

        positions = [t["position"] for t in data]
        assert positions == [1, 2, 3]

    def test_reorder_tasks_order_matches_request(
        self, client: TestClient, multiple_tasks: list[Task]
    ):
        """Tasks returned in order matching request."""
        task_ids = [t.id for t in multiple_tasks]
        new_order = list(reversed(task_ids))

        response = client.put("/api/v1/tasks/reorder", json={"task_ids": new_order})
        data = response.json()

        returned_ids = [t["id"] for t in data]
        assert returned_ids == new_order

    def test_reorder_tasks_persists_order(
        self, client: TestClient, multiple_tasks: list[Task]
    ):
        """New order persists - GET returns tasks in new order."""
        task_ids = [t.id for t in multiple_tasks]
        new_order = list(reversed(task_ids))

        client.put("/api/v1/tasks/reorder", json={"task_ids": new_order})

        # Verify with GET
        response = client.get("/api/v1/tasks/")
        data = response.json()
        returned_ids = [t["id"] for t in data]
        assert returned_ids == new_order

    def test_reorder_tasks_missing_id_returns_400(
        self, client: TestClient, multiple_tasks: list[Task]
    ):
        """Missing task ID returns 400 Bad Request."""
        task_ids = [t.id for t in multiple_tasks]
        # Add a fake UUID
        fake_id = str(uuid.uuid4())
        invalid_order = task_ids[:-1] + [fake_id]

        response = client.put("/api/v1/tasks/reorder", json={"task_ids": invalid_order})

        assert response.status_code == 400

    def test_reorder_tasks_duplicate_ids_returns_400(
        self, client: TestClient, multiple_tasks: list[Task]
    ):
        """Duplicate IDs return 400 Bad Request."""
        task_ids = [t.id for t in multiple_tasks]
        # Duplicate first ID
        duplicate_order = [task_ids[0], task_ids[0], task_ids[2]]

        response = client.put(
            "/api/v1/tasks/reorder", json={"task_ids": duplicate_order}
        )

        assert response.status_code == 400

    def test_reorder_tasks_partial_list_returns_400(
        self, client: TestClient, multiple_tasks: list[Task]
    ):
        """Partial task list (not all tasks) returns 400 Bad Request."""
        task_ids = [t.id for t in multiple_tasks]
        # Only include 2 of 3 tasks
        partial_order = task_ids[:2]

        response = client.put("/api/v1/tasks/reorder", json={"task_ids": partial_order})

        assert response.status_code == 400

    def test_reorder_tasks_empty_list_returns_422(self, client: TestClient):
        """Empty task_ids array returns 422 Unprocessable Entity."""
        response = client.put("/api/v1/tasks/reorder", json={"task_ids": []})

        assert response.status_code == 422

    def test_reorder_tasks_invalid_format_returns_422(self, client: TestClient):
        """Invalid request format returns 422."""
        response = client.put("/api/v1/tasks/reorder", json={"wrong_field": []})

        assert response.status_code == 422

    def test_reorder_single_task_succeeds(self, client: TestClient, sample_task: Task):
        """Single task in list can be reordered (no-op but valid)."""
        response = client.put(
            "/api/v1/tasks/reorder", json={"task_ids": [sample_task.id]}
        )

        assert response.status_code == 200


class TestHealthCheck:
    """Tests for health check endpoint."""

    def test_health_check_returns_200(self, client: TestClient):
        """Health endpoint returns 200."""
        response = client.get("/health")

        assert response.status_code == 200

    def test_health_check_returns_status(self, client: TestClient):
        """Health endpoint returns status healthy."""
        response = client.get("/health")

        assert response.json() == {"status": "healthy"}
