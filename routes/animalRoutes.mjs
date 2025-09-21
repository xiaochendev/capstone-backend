import express from 'express';

import Mammal from "../models/mammalSchema.mjs";
import Reptile from "../models/reptileSchema.mjs";
import Fish from "../models/fishSchema.mjs";
import Avian from "../models/avianSchema.mjs";

import { mammals, reptiles, fishes, avians } from '../data/data.mjs';

const router = express.Router();


// @route   GET /seed
// @desc    Seed database with initial data for all animals (mammals, reptiles, fish)
// @access  Private (should be restricted in production)
router
  .route('/seed')
  .get(async (req, res) => {
    try {
      // Clear existing data first (optional)
      await Promise.all([
        Mammal.deleteMany({}),
        Reptile.deleteMany({}),
        Fish.deleteMany({}),
        Avian.deleteMany({}),
      ]);
    
      // Seed data
      await Promise.all([
        Mammal.create(mammals),
        Reptile.create(reptiles),
        Fish.create(fishes),
        Avian.create(avians),
      ]);
    
      res.send('All animal data seeded successfully');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Seeding failed');
    }
  });
// @route   GET /
// @desc    Get all animals across mammals, reptiles, and fish, avians in db
// @access  Public
router
    .route("/")
    .get(async (req, res) => {
        try {
          const [mammals, reptiles, fishes, avians] = await Promise.all([
            // Mammal.find({}), // return mongoose document, add .lean() get back JS obj
            Mammal.find({}).lean(),
            Reptile.find({}).lean(),
            Fish.find({}).lean(),
            Avian.find({}).lean(),
          ]);
          
          // Add a `route` property to each animal
          const taggedMammals = mammals.map((animal) => ({ ...animal, route: "mammals" }));
          const taggedReptiles = reptiles.map((animal) => ({ ...animal, route: "reptiles"}));
          const taggedFishes = fishes.map((animal) => ({ ...animal, route: "fishes" }));
          const taggedAvians = avians.map((animal) => ({ ...animal, route: "avians" }));

          const allAnimals = [...taggedMammals, ...taggedAvians, ...taggedFishes, ...taggedReptiles];
      
          // res.json(allAvailable);
          res.render("home", {animals: allAnimals })
        } catch (err) {
          console.error(err.message);
          res.status(500).json({ msg: `❌ Error - ${err.message}` });
        }
    });


// @route   GET /available
// @desc    Get all available animals across mammals, reptiles, and fish
// @access  Public
router
    .route("/available")
    .get(async (req, res) => {
        try {
          const [mammals, reptiles, fishes, avians] = await Promise.all([
            Mammal.availableForAdoption().lean(),
            Reptile.availableForAdoption().lean(),
            Fish.availableForAdoption().lean(),
            Avian.availableForAdoption().lean(),
          ]);
          // Add a `route` property to each animal
          const taggedMammals = mammals.map((animal) => ({ ...animal, route: "mammals" }));
          const taggedReptiles = reptiles.map((animal) => ({ ...animal, route: "reptiles"}));
          const taggedFishes = fishes.map((animal) => ({ ...animal, route: "fishes" }));
          const taggedAvians = avians.map((animal) => ({ ...animal, route: "avians" }));

          const allAvailable = [...taggedMammals, ...taggedAvians, ...taggedFishes, ...taggedReptiles];
      
          // res.json(allAvailable);
          res.render("available", { animals: allAvailable });
        } catch (err) {
          console.error(err.message);
          res.status(500).json({ msg: `❌ Error - ${err.message}` });
        }
    });

export default router;