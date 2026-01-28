import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  age: "",
};

const StudentForm = ({ initialValues, onSubmit, onCancel, isSubmitting }) => {
  const [formValues, setFormValues] = useState(emptyForm);

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        name: initialValues.name || "",
        email: initialValues.email || "",
        age: initialValues.age ?? "",
      });
    } else {
      setFormValues(emptyForm);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      age: Number(formValues.age),
    });
  };

  const isEditing = Boolean(initialValues?.id);

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {isEditing ? "Update Student" : "Add Student"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={formValues.name}
              onChange={handleChange}
              maxLength={100}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={formValues.email}
              onChange={handleChange}
              maxLength={150}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="age" className="form-label">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              className="form-control"
              value={formValues.age}
              onChange={handleChange}
              min={1}
              max={150}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="d-flex align-items-center">
            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={isSubmitting}
            >
              {isEditing ? "Update" : "Create"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
