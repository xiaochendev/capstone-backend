import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function (req, res, next) {
    // try and get token from header
    const token = req.header('x-auth-token');

    // if no token
    if(!token) return res.status(401).json({errors: [{ msg: "No token, auth denied"}] });

    // try validate token
    try {
        // verify token
        const decoded = jwt.verify(token, process.env.jwtSecret);
        
        req.user = decoded.user;    // this is = to user ID

        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: [{ msg: "Token not valid!"}] });
    }
}