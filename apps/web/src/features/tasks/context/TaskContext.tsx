"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Task,
  TaskStatus,
  TaskAssignee,
  StatusGroupConfig,
  ColumnDefinition,
  CreateTaskInput,
  UpdateTaskInput,
  ToastMessage,
} from "../types";
import {
  INITIAL_TASKS,
  DEFAULT_ASSIGNEES,
  DEFAULT_STATUS_GROUPS,
  DEFAULT_COLUMNS,
} from "../constants";
import { ToastContainer } from "../components/ui/ToastNotification";

interface TaskContextType {
  tasks: Task[];
  statusGroups: StatusGroupConfig[];
  assignees: TaskAssignee[];
  columns: ColumnDefinition[];
  expandedTaskIds: string[];
  collapsedStatusGroupIds: string[];
  selectedTaskId: string | null;
  selectedTask: Task | null;
  searchQuery: string;
  createTask: (input: CreateTaskInput) => Promise<Task | null>;
  createSubtask: (parentId: string, input: CreateTaskInput) => Promise<Task | null>;
  updateTask: (taskId: string, updates: UpdateTaskInput) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  toggleTaskStatus: (taskId: string) => Promise<boolean>;
  toggleSubtaskExpansion: (taskId: string) => void;
  toggleStatusGroupCollapse: (groupId: string) => void;
  addStatusGroup: (name: string, color?: string) => boolean;
  removeStatusGroup: (groupId: string) => boolean;
  toggleColumnVisibility: (columnId: string) => void;
  setSelectedTaskId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
  resetToInitialSeed: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "kayabe_tasks_data_v1";
const LOCAL_STORAGE_STATUS_KEY = "kayabe_status_groups_v1";

// Standalone recursive finder avoiding hook recursion issues
function findTaskRecursive(taskList: Task[], id: string): Task | null {
  for (const t of taskList) {
    if (t.id === id) return t;
    if (t.subtasks && t.subtasks.length > 0) {
      const found = findTaskRecursive(t.subtasks, id);
      if (found) return found;
    }
  }
  return null;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  // Tasks state initialized lazily
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedTasks) {
          const parsed = JSON.parse(savedTasks);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.error("Error loading tasks from localStorage", err);
      }
    }
    return INITIAL_TASKS;
  });

  const [statusGroups, setStatusGroups] = useState<StatusGroupConfig[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedStatuses = localStorage.getItem(LOCAL_STORAGE_STATUS_KEY);
        if (savedStatuses) {
          const parsedStatus = JSON.parse(savedStatuses);
          if (Array.isArray(parsedStatus) && parsedStatus.length > 0) {
            return parsedStatus;
          }
        }
      } catch (err) {
        console.error("Error loading statuses from localStorage", err);
      }
    }
    return DEFAULT_STATUS_GROUPS;
  });

  const [assignees] = useState<TaskAssignee[]>(DEFAULT_ASSIGNEES);
  const [columns, setColumns] = useState<ColumnDefinition[]>(DEFAULT_COLUMNS);

  // UI states
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>(["task-parent-1"]);
  const [collapsedStatusGroupIds, setCollapsedStatusGroupIds] = useState<string[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Save to localStorage whenever tasks change
  const persistTasks = useCallback((updatedTasks: Task[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
      }
    } catch (err) {
      console.error("Failed to persist tasks to localStorage", err);
    }
  }, []);

  const persistStatusGroups = useCallback((groups: StatusGroupConfig[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_STATUS_KEY, JSON.stringify(groups));
      }
    } catch (err) {
      console.error("Failed to persist status groups", err);
    }
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const selectedTask = selectedTaskId ? findTaskRecursive(tasks, selectedTaskId) : null;

  // Create Parent Task
  const createTask = async (input: CreateTaskInput): Promise<Task | null> => {
    try {
      const trimmedTitle = input.title?.trim();
      if (!trimmedTitle) {
        addToast({
          type: "error",
          title: "Title Required",
          message: "Please enter a valid title for your task.",
        });
        return null;
      }

      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: trimmedTitle,
        description: input.description || "",
        status: input.status || TaskStatus.TODO,
        priority: input.priority ?? null,
        assignedTo: input.assignedTo ?? input.assignee?.id ?? null,
        assignee: input.assignee ?? null,
        dueDate: input.dueDate ?? null,
        subtasks: [],
        order: tasks.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [...tasks, newTask];
      setTasks(updated);
      persistTasks(updated);

      addToast({
        type: "success",
        title: "Task Created",
        message: `"${trimmedTitle}" was added successfully.`,
      });

      return newTask;
    } catch (err) {
      console.error("Error creating task", err);
      addToast({
        type: "error",
        title: "Error Creating Task",
        message: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
      return null;
    }
  };

  // Create Subtask
  const createSubtask = async (parentId: string, input: CreateTaskInput): Promise<Task | null> => {
    try {
      const trimmedTitle = input.title?.trim();
      if (!trimmedTitle) {
        addToast({
          type: "error",
          title: "Subtask Title Required",
          message: "Please enter a valid title for the subtask.",
        });
        return null;
      }

      const newSubtask: Task = {
        id: `subtask-${Date.now()}`,
        parentId,
        title: trimmedTitle,
        description: input.description || "",
        status: input.status || TaskStatus.TODO,
        priority: input.priority ?? null,
        assignedTo: input.assignedTo ?? input.assignee?.id ?? null,
        assignee: input.assignee ?? null,
        dueDate: input.dueDate ?? null,
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let parentFound = false;
      const updated = tasks.map((parent) => {
        if (parent.id === parentId) {
          parentFound = true;
          const currentSubtasks = parent.subtasks || [];
          return {
            ...parent,
            subtasks: [...currentSubtasks, { ...newSubtask, order: currentSubtasks.length }],
            updatedAt: new Date().toISOString(),
          };
        }
        return parent;
      });

      if (!parentFound) {
        throw new Error("Parent task not found.");
      }

      setTasks(updated);
      persistTasks(updated);

      setExpandedTaskIds((prev) => (prev.includes(parentId) ? prev : [...prev, parentId]));

      addToast({
        type: "success",
        title: "Subtask Added",
        message: `"${trimmedTitle}" was added to subtasks.`,
      });

      return newSubtask;
    } catch (err) {
      console.error("Error creating subtask", err);
      addToast({
        type: "error",
        title: "Error Creating Subtask",
        message: err instanceof Error ? err.message : "Could not add subtask.",
      });
      return null;
    }
  };

  // Update Task or Subtask
  const updateTask = async (taskId: string, updates: UpdateTaskInput): Promise<boolean> => {
    try {
      let found = false;

      const updateTaskInList = (list: Task[]): Task[] => {
        return list.map((task) => {
          if (task.id === taskId) {
            found = true;
            return {
              ...task,
              ...updates,
              title: updates.title !== undefined ? updates.title.trim() : task.title,
              updatedAt: new Date().toISOString(),
            };
          }

          if (task.subtasks && task.subtasks.length > 0) {
            return {
              ...task,
              subtasks: updateTaskInList(task.subtasks),
            };
          }

          return task;
        });
      };

      const updated = updateTaskInList(tasks);

      if (!found) {
        throw new Error("Task not found to update.");
      }

      setTasks(updated);
      persistTasks(updated);

      return true;
    } catch (err) {
      console.error("Error updating task", err);
      addToast({
        type: "error",
        title: "Update Failed",
        message: err instanceof Error ? err.message : "Unable to save task changes.",
      });
      return false;
    }
  };

  // Toggle Task / Subtask Status
  const toggleTaskStatus = async (taskId: string): Promise<boolean> => {
    try {
      const task = findTaskRecursive(tasks, taskId);
      if (!task) return false;

      const nextStatus =
        task.status === TaskStatus.DONE
          ? TaskStatus.TODO
          : task.status === TaskStatus.TODO
          ? TaskStatus.DONE
          : TaskStatus.DONE;

      return await updateTask(taskId, { status: nextStatus });
    } catch (err) {
      console.error("Error toggling task status", err);
      return false;
    }
  };

  // Delete Task or Subtask
  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      const removeTaskFromList = (list: Task[]): Task[] => {
        return list
          .filter((t) => t.id !== taskId)
          .map((t) => {
            if (t.subtasks && t.subtasks.length > 0) {
              return {
                ...t,
                subtasks: removeTaskFromList(t.subtasks),
              };
            }
            return t;
          });
      };

      const updated = removeTaskFromList(tasks);
      setTasks(updated);
      persistTasks(updated);

      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }

      addToast({
        type: "info",
        title: "Task Deleted",
        message: "The task was removed.",
      });

      return true;
    } catch (err) {
      console.error("Error deleting task", err);
      addToast({
        type: "error",
        title: "Delete Failed",
        message: "Could not remove task.",
      });
      return false;
    }
  };

  const toggleSubtaskExpansion = (taskId: string) => {
    setExpandedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleStatusGroupCollapse = (groupId: string) => {
    setCollapsedStatusGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const addStatusGroup = (name: string, color = "#a855f7"): boolean => {
    const trimmed = name.trim();
    if (!trimmed) {
      addToast({
        type: "error",
        title: "Status Name Required",
        message: "Please specify a name for the new status column.",
      });
      return false;
    }

    const id = trimmed.toUpperCase().replace(/\s+/g, "_");
    if (statusGroups.some((g) => g.id === id || g.name.toLowerCase() === trimmed.toLowerCase())) {
      addToast({
        type: "warning",
        title: "Status Already Exists",
        message: `Status "${trimmed}" is already present.`,
      });
      return false;
    }

    const newGroup: StatusGroupConfig = {
      id,
      name: trimmed.toUpperCase(),
      color,
      collapsed: false,
    };

    const updated = [...statusGroups, newGroup];
    setStatusGroups(updated);
    persistStatusGroups(updated);

    addToast({
      type: "success",
      title: "Status Created",
      message: `Status group "${trimmed.toUpperCase()}" added.`,
    });

    return true;
  };

  const removeStatusGroup = (groupId: string): boolean => {
    if (groupId === "TODO") {
      addToast({
        type: "warning",
        title: "Cannot Delete Default Status",
        message: "The TO DO status is required.",
      });
      return false;
    }

    const updated = statusGroups.filter((g) => g.id !== groupId);
    setStatusGroups(updated);
    persistStatusGroups(updated);

    addToast({
      type: "info",
      title: "Status Removed",
      message: "The status group has been deleted.",
    });

    return true;
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === columnId && !col.required) {
          return { ...col, visible: !col.visible };
        }
        return col;
      })
    );
  };

  const resetToInitialSeed = () => {
    setTasks(INITIAL_TASKS);
    setStatusGroups(DEFAULT_STATUS_GROUPS);
    setExpandedTaskIds(["task-parent-1"]);
    persistTasks(INITIAL_TASKS);
    persistStatusGroups(DEFAULT_STATUS_GROUPS);

    addToast({
      type: "info",
      title: "Reset Complete",
      message: "Restored sample tasks from design mockup.",
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        statusGroups,
        assignees,
        columns,
        expandedTaskIds,
        collapsedStatusGroupIds,
        selectedTaskId,
        selectedTask,
        searchQuery,
        createTask,
        createSubtask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        toggleSubtaskExpansion,
        toggleStatusGroupCollapse,
        addStatusGroup,
        removeStatusGroup,
        toggleColumnVisibility,
        setSelectedTaskId,
        setSearchQuery,
        addToast,
        dismissToast,
        resetToInitialSeed,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
