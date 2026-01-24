# US0011: Create Docker Compose Orchestration

> **Status:** Done
> **Epic:** [EP0004: Docker Containerisation](../epics/EP0004-docker-containerisation.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** user or developer
**I want** to start the entire Task Manager application with a single `docker compose up` command
**So that** deployment is simple, reproducible, and requires no manual configuration

## Context

### Persona Reference

**Busy Parent Sam** - Benefits from single-command deployment - no need to start multiple services manually.

**Organised Ollie** - Appreciates consistent environment - same setup works on any machine with Docker.

[Full persona details](../personas.md)

### Background

With backend (US0009) and frontend (US0010) containers ready, Docker Compose orchestrates them together:
- Defines service dependencies
- Configures networking between containers
- Manages volume mounts for data persistence
- Sets environment variables
- Enables single-command startup

The goal is "it just works" - `docker compose up` should start a fully functional Task Manager.

## Inherited Constraints

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Deployment | Single command startup | compose up must start everything |
| Data | SQLite persistence | Named volume for database |
| Performance | Startup < 10 seconds | Optimise container startup |
| Configuration | Environment variables | Configurable via compose file |

### From TRD

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Ports | Backend :8000, Frontend :80 | Expose appropriate ports |
| Database | SQLite | Volume mount required |

## Acceptance Criteria

### AC1: Single command startup

- **Given** Docker and Docker Compose are installed
- **When** running `docker compose up` in the project root
- **Then** both frontend and backend containers start
- **And** the application is accessible at http://localhost
- **And** no additional configuration or commands are needed

### AC2: Service dependencies configured

- **Given** the docker-compose.yml file
- **When** starting the application
- **Then** the backend starts before (or with) the frontend
- **And** the frontend waits for backend to be healthy before proxying
- **And** depends_on with condition: service_healthy is used

### AC3: Internal networking configured

- **Given** both containers are running
- **When** the frontend proxies to the backend
- **Then** containers communicate via Docker network
- **And** the backend is NOT directly exposed to host (optional)
- **And** only frontend port 80 is exposed to host

### AC4: SQLite volume persistence

- **Given** the application creates tasks
- **When** containers are stopped and restarted
- **Then** all tasks persist across restarts
- **And** a named volume `taskmanager-data` stores the database
- **And** the volume survives `docker compose down`

### AC5: Environment variable configuration

- **Given** the docker-compose.yml file
- **When** examining environment configuration
- **Then** backend DATABASE_URL is configurable
- **And** backend HOST and PORT are set appropriately
- **And** frontend API proxy URL is configurable
- **And** sensible defaults are provided

### AC6: Health checks functional

- **Given** both services are running
- **When** checking container health with `docker compose ps`
- **Then** both containers show "healthy" status
- **And** unhealthy containers are reported correctly

### AC7: Startup time under 10 seconds

- **Given** images are already built
- **When** running `docker compose up`
- **Then** containers reach healthy status within 10 seconds
- **And** the application is usable within 10 seconds

### AC8: Development compose override

- **Given** a docker-compose.override.yml file exists
- **When** running `docker compose up` in development
- **Then** source code is mounted for hot reload (optional)
- **And** development ports are exposed
- **And** this is optional and documented

### AC9: Clean shutdown

- **Given** the application is running
- **When** running `docker compose down`
- **Then** all containers stop gracefully
- **And** no orphan containers remain
- **And** the data volume is preserved (not deleted)

### AC10: Documentation provided

- **Given** the project README or DOCKER.md
- **When** reading deployment instructions
- **Then** it explains how to start with `docker compose up`
- **And** it explains volume management
- **And** it explains environment configuration
- **And** it explains how to view logs

## Scope

### In Scope

- docker-compose.yml for production
- docker-compose.override.yml for development (optional)
- Volume configuration for SQLite
- Network configuration
- Environment variable setup
- Health check integration
- Usage documentation

### Out of Scope

- Kubernetes manifests
- Docker Swarm configuration
- CI/CD pipeline integration
- SSL/TLS termination
- Load balancing
- Multiple replicas

## Technical Notes

### Implementation Approach

1. **Create docker-compose.yml**
   ```yaml
   services:
     backend:
       build:
         context: ./backend
         dockerfile: Dockerfile
       environment:
         - DATABASE_URL=sqlite:///./data/tasks.db
         - HOST=0.0.0.0
         - PORT=8000
       volumes:
         - taskmanager-data:/app/data
       # Note: healthcheck defined in Dockerfile, no need to duplicate here
       networks:
         - taskmanager-network

     frontend:
       build:
         context: ./frontend
         dockerfile: Dockerfile
       ports:
         - "80:80"
       depends_on:
         backend:
           condition: service_healthy
       networks:
         - taskmanager-network

   volumes:
     taskmanager-data:

   networks:
     taskmanager-network:
       driver: bridge
   ```

   > **Note:** The `version` key is obsolete in modern Docker Compose (v2+) and can be omitted.
   > Health checks are defined in the Dockerfiles themselves, not duplicated in compose.

2. **Create docker-compose.override.yml (development)**
   ```yaml
   services:
     backend:
       ports:
         - "8000:8000"  # Expose backend directly for debugging
       volumes:
         - ./backend/app:/app/app:ro  # Mount source for development

     frontend:
       ports:
         - "3000:80"  # Alternative port for development
   ```

3. **Create documentation**
   - Add DOCKER.md with usage instructions

### Files to Create

- `docker-compose.yml` - Main compose file
- `docker-compose.override.yml` - Development overrides (optional)
- `DOCKER.md` - Usage documentation

### Directory Structure

```
task-list/
├── docker-compose.yml
├── docker-compose.override.yml  (optional)
├── DOCKER.md
├── backend/
│   ├── Dockerfile
│   └── .dockerignore
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    └── nginx.conf
```

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Backend fails to start | Frontend waits due to depends_on, shows error in logs |
| Port 80 already in use | Clear error message: "port is already allocated" |
| Volume permissions issue | Documented troubleshooting steps in DOCKER.md |
| Disk full | Clear error in logs |
| Network conflict | Docker handles automatically with unique network name |
| Backend health check fails | Frontend never starts, compose reports unhealthy |
| Ctrl+C during startup | Graceful shutdown, partial containers cleaned up |
| compose down -v | Warning: removes data volume (data loss) |

## Test Scenarios

- [ ] `docker compose up` starts both services
- [ ] Application accessible at http://localhost
- [ ] Tasks can be created, viewed, edited, deleted
- [ ] Tasks persist after `docker compose down && docker compose up`
- [ ] `docker compose ps` shows healthy status
- [ ] `docker compose logs` shows both service logs
- [ ] `docker compose down` stops all containers cleanly
- [ ] Volume preserved after down (check with `docker volume ls`)
- [ ] Startup completes within 10 seconds
- [ ] No exposed backend port (only frontend :80)

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| US0009 | Docker | Backend Dockerfile | Complete |
| US0010 | Docker | Frontend Dockerfile | Done |

### External Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Docker | Runtime | Required |
| Docker Compose | Runtime | Required |

## Estimation

**Story Points:** 2

**Complexity:** Low

- Standard Docker Compose configuration
- Integrates existing Dockerfiles
- Straightforward networking and volumes
- Documentation writing

## Open Questions

None - requirements clear from epic.

## Quality Checklist

### All Stories

- [x] No ambiguous language
- [x] Open Questions: 0 unresolved
- [x] Given/When/Then uses concrete values
- [x] Persona referenced with specific context

### Infrastructure Stories

- [x] File paths specified
- [x] Commands provided
- [x] Security considerations addressed
- [x] Performance targets defined

### Ready Status Gate

This story can be marked **Ready** when:
- [x] All critical Open Questions resolved
- [x] Epic constraints incorporated
- [x] No "TBD" placeholders in acceptance criteria

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story created from EP0004 |
| 2026-01-23 | Claude | Updated based on US0009 learnings: removed obsolete version key, removed duplicate healthcheck (defined in Dockerfile), fixed DATABASE_URL path, updated US0009 dependency status |
