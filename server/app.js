import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import farmRoutes from "./routes/farmRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KrishiMitra API Running"
  });
});

// Authentication Routes mount point
app.use("/api/auth", authRoutes);

// Farm Profile Routes mount point
app.use("/api/farms", farmRoutes);

// Farmer Profile Routes mount point
app.use("/api/profile", profileRoutes);

export default app;
