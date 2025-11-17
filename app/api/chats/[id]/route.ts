import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET a specific chat with its messages
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔷 GET /api/chats/[id] - بدء الطلب");
    
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
    
    console.log("👤 User ID:", verifiedUserId);
    
    if (!verifiedUserId) {
      console.error("❌ غير مصرح - لا يوجد userId");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const { id } = await params;
    console.log("🆔 Chat ID المطلوب:", id);
    console.log("📥 جلب المحادثة", id, "للمستخدم:", verifiedUserId);
    
    console.log("🔍 البحث في قاعدة البيانات...");
    const chat = await prisma.chat.findFirst({
      where: { 
        id,
        userId: verifiedUserId, // Make sure user owns this chat
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    
    console.log("📊 نتيجة البحث:", chat ? "تم العثور على المحادثة" : "لم يتم العثور على المحادثة");
    
    if (!chat) {
      console.error("❌ المحادثة غير موجودة:", id);
      return new Response(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    console.log("✅ تم جلب المحادثة بنجاح!");
    console.log("📝 عدد الرسائل:", chat.messages.length);
    console.log("📋 الرسائل:", chat.messages.map((m: any) => ({ id: m.id, role: m.role, content: m.content.substring(0, 50) + '...' })));
    console.log("📤 إرسال البيانات...");
    
    return new Response(JSON.stringify(chat), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ خطأ في جلب المحادثة:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
