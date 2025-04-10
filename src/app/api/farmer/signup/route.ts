import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

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
        const [rows] =  await sql.query<RowDataPacket[]>(
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