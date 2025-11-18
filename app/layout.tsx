import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { TranslationProvider } from "@/lib/i18n";
import { DynamicTitle } from "@/components/dynamic-title";
import { DynamicHtmlAttributes } from "@/components/dynamic-html-attributes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "🔧 MechaMind | مساعدك الذكي للميكانيك",
  description: "مساعدك الذكي لصيانة وإصلاح السيارات | Your smart assistant for car maintenance and repair | Votre assistant intelligent pour l'entretien et la réparation automobile",
  applicationName: "MechaMind",
  authors: [{ name: "MechaMind Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="rtl">
      <body
        className={`${inter.variable} antialiased`}
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
