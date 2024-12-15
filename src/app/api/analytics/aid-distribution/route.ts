import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Get monthly aid distribution for the current year
      const [monthlyData] = await connection.query<RowDataPacket[]>(`
        SELECT 
          MONTH(aa.distribution_date) as month,
          COUNT(DISTINCT aa.farmer_id) as count,
          SUM(
            CASE 
              WHEN aa.quantity_received LIKE '₱%' 
              THEN CAST(REPLACE(REPLACE(aa.quantity_received, '₱', ''), ',', '') AS DECIMAL(10,2))
              ELSE CAST(SUBSTRING_INDEX(aa.quantity_received, ' ', 1) AS DECIMAL(10,2)) * 
                   CASE 
                     WHEN p.category = 'Financial Assistance' 
                     THEN CAST(JSON_EXTRACT(p.resource_allocation, '$.budget') AS DECIMAL(10,2))
                     ELSE CAST(JSON_EXTRACT(p.resource_allocation, '$.budget') AS DECIMAL(10,2)) / 
                          CAST(JSON_EXTRACT(p.resource_allocation, '$.quantity') AS DECIMAL(10,2))
                   END
            END
          ) as total_value
        FROM aid_allocations aa
        JOIN aid_programs p ON aa.aid_program_id = p.id
        WHERE YEAR(aa.distribution_date) = YEAR(CURRENT_DATE())
        GROUP BY MONTH(aa.distribution_date)
        ORDER BY month
      `);

      // Create an array for all 12 months with 0 as default value
      const monthlyValues = Array(12).fill(0);
      const monthlyCount = Array(12).fill(0);

      // Fill in the actual values
      monthlyData.forEach((row) => {
        const monthIndex = row.month - 1; // Convert 1-based month to 0-based index
        monthlyValues[monthIndex] = parseFloat(row.total_value) || 0;
        monthlyCount[monthIndex] = row.count;
      });

      return NextResponse.json({
        monthly_values: monthlyValues,
        monthly_count: monthlyCount,
        total_value: monthlyValues.reduce((a, b) => a + b, 0),
        total_count: monthlyCount.reduce((a, b) => a + b, 0)
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching aid distribution data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch aid distribution data' },
      { status: 500 }
    );
  }
} 