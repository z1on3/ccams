import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Get farm photos
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const [photos] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM farm_photos WHERE farmer_id = ? ORDER BY created_at DESC',
      [id]
    );

    return NextResponse.json({ success: true, photos });
  } catch (error) {
    console.error('Error fetching farm photos:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch farm photos' },
      { status: 500 }
    );
  }
}

// Add new farm photos
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { photos } = await request.json();

    // Validate photos array
    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No photos provided' },
        { status: 400 }
      );
    }

    // Filter out any null or invalid URLs
    const validPhotos = photos.filter((photo: string | null) => 
      typeof photo === 'string' && photo.trim().length > 0
    );

    if (validPhotos.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid photos provided' },
        { status: 400 }
      );
    }

    // Insert multiple photos
    const values = validPhotos.map((photo: string) => [id, photo]);
    await pool.query(
      'INSERT INTO farm_photos (farmer_id, photo_url) VALUES ?',
      [values]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Photos added successfully',
      addedCount: validPhotos.length
    });
  } catch (error) {
    console.error('Error adding farm photos:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add farm photos' },
      { status: 500 }
    );
  }
}

// Delete farm photo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { photoId } = await request.json();
    const { id } = params;

    if (!photoId) {
      return NextResponse.json(
        { success: false, message: 'Photo ID is required' },
        { status: 400 }
      );
    }

    await pool.execute(
      'DELETE FROM farm_photos WHERE id = ? AND farmer_id = ?',
      [photoId, id]
    );

    return NextResponse.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting farm photo:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete farm photo' },
      { status: 500 }
    );
  }
} 