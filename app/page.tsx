"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Assistant } from "./assistant";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import Loading from "@/components/ui/loading";

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
    return <Loading />;
  }

  // Show loading if not authenticated (will redirect)
  if (!user) {
    return <Loading text={t('loading.chat')} />;
  }

  return <Assistant />;
}
