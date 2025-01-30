import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongoose';
import User from '@/models/User';
import { verifyToken } from '../../lib/auth';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userData = verifyToken(token);
    await connectToDatabase();

    const user = await User.findById(userData.id).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
