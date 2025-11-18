import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch admin statistics
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch statistics
    const [
      totalUsers,
      verifiedUsers,
      totalChats,
      totalMessages,
      totalOilChanges,
      totalCarParts,
      inStockParts,
      recentUsers,
      recentChats,
      popularCarModels
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),
      
      // Verified users count
      prisma.user.count({ where: { verified: true } }),
      
      // Total chats count
      prisma.chat.count(),
      
      // Total messages count
      prisma.message.count(),
      
      // Total oil changes count
      prisma.oilChange.count(),
      
      // Total car parts count
      prisma.carPart.count(),
      
      // In-stock parts count
      prisma.carPart.count({ where: { inStock: true } }),
      
      // Recent users (last 10)
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          verified: true,
          createdAt: true
        }
      }),
      
      // Recent chats (last 10)
      prisma.chat.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          title: true,
          createdAt: true,
          _count: {
            select: { messages: true }
          }
        }
      }),
      
      // Most popular car models (from oil changes)
      prisma.oilChange.groupBy({
        by: ['carModel'],
        where: {
          carModel: { not: null }
        },
        _count: {
          carModel: true
        },
        orderBy: {
          _count: {
            carModel: 'desc'
          }
        },
        take: 10
      })
    ]);

    // Calculate average messages per chat
    const avgMessagesPerChat = totalChats > 0 
      ? (totalMessages / totalChats).toFixed(2) 
      : '0';

    // Get users created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const newUsersThisWeek = await prisma.user.count({
      where: {
        createdAt: { gte: sevenDaysAgo }
      }
    });

    // Get chats created in last 7 days
    const newChatsThisWeek = await prisma.chat.count({
      where: {
        createdAt: { gte: sevenDaysAgo }
      }
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        verifiedUsers,
        totalChats,
        totalMessages,
        totalOilChanges,
        totalCarParts,
        inStockParts,
        avgMessagesPerChat: parseFloat(avgMessagesPerChat),
        newUsersThisWeek,
        newChatsThisWeek
      },
      recentUsers,
      recentChats,
      popularCarModels: popularCarModels.map((item: any) => ({
        model: item.carModel,
        count: item._count.carModel
      }))
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
