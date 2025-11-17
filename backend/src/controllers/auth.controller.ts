import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../config/database';

/**
 * Generate JWT token from Clerk user info
 * POST /api/auth/token
 */
export const generateToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clerk_token, userId, email } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    // Create or update user in database
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: email || '',
        updatedAt: new Date(),
      },
      create: {
        id: userId,
        email: email || '',
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId,
        email,
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );

    res.json({
      token,
      userId,
      expiresIn: config.jwtExpiresIn,
    });
  } catch (error) {
    console.error('❌ Generate token error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};

/**
 * Verify JWT token
 * GET /api/auth/verify
 */
export const verifyToken = async (req: AuthRequest, res: Response): Promise<void> => {
  // If middleware passed, token is valid
  res.json({
    valid: true,
    userId: req.userId,
    user: req.user,
  });
};
