# Gmail Clone (Email Inbox)

A simplified Gmail-like email inbox clone with email CRUD operations, folder management, and CSRF protection.

## Features

- **Authentication Required**
  - Login required to view inbox
  - User registration and authentication

- **Email Management**
  - Send emails to other users
  - View inbox, sent, archive, and trash folders
  - Mark emails as read/unread
  - Archive and unarchive emails
  - Delete emails (moves to trash)
  - Restore from trash
  - Permanently delete from trash

- **Security**
  - CSRF protection on all email actions (send, mark read/unread, archive, delete, etc.)
  - JWT-based authentication (access + refresh tokens)

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
- CSRF protection
- Swagger UI

**DevOps:**
- Docker + Docker Compose

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # App config & Swagger docs
│   │   ├── controllers/    # Route handlers (auth, email, user)
│   │   ├── db/             # Database setup
│   │   ├── middleware/     # Auth, CSRF middleware
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript types
│   └── data/               # SQLite database (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components (email, auth, layout)
│   │   ├── lib/
│   │   │   ├── api/        # Axios client & API functions
│   │   │   └── query/      # TanStack Query hooks
│   │   ├── pages/          # Page components
│   │   └── routes/         # Route definitions
│   └── nginx.conf          # Production nginx config
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

## API Endpoints

### Emails
| Method | Endpoint | Auth | CSRF | Description |
|--------|----------|------|------|-------------|
| GET | `/api/emails?folder=inbox` | Yes | No | Get emails by folder |
| GET | `/api/emails/:id` | Yes | No | Get email details |
| POST | `/api/emails` | Yes | Yes | Send new email |
| PATCH | `/api/emails/:id/read` | Yes | Yes | Mark as read |
| PATCH | `/api/emails/:id/unread` | Yes | Yes | Mark as unread |
| PATCH | `/api/emails/:id/archive` | Yes | Yes | Archive email |
| PATCH | `/api/emails/:id/unarchive` | Yes | Yes | Unarchive email |
| DELETE | `/api/emails/:id` | Yes | Yes | Move to trash |
| PATCH | `/api/emails/:id/restore` | Yes | Yes | Restore from trash |
| DELETE | `/api/emails/:id/permanent` | Yes | Yes | Permanently delete |
| GET | `/api/emails/unread-count` | Yes | No | Get unread count |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/search?q=` | Yes | Search users by email/name |

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/refresh` | No | Refresh tokens |
| POST | `/api/auth/logout` | No | Logout user |
| GET | `/api/auth/me` | Yes | Get current user |

## Database Schema

- `users` - User accounts
- `emails` - Email messages with from/to, subject, body, flags (read, archived, deleted)

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

## Features in Detail

### Email Folders
- **Inbox**: Received emails that are not archived or deleted
- **Sent**: Emails sent by the user
- **Archive**: Archived emails (only received emails can be archived)
- **Trash**: Deleted emails (both sent and received)

### CSRF Protection
- CSRF token set in cookie on page load
- Required for all email mutations (send, mark read, archive, delete, etc.)
- Token automatically included in axios requests

## License

MIT