const express = require("express");
const {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const {
  createStudentRules,
  updateStudentRules,
  paginationRules,
  getStudentRules,
  deleteStudentRules,
} = require("../validators/studentValidators");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(`✓ GET /api/v1/students route handler called`);
  console.log(`  Query params:`, req.query);
  next();
}, paginationRules, validateRequest, listStudents);

router.get("/:id", (req, res, next) => {
  console.log(`✓ GET /api/v1/students/:id route handler called`);
  console.log(`  Student ID:`, req.params.id);
  next();
}, getStudentRules, validateRequest, getStudent);

router.post("/", (req, res, next) => {
  console.log(`✓ POST /api/v1/students route handler called`);
  console.log(`  Body:`, req.body);
  next();
}, createStudentRules, validateRequest, createStudent);

router.put("/:id", (req, res, next) => {
  console.log(`✓ PUT /api/v1/students/:id route handler called`);
  console.log(`  Student ID:`, req.params.id);
  console.log(`  Body:`, req.body);
  next();
}, updateStudentRules, validateRequest, updateStudent);

router.delete("/:id", (req, res, next) => {
  console.log(`✓ DELETE /api/v1/students/:id route handler called`);
  console.log(`  Student ID:`, req.params.id);
  next();
}, deleteStudentRules, validateRequest, deleteStudent);

module.exports = router;
