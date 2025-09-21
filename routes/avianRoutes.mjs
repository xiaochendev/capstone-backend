import express from "express";
import Avian from "../models/avianSchema.mjs";

const router = express.Router();
import { avians } from '../data/data.mjs'; 


// @route GET /api/avians
// @desc Get all avians
// @access Public
router
  .route("/")
  .get(async (req, res) => {
    try {
      let allAvians = await Avian.find({});
      const formData = req.flash("formData")[0] || {};

    // res.json(allAvians);
      res.render("avians", { avians: allAvians, formData });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}`});
    }
  })
  // @route POST /api/avian
  // @desc Create a new avian
  // @access Public
  .post(async (req, res) => {
    // let newAvains = await Avian.create(req.body);
    // res.json(newAvains);
    try {
      const errors = [];
      // Destructure incoming form data
      let {
        name,
        species,
        breed,
        domesticated,
        age,
        habitat,
        maxElevation,
        isAdopted,
        adoptionDate,
        adopterName,
        adopterContact,
        arrivalDate,
        healthStatus,
        vaccinated,
        microchipId
      } = req.body;

      // normalized checkboxes
      domesticated = domesticated === 'on';
      isAdopted = isAdopted === 'on';
      vaccinated = vaccinated === 'on';

      // parse habitat string into array if exists 
      const habitatArray = habitat
        ? habitat.split(',').map(h => h.trim().toLowerCase()).filter(Boolean)
        : [];

      // validate required field
      if (!name || name.trim() === '') errors.push('Name is required.');
      if (habitatArray.length === 0) errors.push('At least one habitat must be specified.');

      // Validate breed required if domesticated
      if (domesticated && (!breed || breed.trim() === '')) {
        errors.push('Breed is required if the avian is domesticated.');
      }

      // Validate age and maxElevation
      if (age && age < 0) errors.push('Age cannot be negative.');
      if (maxElevation && maxElevation < 0) errors.push('Max elevation cannot be negative.');

      // Validate adoption info if adopted
      if (isAdopted) {
        if (!adoptionDate) errors.push('Adoption date is required if the avian is adopted.');
        if (!adopterName || adopterName.trim() === '') errors.push('Adopter name is required if the avian is adopted.');
      }

      if (errors.length > 0) {
        req.flash('error', errors);
        req.flash('formData', req.body);    
        return res.redirect('/api/avians'); 
      }

      // Perform Action
      // let newAvian = await Avian.create(req.body);
      const newAvianData = {
        name: name.trim(),
        species: species?.trim() || '',
        breed: domesticated ? breed.trim() : undefined,
        domesticated,
        age: age ? Number(age) : undefined,
        habitat: habitatArray,
        maxElevation: maxElevation ? Number(maxElevation) : 0,
        isAdopted,
        adoptionDate: adoptionDate || undefined,
        adopterName: adopterName?.trim() || '',
        adopterContact: adopterContact?.trim() || '',
        arrivalDate: arrivalDate || undefined,
        healthStatus: healthStatus?.trim() || 'unknown',
        vaccinated,
        microchipId: microchipId?.trim() || ''
      };

      // Create and save Avian
      const newAvian = await Avian.create(newAvianData);

      // Return Response
      // res.json(newAvian);
      req.flash("success", "Avian created successfully");
      res.redirect(`/api/avians`);

    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message }`});
    }
  });

// @route GET /api/avians/:id
// @desc Geta avian by id
// @access Public
router
  .route("/:id")
  .get(async (req, res) => {
    // let avain = await Avian.findById(req.params.id);
    // res.json(avain);
    try {
      const avian = await Avian.findById(req.params.id);
      
      if (!avian){
        return res.status(404).render('404', { msg: 'Avian not found' }); 
      }
      // res.json(avian);
      res.render('avian', { avian: avian });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}`});
    }
  })
  // @route PUT /api/avians/:id
  // @desc Update a avian by id
  // @access Public
  .put(async (req, res) => {
    // let updateAvian = await Avian.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    // });
    // res.json(updateAvian);

    try {
      const errors = [];
      // Destructure incoming form data
      let {
        name,
        species,
        breed,
        domesticated,
        age,
        habitat,
        maxElevation,
        isAdopted,
        adoptionDate,
        adopterName,
        adopterContact,
        arrivalDate,
        healthStatus,
        vaccinated,
        microchipId
      } = req.body;

      // normalized checkboxes
      domesticated = domesticated === 'on';
      isAdopted = isAdopted === 'on';
      vaccinated = vaccinated === 'on';

      // parse habitat string into array if exists 
      const habitatArray = habitat
        ? habitat.split(',').map(h => h.trim().toLowerCase()).filter(Boolean)
        : [];

      // validate required field
      if (!name || name.trim() === '') errors.push('Name is required.');
      if (habitatArray.length === 0) errors.push('At least one habitat must be specified.');

      // Validate breed required if domesticated
      if (domesticated && (!breed || breed.trim() === '')) {
        errors.push('Breed is required if the avian is domesticated.');
      }

      // Validate age and maxElevation
      if (age && age < 0) errors.push('Age cannot be negative.');
      if (maxElevation && maxElevation < 0) errors.push('Max elevation cannot be negative.');

      // Validate adoption info if adopted
      if (isAdopted) {
        if (!adoptionDate) errors.push('Adoption date is required if the avian is adopted.');
        if (!adopterName || adopterName.trim() === '') errors.push('Adopter name is required if the avian is adopted.');
      }

      if (errors.length > 0) {
        req.flash('error', errors);
        req.flash('formData', req.body);    
        return res.redirect(`/api/avians/${req.params.id}`); 
      }

      // Perform Action
      const updatedAvianData = {
        name,
        species,
        breed,
        domesticated,
        age: age ? Number(age) : undefined,
        habitat: habitatArray,
        maxElevation: maxElevation ? Number(maxElevation) : 0,
        isAdopted,
        adoptionDate: adoptionDate || undefined,
        adopterName,
        adopterContact,
        arrivalDate: arrivalDate || undefined,
        healthStatus,
        vaccinated,
        microchipId,
      };

      // Create and save Avian
      const updateAvian = await Avian.findByIdAndUpdate(
        req.params.id,
        updatedAvianData,
        { new: true}
      );

      // Return Response
      // res.json(newAvian);
      req.flash("success", "Avian updated successfully");
      res.redirect(`/api/avians/${req.params.id}`);
    } catch (error) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}` });
    }
  })
  // @route DELETE /api/avians/:id
  // @desc Delete a avian by id
  // @access Public
  .delete(async (req, res) => {
    try {
      let deletedAvian = await Avian.findByIdAndDelete(req.params.id);

      // if (!deletedAvian) res.json({ msg: "err doesnt exist" });
      // else res.json(deletedAvian);
      req.flash("success", "Avian Deleted successfully.");
      res.redirect('/api/avians/');
    } catch (error) {
      console.error(error.message);
      res.status(500).json({msg: `❌ Error - ${error.message}`})
    }
  });

export default router;