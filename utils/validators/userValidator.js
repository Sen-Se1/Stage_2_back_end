const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { isStringAllSpaces } = require("../customValidator");
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");

exports.registerValidator = [
  check("username")
    .notEmpty()
    .withMessage("Username required")
    .isLength({ min: 3 })
    .withMessage("Too short username")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Username must not be all spaces"));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isStrongPassword({
      // minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "The password is not strong, and must contain 'one lowercase letter, one uppercase letter, one number, and one symbol'"
    ),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirmation")
    .custom(async (val, { req }) => {
      // 1) Verify password confirm
      if (val !== req.body.password) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("role")
    .notEmpty()
    .withMessage("Role required")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Role must not be all spaces"));
      }
      return true;
    })
    .custom((val) => {
      array = ["Admin", "Moderator"];
      if (array.indexOf(val) === -1) {
        return Promise.reject(
          new Error("Role must be one of the following : 'Admin', 'Moderator'")
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password required"),

  validatorMiddleware,
];

exports.resetPasswordValidator = [

  check("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isStrongPassword({
      // minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "The new password is not strong, and must contain 'one lowercase letter, one uppercase letter, one number, and one symbol'"
    ),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirmation")
    .custom(async (val, { req }) => {
      // 1) Verify password confirm
      if (val !== req.body.password) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getProfileValidator = [
  check("id").isMongoId().withMessage("Invalid profile id format"),

  validatorMiddleware,
];

exports.updateProfileValidator = [
  check("id").isMongoId().withMessage("Invalid profile id format"),

  check("username")
    .notEmpty()
    .withMessage("Username required")
    .isLength({ min: 3 })
    .withMessage("Too short username")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Username must not be all spaces"));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("You must enter the password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error(`There is no profile for this id : ${req.params.id}`);
      }
      const isCorrectPassword = await bcrypt.compare(
        val,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateProfilePwdValidator = [
  check("id").isMongoId().withMessage("Invalid profile id format"),

  check("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),

  check("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .isStrongPassword({
      // minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "The new password is not strong, and must contain 'one lowercase letter, one uppercase letter, one number, and one symbol'"
    ),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirmation")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error(`There is no profile for this id : ${req.params.id}`);
      }
      // 1) Verify password confirm
      if (val !== req.body.password) {
        throw new Error("Password Confirmation incorrect");
      }
      // 2) Verify current password
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      return true;
    }),

  validatorMiddleware,
];
