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
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
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
