# Mini E-Commerce — Authentication & Authorization Documentation

## 1. Project Overview

The **Mini E-Commerce** project is a small full-stack e-commerce application built with Node.js, Express.js, MongoDB, and React.

The goal is to build a simple but well-structured e-commerce system while applying important backend concepts such as:

* Authentication
* Authorization
* Password Hashing
* JWT
* MongoDB
* REST APIs
* Middleware
* Role-Based Access Control (RBAC)

---

# 2. Backend Structure

The backend currently follows this structure:

```text
backend/
│
├── src/
│   ├── controllers/
│   │   └── authController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   └── authRoutes.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

---

# 3. Environment Variables

The backend uses a `.env` file to store configuration and sensitive information.

Example:

```env
PORT=5000

MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/mini-ecommerce

JWT_SECRET=mini_ecommerce_secret_change_later
```

### Important

The `.env` file should **never be pushed to GitHub** because it contains sensitive information such as:

* Database credentials
* JWT secret
* API keys

The `.gitignore` file should contain:

```text
.env
node_modules/
```

---

# 4. MongoDB Connection

The project uses **MongoDB Atlas** as the database.

Mongoose is used as the ODM to communicate with MongoDB.

The server connects to MongoDB before starting the Express server.

When the connection succeeds:

```text
MongoDB connected successfully
Server running on http://localhost:5000
```

This confirms that:

1. The MongoDB URI is correct.
2. MongoDB Atlas allows the connection.
3. Mongoose successfully connected.
4. The backend server started successfully.

---

# 5. Express Application

The main Express application is located in:

```text
src/app.js
```

The application initializes Express and common middleware.

Example:

```js
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
```

### CORS

CORS allows the frontend application to communicate with the backend API from a different origin.

### express.json()

This middleware allows Express to read JSON request bodies.

For example:

```json
{
  "name": "Ahmed",
  "email": "ahmed@test.com",
  "password": "123456"
}
```

---

# 6. Health Check

The backend contains a health-check endpoint:

```http
GET /health
```

Response:

```json
{
  "success": true,
  "message": "Mini E-Commerce API is running"
}
```

This endpoint is useful for quickly checking whether the backend is running.

---

# 7. User Model

The user model is located at:

```text
src/models/User.js
```

The user contains:

```text
User
├── name
├── email
├── password
├── role
├── createdAt
└── updatedAt
```

The role can be:

```text
customer
admin
```

Example schema:

```js
role: {
  type: String,
  enum: ["customer", "admin"],
  default: "customer",
}
```

By default, a newly registered user becomes:

```text
customer
```

---

# 8. User Registration

Registration endpoint:

```http
POST /api/v1/auth/register
```

Request:

```json
{
  "name": "Ahmed",
  "email": "ahmed@test.com",
  "password": "123456"
}
```

---

## Registration Flow

The registration process works as follows:

```text
Client
  │
  ▼
POST /register
  │
  ▼
Validate input
  │
  ▼
Check existing email
  │
  ▼
Hash password
  │
  ▼
Create user
  │
  ▼
Return user information
```

---

# 9. Password Hashing

Passwords are never stored as plain text.

Instead, the project uses:

```text
bcryptjs
```

The password is hashed using:

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

The number:

```text
10
```

represents the bcrypt salt rounds.

For example, instead of storing:

```text
123456
```

MongoDB stores something similar to:

```text
$2b$10$5gtSsGwFuh1QwOYlJ857v.mJmhoVWAunGAPISlq1dRo/WWrt7yXHe
```

This protects the original password from being directly exposed in the database.

---

# 10. Duplicate Email Protection

Before creating a user, the backend checks:

```js
const existingUser = await User.findOne({ email });
```

If the email already exists:

```json
{
  "success": false,
  "message": "Email already registered"
}
```

HTTP status:

```text
409 Conflict
```

---

# 11. Login

Login endpoint:

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "ahmed@test.com",
  "password": "123456"
}
```

---

# 12. Login Flow

The login process:

```text
Client
  │
  ▼
POST /login
  │
  ▼
Check email & password
  │
  ▼
Find user in MongoDB
  │
  ▼
Compare password with bcrypt
  │
  ▼
Generate JWT
  │
  ▼
Return token
```

---

# 13. Password Verification

During login, the submitted password is compared with the hashed password stored in MongoDB:

```js
const isPasswordCorrect = await bcrypt.compare(
  password,
  user.password
);
```

If the password is incorrect:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

HTTP status:

```text
401 Unauthorized
```

---

# 14. JWT Authentication

After successful login, the backend generates a JWT.

Example:

```js
const token = jwt.sign(
  {
    userId: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1h",
  }
);
```

The token contains:

```text
userId
role
iat
exp
```

Example decoded payload:

```json
{
  "userId": "6a955a15e85abe856390fcba",
  "role": "customer",
  "iat": 1788178548,
  "exp": 1788182148
}
```

---

# 15. JWT Components

A JWT consists of three parts:

```text
Header.Payload.Signature
```

### Header

Contains information about the token algorithm.

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload

Contains information about the user.

Example:

```json
{
  "userId": "...",
  "role": "customer"
}
```

### Signature

The signature is created using:

```text
JWT_SECRET
```

It allows the server to verify that the token was signed by the application and has not been modified.

---

# 16. Authentication Middleware

The authentication middleware is:

```text
src/middleware/authMiddleware.js
```

The middleware is called:

```js
protect
```

Its job is to verify that the request contains a valid JWT.

---

# 17. Bearer Token

Protected requests must contain:

```http
Authorization: Bearer <JWT>
```

Example:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The middleware reads:

```js
req.headers.authorization
```

Then checks:

```js
authHeader.startsWith("Bearer ")
```

If there is no token:

```json
{
  "success": false,
  "message": "Authentication required"
}
```

HTTP status:

```text
401 Unauthorized
```

---

# 18. JWT Verification

The token is verified using:

```js
const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);
```

If valid:

```js
req.user = decoded;
```

Then:

```js
next();
```

is called.

This allows the request to continue to the next middleware or controller.

---

# 19. Authentication vs Authorization

These are two different concepts.

### Authentication

Answers:

> Who are you?

Example:

```text
Login
↓
JWT
↓
User identified
```

### Authorization

Answers:

> Are you allowed to do this?

Example:

```text
User = customer
Request = delete product
↓
Access denied
```

---

# 20. Role-Based Access Control (RBAC)

The project uses a simple RBAC system.

There are currently two roles:

```text
customer
admin
```

### Customer

Can access customer functionality.

### Admin

Can access administrative functionality.

---

# 21. Authorization Middleware

The authorization middleware is:

```js
authorize(...roles)
```

Example:

```js
authorize("admin")
```

means:

> Only users with the admin role can continue.

Another example:

```js
authorize("customer")
```

means:

> Only customers can continue.

---

# 22. Authorization Logic

The middleware checks:

```js
if (!roles.includes(req.user.role)) {
  return res.status(403).json({
    success: false,
    message: "Access denied",
  });
}
```

For example:

```text
req.user.role = customer

authorize("admin")
```

Result:

```text
Access denied
```

But:

```text
req.user.role = admin

authorize("admin")
```

Result:

```text
Access granted
```

---

# 23. HTTP Status Codes

The authentication and authorization system uses:

| Status | Meaning                                       |
| ------ | --------------------------------------------- |
| 200    | Successful request                            |
| 201    | Resource created                              |
| 400    | Bad request                                   |
| 401    | Authentication required / invalid credentials |
| 403    | Authenticated but not authorized              |
| 409    | Resource conflict                             |
| 500    | Server error                                  |

Important difference:

### 401

The user is not properly authenticated.

Example:

```text
No JWT
Invalid JWT
Expired JWT
```

### 403

The user is authenticated but doesn't have permission.

Example:

```text
Customer trying to access admin route
```

---

# 24. Authorization Testing

We created test routes to verify the RBAC system.

Customer route:

```http
GET /api/v1/auth/customer
```

Admin route:

```http
GET /api/v1/auth/admin
```

For a customer:

```text
/customer → Access granted
/admin    → Access denied
```

For an admin:

```text
/admin    → Access granted
/customer → Access denied
```

This confirms that role-based authorization is working correctly.

---

# 25. Current Project Progress

At this stage, the following features are completed:

```text
Project Setup                 ✅
Express Server                ✅
CORS                          ✅
JSON Body Parsing             ✅
MongoDB Atlas                 ✅
Mongoose Connection           ✅
User Model                    ✅
User Registration             ✅
Password Hashing              ✅
Duplicate Email Protection    ✅
Login                         ✅
Password Verification         ✅
JWT Generation                ✅
JWT Verification              ✅
Authentication Middleware     ✅
Authorization Middleware      ✅
Role-Based Access Control     ✅
Admin Role                    ✅
Customer Role                 ✅
```

---

# 26. Current API Structure

```text
GET  /health

POST /api/v1/auth/register
POST /api/v1/auth/login

GET  /api/v1/auth/customer
GET  /api/v1/auth/admin
```

---

# 27. Next Development Step

The next major module will be:

# Products

We will create:

```text
Product Model
Product Controller
Product Routes
Product CRUD
```

The planned API:

```text
GET    /api/v1/products
GET    /api/v1/products/:id

POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
```

Authorization:

```text
GET products
→ Customer + Admin

POST product
→ Admin only

PUT product
→ Admin only

DELETE product
→ Admin only
```

After Products, we will build:

```text
Products
   ↓
Cart
   ↓
Orders
   ↓
Frontend
```

The project will remain intentionally small so that it can be completed within the planned four-day timeframe.
