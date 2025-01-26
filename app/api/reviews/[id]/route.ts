import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { rating, review } = body;

  if (!rating || !review) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  // Mock response simulating an updated review
  return NextResponse.json({ id, rating, review, updatedAt: new Date() });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Mock response simulating deletion
  return NextResponse.json({ message: `Review ${id} deleted` });
}
 