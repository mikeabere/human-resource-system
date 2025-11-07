import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/v1/auth/login", { email, password });
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("v1/auth/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getMe: async () => {
    const response = await api.get("/v1/auth/me");
    return response.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put("/v1/auth/update-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
