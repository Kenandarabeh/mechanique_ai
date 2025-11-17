"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Assistant } from "@/app/assistant";
import { useEffect } from "react";

export default function ChatPage() {
  console.log("🔷 ChatPage Component - تم التحميل");
  
  const params = useParams();
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  
  const chatId = params?.id as string | undefined;
  console.log("🆔 Chat ID:", chatId);

  useEffect(() => {
    // Client-side auth check for Static Export
    if (isLoaded && !userId) {
      console.log("⚠️ Not authenticated, redirecting to sign-in");
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated (will redirect)
  if (!userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  console.log("▶️ عرض مكون Assistant مع chatId:", chatId);
  return <Assistant chatId={chatId} />;
}
