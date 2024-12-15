import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // Clear the auth token cookie
  cookies().delete('auth_token');

  return NextResponse.json({ success: true });
} 