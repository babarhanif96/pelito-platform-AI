const jwt = require('jsonwebtoken')
const User = require('../models/usersModel.js')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

/**
 * Authenticate token middleware
 * Verifies JWT token and attaches user to request
 */
const authenticateToken = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET_KEY)
      const id = decoded.userId
      req.user = await User.findById(id).select('-password')

      if (!req.user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      next()
    } catch (error) {
      console.error(error)
      return res.status(401).json({ success: false, message: "Not authorized, token failed" })
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" })
  }
}

/**
 * Legacy protect middleware (for backward compatibility)
 */
const protect = authenticateToken;

/**
 * Authorize by role middleware
 * @param {...string} roles - Allowed roles
 */
const authorizeRole = (...roles) => {
  return async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = await User.findById(decoded.userId).select('-password');

        if (!req.user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if user has the required role
        if (!roles.includes(req.user.user_type)) {
          return res.status(403).json({
            success: false,
            message: `Role ${req.user.user_type} is not allowed to access this resource`,
          });
        }

        next();
      } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
      }
    } else {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
  };
};

/**
 * Authorize professional middleware
 * Ensures user is a professional and can access their own data
 */
const authorizeProfessional = async (req, res, next) => {
  try {
    // Check if user is a professional
    if (req.user.user_type !== 'professional') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Professional account required.'
      });
    }

    // Check if user is accessing their own data
    const { professionalId } = req.params;
    if (professionalId && req.user._id.toString() !== professionalId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own analytics data.'
      });
    }

    next();
  } catch (error) {
    console.error("Professional authorization error:", error);
    return res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

/**
 * Authorize admin middleware
 * Ensures user is an admin
 */
const authorizeAdmin = async (req, res, next) => {
  try {
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

module.exports = { 
  protect, 
  authorizeRole, 
  authenticateToken,
  authorizeProfessional,
  authorizeAdmin
}

