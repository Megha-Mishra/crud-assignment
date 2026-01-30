const pool = require("../db");

const MAX_LIMIT = 100;

const listStudents = async (req, res, next) => {
  try {
    console.log(`\n📥 listStudents controller called`);
    console.log(`  Page: ${req.query.page}, Limit: ${req.query.limit}`);
    
    const page = req.query.page || 1;
    const limit = Math.min(req.query.limit || 10, MAX_LIMIT);
    const offset = (page - 1) * limit;

    console.log(`  Executing COUNT query...`);
    const [countRows] = await pool.query(
      "SELECT COUNT(*) AS total FROM students"
    );
    const total = countRows[0]?.total || 0;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    console.log(`  Total students: ${total}, Total pages: ${totalPages}`);
    console.log(`  Executing SELECT query (LIMIT ${limit}, OFFSET ${offset})...`);
    
    const [rows] = await pool.query(
      "SELECT id, name, email, age FROM students ORDER BY id DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    console.log(`  ✓ Query successful, returning ${rows.length} students`);
    
    res.json({
      success: true,
      data: rows,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error(`  ✗ Error in listStudents:`, error.message);
    next(error);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT id, name, email, age FROM students WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO students (name, email, age) VALUES (?, ?, ?)",
      [name, email, age]
    );

    const [rows] = await pool.query(
      "SELECT id, name, email, age FROM students WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      error.statusCode = 409;
      error.message = "Email already exists";
    }
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;
    const [result] = await pool.execute(
      "UPDATE students SET name = ?, email = ?, age = ? WHERE id = ?",
      [name, email, age, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, age FROM students WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      error.statusCode = 409;
      error.message = "Email already exists";
    }
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      "DELETE FROM students WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
