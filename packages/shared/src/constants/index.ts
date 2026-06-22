// Shared constants used across frontend and backend

import { UserRole } from "../types";

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ["*"],
  MEMBER: ["read:projects", "write:tasks", "read:tasks"],
  GUEST: ["read:tasks"],
};

export const TASK_STATUS_COLORS: Record<string, string> = {
  TODO: "#e5e7eb",
  IN_PROGRESS: "#fbbf24",
  IN_REVIEW: "#60a5fa",
  DONE: "#34d399",
};
