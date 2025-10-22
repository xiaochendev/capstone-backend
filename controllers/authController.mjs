import User from '../models/User.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';


const generateToken = (userId, isGuest = false, expiresIn = '7d') => {
  return jwt.sign({ userId, isGuest }, process.env.JWT_SECRET, { expiresIn });
};

// POST /auth/register
export const register = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
  try {
    const { username, email, password, password2 } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      passwordHash: password,
      isGuest: false,
    });

    await newUser.save();

    // deconstruct user from saved istance
    const { _id, createdAt, isGuest } = newUser;
    const token = generateToken(_id, isGuest);

    // res.json({ token, user: { id: _id, username, email, createdAt, isGuest }, });
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',     // Only secure in prod
        sameSite: 'lax',   
        maxAge: 604800000,  
      })
      .json({
      user: {
        id: _id,
        username,
        email,
        createdAt,
        isGuest
      }
    })

  } catch (err) {
    console.error("❌ Register error:", err);  
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  // console.log("🔐 Login payload received:", req.body);

  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email, isGuest: false });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    console.log("Attempted password:", password);
    console.log("Stored hash:", user.passwordHash);

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    console.log("Password match:", isMatch);

    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // deconstruct actual user fields
    const { _id, username, createdAt, isGuest } = user;
    const token = generateToken(_id, isGuest);

    // res.json({ token, user: { id: user._id, username: user.username } });
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
        sameSite: 'lax',   // better dev compatibility
        maxAge: 604800000,  // 7 days
      })
      .json({
      user: {
        id: _id,
        username,
        email,
        createdAt,
        isGuest
      }
    })
  } catch (err) {
    console.error("❌ Login error:", err);  
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /auth
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("❌ getUser error:", err);  
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /auth/guest
export const generateGuestToken = async (req, res) => {
  try {
      const guestUser = new User({
      username: `guest_${Date.now()}`,
      isGuest: true,
    });

    await guestUser.save();

    const token = generateToken(guestUser._id, true, '1d');
    // res.json({ token, user: { id: guestUser._id, username: guestUser.username } });
    res
      .cookie('token', token, {
        httpOnly: true,   // prevent XSS, when false it makes token accessible from JS(less secure)
        // secure: false,
        secure: process.env.NODE_ENV === 'production',  // ensures cookies are only sent over HTTPS in production
        // sameSite: 'strict',
        sameSite: 'lax',
        // maxAge: 86400000
        expires: new Date(Date.now() + 86400000),
      })
      .json({
        user: {
          id: guestUser._id,
          username: guestUser.username
        }
      })

  } catch (err) {
    console.error("❌ generateGuestToken error:", err);  
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /auth/upgrade
export const upgradeGuest = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const guestUser = await User.findById(req.userId);
    if (!guestUser || !guestUser.isGuest) {
      return res.status(400).json({ error: "User is not a guest" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: "Username or email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    guestUser.username = username;
    guestUser.email = email;
    guestUser.passwordHash = passwordHash;
    guestUser.isGuest = false;

    await guestUser.save();

    const newToken = generateToken(guestUser._id, false);
    // res.json({ token: newToken, user: { id: guestUser._id, username: guestUser.username } });
    res
      .cookie('token', newToken, {
        httpOnly: true,
        // secure: false,
        secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
        sameSite: 'lax',
        maxAge: 86400000
      })
      .json({
        user: {
          id: guestUser._id,
          username: guestUser.username
        }
      })
  } catch (err) {
    console.error("❌ upgradeGuest error:", err);
    res.status(500).json({ error: "Failed to upgrade account" });
  }
};

// GET /auth/guest/info
export const getGuestInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");

    if (!user || !user.isGuest) {
      return res.status(403).json({ error: "User is not a guest" });
    }

    res.json({
      id: user._id,
      username: user.username,
      isGuest: true,
    });

  } catch (err) {
    console.error("❌ getGuestInfo error:", err);
    res.status(500).json({ error: "Failed to retrieve guest info" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
}