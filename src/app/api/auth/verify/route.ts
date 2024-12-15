import { NextResponse } from "next/server";
import * as jose from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function GET(request: Request) {
  try {
    // Get all cookies
    const cookieHeader = request.headers.get('cookie');
    console.log('All cookies:', cookieHeader);

    // Get the token from the cookie
    const token = cookieHeader?.split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')[1];

    console.log('Found token:', token ? 'yes' : 'no');

    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        error: 'No token found',
        cookies: cookieHeader
      }, { status: 401 });
    }

    // Verify the token
    const { payload } = await jose.jwtVerify(token, secret);
    console.log('Token verified, user:', payload);

    return NextResponse.json({
      authenticated: true,
      user: payload
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 401 });
  }
} 