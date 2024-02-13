const mongoose = require("mongoose");

// Affectation Schema
const affectationSchema = new mongoose.Schema(
  {
    cin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Etudiant", // Reference to Edudiant collection
      required: [true, 'Cin required'],
    },
    codeS: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage", // Reference to Stage collection
      required: [true, 'Stage code required'],
    },
    lieuS: {
      type: String,
      required: [true, 'Stage location required'],
      trim: true,
    },
    codeRap: {
      type: String,
      required: [true, 'Rapport code required'],
      minlength: [3, 'Too short rapport code'],
      unique: [true, 'Rapport code must be unique'],
      trim: true,
    },
    dateD: {
      type: Date,
      required: [true, 'Start date required'],
    },
    dateF: {
      type: Date,
      required: [true, 'End date required'],
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Create models based on the schemas
const Affectation = mongoose.model("Affectation", affectationSchema);

// Export the models for use in other modules
module.exports = Affectation;