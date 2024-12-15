import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    const { role } = await request.json();

    // Validate role
    if (!role || !['admin', 'staff'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // Check if user exists
    const [users] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM admin_users WHERE id = ?',
      [params.id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user role
    await connection.query(
      'UPDATE admin_users SET role = ? WHERE id = ?',
      [role, params.id]
    );

    return NextResponse.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 