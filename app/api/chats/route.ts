import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET all chats for the current user
export async function GET(request: Request) {
  try {
    // Get userId from JWT or header
    const userId = request.headers.get("x-user-id");
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    // Verify JWT if provided
    let verifiedUserId = userId;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        verifiedUserId = decoded.userId;
      }
    }
    
    if (!verifiedUserId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    console.log("📥 جلب المحادثات من Prisma للمستخدم:", verifiedUserId);
    
    const chats = await prisma.chat.findMany({
      where: { userId: verifiedUserId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });
    
    console.log("✓ تم جلب", chats.length, "محادثة");
    
    // Format response
    const formatted = chats.map((chat: { id: string; title: string; createdAt: Date }) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
    }));
    
    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ خطأ في جلب المحادثات:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chats" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
