import type { NextConfig } from "next";

/**
 * تكوين Next.js الذكي
 * - للويب (Vercel): يعمل مع API Routes
 * - للموبايل (Android): يبني static export
 * 
 * استخدم: BUILD_MODE=static npm run build للموبايل
 * استخدم: npm run build للويب
 */

const isStaticBuild = process.env.BUILD_MODE === 'static';

const nextConfig: NextConfig = {
  // فقط عند البناء للموبايل نستخدم static export
  ...(isStaticBuild ? { output: 'export' } : {}),
  
  images: {
    unoptimized: isStaticBuild, // فقط للموبايل
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

console.log('📦 Next.js Build Mode:', isStaticBuild ? 'STATIC (Mobile)' : 'SERVER (Web)');

export default nextConfig;
