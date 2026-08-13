import jwt from "jsonwebtoken";
import env from "../../config/env.js";

/**
 * Service to manage JWT signing and validation
 */
class TokenService {
  /**
   * Generate both access and refresh tokens for a user
   */
  generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Verify access token using primary secret key
   */
  verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
  }

  /**
   * Verify refresh token using rotation secret key
   */
  verifyRefreshToken(token) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
  }

  /**
   * Generate a stateless password reset token valid for 15 minutes
   */
  generateResetToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "15m" }
    );
  }

  /**
   * Verify a password reset token
   */
  verifyResetToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
  }
}

export default new TokenService();
