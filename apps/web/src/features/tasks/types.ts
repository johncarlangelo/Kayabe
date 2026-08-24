import type { Task } from "@kayabe/shared";
import { TaskPriority, TaskStatus } from "@kayabe/shared";

export type { Task };
export { TaskPriority, TaskStatus };

export interface TaskAssignee {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  color?: string;
}

export interface StatusGroupConfig {
  id: string;
  name: string;
  color?: string;
  collapsed?: boolean;
}

export type ViewMode = "list" | "board" | "calendar" | "gantt";

export interface ColumnDefinition {
  id: string;
  label: string;
  visible: boolean;
  width?: string;
  required?: boolean;
}

export interface CreateTaskInput {
  title: string;
  status?: string;
  parentId?: string | null;
  priority?: TaskPriority | null;
  dueDate?: string | null;
  assignedTo?: string | null;
  assignee?: TaskAssignee | null;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  status?: string;
  priority?: TaskPriority | null;
  dueDate?: string | null;
  assignedTo?: string | null;
  assignee?: TaskAssignee | null;
  description?: string;
  order?: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}
