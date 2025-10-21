import api from "./api";

export const attendanceService = {
  checkIn: async (data = {}) => {
    const response = await api.post("/attendance/checkin", data);
    return response.data;
  },

  checkOut: async (data = {}) => {
    const response = await api.put("/attendance/checkout", data);
    return response.data;
  },

  getMyAttendance: async (params = {}) => {
    const response = await api.get("/attendance/my-records", { params });
    return response.data;
  },

  getAllAttendance: async (params = {}) => {
    const response = await api.get("/attendance", { params });
    return response.data;
  },

  getEmployeeAttendance: async (employeeId, params = {}) => {
    const response = await api.get(`/attendance/employee/${employeeId}`, {
      params,
    });
    return response.data;
  },

  getSummary: async (params = {}) => {
    const response = await api.get("/attendance/summary/stats", { params });
    return response.data;
  },

  updateAttendance: async (id, data) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
  },

  deleteAttendance: async (id) => {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
  },
};
