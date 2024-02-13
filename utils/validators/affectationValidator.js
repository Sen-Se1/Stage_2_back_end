const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const isStringAllSpaces = require("../isStringAllSpaces");
const Etudiant = require("../../models/etudiantModel");
const Stage = require("../../models/stageModel");

exports.createAffectationValidator = [
  check("cin")
    .isMongoId()
    .withMessage("Invalid cin id format")
    .custom((val) =>
      Etudiant.findById({ _id: val }).then((etudiant) => {
        if (!etudiant) {
          return Promise.reject(new Error(`No student for this id : ${val}`));
        }
      })
    ),

  check("codeS")
    .isMongoId()
    .withMessage("Invalid stage code id format")
    .custom((val) =>
      Stage.findById({ _id: val }).then((stage) => {
        if (!stage) {
          return Promise.reject(new Error(`No stage for this id : ${val}`));
        }
      })
    ),

  check("lieuS")
    .notEmpty()
    .withMessage("Stage location required")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Stage location must not be all spaces"));
      }
      return true;
    }),

  check("codeRap")
    .notEmpty()
    .withMessage("Rapport code required")
    .isLength({ min: 3 })
    .withMessage("Too short rapport code")
    .isAlphanumeric()
    .withMessage('Rapport code must contain only letters and numbers')
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Rapport code must not be all spaces"));
      }
      return true;
    }),

  check("dateD")
    .notEmpty()
    .withMessage("Start date required")
    .isDate()
    .withMessage(
      "Invalid start date format , only accept 'YYYY/MM/DD' or 'YYYY-MM-DD'"
    ),

  check("dateF")
    .notEmpty()
    .withMessage("End date required")
    .isDate()
    .withMessage(
      "Invalid end date format , only accept 'YYYY/MM/DD' or 'YYYY-MM-DD'"
    )
    .custom((val, { req }) => {
      if (new Date(req.body.dateD) >= new Date(val)) {
        return Promise.reject(
          new Error(
            `The date 'end date: ${val}' must be greater than 'start date: ${req.body.dateD}' `
          )
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getByIdAffectationValidator = [
  check("id").isMongoId().withMessage("Invalid assignment id format"),

  validatorMiddleware,
];

exports.updateAffectationValidator = [
  check("id").isMongoId().withMessage("Invalid assignment id format"),
  check("cin")
    .isMongoId()
    .withMessage("Invalid cin id format")
    .custom((val) =>
      Etudiant.findById({ _id: val }).then((etudiant) => {
        if (!etudiant) {
          return Promise.reject(new Error(`No student for this id : ${val}`));
        }
      })
    ),

  check("codeS")
    .isMongoId()
    .withMessage("Invalid stage code id format")
    .custom((val) =>
      Stage.findById({ _id: val }).then((stage) => {
        if (!stage) {
          return Promise.reject(new Error(`No stage for this id : ${val}`));
        }
      })
    ),

  check("lieuS")
    .notEmpty()
    .withMessage("Stage location required")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Stage location must not be all spaces"));
      }
      return true;
    }),

  check("codeRap")
    .notEmpty()
    .withMessage("Rapport code required")
    .isLength({ min: 3 })
    .withMessage("Too short rapport code")
    .isAlphanumeric()
    .withMessage('Rapport code must contain only letters and numbers')
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Rapport code must not be all spaces"));
      }
      return true;
    }),

  check("dateD")
    .notEmpty()
    .withMessage("start date required")
    .isDate()
    .withMessage(
      "Invalid start date format , only accept 'YYYY/MM/DD' or 'YYYY-MM-DD'"
    ),

  check("dateF")
    .notEmpty()
    .withMessage("end date required")
    .isDate()
    .withMessage(
      "Invalid end date format , only accept 'YYYY/MM/DD' or 'YYYY-MM-DD'"
    )
    .custom((val, { req }) => {
      if (new Date(req.body.dateD) >= new Date(val)) {
        return Promise.reject(
          new Error(
            `The date 'end date: ${val}' must be greater than 'start date: ${req.body.dateD}' `
          )
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteAffectationValidator = [
  check("id").isMongoId().withMessage("Invalid assignment id format"),

  validatorMiddleware,
];
