import apiClient from "../utils/apiClient";

// Get All Users (Admin Only)
export const getAllUsers = async (params: Record<string, any> = {}) => {
  try {
    const response = await apiClient.get("/admin/users", params);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch users");
  }
};

// Get User By ID (Admin Only)
export const getUserById = async (userId: string) => {
  try {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch user");
  }
};

// Update User Role (Admin Only)
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/role`, {
      role,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update user role");
  }
};
