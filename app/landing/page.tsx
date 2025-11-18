'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Language = 'ar' | 'en' | 'fr';

const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    features: 'المميزات',
    founders: 'المؤسسون',
    download: 'التحميل',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    
    // Hero Section
    heroTitle: 'MechaMind',
    heroSubtitle: 'مساعدك الذكي لصيانة السيارات',
    heroDescription: 'احصل على تشخيص فوري ونصائح احترافية لمشاكل سيارتك باستخدام الذكاء الاصطناعي. متاح على الويب والهاتف.',
    getStarted: 'ابدأ الآن',
    downloadApp: 'حمّل التطبيق',
    
    // Features Section
    featuresTitle: 'لماذا MechaMind؟',
    feature1Title: '🤖 ذكاء اصطناعي متقدم',
    feature1Desc: 'تشخيص دقيق لمشاكل السيارات باستخدام تقنية Gemini AI من Google',
    feature2Title: '🔧 قطع غيار أصلية',
    feature2Desc: 'احصل على قطع الغيار المناسبة مع الأسعار بالدينار الجزائري',
    feature3Title: '🛢️ تتبع الصيانة',
    feature3Desc: 'نظام ذكي لتذكيرك بمواعيد تغيير الزيت والصيانة الدورية',
    feature4Title: '💬 دعم متعدد اللغات',
    feature4Desc: 'تحدث بالعربية، الإنجليزية أو الفرنسية - نفهمك بكل اللغات',
    feature5Title: '📊 لوحة تحكم إدارية',
    feature5Desc: 'نظام إدارة شامل لقطع الغيار والإحصائيات',
    feature6Title: '⚡ سريع وموثوق',
    feature6Desc: 'احصل على إجابات فورية ونصائح احترافية في ثوانٍ',
    
    // Founders Section
    foundersTitle: 'المؤسسون',
    foundersSubtitle: 'فريق العمل وراء MechaMind',
    founder1Name: 'مصطفى',
    founder1Title: 'مؤسس مشارك ومطور',
    founder1Bio: 'خبير في تطوير تطبيقات الذكاء الاصطناعي ومتخصص في حلول صيانة السيارات',
    founder2Name: 'أمين',
    founder2Title: 'مؤسس مشارك ومطور',
    founder2Bio: 'مهندس برمجيات متخصص في بناء أنظمة ذكية وسهلة الاستخدام',
    
    // Download Section
    downloadTitle: 'حمّل التطبيق الآن',
    downloadSubtitle: 'متاح على Android',
    downloadDesc: 'جرب MechaMind على هاتفك الذكي واحصل على مساعدة فورية أينما كنت',
    downloadBtn: '📱 حمّل APK للأندرويد',
    webVersion: 'أو استخدم النسخة الإلكترونية',
    
    // Footer
    footerTagline: 'مساعدك الذكي لصيانة السيارات',
    footerRights: '© 2025 MechaMind. جميع الحقوق محفوظة.',
    contact: 'تواصل معنا',
    phone: '0665543710',
  },
  
  en: {
    // Navigation
    home: 'Home',
    features: 'Features',
    founders: 'Founders',
    download: 'Download',
    login: 'Login',
    signup: 'Sign Up',
    
    // Hero Section
    heroTitle: 'MechaMind',
    heroSubtitle: 'Your Smart Car Maintenance Assistant',
    heroDescription: 'Get instant diagnosis and professional advice for your car problems using AI. Available on web and mobile.',
    getStarted: 'Get Started',
    downloadApp: 'Download App',
    
    // Features Section
    featuresTitle: 'Why MechaMind?',
    feature1Title: '🤖 Advanced AI',
    feature1Desc: 'Accurate car diagnostics using Google\'s Gemini AI technology',
    feature2Title: '🔧 Genuine Parts',
    feature2Desc: 'Get the right spare parts with prices in Algerian Dinars',
    feature3Title: '🛢️ Maintenance Tracking',
    feature3Desc: 'Smart system to remind you of oil changes and regular maintenance',
    feature4Title: '💬 Multi-language Support',
    feature4Desc: 'Speak in Arabic, English or French - we understand all languages',
    feature5Title: '📊 Admin Dashboard',
    feature5Desc: 'Comprehensive management system for parts and statistics',
    feature6Title: '⚡ Fast & Reliable',
    feature6Desc: 'Get instant answers and professional advice in seconds',
    
    // Founders Section
    foundersTitle: 'Our Founders',
    foundersSubtitle: 'The team behind MechaMind',
    founder1Name: 'Mostafa',
    founder1Title: 'Co-Founder & Developer',
    founder1Bio: 'Expert in AI application development and car maintenance solutions',
    founder2Name: 'Amine',
    founder2Title: 'Co-Founder & Developer',
    founder2Bio: 'Software engineer specialized in building intelligent and user-friendly systems',
    
    // Download Section
    downloadTitle: 'Download Now',
    downloadSubtitle: 'Available on Android',
    downloadDesc: 'Try MechaMind on your smartphone and get instant help wherever you are',
    downloadBtn: '📱 Download APK for Android',
    webVersion: 'Or use the web version',
    
    // Footer
    footerTagline: 'Your Smart Car Maintenance Assistant',
    footerRights: '© 2025 MechaMind. All rights reserved.',
    contact: 'Contact Us',
    phone: '0665543710',
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    features: 'Fonctionnalités',
    founders: 'Fondateurs',
    download: 'Télécharger',
    login: 'Connexion',
    signup: 'S\'inscrire',
    
    // Hero Section
    heroTitle: 'MechaMind',
    heroSubtitle: 'Votre Assistant Intelligent pour l\'Entretien Automobile',
    heroDescription: 'Obtenez un diagnostic instantané et des conseils professionnels pour vos problèmes de voiture grâce à l\'IA. Disponible sur web et mobile.',
    getStarted: 'Commencer',
    downloadApp: 'Télécharger l\'App',
    
    // Features Section
    featuresTitle: 'Pourquoi MechaMind?',
    feature1Title: '🤖 IA Avancée',
    feature1Desc: 'Diagnostic automobile précis utilisant la technologie Gemini AI de Google',
    feature2Title: '🔧 Pièces Originales',
    feature2Desc: 'Obtenez les bonnes pièces détachées avec les prix en Dinars Algériens',
    feature3Title: '🛢️ Suivi d\'Entretien',
    feature3Desc: 'Système intelligent pour vous rappeler les changements d\'huile et l\'entretien régulier',
    feature4Title: '💬 Support Multilingue',
    feature4Desc: 'Parlez en arabe, anglais ou français - nous comprenons toutes les langues',
    feature5Title: '📊 Tableau de Bord Admin',
    feature5Desc: 'Système de gestion complet pour les pièces et les statistiques',
    feature6Title: '⚡ Rapide et Fiable',
    feature6Desc: 'Obtenez des réponses instantanées et des conseils professionnels en secondes',
    
    // Founders Section
    foundersTitle: 'Nos Fondateurs',
    foundersSubtitle: 'L\'équipe derrière MechaMind',
    founder1Name: 'Mostafa',
    founder1Title: 'Co-Fondateur & Développeur',
    founder1Bio: 'Expert en développement d\'applications IA et solutions d\'entretien automobile',
    founder2Name: 'Amine',
    founder2Title: 'Co-Fondateur & Développeur',
    founder2Bio: 'Ingénieur logiciel spécialisé dans la création de systèmes intelligents et conviviaux',
    
    // Download Section
    downloadTitle: 'Téléchargez Maintenant',
    downloadSubtitle: 'Disponible sur Android',
    downloadDesc: 'Essayez MechaMind sur votre smartphone et obtenez de l\'aide instantanée où que vous soyez',
    downloadBtn: '📱 Télécharger APK pour Android',
    webVersion: 'Ou utilisez la version web',
    
    // Footer
    footerTagline: 'Votre Assistant Intelligent pour l\'Entretien Automobile',
    footerRights: '© 2025 MechaMind. Tous droits réservés.',
    contact: 'Contactez-nous',
    phone: '0665543710',
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('en');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const t = translations[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">MechaMind</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                {t.home}
              </a>
              <a href="#features" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                {t.features}
              </a>
              <a href="#founders" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                {t.founders}
              </a>
              <a href="#download" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                {t.download}
              </a>
            </div>

            {/* Language & Auth Buttons */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    language === 'ar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  AR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    language === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    language === 'fr' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  FR
                </button>
              </div>

              {/* Auth Buttons */}
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                {t.login}
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-all shadow-lg hover:shadow-xl"
              >
                {t.signup}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <span className="text-white text-4xl font-bold">M</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
              {t.heroTitle}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 font-medium mb-4">
              {t.heroSubtitle}
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                {t.getStarted} →
              </Link>
              <a
                href="#download"
                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-xl hover:bg-gray-50 font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                {t.downloadApp}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.featuresTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: t.feature1Title, desc: t.feature1Desc },
              { title: t.feature2Title, desc: t.feature2Desc },
              { title: t.feature3Title, desc: t.feature3Desc },
              { title: t.feature4Title, desc: t.feature4Desc },
              { title: t.feature5Title, desc: t.feature5Desc },
              { title: t.feature6Title, desc: t.feature6Desc },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section id="founders" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.foundersTitle}
            </h2>
            <p className="text-xl text-gray-600">
              {t.foundersSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Founder 1 - Mostafa */}
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-5xl font-bold">M</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                {t.founder1Name}
              </h3>
              <p className="text-gray-600 text-center font-medium mb-4">
                {t.founder1Title}
              </p>
              <p className="text-gray-600 text-center leading-relaxed">
                {t.founder1Bio}
              </p>
            </div>

            {/* Founder 2 - Amine */}
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-5xl font-bold">A</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                {t.founder2Name}
              </h3>
              <p className="text-gray-600 text-center font-medium mb-4">
                {t.founder2Title}
              </p>
              <p className="text-gray-600 text-center leading-relaxed">
                {t.founder2Bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.downloadTitle}
          </h2>
          <p className="text-xl text-gray-300 mb-3">
            {t.downloadSubtitle}
          </p>
          <p className="text-gray-400 mb-12 text-lg">
            {t.downloadDesc}
          </p>
          <div className="flex flex-col items-center gap-6">
            <a
              href="/mechamind.apk"
              download
              className="inline-flex items-center px-10 py-5 bg-white text-gray-900 rounded-xl hover:bg-gray-100 font-bold text-xl transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              {t.downloadBtn}
            </a>
            <p className="text-gray-400">
              {t.webVersion} →{' '}
              <Link href="/auth/signup" className="text-white hover:underline font-medium">
                {t.signup}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo & Tagline */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-gray-900 text-xl font-bold">M</span>
                </div>
                <span className="text-2xl font-bold">MechaMind</span>
              </div>
              <p className="text-gray-400">
                {t.footerTagline}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Links</h4>
              <div className="space-y-2">
                <a href="#home" className="block text-gray-400 hover:text-white transition-colors">
                  {t.home}
                </a>
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">
                  {t.features}
                </a>
                <a href="#founders" className="block text-gray-400 hover:text-white transition-colors">
                  {t.founders}
                </a>
                <a href="#download" className="block text-gray-400 hover:text-white transition-colors">
                  {t.download}
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">{t.contact}</h4>
              <p className="text-gray-400 mb-2">
                📞 {t.phone}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>{t.footerRights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
