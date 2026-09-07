# NOVA Store — Technical Documentation

Version: 1.0
Last updated: 2026

This document provides in-depth technical documentation for the NOVA Store platform, covering system design, data models, API contracts, and operational guidelines. For a quick project overview, see `README.md`.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Data Models](#3-data-models)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [API Reference](#5-api-reference)
6. [Business Logic Rules](#6-business-logic-rules)
7. [Error Handling](#7-error-handling)
8. [Environment Configuration](#8-environment-configuration)
9. [Local Development Setup](#9-local-development-setup)
10. [Testing Strategy](#10-testing-strategy)
11. [Security Guidelines](#11-security-guidelines)
12. [Deployment Considerations](#12-deployment-considerations)
13. [Roadmap](#13-roadmap)

---

## 1. System Overview

NOVA Store is a full-stack e-commerce application composed of two independently deployable units:

| Component | Description |
|---|---|
| **Backend API** | Node.js / Express REST API responsible for authentication, product/category management, cart operations, and order processing |
| **Frontend App** | React (Vite + TypeScript) single-page application consuming the backend API |

The system supports two user roles — **customer** and **admin** — with role-based access control enforced at the middleware level.

---

## 2. Architecture

### 2.1 Backend Layering

The backend follows a strict layered architecture to keep concerns isolated and testable:

```
Request
  │
  ▼
Routes        → defines endpoints, binds middleware
  │
  ▼
Middleware    → auth, validation, error handling
  │
  ▼
Controller    → parses request, calls service, shapes response
  │
  ▼
Service       → business logic, orchestration
  │
  ▼
Model         → Mongoose schema / data access
  │
  ▼
MongoDB
```

**Design rationale:**
- **Routes** stay declarative — no logic beyond wiring endpoints to controllers and middleware.
- **Controllers** are thin — they never contain business rules directly.
- **Services** own all business logic (e.g., stock checks, total calculation), making them unit-testable independent of HTTP.
- **Models** are the single source of truth for schema shape and validation at the database level.

### 2.2 Frontend Structure

```
src/
├── components/   → reusable UI building blocks
├── pages/        → route-level views
├── hooks/        → shared stateful logic
├── services/     → API client functions (Axios)
├── types/        → shared TypeScript types/interfaces
└── schemas/      → Zod validation schemas for forms
```

Data fetching and caching are handled via **TanStack Query**, with form state and validation handled via **React Hook Form + Zod**.

---

## 3. Data Models

### 3.1 User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Hashed before storage |
| `role` | Enum: `customer`, `admin` | Defaults to `customer` |
| `createdAt` / `updatedAt` | Date | Timestamps |

### 3.2 Product

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `price` | Number | Required, ≥ 0 |
| `category` | ObjectId (ref: Category) | Required |
| `stock` | Number | Required, ≥ 0 |
| `createdAt` / `updatedAt` | Date | Timestamps |

### 3.3 Category

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, unique |
| `createdAt` / `updatedAt` | Date | Timestamps |

### 3.4 Cart

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId (ref: User) | One cart per user |
| `items` | Array of `{ product, quantity }` | Product references, live quantities |

### 3.5 Order

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId (ref: User) | Order owner |
| `items` | Array of `{ product, name, price, quantity }` | Price/name **snapshotted** at order time |
| `totalAmount` | Number | Calculated server-side |
| `status` | Enum: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled` | Defaults to `pending` |
| `createdAt` / `updatedAt` | Date | Timestamps |

> **Design note:** Order items store a snapshot of `name` and `price` independent of the live `Product` document, so historical orders remain accurate even if product pricing changes later.

---

## 4. Authentication & Authorization

### 4.1 Flow

1. User registers via `POST /api/auth/register`.
2. User logs in via `POST /api/auth/login` and receives a signed JWT.
3. The client attaches the token to subsequent requests:
   ```http
   Authorization: Bearer <TOKEN>
   ```
4. Backend middleware verifies the token, attaches the decoded user to `req.user`, and rejects invalid/expired tokens with `401 Unauthorized`.

### 4.2 Roles

| Role | Access |
|---|---|
| `customer` | Own cart, own orders, browsing products/categories |
| `admin` | Full access to product, category, and order management, plus all customer-level access |

Role checks are implemented as dedicated middleware (e.g., `requireAdmin`) applied to admin-only routes, returning `403 Forbidden` on mismatch.

---

## 5. API Reference

Base URL (local): `http://localhost:5000/api`

### 5.1 Auth

#### `POST /auth/register`
Registers a new customer account.

**Body:**
```json
{
  "name": "Ahmed Adel",
  "email": "ahmed@example.com",
  "password": "SecurePass123"
}
```

**Response `201`:**
```json
{
  "user": { "id": "...", "name": "Ahmed Adel", "email": "ahmed@example.com", "role": "customer" },
  "token": "<JWT>"
}
```

#### `POST /auth/login`
Authenticates an existing user.

**Body:**
```json
{ "email": "ahmed@example.com", "password": "SecurePass123" }
```

**Response `200`:**
```json
{ "user": { "id": "...", "role": "customer" }, "token": "<JWT>" }
```

---

### 5.2 Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | Public | List all products |
| GET | `/products/:id` | Public | Get a single product |
| POST | `/products` | Admin | Create a product |
| PUT/PATCH | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Delete a product |

**Create/Update body:**
```json
{
  "name": "Laptop",
  "description": "Modern high-performance laptop",
  "price": 25000,
  "category": "CATEGORY_ID",
  "stock": 10
}
```

---

### 5.3 Categories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/categories` | Public | List all categories |
| GET | `/categories/:id` | Public | Get a single category |
| POST | `/categories` | Admin | Create a category |
| PUT/PATCH | `/categories/:id` | Admin | Update a category |
| DELETE | `/categories/:id` | Admin | Delete a category |

---

### 5.4 Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/cart` | Customer | Get the current user's cart |
| POST | `/cart/:productId` | Customer | Add a product to the cart |
| PATCH | `/cart/:productId` | Customer | Update quantity of an item |
| DELETE | `/cart/:productId` | Customer | Remove an item |

**Add/Update body:**
```json
{ "quantity": 2 }
```

Server validates that the requested quantity does not exceed available stock before confirming the operation.

---

### 5.5 Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/orders` | Customer | Create an order from the current cart |
| GET | `/orders` | Customer | List the authenticated user's orders |
| GET | `/orders/:orderId` | Customer | Get details of a specific order |

**Order creation response `201`:**
```json
{
  "order": {
    "id": "...",
    "items": [
      { "product": "PRODUCT_ID", "name": "Laptop", "price": 25000, "quantity": 2 }
    ],
    "totalAmount": 50000,
    "status": "pending"
  }
}
```

> Admin-facing order management endpoints (status updates, full order listing) should be documented here once their final route names are confirmed in the codebase.

---

## 6. Business Logic Rules

### 6.1 Order Total Calculation

```
item total  = product.price × quantity
order total = Σ (item totals)
```

Always computed server-side — the frontend never dictates the final price.

### 6.2 Stock Validation

Before an order is created:
1. Each cart item's requested quantity is checked against the product's current `stock`.
2. If any item exceeds available stock, the entire order is rejected (no partial orders).
3. On success, stock is decremented for each ordered product.

### 6.3 Cart Lifecycle

- A cart is created implicitly on a user's first cart interaction.
- On successful order creation, the cart is automatically cleared.

---

## 7. Error Handling

Errors follow a consistent JSON shape:

```json
{
  "success": false,
  "message": "Descriptive error message",
  "statusCode": 400
}
```

| Status | Meaning |
|---|---|
| `400` | Validation error / malformed request |
| `401` | Missing or invalid authentication token |
| `403` | Authenticated but insufficient role/permissions |
| `404` | Resource not found |
| `409` | Conflict (e.g., insufficient stock, duplicate resource) |
| `500` | Unhandled server error |

Centralized error-handling middleware catches thrown errors from controllers/services and normalizes the response shape.

---

## 8. Environment Configuration

`backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port the Express server listens on |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign/verify JWTs |

> Never commit `.env` files or real secrets to version control. Use `.env.example` as a template for contributors.

---

## 9. Local Development Setup

```bash
# 1. Clone
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd NOVA-Store

# 2. Backend
cd backend
npm install
# configure .env (see section 8)
npm run dev

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

The backend runs on the configured `PORT` (default `5000`), and the frontend is served by Vite's dev server (default `5173`).

---

## 10. Testing Strategy

### Recommended manual flow

```
Register → Login → Get Products → Add to Cart →
Update Cart → Create Order → Verify Stock →
Verify Cart Is Empty → Get My Orders
```

### Coverage checklist

- [ ] Valid vs. invalid authentication
- [ ] Unauthorized access to protected routes
- [ ] Admin-only route enforcement
- [ ] Invalid/nonexistent product IDs
- [ ] Empty cart handling
- [ ] Insufficient stock rejection
- [ ] Invalid quantity input (zero, negative, non-numeric)
- [ ] Unauthorized access to another user's order

Automated testing (unit + integration) is listed under [Roadmap](#13-roadmap) as a planned improvement.

---

## 11. Security Guidelines

- Passwords are hashed before storage (never stored or logged in plaintext).
- JWTs are required on all protected routes and verified server-side.
- Role checks are enforced via middleware, not client-side assumptions.
- Order totals and stock checks are always computed/verified server-side.
- Cart and order access is scoped strictly to the authenticated user.
- Secrets are managed exclusively via environment variables.

---

## 12. Deployment Considerations

While deployment tooling is not yet finalized, the following should be addressed before a production rollout:

- Use MongoDB transactions for atomic order creation (cart clear + stock decrement + order insert).
- Introduce process management (e.g., PM2) or containerization (Docker) for the backend.
- Serve the frontend build via a CDN or static hosting provider.
- Configure CORS explicitly for the production frontend origin.
- Set `NODE_ENV=production` and disable verbose error responses.
- Add structured logging and monitoring.

---

## 13. Roadmap

- MongoDB transactions for atomic order creation
- Redis caching
- Background job processing (BullMQ)
- Email notifications
- Payment gateway integration
- Product image uploads via Cloudinary
- Advanced analytics and reporting
- Wishlist and reviews/ratings
- Docker-based deployment
- CI/CD pipeline
- Automated test suite (unit + integration)

---

*This document should be kept in sync with the codebase. Update it whenever routes, models, or business rules change.*