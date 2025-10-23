import express from 'express';
import { 
    register, 
    login, 
    getUser, 
    generateGuestToken, 
    upgradeGuest, 
    getGuestInfo,
    logout,
    updateUser,
    deleteUser,
        } from '../controllers/authController.mjs';
import { authMiddleware } from '../middlewares/authMiddlewares.mjs';
import { guestMiddleware } from '../middlewares/guestMiddleware.mjs';
import { check, body } from 'express-validator';

const router = express.Router();

// console.log("🔥 Loaded from: ", import.meta.url);
// console.log('✅✅ ACTUAL authRoutes.mjs loaded');

// @route POST /auth/register
// @desc user register
// @access public
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

// @route POST /auth/login
// @desc user login
// @access public
router.post('/login',
    [
        check("email", "Please include an email").not().isEmpty(),
        check("password", "Please Include a password").not().isEmpty(),
    ],login);

// @route POST /auth/logout
// @desc user or guest logout - clearc cookie
// @access public
router.post('/logout', logout);

// @route GET /auth
// @desc get user info
// @access registered users only
router.get('/', authMiddleware, getUser);

// @route PUT /auth
// @desc update user info
// @access registered user only
router.put('/', authMiddleware, updateUser);

// @router DELETE /auth
// @desc delete user info
// @access registered user only
router.delete('/', authMiddleware, deleteUser);

// @route POST /auth/guest
// @desc allow guest to play game
// @access public
router.post('/guest', generateGuestToken);

// @route GET /auth/guest/info
// @desc get guest info
// @access guest only
router.get('/guest/info', guestMiddleware, getGuestInfo);

// @route POST /auth/upgrade
// @desc allow guest to rupgrade/register
// @access guest only
router.post('/upgrade', guestMiddleware, upgradeGuest)


export default router;
