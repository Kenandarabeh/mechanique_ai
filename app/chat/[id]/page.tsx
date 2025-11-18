"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Assistant } from "@/app/assistant";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import Loading from "@/components/ui/loading";

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
    return <Loading text={t('common.loading')} />;
  }

  // Show loading if not authenticated (will redirect)
  if (!user) {
    return <Loading text={t('loading.chat')} />;
  }

  console.log("▶️ عرض مكون Assistant مع chatId:", chatId);
  return <Assistant chatId={chatId} />;
}
