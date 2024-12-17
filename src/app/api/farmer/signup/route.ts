import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
  let connection;
  try {
    const data = await request.json();
    connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Generate farmer ID
    const farmerId = Math.floor(1000000000000 + Math.random() * 9000000000000);

    // Insert farmer
    const [result] = await connection.query(
      `INSERT INTO farmers (
        id, name, birthday, age, gender, phone, 
        farm_location, land_size, farm_owner, income, 
        image, farm_ownership_type, farmer_type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        farmerId,
        data.name,
        data.birthday,
        data.age,
        data.gender,
        data.phone,
        data.farm_location,
        data.land_size,
        data.farm_owner,
        data.income,
        data.image || '/images/user/default-user.png',
        data.farmOwnerClassification,
        JSON.stringify(data.farmerType || [])
      ]
    );

    // Insert crops if any
    if (data.wetSeasonCrops?.length > 0) {
      const cropValues = data.wetSeasonCrops.map((crop: string) => [farmerId, crop, 'Wet']);
      await connection.query(
        'INSERT INTO crops (farmer_id, name, season) VALUES ?',
        [cropValues]
      );
    }

    if (data.drySeasonCrops?.length > 0) {
      const cropValues = data.drySeasonCrops.map((crop: string) => [farmerId, crop, 'Dry']);
      await connection.query(
        'INSERT INTO crops (farmer_id, name, season) VALUES ?',
        [cropValues]
      );
    }

    // Commit transaction
    await connection.commit();

    return NextResponse.json({ 
      success: true, 
      farmerId: farmerId 
    });
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    console.error('Error in farmer signup:', error);
    return NextResponse.json(
      { error: 'Failed to create farmer account' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 