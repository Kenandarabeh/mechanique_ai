import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Check if notifications are available
export const isNotificationAvailable = () => {
  return Capacitor.isNativePlatform();
};

// Request notification permissions
export const requestNotificationPermissions = async () => {
  if (!isNotificationAvailable()) {
    console.log('Notifications not available on web');
    return false;
  }

  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Check notification permissions
export const checkNotificationPermissions = async () => {
  if (!isNotificationAvailable()) return false;

  try {
    const result = await LocalNotifications.checkPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

// Schedule oil change reminder notifications
export const scheduleOilChangeReminders = async (
  lastChangeDate: string,
  currentKm: number,
  lastChangeKm: number
) => {
  if (!isNotificationAvailable()) {
    console.log('Notifications not available');
    return;
  }

  try {
    // Cancel existing notifications first
    await LocalNotifications.cancel({ notifications: [
      { id: 1 }, // Overdue notification
      { id: 2 }, // Warning notification
      { id: 3 }, // KM reminder
    ]});

    const lastChange = new Date(lastChangeDate);
    const today = new Date();
    const daysSinceChange = Math.floor((today.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
    const kmSinceChange = currentKm - lastChangeKm;

    const notifications: ScheduleOptions = { notifications: [] };

    // 1. Immediate notification if overdue
    if (daysSinceChange >= 180 || kmSinceChange >= 5000) {
      notifications.notifications.push({
        id: 1,
        title: '⚠️ تنبيه: تغيير الزيت متأخر!',
        body: `مر ${daysSinceChange} يوماً و ${kmSinceChange} كم منذ آخر تغيير. يجب تغيير الزيت فوراً!`,
        schedule: { at: new Date(Date.now() + 5000) }, // After 5 seconds
        actionTypeId: 'OIL_OVERDUE',
        extra: { type: 'overdue' }
      });
    }
    // 2. Warning notification if close to due date
    else if (daysSinceChange >= 150 || kmSinceChange >= 4500) {
      const daysRemaining = 180 - daysSinceChange;
      const kmRemaining = 5000 - kmSinceChange;
      
      notifications.notifications.push({
        id: 2,
        title: '🔔 تذكير: اقترب موعد تغيير الزيت',
        body: `باقي ${daysRemaining} يوم أو ${kmRemaining} كم. جهز سيارتك للصيانة قريباً!`,
        schedule: { at: new Date(Date.now() + 5000) },
        actionTypeId: 'OIL_WARNING',
        extra: { type: 'warning' }
      });
    }

    // 3. Schedule notification for 150 days (30 days before due)
    if (daysSinceChange < 150) {
      const warningDate = new Date(lastChange);
      warningDate.setDate(warningDate.getDate() + 150);
      
      if (warningDate > today) {
        notifications.notifications.push({
          id: 2,
          title: '🔔 تذكير: اقترب موعد تغيير الزيت',
          body: 'باقي 30 يوماً على موعد تغيير الزيت الموصى به. جهز سيارتك!',
          schedule: { at: warningDate },
          actionTypeId: 'OIL_WARNING',
          extra: { type: 'warning' }
        });
      }
    }

    // 4. Schedule notification for 180 days (due date)
    if (daysSinceChange < 180) {
      const dueDate = new Date(lastChange);
      dueDate.setDate(dueDate.getDate() + 180);
      
      if (dueDate > today) {
        notifications.notifications.push({
          id: 1,
          title: '⚠️ حان موعد تغيير الزيت!',
          body: 'مرت 6 أشهر منذ آخر تغيير. يجب تغيير الزيت الآن!',
          schedule: { at: dueDate },
          actionTypeId: 'OIL_OVERDUE',
          extra: { type: 'overdue' }
        });
      }
    }

    // 5. KM-based reminder (if close to 5000 km)
    if (kmSinceChange >= 4500 && kmSinceChange < 5000) {
      notifications.notifications.push({
        id: 3,
        title: '📊 تنبيه الكيلومترات',
        body: `قطعت ${kmSinceChange} كم منذ آخر تغيير. باقي ${5000 - kmSinceChange} كم فقط!`,
        schedule: { at: new Date(Date.now() + 10000) }, // After 10 seconds
        actionTypeId: 'OIL_KM_WARNING',
        extra: { type: 'km_warning' }
      });
    }

    // Schedule all notifications
    if (notifications.notifications.length > 0) {
      await LocalNotifications.schedule(notifications);
      console.log(`✅ Scheduled ${notifications.notifications.length} notifications`);
    }

  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

// Cancel all oil change notifications
export const cancelOilChangeNotifications = async () => {
  if (!isNotificationAvailable()) return;

  try {
    await LocalNotifications.cancel({ 
      notifications: [{ id: 1 }, { id: 2 }, { id: 3 }] 
    });
    console.log('✅ Cancelled all notifications');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

// Send immediate test notification
export const sendTestNotification = async () => {
  if (!isNotificationAvailable()) {
    alert('الإشعارات غير متوفرة في المتصفح. استخدم التطبيق!');
    return;
  }

  try {
    const hasPermission = await checkNotificationPermissions();
    if (!hasPermission) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        alert('يجب السماح بالإشعارات أولاً!');
        return;
      }
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 999,
          title: '🔧 MechaMind',
          body: 'الإشعارات تعمل بنجاح! ✅',
          schedule: { at: new Date(Date.now() + 2000) },
        }
      ]
    });

    console.log('✅ Test notification sent');
  } catch (error) {
    console.error('Error sending test notification:', error);
    alert('حدث خطأ في إرسال الإشعار: ' + error);
  }
};
