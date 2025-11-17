import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseProvider: process.env.DATABASE_PROVIDER || 'sqlite',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-this',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Clerk
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
  clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET || '',

  // Gemini AI
  geminiApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',

  // CORS
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000'],

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};

// Validate required environment variables
export function validateConfig() {
  const required = ['JWT_SECRET', 'GOOGLE_GENERATIVE_AI_API_KEY', 'CLERK_SECRET_KEY'];
  
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('⚠️  Using default values - NOT recommended for production!');
  }

  console.log('📋 Configuration loaded:');
  console.log(`  - Port: ${config.port}`);
  console.log(`  - Environment: ${config.nodeEnv}`);
  console.log(`  - Database: ${config.databaseProvider}`);
  console.log(`  - CORS Origins: ${config.corsOrigins.length} origins`);
}
