import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import * as jose from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function GET() {
  let connection;
  try {
    // Get farmer token from cookies
    const cookieStore = cookies();
    const farmerToken = cookieStore.get('farmer_token')?.value;

    if (!farmerToken) {
      return NextResponse.json(
        { error: "Unauthorized: No farmer token found" },
        { status: 401 }
      );
    }

    // Verify token and get farmer ID
    const { payload } = await jose.jwtVerify(farmerToken, secret);
    const farmerId = payload.farmerId;

    if (!farmerId) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid farmer token" },
        { status: 401 }
      );
    }

    connection = await pool.getConnection();
    const [records] = await connection.query(`
      SELECT 
        a.*,
        p.name as program_name,
        p.category as program_category,
        p.resource_allocation,
        f.name as farmer_name,
        f.farm_location
      FROM aid_allocations a
      JOIN aid_programs p ON a.aid_program_id = p.id
      JOIN farmers f ON a.farmer_id = f.id
      WHERE a.farmer_id = ?
      ORDER BY a.created_at DESC
    `, [farmerId]);

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching farmer aid records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aid records' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 