# US0010: Create Docker Configuration for Frontend

> **Status:** Done
> **Epic:** [EP0004: Docker Containerisation](../epics/EP0004-docker-containerisation.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** developer or operator
**I want** a production-ready Docker container for the React frontend served via nginx
**So that** the frontend can be deployed as a minimal, efficient static file server

## Context

### Persona Reference

**Busy Parent Sam** - Benefits from simplified deployment - no need to manage Node.js or build tools.

**Organised Ollie** - Appreciates consistent, reproducible environment across machines.

[Full persona details](../personas.md)

### Background

The frontend is a React/Vite application. For production deployment:
- Build phase requires Node.js and npm
- Production phase needs only nginx to serve static files
- Node.js runtime is NOT needed after build
- The container should be minimal - just nginx + built assets

This follows the "minimal deployment principle" - only production-essential files in the final image.

## Inherited Constraints

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Performance | Frontend renders within 1 second | Static assets efficiently served |
| Security | No dev dependencies deployed | node_modules excluded from final image |
| Size | Frontend image < 50MB | nginx:alpine base, dist/ only |

### From TRD

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Tech Stack | React/Vite | Build with npm, serve with nginx |
| Port | Frontend :5173 (dev), :80 (prod) | nginx serves on port 80 |

## Acceptance Criteria

### AC1: Multi-stage Dockerfile created

- **Given** the frontend Dockerfile is built
- **When** examining the Dockerfile structure
- **Then** it uses 2 stages (builder and production)
- **And** the builder stage uses node:20-alpine
- **And** the production stage uses nginx:alpine
- **And** Node.js runtime is NOT present in final image

### AC2: Only dist/ deployed

- **Given** the frontend container is running
- **When** examining the container filesystem
- **Then** built assets exist in nginx html directory
- **And** `node_modules/` directory does NOT exist
- **And** `src/` directory does NOT exist
- **And** `package.json` does NOT exist
- **And** source files (*.jsx, *.tsx) do NOT exist

### AC3: No test files deployed

- **Given** the frontend container is running
- **When** examining the container filesystem
- **Then** `e2e/` directory does NOT exist
- **And** `*.spec.js` files do NOT exist
- **And** `test-results/` directory does NOT exist
- **And** `playwright-report/` directory does NOT exist
- **And** `playwright.config.js` does NOT exist

### AC4: .dockerignore configured

- **Given** the frontend .dockerignore file
- **When** examining its contents
- **Then** it excludes `node_modules/`
- **And** it excludes `e2e/`
- **And** it excludes `*.spec.js`
- **And** it excludes `test-results/`
- **And** it excludes `playwright-report/`
- **And** it excludes `.git/`
- **And** it excludes `*.md`
- **And** it excludes `dist/` (rebuild fresh in container)

### AC5: nginx configuration for SPA routing

- **Given** the frontend is served via nginx
- **When** accessing a deep route like `/task/123`
- **Then** nginx serves index.html (SPA fallback)
- **And** client-side routing handles the route
- **And** 404 errors do NOT occur for valid routes

### AC6: nginx configuration for API proxying

- **Given** the frontend makes API requests
- **When** calling `/api/*` endpoints
- **Then** nginx proxies requests to the backend container
- **And** the backend URL is configurable via environment
- **And** CORS is handled correctly

### AC7: Image size under 50MB

- **Given** the frontend image is built
- **When** checking image size with `docker images`
- **Then** the image size is less than 50MB

### AC8: Static assets served efficiently

- **Given** the frontend is running
- **When** requesting static assets (JS, CSS, images)
- **Then** nginx serves them with appropriate cache headers
- **And** gzip compression is enabled
- **And** assets are served within 50ms

### AC9: Health check available

- **Given** the frontend container is running
- **When** nginx is healthy
- **Then** a simple health check path returns 200
- **And** Docker HEALTHCHECK reports container as healthy

## Scope

### In Scope

- Dockerfile with multi-stage build
- .dockerignore file
- nginx configuration for SPA routing
- nginx configuration for API proxying
- Static asset caching headers
- Gzip compression

### Out of Scope

- Docker Compose configuration (US0011)
- Backend container (US0009)
- SSL/TLS configuration (handled by reverse proxy)
- CDN integration

## Technical Notes

### Implementation Approach

1. **Create .dockerignore**
   ```
   # Node modules (including nested)
   node_modules/
   **/node_modules/

   # Test files and reports
   e2e/
   *.spec.js
   **/*.spec.js
   test-results/
   playwright-report/
   coverage/

   # Build output (rebuild fresh in container)
   dist/

   # Git
   .git/
   .gitignore

   # Documentation
   *.md

   # Environment files
   .env
   .env.*

   # IDE and editor config
   .vscode/
   .idea/
   *.swp
   *~

   # Playwright
   playwright.config.js
   ```

2. **Create multi-stage Dockerfile**
   ```dockerfile
   # Stage 1: Build
   FROM node:20-alpine AS builder
   WORKDIR /build
   COPY package*.json ./
   RUN npm ci --production=false
   COPY . .
   RUN npm run build

   # Stage 2: Production
   FROM nginx:alpine AS production
   # Remove default nginx config
   RUN rm /etc/nginx/conf.d/default.conf
   # Copy custom nginx config
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   # Copy built assets only
   COPY --from=builder /build/dist /usr/share/nginx/html
   EXPOSE 80
   HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
     CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Create nginx.conf**
   ```nginx
   server {
       listen 80;
       server_name _;
       root /usr/share/nginx/html;
       index index.html;

       # Gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

       # SPA routing - serve index.html for all routes
       location / {
           try_files $uri $uri/ /index.html;
       }

       # API proxy - preserve the /api/v1 path (backend expects it)
       location /api/ {
           proxy_pass http://backend:8000;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       # Health check endpoint
       location /health {
           return 200 'OK';
           add_header Content-Type text/plain;
       }

       # Static asset caching
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

### Files to Create

- `frontend/Dockerfile` - New file
- `frontend/.dockerignore` - New file
- `frontend/nginx.conf` - New file

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Deep route refresh | nginx serves index.html, React handles route |
| Missing static asset | nginx returns 404 |
| Backend unavailable | API proxy returns 502 Bad Gateway |
| Large bundle size | Gzip reduces transfer size |
| Build without .dockerignore | Build works but larger context, slower |
| npm ci fails | Build fails with clear error message |
| Backend service name mismatch | Proxy fails - must match compose service name |

## Test Scenarios

- [ ] Docker build completes successfully
- [ ] Container starts without errors
- [ ] Homepage loads correctly
- [ ] Deep routes work (e.g., `/task/123`)
- [ ] No node_modules in container (`ls /node_modules` fails)
- [ ] No source files in container (`find / -name "*.jsx"` empty)
- [ ] No test files in container (`ls /e2e` fails)
- [ ] Image size under 50MB
- [ ] Static assets have cache headers
- [ ] Gzip is enabled for text resources
- [ ] API proxy forwards requests correctly

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| US0003 | Code | Frontend project exists | Complete |
| US0008 | Code | Design system applied | Complete |

### External Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Docker | Runtime | Required |
| node:20-alpine | Base image | Available |
| nginx:alpine | Base image | Available |

## Estimation

**Story Points:** 3

**Complexity:** Medium

- Multi-stage Docker build
- nginx configuration for SPA
- API proxy configuration
- No backend involvement

## Open Questions

None - requirements clear from epic.

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story created from EP0004 |
| 2026-01-23 | Claude | Updated .dockerignore with glob patterns and additional exclusions based on US0009 learnings |
| 2026-01-23 | Claude | Fixed nginx proxy_pass to preserve /api/v1 path (backend expects full path), added nginx health endpoint |
