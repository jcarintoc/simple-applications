## Mini Social Network (Full-stack)

A small full-stack “mini social network” app with users, posts, likes, comments, and follows.

- **Backend** (`mini-social-network/backend`): Node.js + TypeScript + Express API backed by **SQLite** (via `better-sqlite3`), cookie-based **JWT auth** (access + refresh), **CSRF protection**, basic **rate limiting**, and **Swagger UI**.
- **Frontend** (`mini-social-network/frontend`): React + TypeScript + Vite SPA using **React Router**, **TanStack Query**, **Axios**, and **shadcn/ui** components.

## What’s inside

- **Auth**: register/login/logout, `GET /api/auth/me`, refresh tokens.
- **Users**: profiles and follow/unfollow.
- **Posts**: create/list/view posts.
- **Likes**: like/unlike posts.
- **Comments**: create/list/delete comments.
- **CSRF**: fetch a token from `GET /api/csrf-token` and include it for mutations (frontend automatically adds `x-csrf-token` on state-changing requests).
- **Docs**: Swagger UI exposed by the backend.

## Run with Docker (recommended)

From `mini-social-network/`:

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
- `mini-social-network/.env.example`
- `mini-social-network/backend/.env.example`
- `mini-social-network/frontend/.env.example`
