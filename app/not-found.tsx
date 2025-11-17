"use client";

import { useTranslation } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useTranslation();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <a
          href="/"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
        >
          {t('common.back')}
        </a>
      </div>
    </div>
  );
}
