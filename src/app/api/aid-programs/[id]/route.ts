import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [programs] = await connection.query(
      `SELECT 
        p.*,
        COUNT(DISTINCT a.farmer_id) as beneficiary_count
      FROM aid_programs p
      LEFT JOIN aid_allocations a ON p.id = a.aid_program_id
      WHERE p.id = ?
      GROUP BY p.id`,
      [params.id]
    );

    const program = Array.isArray(programs) ? programs[0] : null;
    if (!program) {
      return NextResponse.json(
        { error: 'Aid program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error fetching aid program:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aid program' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    const data = await request.json();
    connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Update aid program
    const [result] = await connection.query(
      `UPDATE aid_programs 
       SET name = ?, category = ?, resource_allocation = ?, assigned_barangay = ?
       WHERE id = ?`,
      [
        data.name,
        data.category,
        JSON.stringify(data.resource_allocation),
        data.assigned_barangay,
        params.id
      ]
    );

    // Commit transaction
    await connection.commit();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Aid program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Aid program updated successfully' 
    });
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    console.error('Error updating aid program:', error);
    return NextResponse.json(
      { error: 'Failed to update aid program' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Delete aid program
    const [result] = await connection.query(
      'DELETE FROM aid_programs WHERE id = ?',
      [params.id]
    );

    // Commit transaction
    await connection.commit();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Aid program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Aid program deleted successfully' 
    });
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    console.error('Error deleting aid program:', error);
    return NextResponse.json(
      { error: 'Failed to delete aid program' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 