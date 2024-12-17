import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
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
      ORDER BY a.distribution_date DESC
    `, [params.id]);

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