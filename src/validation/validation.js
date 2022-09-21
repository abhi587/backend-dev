const { default: mongoose } = require('mongoose');

const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValidRequestBody = function (object) {
  return Object.keys(object).length > 0;
};

const isValidIdType = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
};

const isValidSubcategory = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length > 0) return true;
  if (typeof value == "object" && Array.isArray(value) == true) return true;
};

const isNameValid = function (value) {
  let regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
  return regex.test(value)
}

const isValidPhone = function (phone) {
  const regexForMobile = /^[6-9]\d{9}$/;
  return regexForMobile.test(phone);
};

const isValidEmail = function (email) {
  const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regexForEmail.test(email);
};

module.exports = {
  isValid,
  isValidIdType,
  isValidRequestBody,
  isValidSubcategory,
  isNameValid,
  isValidPhone,
  isValidEmail
}
