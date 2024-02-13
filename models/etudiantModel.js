const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Affectation = require('./affectationModel');

// Etudiant Schema
const etudiantSchema = new mongoose.Schema(
  {
    cin: {
      type: String,
      unique: [true, 'Cin must be unique'],
      required: [true, 'Cin required'],
      minlength: [8, 'Too short cin'],
      maxlength: [8, 'Too long cin'],
    },
    nom: {
      type: String,
      required: [true, 'Last name required'],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, 'First name required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: [true, 'Email must be unique'],
    },
    tel: {
      type: String,
      required: [true, 'Phone number required'],
    },
    codeG: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Groupe", // Reference to Groupe collection
      required: [true, 'Group code required'],
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