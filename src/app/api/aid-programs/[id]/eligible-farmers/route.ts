import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface AidProgram extends RowDataPacket {
  id: number;
  category: string;
  assigned_barangay: string;
  eligibility: {
    min_income?: number;
    max_income?: number;
    min_land_size?: number;
    max_land_size?: number;
    land_ownership_type?: string;
  };
  farmer_type: string[];
}

interface Farmer extends RowDataPacket {
  id: string;
  name: string;
  image: string;
  farm_location: string;
  land_size: string;
  income: number;
  crops: Array<{ name: string; season: string }>;
  farm_ownership_type: string;
  farmer_type: string;
  active: boolean;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  try {
    connection = await pool.getConnection();

    // Get the aid program details
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

    // Parse eligibility criteria
    const eligibility = program.eligibility
      ? typeof program.eligibility === 'string'
        ? JSON.parse(program.eligibility)
        : program.eligibility
      : {};

    // Get all farmers with crops and aid allocation status
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
      AND (? = 'All Barangays' OR f.farm_location = ?)
      GROUP BY f.id
    `, [params.id, program.assigned_barangay, program.assigned_barangay]);

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

    // Convert land size to hectares
    const convertToHectares = (size: string): number => {
      const value = parseFloat(size.replace(/[^\d.]/g, '')) || 0;
      const unit = size.toLowerCase();

      if (unit.includes('hectare') || unit.includes('ha')) {
        return value;
      } else if (unit.includes('acre')) {
        return value * 0.404686;
      } else if (unit.includes('sqm') || unit.includes('sq m') || unit.includes('m2')) {
        return value / 10000;
      } else {
        return value / 10000;
      }
    };

    // Filter eligible farmers based on the full eligibility criteria
    const eligibleFarmers = formattedFarmers.filter(farmer => {
      console.log('Checking farmer:', farmer.name);

      // Check if farmer is active
      if (!farmer.active) {
        console.log('Farmer is not active, skipping');
        return false;
      }

      // Check if the farmer has already received aid
      const hasReceivedAid = farmer.has_received_aid > 0;
      if (hasReceivedAid) {
        console.log('Farmer has already received aid, skipping');
        return false;
      }

      // Convert farmer's land size to hectares
      const landSizeInHectares = convertToHectares(farmer.land_size);
      console.log(`Farmer land size in hectares: ${landSizeInHectares}`);

      // Check income eligibility
      let incomeEligible = true;
      if (eligibility.min_income && eligibility.min_income !== '0') {
        incomeEligible = farmer.income >= eligibility.min_income;
      }

      if (eligibility.max_income && eligibility.max_income !== '0') {
        incomeEligible = incomeEligible && farmer.income <= eligibility.max_income;
      }

      console.log(`Income eligibility: ${incomeEligible}`);

      // Check land size eligibility
      let landSizeEligible = true;

      if (eligibility.min_land_size && eligibility.min_land_size !== '0') {
        const minLandSizeInHectares = convertToHectares(eligibility.min_land_size);
        landSizeEligible = landSizeInHectares >= minLandSizeInHectares;
      }

      if (eligibility.max_land_size && eligibility.max_land_size !== '0') {
        const maxLandSizeInHectares = convertToHectares(eligibility.max_land_size);
        landSizeEligible = landSizeEligible && landSizeInHectares <= maxLandSizeInHectares;
      }

      console.log(`Land size eligibility: ${landSizeEligible}`);


      // Check land ownership type eligibility
      let ownershipEligible = true;
      if (eligibility.land_ownership_type) {
        ownershipEligible = farmer.farm_ownership_type === eligibility.land_ownership_type;
      }
      console.log(`Land ownership type eligibility: ${ownershipEligible}`);

      // Check farmer type eligibility
      let farmerTypeEligible = true;

      if (program.farmer_type !== '[]') {
        const farmerTypes = Array.isArray(farmer.farmer_type)
          ? farmer.farmer_type
          : JSON.parse(farmer.farmer_type); // Parse if stored as JSON string

        farmerTypeEligible = farmerTypes.some((type: string) => program.farmer_type.includes(type));
      }

      console.log(`Farmer type eligibility: ${farmerTypeEligible}`);

      // The farmer is eligible only if all conditions are met
      const finalEligibility = incomeEligible && landSizeEligible && ownershipEligible && farmerTypeEligible;
      console.log(`Final eligibility:`, finalEligibility);

      return finalEligibility;
    });

    console.log('Eligible farmers:', eligibleFarmers.map(f => f.name).join(', '));


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
