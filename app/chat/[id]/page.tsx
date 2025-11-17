"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Assistant } from "@/app/assistant";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

export default function ChatPage() {
  console.log("🔷 ChatPage Component - Loaded");
  
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  
  const chatId = params?.id as string | undefined;
  console.log("🆔 Chat ID:", chatId);

  useEffect(() => {
    // Client-side auth check
    if (!loading && !user) {
      console.log("⚠️ Not authenticated, redirecting to sign-in");
      router.push("/auth/signin");
    }
  }, [loading, user, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated (will redirect)
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading.chat')}</p>
        </div>
      </div>
    );
  }

  console.log("▶️ عرض مكون Assistant مع chatId:", chatId);
  return <Assistant chatId={chatId} />;
}
