## Color Palette Saver (Full-stack)

A small full-stack app for building and saving color palettes.

- **Backend** (`color-pallete-saver/backend`): Node.js + TypeScript + Express API backed by **SQLite** (via `better-sqlite3`), cookie-based **JWT auth** (access + refresh), and **Swagger UI**.
- **Frontend** (`color-pallete-saver/frontend`): React + TypeScript + Vite SPA using **React Router**, **TanStack Query**, **Axios**, and **shadcn/ui** components.

## What’s inside

- **Auth**: register/login/logout, `GET /api/auth/me`, refresh tokens.
- **Palettes**: create/update/list/get palettes for the authenticated user.
- **Delete CSRF**: delete requires a CSRF token from `GET /api/palettes/csrf-token` (sent via `X-CSRF-Token`).
- **Docs**: Swagger UI exposed by the backend.

## Run with Docker (recommended)

From `color-pallete-saver/`:

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
- `color-pallete-saver/.env.example`
- `color-pallete-saver/backend/.env.example`
- `color-pallete-saver/frontend/.env.example`
