# Order Management

A full-stack Order Management feature for a food delivery application. Users can browse a menu, add food items to a cart, checkout with delivery details, place an order, and track the order status in real time.

This project was built as a Full Stack Developer assessment with a focus on clean architecture, validation, testability, and maintainable code.

## Overview

The application contains:

- Menu browsing with food images, descriptions, and prices
- Shopping cart with quantity updates, item removal, and total calculation
- Checkout flow with delivery details and frontend validation
- REST APIs for menu retrieval, order creation, order lookup, and status updates
- PostgreSQL database modeled with Prisma ORM
- Real-time order tracking using Socket.IO
- Backend tests using Jest and Supertest
- Frontend tests using Vitest and React Testing Library

## Architecture

### Backend

The backend follows a layered architecture:

```text
Route
  -> Controller
    -> Service
      -> Repository
        -> Prisma
          -> PostgreSQL
```

Responsibilities:

- Routes define endpoint paths and middleware.
- Controllers handle HTTP request and response concerns.
- Services contain business rules such as order totals and status transitions.
- Repositories isolate database access.
- Prisma handles database queries and schema mapping.
- Middleware handles async errors, validation errors, and unknown routes.

### Frontend

The frontend follows a feature-oriented React structure:

```text
Page
  -> Feature Components
    -> Hooks
      -> API Layer / Context / Socket Client
```

Responsibilities:

- Pages compose complete screens.
- Feature components render domain-specific UI.
- Common components handle shared UI states.
- Hooks encapsulate data loading, cart access, and realtime tracking.
- API modules isolate Axios calls.
- Context manages client-side cart state.

### Real-Time Tracking

Socket.IO is used for order tracking. The frontend subscribes to an order-specific room using the order ID. When the backend updates the order status, it emits an event to that room and the tracking page updates immediately.

Socket.IO was chosen because it provides:

- bidirectional event communication
- automatic reconnection
- room-based subscriptions
- a simple client API
- better realtime UX than polling

Alternatives considered:

- Server-Sent Events: simpler for one-way updates, but less flexible
- Polling: easiest to implement, but less efficient and less realtime
- Native WebSocket: lightweight, but requires more custom connection handling

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO
- Zod
- Jest
- Supertest
- Pino
- Helmet
- CORS

### Frontend

- React
- TypeScript
- Vite
- Material UI
- React Router
- Axios
- Socket.IO Client
- Zod
- Vitest
- React Testing Library

## Folder Structure

```text
order-management/
  packages/
    shared/
      src/                  # Shared API/domain TypeScript contracts

  client/
    src/
      api/                  # Axios and Socket.IO clients
      app/                  # App bootstrap, providers, routing
      components/           # Shared layout and common UI components
      config/               # Frontend environment config
      context/              # React context providers
      features/             # Domain features: menu, cart, checkout, orders
      hooks/                # Reusable React hooks
      pages/                # Route-level pages
      styles/               # Global styles
      theme/                # Material UI theme
      types/                # Frontend-only TypeScript types
      utils/                # Utility helpers

  server/
    prisma/
      migrations/           # Prisma migration SQL
      schema.prisma         # Database schema
      seed.js               # Database seed runner
      menu-seed.js          # Menu seed data
    src/
      config/               # Env, logger, Prisma, Socket.IO config
      controllers/          # HTTP controllers
      middleware/           # Express middleware
      repositories/         # Prisma data access layer
      routes/               # Express route definitions
      schemas/              # Zod validation schemas
      services/             # Business logic and realtime services
      test/                 # Backend tests
      types/                # Type declarations
```

## Installation

### Prerequisites

- Node.js
- npm
- PostgreSQL

### 1. Clone the Repository

```bash
git clone <repository-url>
cd order-management
```

### 2. Install Backend Dependencies

```bash
npm install
```

The repository uses npm workspaces, so this installs dependencies for the backend, frontend, and shared contracts package.

### 3. Configure Backend Environment

Create `server/.env` from `server/.env.example`.

```bash
cp server/.env.example server/.env
```

Update `DATABASE_URL` if your PostgreSQL credentials differ.

### 4. Start PostgreSQL

You can use either Docker PostgreSQL or an existing local PostgreSQL installation.

Option A: Docker PostgreSQL

```bash
docker compose up -d postgres
```

This starts a local PostgreSQL database using the credentials from `docker-compose.yml`.

Option B: Local PostgreSQL

If PostgreSQL is already installed locally, make sure the service is running and update `server/.env` with your local credentials:

```env
DATABASE_URL="postgresql://postgres:<your-password>@localhost:5432/order_management?schema=public"
```

Create the `order_management` database in pgAdmin or with `psql` before running migrations.

### 5. Run Database Migration

```bash
npm run db:migrate
```

### 6. Seed Menu Data

```bash
npm run db:seed
```

### 7. Configure Frontend Environment

Create `client/.env` from `client/.env.example`.

```bash
cp client/.env.example client/.env
```

The default frontend environment already points to the local backend:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

### 8. Start The App

From the repository root:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:4000
```

The frontend runs on:

```text
http://localhost:5173
```

If you prefer separate terminals, you can run each app independently:

```bash
npm run dev:server
npm run dev:client
```

## Environment Variables

A root [.env.example](./.env.example) is provided as a single reference for both apps. The backend and frontend still load their own environment files from `server/.env` and `client/.env`.

## API Documentation

API request and response types are centralized in `packages/shared` and consumed by the frontend. This reduces frontend/backend contract drift while keeping the backend implementation independent from React.

Base URL:

```text
http://localhost:4000/api
```

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

### Get Menu

```http
GET /menu
```

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Margherita Pizza",
      "description": "Classic pizza with tomato sauce, mozzarella, basil, and olive oil.",
      "priceCents": 899,
      "imageUrl": "https://example.com/image.jpg",
      "isAvailable": true,
      "createdAt": "2026-08-03T08:00:00.000Z",
      "updatedAt": "2026-08-03T08:00:00.000Z"
    }
  ]
}
```

### Create Order

```http
POST /orders
```

Request:

```json
{
  "customer": {
    "name": "Ankit Sharma",
    "phone": "9876543210",
    "address": "123 Main Street, Bengaluru"
  },
  "items": [
    {
      "menuItemId": "uuid",
      "quantity": 2
    }
  ]
}
```

Response:

```json
{
  "data": {
    "id": "uuid",
    "status": "ORDER_RECEIVED",
    "subtotalCents": 1798,
    "items": [],
    "statusHistory": []
  }
}
```

### Get Order By ID

```http
GET /orders/:id
```

Response:

```json
{
  "data": {
    "id": "uuid",
    "status": "PREPARING",
    "deliveryName": "Ankit Sharma",
    "deliveryPhone": "9876543210",
    "deliveryAddress": "123 Main Street, Bengaluru",
    "subtotalCents": 1798,
    "items": [],
    "statusHistory": []
  }
}
```

### Update Order Status

```http
PATCH /orders/:id/status
```

This endpoint is included for the assessment as an internal/admin simulation endpoint. In a production system it should be protected by authentication and authorization, and normal customers should not be able to manually update order status.

Request:

```json
{
  "status": "PREPARING"
}
```

Supported statuses:

```text
ORDER_RECEIVED
PREPARING
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
```

Response:

```json
{
  "data": {
    "id": "uuid",
    "status": "PREPARING"
  }
}
```

### Error Response

```json
{
  "message": "Validation failed",
  "errors": {
    "items": ["Order must contain at least one item"]
  }
}
```

Common status codes:

- `200`: success
- `201`: created
- `400`: validation error
- `429`: rate limit exceeded
- `404`: resource not found
- `409`: invalid status transition
- `500`: internal server error

## Rate Limiting

The backend applies rate limiting to reduce abuse of public endpoints:

- Global `/api` limiter: `RATE_LIMIT_MAX_REQUESTS` per `RATE_LIMIT_WINDOW_MS`
- Stricter `POST /api/orders` limiter: `ORDER_CREATE_RATE_LIMIT_MAX_REQUESTS` per `ORDER_CREATE_RATE_LIMIT_WINDOW_MS`

When a client exceeds the limit, the API returns HTTP `429` with a JSON response:

```json
{
  "message": "Too many requests. Please try again later."
}
```

## CORS

The backend uses a production-ready CORS allowlist. Configure one or more allowed browser origins with a comma-separated `CORS_ORIGIN` value:

```env
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com
```

Requests from configured origins receive the appropriate CORS response headers. Requests from unknown browser origins are rejected with HTTP `403`:

```json
{
  "message": "Origin is not allowed by CORS"
}
```

Requests without an `Origin` header are allowed so server-to-server calls, health checks, and local tools such as curl or Supertest continue to work.

## Security Considerations

Authentication and authorization are intentionally out of scope for this assessment. In a production system, viewing orders should require authentication, updating order status should require authorization, and Socket.IO order subscriptions should verify that the connected user owns or is allowed to access the requested order. These controls were not implemented because the assessment focuses on the order management feature, API design, validation, testing, and realtime status simulation.

## Socket.IO Events

### Subscribe To Order Updates

Client emits:

```text
order:subscribe
```

Payload:

```json
{
  "orderId": "uuid"
}
```

### Order Status Updated

Server emits:

```text
order:status-updated
```

Payload:

```json
{
  "orderId": "uuid",
  "status": "OUT_FOR_DELIVERY",
  "updatedAt": "2026-08-03T08:05:00.000Z"
}
```

### Unsubscribe

Client emits:

```text
order:unsubscribe
```

Payload:

```json
{
  "orderId": "uuid"
}
```

## Testing

### Backend

```bash
npm run test:server
```

Backend tests cover:

- health endpoint
- menu retrieval
- order validation
- order creation
- order status updates
- service-level business rules
- schema validation

### Frontend

```bash
npm run test:client
```

Frontend tests cover:

- menu rendering
- add to cart
- update cart quantity
- remove cart item
- checkout validation
- successful order submission
- Socket.IO status update rendering

### Why These Tests Matter

- Menu tests verify that customers can see backend-provided food items and add them to the cart.
- Cart tests verify the client-side state rules for add, update, remove, clear, and total calculation.
- Checkout tests verify validation, API submission, loading/success behavior, and cart clearing after success.
- Order tracking tests verify that realtime Socket.IO events update the visible order status.
- Backend API tests verify that the public REST contract works through routes, controllers, services, and repositories.
- Backend service tests verify business rules such as duplicate item merging, total calculation, invalid menu items, and invalid status transitions.

## Deployment

### Backend

Recommended deployment targets:

- Render
- Railway
- Fly.io
- AWS ECS
- Heroku-compatible Node hosting

Backend deployment steps:

1. Set production environment variables.
2. Provision PostgreSQL.
3. Run Prisma migrations.
4. Run seed script if needed.
5. Build the backend.
6. Start `dist/server.js`.

Commands:

```bash
npm run build:server
npm run db:migrate
npm start -w server
```

### Frontend

Recommended deployment targets:

- Vercel
- Netlify
- Cloudflare Pages
- Static hosting behind a CDN

Frontend deployment steps:

1. Set `VITE_API_BASE_URL`.
2. Set `VITE_SOCKET_URL`.
3. Build the frontend.
4. Deploy the `dist` directory.

Commands:

```bash
npm run build:client
```

The frontend uses route-level lazy loading for the main pages so the initial bundle stays smaller. Material UI is still a significant dependency, so further bundle optimization can be done by reviewing icon imports and adding deeper component-level code splitting if needed.

## Screenshots

Add screenshots before final submission:

```text
docs/screenshots/menu-page.png
docs/screenshots/cart-checkout-page.png
docs/screenshots/order-success-page.png
docs/screenshots/order-tracking-page.png
```

Suggested sections:

### Menu Page

Placeholder for menu page screenshot.

### Checkout Page

Placeholder for cart and checkout screenshot.

### Order Tracking Page

Placeholder for realtime tracking screenshot.

## Database Design

Main tables:

- `menu_items`
- `customers`
- `orders`
- `order_items`
- `order_status_history`

Important design choices:

- Prices are stored in cents to avoid floating-point currency issues.
- `order_items` stores item snapshots so historical orders do not change when menu data changes.
- `orders.status` stores the current status for quick reads.
- `order_status_history` stores the full timeline of status changes.
- Foreign keys protect relational integrity.
- Check constraints enforce positive prices and quantities.

## Assumptions

- Authentication is out of scope for this assessment.
- Menu data is seeded by the backend.
- Cart state is managed on the frontend.
- Payment is out of scope.
- Order status updates are simulated by the backend.
- `PATCH /orders/:id/status` is treated as an internal/admin simulation endpoint.
- Delivery fees, taxes, coupons, and inventory management are out of scope.

## Future Improvements

- Persist cart state to `localStorage`.
- Add authentication and order ownership checks.
- Protect status update APIs behind admin authorization.
- Add request IDs for better log tracing.
- Add stronger Socket.IO authorization and order ownership checks.
- Move simulated status progression to a queue/worker.
- Add Redis adapter for horizontally scaled Socket.IO.
- Add pagination and filtering for future order lists.
- Further optimize frontend bundle size by reviewing Material UI and icon imports.
- Add CI workflow for lint, build, and tests.

## Root Scripts

The repository includes root-level orchestration scripts:

```bash
npm run dev:server
npm run dev:client
npm run build
npm test
npm run lint
npm run db:up
npm run db:migrate
npm run db:seed
```

## AI Usage

AI assistance was used to accelerate:

- requirement analysis
- architecture planning
- schema design
- code scaffolding
- test planning
- code review and improvement suggestions

Final implementation decisions, validation rules, trade-offs, and architecture boundaries were reviewed from a senior engineering perspective.
