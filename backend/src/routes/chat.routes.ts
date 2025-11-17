import express from 'express';
import { sendMessage } from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth';
import { chatLimiter } from '../middleware/rateLimiter';

const router = express.Router();

/**
 * POST /api/chat
 * Send message and get AI response (streaming)
 * Protected route with rate limiting
 */
router.post('/', authMiddleware, chatLimiter, sendMessage);

export default router;
