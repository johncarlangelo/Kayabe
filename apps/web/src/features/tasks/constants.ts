import { Task, TaskPriority, TaskStatus, TaskAssignee, StatusGroupConfig, ColumnDefinition } from "./types";

export const DEFAULT_ASSIGNEES: TaskAssignee[] = [
  {
    id: "user-1",
    name: "Alex Rivera",
    email: "alex@kayabe.io",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    color: "#f59e0b",
  },
  {
    id: "user-2",
    name: "Sarah Chen",
    email: "sarah@kayabe.io",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    color: "#ec4899",
  },
  {
    id: "user-3",
    name: "Marcus Vance",
    email: "marcus@kayabe.io",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    color: "#6366f1",
  },
  {
    id: "user-4",
    name: "Elena Rostova",
    email: "elena@kayabe.io",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    color: "#10b981",
  },
];

export const DEFAULT_STATUS_GROUPS: StatusGroupConfig[] = [
  { id: "TODO", name: "TO DO", color: "#94a3b8", collapsed: false },
  { id: "IN_PROGRESS", name: "IN PROGRESS", color: "#38bdf8", collapsed: false },
  { id: "IN_REVIEW", name: "IN REVIEW", color: "#a855f7", collapsed: false },
  { id: "DONE", name: "DONE", color: "#22c55e", collapsed: false },
];

export const DEFAULT_COLUMNS: ColumnDefinition[] = [
  { id: "name", label: "Name", visible: true, required: true },
  { id: "assignee", label: "Assignee", visible: true },
  { id: "dueDate", label: "Due date", visible: true },
  { id: "priority", label: "Priority", visible: true },
];

// Seed data matching the screenshot
export const INITIAL_TASKS: Task[] = [
  {
    id: "task-parent-1",
    title: "User Management",
    description: "Implement end-to-end user authentication, profile settings, and role-based permissions.",
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    assignedTo: "user-1",
    assignee: DEFAULT_ASSIGNEES[0],
    dueDate: "2026-07-13",
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      {
        id: "subtask-1",
        parentId: "task-parent-1",
        title: "Create user profile table",
        description: "Postgres schema with RLS policies, metadata triggers, and index optimization.",
        status: TaskStatus.TODO,
        priority: null,
        assignedTo: "user-1",
        assignee: DEFAULT_ASSIGNEES[0],
        dueDate: null,
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "subtask-2",
        parentId: "task-parent-1",
        title: "Connect user data with Supabase Auth",
        description: "Hook auth triggers to populate public profile and sync session states.",
        status: TaskStatus.TODO,
        priority: null,
        assignedTo: "user-1",
        assignee: DEFAULT_ASSIGNEES[0],
        dueDate: null,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "subtask-3",
        parentId: "task-parent-1",
        title: "Implement profile editing",
        description: "Client side form validation, avatar upload, and immediate profile updates.",
        status: TaskStatus.TODO,
        priority: null,
        assignedTo: "user-1",
        assignee: DEFAULT_ASSIGNEES[0],
        dueDate: null,
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "subtask-4",
        parentId: "task-parent-1",
        title: "Create role system",
        description: "Define ADMIN, MEMBER, GUEST roles and enforce permissions across workspace.",
        status: TaskStatus.TODO,
        priority: null,
        assignedTo: "user-1",
        assignee: DEFAULT_ASSIGNEES[0],
        dueDate: null,
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

export const PRIORITY_CONFIG = {
  [TaskPriority.URGENT]: {
    label: "Urgent",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.15)",
    border: "rgba(239, 68, 68, 0.3)",
  },
  [TaskPriority.HIGH]: {
    label: "High",
    color: "#f97316",
    bg: "rgba(249, 115, 22, 0.15)",
    border: "rgba(249, 115, 22, 0.3)",
  },
  [TaskPriority.MEDIUM]: {
    label: "Medium",
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.15)",
    border: "rgba(59, 130, 246, 0.3)",
  },
  [TaskPriority.LOW]: {
    label: "Low",
    color: "#9ca3af",
    bg: "rgba(156, 163, 175, 0.15)",
    border: "rgba(156, 163, 175, 0.3)",
  },
};
