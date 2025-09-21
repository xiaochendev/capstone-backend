import express from "express";
import Mammal from "../models/mammalSchema.mjs";
const router = express.Router();
import { mammals } from '../data/data.mjs'; 

// //@route   GET /api/mammals/seed
// //@desc    Seed database with initial mammal data (usually disabled)
// //@access  Private (should be restricted in production)
// router
//   .route('/seed')
//   .get(async (req, res)=>{
//     try {
//       await Mammal.deleteMany({});     //optional just to clear out database before reloading new data, ensure data not repeated.
//       await Mammal.create(mammals);     //mongoose   
//       // await Mammal.insertMany(mammals);     //mongoDB driver way

//       res.send('data succesfully seeded');
//     } catch (error) {
//       console.error(error.message);
//     }
//   })

// @route   GET /api/mammals/habitat/:hab
// @desc    Get mammals by habitat
// @access  Public
router.get("/habitat/:hab", async (req, res) => {
  let result = await Mammal.inHabitat(req.params.hab);

  res.json(result);
});

// @route   GET /api/mammals/eco/:id
// @desc    Get mammals with similar habitat as mammal by ID
// @access  Public
router.get("/eco/:id", async (req, res) => {
  try {
    let animal = await Mammal.findById(req.params.id);

    let result = await animal.getOthersInHab();

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: `❌ Error - ${err.message}` });
  }
});

// @route   GET /api/mammals/avaiable
// @desc    Get all mammals available for adoption
// @access  Public
router
  .route("/avaiable")
  .get(async (req, res) => {
    try {
      const avaiableMammals = await Mammal.avaiableForAdoption();
      res.json(avaiableMammals);
    } catch (error) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}` });
    }
  })


// @route   POST /api/mammals
// @desc    Create a new mammal
// @access  Public (or Private if add auth)
router
  .route("/")
  .post(async (req, res) => {
    try {
      const errors = [];

      // fields geting from input
      const {
        name,
        species,
        age,
        habitat,
        arrivalDate,
        healthStatus,
        vaccinated,
        microchipId,
        isAdopted,
        adoptionDate,
        adopterName,
        adopterContact
      } = req.body;

      // Parse habitat string into array if it exists
      // if (req.body.habitat) {
      //   req.body.habitat = req.body.habitat.split(",").map(h => h.trim());
      // } else {
      //   req.body.habitat = [];
      // }
      const parsedHabitat = habitat ? habitat.split(",").map(h=> h.trim().toLowerCase()).filter(Boolean) : [];
      const validHabitats = [
        "tropical", "desert", "domesticated", "prairie", "temperate", "polar",
        "aquatic", "grassland", "forest", "wetland", "urban", "coastal", "mountain", "tundra"
      ];
      const habitatIsValid = parsedHabitat.every(h => validHabitats.includes(h));

      // validate
      if (!name || name.trim() == "") errors.push("Name is required");
      if (parsedHabitat.length == 0)  errors.push("At least one habitat is required");
      if (!habitatIsValid) errors.push(`Invalid habitat(s): ${parsedHabitat.filter(h=> !validHabitats.includes(h)).join(", ")}`);
      if (age && age < 0) errors.push('Age cannot be Negative');

      if (errors.length > 0) {
        req.flash("error", errors);
        req.flash("formData", req.body); // preserve user input
        return res.redirect(`/api/mammals`);
      } 

      // // Perform Action
      // let newMammal = await Mammal.create(req.body);
      // Return Response
      // res.json(newMammal);

      // Normalize checkboxes
      const newMammalData = {
        name,
        species,
        age: age ? Number(age) : undefined,
        habitat: parsedHabitat,
        arrivalDate: arrivalDate || undefined,
        healthStatus,
        vaccinated: vaccinated === "on",
        microchipId,
        isAdopted: isAdopted === "on",
        adoptionDate: adoptionDate || undefined,
        adopterName,
        adopterContact,
      };

      // created return response
      await Mammal.create(newMammalData);
      req.flash("success", "Mammal created successfully!");
      res.redirect("/api/mammals");
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}` });
    }
  })
  // @route   GET /api/mammals
  // @desc    Get all mammals
  // @access  Public
  .get(async (req, res) => {
    try {
      const mammals = await Mammal.find({});
      const formData = req.flash("formData")[0] || {};

      // res.json(allMammals);
      res.render("mammals", { mammals, formData });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}` });
    }
  });


router
  .route("/:id")
  // @route   GET /api/mammals/:id
  // @desc    Get a mammal by ID
  // @access  Public (or Private if add auth)
  .get(async (req, res) => {
    try {
      const mammal = await Mammal.findById(req.params.id);

      if (!mammal){
        return res.status(404).render('404', { msg: 'Mammal not found' }); // optional 404 page
      }

      res.render('mammal', { mammal: mammal });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}`});
    }
  })
  // @route   PUT /api/mammals/:id
  // @desc    Update a mammal by ID
  // @access  Public (or Private if add auth)
  .put(async (req, res) => {
    try {
      // let updatedMammal = await Mammal.findByIdAndUpdate(
      //   req.params.id,
      //   req.body,
      //   { new: true } // Option to allow newly updated object to be sent back
      // );

      // res.json(updatedMammal);
      const errors = [];
      const {
        name,
        species,
        age,
        habitat,
        arrivalDate,
        healthStatus,
        vaccinated,
        microchipId,
        isAdopted,
        adoptionDate,
        adopterName,
        adopterContact
      } = req.body;

      // parse habitat
      const parsedHabitat = habitat
        ? habitat.split(",").map(h => h.trim().toLowerCase()).filter(Boolean)
        : [];
      
      const validHabitats = [
          "tropical", "desert", "domesticated", "prairie", "temperate", "polar",
          "aquatic", "grassland", "forest", "wetland", "urban", "coastal", "mountain", "tundra"
        ];

      const habitatIsValid = parsedHabitat.every(h => validHabitats.includes(h));

      // Validation
      if (!name || name.trim() === "") errors.push("Name is required.");
      if (parsedHabitat.length === 0) errors.push("At least one habitat is required.");
      if (!habitatIsValid) errors.push(`Invalid habitat(s): ${parsedHabitat.filter(h => !validHabitats.includes(h)).join(", ")}`);
      if (age && age < 0) errors.push("Age cannot be negative.");
      if (errors.length > 0) {
        req.flash("error", errors);
        req.flash('formData', req.body);    
        return res.redirect(`/api/mammals/${req.params.id}`);
      }

      const updatedMammalData = {
        name,
        species,
        age: age ? Number(age) : undefined,
        habitat: parsedHabitat,
        arrivalDate: arrivalDate || undefined,
        healthStatus,
        vaccinated: vaccinated === "on",
        microchipId,
        isAdopted: isAdopted === "on",
        adoptionDate: adoptionDate || undefined,
        adopterName,
        adopterContact
      };

      const updatedMammal = await Mammal.findByIdAndUpdate(
        req.params.id,
        updatedMammalData,
        { new: true }
      );

      req.flash("success", "Mammal updated successfully.");
      res.redirect(`/api/mammals/${req.params.id}`);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}` });
    }
  })
  // @route   DELETE /api/mammals/:id
  // @desc    Delete a mammal by ID
  // @access  Public (or Private if add auth)
  .delete(async (req, res) => {
    try {
      let deleteMammal = await Mammal.findByIdAndDelete(req.params.id);

      // res.json(deleteMammal);
      req.flash("success", "Mammal Deleted successfully.");
      res.redirect('/api/mammals/');
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: `❌ Error - ${err.message}` });
    }
  });

export default router;