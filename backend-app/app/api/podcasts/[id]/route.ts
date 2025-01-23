import { NextResponse } from 'next/server';

// Mock data for demonstration
const podcasts = [
  { id: '1', title: 'Tech Talks', description: 'A podcast about tech.', rssLink: 'https://rss.example.com/tech' },
  { id: '2', title: 'Movie Mania', description: 'Reviews of the latest movies.', rssLink: 'https://rss.example.com/movies' },
];

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const podcast = podcasts.find(p => p.id === id);

  if (!podcast) {
    return NextResponse.json({ error: 'Podcast not found' }, { status: 404 });
  }

  return NextResponse.json(podcast);
}
