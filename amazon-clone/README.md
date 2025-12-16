# Amazon Product Page Clone

A simplified Amazon product page clone with product listings, shopping cart, and checkout functionality. Built with React, Express, and SQLite.

## Features

- **Product Catalog**
  - Browse products with images, prices, and reviews
  - Filter by category
  - Search functionality
  - Product detail pages with reviews

- **Shopping Cart**
  - Session-based cart (works for anonymous users)
  - Add, update, and remove items
  - Persistent cart that migrates to user account on login
  - CSRF protection on cart operations

- **Authentication**
  - User registration and login
  - JWT-based authentication (access + refresh tokens)
  - Protected checkout and order history

- **Checkout & Orders**
  - Checkout requires authentication
  - Order creation with stock management
  - Order history page
  - CSRF protection on checkout

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

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # App config & Swagger docs
│   │   ├── controllers/    # Route handlers (auth, product, cart, order)
│   │   ├── db/             # Database setup & seed data
│   │   ├── middleware/     # Auth, CSRF, session middleware
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript types
│   └── data/               # SQLite database (gitignored)
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components (products, cart, layout)
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
   - Database will be automatically seeded with 15 sample products on first run

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

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | - | List products (with category/search filters) |
| GET | `/api/products/:id` | - | Get product details with reviews |
| GET | `/api/products/categories` | - | Get all categories |

### Cart
| Method | Endpoint | Auth | CSRF | Description |
|--------|----------|------|------|-------------|
| GET | `/api/cart` | - | - | Get cart items |
| POST | `/api/cart` | - | ✅ | Add item to cart |
| PUT | `/api/cart/:id` | - | ✅ | Update cart item quantity |
| DELETE | `/api/cart/:id` | - | ✅ | Remove cart item |
| DELETE | `/api/cart` | - | ✅ | Clear cart |

### Orders
| Method | Endpoint | Auth | CSRF | Description |
|--------|----------|------|------|-------------|
| POST | `/api/orders/checkout` | ✅ | ✅ | Place order |
| GET | `/api/orders` | ✅ | - | Get user orders |
| GET | `/api/orders/:id` | ✅ | - | Get order details |

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | - | Register new user |
| POST | `/api/auth/login` | - | Login user |
| POST | `/api/auth/refresh` | - | Refresh tokens |
| POST | `/api/auth/logout` | - | Logout user |
| GET | `/api/auth/me` | ✅ | Get current user |

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

## Database Schema

- `users` - User accounts
- `products` - Product catalog (seeded with 15 items)
- `reviews` - Product reviews (seeded)
- `cart_items` - Shopping cart items (session or user-based)
- `orders` - User orders
- `order_items` - Order line items

## Features in Detail

### Session-Based Cart
- Anonymous users get a session ID cookie
- Cart persists across page refreshes
- When user logs in, cart automatically migrates to their account

### CSRF Protection
- CSRF token set in cookie on page load
- Required for all cart mutations and checkout
- Token automatically included in axios requests

### Stock Management
- Products have stock levels
- Stock checked when adding to cart
- Stock decremented on checkout

## License

MIT