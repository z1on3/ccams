// src/app/api/farmer-crops/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(`
      SELECT 
        c.name,
        c.season,
        COUNT(c.id) as quantity
      FROM crops c
      GROUP BY c.name, c.season
      ORDER BY c.name
    `);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching farmer crops:', error);
    return NextResponse.json(
      { error: 'Failed to fetch farmer crops' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}