"""Tasks API router."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Task
from ..schemas import ReorderRequest, TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])

# Explicit allowlist of fields that can be updated via PATCH
UPDATABLE_FIELDS = {"title", "description", "is_complete", "position", "deadline"}


@router.get("/", response_model=List[TaskResponse])
def list_tasks(db: Session = Depends(get_db)) -> List[Task]:
    """Get all tasks ordered by position.

    Returns tasks sorted by position ascending.
    """
    return db.query(Task).order_by(Task.position.asc()).all()


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: str, db: Session = Depends(get_db)) -> Task:
    """Get a single task by ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TaskResponse)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db)) -> Task:
    """Create a new task.

    The task is assigned the next available position (appended to end of list).
    Handles race conditions on concurrent inserts with retry logic.
    """
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Calculate next position
            max_position = db.query(func.max(Task.position)).scalar()
            next_position = (max_position or 0) + 1

            # Create task
            task = Task(
                title=task_data.title,
                description=task_data.description,
                deadline=task_data.deadline,
                position=next_position,
            )
            db.add(task)
            db.commit()
            db.refresh(task)

            return task
        except IntegrityError:
            db.rollback()
            if attempt == max_retries - 1:
                raise HTTPException(
                    status_code=409,
                    detail="Conflict: unable to assign position. Please retry.",
                )
            # Retry with recalculated position
            continue

    # Should not reach here, but satisfy type checker
    raise HTTPException(status_code=500, detail="Unexpected error creating task")


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: str, task_data: TaskUpdate, db: Session = Depends(get_db)
) -> Task:
    """Update an existing task.

    Only provided fields are updated (partial update).
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update only provided fields (restricted to allowlist)
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field in UPDATABLE_FIELDS:
            setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: Session = Depends(get_db)) -> None:
    """Delete a task by ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()


@router.put("/reorder", response_model=List[TaskResponse])
def reorder_tasks(
    reorder_data: ReorderRequest, db: Session = Depends(get_db)
) -> List[Task]:
    """Reorder tasks by providing the new order of task IDs.

    All task IDs must be provided in the desired order.
    Positions will be recalculated to be sequential (1, 2, 3, ...).
    """
    task_ids = reorder_data.task_ids

    # Check for duplicates
    if len(task_ids) != len(set(task_ids)):
        raise HTTPException(status_code=400, detail="Duplicate task IDs provided")

    # Get total task count
    total_tasks = db.query(func.count(Task.id)).scalar()

    # Check that all tasks are included
    if len(task_ids) != total_tasks:
        raise HTTPException(
            status_code=400,
            detail="All tasks must be included in reorder request",
        )

    # Fetch all tasks by IDs with row-level locking to prevent concurrent modifications
    tasks = db.query(Task).filter(Task.id.in_(task_ids)).with_for_update().all()

    # Verify all IDs exist
    if len(tasks) != len(task_ids):
        raise HTTPException(status_code=400, detail="One or more task IDs not found")

    # Create ID to task mapping
    task_map = {task.id: task for task in tasks}

    # Two-pass position update to avoid UNIQUE constraint violation:
    # Pass 1: Set all positions to negative values (temporary)
    for position, task_id in enumerate(task_ids, start=1):
        task_map[task_id].position = -position
    db.flush()

    # Pass 2: Set to final positive positions
    for position, task_id in enumerate(task_ids, start=1):
        task_map[task_id].position = position

    db.commit()

    # Return tasks in new order
    result = [task_map[task_id] for task_id in task_ids]
    for task in result:
        db.refresh(task)

    return result
