## Password Generator (Full-stack)

A small full-stack password generator with optional saved history per user.

- **Backend** (`password-generator/backend`): Node.js + TypeScript + Express API backed by **SQLite** (via `better-sqlite3`), cookie-based **JWT auth** (access + refresh), and **Swagger UI**.
- **Frontend** (`password-generator/frontend`): React + TypeScript + Vite SPA using **React Router**, **TanStack Query**, **Axios**, and **shadcn/ui** components.

## What’s inside

- **Generate**: `POST /api/passwords/generate` (no auth) generates a password based on options (length, uppercase/lowercase/numbers/symbols).
- **Saved history (auth)**: `GET /api/passwords` and `POST /api/passwords` to list/save generated passwords.
- **Delete (auth + CSRF)**:
  - `GET /api/passwords/csrf-token` to fetch a CSRF token
  - `DELETE /api/passwords/{id}` and `DELETE /api/passwords` require `x-csrf-token`
- **Docs**: Swagger UI exposed by the backend.

## Run with Docker (recommended)

From `password-generator/`:

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

Set `VITE_API_URL` (see `frontend/.env.example`). If not set, the frontend falls back to `http://localhost:3000/api`, so for local backend on port 3001 you’ll typically want:

- `VITE_API_URL=http://localhost:3001/api`

## Environment variables

There are `.env.example` files in:
- `password-generator/.env.example`
- `password-generator/backend/.env.example`
- `password-generator/frontend/.env.example`
