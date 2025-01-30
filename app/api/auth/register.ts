import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongoose';
import User from '@/models/User';
import { hashPassword } from '../../lib/passwords';
import { z } from 'zod';

// Define validation schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const validatedData = registerSchema.safeParse(body);
      if (!validatedData.success) {
        return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
      }
  
      await connectToDatabase();
  
      // Check if user already exists
      const existingUser = await User.findOne({ email: validatedData.data.email });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
  
      // Create user (always role: 'user' by default)
      const newUser = new User({
        username: validatedData.data.username,
        email: validatedData.data.email,
        password: hashPassword(validatedData.data.password),
        role: 'user', // Default role
      });
  
      await newUser.save();
      return NextResponse.json({ message: 'User registered successfully' });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
    }
  }
  
