"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SetupAdminPage() {
  const [email, setEmail] = useState('admin@mechamind.dz');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, secretKey })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Success! Admin created: ${data.email}`);
        setEmail('');
        setPassword('');
        setSecretKey('');
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-center mb-2">🔧 MechaMind</h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-700 dark:text-gray-300">
          Admin Setup
        </h2>

        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>هام:</strong> هذه الصفحة لإنشاء حساب Admin الأول فقط.
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
            Secret Key الافتراضي: <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">mechamind-super-admin-2025</code>
          </p>
        </div>

        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@mechamind.dz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secret Key</label>
            <Input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              placeholder="mechamind-super-admin-2025"
            />
            <p className="text-xs text-gray-500 mt-1">
              أدخل Secret Key (يمكن تغييره في .env.local)
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
          >
            {loading ? 'جاري الإنشاء...' : '✅ Create Admin'}
          </Button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/auth/signin" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            ← العودة إلى تسجيل الدخول
          </a>
        </div>

        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">📝 ملاحظات:</h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• يمكن إنشاء admin واحد فقط</li>
            <li>• بعد الإنشاء، استخدم البريد وكلمة المرور للدخول</li>
            <li>• سيظهر لك زر ⚙️ في الـ Header</li>
            <li>• يمكنك إضافة قطع الغيار من Admin Panel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
