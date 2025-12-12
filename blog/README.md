## Blog (Full-stack)

A small full-stack blog/CMS app.

- **Backend** (`blog/backend`): Node.js + TypeScript + Express API backed by **SQLite** (via `better-sqlite3`), with cookie-based **JWT auth** (access + refresh), **CSRF protection** for write operations, and **Swagger UI**.
- **Frontend** (`blog/frontend`): React + TypeScript + Vite SPA using **React Router**, **TanStack Query**, **Axios**, and **shadcn/ui** components.

## What’s inside

- **Auth**: register/login/logout, `GET /api/auth/me`, refresh tokens.
- **Posts**: list posts, get by id/slug, create/update/delete (authenticated + CSRF).
- **Comments**: list by post, create/delete (authenticated + CSRF).
- **Docs**: Swagger UI exposed by the backend.

## Run with Docker (recommended)

From `blog/`:

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

Backend runs on `http://localhost:3001` and serves routes under `/api`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default the frontend uses `VITE_API_URL` (see `frontend/.env.example`). If not set, it falls back to `http://localhost:3001/api`.

## Environment variables

There are `.env.example` files in:
- `blog/.env.example`
- `blog/backend/.env.example`
- `blog/frontend/.env.example`

These include values for JWT secrets, token expiry, and the frontend/API URLs.