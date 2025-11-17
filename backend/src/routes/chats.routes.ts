import express from 'express';
import { getChats, getChatById, deleteChat } from '../controllers/chats.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/chats
 * Get all chats for the current user
 */
router.get('/', authMiddleware, getChats);

/**
 * GET /api/chats/:id
 * Get a specific chat with all messages
 */
router.get('/:id', authMiddleware, getChatById);

/**
 * DELETE /api/chats/:id
 * Delete a chat
 */
router.delete('/:id', authMiddleware, deleteChat);

export default router;
