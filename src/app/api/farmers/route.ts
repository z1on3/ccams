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
        GROUP_CONCAT(DISTINCT CASE WHEN c.season = 'Wet' THEN c.name END) as wet_season_crops,
        GROUP_CONCAT(DISTINCT CASE WHEN c.season = 'Dry' THEN c.name END) as dry_season_crops
      FROM farmers f
      LEFT JOIN crops c ON f.id = c.farmer_id
      GROUP BY f.id
    `);

    // Transform the data to include crops as an array
    const transformedFarmers = farmers.map((farmer: any) => {
      const crops = [];
      
      // Add wet season crops
      if (farmer.wet_season_crops) {
        const wetCrops = farmer.wet_season_crops.split(',');
        wetCrops.forEach((crop: string) => {
          if (crop) crops.push({ name: crop.trim(), season: 'Wet' });
        });
      }
      
      // Add dry season crops
      if (farmer.dry_season_crops) {
        const dryCrops = farmer.dry_season_crops.split(',');
        dryCrops.forEach((crop: string) => {
          if (crop) crops.push({ name: crop.trim(), season: 'Dry' });
        });
      }

      // Remove the concatenated fields and add the crops array
      const { wet_season_crops, dry_season_crops, ...farmerData } = farmer;
      return {
        ...farmerData,
        crops: crops
      };
    });

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
      `INSERT INTO farmers (id,name, birthday, age, gender, phone, farm_location, land_size, farm_owner, income, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        data.image || '/images/user/default-user.png'
      ]
    );

    // Get the inserted farmer's ID
    

    // Insert wet season crops if any
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
      crops
    } = body;
    console.log(body);
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update farmer
      await connection.query(
        `UPDATE farmers SET 
          name = ?, image = ?, age = ?, birthday = ?, phone = ?, 
          email = ?, farm_location = ?, land_size = ?, farm_owner = ?, 
          income = ?
        WHERE id = ?`,
        [name, image, age, birthday, phone, email, farm_location, land_size, farm_owner, income, id]
      );

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