import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

// List of paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/api/aid-programs',
  '/api/analytics',
  '/api/farmers', // Allow admins to access farmers API
];

// List of public paths
const publicPaths = [
  '/admin/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/verify',
  '/api/auth/farmer/login',
  '/api/auth/farmer/logout',
  '/api/farmer/signup',
  '/_next',
  '/images',
  '/favicon.ico'
];

const farmerProtectedPaths = [
  '/api/farmers',
  '/api/farmer',
  '/api/aid-records',
  '/api/farmer/aid-records'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if the path needs protection
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isFarmerProtectedPath = farmerProtectedPaths.some(path => pathname.startsWith(path));

  // If the path is not protected or public, allow access
  if (!isProtectedPath && !isFarmerProtectedPath) {
    return NextResponse.next();
  }

  try {
    // Get the tokens from the cookies
    const token = request.cookies.get('auth_token')?.value; // Admin token
    const farmerToken = request.cookies.get('farmer_token')?.value; // Farmer token

    // If the path is farmer protected and no farmer token, but admin token is present, allow access
    if (isFarmerProtectedPath) {
      // If admin token is present, allow access
      if (token) {
        return NextResponse.next();
      }
      
      // If farmer token is present
      if (farmerToken) {
        // For farmer token, verify if they're accessing their own data
        const { payload } = await jose.jwtVerify(farmerToken, secret);
        
        console.log(payload);
        // Check if payload has farmer ID
        if (!payload) {
          return NextResponse.redirect(new URL('/farmer/login', request.url));
        }

        const farmerId = payload.farmerId as string;

        // Special case for /api/farmers/profile - always allow if farmer is logged in
        if (pathname === '/api/farmers/profile') {
          return NextResponse.next();
        }

        // Extract farmer ID from URL if present
        const urlFarmerId = pathname.match(/\/farmers\/(\d+)/)?.[1];
        const queryFarmerId = new URL(request.url).searchParams.get('farmer_id');

        // Allow access if:
        // 1. The farmer is accessing their own data via URL parameter
        // 2. The farmer is accessing their own data via query parameter
        // 3. The farmer is accessing a general farmer endpoint
        if (
          !urlFarmerId && !queryFarmerId || // General endpoint
          (urlFarmerId && urlFarmerId === farmerId) || // URL parameter match
          (queryFarmerId && queryFarmerId === farmerId) // Query parameter match
        ) {
          return NextResponse.next();
        }
      }

      // No valid token found, redirect to farmer login
      return NextResponse.redirect(new URL('/farmer/login', request.url));
    }

    // For admin protected paths, require admin token
    if (isProtectedPath && !token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Token verification failed, redirect to appropriate login
    if (isFarmerProtectedPath) {
      return NextResponse.redirect(new URL('/farmer/login', request.url));
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
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