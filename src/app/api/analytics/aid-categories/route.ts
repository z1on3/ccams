import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface AidCategoryStats extends RowDataPacket {
  category: string;
  count: number;
  total_value: number;
}

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [results] = await connection.query<AidCategoryStats[]>(`
      SELECT 
        p.category,
        COUNT(*) as count,
        SUM(
          CASE 
            WHEN p.category = 'Financial Assistance' 
            THEN CAST(JSON_EXTRACT(p.resource_allocation, '$.budget') AS DECIMAL(10,2))
            ELSE CAST(JSON_EXTRACT(p.resource_allocation, '$.budget') AS DECIMAL(10,2))
          END
        ) as total_value
      FROM aid_programs p
      GROUP BY p.category
      ORDER BY count DESC
    `);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching aid categories stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aid categories stats' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 