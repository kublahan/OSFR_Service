import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function generateToken(userId: string, options?: jwt.SignOptions): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET не задан в .env');
  }
  
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    ...options
  });
}