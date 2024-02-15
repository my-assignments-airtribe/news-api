import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Secret key for JWT token generation
const secretKey = process.env.JWT_SECRET as string;

export function generateToken(userId: string): string {
  const token = jwt.sign({ userId }, secretKey, { expiresIn: '1d' });
  return token;
}

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}


export function verifyToken(token: string): DecodedToken | null {
  try {
    const decodedToken = jwt.verify(token, secretKey) as DecodedToken;
    return decodedToken;
  } catch (error) {
    // If verification fails, return null
    return null;
  }
}


