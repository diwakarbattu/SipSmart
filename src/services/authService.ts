import api from "./api";

export const authService = {
  login: async (identity: string, password: string) => {
    const response = await api.post("/auth/login", { identity, password });
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user_data", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("user_data", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    // Placeholder: Needs backend implementation
    return api.post("/auth/change-password", { currentPassword, newPassword });
  },

  deleteAccount: async () => {
    // Placeholder: Needs backend implementation
    return api.delete("/auth/account");
  },

  sendForgotPasswordOtp: async (email: string) => {
    return api.post("/auth/forgot-password/send-otp", { email });
  },

  resetPasswordWithOtp: async (
    email: string,
    otp: string,
    newPassword: string,
  ) => {
    return api.post("/auth/forgot-password/reset", { email, otp, newPassword });
  },

  getCurrentUser: () => {
    const data = localStorage.getItem("user_data");
    return data ? JSON.parse(data) : null;
  },

  updateCurrentUser: (userData: any) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    }
  },
};
