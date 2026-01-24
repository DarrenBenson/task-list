"""
API and Integration Tests for Task Organisation
Generated from TS0002: Task Organisation

Traceability:
- Epic: EP0002
- Stories: US0006, US0007
"""

from fastapi.testclient import TestClient

from app.models import Task


class TestTaskOrganisationAPI:
    """
    API and Integration tests for TS0002: Task Organisation

    Stories covered:
    - US0006: Toggle Task Completion
    - US0007: Reorder Tasks
    """

    def test_tc0002_2_persistent_completion_status(self, client: TestClient, sample_task: Task):
        """
        TC0002-2: Persistent Completion Status (API)

        Story: US0006
        Priority: High
        Type: API
        """
        # Given: a task ID
        task_id = sample_task.id

        # When: PATCH /api/v1/tasks/{id} with {"is_complete": true}
        response = client.patch(f"/api/v1/tasks/{task_id}", json={"is_complete": True})

        # Then: API returns 200 OK
        assert response.status_code == 200
        data = response.json()
        assert data["is_complete"] is True

        # And: GET /api/v1/tasks/{id} returns is_complete: true
        get_response = client.get(f"/api/v1/tasks/{task_id}")
        assert get_response.status_code == 200
        assert get_response.json()["is_complete"] is True

    def test_tc0002_5_bulk_reorder_api_contract(self, client: TestClient, multiple_tasks: list[Task]):
        """
        TC0002-5: Bulk Reorder API Contract (API)

        Story: US0007
        Priority: High
        Type: API
        """
        # Given: task IDs [ID1, ID2, ID3]
        task_ids = [t.id for t in multiple_tasks]
        reordered_ids = [task_ids[1], task_ids[2], task_ids[0]]

        # When: PUT /api/v1/tasks/reorder with { "task_ids": [ID2, ID3, ID1] }
        response = client.put("/api/v1/tasks/reorder", json={"task_ids": reordered_ids})

        # Then: API returns 200 OK
        assert response.status_code == 200
        data = response.json()

        # And: response body contains all tasks
        assert isinstance(data, list)
        assert len(data) == 3

        # And: tasks in response have positions [1, 2, 3]
        positions = [t["position"] for t in data]
        assert positions == [1, 2, 3]
        
        # And: order matches request
        returned_ids = [t["id"] for t in data]
        assert returned_ids == reordered_ids

    def test_tc0002_4_persistent_task_order(self, client: TestClient, multiple_tasks: list[Task]):
        """
        TC0002-4: Persistent Task Order (Integration)

        Story: US0007
        Priority: High
        Type: Integration
        """
        # Given: multiple tasks with positions
        task_ids = [t.id for t in multiple_tasks]
        reordered_ids = [task_ids[2], task_ids[0], task_ids[1]]

        # When: reordering via API
        client.put("/api/v1/tasks/reorder", json={"task_ids": reordered_ids})

        # Then: GET /api/v1/tasks/ returns tasks in new order
        response = client.get("/api/v1/tasks/")
        assert response.status_code == 200
        data = response.json()
        
        returned_ids = [t["id"] for t in data]
        assert returned_ids == reordered_ids

        # And: position values are sequential
        positions = [t["position"] for t in data]
        assert positions == [1, 2, 3]
