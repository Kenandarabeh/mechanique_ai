"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import { toast, Toaster } from 'react-hot-toast';
import {
  requestNotificationPermissions,
  checkNotificationPermissions,
  isNotificationAvailable
} from '@/lib/notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

// Database model interface
interface OilChangeRecord {
  id: string;
  userId: string;
  carModel?: string;
  purchaseDate?: string;
  changeDate: string;
  kilometersDone: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OilTrackerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t, locale } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add'>('dashboard');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Database records
  const [oilChanges, setOilChanges] = useState<OilChangeRecord[]>([]);
  
  // Car info (set once)
  const [carInfo, setCarInfo] = useState({
    model: '',
    purchaseDate: ''
  });
  
  // Form data for new oil change
  const [formData, setFormData] = useState({
    changeDate: new Date().toISOString().split('T')[0],
    kilometersDone: '',
    notes: ''
  });

  // Load data from database
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }
    
    if (user) {
      loadOilChanges();
      checkAndSetupNotifications();
    }
  }, [user, authLoading, router]);

  // Load oil changes from database
  const loadOilChanges = async () => {
    try {
      console.log('🔄 Loading oil changes from database...');
      const response = await fetch('/api/oil-change');
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Oil changes loaded:', data.length);
        setOilChanges(data);
        
        // Load car info from first record (if exists)
        if (data.length > 0 && data[0].carModel) {
          setCarInfo({
            model: data[0].carModel || '',
            purchaseDate: data[0].purchaseDate || ''
          });
        }
        
        // Setup notifications based on latest record
        if (data.length > 0) {
          scheduleNotificationsFromRecords(data);
        }
      } else {
        console.error('❌ Failed to load oil changes');
        toast.error('فشل تحميل السجلات');
      }
    } catch (error) {
      console.error('❌ Error loading oil changes:', error);
      toast.error('حدث خطأ في التحميل');
    } finally {
      setLoading(false);
    }
  };

  // Schedule notifications based on database records (TIME-BASED SYSTEM)
  const scheduleNotificationsFromRecords = async (records: OilChangeRecord[]) => {
    if (!isNotificationAvailable()) {
      console.log('📱 Notifications not available on this platform');
      return;
    }

    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      console.log('⚠️ No notification permission');
      return;
    }

    // Get the latest oil change
    const latest = records[0];
    if (!latest) return;

    const changeDate = new Date(latest.changeDate);
    const today = new Date();
    const daysSinceChange = Math.floor((today.getTime() - changeDate.getTime()) / (1000 * 60 * 60 * 24));

    // Oil change recommended every 6 months (180 days)
    const OIL_CHANGE_INTERVAL_DAYS = 180;
    const WARNING_DAYS = 150; // Warn 30 days before

    console.log(`📅 Days since last change: ${daysSinceChange}`);

    // Calculate next oil change date (6 months after last change)
    const nextChangeDate = new Date(changeDate);
    nextChangeDate.setMonth(nextChangeDate.getMonth() + 6);

    try {
      // Cancel all previous notifications
      await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }] });

      if (daysSinceChange >= OIL_CHANGE_INTERVAL_DAYS) {
        // Overdue - send immediate notification
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 1,
              title: '🚨 تغيير الزيت متأخر!',
              body: 'لقد تجاوزت 6 أشهر منذ آخر تغيير. قم بتغيير الزيت الآن!',
              schedule: { at: new Date(Date.now() + 1000) } // Now
            }
          ]
        });
        console.log('🔔 Sent overdue notification');
      } else if (daysSinceChange >= WARNING_DAYS) {
        // Warning - approaching due date
        const daysLeft = OIL_CHANGE_INTERVAL_DAYS - daysSinceChange;
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 2,
              title: '⚠️ تذكير: تغيير الزيت قريباً',
              body: `يجب تغيير الزيت خلال ${daysLeft} يوم`,
              schedule: { at: new Date(Date.now() + 1000) }
            }
          ]
        });
        console.log(`🔔 Sent warning notification (${daysLeft} days left)`);
      }

      // Schedule notification for exactly 6 months mark
      if (nextChangeDate > today) {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 3,
              title: '⏰ حان وقت تغيير الزيت!',
              body: 'مرت 6 أشهر منذ آخر تغيير زيت. قم بتغيير الزيت الآن للحفاظ على محرك سيارتك.',
              schedule: { at: nextChangeDate }
            }
          ]
        });
        console.log(`📅 Scheduled notification for: ${nextChangeDate.toLocaleDateString('ar-DZ')}`);
      }
    } catch (error) {
      console.error('❌ Error scheduling notifications:', error);
    }
  };

  // Check notification permissions and setup
  const checkAndSetupNotifications = async () => {
    if (!isNotificationAvailable()) {
      console.log('📱 Notifications not available');
      return;
    }

    const hasPermission = await checkNotificationPermissions();
    setNotificationsEnabled(hasPermission);
  };

  // Request notification permissions
  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermissions();
    setNotificationsEnabled(granted);
    
    if (granted) {
      toast.success('✅ تم تفعيل الإشعارات بنجاح!');
      // Reload to schedule notifications
      if (oilChanges.length > 0) {
        scheduleNotificationsFromRecords(oilChanges);
      }
    } else {
      toast.error('❌ لم يتم السماح بالإشعارات');
    }
  };

  // Test notification
  const handleTestNotification = async () => {
    if (!isNotificationAvailable()) {
      toast.error('⚠️ الإشعارات متاحة فقط على الهاتف');
      return;
    }

    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      toast.error('⚠️ يجب تفعيل الإشعارات أولاً');
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999,
            title: '🧪 اختبار الإشعارات',
            body: 'نظام الإشعارات يعمل بشكل صحيح! ✅',
            schedule: { at: new Date(Date.now() + 2000) } // After 2 seconds
          }
        ]
      });
      toast.success('✅ تم إرسال إشعار تجريبي');
    } catch (error) {
      console.error('❌ Error testing notification:', error);
      toast.error('❌ فشل إرسال الإشعار');
    }
  };

  // Reset all data (when selling car)
  const handleResetAll = async () => {
    const confirmMessage = '⚠️ هل أنت متأكد من إعادة تهيئة كل البيانات؟\n\nسيتم حذف:\n• جميع سجلات تغيير الزيت\n• معلومات السيارة\n• جميع الإشعارات\n\nهذا الإجراء لا يمكن التراجع عنه!\n\nاستخدم هذا عند بيع السيارة والبدء مع سيارة جديدة.';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    // Second confirmation
    if (!confirm('تأكيد نهائي: هل تريد حذف كل البيانات؟')) {
      return;
    }

    try {
      console.log('🔄 Resetting all data...');
      
      // Delete all oil change records
      const deletePromises = oilChanges.map(record => 
        fetch(`/api/oil-change?id=${record.id}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      
      // Cancel all notifications
      if (isNotificationAvailable()) {
        await LocalNotifications.cancel({ 
          notifications: [
            { id: 1 }, { id: 2 }, { id: 3 }, { id: 999 }
          ] 
        });
      }
      
      // Clear local state
      setOilChanges([]);
      setCarInfo({ model: '', purchaseDate: '' });
      setFormData({
        changeDate: new Date().toISOString().split('T')[0],
        kilometersDone: '',
        notes: ''
      });
      
      toast.success('✅ تم إعادة تهيئة كل البيانات بنجاح!');
      console.log('✅ All data reset successfully');
      
    } catch (error) {
      console.error('❌ Error resetting data:', error);
      toast.error('❌ فشلت إعادة التهيئة');
    }
  };

  // Calculate days since last change
  const daysSinceChange = () => {
    if (oilChanges.length === 0) return 0;
    const lastChange = new Date(oilChanges[0].changeDate);
    const today = new Date();
    const diff = today.getTime() - lastChange.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // Get status based on TIME (6 months = 180 days)
  const getStatus = () => {
    const days = daysSinceChange();
    
    if (days >= 180) return 'overdue'; // Over 6 months
    if (days >= 150) return 'warning'; // 5 months (warning)
    return 'good'; // Less than 5 months
  };

  // Get next oil change date (6 months after last change)
  const getNextOilChangeDate = () => {
    if (oilChanges.length === 0) return null;
    const lastChange = new Date(oilChanges[0].changeDate);
    const nextChange = new Date(lastChange);
    nextChange.setMonth(nextChange.getMonth() + 6); // Add 6 months
    return nextChange;
  };

  // Get status color
  const getStatusColor = () => {
    const status = getStatus();
    if (status === 'overdue') return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-100';
    if (status === 'warning') return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100';
    return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100';
  };

  // Get status text
  const getStatusText = () => {
    const status = getStatus();
    if (status === 'overdue') return '🚨 متأخر - قم بتغيير الزيت الآن!';
    if (status === 'warning') return '⚠️ تحذير - اقترب موعد التغيير';
    return '✅ جيد';
  };

  // Save car info (first time only)
  const handleSaveCarInfo = async () => {
    if (!carInfo.model || !carInfo.purchaseDate) {
      toast.error('⚠️ يرجى ملء نموذج السيارة وتاريخ الشراء');
      return;
    }

    // Car info will be saved with first oil change
    toast.success('✅ تم حفظ معلومات السيارة!');
  };

  // Handle adding new oil change record
  const handleAddOilChange = async () => {
    // Check car info for first record
    if (oilChanges.length === 0 && (!carInfo.model || !carInfo.purchaseDate)) {
      toast.error('⚠️ يرجى إدخال معلومات السيارة أولاً');
      return;
    }

    if (!formData.changeDate || !formData.kilometersDone) {
      toast.error('⚠️ يرجى ملء التاريخ والكيلومترات');
      return;
    }

    const km = parseInt(formData.kilometersDone);
    if (isNaN(km) || km <= 0) {
      toast.error('⚠️ يرجى إدخال كيلومترات صحيحة');
      return;
    }

    try {
      console.log('📝 Creating new oil change record...');
      const response = await fetch('/api/oil-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carModel: carInfo.model || null,
          purchaseDate: carInfo.purchaseDate || null,
          changeDate: formData.changeDate,
          kilometersDone: km,
          notes: formData.notes || null
        })
      });

      if (response.ok) {
        const newRecord = await response.json();
        console.log('✅ Oil change record created:', newRecord);
        toast.success('✅ تم إضافة السجل بنجاح!');
        
        // Reset form (keep car info)
        setFormData({
          changeDate: new Date().toISOString().split('T')[0],
          kilometersDone: '',
          notes: ''
        });
        
        // Reload records
        await loadOilChanges();
        
        // Switch to dashboard
        setActiveTab('dashboard');
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to create record:', errorData);
        toast.error(`❌ فشل الإضافة: ${errorData.error || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('❌ Error creating record:', error);
      toast.error('❌ حدث خطأ أثناء الإضافة');
    }
  };

  // Handle delete oil change record
  const handleDeleteOilChange = async (id: string) => {
    const confirmMessage = 'هل تريد حذف هذا السجل؟\n\n⚠️ لا يمكن التراجع عن هذا الإجراء!';
    
    if (!confirm(confirmMessage)) return;

    try {
      console.log('🗑️ Deleting oil change record:', id);
      const response = await fetch(`/api/oil-change?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Record deleted');
        toast.success('✅ تم حذف السجل بنجاح!');
        
        // Reload records
        await loadOilChanges();
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to delete:', errorData);
        toast.error(`❌ فشل الحذف: ${errorData.error || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('❌ Error deleting:', error);
      toast.error('❌ حدث خطأ أثناء الحذف');
    }
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  const nextChange = getNextOilChangeDate();
  const status = getStatus();
  const days = daysSinceChange();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                🛢️ {t('oilTracker.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('oilTracker.subtitle')}
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ← {t('oilTracker.back')}
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {isNotificationAvailable() && (
              <>
                {!notificationsEnabled ? (
                  <button
                    onClick={handleEnableNotifications}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    🔔 {t('oilTracker.enableNotifications')}
                  </button>
                ) : (
                  <button
                    onClick={handleTestNotification}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    🧪 {t('oilTracker.testNotification')}
                  </button>
                )}
              </>
            )}
            
            {oilChanges.length > 0 && (
              <button
                onClick={handleResetAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                🔄 {t('oilTracker.resetAll')}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              📊 {t('oilTracker.dashboard')}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              📜 {t('oilTracker.history')}
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === 'add'
                  ? 'text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              ➕ {t('oilTracker.addNew')}
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Status Card */}
            {oilChanges.length > 0 ? (
              <>
                <div className={`rounded-lg p-6 ${getStatusColor()}`}>
                  <h2 className="text-2xl font-bold mb-2">
                    {getStatusText()}
                  </h2>
                  <p className="text-lg">
                    {t('oilTracker.daysSinceChange').replace('{days}', days.toString())}
                  </p>
                  {nextChange && (
                    <p className="text-sm mt-2">
                      {t('oilTracker.nextChangeIn')}: <strong>{nextChange.toLocaleDateString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-FR' : 'en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</strong>
                    </p>
                  )}
                </div>

                {/* Latest Oil Change Info */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    📝 {t('oilTracker.lastOilChange')}
                  </h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p>
                      <strong>{t('oilTracker.lastChangeDate')}:</strong> {new Date(oilChanges[0].changeDate).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-FR' : 'en-US')}
                    </p>
                    <p>
                      <strong>{t('oilTracker.lastChangeKm')}:</strong> {oilChanges[0].kilometersDone.toLocaleString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-FR' : 'en-US')} {t('oilTracker.km')}
                    </p>
                    {oilChanges[0].carModel && (
                      <p>
                        <strong>{t('oilTracker.carModel')}:</strong> {oilChanges[0].carModel}
                      </p>
                    )}
                    {oilChanges[0].notes && (
                      <p>
                        <strong>{t('oilTracker.notes')}:</strong> {oilChanges[0].notes}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                  {t('oilTracker.noRecordsYet')}
                </p>
                <Button
                  onClick={() => setActiveTab('add')}
                  className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                >
                  ➕ {t('oilTracker.addFirstRecord')}
                </Button>
              </div>
            )}

            {/* Notifications Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                🔔 {t('oilTracker.notifications')}
              </h3>
              
              {!isNotificationAvailable() ? (
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    📱 <strong>{t('oilTracker.notificationsOnlyOnApp')}</strong>
                    <br />
                    {t('oilTracker.downloadAppForNotifications')}
                  </p>
                </div>
              ) : notificationsEnabled ? (
                <div className="text-green-600 dark:text-green-400">
                  ✅ {t('oilTracker.notificationsEnabled')}
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('oilTracker.enableNotificationsDesc')}
                  </p>
                  <Button
                    onClick={handleEnableNotifications}
                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  >
                    🔔 {t('oilTracker.enableNotifications')}
                  </Button>
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                💡 {t('oilTracker.importantInfo')}
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                {t('oilTracker.systemBasedOnTime')}<br />
                {t('oilTracker.changeEvery6Months')}<br />
                {t('oilTracker.alertStarts30Days')}<br />
                {t('oilTracker.dataSyncedToServer')}
              </p>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              📜 {t('oilTracker.changeHistory')}
            </h2>
            
            {oilChanges.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {t('oilTracker.noHistory')}
              </div>
            ) : (
              <div className="space-y-4">
                {oilChanges.map((change) => (
                  <div
                    key={change.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100">
                          {new Date(change.changeDate).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-FR' : 'en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {change.kilometersDone.toLocaleString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-FR' : 'en-US')} {t('oilTracker.km')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteOilChange(change.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        🗑️ {t('oilTracker.delete')}
                      </button>
                    </div>
                    {change.carModel && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        🚗 {change.carModel}
                      </p>
                    )}
                    {change.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        📝 {change.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Tab */}
        {activeTab === 'add' && (
          <div className="space-y-6">
            {/* Car Info Section (First Time Only) */}
            {oilChanges.length === 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                  🚗 {t('oilTracker.carInfoOnceOnly')}
                </h2>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  {t('oilTracker.carInfoUsedForAll')}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      {t('oilTracker.carModel')} <span className="text-red-500">{t('oilTracker.required')}</span>
                    </label>
                    <Input
                      type="text"
                      value={carInfo.model}
                      onChange={(e) => setCarInfo({ ...carInfo, model: e.target.value })}
                      placeholder={locale === 'ar' ? 'مثال: Renault Clio 2020' : locale === 'fr' ? 'Ex: Renault Clio 2020' : 'e.g: Renault Clio 2020'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      {t('oilTracker.purchaseDate')} <span className="text-red-500">{t('oilTracker.required')}</span>
                    </label>
                    <Input
                      type="date"
                      value={carInfo.purchaseDate}
                      onChange={(e) => setCarInfo({ ...carInfo, purchaseDate: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Display Saved Car Info */}
            {oilChanges.length > 0 && carInfo.model && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                  🚗 {t('oilTracker.savedCarInfo')}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>{t('oilTracker.model')}:</strong> {carInfo.model}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>{t('oilTracker.purchaseDate')}:</strong> {new Date(carInfo.purchaseDate).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-FR' : 'en-US')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  💡 {t('oilTracker.toChangeCarInfo')}
                </p>
              </div>
            )}

            {/* Oil Change Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                ➕ {t('oilTracker.addNewRecord')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('oilTracker.oilChangeDate')} <span className="text-red-500">{t('oilTracker.required')}</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.changeDate}
                    onChange={(e) => setFormData({ ...formData, changeDate: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('oilTracker.kmAtChange')} <span className="text-red-500">{t('oilTracker.required')}</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.kilometersDone}
                    onChange={(e) => setFormData({ ...formData, kilometersDone: e.target.value })}
                    placeholder={locale === 'ar' ? 'مثال: 45000' : locale === 'fr' ? 'Ex: 45000' : 'e.g: 45000'}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('oilTracker.addNotesOptional')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder={t('oilTracker.addNotes')}
                  />
                </div>

                <Button
                  onClick={handleAddOilChange}
                  className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-3 text-lg"
                >
                  ✅ {t('oilTracker.saveRecord')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
