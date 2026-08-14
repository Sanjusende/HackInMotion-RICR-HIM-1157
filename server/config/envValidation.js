const REQUIRED_VARS = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL'];

export const validateEnv = () => {
  const missing = [];
  REQUIRED_VARS.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error(`CRITICAL ERROR: Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};
