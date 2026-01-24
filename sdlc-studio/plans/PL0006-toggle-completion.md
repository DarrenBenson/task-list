# PL0006: Toggle Task Completion - Implementation Plan

> **Status:** Complete
> **Story:** [US0006: Toggle Task Completion](../stories/US0006-toggle-completion.md)
> **Epic:** [EP0002: Task Organisation](../epics/EP0002-task-organisation.md)
> **Created:** 2026-01-23
> **Language:** JavaScript (frontend only)

## Overview

Add clickable checkbox to toggle task completion status. Uses existing PATCH endpoint with optimistic UI updates.

## Acceptance Criteria Summary

| AC | Name | Description |
|----|------|-------------|
| AC1 | Checkbox clickable | Click checkbox without opening modal |
| AC2 | Immediate update | Optimistic UI update on click |
| AC3 | Visual distinction | Completed tasks show strikethrough |
| AC4 | Status persists | Completion saved to database |
| AC5 | Toggle both ways | Can complete and uncomplete |

## Implementation Steps

### Phase 1: Frontend Implementation

**Goal:** Make checkbox clickable with optimistic updates

#### Step 1.1: Update TaskList component

- [x] Add onToggleComplete prop
- [x] Wrap checkbox in button element
- [x] Stop event propagation on checkbox click
- [x] Add keyboard accessibility

**Files modified:**
- `frontend/src/components/TaskList.jsx`

#### Step 1.2: Update App component

- [x] Add handleToggleComplete function
- [x] Implement optimistic UI update
- [x] Call PATCH API
- [x] Revert on error
- [x] Pass handler to TaskList

**Files modified:**
- `frontend/src/App.jsx`

#### Step 1.3: Add checkbox button styles

- [x] Style checkbox button (no background, hover state)
- [x] Add focus styles for accessibility

**Files modified:**
- `frontend/src/App.jsx` (CSS)

### Phase 2: Verification

| AC | Verification Method | Status |
|----|---------------------|--------|
| AC1 | Click checkbox, modal stays closed | ✅ Verified |
| AC2 | Checkbox toggles immediately | ✅ Verified |
| AC3 | Strikethrough on complete | ✅ Verified |
| AC4 | Refresh shows saved state | ✅ Verified |
| AC5 | Can toggle back to incomplete | ✅ Verified |

## Edge Case Handling

| # | Edge Case | Handling | Validated |
|---|-----------|----------|-----------|
| 1 | Network failure | Revert to previous state | [x] |
| 2 | Task not found | API returns 404 | [x] |
| 3 | Rapid clicking | Optimistic UI handles gracefully | [x] |

## Definition of Done Checklist

- [x] All acceptance criteria implemented
- [x] Edge cases handled
- [x] Code follows best practices
- [x] Ready for code review

## Notes

- No backend changes required - uses existing PATCH endpoint
- Checkbox button uses negative margin to expand hit area
- Optimistic UI provides instant feedback
