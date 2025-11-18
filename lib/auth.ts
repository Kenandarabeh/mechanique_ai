import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate OTP code (6 digits)
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// Hash password (simple for now, use bcrypt in production)
export async function hashPassword(password: string): Promise<string> {
  // For simplicity, using base64. Replace with bcrypt in production
  return Buffer.from(password).toString('base64');
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = Buffer.from(password).toString('base64');
  return hashed === hash;
}

// Store OTP in database
export async function storeOTP(email: string, code: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  // Delete old OTPs for this email
  await prisma.verificationCode.deleteMany({
    where: { email },
  });
  
  // Create new OTP using Prisma's create method (handles ID automatically)
  await prisma.verificationCode.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });
}

// Verify OTP (does NOT delete - deletion happens in verify route after user creation)
export async function verifyOTP(email: string, code: string): Promise<boolean> {
  // Find valid OTP
  const validOTP = await prisma.verificationCode.findFirst({
    where: {
      email,
      code,
      expiresAt: {
        gt: new Date(), // Greater than current time
      },
    },
  });
  
  // Return true if valid, false otherwise
  // NOTE: We don't delete here! The verify route will delete after creating the user
  return validOTP !== null;
}
