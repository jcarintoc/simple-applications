# LinkedIn Profile Clone

A LinkedIn-inspired professional networking app with profile management, connection requests, and job applications.

## Features

- **Authentication**: JWT-based login/register with automatic token refresh
- **Profile Management**: View and edit your profile (headline, summary, location, industry)
- **Connections**: Send, accept, reject connection requests; view your network
- **Job Listings**: Browse jobs with pagination, apply with optional cover letter
- **CSRF Protection**: Double-submit cookie pattern on all mutations

## Tech Stack

### Backend
- Express 5 + TypeScript
- SQLite with better-sqlite3
- JWT authentication with httpOnly cookies
- Swagger/OpenAPI documentation

### Frontend
- React 19 + TypeScript + Vite
- TanStack Query v5 for data management
- React Hook Form + Zod for validation
- shadcn/ui + Tailwind CSS
- Sonner for toast notifications

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Local Development

**Backend:**
```bash
cd backend
npm install
npm run dev
```
Server runs at `http://localhost:3001`
Swagger UI at `http://localhost:3001/api-docs`

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

### Docker

```bash
docker compose up --build
```
- Frontend: `http://localhost`
- API: `http://localhost/api`
- Swagger: `http://localhost:3001/api-docs`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh tokens |
| GET | `/api/auth/me` | Get current user |

### CSRF
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/csrf-token` | Get CSRF token (sets cookie) |

### Profiles
| Method | Endpoint | CSRF | Description |
|--------|----------|------|-------------|
| GET | `/api/profiles/me` | No | Get my profile |
| GET | `/api/profiles/:userId` | No | Get user profile |
| PUT | `/api/profiles/me` | Yes | Update my profile |

### Connections
| Method | Endpoint | CSRF | Description |
|--------|----------|------|-------------|
| GET | `/api/connections` | No | Get my connections |
| GET | `/api/connections/pending` | No | Get pending requests |
| GET | `/api/connections/sent` | No | Get sent requests |
| GET | `/api/connections/status/:userId` | No | Check connection status |
| POST | `/api/connections/request` | Yes | Send connection request |
| PUT | `/api/connections/:id/accept` | Yes | Accept connection |
| PUT | `/api/connections/:id/reject` | Yes | Reject connection |
| DELETE | `/api/connections/:id` | Yes | Remove connection |

### Jobs
| Method | Endpoint | CSRF | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs` | No | List jobs (paginated) |
| GET | `/api/jobs/:id` | No | Get job details |
| POST | `/api/jobs/:id/apply` | Yes | Apply to job |
| GET | `/api/jobs/applications/my` | No | Get my applications |

## CSRF Protection

All state-changing operations require CSRF token:
1. Frontend fetches `/api/csrf-token` on load (sets `XSRF-TOKEN` cookie)
2. Axios interceptor reads cookie and sends `X-XSRF-TOKEN` header on mutations
3. Backend validates cookie matches header

## Database Schema

- **users**: id, email, password, name
- **profiles**: user_id, headline, summary, location, industry
- **connections**: requester_id, recipient_id, status (pending/accepted/rejected)
- **job_posts**: company_name, job_title, description, location, employment_type, experience_level
- **job_applications**: job_post_id, user_id, status, cover_letter

## Project Structure

```
linkedin-profile/
├── backend/
│   └── src/
│       ├── controllers/    # Route handlers
│       ├── services/       # Business logic
│       ├── repositories/   # Data access
│       ├── middleware/     # Auth, CSRF
│       ├── routes/         # API routes
│       ├── db/             # Database + seed
│       └── types/          # TypeScript types
├── frontend/
│   └── src/
│       ├── components/     # UI components
│       │   ├── profile/
│       │   ├── connections/
│       │   ├── jobs/
│       │   └── ui/         # shadcn components
│       ├── pages/          # Page components
│       ├── lib/
│       │   ├── api/        # API client functions
│       │   └── query/      # TanStack Query hooks
│       └── routes/         # React Router config
└── docker-compose.yml
```
