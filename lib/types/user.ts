import { USER_ROLES } from "../constants/roles";

export interface User {
  id: string;
  name: string;
  email: string;
  role: (typeof USER_ROLES)[keyof typeof USER_ROLES];
  avatar?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  experience?: string;
  portfolio?: string;
  rating?: number;
  totalProjects?: number;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  skills: string[];
  hourlyRate?: number;
  experience?: string;
  portfolio?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  availability?: "available" | "busy" | "on-leave";
  preferences?: {
    notificationEmails: boolean;
    notificationPush: boolean;
    timezone: string;
  };
}
