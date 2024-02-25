const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const {
  isStringAllSpaces,
  isEmpty,
  isValidEmail,
  isInteger,
  containsOnlyLetters,
  isValidTunisianPhoneNumber,
  isValidObjectId,
} = require("../customValidator");
const Groupe = require("../../models/groupeModel");
const Etudiant = require("../../models/etudiantModel");
const ApiError = require("../apiError");

exports.createByFileEtudiantValidator = async (data) => {
  const seenCINs = new Set();
  const seenEmails = new Set();

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    // Check if any required field is missing
    for (let key of ["cin", "nom", "prenom", "email", "tel", "codeG"]) {
      if (!(key in item)) {
        throw new ApiError(
          `Tous les champs sont requis. Erreur dans la ligne '${i + 1}'`,
          400
        );
      }
    }

    // Check if fields are empty
    if (!isEmpty(item.cin)) {
      throw new ApiError(`CIN est obligatoire. Erreur dans la ligne '${i + 1}'`, 400);
    }
    if (!isEmpty(item.nom)) {
      throw new ApiError(`Le nom est obligatoire. Erreur dans la ligne '${i + 1}'`, 400);
    }
    if (!isEmpty(item.prenom)) {
      throw new ApiError(`Le prenom est obligatoire. Erreur dans la ligne '${i + 1}'`, 400);
    }
    if (!isEmpty(item.email)) {
      throw new ApiError(`Adresse e-mail est obligatoire. Erreur dans la ligne '${i + 1}'`, 400);
    }
    if (!isEmpty(item.tel)) {
      throw new ApiError(`Le numéro de téléphone est obligatoire. Erreur dans la ligne '${i + 1}'`, 400);
    }
    if (!isEmpty(item.codeG)) {
      throw new ApiError(`Le code de groupe est obligatoire. Erreur dans la ligne '${i + 1}'`, 400);
    }

    // Validate CIN format
    if (!isInteger(item.cin) || item.cin.toString().length !== 8) {
      throw new ApiError(
        `CIN doit être un numéro valide à 8 chiffres. Erreur dans la ligne '${i + 1}'`,
        400
      );
    }

    // Validate last name format
    if (!containsOnlyLetters(item.nom) || isStringAllSpaces(item.nom)) {
      throw new ApiError(`Le nom est invalide. Erreur dans la ligne '${i + 1}'`, 400);
    }

    // Validate first name format
    if (!containsOnlyLetters(item.prenom) || isStringAllSpaces(item.prenom)) {
      throw new ApiError(`Le prenom est invalide. Erreur dans la ligne '${i + 1}'`, 400);
    }

    // Validate email format
    if (!isValidEmail(item.email)) {
      throw new ApiError(`Adresse e-mail est invalide. Erreur dans la ligne '${i + 1}'`, 400);
    }

    // Validate Tunisian phone number format
    if (!isValidTunisianPhoneNumber(item.tel)) {
      throw new ApiError(
        `Le numéro de téléphone invalide est uniquement accepté pour les numéros de téléphone de Tunisie. Erreur dans la ligne '${i + 1}'`,
        400
      );
    }

    // Add CIN to set
    if (seenCINs.has(item.cin)) {
      throw new ApiError(
        `L'étudiant avec ce CIN ${item.cin} est dupliqué. Erreur dans la ligne '${i + 1}'`,
        400
      );
    } else {
      seenCINs.add(item.cin);
    }

    // Add email to set
    if (seenEmails.has(item.email)) {
      throw new ApiError(
        `L'étudiant avec cet adresse e-mail ${item.email} est dupliqué. Erreur dans la ligne '${i + 1}'`,
        400
      );
    } else {
      seenEmails.add(item.email);
    }

    // if (!isValidObjectId(item.codeG)) {
    //   throw new ApiError(
    //     `Le format d'identifiant de groupe est invalide.. Erreur dans la ligne '${i + 1}'`,
    //     400
    //   );
    // }
  }

  // Check for existing students and group code outside the loop
  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    // Check for existing student with the same CIN
    const etudiantCin = await Etudiant.findOne({ cin: item.cin });
    if (etudiantCin) {
      throw new ApiError(
        `L'étudiant avec ce CIN ${item.cin} existe déjà. Erreur dans la ligne '${i + 1}'`,
        400
      );
    }

    // Check for existing student with the same email
    const etudiantEmail = await Etudiant.findOne({ email: item.email });
    if (etudiantEmail) {
      throw new ApiError(
        `L'étudiant avec cet adresse e-mail ${item.email} existe déjà. Erreur dans la ligne '${i + 1}'`,
        400
      );
    }

    // Check if the group code exists
    const groupe = await Groupe.findOne({ codeG: item.codeG });
    if (!groupe) {
      throw new ApiError(
        `Aucun groupe trouvé pour ce code : ${item.codeG}. Erreur dans la ligne '${i + 1}'`,
        404
      );
    }
    
    item.codeG = groupe._id;
  }
};

exports.createEtudiantValidator = [
  check("cin")
    .notEmpty()
    .withMessage("CIN est obligatoire.")
    .isLength({ min: 8, max: 8 })
    .withMessage("Cin seulement 8 chiffres est obligatoire.")
    .isInt()
    .withMessage("CIN doit être un nombre."),

  check("nom")
    .notEmpty()
    .withMessage("Le nom est obligatoire.")
    .isAlpha()
    .withMessage("Le nom ne doit contenir que des lettres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le nom ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("prenom")
    .notEmpty()
    .withMessage("Le prenom est obligatoire.")
    .isAlpha()
    .withMessage("Le prenom ne doit contenir que des lettres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le prenom ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Adresse e-mail est obligatoire.")
    .isEmail()
    .withMessage("Adresse e-mail est invalide."),

  check("tel")
    .notEmpty()
    .withMessage("Le numéro de téléphone est obligatoire.")
    .isMobilePhone(["ar-TN"])
    .withMessage("Le numéro de téléphone invalide est uniquement accepté pour les numéros de téléphone de Tunisie."),

  check("codeG")
    .isMongoId()
    .withMessage("Le format d'identifiant de groupe est invalide.")
    .custom((val) =>
      Groupe.findById({ _id: val }).then((groupe) => {
        if (!groupe) {
          return Promise.reject(new Error(`Aucun groupe pour cet identifiant : ${val}`));
        }
      })
    ),

  validatorMiddleware,
];

exports.getByIdEtudiantValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant d'étudiant est invalide."),

  validatorMiddleware,
];

exports.updateEtudiantValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant d'étudiant est invalide."),

  check("cin")
    .notEmpty()
    .withMessage("CIN est obligatoire.")
    .isLength({ min: 8, max: 8 })
    .withMessage("Cin seulement 8 chiffres est obligatoire.")
    .isInt()
    .withMessage("CIN doit être un nombre."),

  check("nom")
    .notEmpty()
    .withMessage("Le nom est obligatoire.")
    .isAlpha()
    .withMessage("Le nom ne doit contenir que des lettres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le nom ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("prenom")
    .notEmpty()
    .withMessage("Le prenom est obligatoire.")
    .isAlpha()
    .withMessage("Le prenom ne doit contenir que des lettres.")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Le prenom ne doit pas être composé d'espaces."));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Adresse e-mail est obligatoire.")
    .isEmail()
    .withMessage("Adresse e-mail est invalide."),

  check("tel")
    .notEmpty()
    .withMessage("Le numéro de téléphone est obligatoire.")
    .isMobilePhone(["ar-TN"])
    .withMessage("Le numéro de téléphone invalide est uniquement accepté pour les numéros de téléphone de Tunisie."),

  check("codeG")
    .isMongoId()
    .withMessage("Le format d'identifiant de groupe est invalide.")
    .custom((val) =>
      Groupe.findById({ _id: val }).then((groupe) => {
        if (!groupe) {
          return Promise.reject(new Error(`No Group for this id : ${val}`));
        }
      })
    ),

  validatorMiddleware,
];

exports.deleteEtudiantValidator = [
  check("id").isMongoId().withMessage("Le format d'identifiant d'étudiant est invalide."),

  validatorMiddleware,
];
