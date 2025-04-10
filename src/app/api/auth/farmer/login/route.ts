import { NextResponse } from "next/server";
import pool from "@/lib/db";
import * as jose from 'jose';
import { RowDataPacket } from 'mysql2';

interface FarmerRow extends RowDataPacket {
  id: string;
  name: string;
  farm_location: string;
}

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

const alg = 'HS256';

export async function POST(request: Request) {
  let connection;
  try {
    const { username, birthday } = await request.json();
    connection = await pool.getConnection();

    // Get farmer from database
    const [farmers] = await connection.query<FarmerRow[]>(
      'SELECT * FROM farmers WHERE username = ? AND birthday = ? AND active = true',
      [username, birthday]
    );

    const farmer = farmers[0];

    if (!farmer) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT
    const token = await new jose.SignJWT({ 
      farmerId: farmer.id,
      name: farmer.name,
      type: 'farmer'
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Create response
    const response = NextResponse.json({
      success: true,
      farmer: {
        id: farmer.id,
        name: farmer.name,
        farm_location: farmer.farm_location
      }
    });

    // Set cookie
    response.cookies.set({
      name: 'farmer_token',
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Farmer login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 