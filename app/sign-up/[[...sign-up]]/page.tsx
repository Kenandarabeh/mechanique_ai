"use client";

import { SignUp, ClerkProvider } from "@clerk/nextjs";
import { arSA, frFR } from "@clerk/localizations";
import { useEffect, useState } from "react";

function SignUpContent() {
  const [locale, setLocale] = useState<string>('ar');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'ar';
    setLocale(savedLocale);
  }, []);

  const getTexts = () => {
    if (locale === 'ar') {
      return {
        title: "مساعد الميكانيك الذكي",
        subtitle: "أنشئ حسابك للبدء في استخدام المساعد"
      };
    } else if (locale === 'fr') {
      return {
        title: "Assistant Mécanicien",
        subtitle: "Créez votre compte pour commencer à utiliser l'assistant"
      };
    } else {
      return {
        title: "Mechanic AI",
        subtitle: "Create your account to start using the assistant"
      };
    }
  };

  const texts = getTexts();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-blue-950" dir={dir}>
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-16 w-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-blue-600">{texts.title}</h1>
          <p className="mt-2 text-muted-foreground">{texts.subtitle}</p>
        </div>
        <SignUp 
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          forceRedirectUrl="/"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              formFieldInput: "rounded-lg",
              footerActionLink: "text-blue-600 hover:text-blue-700",
            }
          }}
        />
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const [locale, setLocale] = useState<string>('ar');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'ar';
    setLocale(savedLocale);
  }, []);

  const getLocalization = () => {
    if (locale === 'ar') return arSA;
    if (locale === 'fr') return frFR;
    return undefined; // Use default for English
  };

  return (
    <ClerkProvider localization={getLocalization()}>
      <SignUpContent />
    </ClerkProvider>
  );
}
