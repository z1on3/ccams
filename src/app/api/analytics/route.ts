import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Analytics extends RowDataPacket {
  total_farmers: number;
  total_aid_value: number;
  eligible_farmers: number;
  top_crop: {
    name: string;
    season: string;
    count: number;
    locations: string[];
  };
  current_month_value: number;
  previous_month_value: number;
}

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Get total farmers
      const [totalFarmersResult] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM farmers WHERE active = true'
      );
      const totalFarmers = totalFarmersResult[0].count;

      // Get current month's aid value
      const [currentMonthResult] = await connection.query<RowDataPacket[]>(`
        SELECT aa.quantity_received, p.category, p.resource_allocation
        FROM aid_allocations aa
        JOIN aid_programs p ON aa.aid_program_id = p.id
        WHERE MONTH(aa.distribution_date) = MONTH(CURRENT_DATE())
      `);

      // Get previous month's aid value
      const [previousMonthResult] = await connection.query<RowDataPacket[]>(`
        SELECT aa.quantity_received, p.category, p.resource_allocation
        FROM aid_allocations aa
        JOIN aid_programs p ON aa.aid_program_id = p.id
        WHERE MONTH(aa.distribution_date) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)
      `);

      // Calculate current month value
      let currentMonthValue = 0;
      for (const row of currentMonthResult) {
        const resourceAllocation = JSON.parse(row.resource_allocation);
        if (row.quantity_received.includes('₱')) {
          currentMonthValue += parseFloat(row.quantity_received.replace('₱', '').replace(',', ''));
        } else {
          const quantity = parseFloat(row.quantity_received.split(' ')[0]);
          const unitValue = row.category === 'Financial Assistance' 
            ? resourceAllocation.budget 
            : resourceAllocation.budget / resourceAllocation.quantity;
          currentMonthValue += quantity * unitValue;
        }
      }

      // Calculate previous month value
      let previousMonthValue = 0;
      for (const row of previousMonthResult) {
        const resourceAllocation = JSON.parse(row.resource_allocation);
        if (row.quantity_received.includes('₱')) {
          previousMonthValue += parseFloat(row.quantity_received.replace('₱', '').replace(',', ''));
        } else {
          const quantity = parseFloat(row.quantity_received.split(' ')[0]);
          const unitValue = row.category === 'Financial Assistance' 
            ? resourceAllocation.budget 
            : resourceAllocation.budget / resourceAllocation.quantity;
          previousMonthValue += quantity * unitValue;
        }
      }

      // Calculate growth rate
      const growthRate = previousMonthValue === 0 
        ? 100 
        : ((currentMonthValue - previousMonthValue) / previousMonthValue) * 100;

      // Get all aid allocations for total value
      const [allAllocationsResult] = await connection.query<RowDataPacket[]>(`
        SELECT aa.quantity_received, p.category, p.resource_allocation
        FROM aid_allocations aa
        JOIN aid_programs p ON aa.aid_program_id = p.id
      `);

      // Calculate total aid value
      let totalAidValue = 0;
      for (const row of allAllocationsResult) {
        const resourceAllocation = JSON.parse(row.resource_allocation);
        if (row.quantity_received.includes('₱')) {
          totalAidValue += parseFloat(row.quantity_received.replace('₱', '').replace(',', ''));
        } else {
          const quantity = parseFloat(row.quantity_received.split(' ')[0]);
          const unitValue = row.category === 'Financial Assistance' 
            ? resourceAllocation.budget 
            : resourceAllocation.budget / resourceAllocation.quantity;
          totalAidValue += quantity * unitValue;
        }
      }

      // Get eligible farmers count (farmers who haven't received aid this month)
      const [eligibleFarmersResult] = await connection.query<RowDataPacket[]>(`
        SELECT COUNT(DISTINCT f.id) as count 
        FROM farmers f
        LEFT JOIN aid_allocations aa ON f.id = aa.farmer_id 
          AND MONTH(aa.distribution_date) = MONTH(CURRENT_DATE())
        WHERE f.active = true 
        AND aa.id IS NULL
      `);
      const eligibleFarmers = eligibleFarmersResult[0].count;

      // Get top crop for current season
      const currentMonth = new Date().getMonth() + 1;
      // Philippines has two seasons: Wet (June to November) and Dry (December to May)
      const season = (currentMonth >= 6 && currentMonth <= 11) ? 'Wet' : 'Dry';

      const [topCropResult] = await connection.query<RowDataPacket[]>(`
        SELECT 
          c.name,
          COUNT(*) as count,
          GROUP_CONCAT(DISTINCT f.farm_location) as locations
        FROM crops c
        JOIN farmers f ON c.farmer_id = f.id
        WHERE c.season = ?
        GROUP BY c.name
        ORDER BY count DESC
        LIMIT 1
      `, [season]);

      const topCrop = topCropResult[0] ? {
        name: topCropResult[0].name,
        count: topCropResult[0].count,
        locations: topCropResult[0].locations.split(',')
      } : { name: 'No crops', count: 0, locations: [] };

      return NextResponse.json({
        total_farmers: totalFarmers,
        total_aid_value: totalAidValue,
        eligible_farmers: eligibleFarmers,
        top_crop: {
          name: topCrop.name,
          season: season,
          count: topCrop.count,
          locations: topCrop.locations
        },
        growth_rate: parseFloat(growthRate.toFixed(2))
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 