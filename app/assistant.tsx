"use client";

import { 
  AssistantRuntimeProvider, 
  useExternalStoreRuntime,
  type ThreadMessageLike,
  type AppendMessage,
} from "@assistant-ui/react";
import { useAuth } from "@/contexts/auth-context";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Thread } from "@/components/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { Separator } from "@/components/ui/separator";
import NextImage from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { getApiUrl } from "@/lib/config";
import Loading from "@/components/ui/loading";

interface AssistantProps {
  chatId?: string;
}

export const Assistant = ({ chatId: initialChatId }: AssistantProps = {}) => {
  const { user, token, signOut } = useAuth();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [messages, setMessages] = useState<ThreadMessageLike[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [chatId, setChatId] = useState<string | undefined>(initialChatId);
  const [isMounted, setIsMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  console.log("🔷 Assistant Component - Initialize");
  console.log("Chat ID:", chatId || "NEW");
  console.log("Is Loading:", isLoadingChat);
  console.log("📊 Current messages count:", messages.length);

  // Fix hydration by mounting after client renders
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check admin status
  useEffect(() => {
    if (user) {
      fetch('/api/admin/check')
        .then(res => res.json())
        .then(data => setIsAdmin(data.isAdmin))
        .catch(() => setIsAdmin(false));
    }
  }, [user]);

  // Update chatId when prop changes
  useEffect(() => {
    if (initialChatId !== chatId) {
      console.log("🔄 Chat ID changed from", chatId, "to", initialChatId);
      setChatId(initialChatId);
    }
  }, [initialChatId]);

  // Load chat messages when chatId changes
  useEffect(() => {
    if (!chatId) {
      console.log("🆕 New chat - clearing messages");
      setMessages([]);
      setIsLoadingChat(false);
      return;
    }

    console.log("🔄 Loading chat messages for:", chatId);
    setIsLoadingChat(true);
    
    const loadMessages = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/chats/${chatId}`), {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'x-user-id': user?.id || '',
          },
        });

        if (response.ok) {
          const chat = await response.json();
          console.log("✅ Chat loaded:", chat.messages?.length, "messages");
          console.log("📋 Raw messages from API:", chat.messages);
          
          if (chat.messages && chat.messages.length > 0) {
            const formattedMessages: ThreadMessageLike[] = chat.messages.map((m: any) => ({
              role: m.role as "user" | "assistant",
              content: [{ type: "text" as const, text: m.content }],
              id: m.id,
              createdAt: new Date(m.createdAt),
            }));
            
            console.log("✅ Setting messages:", formattedMessages.length);
            console.log("📋 Formatted messages:", formattedMessages);
            setMessages(formattedMessages);
          } else {
            setMessages([]);
          }
        } else {
          console.error("❌ Failed to load chat:", response.status);
          setMessages([]);
        }
      } catch (error) {
        console.error("❌ Error loading chat:", error);
        setMessages([]);
      } finally {
        setIsLoadingChat(false);
      }
    };

    loadMessages();
  }, [chatId, token, user]);

  // Handler for new messages
  const onNew = useCallback(async (message: AppendMessage) => {
    console.log("📨 onNew called with message:", message);
    console.log("🆔 Current chatId in onNew:", chatId);
    
    if (message.content.length === 0 || message.content[0]?.type !== "text") {
      throw new Error("Only text messages are supported");
    }

    const userText = message.content[0].text;
    console.log("💬 User message:", userText);

    // Add user message to UI immediately
    const userMessage: ThreadMessageLike = {
      role: "user",
      content: [{ type: "text", text: userText }],
      id: `user-${Date.now()}`,
      createdAt: new Date(),
    };
    
    setMessages((prev) => {
      console.log("➕ Adding user message to state");
      console.log("📊 Previous messages:", prev.length);
      console.log("📝 User message to add:", userMessage);
      const newMessages = [...prev, userMessage];
      console.log("📊 New messages count:", newMessages.length);
      return newMessages;
    });

    setIsRunning(true);
    
    try {
      // Prepare all messages for API
      const allMessages = [...messages, userMessage].map(m => {
        const content = m.content;
        const textContent = Array.isArray(content) 
          ? content.find((c: any) => c.type === "text")
          : null;
        return {
          role: m.role,
          content: textContent?.text || (typeof content === "string" ? content : ""),
        };
      });

      // Use the current chatId from state
      const currentChatId = chatId;
      
      console.log("🚀 Sending to API:", allMessages.length, "messages");
      console.log("📋 Messages to send:", allMessages);
      console.log("🆔 Current chatId:", currentChatId || "NEW CHAT");
      console.log("⏳ About to call fetch...");

      const response = await fetch(getApiUrl("/api/chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify({
          messages: allMessages,
          chatId: currentChatId || undefined, // Don't send null, send undefined
        }),
      });

      console.log("📡 Fetch completed! Status:", response.status);
      console.log("📡 Response headers:", Array.from(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      console.log("✅ Response OK, processing stream...");
      console.log("📍 Response body:", response.body ? "EXISTS" : "NULL");

      // Check if new chat was created and get chatId from header
      const newChatIdFromHeader = response.headers.get('X-Chat-Id');
      if (newChatIdFromHeader) {
        console.log("🆔 Chat ID from header:", newChatIdFromHeader);
        console.log("🆔 Current chatId before update:", currentChatId);
        
        // Only update and navigate if this is a new chat
        if (!currentChatId) {
          console.log("🆕 New chat - updating chatId and URL");
          setChatId(newChatIdFromHeader);
          // Navigate to the new chat URL
          window.history.replaceState({}, '', `/chat/${newChatIdFromHeader}`);
        } else {
          console.log("♻️ Existing chat - keeping current chatId");
        }
      }

      // Use AI SDK's readDataStream for proper parsing
      const assistantId = `assistant-${Date.now()}`;
      let assistantText = "";

      // Add empty assistant message
      const assistantMessage: ThreadMessageLike = {
        role: "assistant",
        content: [{ type: "text", text: "" }],
        id: assistantId,
        createdAt: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);

      // Read the stream properly
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      console.log("🔍 Starting to read stream...");
      console.log("📍 Reader:", reader ? "EXISTS" : "NULL");
      
      if (!reader) {
        console.error("❌ No reader available!");
        throw new Error("Response body reader is null");
      }
      
      try {
        let buffer = "";
        
        while (true) {
          const { done, value } = await reader.read();
          
          console.log("📥 Read chunk - done:", done, "value length:", value?.length || 0);
          
          if (done) {
            console.log("✅ Stream completed");
            console.log("📊 Final text length:", assistantText.length);
            break;
          }

          if (!value) {
            console.warn("⚠️ Empty value received");
            continue;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          console.log("📦 Raw chunk received, length:", chunk.length);
          console.log("📦 Chunk preview:", chunk.substring(0, 100));
          
          // Split by lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ""; // Keep incomplete line
          
          console.log("📋 Processing", lines.length, "lines");
          
          for (const line of lines) {
            if (!line.trim()) continue;
            
            console.log("📄 Processing line:", line.substring(0, 80));
            
            // Handle different formats:
            // 1. "data: {json}" - AI SDK stream format
            // 2. "0:{json}" - Alternative format
            let jsonStr = "";
            
            if (line.startsWith('data: ')) {
              jsonStr = line.slice(6); // Remove "data: "
              console.log("🔹 Format: data:");
            } else if (line.startsWith('0:')) {
              jsonStr = line.slice(2); // Remove "0:"
              console.log("🔹 Format: 0:");
            } else {
              console.log("📌 Unknown format:", line.substring(0, 50));
              continue;
            }
            
            if (!jsonStr.trim()) {
              console.log("⚠️ Empty JSON string");
              continue;
            }
            
            try {
              const data = JSON.parse(jsonStr);
              
              console.log("📊 Parsed data type:", data.type);
              
              // Handle text-delta (streaming text)
              if (data.type === 'text-delta' && data.delta) {
                assistantText += data.delta;
                console.log("➕ Added delta:", data.delta.substring(0, 30), "| Total:", assistantText.length);
                
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: [{ type: "text", text: assistantText }] }
                      : m
                  )
                );
              }
              // Legacy format: textDelta instead of delta
              else if (data.type === 'text-delta' && data.textDelta) {
                assistantText += data.textDelta;
                console.log("➕ Added textDelta:", data.textDelta.substring(0, 30), "| Total:", assistantText.length);
                
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: [{ type: "text", text: assistantText }] }
                      : m
                  )
                );
              }
              // Handle complete text
              else if (data.type === 'text' && data.text) {
                assistantText = data.text;
                console.log("✏️ Full text received, length:", assistantText.length);
                
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: [{ type: "text", text: assistantText }] }
                      : m
                  )
                );
              } else {
                console.log("� Other data type:", data.type);
              }
            } catch (parseError) {
              console.warn("⚠️ Parse error:", parseError, "JSON:", jsonStr.substring(0, 50));
            }
          }
        }
      } catch (streamError) {
        console.error("❌ Stream error:", streamError);
        throw streamError;
      }

      console.log("✅ Streaming finished. Total length:", assistantText.length);
      
      // Ensure final message is set
      if (assistantText) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: [{ type: "text", text: assistantText }] }
              : m
          )
        );
      }
      
    } catch (error) {
      console.error("❌ Error in onNew:", error);
      
      // Add error message
      const errorMessage: ThreadMessageLike = {
        role: "assistant",
        content: [{ type: "text", text: t('error.general') }],
        id: `error-${Date.now()}`,
        createdAt: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsRunning(false);
    }
  }, [messages, chatId, token, user]);

  // Create runtime with ExternalStoreRuntime
  const runtime = useExternalStoreRuntime({
    messages,
    isRunning,
    onNew,
    setMessages: useCallback((newMessages: readonly ThreadMessageLike[]) => {
      setMessages([...newMessages]);
    }, []),
    convertMessage: useCallback((message: ThreadMessageLike) => message, []),
    adapters: {
      threadList: {
        onSwitchToNewThread: useCallback(() => {
          console.log("🆕 Switching to new thread");
          // Clear messages for new chat
          setMessages([]);
          // Navigate to home page for new chat
          window.location.href = "/";
        }, []),
      },
    },
  });

  // Show loading state
  if (isLoadingChat) {
    return <Loading text={t('loading.chat')} />;
  }

  return (
    <AssistantRuntimeProvider
      key={chatId || "new-chat"}
      runtime={runtime}
    >
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-dvh w-full">
          <ThreadListSidebar            />
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-gradient-to-l from-gray-100/50 to-gray-50/30 dark:from-gray-800/50 dark:to-gray-900/30">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
              </div>
              
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <NextImage
                      src="/logo.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">{t('header.title')}</h1>
                    <p className="text-xs text-muted-foreground">{t('header.subtitle')}</p>
                  </div>
                  <div className="sm:hidden">
                    <h1 className="font-semibold text-[11px] leading-tight text-gray-900 dark:text-gray-100">MechaMind</h1>
                    <p className="text-[9px] leading-tight text-muted-foreground">مساعدك الذكي للميكانيك</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <Separator orientation="vertical" className="h-4" />
                {isMounted && user && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push('/oil-tracker')}
                      title={t('oilTracker.title')}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <span className="text-xl">🛢️</span>
                    </Button>
                    {isAdmin && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push('/admin')}
                          title="Admin Panel"
                          className="hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <span className="text-xl">⚙️</span>
                        </Button>
                      </>
                    )}
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-sm text-muted-foreground hidden sm:inline">{user.name || user.email}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push('/profile')}
                      title={t('profile.title')}
                    >
                      <User className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={signOut}
                      title={t('header.signOut')}
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
