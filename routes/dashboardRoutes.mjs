import express from 'express';
import { getUserDashboard } from '../controllers/dashboardController.mjs';
import { authMiddleware } from '../middlewares/authMiddlewares.mjs';

const router = express.Router();

// console.log("🔥 Loaded from: ", import.meta.url);

// Only accessible by logged-in users
router.get('/', authMiddleware, getUserDashboard);

export default router;
