import clientPromise from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('podcastapp'); // Ensure this matches your database name

    const podcasts = await db.collection('podcasts').find({}).toArray();
    return NextResponse.json(podcasts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch podcasts' }, { status: 500 });
  }
}

