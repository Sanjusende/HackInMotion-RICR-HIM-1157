import env from './env.js';

const allowedOrigins = [env.CLIENT_URL, env.MOBILE_URL, env.ADMIN_URL].filter(Boolean);

export const corsOptions = {
  origin: (origin, callback) => {
    // If no origin is provided (e.g. mobile apps, server-to-server, curl), allow it.
    if (!origin) {
      return callback(null, true);
    }

    const isLocalhost =
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      origin === 'http://localhost' ||
      origin === 'http://127.0.0.1';

    if (allowedOrigins.includes(origin) || (env.NODE_ENV === 'development' && isLocalhost)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
};

export default corsOptions;
