# Admin App

This is the Next.js admin application (apps/admin) for managing heroes, models, users, and the dashboard.

## Current status
- Routes are protected by a middleware auth gate.
- Temporary login is available at `/login`. Submitting any non-empty email/password sets a temporary `admin-auth` httpOnly cookie and redirects back to `/`.
- This is a placeholder until NextAuth (email/password) is fully wired.

## Run locally
From the monorepo root:

```bash
pnpm install
pnpm dev
```

Then open the admin app in your browser (according to your dev setup/ports). Navigate to `/login` to sign in.

## Replacing the temporary auth with NextAuth
- The middleware checks for `admin-auth` cookie. When NextAuth is added, replace that check with NextAuth's session validation.
- Remove `apps/admin/app/login/*` after introducing a proper NextAuth credentials provider.
