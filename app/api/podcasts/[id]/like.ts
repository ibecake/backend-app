export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
      const token = req.headers.get('Authorization')?.split(' ')[1];
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
      const user = verifyToken(token);
      await connectToDatabase();
  
      const podcast = await Podcast.findById(params.id);
      if (!podcast) return NextResponse.json({ error: 'Podcast not found' }, { status: 404 });
  
      if (podcast.likes.includes(user.id)) {
        podcast.likes = podcast.likes.filter((uid) => uid !== user.id);
      } else {
        podcast.likes.push(user.id);
      }
  
      await podcast.save();
      return NextResponse.json({ message: 'Podcast like status updated', likes: podcast.likes.length });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update like status' }, { status: 500 });
    }
  }
  