"""Integration tests for database and application startup.

Covers TS0001 test cases:
- TC001: Backend project structure exists
- TC003: Database initialises on startup
"""

from pathlib import Path

from sqlalchemy import inspect

from app.database import engine
from app.main import app


class TestProjectStructure:
    """TC001: Backend project structure exists."""

    def test_main_py_exists(self):
        """app/main.py exists and contains FastAPI instance."""
        path = Path(__file__).parent.parent / "app" / "main.py"
        assert path.exists()

        content = path.read_text()
        assert "FastAPI" in content
        assert "app = FastAPI" in content

    def test_database_py_exists(self):
        """app/database.py exists with session management."""
        path = Path(__file__).parent.parent / "app" / "database.py"
        assert path.exists()

        content = path.read_text()
        assert "get_db" in content
        assert "SessionLocal" in content

    def test_models_py_exists(self):
        """app/models.py exists with Task model."""
        path = Path(__file__).parent.parent / "app" / "models.py"
        assert path.exists()

        content = path.read_text()
        assert "class Task" in content
        assert "Base" in content

    def test_schemas_py_exists(self):
        """app/schemas.py exists with Pydantic schemas."""
        path = Path(__file__).parent.parent / "app" / "schemas.py"
        assert path.exists()

        content = path.read_text()
        assert "TaskCreate" in content
        assert "TaskResponse" in content
        assert "BaseModel" in content

    def test_tasks_router_exists(self):
        """app/routers/tasks.py exists."""
        path = Path(__file__).parent.parent / "app" / "routers" / "tasks.py"
        assert path.exists()

        content = path.read_text()
        assert "APIRouter" in content
        assert "router" in content


class TestDatabaseInitialisation:
    """TC003: Database initialises on startup."""

    def test_tables_created(self, db_session):
        """Tasks table exists with correct schema."""
        inspector = inspect(engine)
        tables = inspector.get_table_names()

        assert "tasks" in tables

    def test_tasks_table_has_required_columns(self, db_session):
        """Tasks table has all required columns."""
        inspector = inspect(engine)
        columns = {c["name"] for c in inspector.get_columns("tasks")}

        required_columns = {
            "id",
            "title",
            "description",
            "is_complete",
            "position",
            "created_at",
            "updated_at",
        }

        assert required_columns.issubset(columns)

    def test_id_is_primary_key(self, db_session):
        """id column is primary key."""
        inspector = inspect(engine)
        pk = inspector.get_pk_constraint("tasks")

        assert "id" in pk["constrained_columns"]


class TestAppConfiguration:
    """Tests for FastAPI app configuration."""

    def test_app_title(self):
        """App has correct title."""
        assert app.title == "Task Manager API"

    def test_app_version(self):
        """App has version set."""
        assert app.version == "0.1.0"

    def test_cors_middleware_configured(self):
        """CORS middleware is configured."""
        middleware_classes = [m.cls.__name__ for m in app.user_middleware]
        assert "CORSMiddleware" in middleware_classes

    def test_tasks_router_included(self):
        """Tasks router is included."""
        routes = [r.path for r in app.routes]
        assert "/api/v1/tasks/" in routes or any("/api/v1/tasks" in r for r in routes)
