const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Etudiant = require("./etudiantModel");
const Affectation = require('./affectationModel');

// Groupe Schema
const groupeSchema = new mongoose.Schema(
  {
    codeG: {
      type: String,
      required: [true, "Le code de groupe est obligatoire."],
      minlength: [3, "Le code de groupe trop court."],
      unique: [true, "Le code de groupe doit être unique."],
      trim: true,
    },
    libelle: {
      type: String,
      required: [true, "La libelle de groupe est obligatoire."],
      trim: true,
    },
    codeD: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", // Reference to Department collection
      required: [true, "Le code de département est obligatoire."],
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Middleware to delete associated Etudiant and Affectation documents after removing the Groupe document
groupeSchema.post(
  "findOneAndDelete",
  asyncHandler(async (doc) => {
    const etudiants = await Etudiant.find({ codeG: doc._id });
    const etudiantIds = etudiants.map(etudiant => etudiant._id);
    await Etudiant.deleteMany({ codeG: doc._id });
    await Affectation.deleteMany({ cin: { $in: etudiantIds } });
  })
);

// Create models based on the schemas
const Groupe = mongoose.model("Groupe", groupeSchema);

// Export the models for use in other modules
module.exports = Groupe;
