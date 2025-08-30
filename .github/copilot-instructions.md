# Hero App - AI Conversation Platform

Hero App is a Turborepo monorepo hosting two Next.js applications for AI-powered conversations with personality-driven "heroes". Users can chat with different hero personalities through a local Ollama LLM integration.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Setup

- **Install pnpm**: `npm install -g pnpm` (use pnpm 8.15.3+ for all operations)
- **Install dependencies**: `pnpm install` -- takes 30-40 seconds. NEVER CANCEL.
- **Database setup**:
  - Start PostgreSQL: `docker compose up -d` -- downloads and starts PostgreSQL 15
  - Wait for database startup: `sleep 5 && docker compose ps` (verify status "Up")
  - Generate Prisma client: `pnpm generate` -- **CRITICAL**: May take 5-10 minutes in restricted environments. NEVER CANCEL. Set timeout to 15+ minutes.
  - Run migrations: `pnpm db:migrate:dev` -- sets up database schema
  - Seed database: `pnpm db:seed` -- creates admin user and sample data

### Build and Development

- **Build all apps**: `pnpm build` -- takes 10-15 minutes. NEVER CANCEL. Set timeout to 20+ minutes.
  - Requires successful Prisma client generation first
  - Builds both web and admin Next.js applications
- **Development server**: `pnpm dev` -- starts both apps via Turbo
  - Web app: http://localhost:3000 (user-facing)
  - Admin app: http://localhost:3001 (admin panel)
- **Individual app development**:
  - Web only: `cd apps/web && pnpm dev`
  - Admin only: `cd apps/admin && pnpm dev`

### Validation and Testing

- **Format code**: `pnpm format` -- runs Prettier, takes <2 seconds
- **Lint code**: `pnpm lint` -- runs ESLint across all packages, takes 5-10 seconds
  - **CRITICAL**: Always run before committing or CI will fail
  - Fix any lint warnings before proceeding
- **MANUAL VALIDATION REQUIREMENT**: After changes, ALWAYS test complete user scenarios:
  1. **Admin Flow**: Log in to admin app → Navigate to Heroes → Create/edit a hero → Verify hero appears
  2. **User Flow**: Log in to web app → Select a hero → Start conversation → Send a message
  3. **Database Validation**: Verify data persists between app restarts

## Environment Requirements

### Core Dependencies

- **Node.js**: Active LTS version (18+, currently using 20.19.4)
- **pnpm**: 8.15.3+ (ALWAYS use pnpm, never npm or yarn)
- **Docker**: For PostgreSQL database (postgres:15 image)
- **PostgreSQL**: Database via Docker Compose
- **Ollama**: Local LLM runtime (install from https://ollama.com)

### Environment Variables (.env)

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hero_app?schema=public"
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32
ADMIN_EMAIL="admin@example.com"     # For database seeding
ADMIN_PASSWORD="admin123456"        # For database seeding
ADMIN_NAME="Admin"                  # For database seeding
```

### Known Environment Issues

- **Prisma Engine Downloads**: In restricted environments, `pnpm generate` may fail with DNS resolution errors for binaries.prisma.sh
  - This is normal in sandboxed environments
  - In production environments, this works without issues
  - If encountered, document the limitation and skip Prisma-dependent validation

## Repository Structure

### Monorepo Layout

```
├── apps/
│   ├── web/                    # User-facing Next.js app (port 3000)
│   │   ├── app/(protected)/    # Auth-protected routes (heroes, conversations, profile)
│   │   ├── app/login/         # Authentication pages
│   │   └── components/ui/     # shadcn/ui components
│   └── admin/                 # Admin Next.js app (port 3001)
│       ├── app/(protected)/   # Admin-only routes (heroes management)
│       ├── app/login/        # Admin login
│       └── middleware.ts     # Admin role enforcement
├── packages/
│   ├── database/             # Shared Prisma/PostgreSQL package
│   │   ├── prisma/schema.prisma # Database schema
│   │   ├── src/client.ts     # Prisma client setup
│   │   └── src/seed.ts       # Database seeding
│   ├── config-eslint/        # Shared ESLint configuration
│   └── config-typescript/    # Shared TypeScript configuration
├── docker-compose.yml        # PostgreSQL database setup
└── turbo.json               # Turborepo configuration
```

### Key Projects

- **Web App**: Mobile-friendly user interface (max-width: 600px) with bottom navigation
- **Admin App**: Hero management with middleware-protected routes requiring ADMIN role
- **Database Package**: Shared Prisma client with User, Hero, Conversation, Message models

## Timing Expectations and Timeouts

**CRITICAL**: Set appropriate timeouts and NEVER CANCEL long-running operations:

- **pnpm install**: 30-40 seconds (set timeout: 60 seconds)
- **pnpm generate**: 5-10 minutes in restricted environments (set timeout: 15+ minutes)
- **pnpm build**: 10-15 minutes (set timeout: 20+ minutes)
- **pnpm db:migrate:dev**: 30-60 seconds (set timeout: 120 seconds)
- **pnpm lint**: 5-10 seconds (set timeout: 30 seconds)
- **pnpm format**: <2 seconds (set timeout: 10 seconds)

## Validation Scenarios

### After Making Changes - ALWAYS Execute These Tests:

1. **Build Validation**:

   ```bash
   pnpm format && pnpm lint && pnpm build
   ```

2. **Database Validation**:

   ```bash
   pnpm db:migrate:dev && pnpm db:seed
   ```

3. **Manual User Scenarios**:
   - **Admin Authentication**: Navigate to admin app login, authenticate with seeded admin user
   - **Hero Management**: Create a new hero in admin app, verify it appears in both admin list and user app
   - **User Authentication**: Login to web app with valid credentials
   - **Conversation Flow**: Select hero → start conversation → verify message persistence
   - **Database Persistence**: Restart apps and verify data persists

4. **Authentication Middleware Testing**:
   - Verify admin routes require ADMIN role
   - Verify protected routes redirect to login when unauthenticated
   - Test callback URL functionality after login

## Tech Stack Rules

- **Package Manager**: ALWAYS use pnpm (never npm or yarn)
- **Database**: PostgreSQL with Prisma ORM (never MySQL)
- **Authentication**: NextAuth with email/password only
- **UI Framework**: Tailwind CSS + shadcn/ui (install via `pnpm dlx shadcn-ui@latest`)
- **AI Runtime**: Local Ollama (ensure models are pulled: `ollama pull llama3.2:latest`)
- **Styling**: Keep web app mobile-friendly with 600px max width constraint

## Common Validation Commands

### Quick Status Check

```bash
cd /path/to/hero_app
pnpm --version                    # Should be 8.15.3+
docker compose ps                 # Verify postgres is "Up"
ls packages/database/generated/   # Verify Prisma client exists
```

### Pre-Commit Checklist

```bash
pnpm format    # Format all files
pnpm lint      # Fix any warnings/errors before proceeding
pnpm build     # Verify build succeeds
```

### Environment Reset (if needed)

```bash
docker compose down && docker compose up -d
pnpm db:migrate:dev
pnpm db:seed
pnpm dev
```

## Error Handling

- **Lint Warnings**: ESLint is configured with `--max-warnings 0`. Fix ALL warnings before committing.
- **Database Connection**: Ensure PostgreSQL is running via `docker compose ps`
- **Prisma Issues**: If generation fails, check DATABASE_URL and database connectivity
- **Build Failures**: Usually indicates missing Prisma client or lint errors

## Important File Locations

- **Database Schema**: `packages/database/prisma/schema.prisma`
- **Auth Configuration**: `apps/{web,admin}/lib/auth.ts`
- **Middleware**: `apps/{web,admin}/middleware.ts`
- **UI Components**: `apps/{web,admin}/components/ui/`
- **Environment**: `.env` (root level)
- **Docker Setup**: `docker-compose.yml`

---

**Remember**: Always validate your changes with both automated checks (lint/build) and manual testing (login flows, data persistence) before considering your work complete.
