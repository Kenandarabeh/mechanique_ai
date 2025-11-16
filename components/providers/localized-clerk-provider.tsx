"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode, useEffect, useState } from "react";
import { arSA } from "@clerk/localizations";
import { frFR } from "@clerk/localizations";
import { enUS } from "@clerk/localizations";

export function LocalizedClerkProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<string>('ar');

  useEffect(() => {
    // Get locale from localStorage after mount
    const savedLocale = localStorage.getItem('locale') || 'ar';
    if (savedLocale !== locale) {
      setLocale(savedLocale);
    }
  }, [locale]);

  // Get the appropriate localization with custom app name
  const getLocalization = () => {
    const appName = locale === 'ar' ? 'مساعد الميكانيك الذكي' : 'Mechanic AI';
    
    let baseLocalization;
    if (locale === 'ar') baseLocalization = arSA;
    else if (locale === 'fr') baseLocalization = frFR;
    else baseLocalization = enUS;
    
    // Customize the app name in titles
    return {
      ...baseLocalization,
      signIn: {
        ...baseLocalization.signIn,
        start: {
          ...baseLocalization.signIn?.start,
          title: locale === 'ar' 
            ? `سجل دخولك إلى ${appName}` 
            : locale === 'fr'
            ? `Connectez-vous à ${appName}`
            : `Sign in to ${appName}`,
          subtitle: locale === 'ar'
            ? "مرحباً بعودتك! الرجاء تسجيل الدخول للمتابعة"
            : locale === 'fr'
            ? "Bon retour! Veuillez vous connecter pour continuer"
            : "Welcome back! Please sign in to continue",
        },
      },
      signUp: {
        ...baseLocalization.signUp,
        start: {
          ...baseLocalization.signUp?.start,
          title: locale === 'ar'
            ? `أنشئ حسابك في ${appName}`
            : locale === 'fr'
            ? `Créez votre compte ${appName}`
            : `Create your ${appName} account`,
          subtitle: locale === 'ar'
            ? "للوصول إلى مساعدك الشخصي"
            : locale === 'fr'
            ? "pour accéder à votre assistant personnel"
            : "to access your personal assistant",
        },
      },
    };
  };

  return (
    <ClerkProvider
      localization={getLocalization()}
      appearance={{
        layout: {
          logoImageUrl: undefined,
        },
        variables: {
          colorPrimary: '#2563eb',
        },
        elements: {
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
          card: "shadow-lg",
          headerTitle: "text-blue-600 font-bold",
          headerSubtitle: "text-gray-600",
          socialButtonsBlockButton: "border-2 hover:bg-blue-50",
          formFieldLabel: "font-semibold",
          footerActionLink: "text-blue-600 hover:text-blue-700",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
