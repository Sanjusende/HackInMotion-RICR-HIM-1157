import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

// Enforce environment validation
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL'];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  if (NODE_ENV === 'production') {
    console.error(
      `🚨 Fatal Environment Config Error: Missing required variables: ${missingVars.join(', ')}`
    );
    process.exit(1);
  } else {
    console.warn(
      `⚠️ Warning: Missing environment variables in development mode: ${missingVars.join(', ')}. Using insecure defaults.`
    );
  }
}

const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/smart-farming',
  NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_for_krishimitra_12345',
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || 'fallback_jwt_refresh_secret_for_krishimitra_67890',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MOBILE_URL: process.env.MOBILE_URL || 'http://localhost:8080',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:3000',
};

export default env;
