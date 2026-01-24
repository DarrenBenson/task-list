# Task Manager

A simple, beautiful Task Manager application built with FastAPI and React.

## Quick Start (Docker)

Start the entire application with a single command:

```bash
docker compose up -d
```

The application will be accessible at [http://localhost](http://localhost).

For detailed Docker instructions, see [DOCKER.md](DOCKER.md).

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Documentation

- [PRD](sdlc-studio/prd.md)
- [TRD](sdlc-studio/trd.md)
- [Test Strategy](sdlc-studio/tsd.md)
- [Docker Guide](DOCKER.md)
