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
          `All fields are required. Error in line '${i + 1}'`,
          400
        );
      }
    }

    // Check if fields are empty
    if (!isEmpty(item.cin)) {
      throw new ApiError(`Cin required. Error in line '${i + 1}'`, 400);
    }
    if (!isEmpty(item.nom)) {
      throw new ApiError(`Last name required. Error in line '${i + 1}'`, 400);
    }
    if (!isEmpty(item.prenom)) {
      throw new ApiError(`First name required. Error in line '${i + 1}'`, 400);
    }
    if (!isEmpty(item.email)) {
      throw new ApiError(`Email required. Error in line '${i + 1}'`, 400);
    }
    if (!isEmpty(item.tel)) {
      throw new ApiError(`Phone number required. Error in line '${i + 1}'`, 400);
    }
    if (!isEmpty(item.codeG)) {
      throw new ApiError(`Group code required. Error in line '${i + 1}'`, 400);
    }

    // Validate CIN format
    if (!isInteger(item.cin) || item.cin.toString().length !== 8) {
      throw new ApiError(
        `Cin must be a valid 8-digit number. Error in line '${i + 1}'`,
        400
      );
    }

    // Validate last name format
    if (!containsOnlyLetters(item.nom) || isStringAllSpaces(item.nom)) {
      throw new ApiError(`Invalid last name. Error in line '${i + 1}'`, 400);
    }

    // Validate first name format
    if (!containsOnlyLetters(item.prenom) || isStringAllSpaces(item.prenom)) {
      throw new ApiError(`Invalid first name. Error in line '${i + 1}'`, 400);
    }

    // Validate email format
    if (!isValidEmail(item.email)) {
      throw new ApiError(`Invalid email. Error in line '${i + 1}'`, 400);
    }

    // Validate Tunisian phone number format
    if (!isValidTunisianPhoneNumber(item.tel)) {
      throw new ApiError(
        `Invalid phone number only accepted Tunisia phone numbers. Error in line '${i + 1}'`,
        400
      );
    }

    // Add CIN to set
    if (seenCINs.has(item.cin)) {
      throw new ApiError(
        `The student with this CIN '${item.cin}' is duplicated. Error in line '${i + 1}'`,
        400
      );
    } else {
      seenCINs.add(item.cin);
    }

    // Add email to set
    if (seenEmails.has(item.email)) {
      throw new ApiError(
        `The student with this email '${item.email}' is duplicated. Error in line '${i + 1}'`,
        400
      );
    } else {
      seenEmails.add(item.email);
    }

    // if (!isValidObjectId(item.codeG)) {
    //   throw new ApiError(
    //     `Invalid Group code id format. Error in line '${i + 1}'`,
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
        `The student with this CIN '${item.cin}' already exists. Error in line '${i + 1}'`,
        400
      );
    }

    // Check for existing student with the same email
    const etudiantEmail = await Etudiant.findOne({ email: item.email });
    if (etudiantEmail) {
      throw new ApiError(
        `The student with this email '${item.email}' already exists. Error in line '${i + 1}'`,
        400
      );
    }

    // Check if the group code exists
    const groupe = await Groupe.findOne({ codeG: item.codeG });
    if (!groupe) {
      throw new ApiError(
        `No group found for this code: ${item.codeG}. Error in line '${i + 1}'`,
        404
      );
    }
    
    item.codeG = groupe._id;
  }
};

exports.createEtudiantValidator = [
  check("cin")
    .notEmpty()
    .withMessage("Cin required")
    .isLength({ min: 8, max: 8 })
    .withMessage("Cin only 8 numbers required")
    .isInt()
    .withMessage("Cin must be a number"),

  check("nom")
    .notEmpty()
    .withMessage("Last name required")
    .isAlpha()
    .withMessage("Last name must contain only letters")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Last name must not be all spaces"));
      }
      return true;
    }),

  check("prenom")
    .notEmpty()
    .withMessage("First name required")
    .isAlpha()
    .withMessage("First name must contain only letters")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("First name must not be all spaces"));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("tel")
    .notEmpty()
    .withMessage("Phone number required")
    .isMobilePhone(["ar-TN"])
    .withMessage("Invalid phone number only accepted Tunisia phone numbers"),

  check("codeG")
    .isMongoId()
    .withMessage("Invalid Group code id format")
    .custom((val) =>
      Groupe.findById({ _id: val }).then((groupe) => {
        if (!groupe) {
          return Promise.reject(new Error(`No group for this id : ${val}`));
        }
      })
    ),

  validatorMiddleware,
];

exports.getByIdEtudiantValidator = [
  check("id").isMongoId().withMessage("Invalid student id format"),

  validatorMiddleware,
];

exports.updateEtudiantValidator = [
  check("id").isMongoId().withMessage("Invalid student id format"),

  check("cin")
    .notEmpty()
    .withMessage("Cin required")
    .isLength({ min: 8, max: 8 })
    .withMessage("Cin only 8 numbers required")
    .isInt()
    .withMessage("Cin must be a number"),

  check("nom")
    .notEmpty()
    .withMessage("Last name required")
    .isAlpha()
    .withMessage("Last name must contain only letters")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("Last name must not be all spaces"));
      }
      return true;
    }),

  check("prenom")
    .notEmpty()
    .withMessage("First name required")
    .isAlpha()
    .withMessage("First name must contain only letters")
    .custom((val) => {
      if (isStringAllSpaces(val)) {
        return Promise.reject(new Error("First name must not be all spaces"));
      }
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("tel")
    .notEmpty()
    .withMessage("Phone number required")
    .isMobilePhone(["ar-TN"])
    .withMessage("Invalid phone number only accepted Tunisia phone numbers"),

  check("codeG")
    .isMongoId()
    .withMessage("Invalid Group code id format")
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
  check("id").isMongoId().withMessage("Invalid student id format"),

  validatorMiddleware,
];
