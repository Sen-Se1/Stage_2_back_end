const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const isStringAllSpaces = require("../isStringAllSpaces");
const Department = require("../../models/departmentModel");

exports.createGroupeValidator = [
  check("codeG")
    .notEmpty()
    .withMessage("Group code required")
    .isLength({ min: 3 })
    .withMessage("Too short group code")
    .isAlphanumeric()
    .withMessage('Group code must contain only letters and numbers')
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Group code must not be all spaces"));
      }
      return true;
    }),

  check("libelle")
    .notEmpty()
    .withMessage("Group label required")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Group label must not be all spaces"));
      }
      return true;
    }),

  check("codeD")
    .isMongoId()
    .withMessage("Invalid department code id format")
    .custom((val) =>
      Department.findById({ _id: val }).then((department) => {
        if (!department) {
          return Promise.reject(
            new Error(`No department for this id : ${val}`)
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.getByIdGroupeValidator = [
  check("id").isMongoId().withMessage("Invalid group id format"),

  validatorMiddleware,
];

exports.updateGroupeValidator = [
  check("id").isMongoId().withMessage("Invalid group id format"),

  check("codeG")
    .notEmpty()
    .withMessage("Group code required")
    .isLength({ min: 3 })
    .withMessage("Too short group code")
    .isAlphanumeric()
    .withMessage('Group code must contain only letters and numbers')
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Group code must not be all spaces"));
      }
      return true;
    }),

  check("libelle")
    .notEmpty()
    .withMessage("Group label required")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Group label must not be all spaces"));
      }
      return true;
    }),
    
  check("codeD")
    .isMongoId()
    .withMessage("Invalid department code id format")
    .custom((val) =>
      Department.findById({ _id: val }).then((department) => {
        if (!department) {
          return Promise.reject(
            new Error(`No department for this id : ${val}`)
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.deleteGroupeValidator = [
  check("id").isMongoId().withMessage("Invalid group id format"),

  validatorMiddleware,
];
