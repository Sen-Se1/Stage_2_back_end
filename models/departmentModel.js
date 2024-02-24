const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Groupe = require("./groupeModel");
const Etudiant = require("./etudiantModel");
const Affectation = require('./affectationModel');

// Department Schema
const departmentSchema = new mongoose.Schema(
  {
    codeD: {
      type: String,
      required: [true, "Le code de département est obligatoire."],
      minlength: [2, "Le code de département trop court."],
      unique: [true, "Le code de département doit être unique."],
      trim: true,
    },
    libelle: {
      type: String,
      required: [true, "La libelle de département est obligatoire."],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Middleware to delete associated Groupe, Etudiant and Affectation documents after removing the Department document
departmentSchema.post(
  "findOneAndDelete",
  asyncHandler(async (doc) => {
    const groupes = await Groupe.find({ codeD: doc._id });
    const groupeIds = groupes.map(groupe => groupe._id);
    const etudiants = await Etudiant.find({ codeG: { $in: groupeIds } });
    const etudiantIds = etudiants.map(etudiant => etudiant._id);
    await Affectation.deleteMany({ cin: { $in: etudiantIds } });
    await Groupe.deleteMany({ codeD: doc._id });
    await Etudiant.deleteMany({ codeG: { $in: groupeIds } });
  })
);

// Create models based on the schemas
const Department = mongoose.model("Department", departmentSchema);

// Export the models for use in other modules
module.exports = Department;
