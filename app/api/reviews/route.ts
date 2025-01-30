import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongoose';
import Review from '@/models/Review';
import { verifyToken } from '../../lib/auth';
import { z } from 'zod';

// Define input validation schema
const reviewSchema = z.object({
  podcastId: z.string().min(1, 'Podcast ID is required'),
  episodeId: z.string().optional(),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  review: z.string().min(10, 'Review must be at least 10 characters long'),
});

// POST: Add a new review (Authenticated Users Only)
export async function POST(req: Request) {
  try {
    // Authenticate the user
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user;
    try {
      user = verifyToken(token); // Verify JWT
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = reviewSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Create and save the review
    const newReview = new Review({
      userId: user.id, // Add user ID from JWT token
      podcastId: validatedData.data.podcastId,
      episodeId: validatedData.data.episodeId || null,
      rating: validatedData.data.rating,
      review: validatedData.data.review,
      createdAt: new Date(),
    });

    await newReview.save();

    return NextResponse.json({ message: 'Review added successfully', newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
