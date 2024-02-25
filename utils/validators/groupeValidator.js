const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { isStringAllSpaces } = require("../customValidator");
const Department = require("../../models/departmentModel");

exports.createGroupeValidator = [
  check("codeG")
    .notEmpty()
    .withMessage("Le code de groupe est obligatoire.")
    .isLength({ min: 3 })
    .withMessage("Le code de groupe trop court.")
    .isAlphanumeric()
    .withMessage("Le code de groupe doit contenir uniquement des lettres et des chiffres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le code de groupe ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("libelle")
    .notEmpty()
    .withMessage("La libelle de groupe est obligatoire.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("La libelle de groupe ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("codeD")
    .isMongoId()
    .withMessage("Le format d'identifiant de code départemental est invalide.")
    .custom((val) =>
      Department.findById({ _id: val }).then((department) => {
        if (!department) {
          return Promise.reject(
            new Error(`Aucun département pour cet identifiant : ${val}`)
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.getByIdGroupeValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de groupe est invalide."),

  validatorMiddleware,
];

exports.updateGroupeValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de groupe est invalide."),

  check("codeG")
    .notEmpty()
    .withMessage("Le code de groupe est obligatoire.")
    .isLength({ min: 3 })
    .withMessage("Le code de groupe trop court.")
    .isAlphanumeric()
    .withMessage("Le code de groupe doit contenir uniquement des lettres et des chiffres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le code de groupe ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("libelle")
    .notEmpty()
    .withMessage("La libelle de groupe est obligatoire.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("La libelle de groupe ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("codeD")
    .isMongoId()
    .withMessage("Le format d'identifiant de code départemental est invalide.")
    .custom((val) =>
      Department.findById({ _id: val }).then((department) => {
        if (!department) {
          return Promise.reject(
            new Error(`Aucun département pour cet identifiant : ${val}`)
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.deleteGroupeValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de groupe est invalide."),

  validatorMiddleware,
];
