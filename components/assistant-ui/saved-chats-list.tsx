"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n";
import { getApiUrl } from "@/lib/config";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

export function SavedChatsList() {
  const { t, locale } = useTranslation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    fetchChats();
    
    // Refresh every 10 seconds to catch new chats
    const interval = setInterval(fetchChats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchChats = async () => {
    try {
      console.log("🔄 بدء جلب المحادثات المحفوظة...");
      const response = await fetch(getApiUrl("/api/chats"));
      console.log("📡 Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ تم جلب المحادثات بنجاح!");
        console.log("📊 عدد المحادثات:", data.length);
        console.log("📋 المحادثات:", data);
        setChats(data);
      } else {
        console.error("❌ فشل جلب المحادثات - Status:", response.status);
        const errorText = await response.text();
        console.error("❌ تفاصيل الخطأ:", errorText);
      }
    } catch (error) {
      console.error("❌ خطأ في جلب المحادثات:", error);
      console.error("❌ Error details:", error);
    } finally {
      setIsLoading(false);
      console.log("✓ انتهى التحميل");
    }
  };



  if (isLoading) {
    return (
      <div className="space-y-2 px-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
        <MessageSquare className="mx-auto mb-2 h-8 w-8 opacity-50" />
        <p>{t('sidebar.noChats')}</p>
        <p className="mt-1 text-xs">{t('sidebar.startChat')}</p>
      </div>
    );
  }

  const dateLocale = locale === 'ar' ? 'ar-EG' : locale === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <div className="space-y-1 px-2">
      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
        {t('sidebar.savedChats')} ({chats.length})
      </div>
      {chats.map((chat) => (
        <Link
          key={chat.id}
          href={`/chat/${chat.id}`}
          className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-blue-500/10 transition-colors ${
            selectedChatId === chat.id ? "bg-blue-500/20" : ""
          }`}
          onClick={(e) => {
            console.log("🖱️🖱️🖱️ CLICK EVENT FIRED! 🖱️🖱️🖱️");
            console.log("🆔 Chat ID:", chat.id);
            console.log("📝 Title:", chat.title);
            console.log("🔗 URL:", `/chat/${chat.id}`);
            console.log("🔗 Current location:", window.location.href);
            setSelectedChatId(chat.id);
            
            // Force navigation
            console.log("▶️ Forcing navigation...");
            window.location.href = `/chat/${chat.id}`;
          }}
        >
          <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-start text-sm" title={chat.title}>
            {chat.title}
          </span>
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
            {new Date(chat.createdAt).toLocaleDateString(dateLocale, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </Link>
      ))}
    </div>
  );
}
