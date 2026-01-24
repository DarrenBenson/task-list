# PL0002: Create Task - Implementation Plan

> **Status:** Complete
> **Story:** [US0002: Create Task](../stories/US0002-create-task.md)
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Created:** 2026-01-23
> **Language:** Python (backend), JavaScript (frontend)

## Overview

Implement task creation functionality with a POST /api/v1/tasks endpoint and a React form component. Users can quickly capture tasks with a title (required) and optional description. The implementation prioritises speed for Busy Parent Sam who needs to capture tasks in under 5 seconds.

## Acceptance Criteria Summary

| AC | Name | Description |
|----|------|-------------|
| AC1 | Form accessible | Task creation form with title, description, submit |
| AC2 | Valid task created | POST returns 201 with UUID, timestamps, position |
| AC3 | Task with description | Both title and description stored |
| AC4 | Title validation | Empty title shows error, form not submitted |
| AC5 | Character limits | 200 char title limit, 2000 char description limit |

## Technical Context

### Language & Framework

- **Primary Language:** Python 3.10+ (backend), JavaScript ES2020+ (frontend)
- **Framework:** FastAPI (backend), React 18 (frontend)
- **Test Framework:** pytest (backend)

### Relevant Best Practices

From `~/.claude/best-practices/python.md`:
- Type hints on all functions
- Specific exception handling
- Context managers for resources

### Library Documentation (Context7)

| Library | Context7 ID | Query | Key Patterns |
|---------|-------------|-------|--------------|
| FastAPI | /fastapi/fastapi | POST endpoint status_code 201 | `@router.post("/", status_code=status.HTTP_201_CREATED, response_model=Model)` |
| SQLAlchemy | /sqlalchemy/sqlalchemy | Session query max | `db.query(func.max(Model.field))` |

### Existing Patterns

- Task model in `models.py` with UUID id, timestamps
- TaskCreate/TaskResponse schemas in `schemas.py`
- FastAPI app in `main.py` with CORS configured
- API service in `frontend/src/services/api.js`

## Recommended Approach

**Strategy:** Test-After
**Rationale:** Clear API contract defined in story. Standard CRUD operation with well-documented edge cases. Can verify manually with Swagger UI and curl before writing tests.

### Test Priority

1. POST /api/v1/tasks returns 201 with valid data
2. Empty/whitespace title returns 422
3. Character limits enforced

### Documentation Updates Required

- [ ] None required for this story

## Implementation Steps

### Phase 1: Backend API

**Goal:** Create POST /api/v1/tasks endpoint

#### Step 1.1: Update schemas for whitespace validation

- [x] Add validator to reject whitespace-only titles
- [x] Ensure error message matches AC4

**Files to modify:**
- `backend/app/schemas.py` - Add field_validator for title

#### Step 1.2: Create tasks router

- [x] Create `backend/app/routers/tasks.py`
- [x] Implement POST endpoint with position calculation
- [x] Return 201 with TaskResponse

**Files to create:**
- `backend/app/routers/tasks.py` - Tasks API router

**Considerations:**
- Calculate position as MAX(position) + 1 or 1 if no tasks
- Use SQLAlchemy func.coalesce for null handling

#### Step 1.3: Register router in main.py

- [x] Import and include tasks router
- [x] Verify /docs shows new endpoint

**Files to modify:**
- `backend/app/main.py` - Include router

### Phase 2: Frontend Form

**Goal:** Create task creation form component

#### Step 2.1: Create TaskForm component

- [x] Create component with title input, description textarea
- [x] Auto-focus title field
- [x] Client-side validation
- [x] Loading state during submit
- [x] Error display

**Files to create:**
- `frontend/src/components/TaskForm.jsx` - Form component

#### Step 2.2: Update App component

- [x] Import and render TaskForm
- [x] Manage tasks state
- [x] Handle onTaskCreated callback

**Files to modify:**
- `frontend/src/App.jsx` - Integrate TaskForm

#### Step 2.3: Update API service

- [x] Implement createTask function properly
- [x] Handle validation errors from API

**Files to modify:**
- `frontend/src/services/api.js` - Update createTask

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria are met

#### Step 3.1: Manual API Testing

- [x] Test POST with valid data via curl
- [x] Test POST with empty title
- [x] Test POST with whitespace title
- [x] Test character limits

#### Step 3.2: Manual UI Testing

- [x] Test form submission
- [x] Test error messages
- [x] Test form clearing

#### Step 3.3: Acceptance Criteria Verification

| AC | Verification Method | Status |
|----|---------------------|--------|
| AC1 | UI inspection | ✅ Verified |
| AC2 | POST via curl/Swagger | ✅ Verified |
| AC3 | POST with description | ✅ Verified |
| AC4 | Submit empty form | ✅ Verified |
| AC5 | Submit 201 char title | ✅ Verified |

## Edge Case Handling Plan

Every edge case from the Story MUST appear here with an explicit handling strategy.

### Edge Case Coverage

| # | Edge Case (from Story) | Handling Strategy | Implementation Phase | Validated |
|---|------------------------|-------------------|---------------------|-----------|
| 1 | Empty title submitted | Pydantic min_length=1 returns 422 | Phase 1, Step 1.1 | [x] |
| 2 | Whitespace-only title | Custom validator returns 422 | Phase 1, Step 1.1 | [x] |
| 3 | Title exactly 200 chars | Accepted by Pydantic max_length=200 | Phase 1, Step 1.1 | [x] |
| 4 | Title 201 chars | Pydantic max_length returns 422 | Phase 1, Step 1.1 | [x] |
| 5 | Description exactly 2000 chars | Accepted by Pydantic max_length=2000 | Phase 1, Step 1.1 | [x] |
| 6 | Description 2001 chars | Pydantic max_length returns 422 | Phase 1, Step 1.1 | [x] |
| 7 | Network failure during submit | Frontend shows error, preserves form | Phase 2, Step 2.1 | [x] |
| 8 | Server returns 500 | Frontend shows generic error, preserves form | Phase 2, Step 2.1 | [x] |
| 9 | Concurrent task creation | SQLAlchemy handles; retry on position conflict | Phase 1, Step 1.2 | [x] |
| 10 | Title with special characters | Accepted by Pydantic (no restriction) | Phase 1, Step 1.1 | [x] |
| 11 | Title with HTML/script tags | Stored as-is, React auto-escapes on render | Phase 2, Step 2.2 | [x] |

### Coverage Summary

- Story edge cases: 11
- Handled in plan: 11
- Unhandled: 0

### Edge Case Implementation Notes

- Edge cases 1-6 handled by Pydantic validation in schemas.py
- Edge cases 7-8 handled by frontend error handling with try/catch
- Edge case 9: Position calculation uses MAX() which handles concurrent inserts; unique constraint will catch race conditions
- Edge cases 10-11: No special handling needed; Pydantic accepts strings, React escapes output

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Position race condition | Low | Unique constraint + retry logic |
| Validation message mismatch | Low | Test exact messages in acceptance tests |

## Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| US0001 | Story | Task model and schemas (Complete) |
| SQLAlchemy func | Library | For MAX() query |

## Open Questions

None - all requirements clear from story.

## Definition of Done Checklist

- [x] All acceptance criteria implemented
- [ ] Unit tests written and passing
- [x] Edge cases handled
- [x] Code follows best practices
- [ ] No linting errors
- [x] Documentation updated (if needed)
- [x] Ready for code review

## Notes

Position is auto-assigned to end of list. Keyboard shortcuts and position selection are out of scope for this story.
