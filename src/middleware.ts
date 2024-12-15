import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

// List of paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/api/farmers',
  '/api/aid-programs',
  '/api/aid-records',
  '/api/analytics'
];

// List of public paths
const publicPaths = [
  '/admin/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/verify',
  '/_next',
  '/images',
  '/favicon.ico'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if the path needs protection
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // If the path is not protected or public, allow access
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  try {
    // Get the token from the cookies
    const token = request.cookies.get('auth_token')?.value;
    console.log('Middleware - Path:', pathname);
    console.log('Middleware - Cookie:', token ? 'Present' : 'Missing');

    // If no token and path is protected, redirect to login
    if (!token) {
      console.log('Middleware - No token found, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify the token
    const { payload } = await jose.jwtVerify(token, secret);
    console.log('Middleware - Token verified for user:', payload.username);

    // Clone the request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user', JSON.stringify(payload));

    // Return the response with modified headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (error) {
    console.error('Middleware - Token verification error:', error);
    // If token is invalid, redirect to login
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 