const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Affectation = require('./affectationModel');

// Etudiant Schema
const etudiantSchema = new mongoose.Schema(
  {
    cin: {
      type: String,
      unique: [true, 'Cin doit être unique.'],
      required: [true, 'Cin est obligatoire.'],
      minlength: [8, 'Cin trop court.'],
      maxlength: [8, 'Cin trop long.'],
    },
    nom: {
      type: String,
      required: [true, 'Le nom est obligatoire.'],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, 'Le prenom est obligatoire.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire."],
      unique: [true, "L'email doit être unique."],
    },
    tel: {
      type: String,
      required: [true, 'Le numéro de téléphone est obligatoire.'],
    },
    codeG: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Groupe", // Reference to Groupe collection
      required: [true, 'Le code de groupe est obligatoire.'],
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Middleware to delete associated Affectation documents after removing the Etudiant document
etudiantSchema.post(
  "findOneAndDelete",
  asyncHandler(async (doc) => {
    await Affectation.deleteMany({ cin: doc._id });
  })
);

// Create model based on the schema
const Etudiant = mongoose.model("Etudiant", etudiantSchema);

// Export the model for use in other modules
module.exports = Etudiant;