const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { isStringAllSpaces } = require("../customValidator");

exports.createDepartmentValidator = [
  check("codeD")
    .notEmpty()
    .withMessage("Le code de département est obligatoire.")
    .isLength({ min: 2 })
    .withMessage("Le code de département trop court.")
    .isAlphanumeric()
    .withMessage("Le code de département doit contenir uniquement des lettres et des chiffres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(
          new Error("Le code de département ne doit pas être composé d'espaces.")
        );
      }
      return true;
    }),

  check("libelle")
    .notEmpty()
    .withMessage("La libelle de département est obligatoire.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(
          new Error("La libelle de département ne doit pas être composé d'espaces.")
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getByIdDepartmentValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de code départemental est invalide."),

  validatorMiddleware,
];

exports.updateDepartmentValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de code départemental est invalide."),

  check("codeD")
    .notEmpty()
    .withMessage("Le code de département est obligatoire.")
    .isLength({ min: 2 })
    .withMessage("Le code de département trop court.")
    .isAlphanumeric()
    .withMessage("Le code de département doit contenir uniquement des lettres et des chiffres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(
          new Error("Le code de département ne doit pas être composé d'espaces.")
        );
      }
      return true;
    }),

  check("libelle")
    .notEmpty()
    .withMessage("La libelle de département est obligatoire.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(
          new Error("La libelle de département ne doit pas être composé d'espaces.")
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteDepartmentValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de code départemental est invalide."),

  validatorMiddleware,
];
