# Reddit Clone

A Reddit clone with subreddits, posts, nested comments, and voting functionality.

## Features

- **Subreddits**: Create and browse communities (subreddits)
- **Posts**: Create posts in subreddits (authentication required)
- **Comments**: Nested comment threads with parent_id support
- **Votes**: Upvote posts and comments (toggle behavior)
- **CSRF Protection**: All mutations (create/update/delete/vote) require CSRF tokens

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

- **subreddits**: Communities created by users
- **posts**: Posts in subreddits with upvotes
- **comments**: Nested comments with parent_id for threading
- **votes**: One vote per user per post/comment

## API Endpoints

### Subreddits
- `GET /api/subreddits` - Get all subreddits (public)
- `GET /api/subreddits/:id` - Get subreddit by ID (public)
- `POST /api/subreddits` - Create subreddit (auth + CSRF)
- `PUT /api/subreddits/:id` - Update subreddit (auth + ownership + CSRF)
- `DELETE /api/subreddits/:id` - Delete subreddit (auth + ownership + CSRF)

### Posts
- `GET /api/posts` - Get all posts (public, can filter by subreddit_id)
- `GET /api/posts/:id` - Get post by ID (public)
- `POST /api/posts` - Create post (auth + CSRF)
- `PUT /api/posts/:id` - Update post (auth + ownership + CSRF)
- `DELETE /api/posts/:id` - Delete post (auth + ownership + CSRF)
- `POST /api/posts/:id/upvote` - Toggle upvote on post (auth + CSRF)

### Comments
- `GET /api/posts/:postId/comments` - Get comments for post (public, flat list)
- `GET /api/comments/:id` - Get comment by ID (public)
- `POST /api/posts/:postId/comments` - Create comment (auth + CSRF)
- `PUT /api/comments/:id` - Update comment (auth + ownership + CSRF)
- `DELETE /api/comments/:id` - Delete comment (auth + ownership + CSRF)
- `POST /api/comments/:id/upvote` - Toggle upvote on comment (auth + CSRF)

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

- `/` - Home page (all posts)
- `/subreddits` - Browse all subreddits
- `/subreddits/create` - Create subreddit (protected)
- `/r/:name` - View subreddit and its posts
- `/r/:name/submit` - Create post in subreddit (protected)
- `/submit` - Create post (protected)
- `/posts/:id` - View post details and comments
- `/login` - Login page
- `/register` - Register page

## Seed Data

The database is automatically seeded with:
- 5 sample subreddits (programming, webdev, javascript, react, technology)
- 15 sample posts across those subreddits

Default user credentials:
- Email: `reddit@example.com`
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
