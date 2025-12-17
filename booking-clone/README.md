# Booking.com Clone

A hotel booking platform clone with search, reservations, reviews, and saved properties.

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- TanStack Query
- React Router
- React Hook Form + Zod
- Axios
- Tailwind CSS v4
- shadcn/ui components
- Lucide icons

**Backend:**
- Node.js + Express 5
- TypeScript
- SQLite (better-sqlite3)
- JWT authentication (access + refresh tokens)
- CSRF token protection
- Swagger UI

## Features

- Browse and search hotels by location, dates, and guests
- Hotel detail pages with image gallery and amenities
- Booking system with CSRF protection
- Review system (only for completed stays)
- Save properties to favorites
- User authentication (login/register)
- Responsive design

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # App config & Swagger docs
│   │   ├── controllers/    # Route handlers
│   │   ├── db/             # Database setup & seed script
│   │   ├── middleware/     # Auth middleware
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript types
│   └── data/               # SQLite database (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── booking/    # Booking form & card
│   │   │   ├── hotels/     # Hotel grid, card, amenities
│   │   │   ├── layout/     # Header, Footer
│   │   │   ├── reviews/    # Review form & list
│   │   │   ├── routes/     # Protected/Public route guards
│   │   │   ├── search/     # Search form
│   │   │   └── ui/         # shadcn components
│   │   ├── lib/
│   │   │   ├── api/        # API functions & types
│   │   │   └── query/      # TanStack Query hooks
│   │   ├── pages/          # Page components
│   │   └── routes/         # Route definitions
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
   cp .env.example .env
   npm install
   npm run seed   # Seed sample hotels
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
cp .env.example .env
docker-compose up -d --build
# App available at http://localhost
```

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | - | Register new user |
| POST | `/api/auth/login` | - | Login user |
| POST | `/api/auth/refresh` | - | Refresh tokens |
| POST | `/api/auth/logout` | - | Logout user |
| GET | `/api/auth/me` | Required | Get current user |

### Hotels
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/hotels` | - | List hotels (with search/filter) |
| GET | `/api/hotels/:id` | - | Get hotel details |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/bookings` | Required | Get user's bookings |
| POST | `/api/bookings` | Required | Create booking (CSRF) |
| DELETE | `/api/bookings/:id` | Required | Cancel booking |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reviews/hotel/:hotelId` | - | Get hotel reviews |
| POST | `/api/reviews` | Required | Create review (CSRF) |
| DELETE | `/api/reviews/:id` | Required | Delete review |

### Saved Properties
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/saved` | Required | Get saved properties |
| POST | `/api/saved/:hotelId` | Required | Save property |
| DELETE | `/api/saved/:hotelId` | Required | Unsave property |

### CSRF
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/csrf/token` | Required | Get CSRF token |

## shadcn Components Used

- alert-dialog
- badge
- button
- calendar
- card
- dialog
- form
- input
- label
- popover
- select
- separator
- sheet
- skeleton
- slider
- tabs
- textarea
- toast

## License

MIT
