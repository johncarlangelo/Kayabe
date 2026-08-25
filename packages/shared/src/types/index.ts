// Shared types and interfaces used across frontend and backend
// Define Task, Project, Workspace, User, Role, etc. here

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  GUEST = "GUEST",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
}

export interface Task {
  id: string;
  projectId?: string;
  parentId?: string | null;
  title: string;
  description?: string;
  status: TaskStatus | string;
  priority?: TaskPriority | null;
  assignedTo?: string | null;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  } | null;
  dueDate?: string | null;
  subtasks?: Task[];
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

