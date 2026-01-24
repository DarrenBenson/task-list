# Epic Registry

This file tracks all epics in the project.

| ID | Title | Status | Stories | Dependencies |
|----|-------|--------|---------|--------------|
| [EP0001](EP0001-core-task-management.md) | Core Task Management | Complete | 5/5 | None |
| [EP0002](EP0002-task-organisation.md) | Task Organisation | Complete | 2/2 | EP0001 |
| [EP0003](EP0003-ux-improvements.md) | UX Improvements | Complete | 1/1 | EP0001, EP0002 |
| [EP0004](EP0004-docker-containerisation.md) | Docker Containerisation | Complete | 3/3 | EP0001, EP0002, EP0003 |
| [EP0005](EP0005-task-deadlines.md) | Task Deadlines | Complete | 1/1 | EP0001 |

## Summary

- **Total Epics:** 5
- **Complete:** 5
- **Draft:** 0
- **In Progress:** 0

## Dependency Graph

```
EP0001 (Core Task Management) ✅
    │
    ├── EP0002 (Task Organisation) ✅
    │       │
    │       └── EP0003 (UX Improvements) ✅
    │               │
    │               └── EP0004 (Docker Containerisation) ✅
    │
    └── EP0004 (Docker Containerisation) ✅
```

## PRD Feature Mapping

| PRD Feature | Epic | Status |
|-------------|------|--------|
| FR-001: Create Task | EP0001 | ✅ Complete |
| FR-002: View All Tasks | EP0001 | ✅ Complete |
| FR-003: View Task Details | EP0001 | ✅ Complete |
| FR-004: Edit Task | EP0001 | ✅ Complete |
| FR-005: Toggle Completion | EP0002 | ✅ Complete |
| FR-006: Reorder Tasks | EP0002 | ✅ Complete |
| FR-007: Delete Task | EP0001 | ✅ Complete |

## Infrastructure Epics

| Epic | Description | Status |
|------|-------------|--------|
| EP0004 | Docker Containerisation | ✅ Complete |

## Feature Epics

| Epic | Description | Status |
|------|-------------|--------|
| EP0005 | Task Deadlines | Complete |

---

*Last updated: 2026-01-23 (EP0005 added)*
