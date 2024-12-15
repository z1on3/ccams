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

    try {
      // Generate farmer ID
      const farmerId = Math.floor(1000000000000 + Math.random() * 9000000000000);

      // Insert farmer
      await connection.query<ResultSetHeader>(
        `INSERT INTO farmers (
          id,
          name,
          birthday,
          age,
          gender,
          phone,
          farm_location,
          land_size,
          farm_owner,
          income,
          image,
          active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          true
        ]
      );


      await connection.commit();
      return NextResponse.json({ 
        message: 'Registration successful',
        farmerId: farmerId
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error registering farmer:', error);
    return NextResponse.json(
      { error: 'Failed to register farmer' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 