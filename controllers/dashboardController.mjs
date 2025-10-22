import GameSession from '../models/GameSession.mjs';
import Game  from '../models/Game.mjs';
import mongoose from 'mongoose';

// GET /dashboard
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // Aggregate sessions grouped by game
    const stats = await GameSession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },  // matching the GameSession entries specific to the logged-in user only
      {
        $group: {                                                 // Aggregated game stats:
          _id: '$gameId',
          playCount: { $sum: 1 },                                 // Counts number of times a game was played
          // bestScore: { $max: '$score' },                       // Shows best score
          fastestTime: { $min: '$timeToComplete' },               // fastest time
          lastPlayed: { $max: '$createdAt' }                      // last played date
        }
      },
      {
        $lookup: {
          from: 'games',
          localField: '_id',
          foreignField: '_id',
          as: 'game'
        }
      },
      { $unwind: '$game' },
      {
        $project: {
          _id: 0,
          gameId: '$game._id',
          gameName: '$game.name',
          type: '$game.type',
          playCount: 1,
          // bestScore: 1,
          fastestTime: 1,
          lastPlayed: 1
        }
      }
    ]);

    res.json({ stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
};
