// imports
import express from 'express';
import dotenv from 'dotenv';
import ejs from 'ejs';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import globalErr from './middlewares/globalErr.mjs';
import log from './middlewares/loggingMiddleware.mjs';
import connectDB from './db/conn.mjs';
import mammalRoutes from './routes/mammalRoutes.mjs';
import avianRoutes from './routes/avianRoutes.mjs';
import fishRoutes from './routes/fishRoutes.mjs';
import reptileRoutes from './routes/reptileRoutes.mjs';
import animalRoutes from './routes/animalRoutes.mjs';

// setup
dotenv.config()
const app = express();
const PORT = process.env.PORT || 3001;


(async () => {
  try {
    // DB connection
    await connectDB(); 

    // ejs settings
    app.set("view engine", "ejs");
    app.set("views", "./views");

    // middlewares
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(log);

    app.use(methodOverride('_method'));         // Enable PATCH/DELETE via HTML Forms, use ?method=PATCH or ?method=DELETE.
    
    // Setup sessions
    app.use(session({
      secret: "secret-key",   // can use env variables
      resave: false,
      saveUninitialized: false    // won't save unless you add data to it
    }));

    // connect-flash setting
    app.use(flash());
    app.use((req, res, next) => {
      res.locals.success = req.flash('success');
      res.locals.error = req.flash('error');
      next();
    });

    // static style
    app.use(express.static('./styles'));

    // routes
    app.use('/api/mammals', mammalRoutes);
    app.use('/api/avians', avianRoutes);
    app.use('/api/fishes', fishRoutes);
    app.use('/api/reptiles', reptileRoutes);
    app.use('/', animalRoutes);

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

