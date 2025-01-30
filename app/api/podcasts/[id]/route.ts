import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongoose';
import Podcast from '@/models/Podcast';
import { authorizeAdmin } from '../../../lib/authorization';

// **GET**: Fetch a single podcast by ID (Public)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const podcast = await Podcast.findById(params.id);

    if (!podcast) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 });
    }

    return NextResponse.json(podcast);
  } catch (error) {
    console.error('Error fetching podcast:', error);
    return NextResponse.json({ error: 'Failed to fetch podcast' }, { status: 500 });
  }
}

// **PUT**: Update a podcast (Admins Only)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = authorizeAdmin(req);
    if (admin instanceof NextResponse) return admin; // Unauthorized response

    const body = await req.json();
    await connectToDatabase();
    const updatedPodcast = await Podcast.findByIdAndUpdate(params.id, body, { new: true });

    if (!updatedPodcast) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPodcast);
  } catch (error) {
    console.error('Error updating podcast:', error);
    return NextResponse.json({ error: 'Failed to update podcast' }, { status: 500 });
  }
}

// **DELETE**: Remove a podcast (Admins Only)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = authorizeAdmin(req);
    if (admin instanceof NextResponse) return admin; // Unauthorized response

    await connectToDatabase();
    const deletedPodcast = await Podcast.findByIdAndDelete(params.id);

    if (!deletedPodcast) {
      return NextResponse.json({ error: 'Podcast not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Podcast deleted successfully' });
  } catch (error) {
    console.error('Error deleting podcast:', error);
    return NextResponse.json({ error: 'Failed to delete podcast' }, { status: 500 });
  }
}
