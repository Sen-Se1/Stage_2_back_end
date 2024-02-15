exports.isStringAllSpaces = (str) => {
  return /^\s*$/.test(str);
};

exports.isEmpty = (str) => {
  if (str.toString().length !== 0) {
    return true;
  }
  return false;
};

exports.isInteger = value => Number.isInteger(value);

exports.containsOnlyLetters = str => /^[a-zA-Z]+$/.test(str);

exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

exports.isValidTunisianPhoneNumber = (phoneNumber) => {
  const phoneNumberRegex = /^(2|5|9)\d{7}$/;
  return phoneNumberRegex.test(phoneNumber);
};

exports.isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};