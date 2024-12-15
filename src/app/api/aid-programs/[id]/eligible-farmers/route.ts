import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface AidProgram extends RowDataPacket {
  id: number;
  category: string;
  assigned_barangay: string;
}

interface Farmer extends RowDataPacket {
  id: string;
  name: string;
  image: string;
  farm_location: string;
  land_size: string;
  income: number;
  crops: Array<{ name: string; season: string; }>;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First, get the aid program details
    const [programs] = await pool.query<AidProgram[]>(
      'SELECT * FROM aid_programs WHERE id = ?',
      [params.id]
    );

    if (!programs.length) {
      return NextResponse.json(
        { error: 'Aid program not found' },
        { status: 404 }
      );
    }

    const program = programs[0];

    // Get all farmers with their crops using GROUP_CONCAT
    const [farmers] = await pool.query<(Farmer & { crop_names?: string, crop_seasons?: string })[]>(`
      SELECT 
        f.*,
        GROUP_CONCAT(c.name) as crop_names,
        GROUP_CONCAT(c.season) as crop_seasons
      FROM farmers f
      LEFT JOIN crops c ON f.id = c.farmer_id
      WHERE f.active = true
      AND f.farm_location = ?
      GROUP BY f.id
    `, [program.assigned_barangay]);

    // Transform the results to match the expected format
    const formattedFarmers = (farmers as any[]).map(farmer => ({
      ...farmer,
      crops: farmer.crop_names
        ? farmer.crop_names.split(',').map((name: string, index: number) => ({
            name,
            season: farmer.crop_seasons.split(',')[index]
          }))
        : []
    }));

    // Filter eligible farmers based on program category
    const eligibleFarmers = formattedFarmers.filter(farmer => {
      // Check if farmer already received this aid
      const hasReceivedAid = false; // TODO: Implement check from aid_allocations table

      // Basic eligibility: must be in the assigned barangay and not received aid yet
      if (hasReceivedAid) return false;

      switch (program.category) {
        case 'Financial Assistance':
          // Eligible if income is below threshold (e.g., 50,000)
          return farmer.income < 50000;

        case 'Fertilizer Support':
        case 'Seed Distribution':
          // Eligible if has crops and land size is within range
          const landSize = parseFloat(farmer.land_size.split(' ')[0]);
          return farmer.crops.length > 0 && landSize >= 0.5 && landSize <= 5;

        case 'Livestock and Poultry Assistance':
          // Eligible if income is below threshold and has sufficient land
          const landSizeForLivestock = parseFloat(farmer.land_size.split(' ')[0]);
          return farmer.income < 30000 && landSizeForLivestock >= 1;

        case 'Farm Tools and Equipment':
          // Eligible if has active crops
          return farmer.crops.length > 0;

        default:
          return true;
      }
    });

    return NextResponse.json(eligibleFarmers);
  } catch (error) {
    console.error('Error fetching eligible farmers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch eligible farmers' },
      { status: 500 }
    );
  }
} 