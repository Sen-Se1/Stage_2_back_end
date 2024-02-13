const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const isStringAllSpaces = require("../isStringAllSpaces");

exports.addAdminModValidator = [
  check("username")
    .notEmpty()
    .withMessage("Username required")
    .isLength({ min: 3 })
    .withMessage("Too short username")
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers')
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
    .withMessage("Password confirmation required")
    .custom((val, { req }) => {
      if (req.body.password !== val) {
        return Promise.reject(
          new Error(`Password confirmation must be identical to new password `)
        );
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
      array = ["Moderator"];
      if (array.indexOf(val) === -1) {
        return Promise.reject(
          new Error("Role must be one of the following : 'Moderator'")
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getByIdAdminModValidator = [
  check("id").isMongoId().withMessage("Invalid moderator id format"),

  validatorMiddleware,
];

exports.updateAdminModValidator = [
  check("id").isMongoId().withMessage("Invalid moderator id format"),

  check("username")
    .notEmpty()
    .withMessage("Username required")
    .isLength({ min: 3 })
    .withMessage("Too short username")
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers')
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
      array = ["Moderator"];
      if (array.indexOf(val) === -1) {
        return Promise.reject(
          new Error("Role must be one of the following : 'Moderator'")
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateAdminModPwdValidator = [
  check("id").isMongoId().withMessage("Invalid moderator id format"),

  check("password")
    .notEmpty()
    .withMessage("New password required")
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
    .withMessage("Password confirmation required")
    .custom((val, { req }) => {
      if (req.body.password !== val) {
        return Promise.reject(
          new Error(`Password confirmation must be identical to new password `)
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteAdminModValidator = [
  check("id").isMongoId().withMessage("Invalid moderator id format"),

  validatorMiddleware,
];
