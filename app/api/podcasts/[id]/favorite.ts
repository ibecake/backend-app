export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
      const token = req.headers.get('Authorization')?.split(' ')[1];
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
      const user = verifyToken(token);
      await connectToDatabase();
  
      const podcast = await Podcast.findById(params.id);
      if (!podcast) return NextResponse.json({ error: 'Podcast not found' }, { status: 404 });
  
      if (podcast.favorites.includes(user.id)) {
        podcast.favorites = podcast.favorites.filter((uid) => uid !== user.id);
      } else {
        podcast.favorites.push(user.id);
      }
  
      await podcast.save();
      return NextResponse.json({ message: 'Podcast favorite status updated', favorites: podcast.favorites.length });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update favorite status' }, { status: 500 });
    }
  }
  