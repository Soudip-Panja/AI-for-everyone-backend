# AI For Everyone Backend (Fastify JWT Auth)

This repository contains a Fastify-based implementation of JWT Authentication, utilizing a modular folder structure, PostgreSQL (Neon DB), and environment configuration with automatic database seeding.

## Folder Structure

```
├── config/
│   └── env.js                 # Environment config loader & defaults
├── controllers/
│   └── auth.controller.js     # Logic for authentication/login handler
├── db/
│   └── connection.js          # PostgreSQL connection pool setup & table verification
├── middleware/
│   └── auth.middleware.js     # Fastify preHandler hook for JWT verification
├── routes/
│   └── auth.routes.js         # Registration of authentication endpoints
├── seedData/
│   └── seed.js                # Auto-seeding script for admin user from .env
├── .env                       # Environment variables (local, gitignored)
├── .gitignore                 # Exclusions for git version control
├── index.js                   # Application entry point
├── package.json               # Node packages configuration and scripts
└── README.md                  # This file
```

---

## Setup & Running Instructions

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (already created locally). It should look like this:
```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_q8sxizubrXR3@ep-green-leaf-ao90l06l-pooler.c-2.ap-southeast-1.aws.neon.tech/a4e-web_dev?sslmode=require&channel_binding=require
JWT_SECRET=super_secret_jwt_key_123456!@#$
REFRESH_SECRET=super_secret_refresh_key_987654!@#$
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_ROLE=admin
```
*Note: Make sure your PostgreSQL database URL is correct.*

### 3. Run the Server

#### Development Mode (using Nodemon):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

---

## API Endpoints

### 1. Login
* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "email": "seller@example.com",
    "password": "sellerpassword"
  }
  ```
  *(You can also login as a Buyer with `"email": "buyer@example.com"` / `"password": "buyerpassword"`)*
* **Success Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "Seller",
    "name": "Sample Seller",
    "email": "seller@example.com"
  }
  ```
* **cURL command example:**
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"seller@example.com","password":"sellerpassword"}'
  ```

### 2. Refresh Token
* **URL:** `/api/auth/refresh`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "refreshToken": "<your_refresh_token>"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "token": "<new_access_token>",
    "refreshToken": "<new_refresh_token>"
  }
  ```
* **cURL command example:**
  ```bash
  curl -X POST http://localhost:3000/api/auth/refresh \
    -H "Content-Type: application/json" \
    -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
  ```

### 3. Get Authenticated Profile (Protected Route)
* **URL:** `/api/auth/me`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <your_jwt_token>`
* **Success Response (200 OK):**
  ```json
  {
    "message": "Authenticated successfully",
    "user": {
      "role": "admin",
      "email": "admin@example.com",
      "userId": "mock-admin-id",
      "iat": 1623668480,
      "exp": 1623754880
    }
  }
  ```
* **cURL command example:**
  ```bash
  curl -X GET http://localhost:3000/api/auth/me \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ```
