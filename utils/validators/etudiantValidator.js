const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const isStringAllSpaces = require("../isStringAllSpaces");
const Groupe = require("../../models/groupeModel");

exports.createEtudiantValidator = [
  check("cin")
    .notEmpty()
    .withMessage("Cin required")
    .isLength({ min: 8, max: 8 })
    .withMessage("Cin only 8 numbers required")
    .isInt()
    .withMessage("Cin must be a number")
,

  check("nom")
    .notEmpty()
    .withMessage("Last name required")
    .isAlpha()
    .withMessage("Last name must contain only letters")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Last name must not be all spaces"));
      }
      return true;
    }),

  check("prenom")
    .notEmpty()
    .withMessage("First name required")
    .isAlpha()
    .withMessage("First name must contain only letters")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("First name must not be all spaces"));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("tel")
    .notEmpty()
    .withMessage("Phone number required")
    .isMobilePhone(["ar-TN"])
    .withMessage("Invalid phone number only accepted Tunisia phone numbers"),

  check("codeG")
    .isMongoId()
    .withMessage("Invalid Group code id format")
    .custom((val) =>
      Groupe.findById({ _id: val }).then((groupe) => {
        if (!groupe) {
          return Promise.reject(new Error(`No group for this id : ${val}`));
        }
      })
    ),

  validatorMiddleware,
];

exports.getByIdEtudiantValidator = [
  check("id").isMongoId().withMessage("Invalid student id format"),

  validatorMiddleware,
];

exports.updateEtudiantValidator = [
  check("id").isMongoId().withMessage("Invalid student id format"),

  check("cin")
    .notEmpty()
    .withMessage("Cin required")
    .isLength({ min: 8, max: 8 })
    .withMessage("Cin only 8 numbers required")
    .isInt()
    .withMessage("Cin must be a number"),

  check("nom")
    .notEmpty()
    .withMessage("Last name required")
    .isAlpha()
    .withMessage("Last name must contain only letters")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Last name must not be all spaces"));
      }
      return true;
    }),

  check("prenom")
    .notEmpty()
    .withMessage("First name required")
    .isAlpha()
    .withMessage("First name must contain only letters")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("First name must not be all spaces"));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("tel")
    .notEmpty()
    .withMessage("Phone number required")
    .isMobilePhone(["ar-TN"])
    .withMessage("Invalid phone number only accepted Tunisia phone numbers"),

  check("codeG")
    .isMongoId()
    .withMessage("Invalid Group code id format")
    .custom((val) =>
      Groupe.findById({ _id: val }).then((groupe) => {
        if (!groupe) {
          return Promise.reject(new Error(`No Group for this id : ${val}`));
        }
      })
    ),

  validatorMiddleware,
];

exports.deleteEtudiantValidator = [
  check("id").isMongoId().withMessage("Invalid student id format"),

  validatorMiddleware,
];
