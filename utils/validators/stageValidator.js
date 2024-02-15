const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { isStringAllSpaces } = require("../customValidator");

exports.createStageValidator = [
  check("codeS")
    .notEmpty()
    .withMessage("Stage code required")
    .isLength({ min: 3 })
    .withMessage("Too short stage code")
    .isAlphanumeric()
    .withMessage("Stage code must contain only letters and numbers")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Stage code must not be all spaces"));
      }
      return true;
    }),

  check("type")
    .notEmpty()
    .withMessage("Stage type required")
    .custom((val) => {
      array = [
        "Stage d'initiation",
        "Stage de perfectionnement",
        "Stage de fin d'etude",
      ];
      if (array.indexOf(val) === -1) {
        return Promise.reject(
          new Error(
            "Stage type must be one of the following : 'Stage d'initiation', 'Stage de perfectionnement', 'Stage de fin d'etude'"
          )
        );
      }
      return true;
    }),

  check("duree")
    .notEmpty()
    .withMessage("Stage duration required")
    .isNumeric()
    .withMessage("Stage duration must be a number")
    .custom((val) => {
      if (parseFloat(val) <= 0) {
        throw new Error("Stage duration field must be a positive number");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getByIdStageValidator = [
  check("id").isMongoId().withMessage("Invalid stage id format"),

  validatorMiddleware,
];

exports.updateStageValidator = [
  check("id").isMongoId().withMessage("Invalid stage id format"),

  check("codeS")
    .notEmpty()
    .withMessage("Stage code required")
    .isLength({ min: 3 })
    .withMessage("Too short stage code")
    .isAlphanumeric()
    .withMessage("Stage code must contain only letters and numbers"),

  check("type")
    .notEmpty()
    .withMessage("Stage type required")
    .custom((val) => {
      array = [
        "Stage d'initiation",
        "Stage de perfectionnement",
        "Stage de fin d'etude",
      ];
      if (array.indexOf(val) === -1) {
        return Promise.reject(
          new Error(
            "Stage type must be one of the following : 'Stage d'initiation', 'Stage de perfectionnement', 'Stage de fin d'etude'"
          )
        );
      }
      return true;
    }),

  check("duree")
    .notEmpty()
    .withMessage("Stage duration required")
    .isNumeric()
    .withMessage("Stage duration must be a number")
    .custom((val) => {
      if (parseFloat(val) <= 0) {
        throw new Error("Stage duration field must be a positive number");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteStageValidator = [
  check("id").isMongoId().withMessage("Invalid stage id format"),

  validatorMiddleware,
];
