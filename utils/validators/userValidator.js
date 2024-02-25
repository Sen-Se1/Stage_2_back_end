const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { isStringAllSpaces } = require("../customValidator");
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");

exports.registerValidator = [
  check("username")
    .notEmpty()
    .withMessage("Le nom d'utilisateur est obligatoire.")
    .isLength({ min: 3 })
    .withMessage("Le nom d'utilisateur trop court.")
    .isAlphanumeric()
    .withMessage("Le nom d'utilisateur ne doit contenir que des lettres et des chiffres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le nom d'utilisateur ne doit pas être composé uniquement d'espaces."));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Adresse e-mail est obligatoire.")
    .isEmail()
    .withMessage("Adresse e-mail est invalide.")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Adresse email déjà utilisée."));
        }
      })
    ),

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
    .custom(async (val, { req }) => {
      // 1) Verify password confirm
      if (val !== req.body.password) {
        throw new Error("Confirmez, le mot de passe est incorrect.");
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
      array = ["Admin", "Moderator"];
      if (array.indexOf(val) === -1) {
        return Promise.reject(
          new Error("Le rôle doit être l'un des suivants : « Admin », « Moderator ».")
        );
      }
      return true;
    }),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Adresse e-mail est obligatoire.")
    .isEmail()
    .withMessage("Adresse e-mail est invalide."),

  check("password")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire."),

  validatorMiddleware,
];

exports.resetPasswordValidator = [

  check("password")
    .notEmpty()
    .withMessage("Vous devez entrer un nouveau mot de passe.")
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
    .custom(async (val, { req }) => {
      // 1) Verify password confirm
      if (val !== req.body.password) {
        throw new Error("Confirmez, le mot de passe est incorrect.");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.getProfileValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de profil est invalide."),

  validatorMiddleware,
];

exports.updateProfileValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de profil est invalide."),

  check("username")
    .notEmpty()
    .withMessage("Le nom d'utilisateur est obligatoire.")
    .isLength({ min: 3 })
    .withMessage("Le nom d'utilisateur trop court.")
    .isAlphanumeric()
    .withMessage("Le nom d'utilisateur ne doit contenir que des lettres et des chiffres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le nom d'utilisateur ne doit pas être composé uniquement d'espaces."));
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
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error(`Il n'y a pas de profil pour cet identifiant: ${req.params.id}`);
      }
      const isCorrectPassword = await bcrypt.compare(
        val,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Le mot de passe actuel incorrect.");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateProfilePwdValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant de profil est invalide."),

  check("currentPassword")
    .notEmpty()
    .withMessage("Vous devez entrer votre mot de passe actuel."),

  check("password")
    .notEmpty()
    .withMessage("Vous devez entrer un nouveau mot de passe.")
    .isLength({ min: 8 })
    .withMessage("Le nouveau mot de passe doit comporter au moins 8 caractères.")
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
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error(`Il n'y a pas de profil pour cet identifiant: ${req.params.id}`);
      }
      // 1) Verify password confirm
      if (val !== req.body.password) {
        throw new Error("Confirmez, le mot de passe est incorrect.");
      }
      // 2) Verify current password
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Le mot de passe actuel est incorrect.");
      }

      return true;
    }),

  validatorMiddleware,
];
