// Authentication related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "client" | "freelancer" | "admin";
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    userWithoutPassword?: UserProfile;
  };
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "client" | "freelancer" | "admin";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
