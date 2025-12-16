# Instagram Clone

An Instagram clone with photo feed, likes/comments, follow/unfollow, and story viewing.

## Features

- **Photo Feed**: View posts from users you follow
- **Posts**: Create posts with image URL and caption (authentication required)
- **Likes/Comments**: Like and comment on posts (CSRF protected)
- **Follow/Unfollow**: Follow/unfollow users (CSRF protected)
- **Stories**: View active stories (auth required), expire after 24 hours
- **User Profiles**: View user profiles with their posts

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
- CSRF protection
- Swagger UI

**DevOps:**
- Docker + Docker Compose

## Database Schema

- **posts**: Photo posts with image URL, caption, and likes count
- **comments**: Comments on posts
- **likes**: One like per user per post
- **follows**: Follow relationships between users
- **stories**: Stories that expire after 24 hours

## API Endpoints

### Posts
- `GET /api/posts/feed` - Get feed (auth required)
- `GET /api/posts` - Get all posts (public, can filter by user_id)
- `GET /api/posts/:id` - Get post by ID (public)
- `GET /api/users/:userId/posts` - Get posts by user (public)
- `POST /api/posts` - Create post (auth + CSRF)
- `PUT /api/posts/:id` - Update post (auth + ownership + CSRF)
- `DELETE /api/posts/:id` - Delete post (auth + ownership + CSRF)
- `POST /api/posts/:id/like` - Toggle like on post (auth + CSRF)

### Comments
- `GET /api/posts/:postId/comments` - Get comments for post (public)
- `POST /api/posts/:postId/comments` - Create comment (auth + CSRF)
- `PUT /api/comments/:id` - Update comment (auth + ownership + CSRF)
- `DELETE /api/comments/:id` - Delete comment (auth + ownership + CSRF)

### Follows
- `POST /api/users/:userId/follow` - Follow user (auth + CSRF)
- `DELETE /api/users/:userId/follow` - Unfollow user (auth + CSRF)
- `GET /api/users/:userId/following` - Get users that userId follows (public)
- `GET /api/users/:userId/followers` - Get users following userId (public)
- `GET /api/users/:userId/following/check` - Check if current user follows userId (auth)

### Stories
- `GET /api/stories` - Get active stories (auth required)
- `GET /api/users/:userId/stories` - Get active stories by user (auth required)

### Users
- `GET /api/users/search?q=query` - Search users by name or email (public)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh tokens
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

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
docker compose up -d --build

# App available at http://localhost
```

## Routes

- `/` - Home page (feed) - protected
- `/search` - Search users (protected)
- `/profile/:userId` - User profile page (public)
- `/create-post` - Create post (protected)
- `/stories` - View active stories (protected)
- `/login` - Login page
- `/register` - Register page

## Seed Data

The database is automatically seeded with:
- 7 sample users
- 20 sample posts (distributed across users)
- 28 sample comments
- Follow relationships between users
- 15 stories (8 active, 7 expired)

Default user credentials:
- Email: `alice@example.com` (or any of the seeded users)
- Password: `password`

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

## License

MIT
