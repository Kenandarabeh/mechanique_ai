'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();
  
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">Error</h1>
        <h2 className="mt-4 text-2xl font-semibold">{t('error.general')}</h2>
        <p className="mt-4 text-sm text-gray-500">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
        >
          {t('common.back')}
        </button>
        <a
          href="/"
          className="mt-4 block text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
        >
          {t('sidebar.newChat')}
        </a>
      </div>
    </div>
  );
}
