import tokenService from '../services/auth/tokenService.js';
import ApiResponse from '../utils/apiResponse.js';

/**
 * Access token verification middleware
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return ApiResponse.error(res, 'Authorization access token required', 401, 'UNAUTHORIZED');
    }

    let decoded;
    try {
      decoded = tokenService.verifyAccessToken(token);
    } catch (err) {
      return ApiResponse.error(res, 'Invalid or expired access token', 401, 'INVALID_TOKEN');
    }

    decoded._id = decoded.id || decoded._id;
    decoded.id = decoded.id || decoded._id;
    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Authentication server error', 500, 'AUTH_SERVER_ERROR');
  }
};

export default authMiddleware;
