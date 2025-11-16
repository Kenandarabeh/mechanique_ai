"use client";

import { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

export function DynamicTitle() {
  const { locale } = useTranslation();

  useEffect(() => {
    // Update document title based on locale
    const titles = {
      ar: '🔧 مساعد الميكانيك الذكي',
      en: '🔧 Mechanic AI',
      fr: '🔧 Assistant Mécanicien',
    };

    document.title = titles[locale as keyof typeof titles] || titles.ar;
  }, [locale]);

  return null; // This component doesn't render anything
}
