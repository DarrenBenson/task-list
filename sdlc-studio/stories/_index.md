# User Story Registry

This file tracks all user stories in the project.

## EP0001: Core Task Management

| ID | Title | Status | Points | Dependencies |
|----|-------|--------|--------|--------------|
| [US0001](US0001-project-setup.md) | Project Setup and Database Foundation | Complete | 3 | None |
| [US0002](US0002-create-task.md) | Create Task | Complete | 3 | US0001 |
| [US0003](US0003-view-task-list.md) | View Task List | Complete | 2 | US0001, US0002 |
| [US0004](US0004-view-edit-task.md) | View and Edit Task Details | Complete | 3 | US0001, US0003 |
| [US0005](US0005-delete-task.md) | Delete Task | Complete | 2 | US0001, US0003, US0004 |

**Epic Total:** 13 story points | 5 stories | **All Complete**

## EP0002: Task Organisation

| ID | Title | Status | Points | Dependencies |
|----|-------|--------|--------|--------------|
| [US0006](US0006-toggle-completion.md) | Toggle Task Completion | Complete | 2 | US0003 |
| [US0007](US0007-reorder-tasks.md) | Reorder Tasks | Complete | 5 | US0003 |

**Epic Total:** 7 story points | 2 stories | **All Complete**

## EP0003: UX Improvements

| ID | Title | Status | Points | Dependencies |
|----|-------|--------|--------|--------------|
| [US0008](US0008-apply-design-system.md) | Apply Brand Guide Design System | Complete | 5 | US0003, US0004, US0007 |

**Epic Total:** 5 story points | 1 story | **All Complete**

## EP0004: Docker Containerisation

| ID | Title | Status | Points | Dependencies |
|----|-------|--------|--------|--------------|
| [US0009](US0009-backend-docker-config.md) | Create Docker Configuration for Backend | Done | 3 | None |
| [US0010](US0010-frontend-docker-config.md) | Create Docker Configuration for Frontend | Done | 3 | None |
| [US0011](US0011-docker-compose.md) | Create Docker Compose Orchestration | Done | 2 | US0009, US0010 |

**Epic Total:** 8 story points | 3 stories | **All Complete**

## EP0005: Task Deadlines

| ID | Title | Status | Points | Dependencies |
|----|-------|--------|--------|--------------|
| [US0012](US0012-set-task-deadline.md) | Set Task Deadline | Complete | 5 | US0002, US0004 |

**Epic Total:** 5 story points | 1 story | **All Complete**

## Summary

- **Total Stories:** 12
- **Complete:** 12
- **Ready:** 0
- **In Progress:** 0
- **Draft:** 0

## Dependency Graph

```
US0001 (Project Setup)
    │
    ├── US0002 (Create Task)
    │       │
    │       └── US0003 (View Task List)
    │               │
    │               ├── US0004 (View/Edit Task)
    │               │       │
    │               │       └── US0008 (Apply Design System) [EP0003]
    │               │
    │               ├── US0005 (Delete Task)
    │               │
    │               ├── US0006 (Toggle Completion) [EP0002]
    │               │
    │               └── US0007 (Reorder Tasks) [EP0002]
    │                       │
    │                       └── US0008 (Apply Design System) [EP0003]
    │
    │
EP0004 Docker Stories (independent of app stories):

US0009 (Backend Docker) ──┐
                          ├── US0011 (Docker Compose)
US0010 (Frontend Docker) ─┘
```

## PRD Feature Mapping

| PRD Feature | Story | Status |
|-------------|-------|--------|
| FR-001: Create Task | US0002 | Complete |
| FR-002: View All Tasks | US0003 | Complete |
| FR-003: View Task Details | US0004 | Complete |
| FR-004: Edit Task | US0004 | Complete |
| FR-005: Toggle Completion | US0006 | Complete |
| FR-006: Reorder Tasks | US0007 | Complete |
| FR-007: Delete Task | US0005 | Complete |
| FR-008: Task Deadlines | US0012 | Ready |

---

*Last updated: 2026-01-23 (US0012 added)*
