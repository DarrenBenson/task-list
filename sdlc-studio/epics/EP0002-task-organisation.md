# EP0002: Task Organisation

> **Status:** Complete
> **Owner:** Unassigned
> **Created:** 2026-01-23
> **Target Release:** 1.0

## Summary

Enable users to organise their tasks through completion tracking and drag-and-drop reordering. This epic transforms a simple list into a productivity tool where Organised Ollie can arrange tasks by priority and Busy Parent Sam can experience satisfaction by marking tasks complete.

## Inherited Constraints

Constraints that flow from PRD and TRD to this Epic.

### From PRD

| Type | Constraint | Impact on Epic |
|------|------------|----------------|
| Performance | Drag-and-drop feels instantaneous | Optimistic UI updates required |
| Performance | API responds within 500ms | Reorder operation must be fast |
| UX | Visual feedback during drag | Drop target indication needed |
| Data | Positions must be unique integers | Recalculation on reorder |

### From TRD

| Type | Constraint | Impact on Epic |
|------|------------|----------------|
| Architecture | Monolith pattern | Single API for all operations |
| Tech Stack | React with @dnd-kit | Drag-and-drop library specified |
| Data Model | Position field on Task entity | Ordering via position values |

> **Note:** Inherited constraints MUST propagate to child Stories. Check Story templates include these constraints.

## Business Context

### Problem Statement

A flat, unordered list is not useful for personal productivity. Users need to prioritise tasks and track progress. Organised Ollie specifically wants manual control over task order, not algorithmic sorting.

**PRD Reference:** [FR-005, FR-006 - Feature Details](../prd.md#3-feature-inventory)

### Value Proposition

Task completion provides psychological reward and progress tracking. Task reordering enables prioritisation without complex priority systems. Together, they transform a list into a productivity system.

### Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| Reorder persistence | N/A | 100% success | Automated tests |
| Completion toggle latency | N/A | < 100ms perceived | Manual testing |
| Drag operation smoothness | N/A | 60fps | Browser dev tools |

## Scope

### In Scope

- Toggle task completion status (single click/tap)
- Visual distinction for completed tasks (strikethrough, muted colour)
- Drag-and-drop task reordering
- Visual feedback during drag operation
- Position persistence after reorder
- Completed tasks stay in position (not moved or hidden)

### Out of Scope

- Automatic sorting (by date, priority, etc.)
- Hiding completed tasks
- Bulk completion operations
- Undo completion
- Completion statistics/history

### Affected User Personas

- **Busy Parent Sam:** Satisfaction from checking off tasks; needs single-tap completion
- **Organised Ollie:** Manual ordering is essential; tasks must stay where placed

## Acceptance Criteria (Epic Level)

- [x] User can toggle task completion with single click/tap
- [x] Completed tasks display with visual distinction
- [x] Completed tasks remain in their position
- [x] User can drag any task to a new position
- [x] Other tasks shift to accommodate the moved task
- [x] Drag operation shows visual drop target feedback
- [x] Reordered positions persist after page refresh
- [x] Completion status persists after page refresh

## Dependencies

### Blocked By

| Dependency | Type | Status | Owner | Notes |
|------------|------|--------|-------|-------|
| EP0001: Core Task Management | Epic | Complete | - | Tasks must exist before they can be organised |

### Blocking

| Item | Type | Impact |
|------|------|--------|
| None | - | Final epic in MVP scope |

## Risks & Assumptions

### Assumptions

- @dnd-kit library supports touch and mouse interactions
- Position recalculation is fast enough for 1,000 tasks
- Users understand drag-and-drop interaction pattern

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Drag-and-drop accessibility | Medium | Medium | Ensure keyboard alternative; test with screen readers |
| Position collision on rapid reorders | Low | Medium | Use optimistic UI with server reconciliation |
| Mobile touch handling issues | Medium | Medium | Test on multiple devices; ensure adequate touch targets |

## Technical Considerations

### Architecture Impact

Extends existing patterns:
- New PATCH endpoint for completion toggle
- New PUT endpoint for bulk position update
- React DnD context wrapping task list
- Optimistic UI state management

### Integration Points

- Frontend drag events → API reorder endpoint
- API position recalculation → Database update
- Optimistic UI → Server reconciliation

### Data Considerations

Position management:
- Positions are integers (1, 2, 3, ...)
- On reorder: recalculate all affected positions
- Bulk update endpoint to minimise API calls
- Handle concurrent updates (last write wins for single user)

## Sizing & Effort

**Story Points:** 8

**Estimated Story Count:** 2 stories

**Complexity Factors:**

- Drag-and-drop library integration
- Optimistic UI updates
- Position recalculation algorithm

## Stakeholders

| Role | Name | Interest |
|------|------|----------|
| End User | Busy Parent Sam | Quick completion toggle |
| End User | Organised Ollie | Manual task ordering |

## Story Breakdown

- [x] [US0006](../stories/US0006-toggle-completion.md): Toggle task completion status
- [x] [US0007](../stories/US0007-reorder-tasks.md): Reorder Tasks (drag-and-drop)

## Test Plan

**Test Plan:** Generated and validated

| Test Suite | Type | Cases | Status |
|------------|------|-------|--------|
| Backend unit tests | Unit | 79 | ✅ Passing |
| API tests | Integration | 12 | ✅ Passing |
| E2E reorder tests | E2E | 9 | ✅ Passing |
| E2E task list tests | E2E | 5 | ✅ Passing |

## Open Questions

From PRD (inherited):
- [x] Should drag handle be visible always or on hover only? - **Decision:** Always visible (better discoverability, mobile-friendly)

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial epic created from PRD |
| 2026-01-23 | Claude | Validated complete - all AC verified, tests passing |
