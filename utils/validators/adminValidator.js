const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { isStringAllSpaces } = require("../customValidator");

exports.addAdminModValidator = [
  check("username")
    .notEmpty()
    .withMessage("Le format d'identifiant d'affectation est invalide.")
    .isLength({ min: 3 })
    .withMessage("Le nom d'utilisateur trop court.")
    .isAlphanumeric()
    .withMessage("Le nom d'utilisateur doit contenir uniquement des lettres et des chiffres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le nom d'utilisateur ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Adresse e-mail est obligatoire.")
    .isEmail()
    .withMessage("Adresse e-mail est invalide."),

  check("password")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire.")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit être d'au moins 8 caractères.")
    .isStrongPassword({
      // minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Le mot de passe n'est pas fort et doit contenir « une lettre minuscule, une lettre majuscule, un chiffre et un symbole »."
    ),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Vous devez saisir la confirmation du mot de passe.")
    .custom((val, { req }) => {
      if (req.body.password !== val) {
        return Promise.reject(
          new Error(`Confirmez, le mot de passe est incorrect.`)
        );
      }
      return true;
    }),

  check("role")
    .notEmpty()
    .withMessage("Le rôle est obligatoire.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le rôle ne doit pas être composé uniquement d'espaces."));
      }
      return true;
    })
    .custom((val) => {
      array = ["Moderator"];
      if (array.indexOf(val) === -1) {
        return Promise.reject(
          new Error("Le rôle doit être l'un des suivants : « Moderator ».")
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getByIdAdminModValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de modérateur est invalide."),

  validatorMiddleware,
];

exports.updateAdminModValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de modérateur est invalide."),

  check("username")
    .notEmpty()
    .withMessage("Le format d'identifiant d'affectation est invalide.")
    .isLength({ min: 3 })
    .withMessage("Le nom d'utilisateur trop court.")
    .isAlphanumeric()
    .withMessage("Le nom d'utilisateur doit contenir uniquement des lettres et des chiffres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le nom d'utilisateur ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Adresse e-mail est obligatoire.")
    .isEmail()
    .withMessage("Adresse e-mail est invalide."),

  check("role")
    .notEmpty()
    .withMessage("Le rôle est obligatoire.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le rôle ne doit pas être composé uniquement d'espaces."));
      }
      return true;
    })
    .custom((val) => {
      array = ["Moderator"];
      if (array.indexOf(val) === -1) {
        return Promise.reject(
          new Error("Le rôle doit être l'un des suivants : « Moderator ».")
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateAdminModPwdValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de modérateur est invalide."),

  check("password")
    .notEmpty()
    .withMessage("Le nouveau mot de passe est obligatoire.")
    .isLength({ min: 8 })
    .withMessage("Le nouveau mot de passe doit être d'au moins 8 caractères.")
    .isStrongPassword({
      // minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Le nouveau mot de passe n'est pas fort et doit contenir « une lettre minuscule, une lettre majuscule, un chiffre et un symbole »."
    ),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Vous devez saisir la confirmation du mot de passe.")
    .custom((val, { req }) => {
      if (req.body.password !== val) {
        return Promise.reject(
          new Error(`Confirmez, le mot de passe est incorrect.`)
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteAdminModValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de modérateur est invalide."),

  validatorMiddleware,
];
