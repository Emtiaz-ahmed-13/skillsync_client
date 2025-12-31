export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  PROJECTS: {
    ALL: "/api/projects",
    BY_ID: (id: string) => `/api/projects/${id}`,
    CREATE: "/api/projects",
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`,
  },
  USERS: {
    ALL: "/api/users",
    BY_ID: (id: string) => `/api/users/${id}`,
    PROFILE: "/api/users/profile",
    UPDATE_PROFILE: "/api/users/profile",
  },
  TASKS: {
    ALL: "/api/tasks",
    BY_PROJECT: (projectId: string) => `/api/tasks?projectId=${projectId}`,
    BY_ID: (id: string) => `/api/tasks/${id}`,
    CREATE: "/api/tasks",
    UPDATE: (id: string) => `/api/tasks/${id}`,
  },
  BIDS: {
    BY_PROJECT: (projectId: string) => `/api/bids?projectId=${projectId}`,
    CREATE: "/api/bids",
  },
  MESSAGES: {
    BY_PROJECT: (projectId: string) => `/api/messages?projectId=${projectId}`,
    SEND: "/api/messages",
  },
  FILES: {
    UPLOAD: "/api/files/upload",
    BY_PROJECT: (projectId: string) => `/api/files?projectId=${projectId}`,
  },
} as const;
