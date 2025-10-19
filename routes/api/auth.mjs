import express from "express";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { check, validationResult } from 'express-validator';
import User from "../../models/User.mjs";
import auth from '../../middleware/basicAuth.mjs';

dotenv.config();

const router = express.Router();

// @route:   GET api/auth
// @desc:    Auth route to get user data, represent all private routes
// @access:  Private
router
  .route("/")
  .get(auth, async (req, res) => {
    try {
      // grab anythings beside password
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);

    } catch (error) {
      console.error(error.message);
      res.status(500).json({errors: [{ msg: "Server error"}] });
    }
  })
  // @route:   POST api/auth
  // @desc:    Auth route to create a user data
  // @access:  Private
  .post(
    [
      check('email', 'please include a valid email').isEmail(),
      check("password", "Password required").not().isEmpty(),
    ], 
    async (req, res) => {
      const errors = validationResult(req);

      if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
      }

      // destructure out req.body
      const { email, password } = req.body;

      try {
        // check if user in db by email
        let user = await User.findOne({ email });

        if(!user) {
          return res.status(400).json({errors: [{ msg: 'Invalid credentials'}] });
        }

        // check if passwords match (user.password == db saved one)
        const isMatch = await bcrypt.compare(password, user.password)

        // if pw doesnt match return response
        if(!isMatch) {
          return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}] });
        }

        // create a payload for jwt; You DONT want include other un-crypted info
        const payload = {
          user: {
            id: user._id,
          }
        }
        
        // create token & sign it with jwtSecret
        jwt.sign(
          payload,
          process.env.jwtSecret,
          {expiresIn: "6h"},
          (err, token) => {
            if(err) throw console.error(err);
            res.status(201).json({token});
          }
        );

      } catch (error) {
        console.error(error.message);
        res.status(500).json({ errors: [{ msg: "server error"}] });
      }
    });



export default router;
