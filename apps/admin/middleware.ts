import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Temporary middleware-based auth gate until NextAuth is wired.
// If no 'admin-auth' cookie is present, redirect to /login.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths that should bypass auth
  const isPublic =
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    pathname === '/healthz';

  if (isPublic) return NextResponse.next();

  const hasAuth = req.cookies.get('admin-auth');

  if (!hasAuth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
