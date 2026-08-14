import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import env from "./config/env.js";
import corsOptions from "./config/cors.js";
import loggerMiddleware from "./config/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import farmRoutes from "./routes/farmRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import irrigationRoutes from "./routes/irrigationRoutes.js";
import cropHealthRoutes from "./routes/cropHealthRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import voiceRoutes from "./routes/voiceRoutes.js";

// Optional compression middleware loader
let compressionMiddleware = (req, res, next) => next();
try {
  const compressionModule = await import("compression");
  compressionMiddleware = (compressionModule.default || compressionModule)();
} catch (e) {
  // Safe fallback if compression package is not yet installed in node_modules
}

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again after 15 minutes"
  }
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(compressionMiddleware);
app.use(loggerMiddleware);

// Apply rate limiter to API routes
app.use("/api", apiLimiter);

// Parse JSON payloads up to 50MB (resolves PayloadTooLargeError)
app.use(express.json({ limit: "50mb" }));

// Parse URL-encoded payloads up to 50MB (resolves PayloadTooLargeError)
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health Check Routes
const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartFarm API Running"
  });
});
app.get("/api/health", healthCheck);
app.get("/api/v1/health", healthCheck);

// Swagger Documentation Route mount point
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Authentication Routes mount points
app.use("/api/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);

// Farm Routes mount points
app.use("/api/farms", farmRoutes);
app.use("/api/v1/farms", farmRoutes);

// Feature Engine Route Mount Points
app.use("/api/weather", weatherRoutes);
app.use("/api/v1/weather", weatherRoutes);

app.use("/api/irrigation", irrigationRoutes);
app.use("/api/v1/irrigation", irrigationRoutes);

app.use("/api/crop-health", cropHealthRoutes);
app.use("/api/v1/crop-health", cropHealthRoutes);

app.use("/api/market", marketRoutes);
app.use("/api/v1/market", marketRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/api/voice", voiceRoutes);
app.use("/api/v1/voice", voiceRoutes);

// Global Error Handler Middleware (MUST be mounted last)
app.use(errorHandler);

export default app;
