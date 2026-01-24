# PL0012: Set Task Deadline - Implementation Plan

> **Story:** [US0012: Set Task Deadline](../stories/US0012-set-task-deadline.md)
> **Status:** Complete
> **Approach:** TDD (API story with clear AC, 10+ edge cases)
> **Created:** 2026-01-23

## Overview

Add optional deadline datetime field to tasks with visual overdue highlighting. This involves backend model/schema changes, API updates, database migration, and frontend datetime picker with overdue badge display.

## Implementation Phases

### Phase 1: Backend Model & Schema (AC1, AC2, AC3)

**Files to modify:**
- `backend/app/models.py` - Add `deadline` column
- `backend/app/schemas.py` - Add `deadline` to all schemas

**Changes:**

1. **models.py** - Add nullable DateTime column:
   ```python
   deadline: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
   ```

2. **schemas.py** - Add deadline to all task schemas:
   ```python
   # TaskCreate
   deadline: Optional[datetime] = None

   # TaskUpdate
   deadline: Optional[datetime] = None

   # TaskResponse
   deadline: Optional[datetime]
   ```

**Edge cases addressed:**
- Create task with no deadline - `deadline: null`
- Create task with past deadline - accepted, shows as overdue
- Empty string for deadline - treated as null

**AC coverage:** AC1 (create with deadline), AC2 (edit deadline), AC3 (remove deadline)

---

### Phase 2: Database Migration (AC8)

**Approach:** SQLite allows adding nullable columns without data migration issues.

**Migration command:**
```sql
ALTER TABLE tasks ADD COLUMN deadline DATETIME;
```

**Implementation:** Use Alembic or direct SQL execution in database initialisation.

**Note:** Existing tasks will have `deadline = NULL` (no deadline).

**AC coverage:** AC8 (deadline persists after refresh)

---

### Phase 3: API Router Updates (AC1, AC2, AC3)

**Files to modify:**
- `backend/app/routers/tasks.py` - Include deadline in create/update

**Changes:**

The existing `create_task` and `update_task` endpoints already handle all schema fields via `model_dump()`. Adding `deadline` to schemas automatically includes it in:
- POST /api/v1/tasks - Create with optional deadline
- PATCH /api/v1/tasks/{id} - Update deadline
- GET /api/v1/tasks - Return deadline in response
- GET /api/v1/tasks/{id} - Return deadline in response

**No router code changes required** - Pydantic schemas handle serialisation.

**Edge cases addressed:**
- Invalid datetime format - 422 Unprocessable Entity (Pydantic validation)
- Clearing deadline via PATCH - set to `null`

**AC coverage:** AC1, AC2, AC3

---

### Phase 4: Frontend API Service (AC1, AC2, AC3)

**Files to modify:**
- `frontend/src/components/TaskForm.jsx` - Add deadline input
- `frontend/src/components/TaskDetail.jsx` - Add deadline display/edit

**TaskForm changes:**
1. Add state: `const [deadline, setDeadline] = useState("")`
2. Add datetime-local input below description
3. Include deadline in POST payload (convert empty to null)

**TaskDetail changes:**
1. Add `editDeadline` state
2. Display deadline in view mode (formatted)
3. Add datetime-local input in edit mode
4. Include deadline in PATCH payload

**AC coverage:** AC1, AC2, AC3

---

### Phase 5: Datetime Picker UI (AC1, AC2)

**UI Requirements from story:**
- Label: "Deadline (optional)"
- Position: Below description field
- Input type: HTML5 `datetime-local`
- Empty by default

**TaskForm input:**
```jsx
<div className="form-group">
  <label htmlFor="deadline">Deadline (optional)</label>
  <input
    id="deadline"
    type="datetime-local"
    value={deadline}
    onChange={(e) => setDeadline(e.target.value)}
    disabled={isSubmitting}
  />
</div>
```

**TaskDetail edit mode:**
- Pre-populate with current deadline (ISO format for datetime-local)
- Clear button to remove deadline

**AC coverage:** AC1, AC2

---

### Phase 6: Deadline Display in Task List (AC4, AC5, AC6, AC7)

**Files to modify:**
- `frontend/src/components/SortableTaskItem.jsx` - Add deadline display + overdue badge

**Changes:**

1. **Display deadline datetime:**
   - Format: "Due: 25 Jan 17:00" (compact)
   - Only show if deadline is set

2. **Overdue logic:**
   ```javascript
   const isOverdue = task.deadline && new Date(task.deadline) < new Date();
   ```

3. **Overdue badge:**
   - Red colour (#dc2626)
   - Icon: warning/exclamation
   - Tooltip: "Overdue"
   - Only show when `isOverdue` is true

**Datetime formatting helper:**
```javascript
function formatDeadline(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

**AC coverage:** AC4 (overdue badge), AC5 (not overdue), AC6 (becomes overdue), AC7 (future deadline)

---

### Phase 7: Deadline Display in Task Detail (AC7)

**Files to modify:**
- `frontend/src/components/TaskDetail.jsx` - Add deadline field in detail view

**View mode display:**
```jsx
<div className="detail-field">
  <label>Deadline</label>
  <p className="detail-value">
    {task.deadline
      ? formatDeadlineFull(task.deadline)
      : <em>No deadline</em>}
  </p>
</div>
```

**Full format:** "25 January 2026 at 17:00"

```javascript
function formatDeadlineFull(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

**AC coverage:** AC7 (full datetime display)

---

### Phase 8: CSS Styles for Overdue Badge

**File to modify:**
- `frontend/src/App.jsx` - Add overdue badge styles

**Styles to add:**
```css
/* Overdue Badge */
.overdue-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  background: rgba(220, 38, 38, 0.15);
  border: 1px solid #dc2626;
  border-radius: var(--radius-sm);
  color: #dc2626;
  font-size: 11px;
  font-weight: 500;
}

.overdue-badge::before {
  content: '⚠';
}

/* Deadline display */
.task-deadline {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: var(--space-1);
}
```

---

## Edge Case Handling

| Edge Case | Handling |
|-----------|----------|
| Create task with no deadline | `deadline: null` in payload, no deadline shown |
| Create task with past deadline | Accept, immediately shows overdue badge |
| Edit task to remove deadline | Set `deadline: null`, overdue indicator removed |
| Invalid datetime format | 422 from Pydantic validation |
| Deadline 1 minute in future | Not overdue |
| Deadline 1 minute in past | Shows as overdue |
| Completed but overdue task | Still shows overdue badge |
| Invalid datetime (2026-02-30) | 422 validation error from Pydantic |
| Empty string for deadline | Treated as null |
| Deadline at exact current time | Shows as overdue (deadline passed) |

## Test Plan

### Backend Tests (pytest)

| Test | AC |
|------|-----|
| Create task with deadline returns 201 | AC1 |
| Create task deadline matches input | AC1 |
| Create task without deadline has null | AC1 |
| Update task to add deadline | AC2 |
| Update task to change deadline | AC2 |
| Update task to remove deadline (null) | AC3 |
| Invalid datetime format returns 422 | Edge |
| Get task returns deadline field | AC7, AC8 |
| List tasks returns deadline field | AC4-AC7 |

### Frontend E2E Tests (Playwright)

| Test | AC |
|------|-----|
| Create task with deadline via form | AC1 |
| Create task without deadline | AC1 |
| Edit task to add deadline | AC2 |
| Edit task to remove deadline | AC3 |
| Overdue task shows red badge | AC4 |
| Task before deadline time is not overdue | AC5 |
| Future deadline shows normally | AC7 |
| Deadline persists after refresh | AC8 |

## Dependencies

- **US0002** (Create Task) - Done
- **US0004** (View/Edit Task) - Done

## Library Documentation Consulted

- FastAPI: Optional datetime fields with Pydantic
- SQLAlchemy: DateTime nullable column with mapped_column
- HTML5: datetime-local input type

## Implementation Order

1. Backend model + schema (Phase 1)
2. Database migration (Phase 2) - implicit with SQLite
3. Write backend tests
4. Verify backend tests pass
5. Frontend TaskForm deadline input (Phase 4, 5)
6. Frontend TaskDetail deadline display/edit (Phase 4, 7)
7. Frontend SortableTaskItem overdue badge (Phase 6)
8. CSS styles (Phase 8)
9. Write E2E tests
10. Verify all tests pass
11. Manual verification

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial plan created |
