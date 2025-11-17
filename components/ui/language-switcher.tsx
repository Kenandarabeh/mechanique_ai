"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation, Locale } from "@/lib/i18n";

const languages = [
  { code: 'ar' as Locale, label: 'العربية', flag: '🇸🇦' },
  { code: 'en' as Locale, label: 'English', flag: '🇺🇸' },
  { code: 'fr' as Locale, label: 'Français', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t('header.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={`cursor-pointer ${locale === lang.code ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : ''}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
