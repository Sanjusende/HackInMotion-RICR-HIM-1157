import mongoose from 'mongoose';
import env from './env.js';

/**
 * Self-healing MongoDB URI Sanitizer
 * Automatically URL-encodes special characters in user credentials (e.g. '@' in passwords)
 */
export const sanitizeMongoUri = (uri) => {
  if (!uri) return uri;
  try {
    const protocolMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
    if (!protocolMatch) return uri;

    const protocol = protocolMatch[1];
    const rest = protocolMatch[2];

    const lastAtIndex = rest.lastIndexOf('@');
    if (lastAtIndex === -1) return uri;

    const credentials = rest.substring(0, lastAtIndex);
    const hostInfo = rest.substring(lastAtIndex + 1);

    const firstColonIndex = credentials.indexOf(':');
    if (firstColonIndex === -1) return uri;

    const username = credentials.substring(0, firstColonIndex);
    const password = credentials.substring(firstColonIndex + 1);

    let decodedPassword = password;
    try {
      decodedPassword = decodeURIComponent(password);
    } catch (e) {
      // ignore
    }

    if (password.includes('@') && decodedPassword === password) {
      const encodedPassword = encodeURIComponent(password);
      return `${protocol}${username}:${encodedPassword}@${hostInfo}`;
    }

    return uri;
  } catch (err) {
    console.warn('⚠️ Warning: MongoDB URI parsing failed:', err.message);
    return uri;
  }
};

/**
 * Connect to MongoDB Database (with fallback support)
 */
const connectDB = async () => {
  let uri = env.MONGO_URI || '';
  uri = sanitizeMongoUri(uri);

  let success = false;
  
  // Try primary URI if provided and protocol matches
  if (uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
    try {
      console.log(`Connecting to primary MongoDB URI...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`🟢 MongoDB Connected to primary database: ${conn.connection.host}`);
      success = true;
    } catch (error) {
      console.error(
        `⚠️ Warning: Primary Database Connection failed: ${error.message}`
      );
    }
  }

  // Local fallback if primary fails
  if (!success) {
    const fallbackUri = 'mongodb://127.0.0.1:27017/KrishiMitra';
    try {
      console.log(`Connecting to local MongoDB fallback: ${fallbackUri}`);
      const conn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`🟢 Connected to Fallback MongoDB: ${conn.connection.host}`);
      success = true;
    } catch (error) {
      console.error(
        `🚨 Fatal Database Connection Error: All connection attempts failed (Last error: ${error.message}). Stopping server startup.`
      );
      process.exit(1);
    }
  }
};

export default connectDB;
