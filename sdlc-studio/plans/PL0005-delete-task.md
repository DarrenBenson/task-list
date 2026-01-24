# PL0005: Delete Task - Implementation Plan

> **Status:** Complete
> **Story:** [US0005: Delete Task](../stories/US0005-delete-task.md)
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Created:** 2026-01-23
> **Language:** Python (backend), JavaScript (frontend)

## Overview

Implement task deletion with confirmation. Users can delete tasks from the list or detail view with a confirmation dialog to prevent accidental deletion.

## Acceptance Criteria Summary

| AC | Name | Description |
|----|------|-------------|
| AC1 | Delete option accessible | Delete button visible on task items |
| AC2 | Confirmation required | Dialog shows task title, warning, confirm/cancel |
| AC3 | Confirmed deletion | DELETE API, 204 response, task removed |
| AC4 | Cancelled deletion | Dialog closes, task remains |
| AC5 | Delete from detail view | Delete works from modal, returns to list |

## Implementation Steps

### Phase 1: Backend API

**Goal:** Add DELETE endpoint

#### Step 1.1: Add DELETE /{task_id} endpoint

- [x] Return 204 No Content on success
- [x] Return 404 if not found

**Files modified:**
- `backend/app/routers/tasks.py` - Added delete_task function

### Phase 2: Frontend Delete Confirmation

**Goal:** Create confirmation dialog and integrate delete

#### Step 2.1: Create ConfirmDialog component

- [x] Modal with backdrop
- [x] Title and message props
- [x] Confirm and Cancel buttons
- [x] Confirm button styled as destructive (red)
- [x] Cancel focused by default
- [x] Escape key dismisses

**Files created:**
- `frontend/src/components/ConfirmDialog.jsx`

#### Step 2.2: Add delete to TaskDetail

- [x] Delete button in view mode footer
- [x] Show confirmation dialog on click
- [x] Call DELETE API on confirm
- [x] Close modal and notify parent on success
- [x] Handle errors

**Files modified:**
- `frontend/src/components/TaskDetail.jsx`

#### Step 2.3: Update App to handle deletion

- [x] Add onTaskDeleted handler
- [x] Remove task from state
- [x] Close detail modal after delete

**Files modified:**
- `frontend/src/App.jsx`

### Phase 3: Verification

| AC | Verification Method | Status |
|----|---------------------|--------|
| AC1 | Delete button visible in detail view | ✅ Verified |
| AC2 | Confirmation shows title, warning, buttons | ✅ Verified |
| AC3 | Confirm removes task from DB and list | ✅ Verified |
| AC4 | Cancel closes dialog, task remains | ✅ Verified |
| AC5 | Delete from detail returns to list | ✅ Verified |

## Edge Case Handling

| # | Edge Case | Handling | Validated |
|---|-----------|----------|-----------|
| 1 | Task not found (already deleted) | 404 returned, parent notified | [x] |
| 2 | Network failure on delete | Error shown, task remains | [x] |
| 3 | Delete last task | Empty state appears | [x] |
| 4 | Press Escape during confirmation | Dismiss dialog | [x] |
| 5 | Double-click confirm | Button disabled during request | [x] |

## Definition of Done Checklist

- [x] All acceptance criteria implemented
- [x] Edge cases handled
- [x] Code follows best practices
- [x] Ready for code review

## Notes

- Delete button positioned on left of footer for visual separation from Close/Edit
- Confirmation dialog appears over task detail modal
- Task removed from list immediately on successful delete
