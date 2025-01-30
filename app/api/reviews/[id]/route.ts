import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongoose';
import Review from '@/models/Review';
import { verifyToken } from '../../../lib/auth';

// GET: Fetch a single review by ID (Public)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const review = await Review.findById(params.id);

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
  }
}

// PUT: Update a review (Only the Review Owner)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Authenticate user
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    await connectToDatabase();
    
    // Check if review exists
    const existingReview = await Review.findById(params.id);
    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Ensure user owns the review
    if (existingReview.userId.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const updatedReview = await Review.findByIdAndUpdate(params.id, body, { new: true });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

// DELETE: Remove a review (Only the Review Owner)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Authenticate user
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    await connectToDatabase();

    // Check if review exists
    const existingReview = await Review.findById(params.id);
    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Ensure user owns the review
    if (existingReview.userId.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Review.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
