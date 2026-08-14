import env from "../config/env.js";
import ApiResponse from "../utils/apiResponse.js";

/**
 * Global Exception Interceptor Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Exception caught by Global Interceptor:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Expose stack traces in development mode only
  const details = env.NODE_ENV === "development" ? { stack: err.stack } : null;

  return ApiResponse.error(res, message, statusCode, details);
};

export default errorHandler;
