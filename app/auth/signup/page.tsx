"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<string>('en');
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
  }, []);

  const texts = {
    ar: {
      title: "إنشاء حساب جديد",
      subtitle: "انضم إلى مساعد الميكانيك الذكي",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      name: "الاسم (اختياري)",
      signup: "تسجيل",
      verifyTitle: "تحقق من بريدك",
      verifySubtitle: "أدخل الرمز المرسل إلى",
      code: "رمز التحقق (6 أرقام)",
      verify: "تحقق",
      resend: "إعادة إرسال الرمز",
      hasAccount: "لديك حساب؟",
      signin: "تسجيل الدخول",
      sending: "جاري الإرسال...",
      verifying: "جاري التحقق...",
    },
    en: {
      title: "Create Account",
      subtitle: "Join Mechanic AI Assistant",
      email: "Email",
      password: "Password",
      name: "Name (optional)",
      signup: "Sign Up",
      verifyTitle: "Check your email",
      verifySubtitle: "Enter the code sent to",
      code: "Verification Code (6 digits)",
      verify: "Verify",
      resend: "Resend Code",
      hasAccount: "Have an account?",
      signin: "Sign In",
      sending: "Sending...",
      verifying: "Verifying...",
    },
    fr: {
      title: "Créer un compte",
      subtitle: "Rejoignez l'assistant mécanicien IA",
      email: "Email",
      password: "Mot de passe",
      name: "Nom (optionnel)",
      signup: "S'inscrire",
      verifyTitle: "Vérifiez votre email",
      verifySubtitle: "Entrez le code envoyé à",
      code: "Code de vérification (6 chiffres)",
      verify: "Vérifier",
      resend: "Renvoyer le code",
      hasAccount: "Vous avez un compte?",
      signin: "Se connecter",
      sending: "Envoi...",
      verifying: "Vérification...",
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.en;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to sign up');
        return;
      }

      // Log development code in console only (no alert)
      if (data.code) {
        console.log('🔐 Development Code:', data.code);
      }

      setStep('verify');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid code');
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

  if (step === 'verify') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black" dir={dir}>
        <div className="w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <svg className="h-16 w-16 text-gray-900 dark:text-gray-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t.verifyTitle}</h1>
            <p className="mt-2 text-muted-foreground">{t.verifySubtitle}</p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{email}</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700" dir="ltr">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium">{t.code}</label>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="text-center text-2xl font-bold tracking-wider"
                dir="ltr"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
            >
              {loading ? t.verifying : t.verify}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSignUp({ preventDefault: () => {} } as React.FormEvent)}
              disabled={loading}
              className="w-full"
            >
              {t.resend}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black" dir={dir}>
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-16 w-16 text-gray-900 dark:text-gray-100" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
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
              minLength={6}
              dir="ltr"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">{t.name}</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
          >
            {loading ? t.sending : t.signup}
          </Button>

          <p className="text-center text-sm">
            {t.hasAccount}{' '}
            <a href="/sign-in" className="font-semibold text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
              {t.signin}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
