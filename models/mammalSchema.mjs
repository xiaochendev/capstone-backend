import mongoose from "mongoose";

const mammalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number, min: 0, required: true },
  habitat: {
    type: String,
    enum: {
      values: [
        "tropical",
        "desert",
        "domesticated",
        "prarie",
        "temperate",
        "polar",
        "aquatic",
      ],
      message: "{VALUE} is not supported",
    },
    required: true,
  },
});

// Create an Index for faster querying    ---- In production, should remove index. otherwise it kept re-creating index everytime u enter db
mammalSchema.index({ species: 1 });
mammalSchema.index({ habitat: 1 });

// Create status methods to get Avg age of all animals in the adoptionCenter
mammalSchema.statics.inHabitat = function (habitat) {
  return this.find({ habitat: habitat });
};

// Instance method - used on an INSTANCE of the collection
mammalSchema.methods.getOthersInHab = function (cb) {
  return mongoose.model("Mammal").find({ habitat: this.habitat });
};

// Virtual Value - wanna re-calculat
mammalSchema.virtual("old").get(function () {
  return this.age > 10;
});

// Setting virtuals to true
mammalSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Mammal", mammalSchema);