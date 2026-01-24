# PL0010: Frontend Docker Configuration

> **Status:** Complete
> **Story:** [US0010: Create Docker Configuration for Frontend](../stories/US0010-frontend-docker-config.md)
> **Approach:** Test-After (Infrastructure)
> **Created:** 2026-01-23

## Overview

Implement a production-ready Docker configuration for the React/Vite frontend. This involves creating a multi-stage Dockerfile that builds the application and serves the resulting static assets using a light-weight nginx:alpine image.

## Acceptance Criteria Summary

- [x] **AC1: Multi-stage Dockerfile** - 2 stages: Node 20 Alpine (build), nginx Alpine (runtime).
- [x] **AC2: Minimal Deployment** - Only `dist/` assets in final image, no source or node_modules.
- [x] **AC3: No Test Files** - Test artifacts excluded from final image.
- [x] **AC4: .dockerignore** - Properly excludes unnecessary files from build context.
- [x] **AC5: SPA Routing** - nginx handles deep routes via index.html fallback.
- [x] **AC6: API Proxying** - nginx proxies `/api/` to backend service.
- [x] **AC7: Size Target** - Image size < 50MB.
- [x] **AC8: Performance** - Gzip enabled and efficient static asset caching.
- [x] **AC9: Health Check** - Container health reporting via nginx.

## Technical Context

- **Frontend:** React + Vite
- **Base Images:** `node:20-alpine`, `nginx:alpine`
- **Port:** 80 (production)
- **Registry:** Local build for now (handled by US0011 later)

## Implementation Steps

### Phase 1: Preparation
- [x] Create `frontend/.dockerignore` to optimise build context and exclude secrets/tests.
- [x] Create `frontend/nginx.conf` with SPA routing and API proxy logic.

### Phase 2: Dockerfile Implementation
- [x] Create `frontend/Dockerfile` with multi-stage build.
- [x] Implement build stage (Stage 1).
- [x] Implement production stage (Stage 2) with custom nginx config.
- [x] Add HEALTHCHECK and non-root user (if feasible for nginx:alpine).

### Phase 3: Verification
- [x] Build image: `docker build -t task-manager-frontend ./frontend`
- [x] Verify image size: `docker images task-manager-frontend`
- [x] Run container locally: `docker run -d -p 8080:80 --name frontend-test task-manager-frontend`
- [x] Verify homepage loads on port 8080.
- [x] Verify health check: `curl -I http://localhost:8080/health`
- [x] Inspect container contents to ensure no source/tests/node_modules.
- [x] Cleanup test container.

## Recommended Approach: Test-After

Infrastructure tasks are best verified by running the resulting container and inspecting its state. "Tests" in this context are validation commands rather than unit tests.

## Documentation Updates Required

- Update `README.md` with Docker build instructions.

## Edge Cases

- **Build Failures:** Ensure `npm ci` is used for reproducible builds.
- **Proxy Timeouts:** nginx defaults are usually sufficient but may need tuning for slow backend.
- **Large Assets:** Verify gzip is actually active for JS/CSS.
- **Trailing Slashes:** Ensure `/api/` proxying handles paths correctly.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Image > 50MB | Use `nginx:alpine` and ensure `node_modules` are NOT copied. |
| Broken Deep Routes | Verify `try_files` in nginx configuration. |
| API Path Mismatch | Verify `proxy_pass` preserves the `/api/v1` structure if needed. |

## Dependencies

- `node:20-alpine` base image.
- `nginx:alpine` base image.

## Definition of Done Checklist

- [ ] Dockerfile exists and builds successfully.
- [ ] .dockerignore exists and covers all exclusions.
- [ ] nginx.conf exists with SPA and API proxy support.
- [ ] Image size is < 50MB.
- [ ] All AC from US0010 are met.
- [ ] Code check passes.
