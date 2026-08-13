import morgan from "morgan";
import env from "./env.js";

const format = env.NODE_ENV === "production" ? "combined" : "dev";

export const loggerMiddleware = morgan(format);

export const logger = {
  info: (...args) => console.log("[INFO]", new Date().toISOString(), ...args),
  warn: (...args) => console.warn("[WARN]", new Date().toISOString(), ...args),
  error: (...args) => console.error("[ERROR]", new Date().toISOString(), ...args),
  debug: (...args) => {
    if (env.NODE_ENV !== "production") {
      console.log("[DEBUG]", new Date().toISOString(), ...args);
    }
  }
};

export default loggerMiddleware;
