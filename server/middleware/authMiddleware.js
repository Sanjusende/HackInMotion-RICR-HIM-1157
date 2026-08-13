import tokenService from "../services/auth/tokenService.js";

/**
 * Access token verification middleware
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization access token required"
      });
    }

    let decoded;
    try {
      decoded = tokenService.verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token"
      });
    }

    decoded._id = decoded.id || decoded._id;
    decoded.id = decoded.id || decoded._id;
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
