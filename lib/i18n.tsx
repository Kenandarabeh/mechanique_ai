"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'ar' | 'en' | 'fr';

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const translations = {
  ar: {
    // Sidebar
    "sidebar.newChat": "محادثة جديدة",
    "sidebar.history": "المحادثات السابقة",
    "sidebar.savedChats": "المحادثات المحفوظة",
    "sidebar.noChats": "لا توجد محادثات محفوظة",
    "sidebar.startChat": "ابدأ محادثة جديدة لحفظها",
    "sidebar.archiveThread": "أرشفة المحادثة",
    "sidebar.deleteThread": "حذف المحادثة",
    "sidebar.renameThread": "إعادة تسمية المحادثة",
    "sidebar.loadingThreads": "جاري التحميل...",
    
    // Header
    "header.title": "MechaMind",
    "header.subtitle": "مساعدك الذكي للميكانيك",
    "header.signOut": "تسجيل الخروج",
    "header.manageAccount": "إدارة الحساب",
    "header.language": "اللغة",
    
    // Composer
    "composer.placeholder": "اكتب رسالتك هنا...",
    "composer.send": "إرسال",
    "composer.cancel": "إلغاء",
    "composer.messageInput": "إدخال الرسالة",
    
    // Messages
    "message.copy": "نسخ",
    "message.copied": "تم النسخ",
    "message.edit": "تعديل",
    "message.refresh": "تحديث",
    "message.previous": "السابق",
    "message.next": "التالي",
    "message.update": "تحديث",
    "message.scrollToBottom": "التمرير للأسفل",
    "message.stopGenerating": "إيقاف التوليد",
    
    // Welcome
    "welcome.title": "مرحباً بك في MechaMind! 🔧",
    "welcome.subtitle": "اسألني أي شيء عن صيانة سيارتك",
    "welcome.suggestion1.title": "🔍 تشخيص المشكلة",
    "welcome.suggestion1.label": "سيارتي لا تشتغل، ما السبب؟",
    "welcome.suggestion1.action": "سيارتي لا تشتغل عند تشغيل المحرك، ما هي الأسباب المحتملة وكيف أشخص المشكلة؟",
    "welcome.suggestion2.title": "⚙️ صيانة دورية",
    "welcome.suggestion2.label": "متى أغير زيت المحرك؟",
    "welcome.suggestion2.action": "متى يجب أن أقوم بتغيير زيت المحرك والفلاتر في سيارتي؟",
    "welcome.suggestion3.title": "🛠️ إصلاح الفرامل",
    "welcome.suggestion3.label": "صوت صرير عند الفرملة",
    "welcome.suggestion3.action": "أسمع صوت صرير عند الضغط على الفرامل، ما المشكلة وكيف أصلحها؟",
    "welcome.suggestion4.title": "🔧 مشاكل المحرك",
    "welcome.suggestion4.label": "المحرك يسخن بسرعة",
    "welcome.suggestion4.action": "المحرك يسخن بسرعة، ما هي الأسباب المحتملة والحلول؟",
    
    // Languages
    "language.ar": "العربية",
    "language.en": "English",
    "language.fr": "Français",
    
    // Loading & Errors
    "loading.chat": "جارٍ تحميل المحادثة...",
    "error.general": "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.",
    
    // Profile
    "profile.title": "الملف الشخصي",
    "profile.email": "البريد الإلكتروني",
    "profile.name": "الاسم",
    "profile.changePassword": "تغيير كلمة المرور",
    "profile.currentPassword": "كلمة المرور الحالية",
    "profile.newPassword": "كلمة المرور الجديدة",
    "profile.confirmPassword": "تأكيد كلمة المرور",
    "profile.save": "حفظ التغييرات",
    "profile.updateSuccess": "تم تحديث الملف الشخصي بنجاح",
    "profile.updateFailed": "فشل تحديث الملف الشخصي",
    "profile.currentPasswordRequired": "كلمة المرور الحالية مطلوبة لتغيير كلمة المرور",
    "profile.passwordMismatch": "كلمات المرور غير متطابقة",
    "profile.passwordTooShort": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    
    // Oil Tracker
    "oilTracker.title": "متتبع تغيير الزيت",
    "oilTracker.subtitle": "نظام ذكي لتتبع تغيير زيت المحرك بناءً على الوقت (كل 6 أشهر)",
    "oilTracker.back": "العودة",
    "oilTracker.dashboard": "لوحة التحكم",
    "oilTracker.history": "السجل",
    "oilTracker.addNew": "إضافة جديد",
    "oilTracker.carInfo": "معلومات السيارة",
    "oilTracker.carModel": "موديل السيارة",
    "oilTracker.purchaseDate": "تاريخ شراء السيارة",
    "oilTracker.currentKm": "الكيلومترات الحالية",
    "oilTracker.lastOilChange": "آخر تغيير زيت",
    "oilTracker.lastChangeDate": "التاريخ",
    "oilTracker.lastChangeKm": "الكيلومترات",
    "oilTracker.kmAtChange": "الكيلومترات عند التغيير",
    "oilTracker.saveInfo": "حفظ المعلومات",
    "oilTracker.saveRecord": "حفظ السجل",
    "oilTracker.updateKm": "تحديث الكيلومترات",
    "oilTracker.oilChanged": "تم تغيير الزيت",
    "oilTracker.oilChangeDate": "تاريخ تغيير الزيت",
    "oilTracker.status": "الحالة",
    "oilTracker.daysSinceChange": "مرت {days} يوم منذ آخر تغيير زيت",
    "oilTracker.kmSinceChange": "كم منذ التغيير",
    "oilTracker.nextChangeIn": "التغيير القادم",
    "oilTracker.days": "يوم",
    "oilTracker.km": "كم",
    "oilTracker.totalChanges": "عدد التغييرات",
    "oilTracker.times": "مرة",
    "oilTracker.changeHistory": "سجل تغييرات الزيت",
    "oilTracker.noHistory": "لا توجد سجلات",
    "oilTracker.noRecordsYet": "لا توجد سجلات حتى الآن",
    "oilTracker.changeNumber": "التغيير رقم",
    "oilTracker.notes": "ملاحظات",
    "oilTracker.addNotes": "أي ملاحظات إضافية...",
    "oilTracker.addNotesOptional": "ملاحظات (اختياري)",
    "oilTracker.good": "ممتاز",
    "oilTracker.warning": "قريب من الموعد",
    "oilTracker.overdue": "متأخر!",
    "oilTracker.recommended": "الموصى به: كل 6 أشهر أو 5000 كم",
    "oilTracker.notificationsEnabled": "الإشعارات مفعّلة - سنذكرك عندما يحين موعد تغيير الزيت",
    "oilTracker.enableNotifications": "تفعيل الإشعارات",
    "oilTracker.testNotification": "اختبار الإشعارات",
    "oilTracker.resetAll": "إعادة تهيئة (بيع السيارة)",
    "oilTracker.notifications": "الإشعارات",
    "oilTracker.notificationsOnlyOnApp": "الإشعارات متوفرة فقط على التطبيق!",
    "oilTracker.downloadAppForNotifications": "قم بتحميل التطبيق على هاتفك للحصول على تنبيهات تلقائية عند اقتراب موعد تغيير الزيت.",
    "oilTracker.enableNotificationsDesc": "قم بتفعيل الإشعارات لتلقي تنبيهات تلقائية عند اقتراب موعد تغيير الزيت",
    "oilTracker.importantInfo": "معلومة مهمة",
    "oilTracker.systemBasedOnTime": "• النظام يعتمد على الوقت وليس الكيلومترات",
    "oilTracker.changeEvery6Months": "• يُنصح بتغيير الزيت كل 6 أشهر (180 يوم)",
    "oilTracker.alertStarts30Days": "• التنبيه يبدأ قبل 30 يوم من الموعد",
    "oilTracker.dataSyncedToServer": "• جميع البيانات محفوظة في السيرفر ومتزامنة",
    "oilTracker.carInfoOnceOnly": "معلومات السيارة (تُكتب مرة واحدة فقط)",
    "oilTracker.carInfoUsedForAll": "سيتم استخدام هذه المعلومات لجميع السجلات المستقبلية",
    "oilTracker.savedCarInfo": "معلومات السيارة المحفوظة",
    "oilTracker.model": "الموديل",
    "oilTracker.toChangeCarInfo": "لتغيير معلومات السيارة، استخدم زر \"إعادة تهيئة\" عند بيع السيارة",
    "oilTracker.addNewRecord": "إضافة سجل تغيير زيت جديد",
    "oilTracker.addFirstRecord": "إضافة أول سجل",
    "oilTracker.delete": "حذف",
    "oilTracker.required": "*",
    
    // Auth
    "auth.logout": "تسجيل الخروج",
    "auth.signIn": "تسجيل الدخول",
    "auth.signUp": "إنشاء حساب",
    
    // Common
    "common.loading": "جاري التحميل...",
    "common.back": "رجوع",
  },
  en: {
    // Sidebar
    "sidebar.newChat": "New Chat",
    "sidebar.history": "Chat History",
    "sidebar.savedChats": "Saved Chats",
    "sidebar.noChats": "No saved chats",
    "sidebar.startChat": "Start a new conversation to save it",
    "sidebar.archiveThread": "Archive chat",
    "sidebar.deleteThread": "Delete chat",
    "sidebar.renameThread": "Rename chat",
    "sidebar.loadingThreads": "Loading...",
    
    // Header
    "header.title": "MechaMind",
    "header.subtitle": "Your Smart Mechanic Assistant",
    "header.signOut": "Sign Out",
    "header.manageAccount": "Manage Account",
    "header.language": "Language",
    
    // Composer
    "composer.placeholder": "Type your message here...",
    "composer.send": "Send",
    "composer.cancel": "Cancel",
    "composer.messageInput": "Message input",
    
    // Messages
    "message.copy": "Copy",
    "message.copied": "Copied",
    "message.edit": "Edit",
    "message.refresh": "Refresh",
    "message.previous": "Previous",
    "message.next": "Next",
    "message.update": "Update",
    "message.scrollToBottom": "Scroll to bottom",
    "message.stopGenerating": "Stop generating",
    
    // Welcome
    "welcome.title": "Welcome to MechaMind! 🔧",
    "welcome.subtitle": "Ask me anything about your car maintenance",
    "welcome.suggestion1.title": "🔍 Diagnose Problem",
    "welcome.suggestion1.label": "My car won't start, what's wrong?",
    "welcome.suggestion1.action": "My car won't start when I turn the ignition, what are the possible causes and how can I diagnose the problem?",
    "welcome.suggestion2.title": "⚙️ Regular Maintenance",
    "welcome.suggestion2.label": "When should I change oil?",
    "welcome.suggestion2.action": "When should I change the engine oil and filters in my car?",
    "welcome.suggestion3.title": "🛠️ Brake Repair",
    "welcome.suggestion3.label": "Squeaking sound when braking",
    "welcome.suggestion3.action": "I hear a squeaking sound when pressing the brakes, what's the problem and how do I fix it?",
    "welcome.suggestion4.title": "🔧 Engine Problems",
    "welcome.suggestion4.label": "Engine overheating quickly",
    "welcome.suggestion4.action": "The engine overheats quickly, what are the possible causes and solutions?",
    
    // Languages
    "language.ar": "العربية",
    "language.en": "English",
    "language.fr": "Français",
    
    // Loading & Errors
    "loading.chat": "Loading chat...",
    "error.general": "Sorry, an error occurred processing your request. Please try again.",
    
    // Profile
    "profile.title": "Profile",
    "profile.email": "Email",
    "profile.name": "Name",
    "profile.changePassword": "Change Password",
    "profile.currentPassword": "Current Password",
    "profile.newPassword": "New Password",
    "profile.confirmPassword": "Confirm Password",
    "profile.save": "Save Changes",
    "profile.updateSuccess": "Profile updated successfully",
    "profile.updateFailed": "Failed to update profile",
    "profile.currentPasswordRequired": "Current password is required to change password",
    "profile.passwordMismatch": "Passwords do not match",
    "profile.passwordTooShort": "Password must be at least 6 characters",
    
    // Oil Tracker
    "oilTracker.title": "Oil Change Tracker",
    "oilTracker.subtitle": "Smart system to track engine oil changes based on time (every 6 months)",
    "oilTracker.back": "Back",
    "oilTracker.dashboard": "Dashboard",
    "oilTracker.history": "History",
    "oilTracker.addNew": "Add New",
    "oilTracker.carInfo": "Car Information",
    "oilTracker.carModel": "Car Model",
    "oilTracker.purchaseDate": "Car Purchase Date",
    "oilTracker.currentKm": "Current Kilometers",
    "oilTracker.lastOilChange": "Last Oil Change",
    "oilTracker.lastChangeDate": "Date",
    "oilTracker.lastChangeKm": "Kilometers",
    "oilTracker.kmAtChange": "Kilometers at Change",
    "oilTracker.saveInfo": "Save Information",
    "oilTracker.saveRecord": "Save Record",
    "oilTracker.updateKm": "Update Kilometers",
    "oilTracker.oilChanged": "Oil Changed",
    "oilTracker.oilChangeDate": "Oil Change Date",
    "oilTracker.status": "Status",
    "oilTracker.daysSinceChange": "{days} days have passed since last oil change",
    "oilTracker.kmSinceChange": "KM Since Change",
    "oilTracker.nextChangeIn": "Next Change",
    "oilTracker.days": "days",
    "oilTracker.km": "km",
    "oilTracker.totalChanges": "Total Changes",
    "oilTracker.times": "times",
    "oilTracker.changeHistory": "Oil Change History",
    "oilTracker.noHistory": "No records",
    "oilTracker.noRecordsYet": "No records yet",
    "oilTracker.changeNumber": "Change #",
    "oilTracker.notes": "Notes",
    "oilTracker.addNotes": "Any additional notes...",
    "oilTracker.addNotesOptional": "Notes (optional)",
    "oilTracker.good": "Good",
    "oilTracker.warning": "Due Soon",
    "oilTracker.overdue": "Overdue!",
    "oilTracker.recommended": "Recommended: Every 6 months or 5000 km",
    "oilTracker.notificationsEnabled": "Notifications enabled - we'll remind you when it's time to change oil",
    "oilTracker.enableNotifications": "Enable Notifications",
    "oilTracker.testNotification": "Test Notifications",
    "oilTracker.resetAll": "Reset (Selling Car)",
    "oilTracker.notifications": "Notifications",
    "oilTracker.notificationsOnlyOnApp": "Notifications available only on the app!",
    "oilTracker.downloadAppForNotifications": "Download the app on your phone to receive automatic alerts when it's time for an oil change.",
    "oilTracker.enableNotificationsDesc": "Enable notifications to receive automatic alerts when it's time for an oil change",
    "oilTracker.importantInfo": "Important Information",
    "oilTracker.systemBasedOnTime": "• System is based on time, not kilometers",
    "oilTracker.changeEvery6Months": "• Recommended to change oil every 6 months (180 days)",
    "oilTracker.alertStarts30Days": "• Alert starts 30 days before due date",
    "oilTracker.dataSyncedToServer": "• All data is saved on server and synced",
    "oilTracker.carInfoOnceOnly": "Car Information (entered once only)",
    "oilTracker.carInfoUsedForAll": "This information will be used for all future records",
    "oilTracker.savedCarInfo": "Saved Car Information",
    "oilTracker.model": "Model",
    "oilTracker.toChangeCarInfo": "To change car information, use the \"Reset\" button when selling the car",
    "oilTracker.addNewRecord": "Add New Oil Change Record",
    "oilTracker.addFirstRecord": "Add First Record",
    "oilTracker.delete": "Delete",
    "oilTracker.required": "*",
    
    // Auth
    "auth.logout": "Logout",
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    
    // Common
    "common.loading": "Loading...",
    "common.back": "Back",
  },
  fr: {
    // Sidebar
    "sidebar.newChat": "Nouvelle discussion",
    "sidebar.history": "Historique des discussions",
    "sidebar.savedChats": "Discussions enregistrées",
    "sidebar.noChats": "Aucune discussion enregistrée",
    "sidebar.startChat": "Commencez une nouvelle conversation pour l'enregistrer",
    "sidebar.archiveThread": "Archiver la discussion",
    "sidebar.deleteThread": "Supprimer la discussion",
    "sidebar.renameThread": "Renommer la discussion",
    "sidebar.loadingThreads": "Chargement...",
    
    // Header
    "header.title": "MechaMind",
    "header.subtitle": "Votre assistant intelligent pour la mécanique",
    "header.signOut": "Se déconnecter",
    "header.manageAccount": "Gérer le compte",
    "header.language": "Langue",
    
    // Composer
    "composer.placeholder": "Tapez votre message ici...",
    "composer.send": "Envoyer",
    "composer.cancel": "Annuler",
    "composer.messageInput": "Saisie du message",
    
    // Messages
    "message.copy": "Copier",
    "message.copied": "Copié",
    "message.edit": "Modifier",
    "message.refresh": "Actualiser",
    "message.previous": "Précédent",
    "message.next": "Suivant",
    "message.update": "Mettre à jour",
    "message.scrollToBottom": "Faire défiler vers le bas",
    "message.stopGenerating": "Arrêter la génération",
    
    // Welcome
    "welcome.title": "Bienvenue dans MechaMind! 🔧",
    "welcome.subtitle": "Posez-moi n'importe quelle question sur l'entretien de votre voiture",
    "welcome.suggestion1.title": "🔍 Diagnostiquer le problème",
    "welcome.suggestion1.label": "Ma voiture ne démarre pas, quel est le problème?",
    "welcome.suggestion1.action": "Ma voiture ne démarre pas lorsque je tourne le contact, quelles sont les causes possibles et comment puis-je diagnostiquer le problème?",
    "welcome.suggestion2.title": "⚙️ Entretien régulier",
    "welcome.suggestion2.label": "Quand dois-je changer l'huile?",
    "welcome.suggestion2.action": "Quand dois-je changer l'huile moteur et les filtres de ma voiture?",
    "welcome.suggestion3.title": "🛠️ Réparation des freins",
    "welcome.suggestion3.label": "Grincement lors du freinage",
    "welcome.suggestion3.action": "J'entends un grincement lors du freinage, quel est le problème et comment le résoudre?",
    "welcome.suggestion4.title": "🔧 Problèmes de moteur",
    "welcome.suggestion4.label": "Surchauffe rapide du moteur",
    "welcome.suggestion4.action": "Le moteur surchauffe rapidement, quelles sont les causes possibles et les solutions?",
    
    // Languages
    "language.ar": "العربية",
    "language.en": "English",
    "language.fr": "Français",
    
    // Loading & Errors
    "loading.chat": "Chargement de la discussion...",
    "error.general": "Désolé, une erreur s'est produite lors du traitement de votre demande. Veuillez réessayer.",
    
    // Profile
    "profile.title": "Profil",
    "profile.email": "Email",
    "profile.name": "Nom",
    "profile.changePassword": "Changer le mot de passe",
    "profile.currentPassword": "Mot de passe actuel",
    "profile.newPassword": "Nouveau mot de passe",
    "profile.confirmPassword": "Confirmer le mot de passe",
    "profile.save": "Enregistrer les modifications",
    "profile.updateSuccess": "Profil mis à jour avec succès",
    "profile.updateFailed": "Échec de la mise à jour du profil",
    "profile.currentPasswordRequired": "Le mot de passe actuel est requis pour changer le mot de passe",
    "profile.passwordMismatch": "Les mots de passe ne correspondent pas",
    "profile.passwordTooShort": "Le mot de passe doit contenir au moins 6 caractères",
    
    // Oil Tracker
    "oilTracker.title": "Suivi de Vidange d'Huile",
    "oilTracker.subtitle": "Système intelligent pour suivre les vidanges d'huile moteur basé sur le temps (tous les 6 mois)",
    "oilTracker.back": "Retour",
    "oilTracker.dashboard": "Tableau de bord",
    "oilTracker.history": "Historique",
    "oilTracker.addNew": "Ajouter nouveau",
    "oilTracker.carInfo": "Informations du véhicule",
    "oilTracker.carModel": "Modèle de voiture",
    "oilTracker.purchaseDate": "Date d'achat de la voiture",
    "oilTracker.currentKm": "Kilométrage actuel",
    "oilTracker.lastOilChange": "Dernière vidange",
    "oilTracker.lastChangeDate": "Date",
    "oilTracker.lastChangeKm": "Kilométrage",
    "oilTracker.kmAtChange": "Kilométrage lors du changement",
    "oilTracker.saveInfo": "Enregistrer les informations",
    "oilTracker.saveRecord": "Enregistrer l'enregistrement",
    "oilTracker.updateKm": "Mettre à jour le kilométrage",
    "oilTracker.oilChanged": "Huile changée",
    "oilTracker.oilChangeDate": "Date de vidange",
    "oilTracker.status": "Statut",
    "oilTracker.daysSinceChange": "{days} jours se sont écoulés depuis la dernière vidange",
    "oilTracker.kmSinceChange": "KM depuis le changement",
    "oilTracker.nextChangeIn": "Prochain changement",
    "oilTracker.days": "jours",
    "oilTracker.km": "km",
    "oilTracker.totalChanges": "Total des changements",
    "oilTracker.times": "fois",
    "oilTracker.changeHistory": "Historique des vidanges",
    "oilTracker.noHistory": "Aucun enregistrement",
    "oilTracker.noRecordsYet": "Aucun enregistrement pour le moment",
    "oilTracker.changeNumber": "Changement #",
    "oilTracker.notes": "Notes",
    "oilTracker.addNotes": "Notes supplémentaires...",
    "oilTracker.addNotesOptional": "Notes (optionnel)",
    "oilTracker.good": "Bon",
    "oilTracker.warning": "Bientôt dû",
    "oilTracker.overdue": "En retard!",
    "oilTracker.recommended": "Recommandé: Tous les 6 mois ou 5000 km",
    "oilTracker.notificationsEnabled": "Notifications activées - nous vous rappellerons quand il sera temps de changer l'huile",
    "oilTracker.enableNotifications": "Activer les notifications",
    "oilTracker.testNotification": "Tester les notifications",
    "oilTracker.resetAll": "Réinitialiser (Vente de voiture)",
    "oilTracker.notifications": "Notifications",
    "oilTracker.notificationsOnlyOnApp": "Les notifications sont disponibles uniquement sur l'application!",
    "oilTracker.downloadAppForNotifications": "Téléchargez l'application sur votre téléphone pour recevoir des alertes automatiques lorsqu'il est temps de faire une vidange.",
    "oilTracker.enableNotificationsDesc": "Activez les notifications pour recevoir des alertes automatiques lorsqu'il est temps de faire une vidange",
    "oilTracker.importantInfo": "Information importante",
    "oilTracker.systemBasedOnTime": "• Le système est basé sur le temps, pas sur le kilométrage",
    "oilTracker.changeEvery6Months": "• Recommandé de changer l'huile tous les 6 mois (180 jours)",
    "oilTracker.alertStarts30Days": "• L'alerte commence 30 jours avant la date d'échéance",
    "oilTracker.dataSyncedToServer": "• Toutes les données sont sauvegardées sur le serveur et synchronisées",
    "oilTracker.carInfoOnceOnly": "Informations du véhicule (saisies une seule fois)",
    "oilTracker.carInfoUsedForAll": "Ces informations seront utilisées pour tous les enregistrements futurs",
    "oilTracker.savedCarInfo": "Informations du véhicule enregistrées",
    "oilTracker.model": "Modèle",
    "oilTracker.toChangeCarInfo": "Pour modifier les informations du véhicule, utilisez le bouton \"Réinitialiser\" lors de la vente de la voiture",
    "oilTracker.addNewRecord": "Ajouter un nouvel enregistrement de vidange",
    "oilTracker.addFirstRecord": "Ajouter le premier enregistrement",
    "oilTracker.delete": "Supprimer",
    "oilTracker.required": "*",
    
    // Auth
    "auth.logout": "Se déconnecter",
    "auth.signIn": "Se connecter",
    "auth.signUp": "S'inscrire",
    
    // Common
    "common.loading": "Chargement...",
    "common.back": "Retour",
  },
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en'); // Changed default to English

  useEffect(() => {
    // Load saved language from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['ar', 'en', 'fr'].includes(savedLocale)) {
      setLocaleState(savedLocale);
      updateDocumentDirection(savedLocale);
    } else {
      // Set default language if none saved
      updateDocumentDirection('en');
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    updateDocumentDirection(newLocale);
    // Force page reload to update Clerk localization
    window.location.reload();
  };

  const updateDocumentDirection = (locale: Locale) => {
    const html = document.documentElement;
    if (locale === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
    } else if (locale === 'en') {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
    } else if (locale === 'fr') {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'fr');
    }
  };

  const t = (key: string): string => {
    const translation = (translations[locale] as Record<string, string>)[key];
    return translation || key;
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
