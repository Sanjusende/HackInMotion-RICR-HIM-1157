import env from "./env.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://krishimitra2026.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isVercel = origin === "https://krishimitra2026.vercel.app" || origin.endsWith(".vercel.app");
    const isRender = origin.endsWith(".onrender.com");
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");

    if (allowedOrigins.includes(origin) || isVercel || isRender || isLocal || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200
};

export default corsOptions;
