## Survey Creator (Full-stack)

A small full-stack app for creating surveys, collecting votes, and viewing results.

- **Backend** (`survey-creator/backend`): Node.js + TypeScript + Express API backed by **SQLite** (via `better-sqlite3`), cookie-based **JWT auth** (access + refresh), and **Swagger UI**.
- **Frontend** (`survey-creator/frontend`): React + TypeScript + Vite SPA using **React Router**, **TanStack Query**, **Axios**, and **shadcn/ui** components.

## What’s inside

- **Browse**: `GET /api/surveys` (public) lists surveys.
- **Create/Delete (auth + CSRF)**: `POST /api/surveys`, `DELETE /api/surveys/{id}`.
- **My surveys (auth)**: `GET /api/surveys/user/my-surveys`.
- **Vote (auth + CSRF)**: `POST /api/surveys/{id}/respond` (one response per user).
- **Results**: `GET /api/surveys/{id}/results` (public) returns counts/percentages.
- **CSRF token**: `GET /api/csrf-token` (requires authentication).
- **Docs**: Swagger UI exposed by the backend.

## Run with Docker (recommended)

From `survey-creator/`:

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
- `survey-creator/.env.example`
- `survey-creator/backend/.env.example`
- `survey-creator/frontend/.env.example`
