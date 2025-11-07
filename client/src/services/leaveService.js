import api from "./api";

export const leaveService = {
  applyLeave: async (data) => {
    const response = await api.post("/v1/leaves", data);
    return response.data;
  },

  getMyLeaves: async (params = {}) => {
    const response = await api.get("/v1/leaves/my-leaves", { params });
    return response.data;
  },

  getAllLeaves: async (params = {}) => {
    const response = await api.get("/v1/leaves", { params });
    return response.data;
  },

  getLeave: async (id) => {
    const response = await api.get(`/v1/leaves/${id}`);
    return response.data;
  },

  approveLeave: async (id) => {
    const response = await api.put(`/v1/leaves/${id}/approve`);
    return response.data;
  },

  rejectLeave: async (id, rejectionReason) => {
    const response = await api.put(`/v1/leaves/${id}/reject`, { rejectionReason });
    return response.data;
  },

  cancelLeave: async (id) => {
    const response = await api.put(`/v1/leaves/${id}/cancel`);
    return response.data;
  },

  getLeaveBalance: async () => {
    const response = await api.get("/v1/leaves/balance");
    return response.data;
  },
};
