import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { generateAIResponse } from '../config/gemini';
import { prisma } from '../config/database';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Send message and get AI response (streaming)
 * POST /api/chat
 */
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messages, chatId }: { messages: Message[]; chatId?: string } = req.body;
    const userId = req.userId!;

    console.log('🔷 POST /api/chat');
    console.log('👤 User ID:', userId);
    console.log('💬 Messages count:', messages?.length);
    console.log('🆔 Chat ID:', chatId || 'NEW');

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages are required and must be an array' });
      return;
    }

    let newChatId = chatId;

    // Get AI response
    const result = await generateAIResponse(messages);

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add chatId header if it's a new chat
    if (!newChatId) {
      // We'll create it after getting the full response
      newChatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      res.setHeader('X-Chat-Id', newChatId);
    }

    let fullAssistantResponse = '';

    // Stream the response
    const stream = result.toTextStreamResponse();
    const reader = stream.body?.getReader();

    if (!reader) {
      res.status(500).json({ error: 'Failed to create stream' });
      return;
    }

    // Read and forward stream
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = new TextDecoder().decode(value);
      fullAssistantResponse += chunk;
      res.write(value);
    }

    res.end();

    // Save to database after streaming completes
    const lastUserMessage = messages[messages.length - 1];
    const question = lastUserMessage.content.substring(0, 100);

    if (!chatId) {
      // Create new chat
      await prisma.chat.create({
        data: {
          id: newChatId!,
          userId,
          title: question,
          messages: {
            create: [
              {
                role: 'user',
                content: lastUserMessage.content,
              },
              {
                role: 'assistant',
                content: fullAssistantResponse,
              },
            ],
          },
        },
      });
      console.log('✅ New chat created:', newChatId);
    } else {
      // Add messages to existing chat
      await prisma.message.createMany({
        data: [
          {
            chatId: chatId,
            role: 'user',
            content: lastUserMessage.content,
          },
          {
            chatId: chatId,
            role: 'assistant',
            content: fullAssistantResponse,
          },
        ],
      });
      console.log('✅ Messages added to chat:', chatId);
    }
  } catch (error) {
    console.error('❌ Send message error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process message' });
    }
  }
};
