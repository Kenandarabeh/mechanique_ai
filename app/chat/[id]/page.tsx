"use client";

import { useParams, useRouter } from "next/navigation";
import { Assistant } from "@/app/assistant";
import { useEffect } from "react";

export default function ChatPage() {
  console.log("🔷 ChatPage Component - تم التحميل");
  
  const params = useParams();
  const router = useRouter();
  console.log("📦 Params:", params);
  
  const chatId = params?.id as string | undefined;
  console.log("🆔 Chat ID:", chatId);

  useEffect(() => {
    console.log("🔄 useEffect في ChatPage - chatId:", chatId);
    if (chatId) {
      console.log("📂 فتح محادثة:", chatId);
    } else {
      console.log("⚠️ لا يوجد chatId!");
    }
  }, [chatId]);

  console.log("▶️ عرض مكون Assistant مع chatId:", chatId);
  return <Assistant chatId={chatId} />;
}
