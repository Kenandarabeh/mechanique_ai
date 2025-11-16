"use client";

import { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

export function DynamicHtmlAttributes() {
  const { locale } = useTranslation();

  useEffect(() => {
    const html = document.documentElement;
    
    // Update lang attribute
    const langMap = {
      ar: 'ar',
      en: 'en',
      fr: 'fr',
    };
    html.lang = langMap[locale as keyof typeof langMap] || 'ar';

    // Update dir attribute
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    html.dir = dir;

    // Update class for RTL/LTR
    if (dir === 'rtl') {
      html.classList.add('rtl');
      html.classList.remove('ltr');
    } else {
      html.classList.add('ltr');
      html.classList.remove('rtl');
    }
  }, [locale]);

  return null;
}
