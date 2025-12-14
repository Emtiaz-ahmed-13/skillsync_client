import apiClient from "../utils/apiClient";

// User Registration
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: "client" | "freelancer";
}) => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Registration failed");
  }
};

// User Login
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);

    // Store tokens
    if (response.data?.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }

    return response;
  } catch (error: any) {
    throw new Error(error.message || "Login failed");
  }
};

// Get User Profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/auth/profile");
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch profile");
  }
};

// Update User Profile
export const updateUserProfile = async (profileData: any) => {
  try {
    const response = await apiClient.put("/profile", profileData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update profile");
  }
};

// Change Password
export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await apiClient.post(
      "/auth/change-password",
      passwordData
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to change password");
  }
};
