import jwt from 'jsonwebtoken';


const JWT_SECRET = 'MEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCBspIeyyapzYrndg4eyjmQTNQJJHqZrj0A5yFbKe287tg==';

export function generateToken(userId: string, options?: jwt.SignOptions): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET не задан в .env');
  }
  
  return jwt.sign({ userId }, JWT_SECRET, {
    ...options
  });
}