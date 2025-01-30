export async function POST(req: Request, { params }: { params: { id: string; episodeId: string } }) {
    try {
      const token = req.headers.get('Authorization')?.split(' ')[1];
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
      const user = verifyToken(token);
      await connectToDatabase();
  
      const episode = await Episode.findById(params.episodeId);
      if (!episode) return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
  
      if (episode.likes.includes(user.id)) {
        episode.likes = episode.likes.filter((uid) => uid !== user.id);
      } else {
        episode.likes.push(user.id);
      }
  
      await episode.save();
      return NextResponse.json({ message: 'Episode like status updated', likes: episode.likes.length });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update like status' }, { status: 500 });
    }
  }
  