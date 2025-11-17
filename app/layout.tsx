import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { TranslationProvider } from "@/lib/i18n";
import { DynamicTitle } from "@/components/dynamic-title";
import { DynamicHtmlAttributes } from "@/components/dynamic-html-attributes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🔧 مساعد الميكانيك الذكي | Mechanic AI | Assistant Mécanicien",
  description: "مساعدك الشخصي لصيانة وإصلاح السيارات | Your personal car maintenance and repair assistant | Votre assistant personnel pour l'entretien et la réparation automobile",
  applicationName: "مساعد الميكانيك الذكي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <TranslationProvider>
            <DynamicTitle />
            <DynamicHtmlAttributes />
            {children}
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
