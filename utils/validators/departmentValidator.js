const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const isStringAllSpaces = require("../isStringAllSpaces");

exports.createDepartmentValidator = [
  check("codeD")
    .notEmpty()
    .withMessage("Department code required")
    .isLength({ min: 2 })
    .withMessage("Too short department code")
    .isAlphanumeric()
    .withMessage('Department code must contain only letters and numbers')
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Department code must not be all spaces"));
      }
      return true;
    }),

  check("libelle")
    .notEmpty()
    .withMessage("Departemnt label required")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Departemnt label must not be all spaces"));
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getByIdDepartmentValidator = [
  check("id").isMongoId().withMessage("Invalid department id format"),

  validatorMiddleware,
];

exports.updateDepartmentValidator = [
  check("id").isMongoId().withMessage("Invalid department id format"),

  check("codeD")
    .notEmpty()
    .withMessage("Department code required")
    .isLength({ min: 2 })
    .withMessage("Too short department code")
    .isAlphanumeric()
    .withMessage('Department code must contain only letters and numbers')
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Department code must not be all spaces"));
      }
      return true;
    }),

  check("libelle")
    .notEmpty()
    .withMessage("Departemnt label required")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Departemnt label must not be all spaces"));
      }
      return true;
    }),
    
  validatorMiddleware,
];

exports.deleteDepartmentValidator = [
  check("id").isMongoId().withMessage("Invalid department id format"),

  validatorMiddleware,
];
