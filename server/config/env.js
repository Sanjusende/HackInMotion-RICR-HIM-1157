import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/smart-farming",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_jwt_secret_for_krishimitra_12345",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "fallback_jwt_refresh_secret_for_krishimitra_67890"
};

export default env;
