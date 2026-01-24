# Technical Requirements Document

**Project:** Task Management System
**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-01-23
**PRD Reference:** [PRD](prd.md)

---

## 1. Executive Summary

### Purpose
Define the technical architecture, technology stack, and implementation approach for a lightweight task management system. This document guides development of a single-user web application with a React SPA frontend and FastAPI backend.

### Scope
- Backend API implementation (FastAPI, SQLite, SQLAlchemy)
- Frontend SPA implementation (React, Vite)
- Local deployment configuration
- API contract specifications
- Data model implementation

Not covered: Cloud deployment, CI/CD pipelines, monitoring infrastructure.

### Key Decisions
- Monolith architecture (single-user, simple requirements)
- SQLite for zero-configuration persistence
- REST API with auto-generated OpenAPI documentation
- React 18 with Vite for fast development iteration

---

## 1.5 Project Classification

**Project Type:** Web Application

**Classification Rationale:**
Serves a web frontend (React SPA) with a backend API. Single deployable unit for personal productivity use.

**Architecture Implications:**
Based on this project type:
- **Default Pattern:** Monolith
- **Pattern Used:** Monolith
- **Deviation Rationale:** None - default pattern is appropriate for single-user system with <5 features.

---

## 2. Architecture Overview

### System Context
Self-contained task management system running on a local machine. No external service dependencies. Single user accesses via web browser.

### Architecture Pattern
**Monolith**

**Rationale:** Single-user system with simple CRUD operations. No scaling requirements, no team coordination needs, no independent deployment requirements. A monolith provides simplicity in development, debugging, and deployment.

### Component Overview

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| Frontend | User interface, drag-and-drop, optimistic updates | React 18, Vite |
| Backend API | REST endpoints, validation, business logic | FastAPI, Pydantic |
| Data Layer | ORM, migrations, persistence | SQLAlchemy 2.0, Alembic |
| Database | Data storage | SQLite 3 |

### Component Diagram
```
┌─────────────────────────────────────────────────────────┐
│                      Browser                             │
│  ┌─────────────────────────────────────────────────┐    │
│  │              React SPA (Vite)                    │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐  │    │
│  │  │ TaskList│  │TaskForm │  │ DragDropContext │  │    │
│  │  └────┬────┘  └────┬────┘  └────────┬────────┘  │    │
│  │       └───────────┬┴────────────────┘           │    │
│  │                   │                              │    │
│  │           ┌───────┴───────┐                      │    │
│  │           │  API Service  │ (fetch)              │    │
│  │           └───────┬───────┘                      │    │
│  └───────────────────┼──────────────────────────────┘    │
└──────────────────────┼───────────────────────────────────┘
                       │ HTTP/JSON
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   FastAPI Backend                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                    Uvicorn                           │ │
│  │  ┌───────────────────────────────────────────────┐  │ │
│  │  │               FastAPI App                      │  │ │
│  │  │  ┌─────────┐  ┌─────────┐  ┌──────────────┐   │  │ │
│  │  │  │ /tasks  │  │ /tasks/ │  │/tasks/reorder│   │  │ │
│  │  │  │  router │  │ {id}    │  │    router    │   │  │ │
│  │  │  └────┬────┘  └────┬────┘  └──────┬───────┘   │  │ │
│  │  │       └───────────┬┴──────────────┘           │  │ │
│  │  │                   │                            │  │ │
│  │  │           ┌───────┴───────┐                    │  │ │
│  │  │           │   Pydantic    │ (validation)       │  │ │
│  │  │           │    Schemas    │                    │  │ │
│  │  │           └───────┬───────┘                    │  │ │
│  │  │                   │                            │  │ │
│  │  │           ┌───────┴───────┐                    │  │ │
│  │  │           │  SQLAlchemy   │ (ORM)              │  │ │
│  │  │           │    Models     │                    │  │ │
│  │  │           └───────┬───────┘                    │  │ │
│  │  └───────────────────┼────────────────────────────┘  │ │
│  └──────────────────────┼───────────────────────────────┘ │
└─────────────────────────┼────────────────────────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │   SQLite     │
                   │  tasks.db    │
                   └──────────────┘
```

---

## 3. Technology Stack

### Core Technologies

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| Backend Language | Python | 3.10+ | Ecosystem has excellent web API libraries (FastAPI, Pydantic). Rapid development for simple CRUD system. |
| Backend Framework | FastAPI | Latest | Auto-generated OpenAPI docs, async support, Pydantic integration, excellent performance for Python. |
| ORM | SQLAlchemy | 2.0+ | Industry standard Python ORM, type hints support, migration tooling via Alembic. |
| Database | SQLite | 3 | Zero configuration, single-file persistence, sufficient for single-user/1000 tasks. No separate server required. |
| Frontend Language | TypeScript/JavaScript | ES2020+ | React ecosystem standard, browser-native. |
| Frontend Framework | React | 18+ | Component model suits task UI, hooks for state management, large ecosystem for drag-and-drop. |
| Build Tool | Vite | Latest | Fast HMR, simple configuration, modern ESM support. |
| Validation | Pydantic | 2.0+ | Automatic request validation, schema generation for OpenAPI. |

### Build & Development

| Tool | Purpose |
|------|---------|
| Uvicorn | ASGI server for FastAPI |
| Alembic | Database migrations |
| Vite | Frontend dev server and bundler |
| npm/pnpm | Frontend package management |
| pip/poetry | Backend package management |
| pytest | Backend testing |
| ESLint | Frontend linting |

### Infrastructure Services

| Service | Provider | Purpose |
|---------|----------|---------|
| None | Local | Self-contained system with no external dependencies |

---

## 4. API Contracts

### API Style
**REST** with OpenAPI 3.0 auto-generated documentation

### Authentication
**None** - Single-user system without authentication requirement.

### Base Configuration
- Base URL: `/api/v1`
- Content-Type: `application/json`
- Character Encoding: UTF-8

### Endpoints Overview

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/v1/tasks | List all tasks sorted by position | No |
| GET | /api/v1/tasks/{task_id} | Get single task by ID | No |
| POST | /api/v1/tasks | Create new task | No |
| PATCH | /api/v1/tasks/{task_id} | Partially update task | No |
| DELETE | /api/v1/tasks/{task_id} | Delete task | No |
| PUT | /api/v1/tasks/reorder | Bulk update task positions | No |

### Request/Response Schemas

#### List Tasks (GET /api/v1/tasks)

**Response 200:**
```json
{
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Milk, bread, eggs",
      "is_complete": false,
      "position": 1,
      "created_at": "2026-01-23T10:30:00Z",
      "updated_at": "2026-01-23T10:30:00Z"
    }
  ],
  "count": 1
}
```

#### Get Task (GET /api/v1/tasks/{task_id})

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "is_complete": false,
  "position": 1,
  "created_at": "2026-01-23T10:30:00Z",
  "updated_at": "2026-01-23T10:30:00Z"
}
```

#### Create Task (POST /api/v1/tasks)

**Request:**
```json
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional, 0-2000 chars)"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "is_complete": false,
  "position": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### Update Task (PATCH /api/v1/tasks/{task_id})

**Request (all fields optional):**
```json
{
  "title": "string (1-200 chars)",
  "description": "string (0-2000 chars)",
  "is_complete": "boolean",
  "position": "integer"
}
```

**Response 200:** Full updated task object

#### Delete Task (DELETE /api/v1/tasks/{task_id})

**Response 204:** No content

#### Reorder Tasks (PUT /api/v1/tasks/reorder)

**Request:**
```json
{
  "task_positions": [
    {"id": "uuid", "position": 1},
    {"id": "uuid", "position": 2}
  ]
}
```

**Response 200:**
```json
{
  "tasks": ["array of full task objects in new order"],
  "count": "integer"
}
```

### Error Response Format
```json
{
  "detail": "Human-readable error message"
}
```

Or for validation errors (422):
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Malformed JSON |
| 404 | Not Found | Task ID doesn't exist |
| 422 | Unprocessable Entity | Validation failure |
| 500 | Internal Server Error | Unexpected server error |

---

## 5. Data Architecture

### Data Models

#### Task

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique task identifier |
| title | String(200) | NOT NULL | Task title |
| description | String(2000) | NULL allowed | Detailed description |
| is_complete | Boolean | NOT NULL, default=false | Completion status |
| position | Integer | NOT NULL, UNIQUE | Sort order (lower = higher) |
| created_at | DateTime | NOT NULL, auto-set | Creation timestamp (UTC) |
| updated_at | DateTime | NOT NULL, auto-update | Last modification (UTC) |

### Relationships
```
No relationships - single entity system
```

### Storage Strategy

| Data Type | Storage | Rationale |
|-----------|---------|-----------|
| Task data | SQLite file | Zero-config, single-file, sufficient for 1000 tasks |
| Session state | None (stateless) | No user sessions required |

### Migrations
- Alembic for schema versioning
- Migrations stored in `backend/alembic/`
- Auto-generate from SQLAlchemy models

---

## 6. Integration Patterns

### External Services
None - self-contained system.

### Event Architecture
Not applicable - simple synchronous request/response.

### Auth/Authz Model
Not applicable - single-user system without authentication.

---

## 7. Infrastructure Approach

### Deployment Topology
Local deployment on single machine.

```
┌─────────────────────────────────────────┐
│           Local Machine                  │
│                                          │
│  ┌──────────────┐    ┌──────────────┐   │
│  │   Vite Dev   │    │   Uvicorn    │   │
│  │   Server     │    │   (FastAPI)  │   │
│  │  :5173       │───▶│   :8000      │   │
│  └──────────────┘    └──────┬───────┘   │
│                             │            │
│                      ┌──────▼───────┐   │
│                      │   tasks.db   │   │
│                      │   (SQLite)   │   │
│                      └──────────────┘   │
└─────────────────────────────────────────┘
```

### Environment Strategy

| Environment | Purpose | Characteristics |
|-------------|---------|-----------------|
| Development | Local development | Hot reload, debug logging, CORS open |
| Production | N/A | Not in scope (local deployment only) |

### Scaling Strategy
Not applicable - single-user system.

### Disaster Recovery
- SQLite database file can be manually backed up
- No automated backup system in scope

---

## 8. Security Considerations

### Threat Model

| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|------------|
| SQL Injection | Low | High | SQLAlchemy ORM parameterised queries |
| XSS | Low | Medium | React escapes by default, no dangerouslySetInnerHTML |
| CSRF | Low | Low | No authentication = no session to hijack |
| Data exposure | Low | Low | Local deployment, single user |

### Security Controls

| Control | Implementation |
|---------|----------------|
| Authentication | Not required (single-user) |
| Authorisation | Not required (single-user) |
| Encryption at rest | Not implemented (local file) |
| Encryption in transit | Optional (HTTPS for production) |
| Input validation | Pydantic (server), form validation (client) |
| Logging & monitoring | Request logging with timestamp, method, path, status |

### Data Classification

| Category | Examples | Handling |
|----------|----------|----------|
| Internal | Task titles, descriptions | Stored locally, no special handling |

---

## 9. Performance Requirements

### Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API response time (p95) | <500ms | Server-side timing |
| Frontend render (task list) | <1000ms | Browser performance API |
| Drag-and-drop feedback | <16ms | 60fps visual updates |
| Capacity | 1000 tasks | Functional testing |

### Capacity Planning
- Maximum 1000 tasks
- Single concurrent user
- Database file <50MB at capacity

---

## 9.5 Architecture Checklist

### Pattern Selection
- [x] Project type identified and documented (Web Application)
- [x] Default pattern evaluated against project needs (Monolith)
- [x] Deviation from default documented as ADR (N/A - using default)

### Technology Decisions
- [x] Language selection justified (Python for FastAPI ecosystem)
- [x] Framework selection justified (FastAPI for auto-docs, validation)
- [x] Database selection justified (SQLite for zero-config single-user)
- [x] API style selection justified (REST for simplicity, tooling)

### Standards Compliance
- [x] OpenAPI documented (auto-generated by FastAPI)
- [x] Error responses standardised (FastAPI default format)
- [ ] Authentication approach documented (N/A)
- [ ] Pagination approach documented (N/A - max 1000 tasks)

### Infrastructure
- [x] Deployment target identified (local machine)
- [x] Scaling strategy documented (N/A - single user)
- [x] Disaster recovery documented (manual backup)

---

## 10. Architecture Decision Records

### ADR-001: Monolith Architecture

**Status:** Accepted

**Context:** Need to choose between monolith, microservices, or serverless for a single-user task management application.

**Decision:** Use monolith architecture with clear internal structure (routers, models, schemas).

**Consequences:**
- Positive: Simple deployment (two processes), easy debugging, minimal ops overhead
- Positive: Shared database simplifies data consistency
- Negative: Cannot scale components independently (not needed for single user)
- Neutral: May need restructuring if requirements grow significantly

---

### ADR-002: SQLite Database

**Status:** Accepted

**Context:** Need persistent storage for up to 1000 tasks. Options: PostgreSQL, SQLite, file-based JSON.

**Decision:** Use SQLite 3 with SQLAlchemy ORM.

**Consequences:**
- Positive: Zero configuration, no separate server process
- Positive: Single file for easy backup and portability
- Positive: ACID compliance, proper SQL support
- Negative: No concurrent write support (acceptable for single user)
- Negative: Would need migration to PostgreSQL for multi-user

---

### ADR-003: REST over GraphQL

**Status:** Accepted

**Context:** Choose API style for frontend-backend communication.

**Decision:** Use REST with auto-generated OpenAPI documentation.

**Consequences:**
- Positive: Excellent tooling (Swagger UI, ReDoc built into FastAPI)
- Positive: Simple mental model for CRUD operations
- Positive: Easy caching and debugging
- Negative: Multiple requests for complex data (not an issue with single entity)

---

### ADR-004: React with Vite

**Status:** Accepted

**Context:** Choose frontend framework and build tooling.

**Decision:** Use React 18 with Vite for development and build.

**Consequences:**
- Positive: Large ecosystem for drag-and-drop libraries (@dnd-kit)
- Positive: Vite provides fast HMR and simple configuration
- Positive: React hooks sufficient for local state (no Redux needed)
- Negative: Larger bundle than vanilla JS (acceptable trade-off)

---

## 11. Open Technical Questions

- [ ] **Q:** Should drag handle be always visible or hover-only?
  **Context:** UX decision affecting CSS implementation.
  **Options:** Always visible, hover-only on desktop, always visible on mobile

- [ ] **Q:** Use @dnd-kit or react-beautiful-dnd?
  **Context:** Both are viable drag-and-drop libraries.
  **Options:** @dnd-kit (more flexible, smaller), react-beautiful-dnd (more opinionated)

---

## 12. Implementation Constraints

### Must Have
- Python 3.10+ runtime
- Node.js 18+ for frontend tooling
- Local filesystem access for SQLite database
- Modern browser (Chrome 90+, Firefox 90+, Safari 14+, Edge 90+)

### Should Have
- PEP 8 compliant Python code
- ESLint compliant JavaScript/TypeScript
- Docstrings and JSDoc comments
- OpenAPI specification accessible at /docs

### Won't Have (This Version)
- User authentication
- Cloud deployment
- Automated backups
- CI/CD pipeline
- Multi-user support
- Mobile native applications

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-23 | 1.0 | Initial draft from PRD and spec.md |
