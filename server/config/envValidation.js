const REQUIRED_VARS = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL'];

export const validateEnv = () => {
  const missing = [];
  REQUIRED_VARS.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error(`🚨 Fatal Environment Config Error: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Validate PORT format
  if (process.env.PORT && isNaN(Number(process.env.PORT))) {
    console.error(`🚨 Fatal Environment Config Error: PORT must be a valid number. Provided: "${process.env.PORT}"`);
    process.exit(1);
  }

  // Validate NODE_ENV value
  const allowedEnvs = ['development', 'production', 'test'];
  const currentEnv = process.env.NODE_ENV || 'development';
  if (!allowedEnvs.includes(currentEnv)) {
    console.error(`🚨 Fatal Environment Config Error: NODE_ENV must be one of ${allowedEnvs.join(', ')}. Provided: "${currentEnv}"`);
    process.exit(1);
  }

  console.log('🟢 Environment variables validated successfully.');
};
