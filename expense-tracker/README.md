## Expense Tracker (Full-stack)

A small full-stack expense tracker for recording, viewing, and exporting expenses.

- **Backend** (`expense-tracker/backend`): Node.js + TypeScript + Express API backed by **SQLite** (via `better-sqlite3`), cookie-based **JWT auth** (access + refresh), **CSRF protection** (via `csurf`) for mutations, and **Swagger UI**.
- **Frontend** (`expense-tracker/frontend`): React + TypeScript + Vite SPA using **React Router**, **TanStack Query**, **Axios**, and **shadcn/ui** components.

## What’s inside

- **Auth**: register/login/logout, `GET /api/auth/me`, refresh tokens.
- **Expenses**: CRUD for the authenticated user.
- **CSRF**: mutations require `X-CSRF-Token` (token is returned by `GET /api/expenses` or `GET /api/expenses/csrf-token`).
- **Export**: download all expenses as CSV via `GET /api/expenses/export`.
- **Docs**: Swagger UI exposed by the backend.

## Run with Docker (recommended)

From `expense-tracker/`:

```bash
docker compose up --build
```

- **Frontend**: `http://localhost` (served by Nginx)
- **API (proxied)**: `http://localhost/api/...`
- **Swagger UI**: `http://localhost:3001/api-docs`
- **SQLite data**: persisted via the `backend-data` Docker volume.

## Run locally (no Docker)

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default the frontend uses `VITE_API_URL` (see `frontend/.env.example`). If not set, it falls back to `http://localhost:3001/api`.

## Environment variables

There are `.env.example` files in:
- `expense-tracker/.env.example`
- `expense-tracker/backend/.env.example`
- `expense-tracker/frontend/.env.example`
