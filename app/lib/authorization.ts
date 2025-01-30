import { verifyToken } from '../lib/auth';
import { NextResponse } from 'next/server';

export function authorizeAdmin(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = verifyToken(token);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    return user; // Return user info if authorized
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
