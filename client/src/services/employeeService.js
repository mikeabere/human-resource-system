import api from "./api";

export const employeeService = {
  getEmployees: async (params = {}) => {
    const response = await api.get("/v1/employees", { params });
    return response.data;
  },

  getEmployee: async (id) => {
    const response = await api.get(`/v1/employees/${id}`);
    return response.data;
  },

  createEmployee: async (data) => {
    const response = await api.post("/v1/employees", data);
    return response.data;
  },

  updateEmployee: async (id, data) => {
    const response = await api.put(`/v1/employees/${id}`, data);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/v1/employees/${id}`);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get("/v1/employees/me/profile");
    return response.data;
  },

  updateMyProfile: async (data) => {
    const response = await api.put("/v1/employees/me/profile", data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/v1/employees/stats/overview");
    return response.data;
  },
};
