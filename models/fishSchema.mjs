import mongoose from "mongoose";

const fishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String },
    age: { type: Number, min: 0, default: 0 },
    waterType: {
      type: String,
      enum: {
        values: ["freshwater", "saltwater", "brackish"],
        message: "{VALUE} is not a valid water type",
      },
      required: true,
    },
    habitat: {
      type: [String],       // Make habitat an array of strings, not a single string.cuz Fish often occupy multiple habitats (e.g., river and lake
      enum: ["reef", "open ocean", "river", "lake", "stream", "deep sea"],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one habitat must be specified",
      },
    },
    // Optional
    maxDepth: { type: Number, min: 0 },
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

fishSchema.statics.availableForAdoption = function () {
  return this.find({ isAdopted: false });
};

export default mongoose.model("Fish", fishSchema);