## Event Manager (Full-stack)

A small full-stack app for managing personal events (create/update/delete) with filtering and pagination.

- **Backend** (`event-manager/backend`): Node.js + TypeScript + Express API backed by **SQLite** (via `better-sqlite3`), cookie-based **JWT auth** (access + refresh), and **Swagger UI**.
- **Frontend** (`event-manager/frontend`): React + TypeScript + Vite SPA using **React Router**, **TanStack Query**, **Axios**, and **shadcn/ui** components.

## What’s inside

- **Auth**: register/login/logout, `GET /api/auth/me`, refresh tokens.
- **Events**: CRUD + listing with query params for `search`, `filter` (today/week/all), `page`, `limit`.
- **Delete protection**: delete requires `X-CSRF-Protection: 1` header.
- **Docs**: Swagger UI exposed by the backend.

## Run with Docker (recommended)

From `event-manager/`:

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
- `event-manager/.env.example`
- `event-manager/backend/.env.example`
- `event-manager/frontend/.env.example`
