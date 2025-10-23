import GameSession from '../models/GameSession.mjs';
import User from '../models/User.mjs';
import Game from '../models/Game.mjs';

// POST /games
export const createGame = async (req, res) => {
  try {
    const { name, type, description } = req.body;

    // Basic validation
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    // Check if game with same name exists
    const existingGame = await Game.findOne({ name });
    if (existingGame) {
      return res.status(409).json({ error: 'Game with this name already exists' });
    }

    const newGame = new Game({
      name,
      type,
      description,
    });

    const savedGame = await newGame.save();

    res.status(201).json(savedGame);
  } catch (err) {
    console.error('Error adding game:', err);
    res.status(500).json({ error: 'Failed to add game' });
  }
};

// GET /games/:gameId
export const getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /games?name
export const getGameByName = async(req, res) => {
  try {
    const { name } = req.query;
    const query = name ? {name} : {};
    const games = await Game.find(query);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /games/:gameId/submit
export  const submitGameResult = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: no user info found' });
    }

    const userId = req.user.id;
    const gameId = req.params.gameId;
    // const { score, timeToComplete } = req.body;
    const { timeToComplete, isCompleted = false } = req.body

    if (!userId || !gameId || typeof timeToComplete !== 'number') {
      return res.status(401).json({ error: 'Missing required fields' });
    }

    const newSession = new GameSession({
      userId,
      gameId,
      // score,
      timeToComplete,
      isCompleted
    });

    await newSession.save();
    res.status(201).json({ message: "Game result submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /leaderboard
export const getGlobalLeaderboard = async (req, res) => {
  try {
    // Find top 10 game sessions with fastest time (global, all games)
    const leaderboard = await GameSession.find({isCompleted:true})
      .populate('userId', 'username isGuest')
      .populate('gameId', 'name') // to show game name
      .sort({ timeToComplete: 1 }) // fastest time first
      .limit(10);

    const results = leaderboard
      .filter(entry => entry.userId)    // remove sessions with deleted users
      .map((entry) => ({
        username: entry.userId.username || "Unknown User",
        isGuest: entry.userId.isGuest || false,
        time: entry.timeToComplete,
        gameName: entry.gameId?.name || "Unknown Game",
    }));

    res.json({ leaderboard: results });
  } catch (err) {
    console.error("❌ Error fetching leaderboard:", err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

// GET /games/:gameId/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;

    const leaderboard = await GameSession.find({ gameId })
      .populate('userId', 'username isGuest')
      .sort({ timeToComplete: 1 }) // or score descending if higher is better
      .limit(10);

    const results = leaderboard.map((entry) => ({
      username: entry.userId.isGuest ? entry.userId.username : entry.userId.username,
      time: entry.timeToComplete,
      // score: entry.score,
    }));

    res.json({ leaderboard: results });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
