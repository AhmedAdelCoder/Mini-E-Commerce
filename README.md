# 🛒 Mini E-Commerce

A small RESTful E-Commerce backend built with **Node.js, Express.js, and MongoDB**, designed to demonstrate clean backend fundamentals such as authentication, authorization, password hashing, JWT, and role-based access control.

The project is intentionally kept small and focused so it can be developed, tested, and understood within a short development period.

---

## 🚀 Current Features

### Authentication

* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Authentication
* Protected Routes
* Invalid/Expired Token Handling

### Authorization

* Role-Based Access Control (RBAC)
* Customer Role
* Admin Role
* Protected Admin Routes
* Protected Customer Routes

### Database

* MongoDB Atlas
* Mongoose ODM
* User Schema
* Unique Email Validation

### Backend

* Node.js
* Express.js
* REST API
* CORS
* JSON Request Handling
* Environment Variables
* Nodemon for Development

---

## 🛠️ Tech Stack

| Layer            | Technology               |
| ---------------- | ------------------------ |
| Runtime          | Node.js                  |
| Backend          | Express.js               |
| Database         | MongoDB Atlas            |
| ODM              | Mongoose                 |
| Authentication   | JWT                      |
| Password Hashing | bcryptjs                 |
| API Testing      | Postman / Thunder Client |
| Development      | Nodemon                  |
| Version Control  | Git & GitHub             |

---

# 📁 Project Structure

```text
Mini E-Commerce/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│
├── docs/
│   └── 01-authentication-authorization.md
│
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/AhmedAdelCoder/Mini-E-Commerce.git
```

Move into the project:

```bash
cd "Mini E-Commerce"
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

### Example

```env
PORT=5000

MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/mini-ecommerce

JWT_SECRET=mini_ecommerce_secret
```

> Never commit your `.env` file to GitHub.

---

# ▶️ Run the Backend

From the `backend` folder:

```bash
npm run dev
```

The server should start at:

```text
http://localhost:5000
```

Expected output:

```text
MongoDB connected successfully
Server running on http://localhost:5000
```

---

# ❤️ Health Check

To verify that the API is running:

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

---

# 🔑 Authentication API

## Register

```http
POST /api/v1/auth/register
```

### Request Body

```json
{
  "name": "Ahmed",
  "email": "ahmed@test.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "Ahmed",
    "email": "ahmed@test.com",
    "role": "customer"
  }
}
```

---

## Login

```http
POST /api/v1/auth/login
```

### Request Body

```json
{
  "email": "ahmed@test.com",
  "password": "123456"
}
```

The API returns a JWT:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "YOUR_JWT_TOKEN",
  "user": {
    "id": "...",
    "name": "Ahmed",
    "email": "ahmed@test.com",
    "role": "customer"
  }
}
```

---

# 🛡️ Authorization

The project uses **Role-Based Access Control (RBAC)**.

Available roles:

```text
customer
admin
```

## Customer

Customers can access customer-protected routes.

## Admin

Admins can access admin-protected routes.

Protected requests use:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 🔒 Middleware

The project uses two authentication/authorization middleware functions.

### `protect`

Responsible for:

1. Reading the Authorization header.
2. Extracting the JWT.
3. Verifying the token.
4. Adding decoded user information to `req.user`.

Example:

```js
req.user = decoded;
```

### `authorize`

Responsible for checking whether the authenticated user has the required role.

Example:

```js
authorize("admin")
```

Only users with:

```text
role = admin
```

can continue.

---

# 📡 Current API Endpoints

| Method | Endpoint                | Access   |
| ------ | ----------------------- | -------- |
| GET    | `/health`               | Public   |
| POST   | `/api/v1/auth/register` | Public   |
| POST   | `/api/v1/auth/login`    | Public   |
| GET    | `/api/v1/auth/customer` | Customer |
| GET    | `/api/v1/auth/admin`    | Admin    |

---

# 🧪 Testing

The API can be tested using:

* Postman
* Thunder Client
* Insomnia

### Authentication Flow

```text
Register
   ↓
User Created
   ↓
Login
   ↓
JWT Generated
   ↓
Send JWT with Request
   ↓
protect Middleware
   ↓
authorize Middleware
   ↓
Access Granted / Denied
```

---

# 📊 Project Progress

### Completed

* [x] Project Setup
* [x] Express Server
* [x] MongoDB Atlas Connection
* [x] Mongoose Setup
* [x] User Model
* [x] User Registration
* [x] Password Hashing
* [x] Login
* [x] JWT Generation
* [x] JWT Verification
* [x] Authentication Middleware
* [x] Authorization Middleware
* [x] Customer Role
* [x] Admin Role

### Coming Next

* [ ] Product Model
* [ ] Product CRUD
* [ ] Product Authorization
* [ ] Cart
* [ ] Orders
* [ ] Frontend
* [ ] Final Integration

---

# 📚 Documentation

Detailed documentation is available in the `docs` directory.

Current documentation:

```text
docs/
└── 01-authentication-authorization.md
```

More documentation will be added as the project grows.

---

# 🔒 Security Notes

The project follows several basic security practices:

* Passwords are hashed before being stored.
* Passwords are never returned in API responses.
* JWTs are signed using a server-side secret.
* Protected routes require authentication.
* Admin routes require the appropriate role.
* Environment variables are used for sensitive configuration.
* `.env` should never be committed to GitHub.

---

# 👨‍💻 Author

**Ahmed Adel**

GitHub:

https://github.com/AhmedAdelCoder

---

# 📄 License

This project is licensed under the MIT License.
