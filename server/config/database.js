import mongoose from 'mongoose';
import env from './env.js';

/**
 * Connect to MongoDB Database
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(
      `Database Connection Warning: ${error.message}. Server operating with fallback handling.`
    );
  }
};

export default connectDB;
