// Only registered users
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.header("x-auth-token"); // from cookie or header
  
  if (!token)
    return res.status(401).json({ errors: [{ msg: "No Token provided, Auth Denied" }] });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.isGuest) {
      return res.status(403).json({ error: 'Guests cannot access this resource' });
    }
      req.userId = decoded.userId;
      req.isGuest = decoded.isGuest;
      next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
