# Airbnb Listing Clone

A full-stack property listing platform where users can browse properties, create listings, make bookings, and leave reviews.

## Features

- **Public Browsing**: Browse all property listings without authentication
- **Property Listings**: Create and manage your property listings (authenticated)
- **Bookings**: Book properties with date selection and guest count (authenticated + CSRF)
- **Reviews**: Leave reviews for properties you've booked (authenticated + CSRF)
- **Search & Filters**: Filter properties by location, price range, and guest capacity
- **CSRF Protection**: All state-changing operations (create/update/delete) are CSRF-protected

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
- React Hook Form

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

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # App config & Swagger docs
│   │   ├── controllers/    # Route handlers (auth, property, booking, review)
│   │   ├── db/             # Database setup & seed data
│   │   ├── middleware/     # Auth & CSRF middleware
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript types
│   └── data/               # SQLite database (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── booking/    # Booking form component
│   │   │   ├── properties/ # Property card, grid, filters
│   │   │   ├── reviews/    # Review list, form, star rating
│   │   │   └── layout/     # Header component
│   │   ├── lib/
│   │   │   ├── api/        # Axios client & API functions
│   │   │   └── query/      # TanStack Query hooks
│   │   ├── pages/          # Page components
│   │   └── routes/         # Route definitions
│   └── nginx.conf          # Production nginx config
└── docker-compose.yml
```

## Database Schema

### Properties
- Basic info: title, description, location, price per night
- Capacity: max guests, bedrooms, bathrooms
- Amenities: JSON array of amenity strings
- Image URL for property photos

### Bookings
- Property and guest references
- Check-in and check-out dates
- Total price (calculated)
- Status: pending, confirmed, cancelled
- Prevents double booking with availability checks

### Reviews
- One review per user per property (enforced)
- Rating (1-5 stars)
- Comment text
- User information included in responses

## API Endpoints

### Properties (Public)
- `GET /api/properties` - List all properties (with optional filters)
- `GET /api/properties/:id` - Get property details

### Properties (Authenticated)
- `GET /api/properties/owner/my-properties` - Get user's listings
- `POST /api/properties` - Create listing (CSRF)
- `PUT /api/properties/:id` - Update listing (owner only, CSRF)
- `DELETE /api/properties/:id` - Delete listing (owner only, CSRF)

### Bookings (Authenticated)
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking (CSRF)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (CSRF)

### Reviews (Public + Authenticated)
- `GET /api/properties/:id/reviews` - Get reviews for property (public)
- `POST /api/properties/:id/reviews` - Create review (authenticated, CSRF)
- `DELETE /api/reviews/:id` - Delete own review (authenticated, CSRF)

### Auth
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
docker-compose up -d --build

# App available at http://localhost
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

### Property Browsing
- Browse all properties on the home page
- Filter by location, price range, and guest capacity
- View property details with images, amenities, and reviews

### Property Management
- Create property listings with details, amenities, and images
- View and manage your listings
- Delete listings you own

### Booking System
- Select check-in and check-out dates
- Choose number of guests (validated against property capacity)
- Automatic price calculation based on nights and price per night
- Availability validation to prevent double bookings
- Cancel bookings (by guest or property owner)

### Review System
- Leave reviews with 1-5 star ratings
- One review per user per property
- View all reviews for a property
- Delete your own reviews

### Security
- JWT-based authentication with refresh tokens
- CSRF protection on all mutations (POST, PUT, PATCH, DELETE)
- Owner validation for property edits/deletes
- Guest/owner validation for booking cancellations

## Seed Data

The database is automatically seeded with 10 sample properties on first run, owned by a default user account.

## License

MIT
