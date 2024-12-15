import { NextResponse } from 'next/server';
import pool from '@/lib/db';

interface Distribution {
  farmerId: string;
  quantity: number;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { distributions } = body as { distributions: Distribution[] };
    const aid_program_id = params.id;

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get program details for validation
      const [programs] = await connection.query(
        'SELECT * FROM aid_programs WHERE id = ?',
        [aid_program_id]
      );

      if (!programs.length) {
        throw new Error('Aid program not found');
      }

      const program = programs[0];
      const resource_allocation = JSON.parse(program.resource_allocation);

      // Create aid allocation records for each farmer
      const values = distributions.map(({ farmerId, quantity }) => [
        aid_program_id,
        farmerId,
        program.category === 'Financial Assistance' 
          ? `₱${quantity}`
          : `${quantity} ${resource_allocation.type}`,
        new Date(),
        'Distributed'
      ]);

      await connection.query(
        `INSERT INTO aid_allocations 
          (aid_program_id, farmer_id, quantity_received, distribution_date, status)
        VALUES ?`,
        [values]
      );

      await connection.commit();
      return NextResponse.json({ message: 'Aid distributed successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error distributing aid:', error);
    return NextResponse.json(
      { error: 'Failed to distribute aid' },
      { status: 500 }
    );
  }
} 