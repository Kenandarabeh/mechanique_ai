import { google } from "@ai-sdk/google";
import { streamText, convertToCoreMessages, UIMessage } from "ai";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const MECHANIC_SYSTEM_PROMPT = `You are an expert car mechanic assistant. Your role is to:

1. 🔧 Accurately diagnose car problems
2. 🛠️ Provide practical and clear solutions
3. 📋 Explain maintenance and repair steps in detail
4. ⚠️ Warn about potential risks
5. 💡 Give tips to prevent problems
6. 💰 Provide cost estimates in Algerian Dinars (DZD) when recommending spare parts

**IMPORTANT - Spare Parts Database:**
You have access to a database of available car parts with prices in DZD. When you identify that a customer needs a specific part:
1. Check if we have it in our inventory (the parts will be provided to you)
2. If available, present it like this:
   
   📦 **[Part Name in user's language]**
   💰 Price: [X] DZD
   ✅ Available in stock
   
   📞 To order this part, please contact us at: **0665543710**

3. Only suggest parts from our inventory when relevant to the problem
4. Be helpful but not pushy - only recommend when truly needed

When answering:
- Use clear and simple language
- Provide specific and actionable steps
- Mention required tools if necessary
- Consider local road and climate conditions
- Reference common car brands (Renault, Peugeot, Hyundai, Kia, etc.)
- Indicate when to consult a professional mechanic
- Be patient and helpful

Areas you cover:
- Car engines
- Brake systems
- Suspension system
- Electrical and battery
- Cooling system
- Transmission (gearbox)
- Wheels and tires
- Periodic maintenance

**CRITICAL LANGUAGE RULE:** 
- Always respond in the SAME LANGUAGE as the user's question
- If the user writes in Arabic (العربية), respond in Arabic
- If in English, respond in English  
- If in French (Français), respond in French
- Match the user's language exactly

**NEVER mention that you are "based in Algeria" or "from Algeria" - just help as an expert mechanic.**`;

export async function POST(req: Request) {
  try {
    console.log('🔷 POST /api/chat - بدء الطلب');
    
    // Get userId from JWT or header
    const userId = req.headers.get("x-user-id");
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    // Verify JWT if provided
    let verifiedUserId = userId;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        verifiedUserId = decoded.userId;
      }
    }
    
    console.log('👤 التحقق من المصادقة...');
    
    if (!verifiedUserId) {
      console.error('❌ غير مصرح - لا يوجد userId');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ User authenticated:', verifiedUserId);

    const body = await req.json();
    console.log('📦 Body المستلم:', JSON.stringify(body, null, 2));
    
    const { messages, chatId }: { messages?: UIMessage[]; chatId?: string } = body;
    
    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ خطأ: الرسائل غير صحيحة أو فارغة');
      return new Response(
        JSON.stringify({ error: 'Messages are required and must be an array' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('📝 عدد الرسائل المستلمة:', messages.length);
    console.log('🆔 Chat ID المستلم:', chatId || 'لا يوجد (محادثة جديدة)');
    console.log('📋 الرسائل:', messages.map((m: any) => ({ role: m.role, content: typeof m.content === 'string' ? m.content.substring(0, 50) : 'complex' })));
    
    let newChatId: string | undefined = chatId;
    
    // Fetch available car parts from database
    console.log('🔧 جلب قطع الغيار من قاعدة البيانات...');
    let carPartsContext = '';
    try {
      // @ts-ignore - CarPart model exists after prisma generate
      const carParts = await prisma.carPart.findMany({
        where: { inStock: true },
        select: {
          nameAr: true,
          nameEn: true,
          nameFr: true,
          category: true,
          priceDZD: true,
          brand: true,
          compatible: true,
          stockCount: true,
          description: true
        }
      });
      
      if (carParts.length > 0) {
        carPartsContext = `\n\n**AVAILABLE SPARE PARTS IN INVENTORY:**\n\n`;
        carParts.forEach((part: any, index: number) => {
          carPartsContext += `${index + 1}. **${part.nameEn}** (${part.nameAr} / ${part.nameFr})\n`;
          carPartsContext += `   - Category: ${part.category}\n`;
          carPartsContext += `   - Price: ${part.priceDZD} DZD\n`;
          carPartsContext += `   - Brand: ${part.brand || 'N/A'}\n`;
          carPartsContext += `   - Compatible: ${part.compatible || 'Various models'}\n`;
          carPartsContext += `   - Stock: ${part.stockCount} units\n`;
          if (part.description) {
            carPartsContext += `   - Details: ${part.description}\n`;
          }
          carPartsContext += `\n`;
        });
        carPartsContext += `📞 **Contact Number for Orders: 0665543710**\n\n`;
        console.log(`✅ تم جلب ${carParts.length} قطعة غيار`);
      } else {
        console.log('⚠️ لا توجد قطع غيار متوفرة في المخزون');
      }
    } catch (error) {
      console.error('❌ خطأ في جلب قطع الغيار:', error);
    }
    
    // Prepare messages for Gemini (simple format)
    const preparedMessages = messages.map((m: any) => ({
      role: m.role as 'user' | 'assistant',
      content: typeof m.content === 'string' ? m.content : String(m.content),
    }));
    
    console.log('📋 Prepared messages:', preparedMessages.length);
    console.log('📋 First message:', preparedMessages[0]);
    
    const result = streamText({
      model: google("gemini-2.5-flash-lite"), // استخدام النموذج الأخف والأسرع
      system: MECHANIC_SYSTEM_PROMPT + carPartsContext,
      messages: preparedMessages,
      maxRetries: 5, // زيادة عدد المحاولات
      onFinish: async ({ text }) => {
        console.log('✅ اكتمل الرد من Gemini');
        console.log('📝 طول الرد:', text.length, 'حرف');
        
        try {
          // Find the last user message
          let lastUserMessage = messages[messages.length - 1];
          
          // If last message is not user, find the last user message
          if (lastUserMessage.role !== 'user') {
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].role === 'user') {
                lastUserMessage = messages[i];
                break;
              }
            }
          }
          
          console.log('📩 آخر رسالة من المستخدم:', lastUserMessage);
          
          let question = "";
          
          const content = (lastUserMessage as any).content;
          console.log('📄 نوع المحتوى:', typeof content);
          console.log('📄 المحتوى الكامل:', content);
          
          if (typeof content === "string") {
            question = content;
          } else if (Array.isArray(content)) {
            const textPart = content.find((p: any) => p.type === "text");
            question = textPart?.text || "";
          } else if (content && typeof content === 'object') {
            // Handle object with text property
            question = (content as any).text || "";
          }
          
          console.log('❓ السؤال المستخرج:', question);
          
          if (!question || question.trim() === "") {
            console.warn('⚠️ تحذير: السؤال فارغ! استخدام fallback');
            question = "محادثة جديدة";
          }

          if (!newChatId) {
            // Create new chat with Prisma
            console.log('💾 إنشاء محادثة جديدة في Prisma...');
            console.log('👤 User ID:', verifiedUserId);
            console.log('📝 العنوان:', question.substring(0, 100));
            
            const createdChat = await prisma.chat.create({
              data: {
                userId: verifiedUserId,
                title: question.substring(0, 100),
                messages: {
                  create: [
                    {
                      role: "user",
                      content: question,
                    },
                    {
                      role: "assistant",
                      content: text,
                    },
                  ],
                },
              },
            });
            newChatId = createdChat.id;
            console.log('✅ تم إنشاء المحادثة بنجاح!');
            console.log('🆔 Chat ID الجديد:', newChatId);
            console.log('📊 تفاصيل المحادثة:', createdChat);
          } else {
            // Add messages to existing chat
            console.log('💾 إضافة رسائل إلى المحادثة الموجودة:', newChatId);
            console.log('📝 السؤال:', question);
            console.log('📝 الجواب:', text.substring(0, 100) + '...');
            
            const result = await prisma.message.createMany({
              data: [
                {
                  chatId: newChatId,
                  role: "user",
                  content: question,
                },
                {
                  chatId: newChatId,
                  role: "assistant",
                  content: text,
                },
              ],
            });
            
            console.log('✅ تم حفظ الرسائل بنجاح!');
            console.log('📊 عدد الرسائل المحفوظة:', result.count);
          }
        } catch (error) {
          console.error('❌ فشل الحفظ في Prisma:', error);
          console.error('❌ تفاصيل الخطأ:', error instanceof Error ? error.message : error);
          console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
        }
      },
    });

    console.log('✅ Stream بدأ بنجاح');
    
    // Add chatId to response headers
    const response = result.toUIMessageStreamResponse();
    if (newChatId) {
      response.headers.set('X-Chat-Id', newChatId);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error in chat API:', error);
    
    // معالجة خاصة لأخطاء Gemini
    let errorMessage = 'حدث خطأ أثناء معالجة الطلب';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('overloaded') || error.message.includes('UNAVAILABLE')) {
        errorMessage = 'الخدمة مشغولة حاليًا. الرجاء المحاولة مرة أخرى بعد قليل.';
        statusCode = 503;
      } else if (error.message.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = 'تم تجاوز الحد المسموح. الرجاء الانتظار قليلاً.';
        statusCode = 429;
      } else {
        errorMessage = error.message;
      }
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      retry: statusCode === 503 || statusCode === 429 
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
