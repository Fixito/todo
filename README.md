# Todo

A full-stack todo application built with TypeScript, Express, React, and PostgreSQL.

## 📋 Table of Contents

- [Todo](#todo)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠 Tech Stack](#-tech-stack)
  - [📡 API Documentation](#-api-documentation)
  - [📁 Project Structure](#-project-structure)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [🗄 Database Setup](#-database-setup)
    - [Quick Start](#quick-start)
    - [Database Commands](#database-commands)
  - [🧪 Running Tests](#-running-tests)
    - [Run All Tests](#run-all-tests)
    - [Run Tests in Watch Mode](#run-tests-in-watch-mode)
    - [Test Database Management](#test-database-management)
  - [💻 Development](#-development)
    - [Available Scripts](#available-scripts)

## ✨ Features

**Currently Implemented (Backend v1.0):**
- ✅ User registration and authentication with JWT (HTTP-only cookies)
- ✅ User login and logout
- ✅ Secure password hashing with bcrypt
- ✅ Complete CRUD operations for todos
- ✅ Todo positioning and ordering
- ✅ User-scoped todos with authorization checks
- ✅ Type-safe API with TypeScript
- ✅ PostgreSQL database with Prisma ORM
- ✅ Comprehensive test coverage with Vitest

**Planned Features:**
- 🚧 Todo filtering and sorting
- 🚧 Frontend with React + TanStack Router

## 🛠 Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Vitest for testing

**Frontend (planned - not yet implemented):**
- React
- TanStack Router
- TypeScript

**DevOps:**
- Docker & Docker Compose
- pnpm workspaces (monorepo)
- Biome (linting & formatting)
- Husky (git hooks)

## 📡 API Documentation

The API provides authentication and todo management endpoints. Authentication uses JWT tokens stored in HTTP-only cookies for security.

**Quick Overview:**
- `POST /api/v1/auth/register` - Create a new user account
- `POST /api/v1/auth/login` - Login with email and password
- `POST /api/v1/auth/logout` - Logout and clear auth cookie
- `GET /api/v1/todos` - Get all todos (requires auth)
- `POST /api/v1/todos` - Create a new todo (requires auth)
- `PATCH /api/v1/todos/:id` - Update a todo (requires auth)
- `DELETE /api/v1/todos/:id` - Delete a todo (requires auth)

📖 **[Full API Documentation](apps/backend/docs/API.md)** - Complete reference with request/response schemas and curl examples

## 📁 Project Structure

```
todo/
├── apps/
│   ├── backend/          # Express API server
│   │   ├── src/          # Source code
│   │   ├── tests/        # Test files
│   │   └── prisma/       # Database schema & migrations
│   └── frontend/         # React app (planned, not created yet)
├── packages/
│   └── shared/           # Shared TypeScript types
├── docker/
│   └── postgres/         # PostgreSQL Docker setup
└── .env.example          # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v24 or higher)
- [pnpm](https://pnpm.io/) (v10.25.0 or higher)
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Fixito/todo.git
cd todo
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and update the values as needed (especially JWT and cookie secrets).

4. **Start PostgreSQL**

```bash
cd docker/postgres
docker compose up -d
cd ../..
```

5. **Set up the database**

```bash
cd apps/backend
pnpm prisma:generate
pnpm migrate:dev
cd ../..
```

> Note: The `migrate:dev` command automatically runs the seed script to populate initial data.

6. **Start the development server**

```bash
pnpm dev:backend
```

The API will be available at `http://localhost:5000`.

## 🗄 Database Setup

The application uses PostgreSQL managed via Docker and Prisma ORM.

### Quick Start

```bash
# Start PostgreSQL
cd docker/postgres && docker compose up -d

# Generate Prisma client
cd apps/backend && pnpm prisma:generate

# Apply migrations and seed data
pnpm migrate:dev
```

### Database Commands

```bash
# Generate Prisma client
pnpm prisma:generate

# Create and apply migration (also runs seed)
pnpm migrate:dev

# Set up test database
pnpm db:test:setup
```

## 🧪 Running Tests

The project uses Vitest for testing with a dedicated test database.

### Run All Tests

```bash
cd apps/backend
pnpm test:db
```

This command:
1. Sets up the test database
2. Runs all tests
3. Reports results

### Run Tests in Watch Mode

```bash
cd apps/backend
pnpm test
```

### Test Database Management

```bash
# Set up test database (applies migrations)
pnpm db:test:setup
```

## 💻 Development

### Available Scripts

**Backend:**
```bash
cd apps/backend

pnpm dev               # Start dev server with hot reload
pnpm build             # Build for production
pnpm start             # Run production build
pnpm test              # Run tests in watch mode
pnpm test:db           # Set up test DB and run tests
pnpm prisma:generate   # Generate Prisma client
```

**Root:**
```bash
pnpm dev:backend       # Start backend dev server
pnpm lint-format       # Lint and format all code
pnpm build:backend     # Build backend
```
