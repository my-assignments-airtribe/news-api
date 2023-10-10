import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../models/User';

dotenv.config();

// Secret key for JWT token generation
const secretKey = process.env.API_SECRET as string;

export function generateToken(user: IUser): string {
  const token = jwt.sign({ user }, secretKey, { expiresIn: '1d' });
  return token;
}

interface DecodedToken {
  user: IUser;
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


