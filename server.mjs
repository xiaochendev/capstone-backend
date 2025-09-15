// imports
import express from 'express';
import dotenv from 'dotenv';
import globalErr from './middlewares/globalErr.mjs';
import log from './middlewares/loggingMiddleware.mjs';
import connectDB from './db/conn.mjs';
import mammalRoutes from './routes/mammalRoutes.mjs';

// setup
dotenv.config()
const app = express();
const PORT = process.env.PORT || 3001;


(async () => {
  try {
    // DB connection
    await connectDB(); 

    // middlewares
    app.use(express.json());
    app.use(log);

    // routes
    app.use('/api/mammals', mammalRoutes);

    // error handling
    app.use(globalErr);

    // listener
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err.message);
    process.exit(1); // Exit app with failure
  }
})();

