# 🔐 Authentication API

A secure REST API for user authentication and login management, built with:

- 🚀 **Node.js** - Runtime environment
- ⚡ **Express** - Web framework
- 🔐 **bcrypt** - Password hashing
- 🔑 **jsonwebtoken (JWT)** - Token-based authentication
- 🗄️ **Sequelize** - ORM for database interactions

## 📚 API Reference

### 🔑 User Login

```http
POST /api/login
```

Authenticates a user and returns a JWT token upon successful login.

#### Request Body

```json
{
    "username": "user123",
    "password": "password123"
}
```

#### Response Examples

##### ✅ Successful Login - `200 OK`

```json
{
    "message": "Login successful",
    "token": "your.jwt.token.here"
}
```

##### ❌ User Not Found - `404 Not Found`

```json
{
    "message": "User not found"
}
```

##### ❌ Invalid Credentials - `401 Unauthorized`

```json
{
    "message": "Invalid credentials"
}
```

##### ⚠️ Server Error - `500 Internal Server Error`

```json
{
    "message": "Internal server error"
}
```

### 🆕 Create Login Credentials

```http
POST /api/create-login
```

Creates a new login entry for a user.

#### Request Body

```json
{
    "user_id": "12345",
    "username": "newuser",
    "password": "securepassword"
}
```

#### Response Examples

##### ✅ Login Created - `201 Created`

```json
{
    "message": "Login credentials created successfully.",
    "login": {
        "user_id": "12345",
        "username": "newuser",
        "password": "securepassword"
    }
}
```

##### ❌ User Already Exists - `400 Bad Request`

```json
{
    "message": "User credentials already exist."
}
```

##### ⚠️ Server Error - `500 Internal Server Error`

```json
{
    "message": "Internal server error."
}
```

### 🔑 Authentication Model

The `login_users` table stores user credentials:

**Fields and Constraints:**

- **id**
  - Type: INT
  - Constraints: Primary Key, Auto Increment

- **user_id**
  - Type: STRING
  - Constraints: Unique, Required

- **username**
  - Type: STRING
  - Constraints: Required

- **password**
  - Type: STRING
  - Constraints: Required (Hashed)
