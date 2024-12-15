import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    const { password } = await request.json();

    // Validate password
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await connection.query(
      'UPDATE admin_users SET password = ? WHERE id = ?',
      [hashedPassword, params.id]
    );

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 