import express from 'express';
import { 
    register, 
    login, 
    getUser, 
    generateGuestToken, 
    upgradeGuest, 
    getGuestInfo,
    logout,
        } from '../controllers/authController.mjs';
import { authMiddleware } from '../middlewares/authMiddlewares.mjs';
import { guestMiddleware } from '../middlewares/guestMiddleware.mjs';
import { check, body } from 'express-validator';


const router = express.Router();

// console.log("🔥 Loaded from: ", import.meta.url);
// console.log('✅✅ ACTUAL authRoutes.mjs loaded');

router.post('/register',
    [
        check("username", "Username is required").notEmpty(),
        check("email", "Please include an email").not().isEmpty(),
        check("password", "Please Include a password").not().isEmpty(),
        check("password2", "Confirm Password is required").notEmpty(),

        // Custom validator: check if password === password2
        body("password2").custom((value, { req }) => {
        if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
    ], register);

router.post('/login',
    [
        check("email", "Please include an email").not().isEmpty(),
        check("password", "Please Include a password").not().isEmpty(),
    ],login);

router.post('/logout', logout);

// Guest users only, allow guest to play game
router.post('/guest', generateGuestToken);

router.get('/guest/info', authMiddleware, getGuestInfo);

// Authenticated users only
router.get('/', authMiddleware, getUser);


// Guest only, allow guest to upgrade
router.post('/upgrade', guestMiddleware, upgradeGuest)


export default router;
