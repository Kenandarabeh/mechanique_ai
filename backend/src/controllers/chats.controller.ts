import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';

/**
 * Get all chats for the current user
 * GET /api/chats
 */
export const getChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    console.log('📥 Getting chats for user:', userId);

    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    console.log(`✅ Found ${chats.length} chats`);

    res.json(
      chats.map((chat) => ({
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error('❌ Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

/**
 * Get a specific chat with all messages
 * GET /api/chats/:id
 */
export const getChatById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    console.log('🔍 Getting chat:', id, 'for user:', userId);

    const chat = await prisma.chat.findFirst({
      where: {
        id,
        userId, // Ensure user owns this chat
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!chat) {
      console.log('❌ Chat not found:', id);
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    console.log(`✅ Chat found with ${chat.messages.length} messages`);

    res.json(chat);
  } catch (error) {
    console.error('❌ Get chat by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

/**
 * Delete a chat
 * DELETE /api/chats/:id
 */
export const deleteChat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // Verify ownership
    const chat = await prisma.chat.findFirst({
      where: { id, userId },
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    // Delete chat (messages will be deleted via CASCADE)
    await prisma.chat.delete({
      where: { id },
    });

    console.log('✅ Chat deleted:', id);

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('❌ Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};
