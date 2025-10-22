// Only guest
import jwt from 'jsonwebtoken';

export const guestMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.header("x-auth-token"); // from cookie or header

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.isGuest) {
      return res.status(403).json({error: 'Not a guest token'})
    }

    req.userId = decoded.userId;
    req.isGuest = true;
    
    next();
  } catch (err) {
    console.error('Guest Middleware Error:', err);
    res.status(500).json({ error: 'Invalid guest token' });
  }
};
