import connectToDatabase from '../../lib/mongoose';
import Podcast from '@/models/Podcast';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase(); // Connect to MongoDB
    const podcasts = await Podcast.find({}); // Fetch podcasts
    return NextResponse.json(podcasts);
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return NextResponse.json({ error: 'Failed to fetch podcasts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase(); // Connect to MongoDB
    const body = await req.json();

    const podcast = new Podcast(body);
    await podcast.save();

    return NextResponse.json({ message: 'Podcast added successfully', podcast });
  } catch (error) {
    console.error('Error adding podcast:', error);
    return NextResponse.json({ error: 'Failed to add podcast' }, { status: 500 });
  }
}
