import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['puzzle', 'reaction', 'quiz', 'memory'], // extendable
    required: true,
  },
  description: {
    type: String,
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
}, {timestamps: true});

export default mongoose.model('Game', gameSchema);
