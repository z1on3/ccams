import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';


export async function GET(request: NextRequest) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const farmer_id = searchParams.get('farmer_id');

    connection = await pool.getConnection();

    let query = `
  SELECT 
    ar.id,
    ar.category,
    ar.req_note,
    ar.distribution_date,
    ar.request_date,
    ar.status,
    f.name AS farmer_name, 
    ap.name AS program_name
  FROM aid_requests ar
  JOIN farmers f ON ar.farmer_id = f.id
  LEFT JOIN aid_programs ap ON ar.aid_program_id = ap.id
`;


    let queryParams: any[] = [];

    if (farmer_id) {
      query += ` WHERE ar.farmer_id = ?`;
      queryParams.push(farmer_id);
    }

    const [records] = await connection.query(query, queryParams);

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
      `INSERT INTO aid_requests (category, req_note, farmer_id, request_date, status)
       VALUES (?, ?, ?, NOW() ,?)`,
      [
        data.category,
        data.req_note,
        data.farmer_id,
        data.status || 'Pending',
      ]
    );

    // Commit transaction
    await connection.commit();

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: 'Aid Requested successfully' 
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