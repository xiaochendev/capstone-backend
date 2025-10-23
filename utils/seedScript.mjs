import mongoose from "mongoose";
import dotenv from "dotenv";
// Collections/Models
import Game from "../models/Game.mjs";
import User from '../models/User.mjs';
import GameSession from '../models/GameSession.mjs';

// Data
import gameData from './gameData.mjs';
import userData from './userData.mjs';

dotenv.config();

const connectionStr = process.env.MONGO_URI || "";

async function seedDatabase() {
  console.log(`✅ Seeding Script Run`);
  try {
    await mongoose.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ Connected to DB...`);

    await User.deleteMany();
    console.log(`✅ Cleared DB of prev user`);

    const users = await User.insertMany(userData);
    console.log(`✅ Seeded DB with users`);
    console.log(`✅ Inserted ${users.length} users`)


    await Game.deleteMany();
    console.log(`✅ Cleared DB of prev game`);

    const games = await Game.insertMany(gameData);
    console.log(`✅ Seeded DB with game`);
    console.log(`✅ Inserted ${games.length} game`)
    
    // --- Seed Game Sessions ---
    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const gameSessionsData = [];
    // created 15 random gameSession
    for (let i = 0; i < 15; i++) {
      const user = randomItem(users);
      const game = randomItem(games);
      const isCompleted = Math.random() > 0.3;      // 70% chance true
      const timeToComplete = isCompleted
        ? Math.floor(Math.random() * 240) + 60      // 60–300 sec
        : Math.floor(Math.random() * 120) + 20;     // 20-140 sec

      gameSessionsData.push({
        userId: user._id,
        gameId: game._id,
        timeToComplete,
        isCompleted,
      });
    }
    
    console.log(`✅ Mapped gameSession with user and game`)

    await GameSession.deleteMany({});
    console.log(`✅ Cleared DB of prev gameSession`);

    const sessions = await GameSession.insertMany(gameSessionsData);
    console.log(`✅ Inserted ${sessions.length} game sessions`);

    console.log(`🎉 Seed Complete`);
    await mongoose.connection.close();
    process.exit(0);            // success
  } catch (err) {
    console.error(`❌ Error seeding DB`, err);
    await mongoose.connection.close();
    process.exit(1);            // failure, any number beside 0 means an error occurred
  }
}

seedDatabase();
