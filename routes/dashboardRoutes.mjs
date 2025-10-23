import express from 'express';
import { getUserDashboard } from '../controllers/dashboardController.mjs';
import { authMiddleware } from '../middlewares/authMiddlewares.mjs';

const router = express.Router();

// console.log("🔥 Loaded from: ", import.meta.url);

// @route GET /dashboard
// @desc get user's game stats
// @access registered users
router.get('/', authMiddleware, getUserDashboard);

export default router;
