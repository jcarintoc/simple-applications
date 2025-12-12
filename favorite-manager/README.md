## Favorite Manager (Full-stack)

A small full-stack app for saving and organizing your favorites (movies, songs, books, games, shows, etc.).

- **Backend** (`favorite-manager/backend`): Node.js + TypeScript + Express API backed by **SQLite** (via `better-sqlite3`), cookie-based **JWT auth** (access + refresh), a CSRF token endpoint, and **Swagger UI**.
- **Frontend** (`favorite-manager/frontend`): React + TypeScript + Vite SPA using **React Router**, **TanStack Query**, **Axios**, and **shadcn/ui** components.

## What’s inside

- **Auth**: register/login/logout, `GET /api/auth/me`, refresh tokens.
- **Favorites**: list/create/update/delete favorites per user.
- **CSRF**: fetch a token from `GET /api/csrf-token` and include it for state-changing operations (see backend Swagger for required header name).
- **Docs**: Swagger UI exposed by the backend.

## Run with Docker (recommended)

From `favorite-manager/`:

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
- `favorite-manager/.env.example`
- `favorite-manager/backend/.env.example`
- `favorite-manager/frontend/.env.example`
