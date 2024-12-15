import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
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
      ORDER BY a.created_at DESC
    `);
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching aid records:', error);
    return NextResponse.json({ error: 'Failed to fetch aid records' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const data = await request.json();
    connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Insert aid allocation
    const [result] = await connection.query(
      `INSERT INTO aid_allocations (aid_program_id, farmer_id, quantity_received, distribution_date, status, remarks)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.aid_program_id,
        data.farmer_id,
        data.quantity_received,
        data.distribution_date,
        data.status || 'Pending',
        data.remarks
      ]
    );

    // Commit transaction
    await connection.commit();

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: 'Aid allocation created successfully' 
    });
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    console.error('Error creating aid allocation:', error);
    return NextResponse.json(
      { error: 'Failed to create aid allocation' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 