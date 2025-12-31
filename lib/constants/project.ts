export const PROJECT_STATUS = {
  DRAFT: "draft",
  PENDING_APPROVAL: "pending_approval",
  APPROVED: "approved",
  ACTIVE: "active",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  ARCHIVED: "archived",
} as const;

export type ProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const PROJECT_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export type ProjectPriority =
  (typeof PROJECT_PRIORITY)[keyof typeof PROJECT_PRIORITY];

export const PROJECT_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
  INTERNAL: "internal",
} as const;

export type ProjectVisibility =
  (typeof PROJECT_VISIBILITY)[keyof typeof PROJECT_VISIBILITY];
