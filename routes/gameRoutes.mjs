import express from 'express';
import { 
    submitGameResult, 
    getLeaderboard, 
    createGame, 
    getGameById, 
    getGameByName, 
    getGlobalLeaderboard,
    } from '../controllers/gameController.mjs';
import { authOrGuestMiddleware} from '../middlewares/authOrGuestMiddleware.mjs';
import { check } from 'express-validator';
import { authMiddleware } from '../middlewares/authMiddlewares.mjs';

const router = express.Router();

// console.log("🔥 Loaded from: ", import.meta.url);


// @router GET /games/leaderboard                                       //Put more specific routes before more generic routes, 
// @desc get top 10 players among all games
// @access public
router.get('/leaderboard', getGlobalLeaderboard)                            // static path first

// @route GET /games/:gameId/leaderboard
// @desc get top 10 players in a game
// @access user
router.get('/:gameId/leaderboard',authMiddleware, getLeaderboard);          // specific path next

// @route GET /games/:gameId
// @desc get game info by gameId
// @access public
router.get('/:gameId', getGameById);                                        // generic param path last

// @route GET /games
// @desc get game info by name
// @access public
router.get('/', getGameByName);                                      // catch-all with query param last


// @route POST /games
// @desc create a game 
// @acess public
router.post('/', createGame);

// @route POST /games/:gameId/submit
// @desc submit a game result
// @access guest or user
router.post('/:gameId/submit', 
        authOrGuestMiddleware,
        [
           // check("score", "score is a number").isNumeric(),
           check('timeToComplete', 'timeToComplete is required').isNumeric(),
        ], 
        submitGameResult);


export default router;
