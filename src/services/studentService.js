import axios from "axios";

const api = axios.create({
  baseURL: "https://crud-assignment-2.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;


export const fetchStudents = async (page, limit) => {
  const response = await api.get("/students", {
    params: { page, limit },
  });
  return response.data;
};

export const createStudent = async (payload) => {
  const response = await api.post("/students", payload);
  return response.data;
};

export const updateStudent = async (id, payload) => {
  const response = await api.put(`/students/${id}`, payload);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};
