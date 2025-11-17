"use client";

import { useTranslation } from "@/lib/i18n";

export default function Loading() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-900 dark:border-gray-100 border-t-transparent"></div>
      </div>
    </div>
  );
}
