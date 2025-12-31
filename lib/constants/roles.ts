export const USER_ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
  FREELANCER: "freelancer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_HIERARCHY = {
  [USER_ROLES.ADMIN]: 3,
  [USER_ROLES.CLIENT]: 2,
  [USER_ROLES.FREELANCER]: 1,
} as const;
