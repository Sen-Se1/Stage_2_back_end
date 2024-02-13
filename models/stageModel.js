const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Affectation = require('./affectationModel');

// Stage Schema
const stageSchema = new mongoose.Schema(
  {
    codeS: {
      type: String,
      unique: [true, 'Stage code must be unique'],
      required: [true, 'Stage code required'],
      minlength: [3, 'Too short stage code'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Stage type required'],
    },
    duree: {
      type: Number,
      required: [true, 'Stage duration required'],
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