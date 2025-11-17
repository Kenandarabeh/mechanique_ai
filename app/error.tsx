'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-blue-950">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-red-600">خطأ</h1>
        <h2 className="mt-4 text-2xl font-semibold">حدث خطأ ما</h2>
        <p className="mt-2 text-muted-foreground">Something went wrong</p>
        <p className="mt-4 text-sm text-gray-500">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          حاول مرة أخرى
        </button>
        <a
          href="/"
          className="mt-4 block text-blue-600 hover:text-blue-700"
        >
          العودة إلى الصفحة الرئيسية
        </a>
      </div>
    </div>
  );
}
