# Spotify Playlist Clone

A simple Spotify-like app for browsing songs, creating playlists, and managing liked songs.

## Features

- Browse songs (public)
- Search songs by title, artist, or album
- Login/Register to create playlists
- Create, update, delete playlists
- Add/remove songs from playlists (CSRF protected)
- Like/unlike songs (CSRF protected)
- View liked songs

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- TanStack Query
- React Router
- Axios
- Zod validation
- Tailwind CSS v4
- shadcn/ui components
- Lucide icons

**Backend:**
- Node.js + Express 5
- TypeScript
- SQLite (better-sqlite3)
- JWT authentication (access + refresh tokens)
- Cookie-based sessions
- CSRF protection (double-submit cookie pattern)
- Swagger UI

**DevOps:**
- Docker + Docker Compose

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

1. **Setup Backend**
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```
   - API: http://localhost:3001
   - Swagger: http://localhost:3001/api-docs

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - App: http://localhost:5173

### Docker Deployment

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with your secrets

# Build and run
docker-compose up -d --build

# App available at http://localhost
```

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | - | Register new user |
| POST | `/api/auth/login` | - | Login user |
| POST | `/api/auth/refresh` | - | Refresh tokens |
| POST | `/api/auth/logout` | - | Logout user |
| GET | `/api/auth/me` | Required | Get current user |

### Songs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/songs` | Optional | Get all songs |
| GET | `/api/songs/search?q=` | Optional | Search songs |
| GET | `/api/songs/:id` | - | Get song by ID |

### Playlists
| Method | Endpoint | Auth | CSRF | Description |
|--------|----------|------|------|-------------|
| GET | `/api/playlists` | Required | - | Get user playlists |
| GET | `/api/playlists/:id` | Required | - | Get playlist with songs |
| POST | `/api/playlists` | Required | Yes | Create playlist |
| PUT | `/api/playlists/:id` | Required | Yes | Update playlist |
| DELETE | `/api/playlists/:id` | Required | Yes | Delete playlist |
| POST | `/api/playlists/:id/songs/:songId` | Required | Yes | Add song to playlist |
| DELETE | `/api/playlists/:id/songs/:songId` | Required | Yes | Remove song from playlist |

### Likes
| Method | Endpoint | Auth | CSRF | Description |
|--------|----------|------|------|-------------|
| GET | `/api/likes` | Required | - | Get liked songs |
| POST | `/api/likes/:songId` | Required | Yes | Toggle like |

## CSRF Protection

Mutating operations (POST, PUT, DELETE on playlists and likes) require a CSRF token.

1. The server sets a `csrf_token` cookie on every response
2. Include the token in the `x-csrf-token` header for protected requests
3. The server validates that the cookie and header match

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3001
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Docker (`.env` at root)

```env
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost
VITE_API_URL=/api
```

## shadcn/ui Components Used

Make sure to install these shadcn components:
- button
- card
- input
- form
- label
- dialog
- dropdown-menu
- badge
- separator
- checkbox

To install a component:
```bash
npx shadcn@latest add <component-name>
```

## License

MIT
