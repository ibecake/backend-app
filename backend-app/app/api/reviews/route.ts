import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { podcastId, episodeId, rating, review } = body;

  if (!podcastId || !rating || !review) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  // Mock response simulating database entry
  const newReview = {
    id: '123',
    podcastId,
    episodeId,
    rating,
    review,
    createdAt: new Date(),
  };

  return NextResponse.json(newReview, { status: 201 });
}
