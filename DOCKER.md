# Docker Deployment Guide

This guide explains how to deploy and manage the Task Manager application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

Start the entire application with a single command:

```bash
docker compose up -d
```

The application will be accessible at [http://localhost](http://localhost).

## Common Commands

### Stopping the Application

Stop all containers and networks:

```bash
docker compose down
```

### Viewing Logs

View logs from all services:

```bash
docker compose logs -f
```

View logs for a specific service:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Checking Status

Check the health status of all containers:

```bash
docker compose ps
```

## Data Persistence

Tasks are stored in a SQLite database within a named Docker volume called `taskmanager-data`. This data persists even when containers are stopped or removed with `docker compose down`.

**Caution:** Running `docker compose down -v` will remove the named volume and delete all your data permanently.

## Environment Configuration

The following environment variables can be configured in the `docker-compose.yml` file:

### Backend
- `DATABASE_URL`: Connection string for the database (default: `sqlite:///./data/tasks.db`)
- `HOST`: Bind address (default: `0.0.0.0`)
- `PORT`: Bind port (default: `8000`)

## Development Mode

By default, Docker Compose uses `docker-compose.override.yml` which enables:
- Backend exposed on port 8000
- Frontend exposed on port 3000
- Live reloading for backend code (via volume mount)

To run in "production mode" without these overrides:

```bash
docker compose -f docker-compose.yml up -d
```

## Troubleshooting

### Port 80 in use
If port 80 is already used by another service, you can change the mapping in `docker-compose.yml`:

```yaml
frontend:
  ports:
    - "8080:80"  # Changes host port to 8080
```

### Permission Issues
The backend runs as a non-root user (`appuser`). The named volume handles permissions automatically, but if using bind mounts, ensure the host directory is writable by UID 1000.
