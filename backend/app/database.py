"""Database configuration and session management."""

import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Database URL from environment or default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")

# Create engine with connection pool settings
engine_args = {
    "pool_pre_ping": True,  # Verify connection before use
}

# SQLite-specific settings
if "sqlite" in DATABASE_URL:
    engine_args["connect_args"] = {"check_same_thread": False}
else:
    # PostgreSQL/MySQL pool settings
    engine_args["pool_size"] = 10
    engine_args["max_overflow"] = 20

engine = create_engine(DATABASE_URL, **engine_args)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all ORM models."""

    pass


def get_db() -> Generator[Session, None, None]:
    """Dependency that provides a database session.

    Yields a session and ensures it's closed after use.
    Rollback is called on cleanup to ensure clean state.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.rollback()
        db.close()
