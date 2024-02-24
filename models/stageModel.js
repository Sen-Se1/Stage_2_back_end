const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Affectation = require('./affectationModel');

// Stage Schema
const stageSchema = new mongoose.Schema(
  {
    codeS: {
      type: String,
      unique: [true, 'Le code de stage doit être unique.'],
      required: [true, 'Le code de stage est obligatoire.'],
      minlength: [3, 'Le code de stage trop court'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Le type de stage est obligatoire.'],
    },
    duree: {
      type: Number,
      required: [true, 'La durée de stage est obligatoire.'],
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Middleware to delete associated Affectation documents after removing the Stage document
stageSchema.post(
  "findOneAndDelete",
  asyncHandler(async (doc) => {
    await Affectation.deleteMany({ codeS: doc._id });
  })
);

// Create models based on the schemas
const Stage = mongoose.model("Stage", stageSchema);

// Export the models for use in other modules
module.exports = Stage;