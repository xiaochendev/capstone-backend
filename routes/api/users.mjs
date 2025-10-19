import express from "express";
import dotenv from "dotenv";
import User from '../../models/User.mjs';
import jwt from 'jsonwebtoken';
import { check, validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';

dotenv.config();
const router = express.Router();

// @route:   GET api/users
// @desc:    Test Route
// @access:  Public
router.route("/").get((req, res) => {
  res.send("User Test");
});

// @route:   POST api/users
// @desc:    Register new user
// @access:  Public
router
  .route("/")
  .post( 
    [
      check("name", "name is required").not().isEmpty(),
      check("email", "please include a valid email").isEmail(),
      check(
        "password", "please enter a password with 6 or more characters"
      ).isLength({min: 6}),
    ],
    async (req, res) =>{
      // run the above check on the request body, returning an array of errors
      const errors = validationResult(req);

      // if errors array NOT empty
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Destructure req.body
      const { name, email, password } = req.body;

      try {
        // Try to get user from db by email
        let user = await User.findOne({email});

        // if user exists return response error
        if(user){
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exist!" }] });
        }

        // create a user
        user = new User({
          name,
          email,
          password
        });

        // creating salt (tells bcrypt how many rounds of encryption)
        const salt = await bcrypt.genSalt(10);

        // encrypt user password
        user.password = await bcrypt.hash(user.password, salt);
        
        // save user to db ALSO generates mongoDB _id
        await user.save();

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
            if(err) throw err;
            res.status(201).json({token});
          }
        );
      
        // res.send("testing");
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{msg: "Server error"}] });
      }
    }
  )


export default router;


      // validate the data received (see if user & pw & email)
      // check if user already exists by email
      // validate pw
      // encrypt pw
      // save user
      // create token
      // send response

