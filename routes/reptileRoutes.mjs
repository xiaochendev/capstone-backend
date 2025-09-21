import express from "express";
import Reptile from "../models/reptileSchema.mjs";

const router = express.Router();
import { reptiles } from '../data/data.mjs'; 

// @route GET /api/reptiles
// @desc Get all reptiles
// @access Public
router
  .route("/")
  .get(async (req, res) => {
    try {
      let reptiles = await Reptile.find({});
      const formData = req.flash("formData")[0] || {};

    // res.json(getReptile);
      res.render("reptiles", { reptiles, formData });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}`});
    }
  })
  // @route POST /api/reptiles
  // @desc Create a reptile
  // @access Public
  .post(async (req, res) => {
    // let newReptile = await Reptile.create(req.body);
    // res.json(newReptile);
    try {
      const errors = [];
      const {
        name,
        species,
        age,
        habitat,
        maxElevation,
        isVenomous,
        isAdopted,
        adoptionDate,
        adopterName,
        adopterContact,
        arrivalDate,
        healthStatus,
        vaccinated,
        microchipId,
      } = req.body;

      // Parse habitat into array
      const parsedHabitat = habitat
        ? habitat.split(",").map((h) => h.trim().toLowerCase()).filter(Boolean)
        : [];
      const validHabitats = [
        "desert", "forest", "wetland", "grassland", "tropical", "aquatic"
      ];
      const habitatIsValid = parsedHabitat.every((h) => validHabitats.includes(h));
      
      // validations
      if (!name || name.trim() === "") errors.push("Name is required.");
      if (parsedHabitat.length === 0) errors.push("At least one habitat is required.");
      if (!habitatIsValid) {
        const invalid = parsedHabitat.filter(h => !validHabitats.includes(h));
        errors.push(`Invalid habitat(s): ${invalid.join(", ")}`);
      }
      if (age && age < 0) errors.push("Age cannot be negative.");
      if (maxElevation && maxElevation < 0) errors.push("Max elevation cannot be negative.");

      if (errors.length > 0) {
        req.flash("error", errors);
        req.flash('formData', req.body);
        return res.redirect("/api/reptiles");
      }

      // Perform Action
      // let newReptile = await Reptile.create(req.body);
      const newReptileData = {
        name,
        species,
        age,
        habitat: parsedHabitat,
        maxElevation,
        isVenomous: isVenomous === "on",
        isAdopted: isAdopted === "on",
        adoptionDate,
        adopterName,
        adopterContact,
        arrivalDate,
        healthStatus,
        vaccinated: vaccinated === "on",
        microchipId,
      };

      await Reptile.create(newReptileData);

      // Return Response
      // res.json(newReptile);
      req.flash("success", "Reptile created successfully");
      res.redirect(`/api/reptiles`);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message }`});
    }
  });

// @route GET /api/reptiles/:id
// @desc Get a reptile by id
// @access Public
router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const reptile = await Reptile.findById(req.params.id);
      
      if (!reptile){
        return res.status(404).render('404', { msg: 'Reptile not found' }); 
      }
      // res.json(reptile);
      res.render('reptile', { reptile: reptile });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}`});
    }
  })
  // @route UPDATE /api/reptiles/:id
  // @desc Update a reptile by id
  // @access Public
  .put(async (req, res) => {
    // let updateReptile = await Reptile.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    // });
    // res.json(updateReptile);
    try {
      const errors = [];
      const {
        name,
        species,
        age,
        habitat,
        maxElevation,
        isVenomous,
        isAdopted,
        adoptionDate,
        adopterName,
        adopterContact,
        arrivalDate,
        healthStatus,
        vaccinated,
        microchipId,
      } = req.body;

      // Parse habitat into array
      const parsedHabitat = habitat
        ? habitat.split(",").map((h) => h.trim().toLowerCase()).filter(Boolean)
        : [];
      const validHabitats = [
        "desert", "forest", "wetland", "grassland", "tropical", "aquatic"
      ];
      const habitatIsValid = parsedHabitat.every((h) => validHabitats.includes(h));
      
      // validations
      if (!name || name.trim() === "") errors.push("Name is required.");
      if (parsedHabitat.length === 0) errors.push("At least one habitat is required.");
      if (!habitatIsValid) {
        const invalid = parsedHabitat.filter(h => !validHabitats.includes(h));
        errors.push(`Invalid habitat(s): ${invalid.join(", ")}`);
      }
      if (age && age < 0) errors.push("Age cannot be negative.");
      if (maxElevation && maxElevation < 0) errors.push("Max elevation cannot be negative.");

      if (errors.length > 0) {
        req.flash("error", errors);
        req.flash('formData', req.body);
        return res.redirect(`/api/reptiles/${req.params.id}`);
      }

      // Perform Action
      // let newReptile = await Reptile.create(req.body);
      const updatedReptileData = {
        name,
        species,
        age: age ? Number(age) : undefined,
        habitat: parsedHabitat,
        maxElevation,
        isVenomous: isVenomous === "on",
        isAdopted: isAdopted === "on",
        adoptionDate: adoptionDate || undefined,
        adopterName,
        adopterContact,
        arrivalDate,
        healthStatus,
        vaccinated: vaccinated === "on",
        microchipId,
      };

      const updatedReptile = await Reptile.findByIdAndUpdate(
        req.params.id,
        updatedReptileData,
        { new: true}
      );

      // Return Response
      // res.json(newReptile);
      req.flash("success", "Reptile updated successfully");
      res.redirect(`/api/reptiles/${req.params.id}`);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}` });
    }
  })
  // @route DELETE /api/reptiles/:id
  // @desc Delete a reptile by id
  // @access Public
  .delete(async (req, res) => {
    try {
      let deletedReptile = await Reptile.findByIdAndDelete(req.params.id);

      // if (!deletedReptile) res.json({ msg: "err doesnt exist" });
      // else res.json(deletedReptile);
      req.flash("success", "Reptile Deleted successfully.");
      res.redirect('/api/reptiles/');
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}` });
    }
  });


export default router;