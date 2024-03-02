const mongoose = require("mongoose");

// Affectation Schema
const affectationSchema = new mongoose.Schema(
  {
    cin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Etudiant", // Reference to Edudiant collection
      required: [true, 'CIN est obligatoire.'],
    },
    codeS: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage", // Reference to Stage collection
      required: [true, "Le code de stage est obligatoire."],
    },
    lieuS: {
      type: String,
      required: [true, 'Le lieu de stage est obligatoire.'],
      trim: true,
    },
    codeRap: {
      type: Number,
      required: [true, 'Le code de rapport est obligatoire.'],
      unique: [true, 'Le code de rapport doit être unique.'],
    },
    dateD: {
      type: Date,
      required: [true, 'La date de début est obligatoire.'],
    },
    dateF: {
      type: Date,
      required: [true, 'La date de fin est obligatoire.'],
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