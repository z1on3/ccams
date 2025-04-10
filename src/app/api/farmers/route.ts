import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [farmers] = await connection.query(`
    SELECT 
      f.*, 
      GROUP_CONCAT(CONCAT_WS(':', c.name, c.season)) AS crops
    FROM farmers f
    LEFT JOIN crops c ON c.farmer_id = f.id
    WHERE f.active = true
    GROUP BY f.id;

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
    let data = await request.json();
    connection = await pool.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Generate farmer ID
    const farmerId = Math.floor(1000000000000 + Math.random() * 9000000000000);

    const generateUsername = (data: { name: string; farm_location: string }): string => {
      const name = data.name.toLowerCase().split(" ");
      const firstName = name[0];
      const lastName = name[1] ?? "farmer";
      const location = data.farm_location
        .toLowerCase()
        .replace(/[\W_]+/g, "");
      return `${lastName}.${firstName}@${location}`;
    };

    const checkUsernameExists = async (username: string): Promise<boolean> => {
      let sql = await pool.getConnection(); // Get a connection from the pool
      try {
        await sql.beginTransaction(); // Start the transaction

        // Query to check if the username already exists in the 'farmers' table
        const [rows] = await sql.query<RowDataPacket[]>(
          'SELECT COUNT(*) AS count FROM farmers WHERE username = ?',
          [username]
        );

        return rows[0].count > 0; // If count > 0, it means the username exists
      } catch (error) {
        console.error('Error checking username existence:', error);
        throw error; // Re-throw the error after logging it
      } finally {
        sql.release(); // Release the connection back to the pool
      }
    };



    const generateUniqueUsername = async (data: { name: string; farm_location: string }): Promise<string> => {
      let username = generateUsername(data); // Generate the initial username
      let count = 1;

      // Split the generated username into name part and location part
      const [namePart, locationPart] = username.split('@');

      // While the username exists, increment the count
      while (await checkUsernameExists(username)) {
        const nameParts = namePart.split('.'); // Split the name part into first and last name
        const firstName = nameParts[1]; // Get the first name
        const lastName = nameParts[0];  // Get the last name

        // Instead of appending the full count, only append a number to the first name
        username = `${lastName}.${firstName}${count}@${locationPart}`;
        count++;  // Increment the count for the next iteration
      }

      return username; // Return the unique username
    };




    // Usage example
    const username = await generateUniqueUsername(data);

    data = { ...data, username }; // Append username to data


    const [result] = await connection.query(
      `INSERT INTO farmers (
        id, username,name, birthday, age, gender, phone, 
        farm_location, land_size, farm_owner, income, 
        image, farm_ownership_type, farmer_type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        farmerId,
        username,
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
      farmer_details: data
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