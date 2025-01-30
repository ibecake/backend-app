import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongoose';
import User from '@/models/User';
import { comparePassword } from '../../lib/passwords';
import { signToken } from '@/lib/auth';
import { z } from 'zod';

// Define validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ email: validatedData.data.email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isMatch = comparePassword(validatedData.data.password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Issue JWT token
    const token = signToken({ id: user._id, email: user.email, role: user.role });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
