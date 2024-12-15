import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface AidProgram extends RowDataPacket {
  id: number;
  name: string;
  category: string;
  resource_allocation: {
    type: string;
    quantity: number;
    budget: number;
  };
  assigned_barangay: string;
}

export async function GET() {
  try {
    const [rows] = await pool.query<AidProgram[]>('SELECT * FROM aid_programs');
    
    // Parse the JSON string in resource_allocation
    const programs = (rows as AidProgram[]).map(program => ({
      ...program,
      resource_allocation: typeof program.resource_allocation === 'string' 
        ? JSON.parse(program.resource_allocation)
        : program.resource_allocation
    }));

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Failed to fetch aid programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aid programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, resource_allocation, assigned_barangay } = body;
    
    const [result] = await pool.query(
      'INSERT INTO aid_programs (name, category, resource_allocation, assigned_barangay) VALUES (?, ?, ?, ?)',
      [name, category, JSON.stringify(resource_allocation), assigned_barangay]
    );
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Failed to create aid program:', error);
    return NextResponse.json(
      { error: 'Failed to create aid program' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, resource_allocation, assigned_barangay } = body;
    
    await pool.query(
      'UPDATE aid_programs SET name = ?, category = ?, resource_allocation = ?, assigned_barangay = ? WHERE id = ?',
      [name, category, JSON.stringify(resource_allocation), assigned_barangay, id]
    );
    
    return NextResponse.json({ message: 'Aid program updated successfully' });
  } catch (error) {
    console.error('Failed to update aid program:', error);
    return NextResponse.json(
      { error: 'Failed to update aid program' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    await pool.query('DELETE FROM aid_programs WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Aid program deleted successfully' });
  } catch (error) {
    console.error('Failed to delete aid program:', error);
    return NextResponse.json(
      { error: 'Failed to delete aid program' },
      { status: 500 }
    );
  }
}