import express from "express";
import Avian from "../models/avianSchema.mjs";

const router = express.Router();
import { avians } from '../data/data.mjs'; 


// // seed route, fill db w data; hide seed route, you don't want client to reseed it.
// router
//   .route('/seed')
//   .get(async (req, res)=>{
//     try {
//       await Avian.deleteMany({});     //optional just to clear out database before reloading new data, ensure data not repeated.
//       await Avian.create(avians);     //mongoose   
//       // await Avian.insertMany(avians);     //mongoDB driver way

//       res.send('data succesfully seeded');
//     } catch (error) {
//       console.error(error.message);
//     }
//   })


// Create
router
  .route("/")
  .get(async (req, res) => {
    let getAvains = await Avian.find({});
    res.json(getAvains);
  })
  .post(async (req, res) => {
    let newAvains = await Avian.create(req.body);
    res.json(newAvains);
  });

// Read
router
  .route("/:id")
  .get(async (req, res) => {
    let avain = await Avian.findById(req.params.id);
    res.json(avain);
  })
  .put(async (req, res) => {
    let updateAvian = await Avian.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      
    });

    res.json(updateAvian);
  })
  .delete(async (req, res) => {
    let deletedAvian = await Avian.findByIdAndDelete(req.params.id);

    if (!deletedAvian) res.json({ msg: "err doesnt exist" });
    else res.json(deletedAvian);
  });


export default router;