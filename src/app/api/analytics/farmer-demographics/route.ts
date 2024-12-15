import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [results] = await connection.query(`
      SELECT 
        gender,
        COUNT(*) as count
      FROM farmers
      GROUP BY gender
      ORDER BY gender
    `);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching farmer demographics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch farmer demographics' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 