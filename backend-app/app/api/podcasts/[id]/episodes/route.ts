import { NextResponse } from 'next/server';

// Mock episodes for demonstration
const episodes = [
  { id: '1', podcastId: '1', title: 'Tech Talk Episode 1', description: 'Introduction to AI.', duration: '30:00' },
  { id: '2', podcastId: '1', title: 'Tech Talk Episode 2', description: 'Exploring Blockchain.', duration: '40:00' },
];

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const podcastEpisodes = episodes.filter(e => e.podcastId === id);

  if (podcastEpisodes.length === 0) {
    return NextResponse.json({ error: 'No episodes found for this podcast' }, { status: 404 });
  }

  return NextResponse.json(podcastEpisodes);
}
