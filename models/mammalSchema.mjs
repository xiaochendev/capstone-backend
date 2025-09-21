import mongoose from "mongoose";

const mammalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String },
    age: { type: Number, min: 0, default: 0},
    habitat: {
      type: [String],           // use array instead single str cuz live multiple habitat
      enum: [                    // Use of enum for habitat ensures valid input.
        "tropical",
        "desert",
        "domesticated",
        "prairie",
        "temperate",
        "polar",
        "aquatic",
        "grassland",
        "forest", 
        "wetland", 
        "urban", 
        "coastal", 
        "mountain", 
        "tundra",
      ],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one habitat must be specified",
        },
      },
      isAdopted: { type: Boolean, default: false },
      adoptionDate: { type: Date },
      adopterName: { type: String },
      adopterContact: { type: String },
      arrivalDate: { type: Date, default: Date.now },
      healthStatus: { type: String, default: "unknown" },
      vaccinated: { type: Boolean, default: false },
      microchipId: { type: String },
  }, 
  { timestamps: true },
);

// Create an Index for faster querying    ---- In production, should remove index. otherwise it kept re-creating index everytime u enter db
mammalSchema.index({ species: 1 });
mammalSchema.index({ habitat: 1 });


// Create status methods to get Avg age of all animals in the adoptionCenter
mammalSchema.statics.inHabitat = function (habitat) {
  return this.find({ habitat: habitat });
};

// create a static method to get all available animals for adoption
mammalSchema.statics.availableForAdoption = function () {
  return this.find({ isAdopted: false });
};

// Instance method - used on an INSTANCE of the collection    // for finding other mammals in the same habitat.
mammalSchema.methods.getOthersInHab = function (cb) {
  return mongoose.model("Mammal").find({ habitat: this.habitat });
};

// Virtual Value - wanna re-calculat      // classify mammals older than 10
mammalSchema.virtual("old").get(function () {
  return this.age > 10;
});

// Setting virtuals to true
mammalSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Mammal", mammalSchema);