# Copilot Instructions for Todo App

## Architecture Overview

This is a **pnpm monorepo** with TypeScript backend and frontend. The workspace contains:
- `apps/backend/` - Express REST API with JWT authentication (signed HTTP-only cookies)
- `apps/frontend/` - React + TanStack Router (planned)
- `packages/shared/` - Shared TypeScript types between frontend/backend
- Prisma generates types to `apps/backend/src/generated/prisma/` (not the default location)

**Key architectural patterns:**
- **Manual Dependency Injection**: Services use constructor injection (see [lib/container.ts](../apps/backend/src/lib/container.ts)) - instantiate dependencies manually, pass as constructor params
- **Custom HttpError classes**: Extend `HttpError` for domain errors (see [errors/index.ts](../apps/backend/src/errors/index.ts)) with specific status codes
- **Route registration pattern**: Each route module exports a default function that receives the parent router (see [routes/auth.routes.ts](../apps/backend/src/routes/auth.routes.ts#L12))

## Path Aliases & Imports

Backend uses `@/` alias for absolute imports:
```typescript
import { prisma } from '@/lib/prisma.js';
import { HttpError } from '@/errors/index.js';
```

**Critical**: All imports must include `.js` extension (even for `.ts` files) due to `verbatimModuleSyntax`. This is required for ES modules.

## Environment & Configuration

- `.env` file is at **monorepo root** (not in apps/backend)
- [config/env.ts](../apps/backend/src/config/env.ts) validates environment vars with Zod and **exits process on validation failure**
- **Never use `process.env` directly** - import from `config/env.ts` (Biome enforces this with `noProcessEnv` rule)

## Code Quality Standards

Biome enforces strict rules:
- **Filenames**: kebab-case only ([biome.json](../biome.json#L27))
- **No `any` type**: Always provide explicit types ([biome.json](../biome.json#L21))
- **No `console` calls**: Use Pino logger from request object (`req.log`) ([biome.json](../biome.json#L20))
- **Single quotes**: JavaScript uses single quotes with required semicolons (enforced by Biome)

Run `pnpm lint-format` to auto-fix formatting issues.

## Testing with Vitest

- Tests are in `apps/backend/tests/` mirroring the src structure
- Use `supertest` for E2E API testing (see [tests/auth/register.test.ts](../apps/backend/tests/auth/register.test.ts))
- Run tests: `pnpm test:backend`
- Tests use `NODE_ENV=test` which loads test-specific env config

## Database & Prisma

- Schema: [apps/backend/prisma/schema.prisma](../apps/backend/prisma/schema.prisma)
- **Custom output**: Client generates to `src/generated/prisma/` instead of `node_modules/.prisma`
- Handle Prisma errors by checking `error.code` (e.g., `P2002` for unique constraint violations)
- Migrations are manual: `cd apps/backend && pnpm prisma migrate dev`

## API Design Patterns

**Request/Response:**
- Use Zod schemas for validation (see [schemas/auth.schema.ts](../apps/backend/src/schemas/auth.schema.ts))
- Apply `validate(schema)` middleware to routes - automatically returns 400 with structured errors
- Return appropriate HTTP status codes via `http-status-codes` package (e.g., `StatusCodes.CREATED`)

**Error handling:**
- Throw `HttpError` subclasses for domain errors - middleware converts to JSON responses
- ZodError automatically formatted by error-handler middleware
- Error responses include `error`, `message`, and `stack` (dev only)

**Authentication:**
- JWT tokens stored in **signed HTTP-only cookies** (not Authorization header)
- Use `setAuthCookie(res, token)` / `getAuthCookie(req)` from [lib/cookies.ts](../apps/backend/src/lib/cookies.ts)
- Tokens expire in 60 days, cookies in 24 hours (see [lib/jwt.ts](../apps/backend/src/lib/jwt.ts) and [lib/cookies.ts](../apps/backend/src/lib/cookies.ts))

## Common Commands

```bash
# Development
pnpm dev:backend          # Start backend with hot reload
pnpm dev:shared           # Watch shared package

# Testing
pnpm test:backend         # Run Vitest tests

# Database
cd apps/backend
pnpm prisma:generate      # Regenerate Prisma client
pnpm prisma migrate dev   # Create and apply migration

# Build
pnpm build:backend        # TypeScript compile + path aliases
```

## Git Workflow

- Commitlint enforces **conventional commits** (feat:, fix:, etc.)
- Husky runs lint-staged on pre-commit
- Follow commit format: `type(scope): message` (e.g., `feat(auth): add login endpoint`)
