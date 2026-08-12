import tokenService from "../services/auth/tokenService.js";

/**
 * Access token verification middleware
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization access token required"
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = tokenService.verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token"
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication server error"
    });
  }
};

export default authMiddleware;
