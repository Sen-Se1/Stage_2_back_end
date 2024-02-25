const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { isStringAllSpaces } = require("../customValidator");

exports.createStageValidator = [
  check("codeS")
    .notEmpty()
    .withMessage("Le code de stage est obligatoire.")
    .isLength({ min: 3 })
    .withMessage("Le code de stage trop court.")
    .isAlphanumeric()
    .withMessage("Le code de stage doit contenir uniquement des lettres et des chiffres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le code de stage ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("type")
    .notEmpty()
    .withMessage("Le type de stage est obligatoire.")
    .custom((val) => {
      array = [
        "Stage d'initiation",
        "Stage de perfectionnement",
        "Stage de fin d'etude",
      ];
      if (array.indexOf(val) === -1) {
        return Promise.reject(
          new Error(
            "Le type de stage doit être l'un des suivants : « Stage d'initiation, Stage de perfectionnement, Stage de fin d'étude »."
          )
        );
      }
      return true;
    }),

  check("duree")
    .notEmpty()
    .withMessage("La durée de stage est obligatoire.")
    .isNumeric()
    .withMessage("La durée du stage doit être un nombre.")
    .custom((val) => {
      if (parseFloat(val) <= 0) {
        throw new Error("La durée de stage doit être un nombre positif.");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getByIdStageValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de stage est invalide."),

  validatorMiddleware,
];

exports.updateStageValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de stage est invalide."),

  check("codeS")
    .notEmpty()
    .withMessage("Le code de stage est obligatoire.")
    .isLength({ min: 3 })
    .withMessage("Le code de stage trop court.")
    .isAlphanumeric()
    .withMessage("Le code de stage doit contenir uniquement des lettres et des chiffres."),

  check("type")
    .notEmpty()
    .withMessage("Le type de stage est obligatoire.")
    .custom((val) => {
      array = [
        "Stage d'initiation",
        "Stage de perfectionnement",
        "Stage de fin d'etude",
      ];
      if (array.indexOf(val) === -1) {
        return Promise.reject(
          new Error(
            "Le type de stage doit être l'un des suivants : « Stage d'initiation, Stage de perfectionnement, Stage de fin d'étude »."
          )
        );
      }
      return true;
    }),

  check("duree")
    .notEmpty()
    .withMessage("La durée de stage est obligatoire.")
    .isNumeric()
    .withMessage("La durée du stage doit être un nombre.")
    .custom((val) => {
      if (parseFloat(val) <= 0) {
        throw new Error("La durée de stage doit être un nombre positif.");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteStageValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de stage est invalide."),

  validatorMiddleware,
];
