# Contributing to Task Manager

Thank you for considering contributing to Task Manager.

## How to Contribute

### Reporting Issues

- Search existing issues before creating a new one
- Use the issue templates when available
- Include clear reproduction steps for bugs
- Describe expected vs actual behaviour

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests and linting
5. Commit with clear messages
6. Push to your fork
7. Open a pull request

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Keep the first line under 72 characters
- Reference issues when relevant (`Fixes #123`)

### Code Style

**Python (Backend):**
- Follow PEP 8
- Use type hints
- Format with `ruff format`
- Lint with `ruff check`

**JavaScript (Frontend):**
- Follow ESLint configuration
- Use functional components with hooks

### Testing

**Backend:**
```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

**Frontend E2E:**
```bash
cd frontend
npm test
```

Coverage target: 90% for backend.

## Development Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker

```bash
docker compose up -d
```

## Questions?

Open a GitHub issue or discussion.
