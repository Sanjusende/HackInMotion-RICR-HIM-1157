import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import farmRoutes from "./routes/farmRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import irrigationRoutes from "./routes/irrigationRoutes.js";
import cropHealthRoutes from "./routes/cropHealthRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import voiceRoutes from "./routes/voiceRoutes.js";

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

export default app;
