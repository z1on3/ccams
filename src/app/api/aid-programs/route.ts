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
  eligibility: {
    min_income: number;
    max_income: number;
    land_ownership_type: string;
    last_updated: string;
  };
  assigned_barangay: string;
  farmer_type: string[];
}

export async function GET() {
  try {
    const [rows] = await pool.query<AidProgram[]>('SELECT * FROM aid_programs');
    // Safe JSON parsing function
    const safeParse = (data: any, isArray = false) => {
      try {
        const parsed = data ? JSON.parse(data) : isArray ? [] : {};
        return isArray && !Array.isArray(parsed) ? [] : parsed;
      } catch {
        return isArray ? [] : {};
      }
    };
    

    // Parse JSON fields safely
    const programs = (rows as AidProgram[]).map(program => ({
      ...program,
      resource_allocation: safeParse(program.resource_allocation),
      eligibility: safeParse(program.eligibility),
      farmer_type: Array.isArray(program.farmer_type)
        ? program.farmer_type
        : safeParse(program.farmer_type, true),
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
    const { name, category, resource_allocation, eligibility, assigned_barangay, farmer_type } = body;
    
    const [result] = await pool.query(
      'INSERT INTO aid_programs (name, category, resource_allocation, eligibility, assigned_barangay, farmer_type) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category, JSON.stringify(resource_allocation), JSON.stringify(eligibility), assigned_barangay, JSON.stringify(farmer_type)]
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
    const { id, name, category, resource_allocation, eligibility, assigned_barangay, farmer_type } = body;
    
    await pool.query(
      'UPDATE aid_programs SET name = ?, category = ?, resource_allocation = ?, eligibility = ?, assigned_barangay = ?, farmer_type = ? WHERE id = ?',
      [name, category, JSON.stringify(resource_allocation), JSON.stringify(eligibility), assigned_barangay, JSON.stringify(farmer_type), id]
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
