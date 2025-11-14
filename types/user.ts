// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "freelancer" | "admin";
  image?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "client" | "freelancer" | "admin";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
  expires: string;
}
