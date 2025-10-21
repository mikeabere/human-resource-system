import api from "./api";

export const leaveService = {
  applyLeave: async (data) => {
    const response = await api.post("/leaves", data);
    return response.data;
  },

  getMyLeaves: async (params = {}) => {
    const response = await api.get("/leaves/my-leaves", { params });
    return response.data;
  },

  getAllLeaves: async (params = {}) => {
    const response = await api.get("/leaves", { params });
    return response.data;
  },

  getLeave: async (id) => {
    const response = await api.get(`/leaves/${id}`);
    return response.data;
  },

  approveLeave: async (id) => {
    const response = await api.put(`/leaves/${id}/approve`);
    return response.data;
  },

  rejectLeave: async (id, rejectionReason) => {
    const response = await api.put(`/leaves/${id}/reject`, { rejectionReason });
    return response.data;
  },

  cancelLeave: async (id) => {
    const response = await api.put(`/leaves/${id}/cancel`);
    return response.data;
  },

  getLeaveBalance: async () => {
    const response = await api.get("/leaves/balance");
    return response.data;
  },
};
