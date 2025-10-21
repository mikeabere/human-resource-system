import api from "./api";

export const employeeService = {
  getEmployees: async (params = {}) => {
    const response = await api.get("/employees", { params });
    return response.data;
  },

  getEmployee: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (data) => {
    const response = await api.post("/employees", data);
    return response.data;
  },

  updateEmployee: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get("/employees/me/profile");
    return response.data;
  },

  updateMyProfile: async (data) => {
    const response = await api.put("/employees/me/profile", data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/employees/stats/overview");
    return response.data;
  },
};
