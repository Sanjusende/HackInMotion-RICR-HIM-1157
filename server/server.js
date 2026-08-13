import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/database.js"; 
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Initialize Database connection client
connectDB();

const PORT = env.PORT || 5000;


const server = app.listen(PORT, () => {
  console.log(`Server Running in ${env.NODE_ENV} mode on Port ${PORT}`);
});

// Graceful shutdown handling
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("Http server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));