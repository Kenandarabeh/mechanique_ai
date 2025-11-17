import express from 'express';
import { generateToken, verifyToken } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/auth/token
 * Generate JWT token from Clerk user info
 */
router.post('/token', generateToken);

/**
 * GET /api/auth/verify
 * Verify JWT token (protected route)
 */
router.get('/verify', authMiddleware, verifyToken);

export default router;
