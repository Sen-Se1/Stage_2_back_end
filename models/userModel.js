const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username required'],
      minlength: [3, 'Too short username'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: [true, 'Email must be unique'],
    },
    password: {
      type: String,
      required: [true, 'Password required'],
      minlength: [8, 'Too short password'],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    role: {
      type: String,
      required: [true, 'Role required'],
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