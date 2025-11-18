"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';

interface OilChange {
  date: string;
  km: number;
  notes?: string;
}

interface CarData {
  model: string;
  purchaseDate: string;
  currentKm: number;
  lastChangeDate: string;
  lastChangeKm: number;
  changes: OilChange[];
}

export default function OilTrackerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  
  const [carData, setCarData] = useState<CarData>({
    model: '',
    purchaseDate: '',
    currentKm: 0,
    lastChangeDate: '',
    lastChangeKm: 0,
    changes: []
  });
  
  const [newKm, setNewKm] = useState('');
  const [notes, setNotes] = useState('');

  // Load data from localStorage
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }
    
    if (user) {
      const saved = localStorage.getItem(`oil-tracker-${user.email}`);
      if (saved) {
        setCarData(JSON.parse(saved));
      }
      setLoading(false);
    }
  }, [user, authLoading, router]);

  // Save data to localStorage
  const saveData = (data: CarData) => {
    if (user) {
      localStorage.setItem(`oil-tracker-${user.email}`, JSON.stringify(data));
      setCarData(data);
    }
  };

  // Calculate days since last change
  const daysSinceChange = () => {
    if (!carData.lastChangeDate) return 0;
    const lastChange = new Date(carData.lastChangeDate);
    const today = new Date();
    const diff = today.getTime() - lastChange.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // Calculate km since last change
  const kmSinceChange = () => {
    return carData.currentKm - carData.lastChangeKm;
  };

  // Get status
  const getStatus = () => {
    const days = daysSinceChange();
    const km = kmSinceChange();
    
    if (days >= 180 || km >= 5000) return 'overdue';
    if (days >= 150 || km >= 4500) return 'warning';
    return 'good';
  };

  // Handle oil change
  const handleOilChange = () => {
    if (!newKm || parseInt(newKm) <= 0) {
      alert(t('oilTracker.updateKm'));
      return;
    }

    const change: OilChange = {
      date: new Date().toISOString().split('T')[0],
      km: parseInt(newKm),
      notes: notes
    };

    const updatedData = {
      ...carData,
      currentKm: parseInt(newKm),
      lastChangeDate: change.date,
      lastChangeKm: change.km,
      changes: [change, ...carData.changes]
    };

    saveData(updatedData);
    setNewKm('');
    setNotes('');
    alert('✅ ' + t('oilTracker.oilChanged'));
  };

  // Handle update km
  const handleUpdateKm = () => {
    if (!newKm || parseInt(newKm) <= 0) return;
    
    const updatedData = {
      ...carData,
      currentKm: parseInt(newKm)
    };
    
    saveData(updatedData);
    setNewKm('');
  };

  // Handle save info
  const handleSaveInfo = (field: keyof CarData, value: any) => {
    const updatedData = {
      ...carData,
      [field]: value
    };
    saveData(updatedData);
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  const status = getStatus();
  const statusColors = {
    good: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
    warning: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100',
    overdue: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
  };

  const statusText = {
    good: t('oilTracker.good'),
    warning: t('oilTracker.warning'),
    overdue: t('oilTracker.overdue')
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
          >
            ← {t('common.back')}
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            🛢️ {t('oilTracker.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {t('oilTracker.recommended')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100'
                : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('oilTracker.dashboard')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100'
                : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('oilTracker.history')} ({carData.changes.length})
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className={`p-6 rounded-lg ${statusColors[status]}`}>
              <h2 className="text-xl font-bold mb-4">{t('oilTracker.status')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm opacity-70">{t('oilTracker.daysSinceChange')}</p>
                  <p className="text-2xl font-bold">{daysSinceChange()} {t('oilTracker.days')}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">{t('oilTracker.kmSinceChange')}</p>
                  <p className="text-2xl font-bold">{kmSinceChange()} {t('oilTracker.km')}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">{t('oilTracker.totalChanges')}</p>
                  <p className="text-2xl font-bold">{carData.changes.length} {t('oilTracker.times')}</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">{statusText[status]}</p>
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {t('oilTracker.carInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('oilTracker.carModel')}
                  </label>
                  <Input
                    value={carData.model}
                    onChange={(e) => handleSaveInfo('model', e.target.value)}
                    placeholder="Toyota Corolla 2020"
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('oilTracker.purchaseDate')}
                  </label>
                  <Input
                    type="date"
                    value={carData.purchaseDate}
                    onChange={(e) => handleSaveInfo('purchaseDate', e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('oilTracker.currentKm')}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={newKm}
                      onChange={(e) => setNewKm(e.target.value)}
                      placeholder={carData.currentKm.toString()}
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                    <Button onClick={handleUpdateKm} variant="outline">
                      {t('oilTracker.updateKm')}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {t('oilTracker.currentKm')}: {carData.currentKm} {t('oilTracker.km')}
                  </p>
                </div>
              </div>
            </div>

            {/* Oil Change Action */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {t('oilTracker.oilChanged')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('oilTracker.currentKm')}
                  </label>
                  <Input
                    type="number"
                    value={newKm}
                    onChange={(e) => setNewKm(e.target.value)}
                    placeholder={carData.currentKm.toString()}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('oilTracker.notes')}
                  </label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('oilTracker.addNotes')}
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <Button
                  onClick={handleOilChange}
                  className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  ✅ {t('oilTracker.oilChanged')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {carData.changes.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-500">
                {t('oilTracker.noHistory')}
              </div>
            ) : (
              carData.changes.map((change, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {t('oilTracker.changeNumber')} {carData.changes.length - index}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(change.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {change.km} {t('oilTracker.km')}
                  </p>
                  {change.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      📝 {change.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
