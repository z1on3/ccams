import { NextResponse } from "next/server";
import pool from "@/lib/db";
import * as jose from 'jose';
import { RowDataPacket } from 'mysql2';

interface FarmerRow extends RowDataPacket {
  id: string;
  name: string;
  age: number;
  birthday: Date;
  phone: string;
  email: string;
  farm_location: string;
  land_size: string;
  farm_owner: boolean;
  reg_date: Date;
  active: boolean;
  income: number;
}

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function GET(request: Request) {
  let connection;
  try {
    // Get token from cookie
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('farmer_token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const { payload } = await jose.jwtVerify(token, secret);
    const farmerId = payload.farmerId as string;
    console.log(farmerId);
    // Get farmer data from database
    connection = await pool.getConnection();
    const [farmers] = await connection.query<FarmerRow[]>(
      `SELECT f.*, 
        GROUP_CONCAT(CONCAT_WS(':', fc.name, fc.season)) as crops
        FROM farmers f
        LEFT JOIN crops fc ON fc.farmer_id = f.id
        WHERE f.id = ? AND f.active = true
        GROUP BY f.id`,
      [farmerId]
    );

    const farmer = farmers[0];

    if (!farmer) {
      return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
    }

    // Parse crops from GROUP_CONCAT result
    const crops = farmer.crops ? farmer.crops.split(',').map(crop => {
      const [name, season] = crop.split(':');
      return { name, season };
    }) : [];

    // Format the response
    const formattedFarmer = {
      ...farmer,
      crops,
      birthday: farmer.birthday.toISOString().split('T')[0],
      reg_date: farmer.reg_date.toISOString().split('T')[0]
    };

    return NextResponse.json({ farmer: formattedFarmer });
  } catch (error) {
    console.error('Error fetching farmer profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 