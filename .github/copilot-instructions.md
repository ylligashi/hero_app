# Hero App - AI Conversation Platform

Hero App is a Turborepo monorepo hosting two Next.js applications for AI-powered conversations with personality-driven "heroes". Users can chat with different hero personalities through a local Ollama LLM integration.

## Project Overview

This application lets users have conversations with their chosen "hero" powered by a local Ollama model.

- **Admin app**: Secure login and middleware-protected routes with dashboard (overview of users and heroes), heroes management (list + full CRUD), models management (create, manage, list), and sidebar navigation across pages
- **Web app**: Mobile-friendly layout (constrain width to 600px) with bottom navigation featuring three tabs: Heroes, Conversations, Profile. Users choose a hero and start a conversation.

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
hero-app/
├── apps/
│   ├── web/                    # User-facing Next.js app (port 3000)
│   │   ├── app/                # Next.js app router structure
│   │   │   ├── (protected)/    # Auth-protected routes (heroes, conversations, profile)
│   │   │   ├── api/            # API routes
│   │   │   │   └── auth/       # NextAuth API routes
│   │   │   ├── login/          # Authentication pages
│   │   │   ├── forgot-password/ # Password reset page
│   │   │   └── reset-password/  # Password reset confirmation
│   │   ├── components/         # UI components
│   │   │   └── ui/             # shadcn/ui components
│   │   ├── lib/                # Utility functions
│   │   └── middleware.ts       # Route protection middleware
│   └── admin/                  # Admin Next.js app (port 3001)
│       ├── app/                # Next.js app router structure
│       │   ├── (protected)/    # Admin-only routes (heroes management)
│       │   │   ├── heroes/     # Hero CRUD operations
│       │   │   └── layout.tsx  # Protected layout with sidebar
│       │   ├── api/            # API routes
│       │   │   └── auth/       # NextAuth API routes
│       │   └── login/          # Admin login
│       ├── components/         # UI components
│       │   └── ui/             # shadcn/ui components
│       ├── lib/                # Utility functions
│       └── middleware.ts       # Admin role enforcement
├── packages/
│   ├── database/               # Shared Prisma/PostgreSQL package
│   │   ├── prisma/             # Prisma schema and migrations
│   │   │   ├── migrations/     # Database migrations
│   │   │   └── schema.prisma   # Database schema definition
│   │   └── src/                # Database client source code
│   │       ├── client.ts       # Prisma client setup
│   │       └── seed.ts         # Database seeding
│   ├── config-eslint/          # Shared ESLint configuration
│   └── config-typescript/      # Shared TypeScript configuration
├── .env                        # Environment variables
├── docker-compose.yml          # PostgreSQL database setup
└── turbo.json                  # Turborepo configuration
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

## Database Schema (PostgreSQL)

The baseline schema is implemented in `packages/database/prisma/schema.prisma`. It covers required entities and relationships:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Role definition
enum Role {
  ADMIN
  USER
}

// Message roles
enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

// Core models
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  passwordHash  String
  name          String?
  role          Role           @default(USER)
  image         String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  conversations Conversation[]
  messages      Message[]
}

model Hero {
  id            String         @id @default(cuid())
  name          String
  description   String?
  systemPrompt  String?
  modelName     String         @default("llama3.2:latest")
  avatarUrl     String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  conversations Conversation[]
}

model Conversation {
  id        String    @id @default(cuid())
  title     String?
  user      User      @relation(fields: [userId], references: [id])
  userId    String
  hero      Hero      @relation(fields: [heroId], references: [id])
  heroId    String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  messages  Message[]
}

model Message {
  id             String       @id @default(cuid())
  content        String
  role           MessageRole
  user           User?        @relation(fields: [userId], references: [id])
  userId         String?
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  conversationId String
  createdAt      DateTime     @default(now())
}
```

**Important Notes**:

- Passwords must be stored as secure hashes (never plaintext)
- Only email/password auth via NextAuth is allowed
- Conversation and Message are linked; Message optionally links to User (assistant messages won't have a user)

## Current Implementation Status

### Admin App (Current Scaffolding)

- **Route Protection**: Routes protected by middleware (`apps/admin/middleware.ts`). Currently uses NextAuth session checks for admin role verification.
- **Authentication**: Integrated NextAuth with email/password credentials provider
- **Admin Dashboard**: Available at `/` with overview of users and heroes
- **Hero Management**: Full CRUD operations available at `/heroes` route
- **UI Components**: Using shadcn/ui components for consistent design

### Running Applications Locally

- **All apps**: From repo root: `pnpm dev` (runs both apps via Turbo)
  - Web app: http://localhost:3000 (user-facing)
  - Admin app: http://localhost:3001 (admin panel)
- **Individual apps**:
  - Web only: `cd apps/web && pnpm dev`
  - Admin only: `cd apps/admin && pnpm dev`

### Authentication Implementation

- **NextAuth Configuration**: Both apps use NextAuth with credentials provider
- **Password Security**: Using bcrypt for password hashing
- **Admin Access**: Admin routes require ADMIN role in user record
- **Session Management**: NextAuth handles session persistence and validation

## Development Conventions

- **Lint/Format**: Prettier + ESLint configured for consistency
- **Commit Messages**: Conventional commits preferred (feat, fix, chore, etc.)
- **Code Review**: Focus on small, targeted PRs
- **Component Installation**: Use `pnpm dlx shadcn-ui@latest add [component]` for UI components

## Project Tasks and Expectations

- **Admin Protection**: All admin pages protected via middleware with role verification
- **Mobile-First**: Web app maintains 600px max content width constraint
- **Package Management**: Strict pnpm usage for all package operations
- **Database**: PostgreSQL only, no MySQL alternatives
- **Local AI**: Ollama integration for LLM conversations

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
