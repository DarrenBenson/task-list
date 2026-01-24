# EP0005: Task Deadlines

> **Status:** Complete
> **Owner:** Development Team
> **Created:** 2026-01-23
> **Target Release:** 1.1

## Summary

Enable users to set optional deadlines on tasks and provide visual highlighting when tasks are overdue. This helps users track time-sensitive work and prioritise accordingly.

## Inherited Constraints

Constraints that flow from PRD and TRD to this Epic.

### From PRD

| Type | Constraint | Impact on Epic |
|------|------------|----------------|
| Performance | API response <500ms | Deadline field adds minimal overhead |
| Security | Input validation on client and server | Deadline dates must be validated |
| Scalability | Support up to 1000 tasks | No impact - field per task |
| Constraint | Single-user, no auth | No impact |

### From TRD

| Type | Constraint | Impact on Epic |
|------|------------|----------------|
| Architecture | Monolith (FastAPI + React) | Standard feature addition |
| Tech Stack | Python/FastAPI + React/Vite | Use native date handling |
| Data Model | SQLite, SQLAlchemy ORM | Add nullable deadline column |

> **Note:** Inherited constraints MUST propagate to child Stories. Check Story templates include these constraints.

## Business Context

### Problem Statement

Users cannot currently track time-sensitive tasks. Tasks with upcoming deadlines appear the same as tasks without urgency, making it difficult to prioritise time-sensitive work.

**PRD Reference:** New feature (FR-008)

### Value Proposition

Users can set deadlines on tasks and immediately see which tasks are overdue, helping them focus on urgent work first.

### Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| Deadline usage | N/A | 30% of tasks have deadlines | Database query |
| Overdue visibility | N/A | Overdue tasks visible within 1s of page load | E2E test |

## Scope

### In Scope

- Add optional deadline field to tasks (date and time)
- Datetime picker UI for setting/editing deadline
- Visual indicator (badge/icon) for overdue tasks
- API support for deadline CRUD operations
- Overdue calculation based on current datetime

### Out of Scope

- Deadline reminders/notifications
- Recurring deadlines
- Timezone handling (use browser local time)
- Deadline-based sorting/filtering

### Affected User Personas

- **Busy Parent Sam:** Can set deadlines for time-sensitive tasks like bill payments
- **Organised Ollie:** Can track appointment preparation deadlines

## Acceptance Criteria (Epic Level)

- [ ] User can set an optional deadline date and time when creating a task
- [ ] User can set/edit/remove deadline date and time when editing a task
- [ ] Tasks past their deadline display a red overdue badge/icon
- [ ] Deadline persists after page refresh
- [ ] Deadline field is optional (null allowed)

## Dependencies

### Blocked By

| Dependency | Type | Status | Owner | Notes |
|------------|------|--------|-------|-------|
| EP0001: Core Task Management | Epic | Complete | - | Task CRUD must exist |

### Blocking

| Item | Type | Impact |
|------|------|--------|
| None | - | - |

## Risks & Assumptions

### Assumptions

- Browser timezone is acceptable for deadline comparison
- Users understand "overdue" means the deadline datetime has passed
- Users will select appropriate times for their deadlines

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Timezone confusion | Low | Low | Document that deadlines use browser local time |
| Datetime picker accessibility | Medium | Medium | Use native HTML datetime-local input for accessibility |
| Users forget to set time | Low | Low | Default to end of day if only date selected (browser behaviour) |

## Technical Considerations

### Architecture Impact

Minimal - adds a nullable DATETIME column to the Task model and a datetime picker component.

### Integration Points

- Task API endpoints (create, update, get)
- Task list and detail UI components
- Database schema (migration required)

### Data Considerations

- `deadline` field: nullable DATETIME type
- Store as ISO 8601 datetime string (YYYY-MM-DDTHH:MM:SS)
- Comparison logic in frontend using browser local time

## Sizing & Effort

**Story Points:** 5

**Estimated Story Count:** 1

**Complexity Factors:**

- Datetime picker integration
- Overdue calculation logic (datetime comparison)
- Visual design for overdue indicator
- Datetime formatting for display

## Stakeholders

| Role | Name | Interest |
|------|------|----------|
| User | All personas | Core functionality improvement |

## Story Breakdown

- [x] [US0012: Set Task Deadline](../stories/US0012-set-task-deadline.md)

## Test Plan

**Test Spec:** TS0012-task-deadlines.md (to be created)

| Test Suite | Type | Cases | Status |
|------------|------|-------|--------|
| Backend deadline tests | API | TBD | Pending |
| E2E deadline tests | E2E | TBD | Pending |

## Open Questions

None - requirements clarified.

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial epic created |
| 2026-01-23 | User | Added time-of-day support (datetime instead of date only) |
