import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  timeToComplete: {
    type: Number, // in seconds or ms depending on your game
    required: true,
  },
  isCompleted: {
    type:  Boolean,
    default: false,
  },
  // playedAt: {
  //   type: Date,
  //   default: Date.now,
  // },  
  // score: {
  //   type: Number,
  //   equired: true,
  // },
}, {timestamps: true });

export default mongoose.model('GameSession', gameSessionSchema);
