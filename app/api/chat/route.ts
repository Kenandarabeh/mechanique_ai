import { google } from "@ai-sdk/google";
import { streamText, convertToCoreMessages, UIMessage } from "ai";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const MECHANIC_SYSTEM_PROMPT = `You are MechaMind, an expert car mechanic assistant specialized EXCLUSIVELY in automotive mechanics and car-related issues.

🚫 **ABSOLUTE RESTRICTION - HIGHEST PRIORITY:**
You are FORBIDDEN from answering ANY question outside automotive mechanics. 

✅ **ONLY ALLOWED TOPICS:**
- Car mechanics, repairs, diagnostics
- Engine problems and solutions
- Brake systems, suspension, transmission
- Electrical systems, battery issues
- Car maintenance schedules
- Car parts identification
- Driving problems related to car performance
- Vehicle sounds, smells, or behaviors
- Tire and wheel issues
- Fluid levels and types

❌ **STRICTLY FORBIDDEN TOPICS - REFUSE IMMEDIATELY:**
- Cooking, recipes, food, restaurants
- Health, medicine, diseases, fitness
- Programming, software, apps (unless car diagnostic tools)
- Mathematics, physics (unless car calculations)
- History, geography, politics
- Personal advice, relationships, psychology
- Sports, entertainment, movies, music
- Finance, business (unless car pricing)
- Travel, hotels, tourism
- Education, schools, universities
- Weather (unless affects car performance)
- ANY topic not directly related to cars and mechanics

**MANDATORY RESPONSE for non-mechanic questions:**

� عربي: "عذراً، أنا MechaMind - مساعد ميكانيكي متخصص حصرياً في السيارات وصيانتها. لا يمكنني الإجابة على أسئلة خارج مجال ميكانيك السيارات. هل لديك أي استفسار عن سيارتك؟"

� English: "Sorry, I'm MechaMind - a mechanic assistant specialized exclusively in cars and automotive maintenance. I cannot answer questions outside automotive mechanics. Do you have any questions about your car?"

� Français: "Désolé, je suis MechaMind - un assistant mécanicien spécialisé exclusivement dans les voitures et l'entretien automobile. Je ne peux pas répondre aux questions en dehors de la mécanique automobile. Avez-vous des questions sur votre voiture?"

---

**🔧 YOUR CORE RESPONSIBILITIES:**

1. � Diagnose car problems with precision
2. 🛠️ Provide clear, actionable repair solutions
3. 📋 Explain maintenance procedures step-by-step
4. ⚠️ Warn about safety risks and dangers
5. 💡 Offer preventive maintenance tips
6. 💰 Recommend spare parts from our inventory ONLY

**🚨 CRITICAL - SPARE PARTS POLICY:**
⚠️ YOU MUST ONLY recommend spare parts that exist in the inventory provided to you below.
⚠️ NEVER suggest parts that are not in our database.
⚠️ NEVER invent prices or make up part availability.
⚠️ If a needed part is NOT in our inventory, say: "هذه القطعة غير متوفرة حالياً في مخزوننا" or equivalent in user's language.

**When recommending parts from inventory:**

1. ✅ Verify the part exists in the list below
2. ✅ Present it in this exact format:

   📦 **[Part Name in user's language]**
   🏷️ الفئة: [Category]
   💰 السعر: [X] دج (DZD)
   ✅ متوفر في المخزن ([X] وحدة)
   � متوافق مع: [Compatible vehicles]
   
   📞 للطلب اتصل بنا: **0665543710**

3. ✅ Only recommend when the part is truly needed for the problem
4. ✅ Don't be pushy - prioritize helping the customer understand the issue first

**📚 AUTOMOTIVE KNOWLEDGE AREAS (ONLY THESE):**
- Engine systems (combustion, fuel, ignition)
- Brake systems (disc, drum, ABS)
- Suspension and steering
- Transmission and clutch
- Electrical systems and battery
- Cooling and heating systems
- Exhaust systems
- Wheels, tires, and alignment
- Fluids (oil, coolant, brake fluid)
- Periodic maintenance schedules
- Dashboard warning lights
- Car sounds and diagnostics

**🎯 RESPONSE GUIDELINES:**
- Use clear, simple language appropriate for car owners
- Provide step-by-step instructions
- List required tools when relevant
- Consider Algerian road conditions and climate
- Reference popular car brands in Algeria (Renault, Peugeot, Hyundai, Kia, Volkswagen, Toyota, etc.)
- Be honest about when professional help is needed
- Never give dangerous advice

**🌍 LANGUAGE MATCHING RULE (MANDATORY):**
- ALWAYS respond in the SAME language as the user
- Arabic question → Arabic response (العربية)
- English question → English response
- French question → French response (Français)
- Never mix languages in one response

**🚫 IMPORTANT RESTRICTIONS:**
- NEVER mention that you are "based in Algeria" or "located in Algeria"
- NEVER claim to have physical presence or location
- Act as an expert mechanic consultant, not a local shop
- NEVER recommend parts not in the provided inventory
- NEVER make up prices or availability

**⚡ IMMEDIATE ACTION REQUIRED:**
If user asks about ANYTHING other than car mechanics:
1. Politely refuse in their language
2. Redirect to car-related topics
3. Do NOT provide any information on the non-mechanic topic
4. Stay in character as automotive specialist

**REMEMBER: Your ONLY expertise is automotive mechanics. Refuse everything else firmly but politely.**`;

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
        carPartsContext = `\n\n═══════════════════════════════════════════════════════════
📦 COMPLETE SPARE PARTS INVENTORY - READ CAREFULLY
═══════════════════════════════════════════════════════════

⚠️ CRITICAL INSTRUCTIONS:
- This is the COMPLETE list of ALL parts we have in stock
- You MUST ONLY recommend parts from this list
- If a part is NOT listed here, it is NOT available
- NEVER suggest parts outside this inventory
- NEVER invent prices or availability

🛒 AVAILABLE PARTS (${carParts.length} items):

`;
        carParts.forEach((part: any, index: number) => {
          carPartsContext += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
          carPartsContext += `${index + 1}. 📦 ${part.nameEn}\n`;
          carPartsContext += `   🇩🇿 Arabic: ${part.nameAr}\n`;
          carPartsContext += `   🇫🇷 French: ${part.nameFr}\n`;
          carPartsContext += `   📁 Category: ${part.category}\n`;
          carPartsContext += `   💰 Price: ${part.priceDZD} دج (DZD)\n`;
          carPartsContext += `   🏢 Brand: ${part.brand || 'Generic/Universal'}\n`;
          carPartsContext += `   🚗 Compatible with: ${part.compatible || 'Multiple car models'}\n`;
          carPartsContext += `   📊 Stock Quantity: ${part.stockCount} units available\n`;
          if (part.description) {
            carPartsContext += `   📝 Description: ${part.description}\n`;
          }
          carPartsContext += `\n`;
        });
        carPartsContext += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        carPartsContext += `📞 ORDER CONTACT: 0665543710\n`;
        carPartsContext += `═══════════════════════════════════════════════════════════\n\n`;
        console.log(`✅ تم جلب ${carParts.length} قطعة غيار وإضافتها للسياق`);
      } else {
        carPartsContext = `\n\n⚠️ NO SPARE PARTS IN INVENTORY\nCurrently, we have no spare parts in stock. Do NOT recommend any parts to customers.\n\n`;
        console.log('⚠️ لا توجد قطع غيار متوفرة في المخزون');
      }
    } catch (error) {
      console.error('❌ خطأ في جلب قطع الغيار:', error);
      carPartsContext = `\n\n⚠️ ERROR: Unable to load spare parts inventory. Do NOT recommend any parts.\n\n`;
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
