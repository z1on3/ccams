import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

// GET - Fetch all users
export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [users] = await connection.query<RowDataPacket[]>(
      'SELECT id, username, name, role FROM admin_users'
    );
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// POST - Create new user
export async function POST(request: Request) {
  let connection;
  try {
    const { username, name, password, role } = await request.json();

    // Validate input
    if (!username || !name || !password || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    connection = await pool.getConnection();

    // Check if username already exists
    const [existingUsers] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM admin_users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Insert new user
    await connection.query(
      'INSERT INTO admin_users (username, name, password, role) VALUES (?, ?, ?, ?)',
      [username, name, hashedPassword, role]
    );

    return NextResponse.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 