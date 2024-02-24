const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est obligatoire."],
      minlength: [3, "Le nom d'utilisateur trop court."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Adresse e-mail est obligatoire."],
      unique: [true, "Adresse e-mail doit être unique."],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire.'],
      minlength: [8, 'Le mot passe trop court.'],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    role: {
      type: String,
      required: [true, 'Le rôle est obligatoire.'],
      enum: ['ADMIN', 'MODERATOR'],
      default: 'MODERATOR',
      trim: true,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Create models based on the schemas
const User = mongoose.model("User", userSchema);

// Export the models for use in other modules
module.exports = User;