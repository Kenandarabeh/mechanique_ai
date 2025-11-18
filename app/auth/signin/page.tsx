"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NextImage from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<string>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
  }, []);

  const texts = {
    ar: {
      title: "تسجيل الدخول",
      subtitle: "مرحبًا بعودتك!",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      signin: "تسجيل الدخول",
      noAccount: "ليس لديك حساب؟",
      signup: "إنشاء حساب",
      signingIn: "جاري تسجيل الدخول...",
    },
    en: {
      title: "Sign In",
      subtitle: "Welcome back!",
      email: "Email",
      password: "Password",
      signin: "Sign In",
      noAccount: "Don't have an account?",
      signup: "Sign Up",
      signingIn: "Signing in...",
    },
    fr: {
      title: "Connexion",
      subtitle: "Bon retour!",
      email: "Email",
      password: "Mot de passe",
      signin: "Se connecter",
      noAccount: "Pas de compte?",
      signup: "S'inscrire",
      signingIn: "Connexion...",
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to sign in');
        return;
      }

      // Store token
      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Force page reload to refresh auth context
      window.location.href = '/';
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black" dir={dir}>
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative w-20 h-20">
              <NextImage
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium">{t.email}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">{t.password}</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
          >
            {loading ? t.signingIn : t.signin}
          </Button>

          <p className="text-center text-sm">
            {t.noAccount}{' '}
            <a href="/auth/signup" className="font-semibold text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
              {t.signup}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
