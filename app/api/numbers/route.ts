import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.value === undefined || body.value === null) {
      return NextResponse.json({ message: 'Value is required' }, { status: 400 });
    }

    const value = parseInt(body.value);
    if (isNaN(value)) {
      return NextResponse.json({ message: 'Value must be a valid integer' }, { status: 400 });
    }

    const query = 'INSERT INTO "Number" (id, value) VALUES (gen_random_uuid(), $1) RETURNING *';
    const result = await sql.unsafe(query, [value]);

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error adding number:', error);
    return NextResponse.json(
      { message: 'Failed to add number', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const query = 'SELECT * FROM "Number" ORDER BY id';
    const result = await sql.unsafe(query);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error getting numbers:', error);
    return NextResponse.json(
      { message: 'Failed to get numbers', error: error.message },
      { status: 500 }
    );
  }
} 