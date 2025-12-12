## Bookmark Manager (Full-stack)

A small full-stack app for saving and organizing bookmarks with tags.

- **Backend** (`bookmark-manager/backend`): Node.js + TypeScript + Express API backed by **SQLite** (via `better-sqlite3`), cookie-based **JWT auth** (access + refresh), and **Swagger UI**.
- **Frontend** (`bookmark-manager/frontend`): React + TypeScript + Vite SPA using **React Router**, **TanStack Query**, **Axios**, and **shadcn/ui** components.

## What’s inside

- **Auth**: register/login/logout, `GET /api/auth/me`, refresh tokens.
- **Bookmarks**: CRUD with pagination and filtering.
  - list supports `search`, `tags`, `page`, `limit`
  - tags list via `GET /api/bookmarks/tags`
- **CSRF**: mutations require `x-csrf-token` from `GET /api/bookmarks/csrf-token`.
- **Docs**: Swagger UI exposed by the backend.

## Run with Docker (recommended)

From `bookmark-manager/`:

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
- `bookmark-manager/.env.example`
- `bookmark-manager/backend/.env.example`
- `bookmark-manager/frontend/.env.example`
