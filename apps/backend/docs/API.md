# API Documentation

This document describes the REST API endpoints for the Todo application.

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

This API uses **JWT authentication via HTTP-only signed cookies**. When you successfully login or register, the server sets a cookie named `token` that is automatically included in subsequent requests by your HTTP client.

### Security Notes

- Cookies are **HTTP-only** (not accessible via JavaScript)
- Cookies are **signed** using `COOKIE_SECRET` environment variable
- JWT tokens expire after 60 days
- Cookies expire after 24 hours

---

## Endpoints

### Authentication Endpoints

#### Register a New User

Creates a new user account and returns an authentication token.

**Endpoint:**
```
POST /api/v1/auth/register
```

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Validation:**
- `email`: Must be a valid email address
- `password`: Minimum 8 characters

**Success Response (201 Created):**
```json
{
  "user": {
    "id": "clxxx123456789",
    "email": "user@example.com",
    "createdAt": "2026-02-17T10:30:00.000Z",
    "updatedAt": "2026-02-17T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error (invalid email, short password)
- `409 Conflict` - Email already exists

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword123"}' \
  -c cookies.txt
```

---

#### Login

Authenticates a user and returns an authentication token.

**Endpoint:**
```
POST /api/v1/auth/login
```

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200 OK):**
```json
{
  "user": {
    "id": "clxxx123456789",
    "email": "user@example.com",
    "createdAt": "2026-02-17T10:30:00.000Z",
    "updatedAt": "2026-02-17T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Invalid credentials

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepassword123"}' \
  -c cookies.txt
```

---

#### Logout

Clears the authentication cookie.

**Endpoint:**
```
POST /api/v1/auth/logout
```

**Authentication:** Not required

**Request Body:** None

**Success Response (204 No Content):**
No response body

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -b cookies.txt
```

---

### Todo Endpoints

All todo endpoints **require authentication**. Make sure to include the cookie from login/register in your requests.

#### Get All Todos

Retrieves all todos for the authenticated user, ordered by position (ascending).

**Endpoint:**
```
GET /api/v1/todos
```

**Authentication:** Required

**Request Body:** None

**Success Response (200 OK):**
```json
{
  "todos": [
    {
      "id": "clxxx123456789",
      "text": "Buy groceries",
      "completed": false,
      "position": 0,
      "userId": "clxxx987654321",
      "createdAt": "2026-02-17T10:30:00.000Z",
      "updatedAt": "2026-02-17T10:30:00.000Z"
    },
    {
      "id": "clxxx234567890",
      "text": "Walk the dog",
      "completed": true,
      "position": 1,
      "userId": "clxxx987654321",
      "createdAt": "2026-02-17T11:00:00.000Z",
      "updatedAt": "2026-02-17T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid authentication cookie

**Example:**
```bash
curl -X GET http://localhost:5000/api/v1/todos \
  -b cookies.txt
```

---

#### Create a Todo

Creates a new todo for the authenticated user. The position is automatically set to the end of the list.

**Endpoint:**
```
POST /api/v1/todos
```

**Authentication:** Required

**Request Body:**
```json
{
  "text": "Complete the project"
}
```

**Validation:**
- `text`: Required, minimum 1 character, maximum 500 characters

**Success Response (201 Created):**
```json
{
  "todo": {
    "id": "clxxx345678901",
    "text": "Complete the project",
    "completed": false,
    "position": 2,
    "userId": "clxxx987654321",
    "createdAt": "2026-02-17T13:00:00.000Z",
    "updatedAt": "2026-02-17T13:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error (text too short/long or missing)
- `401 Unauthorized` - Missing or invalid authentication cookie

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"Complete the project"}' \
  -b cookies.txt
```

---

#### Update a Todo

Updates one or more fields of an existing todo. Only the todo owner can update it.

**Endpoint:**
```
PATCH /api/v1/todos/:id
```

**Authentication:** Required

**URL Parameters:**
- `id`: The CUID of the todo to update

**Request Body:**
```json
{
  "text": "Updated text",
  "completed": true,
  "position": 0
}
```

**Validation:**
- At least one field must be provided
- `text` (optional): Minimum 1 character, maximum 500 characters
- `completed` (optional): Boolean
- `position` (optional): Integer >= 0

**Success Response (200 OK):**
```json
{
  "todo": {
    "id": "clxxx345678901",
    "text": "Updated text",
    "completed": true,
    "position": 0,
    "userId": "clxxx987654321",
    "createdAt": "2026-02-17T13:00:00.000Z",
    "updatedAt": "2026-02-17T14:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation error or no fields provided
- `401 Unauthorized` - Missing or invalid authentication cookie
- `403 Forbidden` - Todo belongs to another user
- `404 Not Found` - Todo not found

**Examples:**

Mark as completed:
```bash
curl -X PATCH http://localhost:5000/api/v1/todos/clxxx345678901 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}' \
  -b cookies.txt
```

Update text and position:
```bash
curl -X PATCH http://localhost:5000/api/v1/todos/clxxx345678901 \
  -H "Content-Type: application/json" \
  -d '{"text":"New text","position":5}' \
  -b cookies.txt
```

---

#### Delete a Todo

Deletes a todo. Only the todo owner can delete it.

**Endpoint:**
```
DELETE /api/v1/todos/:id
```

**Authentication:** Required

**URL Parameters:**
- `id`: The CUID of the todo to delete

**Request Body:** None

**Success Response (204 No Content):**
No response body

**Error Responses:**
- `400 Bad Request` - Invalid todo ID format
- `401 Unauthorized` - Missing or invalid authentication cookie
- `403 Forbidden` - Todo belongs to another user
- `404 Not Found` - Todo not found

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/v1/todos/clxxx345678901 \
  -b cookies.txt
```

---

## Error Response Format

All error responses follow this structure:

```json
{
  "error": "Error type or code",
  "message": "Human-readable error message",
  "stack": "Stack trace (only in development mode)"
}
```

### Common HTTP Status Codes

- `200 OK` - Successful GET/PATCH request
- `201 Created` - Successful resource creation
- `204 No Content` - Successful request with no response body
- `400 Bad Request` - Validation error or malformed request
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Valid authentication but insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `500 Internal Server Error` - Unexpected server error

---

## Testing with curl

To test the full authentication flow:

```bash
# 1. Register a new user and save cookies
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# 2. Create a todo (uses saved cookie)
curl -X POST http://localhost:5000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"My first todo"}' \
  -b cookies.txt

# 3. Get all todos
curl -X GET http://localhost:5000/api/v1/todos \
  -b cookies.txt

# 4. Logout
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -b cookies.txt
```

## Notes for Frontend Integration

When integrating with a frontend application:

1. **Same Origin:** If your frontend is on the same origin (domain, protocol, port), cookies are automatically included in requests.

2. **CORS:** If your frontend is on a different origin, ensure:
   - CORS is properly configured on the backend
   - Use `credentials: 'include'` in fetch requests:
     ```javascript
     fetch('http://localhost:5000/api/v1/todos', {
       credentials: 'include'
     })
     ```

3. **Cookie Access:** The cookies are HTTP-only, so JavaScript cannot read them directly. This is a security feature to prevent XSS attacks.
