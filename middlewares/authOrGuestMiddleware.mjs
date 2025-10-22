// Either User Or Guest
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';

export const authOrGuestMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.header("x-auth-token"); // from cookie or header

  if (!token) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    // req.userId = decoded.userId;
    // req.isGuest = decoded.isGuest;

    req.user = {
      id: decoded.userId,
      isGuest: decoded.isGuest,
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
