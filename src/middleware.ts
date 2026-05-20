import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'youth-invitation-secret-key-2024'
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get token from cookie
  const token = req.cookies.get('auth_token')?.value;

  // Helper: redirect to login
  const toLogin = () => {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  };

  // Helper: redirect to client
  const toClient = () => {
    const url = req.nextUrl.clone();
    url.pathname = '/client';
    return NextResponse.redirect(url);
  };

  // Verify token
  let payload: { userId: string; role: string } | null = null;
  if (token) {
    try {
      const { payload: p } = await jwtVerify(token, JWT_SECRET);
      payload = p as { userId: string; role: string };
    } catch {
      // invalid token
    }
  }

  // --- /dashboard routes: require admin ---
  if (pathname.startsWith('/dashboard')) {
    if (!payload) return toLogin();
    if (payload.role !== 'admin') return toClient();
    return NextResponse.next();
  }

  // --- /client routes: require any logged-in user ---
  if (pathname.startsWith('/client')) {
    if (!payload) return toLogin();
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/client/:path*'],
};
