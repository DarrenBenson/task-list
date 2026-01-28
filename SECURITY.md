# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

- Email: Create a private security advisory via GitHub's Security tab
- Or open a draft security advisory at: https://github.com/DarrenBenson/task-list/security/advisories/new

Include the following information:

- Type of vulnerability
- Full paths of affected source files
- Location of the affected code (tag/branch/commit or direct URL)
- Step-by-step reproduction instructions
- Proof-of-concept or exploit code (if possible)
- Impact assessment

## Response Timeline

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Resolution target**: Within 30 days (critical), 90 days (other)

## Disclosure Policy

- We will acknowledge receipt of your report
- We will confirm the vulnerability and determine its impact
- We will release a fix and publicly disclose the issue

## Security Measures

This project implements:

- Input validation on both client and server (Pydantic schemas)
- SQL injection prevention via SQLAlchemy ORM
- XSS prevention via React's default escaping
- CORS configuration restricting origins

## Contact

For security concerns, use GitHub's private vulnerability reporting feature.
