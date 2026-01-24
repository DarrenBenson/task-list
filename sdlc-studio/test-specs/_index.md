# Test Specification Registry

This file tracks all test specifications in the project.

| ID | Epic | Title | Status | Test Cases | Automated |
|----|------|-------|--------|------------|-----------|
| [TS0001](TS0001-core-task-management.md) | EP0001 | Core Task Management | Complete | 29 | 29/29 |
| [TS0002](TS0002-task-organisation.md) | EP0002 | Task Organisation | Complete | 5 | 5/5 |
| [TS0011](TS0011-docker-compose.md) | EP0004 | Docker Compose Orchestration | Complete | 9 | 8/9 |
| [TS0012](TS0012-task-deadlines.md) | EP0005 | Task Deadlines | Complete | 14 | 11/14 |

## Summary

- **Total Specs:** 4
- **Draft:** 0
- **In Progress:** 0
- **Complete:** 4
- **Total Test Cases:** 57
- **Automated:** 53 (93%)

## Coverage by Epic

| Epic | Spec | Stories Covered | AC Coverage |
|------|------|-----------------|-------------|
| EP0001 | TS0001 | US0001-US0005 | 22/22 (100%) |
| EP0002 | TS0002 | US0006-US0007 | 10/10 (100%) |
| EP0004 | TS0011 | US0011 | 10/10 (100%) |
| EP0005 | TS0012 | US0012 | 8/8 (100%) |

## Test Type Distribution

| Type | Count | Automated | Purpose |
|------|-------|-----------|---------|
| Unit | 4 | 4 | Model and schema validation |
| Integration | 3 | 3 | Database and server startup |
| API | 12 | 12 | REST endpoint contracts |
| E2E | 15 | 15 | User interface flows |

## Test Coverage

### Backend (pytest)
- **Line coverage:** 97% (target: 90%)
- **Test files:** 5
- **Total tests:** 71

### Frontend (Playwright)
- **E2E coverage:** 100%
- **Test files:** 5
- **Total tests:** 35

## Run Tests

```bash
# Backend tests
cd backend && source venv/bin/activate && pytest tests/ -v

# Frontend E2E tests
cd frontend && npm test
```

---

*Last updated: 2026-01-23*
