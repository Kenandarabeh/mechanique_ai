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
    const appName = 'MechaMind';
    
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
      // Support for Static Export (SSG) - no server-side redirects
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/"
      afterSignUpUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      // IMPORTANT: Disable OAuth redirects for mobile apps
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      appearance={{
        layout: {
          logoImageUrl: undefined,
          // Hide social login buttons in mobile (they open browser)
          socialButtonsVariant: 'iconButton',
          socialButtonsPlacement: 'bottom',
        },
        variables: {
          colorPrimary: 'black',
        },
        elements: {
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
          card: "shadow-lg",
          headerTitle: "text-blue-600 font-bold",
          headerSubtitle: "text-gray-600",
          socialButtonsBlockButton: "border-2 hover:bg-blue-50",
          formFieldLabel: "font-semibold",
          footerActionLink: "text-blue-600 hover:text-blue-700",
          // Hide divider if you want to completely remove social login
          socialButtonsBlockButtonText__google: "hidden",
          socialButtonsBlockButtonText__facebook: "hidden",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
