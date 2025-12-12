## Todo App (Full-stack)

A small full-stack todo app with authentication, filters, and pagination.

- **Backend** (`todo-app/backend`): Node.js + TypeScript + Express API backed by **SQLite** (via `better-sqlite3`), cookie-based **JWT auth** (access + refresh), **CSRF protection** (double-submit cookie), **Zod** request validation, and **Swagger UI**.
- **Frontend** (`todo-app/frontend`): React + TypeScript + Vite SPA using **React Router**, **TanStack Query**, **Axios**, and **shadcn/ui** components.

## What’s inside

- **Auth**: register/login/logout, `GET /api/auth/me`, refresh tokens.
- **Todos**:
  - CRUD under `/api/todos`
  - list supports `page`, `limit`, `status` (pending/in_progress/completed), `priority` (low/medium/high), and `search`
- **CSRF**: backend sets an `XSRF-TOKEN` cookie; frontend sends it back via `X-XSRF-TOKEN` on POST/PUT/PATCH/DELETE.
- **Docs**: Swagger UI exposed by the backend.

## Run with Docker (recommended)

From `todo-app/`:

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
- `todo-app/.env.example`
- `todo-app/backend/.env.example`
- `todo-app/frontend/.env.example`
