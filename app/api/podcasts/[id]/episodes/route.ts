import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongoose';
import Episode from '@/models/Episode';
import { authorizeAdmin } from '../../../../lib/authorization';

// **GET**: Fetch a single episode by ID (Public)
export async function GET(req: Request, { params }: { params: { id: string; episodeId: string } }) {
  try {
    await connectToDatabase();
    const episode = await Episode.findOne({ _id: params.episodeId, podcastId: params.id });

    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    return NextResponse.json(episode);
  } catch (error) {
    console.error('Error fetching episode:', error);
    return NextResponse.json({ error: 'Failed to fetch episode' }, { status: 500 });
  }
}

// **PUT**: Update an episode (Admins Only)
export async function PUT(req: Request, { params }: { params: { id: string; episodeId: string } }) {
  try {
    const admin = authorizeAdmin(req);
    if (admin instanceof NextResponse) return admin; // Unauthorized response

    const body = await req.json();
    await connectToDatabase();
    const updatedEpisode = await Episode.findOneAndUpdate(
      { _id: params.episodeId, podcastId: params.id },
      body,
      { new: true }
    );

    if (!updatedEpisode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    return NextResponse.json(updatedEpisode);
  } catch (error) {
    console.error('Error updating episode:', error);
    return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 });
  }
}

// **DELETE**: Remove an episode (Admins Only)
export async function DELETE(req: Request, { params }: { params: { id: string; episodeId: string } }) {
  try {
    const admin = authorizeAdmin(req);
    if (admin instanceof NextResponse) return admin; // Unauthorized response

    await connectToDatabase();
    const deletedEpisode = await Episode.findOneAndDelete({ _id: params.episodeId, podcastId: params.id });

    if (!deletedEpisode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Episode deleted successfully' });
  } catch (error) {
    console.error('Error deleting episode:', error);
    return NextResponse.json({ error: 'Failed to delete episode' }, { status: 500 });
  }
}
