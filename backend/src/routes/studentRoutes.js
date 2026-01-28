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

router.get("/", paginationRules, validateRequest, listStudents);
router.get("/:id", getStudentRules, validateRequest, getStudent);
router.post("/", createStudentRules, validateRequest, createStudent);
router.put("/:id", updateStudentRules, validateRequest, updateStudent);
router.delete("/:id", deleteStudentRules, validateRequest, deleteStudent);

module.exports = router;
