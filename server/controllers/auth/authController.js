import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import tokenService from "../../services/auth/tokenService.js";

/**
 * POST /api/auth/register
 * Handles farmer/user signup
 */
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, language } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in DB
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "FARMER",
      language: language || "EN"
    });

    // Generate tokens
    const { accessToken, refreshToken } = tokenService.generateTokens(user);

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          language: user.language
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * POST /api/auth/login
 * Authenticates user credentials
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate credentials tokens
    const { accessToken, refreshToken } = tokenService.generateTokens(user);

    // Update refresh token session and last login
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          language: user.language
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * POST /api/auth/refresh-token
 * Rotates access token via valid refresh token
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    let decoded;
    try {
      decoded = tokenService.verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token"
      });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token session"
      });
    }

    // Generate new rotated token set
    const tokens = tokenService.generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * POST /api/auth/logout
 * Destroys active refresh token session
 */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid refresh token or already logged out"
      });
    }

    // Revoke refresh token
    user.refreshToken = "";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

/**
 * GET /api/auth/me
 * Retrieves current active profile
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: { user }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};
