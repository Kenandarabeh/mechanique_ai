'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/lib/i18n';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, refreshAuth } = useAuth();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user) {
      setFormData(prev => ({ ...prev, name: user.name || '' }));
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validate passwords if changing
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError(t('profile.currentPasswordRequired'));
        setIsSubmitting(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError(t('profile.passwordMismatch'));
        setIsSubmitting(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError(t('profile.passwordTooShort'));
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Get token from localStorage
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('profile.updateFailed'));
      }

      setSuccess(t('profile.updateSuccess'));
      await refreshAuth();
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      setError(err.message || t('profile.updateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            {t('profile.title')}
          </h1>

          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('profile.email')}
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {user.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                {t('profile.changePassword')}
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.currentPassword')}
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.newPassword')}
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('profile.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
            >
              {!isSubmitting && t('profile.save')}
            </button>

            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              {t('common.back')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
