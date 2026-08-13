import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import farmRoutes from "./routes/farmRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

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

// Authentication Routes mount points
app.use("/api/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);

// Farm Routes mount points
app.use("/api/farms", farmRoutes);
app.use("/api/v1/farms", farmRoutes);

export default app;
