"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Assistant } from "./assistant";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // Client-side redirect if not authenticated
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [loading, user, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
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

  return <Assistant />;
}
