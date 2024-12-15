import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;

    // Update farmer information
    const updateFarmerQuery = `
      UPDATE farmers 
      SET 
        name = ?,
        birthday = ?,
        age = ?,
        gender = ?,
        phone = ?,
        farm_location = ?,
        land_size = ?,
        farm_owner = ?,
        income = ?,
        image = ?
      WHERE id = ?
    `;

    const [result] = await pool.execute(updateFarmerQuery, [
      data.name,
      data.birthday,
      data.age,
      data.gender,
      data.contact_number,
      data.farm_location,
      data.land_size,
      data.farm_owner,
      data.income,
      data.image || '/images/user/default-user.png',
      id
    ]);

    // Delete existing crops
    await pool.execute('DELETE FROM crops WHERE farmer_id = ?', [id]);

    // Insert new crops
    if (data.wetSeasonCrops?.length > 0) {
      const cropValues = data.wetSeasonCrops.map((crop: string) => [id, crop, 'Wet']);
      await pool.query(
        'INSERT INTO crops (farmer_id, name, season) VALUES ?',
        [cropValues]
      );
    }

    if (data.drySeasonCrops?.length > 0) {
      const cropValues = data.drySeasonCrops.map((crop: string) => [id, crop, 'Dry']);
      await pool.query(
        'INSERT INTO crops (farmer_id, name, season) VALUES ?',
        [cropValues]
      );
    }

    return NextResponse.json({ success: true, message: 'Farmer updated successfully' });
  } catch (error) {
    console.error('Error updating farmer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update farmer' },
      { status: 500 }
    );
  }
} 