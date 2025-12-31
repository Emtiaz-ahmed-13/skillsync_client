// Main constants index file - exports all constants
export * from "./api";
export * from "./project";
export * from "./roles";

export const APP_CONFIG = {
  NAME: "SkillSync",
  VERSION: "1.0.0",
  DESCRIPTION: "Freelance project management platform",
} as const;

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const;

export const MESSAGES = {
  SUCCESS: {
    PROJECT_CREATED: "Project created successfully",
    PROJECT_UPDATED: "Project updated successfully",
    PROJECT_DELETED: "Project deleted successfully",
    TASK_CREATED: "Task created successfully",
    TASK_UPDATED: "Task updated successfully",
    BID_SUBMITTED: "Bid submitted successfully",
    PROFILE_UPDATED: "Profile updated successfully",
  },
  ERROR: {
    UNAUTHORIZED: "Unauthorized access",
    PROJECT_NOT_FOUND: "Project not found",
    USER_NOT_FOUND: "User not found",
    TASK_NOT_FOUND: "Task not found",
    BID_NOT_FOUND: "Bid not found",
    INVALID_CREDENTIALS: "Invalid credentials",
    NETWORK_ERROR: "Network error occurred",
    SERVER_ERROR: "Server error occurred",
  },
} as const;
