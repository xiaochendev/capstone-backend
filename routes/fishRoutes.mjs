import express from "express";
import Fish from "../models/fishSchema.mjs";

const router = express.Router();
import { fishes } from '../data/data.mjs'; 

// @route GET /api/fishes
// @desc Get all fishes
// @access Public
router
  .route("/")
  .get(async (req, res) => {
    // let getFish = await Fish.find({});
    // res.json(getFish);
    try {
      let fishes = await Fish.find({});
      const formData = req.flash("formData")[0] || {};

    // res.json(allFishes);
      res.render("fishes", { fishes, formData });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}`});
    }
  })
  // @route POST /api/fishes
  // @desc Create a new fish
  // @access Public
  .post(async (req, res) => {
    // let newFish = await Fish.create(req.body);
    // res.json(newFish);
    try {
      const errors = [];
      const {
        name,
        species,
        age,
        waterType,
        habitat,
        maxDepth,
        isAdopted,
        adoptionDate,
        adopterName,
        adopterContact,
        arrivalDate,
        healthStatus,
        vaccinated,
        microchipId
      } = req.body;

      // Parse habitat (string -> array)
      const parsedHabitat = habitat
        ? habitat.split(",").map(h => h.trim().toLowerCase()).filter(Boolean)
        : [];

      const validHabitats = ["reef", "open ocean", "river", "lake", "stream", "deep sea"];
      const validWaterTypes = ["freshwater", "saltwater", "brackish"];

      // Validations
      if (!name || name.trim() === "") errors.push("Name is required.");
      if (!waterType || !validWaterTypes.includes(waterType)) errors.push("Invalid or missing water type.");
      if (parsedHabitat.length === 0) errors.push("At least one habitat is required.");
      if (!parsedHabitat.every(h => validHabitats.includes(h))) {
        const invalid = parsedHabitat.filter(h => !validHabitats.includes(h));
        errors.push(`Invalid habitat(s): ${invalid.join(", ")}`);
      }
      if (age && age < 0) errors.push("Age cannot be negative.");
      if (maxDepth && maxDepth < 0) errors.push("Max depth cannot be negative.");

      // Handle errors by re-direct the form
      if (errors.length > 0) {
        req.flash("error", errors);
        req.flash("formData", req.body);
        return res.redirect("/api/fishes");
      }

      // Construct newFishesData for re-redirect if needed
      const newFishesData = {
        name,
        species,
        age,
        waterType,
        habitat: parsedHabitat,
        maxDepth,
        isAdopted: isAdopted === "on",
        adoptionDate,
        adopterName,
        adopterContact,
        arrivalDate,
        healthStatus,
        vaccinated: vaccinated === "on",
        microchipId
      };

      // Perform Action
      await Fish.create(newFishesData);

      // Return Response
      // res.json(newFishes);
      req.flash("Success", "Reptile created successfully");
      res.redirect(`/api/fishes`);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message }`});
    }
  });

// @route GET /api/fishes/:id
// @desc Get a fish by id
// @access Public
router
  .route("/:id")
  .get(async (req, res) => {
    // let fish = await Fish.findById(req.params.id);
    // res.json(fish);
    try {
      const fish = await Fish.findById(req.params.id);
      
      if (!fish){
        return res.status(404).render('404', { msg: 'Fish not found' }); 
      }
      // res.json(fish);
      res.render('fish', { fish: fish });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}`});
    }
  })
  // @route PUT /api/fishes/:id
  // @desc Update a fish by id
  // @access Public
  .put(async (req, res) => {
    // let updateFish = await Fish.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    // });
    // res.json(updateFish);
    try {
      const errors = [];
      const {
        name,
        species,
        age,
        waterType,
        habitat,
        maxDepth,
        isAdopted,
        adoptionDate,
        adopterName,
        adopterContact,
        arrivalDate,
        healthStatus,
        vaccinated,
        microchipId
      } = req.body;

      // Parse habitat (string -> array)
      const parsedHabitat = habitat
        ? habitat.split(",").map(h => h.trim().toLowerCase()).filter(Boolean)
        : [];

      const validHabitats = ["reef", "open ocean", "river", "lake", "stream", "deep sea"];
      const validWaterTypes = ["freshwater", "saltwater", "brackish"];

      // Validations
      if (!name || name.trim() === "") errors.push("Name is required.");
      if (!waterType || !validWaterTypes.includes(waterType)) errors.push("Invalid or missing water type.");
      if (parsedHabitat.length === 0) errors.push("At least one habitat is required.");
      if (!parsedHabitat.every(h => validHabitats.includes(h))) {
        const invalid = parsedHabitat.filter(h => !validHabitats.includes(h));
        errors.push(`Invalid habitat(s): ${invalid.join(", ")}`);
      }
      if (age && age < 0) errors.push("Age cannot be negative.");
      if (maxDepth && maxDepth < 0) errors.push("Max depth cannot be negative.");

      // Handle errors by re-direct the form
      if (errors.length > 0) {
        req.flash("error", errors);
        req.flash("formData", req.body);
        return res.redirect(`/api/fishes/${req.params.id}`);
      }

      // Construct newFishesData for re-direct if needed
      const updatedFishesData = {
        name,
        species,
        age,
        waterType,
        habitat: parsedHabitat,
        maxDepth,
        isAdopted: isAdopted === "on",
        adoptionDate,
        adopterName,
        adopterContact,
        arrivalDate,
        healthStatus,
        vaccinated: vaccinated === "on",
        microchipId
      };

      // Perform Action
      await Fish.findByIdAndUpdate(
        req.params.id, 
        updatedFishesData, 
        { new: true }
      );

      // Return Response
      // res.json(newFishes);
      req.flash("success", "Reptile updated successfully");
      res.redirect(`/api/fishes/${req.params.id}`);
    } catch (error) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}` });
    }

  })
  // @route DELETE /api/fishes/:id
  // @desc Delete a fish by id
  // @access Public
  .delete(async (req, res) => {
    try {
      let deletedFish = await Fish.findByIdAndDelete(req.params.id);

    // if (!deletedFish) res.json({ msg: "err doesnt exist" });
    // else res.json(deletedFish);
      req.flash("success", "Fish Deleted successfully.");
      res.redirect('/api/fishes/');
    } catch (error) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}` });
    }
  });


export default router;