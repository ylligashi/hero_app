# Project Guidelines

This repository is a monorepo that hosts multiple Next.js applications and shared packages. Follow these guidelines to keep the codebase consistent and maintainable.

- Package manager: pnpm (always use pnpm, do not use npm or yarn)
- UI: Tailwind CSS + shadcn/ui (install via pnpm dlx only)
- Auth: NextAuth (email + password only)
- ORM: Prisma
- Database: PostgreSQL (psql), not MySQL
- AI runtime: Ollama (local)

## Monorepo layout
- apps/web — the end-user mobile‑first web application (max 600px width layout)
- apps/admin — the admin application for managing heroes, models, users, and dashboards
- packages/** — shared code (e.g., prisma schema, UI components, config)
  - packages/database — contains Prisma schema, migrations, and database client

### Project Directory Structure
```
hero-app/
├── apps/
│   ├── admin/               # Admin application
│   │   ├── app/             # Next.js app router structure
│   │   │   ├── api/         # API routes
│   │   │   │   └── auth/    # NextAuth API routes
│   │   │   └── login/       # Login page (temporary)
│   │   ├── components/      # UI components
│   │   │   └── ui/          # shadcn/ui components
│   │   └── lib/             # Utility functions
│   └── web/                 # User-facing application
│       ├── app/             # Next.js app router structure
│       │   └── api/         # API routes
│       │       └── auth/    # NextAuth API routes
│       └── components/      # UI components
│           └── ui/          # shadcn/ui components
├── packages/
│   ├── config-eslint/       # Shared ESLint configuration
│   ├── config-typescript/   # Shared TypeScript configuration
│   └── database/            # Shared database package
│       ├── prisma/          # Prisma schema and migrations
│       │   ├── migrations/  # Database migrations
│       │   └── schema.prisma # Prisma schema definition
│       └── src/             # Database client source code
├── .env                     # Environment variables
└── docker-compose.yml       # Docker configuration (PostgreSQL)
```

## Project overview
This application lets users have conversations with their chosen “hero” powered by a local Ollama model.

- Admin app
  - Secure login and middleware-protected routes
  - Dashboard (overview of users and heroes)
  - Heroes: list + full CRUD
  - Models: create, manage, list
  - Sidebar navigation across pages
- Web app
  - Mobile-friendly layout (constrain width to 600px)
  - Bottom navigation with three tabs: Heroes, Conversations, Profile
  - Users choose a hero and start a conversation

## Tech stack rules
- Always use pnpm for installing and running scripts
- Use PostgreSQL as the database
- Use Prisma for schema and migrations
- Use NextAuth with email/password only
- Use Tailwind for styling
- Use shadcn/ui. Install via pnpm dlx (never globally)
- Use local Ollama for LLM interactions

## Environment and setup
- Node: use an active LTS version
- Install dependencies: `pnpm install`
- Database connection (.env):
  - `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hero_app?schema=public"`
- Prisma:
  - Generate: `pnpm prisma generate`
  - Migrate: `pnpm prisma migrate dev`
- shadcn/ui example:
  - `pnpm dlx shadcn-ui@latest init`
  - `pnpm dlx shadcn-ui@latest add button input card` (add components as needed)
- Tailwind setup: standard Next.js + Tailwind config
- Auth secrets:
  - `NEXTAUTH_SECRET` required (e.g., `openssl rand -base64 32`)
- Ollama:
  - Install and run locally (https://ollama.com)
  - Ensure models you plan to use are pulled locally (e.g., `ollama pull llama3.2:latest`)

## Prisma schema (PostgreSQL)
Below is the baseline schema to implement in `packages/database/prisma/schema.prisma` (shared database package). It covers required entities and relationships.

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

Notes:
- Passwords must be stored as secure hashes (never plaintext).
- Only email/password auth via NextAuth is allowed.
- Conversation and Message are linked; Message optionally links to User (assistant messages won’t have a user).

## Conventions
- Lint/format: Prettier + ESLint where applicable
- Commit messages: conventional commits preferred (feat, fix, chore, etc.)
- Code review: small, focused PRs

## Tasks and expectations
- Admin app must protect pages via middleware (auth gate)
- Web app must keep layout mobile-friendly with a 600px max content width
- Use pnpm for shadcn/ui installation commands
- Use Prisma with PostgreSQL (no MySQL)
- Use Ollama locally for LLM interactions



## Admin app (current scaffolding)
- Routes protected by middleware (apps/admin/middleware.ts). For now it checks a temporary `admin-auth` cookie as an auth gate. Replace this with NextAuth session checks when wiring up email/password auth.
- Temporary login page is available at `/login` in the admin app:
  - Page: `apps/admin/app/login/page.tsx`
  - Server actions: `apps/admin/app/login/actions.ts` (sets/deletes the `admin-auth` cookie)
- The root layout in `apps/admin/app/layout.tsx` provides a simple container. Tailwind and shadcn/ui can be introduced incrementally per guidelines.

### Running admin locally
- From the repo root: `pnpm dev` (runs all apps via turbo) and open the admin app in your browser (according to your dev setup/ports). Navigate to `/login` to sign in.
- Or run the admin app directly (if you use per-app dev scripts):
  - `cd apps/admin && pnpm dev`

### Migrating to NextAuth
- Replace the cookie check in `middleware.ts` with NextAuth’s session verification.
- Remove the temporary login route (`apps/admin/app/login/*`) after wiring a credentials provider.
- Ensure `NEXTAUTH_SECRET` is set in `.env` and follow the Tech stack rules (email/password only).
