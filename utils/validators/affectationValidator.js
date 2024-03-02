const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { isStringAllSpaces } = require("../customValidator");
const Etudiant = require("../../models/etudiantModel");
const Stage = require("../../models/stageModel");

exports.createAffectationValidator = [
  check("cin")
    .isMongoId()
    .withMessage("Le format de CIN est invalide.")
    .custom((val) =>
      Etudiant.findById({ _id: val }).then((etudiant) => {
        if (!etudiant) {
          return Promise.reject(
            new Error(`Aucun étudiant pour cet identifiant : ${val}`)
          );
        }
      })
    ),

  check("codeS")
    .isMongoId()
    .withMessage("Le format d'identifiant de code de stage est invalide.")
    .custom((val) =>
      Stage.findById({ _id: val }).then((stage) => {
        if (!stage) {
          return Promise.reject(
            new Error(`Aucune stage pour cet identifiant : ${val}`)
          );
        }
      })
    ),

  check("lieuS")
    .notEmpty()
    .withMessage("Le lieu de stage est obligatoire.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(
          new Error("Le lieu de stage ne doit pas être composé d'espaces.")
        );
      }
      return true;
    }),

  check("codeRap")
    .notEmpty()
    .withMessage("Le code de rapport est obligatoire.")
    .isLength({ min: 3 })
    .withMessage("Le code de rapport trop court.")
    .isAlphanumeric()
    .withMessage(
      "Le code de rapport doit contenir uniquement des lettres et des chiffres."
    )
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(
          new Error("Le code de rapport ne doit pas être composé d'espaces.")
        );
      }
      return true;
    }),

  check("dateD")
    .notEmpty()
    .withMessage("La date de début est obligatoire.")
    .isDate()
    .withMessage(
      "Le format de date de début est invalide. Acceptez uniquement 'AAAA/MM/JJ' ou 'AAAA-MM-JJ'."
    ),

  check("dateF")
    .notEmpty()
    .withMessage("La date de fin est obligatoire.")
    .isDate()
    .withMessage(
      "Le format de date de fin est invalide. Acceptez uniquement 'AAAA/MM/JJ' ou 'AAAA-MM-JJ'."
    )
    .custom((val, { req }) => {
      if (new Date(req.body.dateD) >= new Date(val)) {
        return Promise.reject(
          new Error(
            `La date de fin : ${val} doit être supérieure à la date de début : ${req.body.dateD}. `
          )
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getByIdAffectationValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant d'affectation est invalide."),

  validatorMiddleware,
];

exports.updateAffectationValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant d'affectation est invalide."),
  check("cin")
    .isMongoId()
    .withMessage("Le format de CIN est invalide.")
    .custom((val) =>
      Etudiant.findById({ _id: val }).then((etudiant) => {
        if (!etudiant) {
          return Promise.reject(
            new Error(`Aucun étudiant pour cet identifiant : ${val}`)
          );
        }
      })
    ),

  check("codeS")
    .isMongoId()
    .withMessage("Le format d'identifiant de code de stage est invalide.")
    .custom((val) =>
      Stage.findById({ _id: val }).then((stage) => {
        if (!stage) {
          return Promise.reject(
            new Error(`Aucune stage pour cet identifiant : ${val}`)
          );
        }
      })
    ),

  check("lieuS")
    .notEmpty()
    .withMessage("Le lieu de stage est obligatoire.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(
          new Error("Le lieu de stage ne doit pas être composé d'espaces.")
        );
      }
      return true;
    }),

  check("codeRap")
    .notEmpty()
    .withMessage("Le code de rapport est obligatoire.")
    .isLength({ min: 3 })
    .withMessage("Le code de rapport trop court.")
    .isAlphanumeric()
    .withMessage(
      "Le code de rapport doit contenir uniquement des lettres et des chiffres."
    )
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(
          new Error("Le code de rapport ne doit pas être composé d'espaces.")
        );
      }
      return true;
    }),

  check("dateD")
    .notEmpty()
    .withMessage("la date de début est obligatoire.")
    .isDate()
    .withMessage(
      "Le format de date de début est invalide. Acceptez uniquement 'AAAA/MM/JJ' ou 'AAAA-MM-JJ'."
    ),

  check("dateF")
    .notEmpty()
    .withMessage("la date de fin est obligatoire.")
    .isDate()
    .withMessage(
      "Le format de date de fin est invalide. Acceptez uniquement 'AAAA/MM/JJ' ou 'AAAA-MM-JJ'."
    )
    .custom((val, { req }) => {
      if (new Date(req.body.dateD) >= new Date(val)) {
        return Promise.reject(
          new Error(
            `La date de fin : ${val} doit être supérieure à la date de début : ${req.body.dateD}. `
          )
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteAffectationValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant d'affectation est invalide."),

  validatorMiddleware,
];
