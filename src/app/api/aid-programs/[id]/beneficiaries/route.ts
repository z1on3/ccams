import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface ProgramDetails extends RowDataPacket {
  id: number;
  name: string;
  category: string;
  resource_allocation: string;
  total_distributed: string | null;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get program details and calculate total distributed
    const [programs] = await pool.query<ProgramDetails[]>(`
      SELECT 
        p.*,
        GROUP_CONCAT(
          DISTINCT CONCAT(
            f.name, '|',
            aa.quantity_received, '|',
            aa.distribution_date, '|',
            aa.status
          )
        ) as beneficiary_details
      FROM aid_programs p
      LEFT JOIN aid_allocations aa ON p.id = aa.aid_program_id
      LEFT JOIN farmers f ON aa.farmer_id = f.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [params.id]);

    if (!programs.length) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    const program = programs[0];
    const resource_allocation = JSON.parse(program.resource_allocation);
    
    // Parse beneficiary details
    const beneficiaries = program.beneficiary_details
      ? program.beneficiary_details.split(',').map(detail => {
          const [name, quantity_received, distribution_date, status] = detail.split('|');
          return {
            name,
            quantity_received,
            distribution_date,
            status
          };
        })
      : [];

    // Calculate remaining quantity/amount
    let totalDistributed = 0;
    beneficiaries.forEach(b => {
      if (b.quantity_received) {
        const quantity = program.category === 'Financial Assistance'
          ? parseFloat(b.quantity_received.replace('₱', ''))
          : parseFloat(b.quantity_received.split(' ')[0]);
        totalDistributed += quantity;
      }
    });

    const remaining = program.category === 'Financial Assistance'
      ? resource_allocation.budget - totalDistributed
      : resource_allocation.quantity - totalDistributed;

    return NextResponse.json({
      ...program,
      beneficiaries,
      remaining: program.category === 'Financial Assistance'
        ? `₱${remaining.toLocaleString()}`
        : `${remaining} ${resource_allocation.type}`,
      total_distributed: program.category === 'Financial Assistance'
        ? `₱${totalDistributed.toLocaleString()}`
        : `${totalDistributed} ${resource_allocation.type}`
    });
  } catch (error) {
    console.error('Error fetching program beneficiaries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program beneficiaries' },
      { status: 500 }
    );
  }
} 