// import
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/conn.mjs';
import log from './utils/logging.mjs';
import globalErrorHandling from './utils/globalErr.mjs'
import cors from 'cors';
import authRoutes from './routes/authRoutes.mjs';
import gameRoutes from './routes/gameRoutes.mjs';
import dashboardRoutes from './routes/dashboardRoutes.mjs'
import cookieParser from 'cookie-parser';

// setup
dotenv.config()
const app = express();
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    // DB connection
    await connectDB(); 
    
    // middlewares
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(log);
    app.use(cors({      
      origin: 'http://localhost:5173',        // frontend url
      credentials: true                        // allow cookie
    }));
    app.use(cookieParser());

    // app.use(methodOverride('_method'));         // Enable PATCH/DELETE via HTML Forms, use ?method=PATCH or ?method=DELETE.
    
    // static style
    app.use(express.static('./styles'));

    // routes
    // app.use('/', (req, res) => {
    //     res.json('working');
    // });

    app.use('/auth', authRoutes);
    app.use('/games', gameRoutes);
    app.use('/dashboard', dashboardRoutes);

    // error handling
    app.use(globalErrorHandling);

    // listener
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err.message);
    process.exit(1); // Exit app with failure
  }
})();
