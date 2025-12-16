# YouTube Clone

A full-stack YouTube clone with video uploads, likes, comments, and playlist management.

## Features

- Video listing with placeholder thumbnails
- Video upload (MP4, WebM, OGG, MOV - max 100MB)
- Like/unlike videos (authenticated users)
- Comment on videos (authenticated users)
- Playlist management (create, add/remove videos)
- CSRF protection on all mutations
- JWT authentication with refresh tokens

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- TanStack Query
- React Router v7
- Axios with CSRF token handling
- Zod validation
- Tailwind CSS v4
- shadcn/ui components
- Lucide React icons

**Backend:**
- Node.js + Express 5
- TypeScript
- SQLite (better-sqlite3)
- JWT authentication
- Multer for file uploads
- CSRF protection
- Swagger UI

**DevOps:**
- Docker + Docker Compose

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/           # App config & Swagger docs
│   │   ├── controllers/      # Route handlers
│   │   ├── db/               # Database setup (SQLite)
│   │   ├── middleware/       # Auth, CSRF, upload middleware
│   │   ├── repositories/     # Data access layer
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── types/            # TypeScript types & Zod schemas
│   ├── uploads/              # Video file storage
│   └── data/                 # SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/         # Auth forms
│   │   │   ├── comments/     # Comment components
│   │   │   ├── layout/       # Header, Sidebar
│   │   │   ├── playlists/    # Playlist components
│   │   │   ├── routes/       # Route guards
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   └── videos/       # Video components
│   │   ├── lib/
│   │   │   ├── api/          # Axios client & API functions
│   │   │   └── query/        # TanStack Query hooks
│   │   ├── pages/            # Page components
│   │   └── routes/           # Route definitions
│   └── nginx.conf
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

1. **Setup Backend**
   ```bash
   cd backend
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
docker-compose up -d --build

# App available at http://localhost
```

## API Endpoints

### Auth
| Method | Endpoint | Auth | CSRF | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | No | No | Register user |
| POST | `/api/auth/login` | No | No | Login user |
| POST | `/api/auth/refresh` | No | No | Refresh tokens |
| POST | `/api/auth/logout` | No | No | Logout user |
| GET | `/api/auth/me` | Yes | No | Get current user |

### CSRF
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/csrf-token` | No | Get CSRF token |

### Videos
| Method | Endpoint | Auth | CSRF | Description |
|--------|----------|------|------|-------------|
| GET | `/api/videos` | No | No | List videos |
| GET | `/api/videos/:id` | No | No | Get video details |
| POST | `/api/videos` | Yes | Yes | Upload video |
| PUT | `/api/videos/:id` | Yes | Yes | Update video |
| DELETE | `/api/videos/:id` | Yes | Yes | Delete video |
| POST | `/api/videos/:id/view` | No | No | Increment views |
| GET | `/api/videos/search` | No | No | Search videos |

### Likes
| Method | Endpoint | Auth | CSRF | Description |
|--------|----------|------|------|-------------|
| POST | `/api/videos/:videoId/like` | Yes | Yes | Like video |
| DELETE | `/api/videos/:videoId/like` | Yes | Yes | Unlike video |

### Comments
| Method | Endpoint | Auth | CSRF | Description |
|--------|----------|------|------|-------------|
| GET | `/api/videos/:videoId/comments` | No | No | Get comments |
| POST | `/api/videos/:videoId/comments` | Yes | Yes | Add comment |
| PUT | `/api/comments/:id` | Yes | Yes | Edit comment |
| DELETE | `/api/comments/:id` | Yes | Yes | Delete comment |

### Playlists
| Method | Endpoint | Auth | CSRF | Description |
|--------|----------|------|------|-------------|
| GET | `/api/playlists` | Yes | No | Get user's playlists |
| GET | `/api/playlists/:id` | Optional | No | Get playlist |
| POST | `/api/playlists` | Yes | Yes | Create playlist |
| PUT | `/api/playlists/:id` | Yes | Yes | Update playlist |
| DELETE | `/api/playlists/:id` | Yes | Yes | Delete playlist |
| POST | `/api/playlists/:id/videos` | Yes | Yes | Add video |
| DELETE | `/api/playlists/:playlistId/videos/:videoId` | Yes | Yes | Remove video |

## shadcn/ui Components Used

Already installed:
- button, card, input, form, label, dialog, badge, separator, checkbox, field

To install for full functionality:
```bash
npx shadcn@latest add dropdown-menu avatar skeleton sonner textarea progress scroll-area aspect-ratio tooltip sheet select switch tabs alert-dialog
```

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

## License

MIT
