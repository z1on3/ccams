import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface FarmerRow extends RowDataPacket {
  id: string;
  name: string;
  image: string;
  crops?: Array<{ name: string; season: string; }>;
}

interface CropRow extends RowDataPacket {
  name: string;
  season: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [farmers] = await pool.query<FarmerRow[]>(
      'SELECT * FROM farmers WHERE id = ?',
      [params.id]
    );

    if (!Array.isArray(farmers) || farmers.length === 0) {
      return NextResponse.json(
        { error: 'Farmer not found' },
        { status: 404 }
      );
    }

    const [crops] = await pool.query<CropRow[]>(
      'SELECT name, season FROM crops WHERE farmer_id = ?',
      [params.id]
    );

    const farmer = farmers[0];
    farmer.crops = (Array.isArray(crops) ? crops : []) as { name: string; season: string; }[];

    return NextResponse.json(farmer);
  } catch (error) {
    console.error('Error fetching farmer:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 