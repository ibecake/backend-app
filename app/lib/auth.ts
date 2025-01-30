import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

if (!SECRET_KEY) {
  throw new Error('Please define the JWT_SECRET environment variable in .env.local');
}

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}
