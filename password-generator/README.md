# Node Express SQLite React TypeScript Template

A full-stack template with JWT authentication (access + refresh tokens), React frontend, and Express backend.

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

**Backend:**
- Node.js + Express 5
- TypeScript
- SQLite (better-sqlite3)
- JWT authentication (access + refresh tokens)
- Cookie-based sessions
- Swagger UI

**DevOps:**
- Docker + Docker Compose

## Features

- Access token (15min) + Refresh token (7d) authentication
- Automatic token refresh on expiry
- Protected and public route guards
- Login, Register, Dashboard pages
- Swagger UI for API testing (`/api-docs`)
- Docker ready

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # App config & Swagger docs
│   │   ├── controllers/    # Route handlers
│   │   ├── db/             # Database setup
│   │   ├── middleware/     # Auth middleware
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript types
│   └── data/               # SQLite database (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/     # UI & route components
│   │   ├── context/        # React context (Auth)
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
docker-compose up -d --build

# App available at http://localhost
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | - | Register new user |
| POST | `/api/auth/login` | - | Login user |
| POST | `/api/auth/refresh` | - | Refresh tokens |
| POST | `/api/auth/logout` | - | Logout user |
| GET | `/api/auth/me` | Required | Get current user |
| GET | `/api/health` | - | Health check |

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

## Creating a New App from This Template

1. Copy the template folder
2. Update these files:
   - `docker-compose.yml` - Change container names
   - `backend/package.json` - Update name/description
   - `frontend/package.json` - Update name
   - `backend/src/config/swagger.ts` - Update API title
3. Delete `backend/data/app.db` if exists
4. Generate new JWT secrets for production

## Adding New Features

### Adding a new API endpoint

1. Create type in `backend/src/types/index.ts`
2. Create repository in `backend/src/repositories/`
3. Create service in `backend/src/services/`
4. Create controller in `backend/src/controllers/`
5. Create route in `backend/src/routes/`
6. Update `backend/src/config/swagger.ts`

### Adding a new protected page

1. Create page in `frontend/src/pages/`
2. Export from `frontend/src/pages/index.ts`
3. Add route inside `<ProtectedRoute>` in `frontend/src/routes/index.tsx`

### Adding a new public page

1. Create page in `frontend/src/pages/`
2. Export from `frontend/src/pages/index.ts`
3. Add route inside `<PublicRoute>` in `frontend/src/routes/index.tsx`

## Scripts

### Backend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## License

MIT
