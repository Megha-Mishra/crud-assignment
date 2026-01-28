const { body, param, query } = require("express-validator");

const idParam = param("id")
  .isInt({ min: 1 })
  .withMessage("id must be a positive integer")
  .toInt();

const createStudentRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 100 })
    .withMessage("name must be at most 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email must be valid")
    .normalizeEmail()
    .isLength({ max: 150 })
    .withMessage("email must be at most 150 characters"),
  body("age")
    .notEmpty()
    .withMessage("age is required")
    .isInt({ min: 1, max: 150 })
    .withMessage("age must be between 1 and 150")
    .toInt(),
];

const updateStudentRules = [
  idParam,
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 100 })
    .withMessage("name must be at most 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email must be valid")
    .normalizeEmail()
    .isLength({ max: 150 })
    .withMessage("email must be at most 150 characters"),
  body("age")
    .notEmpty()
    .withMessage("age is required")
    .isInt({ min: 1, max: 150 })
    .withMessage("age must be between 1 and 150")
    .toInt(),
];

const paginationRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100")
    .toInt(),
];

const getStudentRules = [idParam];
const deleteStudentRules = [idParam];

module.exports = {
  createStudentRules,
  updateStudentRules,
  paginationRules,
  getStudentRules,
  deleteStudentRules,
};
