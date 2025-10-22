import express from 'express';
import { submitGameResult, getLeaderboard, createGame, getGameById, getGameByName } from '../controllers/gameController.mjs';

import { authMiddleware } from '../middlewares/authMiddlewares.mjs'
import { authOrGuestMiddleware} from '../middlewares/authOrGuestMiddleware.mjs';
import { check } from 'express-validator';

const router = express.Router();
// console.log("🔥 Loaded from: ", import.meta.url);



router.get('/', getGameByName);
router.get('/:gameId', getGameById);


router.post('/', createGame);

router.post('/:gameId/submit', 
        authOrGuestMiddleware,
        [
           // check("score", "score is a number").isNumeric(),
           check('timeToComplete', 'timeToComplete is required').isNumeric(),
        ], 
        submitGameResult);

// getLeaderboard that include both guest and registered user
router.get('/:gameId/leaderboard',authOrGuestMiddleware, getLeaderboard);

export default router;
