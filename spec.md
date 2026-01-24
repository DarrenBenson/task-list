# Task Management System
## Requirements Document

**Version:** 1.0
**Date:** 23/01/2026
**Author:** Technical Business Analyst

---

## 1. Executive Summary

This document defines the requirements for a lightweight, web-based task management system designed for personal productivity. The system enables users to create, organise, track, and complete tasks through an intuitive single-page application.

**Objectives:**
- Provide a simple, fast interface for managing personal tasks
- Enable flexible task ordering to support priority-based workflows
- Deliver a responsive experience that works across desktop and mobile browsers
- Maintain data persistence through a reliable backend API

**Success Criteria:**
- Users can perform all CRUD operations on tasks within 2 seconds response time
- Task order persists accurately between sessions
- System requires no authentication for single-user deployment

---

## 2. Scope

### 2.1 In Scope

- Single-user task management (no multi-tenancy)
- Task creation, reading, updating, and deletion
- Task completion status tracking
- Manual task reordering
- Data persistence via SQLite database
- RESTful API with OpenAPI 3.0 documentation
- Single-page React frontend application
- Local deployment capability

### 2.2 Out of Scope

- User authentication and authorisation
- Multi-user collaboration
- Task categories, tags, or labels
- Due dates and reminders
- File attachments
- Email notifications
- Mobile native applications
- Cloud deployment infrastructure
- Data import/export functionality
- Undo/redo operations
- Task search and filtering

---

## 3. Functional Requirements

### 3.1 Task Creation

**FR-001: Create Task**

As a user, I want to create a new task so that I can track work I need to complete.

Acceptance Criteria:
- AC-001.1: User can enter a task title up to 200 characters
- AC-001.2: User can optionally enter a description up to 2000 characters
- AC-001.3: New tasks are created with status 'incomplete' by default
- AC-001.4: New tasks are added to the end of the task list (highest position value)
- AC-001.5: System displays the new task immediately upon successful creation
- AC-001.6: System displays an error message if title is empty or exceeds 200 characters
- AC-001.7: Created and updated timestamps are automatically set to current time

### 3.2 Task Viewing

**FR-002: View All Tasks**

As a user, I want to see all my tasks in an ordered list so that I can understand what needs to be done.

Acceptance Criteria:
- AC-002.1: All tasks display in a single scrollable list
- AC-002.2: Tasks are sorted by position value (ascending)
- AC-002.3: Each task displays its title, completion status, and position indicator
- AC-002.4: Completed tasks are visually distinguished (e.g., strikethrough, muted colour)
- AC-002.5: Empty state displays a message when no tasks exist

**FR-003: View Task Details**

As a user, I want to view the full details of a task so that I can see its complete description.

Acceptance Criteria:
- AC-003.1: User can click/tap a task to view its full details
- AC-003.2: Detail view shows title, description, status, and timestamps
- AC-003.3: User can return to the list view from the detail view

### 3.3 Task Modification

**FR-004: Edit Task**

As a user, I want to edit a task's title and description so that I can correct or update information.

Acceptance Criteria:
- AC-004.1: User can modify the task title
- AC-004.2: User can modify the task description
- AC-004.3: Validation rules match creation (title required, character limits)
- AC-004.4: Updated timestamp is set to current time on save
- AC-004.5: Changes are reflected immediately in the task list

**FR-005: Mark Task Complete/Incomplete**

As a user, I want to mark a task as complete or incomplete so that I can track my progress.

Acceptance Criteria:
- AC-005.1: User can toggle completion status with a single click/tap
- AC-005.2: Visual indicator updates immediately upon status change
- AC-005.3: Completed tasks remain in their current position (not moved or hidden)
- AC-005.4: Updated timestamp is set to current time on status change

**FR-006: Reorder Tasks**

As a user, I want to reorder my tasks so that I can prioritise what to work on next.

Acceptance Criteria:
- AC-006.1: User can drag a task to a new position in the list
- AC-006.2: Other tasks shift to accommodate the moved task
- AC-006.3: New positions persist after page refresh
- AC-006.4: Visual feedback indicates the drop target during drag operation
- AC-006.5: Position values are recalculated to maintain sequential ordering

### 3.4 Task Deletion

**FR-007: Delete Task**

As a user, I want to delete a task so that I can remove items I no longer need.

Acceptance Criteria:
- AC-007.1: User can delete a task via a delete button/action
- AC-007.2: System requests confirmation before deletion
- AC-007.3: Deleted task is removed from the list immediately
- AC-007.4: Deletion is permanent (no recycle bin)
- AC-007.5: Remaining tasks maintain their relative order

---

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-001: Response Time**
- API endpoints shall respond within 500ms under normal load
- Frontend shall render task list within 1 second of data receipt
- Drag-and-drop reordering shall feel instantaneous (optimistic UI updates)

**NFR-002: Capacity**
- System shall support up to 1000 tasks without degradation
- Database file size shall not exceed 50MB for 1000 tasks

### 4.2 Usability

**NFR-003: Accessibility**
- Interface shall be keyboard navigable
- Interactive elements shall have minimum 44x44 pixel touch targets
- Colour contrast shall meet WCAG 2.1 AA standards

**NFR-004: Responsiveness**
- Interface shall be usable on viewports from 320px to 2560px width
- Layout shall adapt appropriately for mobile, tablet, and desktop

### 4.3 Reliability

**NFR-005: Data Integrity**
- All database operations shall be transactional
- System shall prevent duplicate task IDs
- Position values shall remain unique and sequential

**NFR-006: Error Handling**
- API shall return appropriate HTTP status codes for all error conditions
- Frontend shall display user-friendly error messages
- Network failures shall not corrupt local UI state

### 4.4 Security

**NFR-007: Input Validation**
- All user inputs shall be validated on both client and server
- API shall sanitise inputs to prevent SQL injection
- Frontend shall escape outputs to prevent XSS

**NFR-008: CORS Configuration**
- API shall implement CORS headers for frontend origin only

### 4.5 Maintainability

**NFR-009: Code Quality**
- Backend shall include OpenAPI specification auto-generated from code
- Code shall follow PEP 8 (Python) and ESLint recommended rules (JavaScript)
- Functions shall include docstrings/JSDoc comments

**NFR-010: Logging**
- API shall log all requests with timestamp, method, path, and status code
- Errors shall be logged with stack traces

---

## 5. Data Requirements

### 5.1 Task Entity

**DR-001: Task Data Model**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary key, auto-generated | Unique task identifier |
| title | String | Required, max 200 chars | Task title |
| description | String | Optional, max 2000 chars | Detailed task description |
| is_complete | Boolean | Default: false | Completion status |
| position | Integer | Required, unique | Sort order (lower = higher in list) |
| created_at | DateTime | Auto-set on create, UTC | Creation timestamp |
| updated_at | DateTime | Auto-set on create/update, UTC | Last modification timestamp |

### 5.2 Data Constraints

**DR-002: Uniqueness**
- Task ID must be globally unique
- Position values must be unique across all tasks

**DR-003: Referential Integrity**
- No foreign key relationships required (single entity system)

**DR-004: Data Retention**
- Tasks persist indefinitely until explicitly deleted
- No automatic archival or cleanup

---

## 6. API Specification

### 6.1 Base Configuration

- Base URL: /api/v1
- Content-Type: application/json
- Character Encoding: UTF-8

### 6.2 Endpoints

**API-001: List All Tasks**

    Method: GET
    Path: /tasks
    Description: Retrieve all tasks sorted by position
    
    Request Parameters:
      None
    
    Response 200 OK:
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

**API-002: Get Single Task**

    Method: GET
    Path: /tasks/{task_id}
    Description: Retrieve a specific task by ID
    
    Path Parameters:
      task_id (UUID, required): The task identifier
    
    Response 200 OK:
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Buy groceries",
        "description": "Milk, bread, eggs",
        "is_complete": false,
        "position": 1,
        "created_at": "2026-01-23T10:30:00Z",
        "updated_at": "2026-01-23T10:30:00Z"
      }
    
    Response 404 Not Found:
      {
        "detail": "Task not found"
      }

**API-003: Create Task**

    Method: POST
    Path: /tasks
    Description: Create a new task
    
    Request Body:
      {
        "title": "Buy groceries",
        "description": "Milk, bread, eggs"
      }
    
    Field Validation:
      title: Required, 1-200 characters
      description: Optional, 0-2000 characters
    
    Response 201 Created:
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Buy groceries",
        "description": "Milk, bread, eggs",
        "is_complete": false,
        "position": 1,
        "created_at": "2026-01-23T10:30:00Z",
        "updated_at": "2026-01-23T10:30:00Z"
      }
    
    Response 422 Unprocessable Entity:
      {
        "detail": [
          {
            "loc": ["body", "title"],
            "msg": "field required",
            "type": "value_error.missing"
          }
        ]
      }

**API-004: Update Task**

    Method: PATCH
    Path: /tasks/{task_id}
    Description: Partially update a task
    
    Path Parameters:
      task_id (UUID, required): The task identifier
    
    Request Body (all fields optional):
      {
        "title": "Buy groceries and supplies",
        "description": "Updated description",
        "is_complete": true,
        "position": 3
      }
    
    Response 200 OK:
      Full updated task object (same schema as GET)
    
    Response 404 Not Found:
      {
        "detail": "Task not found"
      }
    
    Response 422 Unprocessable Entity:
      Validation error details

**API-005: Delete Task**

    Method: DELETE
    Path: /tasks/{task_id}
    Description: Permanently delete a task
    
    Path Parameters:
      task_id (UUID, required): The task identifier
    
    Response 204 No Content:
      Empty body
    
    Response 404 Not Found:
      {
        "detail": "Task not found"
      }

**API-006: Reorder Tasks**

    Method: PUT
    Path: /tasks/reorder
    Description: Update positions for multiple tasks in a single operation
    
    Request Body:
      {
        "task_positions": [
          {"id": "550e8400-e29b-41d4-a716-446655440000", "position": 1},
          {"id": "550e8400-e29b-41d4-a716-446655440001", "position": 2},
          {"id": "550e8400-e29b-41d4-a716-446655440002", "position": 3}
        ]
      }
    
    Response 200 OK:
      {
        "tasks": [
          Full task objects in new order
        ],
        "count": 3
      }
    
    Response 404 Not Found:
      {
        "detail": "One or more tasks not found"
      }

### 6.3 Common Response Codes

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

## 7. User Interface Requirements

### 7.1 Screen: Task List (Main View)

**UI-001: Layout Structure**

    Header Section:
      - Application title: "Task Manager"
      - Add Task button (prominent, primary colour)
    
    Task List Section:
      - Scrollable container for task items
      - Each task item displays:
        - Drag handle (left side)
        - Checkbox for completion status
        - Task title (truncated if necessary)
        - Delete button (right side, secondary/danger style)
      - Empty state message when no tasks exist
    
    Task Item States:
      - Default: Standard appearance
      - Complete: Strikethrough title, muted colours
      - Dragging: Elevated shadow, reduced opacity at original position
      - Hover: Subtle background highlight

**UI-002: Add Task Interaction**

    Trigger: Click "Add Task" button
    
    Behaviour:
      - Inline form appears at top of list OR modal dialog opens
      - Focus automatically set to title input
      - Form contains:
        - Title input (required)
        - Description textarea (optional, collapsible)
        - Save button (primary)
        - Cancel button (secondary)
      - Save disabled until title has content
      - Enter key submits form when title focused
      - Escape key cancels and closes form

**UI-003: Edit Task Interaction**

    Trigger: Click on task title or dedicated edit button
    
    Behaviour:
      - Task item transforms to edit mode OR modal opens
      - Current values pre-populated
      - Same form structure as Add Task
      - Save persists changes
      - Cancel reverts to view mode

**UI-004: Complete Task Interaction**

    Trigger: Click checkbox
    
    Behaviour:
      - Immediate visual feedback (checkbox fills)
      - Optimistic update (don't wait for API)
      - Task title receives strikethrough style
      - Revert on API failure with error toast

**UI-005: Delete Task Interaction**

    Trigger: Click delete button
    
    Behaviour:
      - Confirmation dialog appears:
        - Message: "Delete this task? This cannot be undone."
        - Confirm button (danger style)
        - Cancel button
      - On confirm: Task removed with fade-out animation
      - On cancel: Dialog closes, no action

**UI-006: Reorder Task Interaction**

    Trigger: Mouse down on drag handle, then drag
    
    Behaviour:
      - Task lifts visually (shadow, slight scale)
      - Placeholder indicates original position
      - Drop indicator shows between tasks
      - Release drops task at new position
      - Smooth animation as other tasks shift
      - API call fires after drop completes

### 7.2 Responsive Behaviour

**UI-007: Breakpoints**

    Mobile (< 640px):
      - Single column layout
      - Larger touch targets
      - Swipe gestures for delete (optional enhancement)
    
    Tablet (640px - 1024px):
      - Comfortable spacing
      - Same single column
    
    Desktop (> 1024px):
      - Centred content with max-width constraint (e.g., 800px)
      - Hover states enabled

### 7.3 Loading and Error States

**UI-008: Loading States**

    Initial load:
      - Skeleton placeholders for task items
      - Loading spinner if > 1 second
    
    Action in progress:
      - Button shows loading indicator
      - Disable form submission during save

**UI-009: Error States**

    Network failure:
      - Toast notification: "Unable to connect. Please check your connection."
      - Retry button where applicable
    
    Validation error:
      - Inline error message below affected field
      - Field border highlighted in error colour
    
    Server error:
      - Toast notification: "Something went wrong. Please try again."

---

## 8. Technical Constraints

### 8.1 Backend Constraints

**TC-001: Python Version**
- Python 3.10 or higher required

**TC-002: Framework**
- FastAPI framework for API implementation
- Pydantic for request/response validation
- Uvicorn as ASGI server

**TC-003: Database**
- SQLite 3 for data persistence
- SQLAlchemy 2.0+ as ORM
- Alembic for database migrations

**TC-004: API Documentation**
- Auto-generated OpenAPI 3.0 specification
- Swagger UI available at /docs
- ReDoc available at /redoc

### 8.2 Frontend Constraints

**TC-005: React Version**
- React 18 or higher

**TC-006: Build Tooling**
- Vite as build tool and dev server

**TC-007: Styling**
- CSS Modules OR Tailwind CSS (developer choice)
- No heavy component libraries required

**TC-008: State Management**
- React useState/useReducer for local state
- No external state library required for this scope

**TC-009: HTTP Client**
- Native Fetch API (no Axios required)

### 8.3 Browser Compatibility

**TC-010: Supported Browsers**
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

---

## 9. Assumptions and Dependencies

### 9.1 Assumptions

- A-001: Single user system; no concurrent access handling required
- A-002: Deployed on local machine or single server instance
- A-003: Users have modern browsers with JavaScript enabled
- A-004: Network latency is minimal (local or fast connection)
- A-005: Data volume remains under 1000 tasks
- A-006: No internationalisation required (English only)

### 9.2 Dependencies

**Backend Dependencies:**
- fastapi
- uvicorn
- sqlalchemy
- pydantic
- python-dotenv (optional, for configuration)

**Frontend Dependencies:**
- react
- react-dom
- @dnd-kit/core (or react-beautiful-dnd) for drag-and-drop
- uuid (for client-side ID generation if needed)

### 9.3 Development Environment

- Node.js 18+ for frontend tooling
- Python 3.10+ with pip/pipenv/poetry
- Git for version control

---

## 10. Glossary

| Term | Definition |
|------|------------|
| CRUD | Create, Read, Update, Delete - the four basic database operations |
| OpenAPI | Specification for describing REST APIs in a standard format |
| SPA | Single Page Application - a web app that loads a single HTML page and dynamically updates content |
| ORM | Object-Relational Mapping - technique for converting between database records and programming objects |
| UUID | Universally Unique Identifier - a 128-bit identifier standard |
| CORS | Cross-Origin Resource Sharing - mechanism for allowing web pages to make requests to different domains |
| Optimistic Update | UI pattern where changes display immediately before server confirmation |
| WCAG | Web Content Accessibility Guidelines - accessibility standards |
| Toast | A brief notification message that appears temporarily |

---

## Appendix A: Project File Structure (Recommended)

    task-manager/
    ├── backend/
    │   ├── app/
    │   │   ├── __init__.py
    │   │   ├── main.py
    │   │   ├── models.py
    │   │   ├── schemas.py
    │   │   ├── database.py
    │   │   └── routers/
    │   │       └── tasks.py
    │   ├── tests/
    │   ├── alembic/
    │   ├── requirements.txt
    │   └── alembic.ini
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   ├── public/
    │   ├── package.json
    │   └── vite.config.js
    └── README.md

---

**Document End**

