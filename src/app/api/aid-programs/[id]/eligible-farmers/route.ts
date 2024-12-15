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
  let connection;
  try {
    connection = await pool.getConnection();

    // First, get the aid program details
    const [programs] = await connection.query<AidProgram[]>(
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

    // Get all farmers with their crops and check aid allocations in a single query
    const [farmers] = await connection.query<(Farmer & { 
      crop_names?: string, 
      crop_seasons?: string,
      has_received_aid?: number 
    })[]>(`
      SELECT 
        f.*,
        GROUP_CONCAT(DISTINCT c.name) as crop_names,
        GROUP_CONCAT(DISTINCT c.season) as crop_seasons,
        COUNT(DISTINCT aa.id) as has_received_aid
      FROM farmers f
      LEFT JOIN crops c ON f.id = c.farmer_id
      LEFT JOIN aid_allocations aa ON f.id = aa.farmer_id AND aa.aid_program_id = ?
      WHERE f.active = true
      AND f.farm_location = ?
      GROUP BY f.id
    `, [params.id, program.assigned_barangay]);

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

    // Add the conversion function
    const convertToHectares = (size: string): number => {
      const value = parseFloat(size.replace(/[^\d.]/g, '')) || 0;
      const unit = size.toLowerCase();
      
      if (unit.includes('hectare') || unit.includes('ha')) {
        return value; // already in hectares
      } else if (unit.includes('acre')) {
        return value * 0.404686; // 1 acre = 0.404686 hectares
      } else if (unit.includes('sqm') || unit.includes('sq m') || unit.includes('m2')) {
        return value / 10000; // 1 hectare = 10000 sqm
      } else {
        return value; // default to original value if unit not recognized
      }
    };

    // Filter eligible farmers based on program category
    const eligibleFarmers = formattedFarmers.filter(farmer => {
      // Check if farmer already received this aid
      const hasReceivedAid = farmer.has_received_aid > 0;

      // Basic eligibility: must be in the assigned barangay and not received aid yet
      if (hasReceivedAid) return false;

      // Convert land size to hectares for comparison
      const landSizeInHectares = convertToHectares(farmer.land_size);

      switch (program.category) {
        case 'Financial Assistance':
          // Eligible if income is below threshold (e.g., 50,000)
          return farmer.income <=10000;

        case 'Fertilizer Support':
        case 'Seed Distribution':
          // Eligible if has crops and land size is within range (0.5 to 5 hectares)
          return farmer.crops.length > 0 && landSizeInHectares >= 0.5 && landSizeInHectares <= 5;

        case 'Livestock and Poultry Assistance':
          // Eligible if income is below threshold and has sufficient land (at least 1 hectare)
          return farmer.income < 10000 && landSizeInHectares >= 1;

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
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 