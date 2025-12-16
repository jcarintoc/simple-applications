## Simple Apps

A collection of small, self-contained apps. Most projects are **full-stack** and follow the same layout:

- `frontend/`: React + TypeScript + Vite (TanStack Query + Axios + shadcn/ui)
- `backend/`: Node.js + TypeScript + Express, typically backed by SQLite
- `docker-compose.yml`: runs the app with Nginx (frontend) + API (backend)

## How to run a project

### Docker (recommended)

From inside a project folder:

```bash
docker compose up --build
```

Typical URLs (per project):
- **Frontend**: `http://localhost`
- **API (via proxy)**: `http://localhost/api/...`
- **Swagger UI**: `http://localhost:3001/api-docs`

> Note: most apps use ports `80` + `3001`, so run **one project at a time** unless you change ports.

### Local dev

From inside a project folder:

```bash
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
```

## Projects

| Project | Summary |
| --- | --- |
| [`blog`](./blog) | Blog/CMS with auth, posts, comments, and CSRF protection. |
| [`bookmark-manager`](./bookmark-manager) | Save bookmarks with tags, search/filtering, and CSRF-protected mutations. |
| [`color-pallete-saver`](./color-pallete-saver) | Build and save color palettes per user. |
| [`event-manager`](./event-manager) | Personal event manager with filtering/pagination. |
| [`expense-tracker`](./expense-tracker) | Track expenses with CSV export and CSRF-protected CRUD. |
| [`favorite-manager`](./favorite-manager) | Manage favorites by category (movies/songs/books/etc.) with CSRF token endpoint. |
| [`mini-social-network`](./mini-social-network) | Mini social network: users, posts, likes, comments, follows (+ CSRF + rate limiting). |
| [`password-generator`](./password-generator) | Password generation with optional saved history (auth) and CSRF-protected deletes. |
| [`survey-creator`](./survey-creator) | Create surveys, vote, and view results (public browsing + auth for voting/creation). |
| [`todo-app`](./todo-app) | Todos with pagination/filters/search, Zod validation, and CSRF cookie flow. |
| [`amazon-clone`](./amazon-clone) | Amazon product page clone: product listings, shopping cart (session-based), checkout with CSRF protection. |
