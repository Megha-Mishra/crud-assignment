import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./App.css";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import Pagination from "./components/Pagination";
import {
  createStudent,
  deleteStudent,
  fetchStudents,
  updateStudent,
} from "./services/studentService";

const MySwal = withReactContent(Swal);
const DEFAULT_LIMIT = 5;

const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors.map((item) => item.message).join(", ");
  }

  return error?.message || "Something went wrong. Please try again.";
};

const confirmAction = async ({ title, text, confirmButtonText }) => {
  const result = await MySwal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    focusCancel: true,
  });

  return result.isConfirmed;
};

function App() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [meta, setMeta] = useState({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState("");

  const loadStudents = useCallback(
    async (targetPage = page) => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchStudents(targetPage, limit);
        setStudents(response.data || []);
        setMeta({
          total: response.meta?.total ?? 0,
          totalPages: response.meta?.totalPages ?? 0,
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  useEffect(() => {
    loadStudents(page);
  }, [loadStudents, page]);

  const handleCreate = async (payload) => {
    const confirmed = await confirmAction({
      title: "Create student?",
      text: "This will add a new student record.",
      confirmButtonText: "Create",
    });

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createStudent(payload);
      await MySwal.fire({
        title: "Student created",
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });

      if (page === 1) {
        await loadStudents(1);
      } else {
        setPage(1);
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      await MySwal.fire({
        title: "Unable to create student",
        text: message,
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!selectedStudent) {
      return;
    }

    const confirmed = await confirmAction({
      title: "Update student?",
      text: "This will update the student record.",
      confirmButtonText: "Update",
    });

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStudent(selectedStudent.id, payload);
      await MySwal.fire({
        title: "Student updated",
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });
      setSelectedStudent(null);
      await loadStudents(page);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      await MySwal.fire({
        title: "Unable to update student",
        text: message,
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (student) => {
    const confirmed = await confirmAction({
      title: "Delete student?",
      text: `This will remove ${student.name} permanently.`,
      confirmButtonText: "Delete",
    });

    if (!confirmed) {
      return;
    }

    try {
      await deleteStudent(student.id);
      await MySwal.fire({
        title: "Student deleted",
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });

      if (students.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadStudents(page);
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      await MySwal.fire({
        title: "Unable to delete student",
        text: message,
        icon: "error",
      });
    }
  };

  const handleFormSubmit = (payload) => {
    if (selectedStudent) {
      handleUpdate(payload);
    } else {
      handleCreate(payload);
    }
  };

  const handleCancelEdit = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="app container py-4">
      <header className="mb-4">
        <h1 className="fw-bold">Student Management</h1>
        <p className="text-muted mb-0">
          Manage student records with pagination and confirmation prompts.
        </p>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          <StudentForm
            initialValues={selectedStudent}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
            isSubmitting={isSubmitting}
          />
        </div>
        <div className="col-lg-8">
          <StudentTable
            students={students}
            onEdit={setSelectedStudent}
            onDelete={handleDelete}
            loading={loading}
          />
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">
              Total students: {meta.total}
            </small>
            <Pagination
              page={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
