import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [farmers] = await connection.query(`
      SELECT 
        f.*, 
        GROUP_CONCAT(CONCAT_WS(':', c.name, c.season)) as crops
      FROM farmers f
      LEFT JOIN crops c ON c.farmer_id = f.id
      GROUP BY f.id
    `);

    // Transform the data to include crops as an array
    const transformedFarmers = (farmers as any[]).map((farmer: any) => {
      // Parse crops from GROUP_CONCAT result
      const crops = farmer.crops ? farmer.crops.split(',').map((crop: string) => {
        const [name, season] = crop.split(':');
        return { name, season };
      }) : [];

      // Parse farmer_type from JSON
      let farmer_type = [];
      try {
        farmer_type = farmer.farmer_type ? JSON.parse(farmer.farmer_type) : [];
      } catch (e) {
        console.error('Error parsing farmer_type:', e);
      }

      // Format the response
      return {
        ...farmer,
        crops,
        farmer_type,
        birthday: farmer.birthday,
      reg_date: farmer.reg_date
      };
    });
    console.log(transformedFarmers);
    return NextResponse.json(transformedFarmers);
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return NextResponse.json({ error: 'Failed to fetch farmers' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const data = await request.json();
    connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Insert farmer
    const farmerId = Math.floor(1000000000000 + Math.random() * 9000000000000); 
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO farmers (
        id, name, birthday, age, gender, phone, farm_location, 
        land_size, farm_owner, income, image, farm_ownership_type, farmer_type
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
        data.farm_owner === 'true',
        data.income,
        data.image || '/images/user/default-user.png',
        data.farmOwnerClassification,
        JSON.stringify(data.farmerType || [])
      ]
    );

    // Insert crops if any
    if (data.crops && data.crops.length > 0) {
      const cropValues = data.crops.map((crop: { name: string; season: string }) => 
        [farmerId, crop.name, crop.season]
      );
      
      await connection.query(
        'INSERT INTO crops (farmer_id, name, season) VALUES ?',
        [cropValues]
      );
    }

    // Commit transaction
    await connection.commit();

    return NextResponse.json({ success: true, id: farmerId });
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    console.error('Error creating farmer:', error);
    return NextResponse.json(
      { error: 'Failed to create farmer' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log('Received data in PUT request:', body);
    const {
      id,
      name,
      image,
      age,
      birthday,
      phone,
      email,
      farm_location,
      land_size,
      farm_owner,
      income,
      crops,
      farm_ownership_type,
      farmer_type
    } = body;

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update farmer
      const updateQuery = `UPDATE farmers SET 
        name = ?, image = ?, age = ?, birthday = ?, phone = ?, 
        email = ?, farm_location = ?, land_size = ?, farm_owner = ?, 
        income = ?, farm_ownership_type = ?, farmer_type = ?
      WHERE id = ?`;
      
      // Ensure farmer_type is a simple array before stringifying
      const farmerTypeArray = Array.isArray(farmer_type) ? farmer_type : [];
      
      const updateValues = [
        name, image, age, birthday, phone, email, farm_location, 
        land_size, farm_owner, income, 
        farm_ownership_type,
        JSON.stringify(farmerTypeArray),
        id
      ];

      console.log('Farmer Type Array:', farmerTypeArray);
      console.log('Update Values:', updateValues);

      await connection.query(updateQuery, updateValues);

      // Delete existing crops
      await connection.query('DELETE FROM crops WHERE farmer_id = ?', [id]);

      // Insert new crops
      if (crops && crops.length > 0) {
        const cropValues = crops.map((crop: { name: string; season: string }) => 
          [id, crop.name, crop.season]
        );
        
        await connection.query(
          'INSERT INTO crops (farmer_id, name, season) VALUES ?',
          [cropValues]
        );
      }

      await connection.commit();
      return NextResponse.json({ message: 'Farmer updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Failed to update farmer:', error);
    return NextResponse.json({ error: 'Failed to update farmer' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    // Soft delete by setting active = false
    await pool.query('UPDATE farmers SET active = false WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    console.error('Failed to delete farmer:', error);
    return NextResponse.json({ error: 'Failed to delete farmer' }, { status: 500 });
  }
} 