import api from "./api";

export const performanceService = {
  createReview: async (data) => {
    const response = await api.post("/performance", data);
    return response.data;
  },

  getAllReviews: async (params = {}) => {
    const response = await api.get("/performance", { params });
    return response.data;
  },

  getMyReviews: async (params = {}) => {
    const response = await api.get("/performance/my-reviews", { params });
    return response.data;
  },

  getReview: async (id) => {
    const response = await api.get(`/performance/${id}`);
    return response.data;
  },

  updateReview: async (id, data) => {
    const response = await api.put(`/performance/${id}`, data);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/performance/${id}`);
    return response.data;
  },

  submitReview: async (id) => {
    const response = await api.put(`/performance/${id}/submit`);
    return response.data;
  },

  acknowledgeReview: async (id, employeeComments) => {
    const response = await api.put(`/performance/${id}/acknowledge`, {
      employeeComments,
    });
    return response.data;
  },

  getEmployeeStats: async (employeeId) => {
    const response = await api.get(`/performance/employee/${employeeId}/stats`);
    return response.data;
  },
};
