"use client";

import React, { useState } from "react";
import { StatusGroupConfig, TaskStatus } from "../types";
import { useTasks } from "../context/TaskContext";
import { TaskRow } from "./TaskRow";
import { InlineTaskCreator } from "./InlineTaskCreator";
import { ColumnPickerModal } from "./popovers/ColumnPickerModal";
import { DashedCircleIcon } from "./icons/CustomIcons";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  PlusCircle,
} from "lucide-react";

interface TaskStatusGroupProps {
  group: StatusGroupConfig;
  showColumnHeader?: boolean;
}

export function TaskStatusGroup({ group, showColumnHeader = true }: TaskStatusGroupProps) {
  const {
    tasks,
    createTask,
    collapsedStatusGroupIds,
    toggleStatusGroupCollapse,
    columns,
    searchQuery,
  } = useTasks();

  const [isAddingTask, setIsAddingTask] = useState(false);
  const isCollapsed = collapsedStatusGroupIds.includes(group.id);

  // Filter tasks for this status group and apply search query
  const groupTasks = tasks.filter((task) => {
    // Only top-level tasks (no parentId)
    if (task.parentId) return false;

    // Match status group
    const matchesStatus = (task.status || TaskStatus.TODO) === group.id;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;

    // Search matches either parent task title/desc or any subtask title
    const q = searchQuery.toLowerCase();
    const matchesParent =
      task.title.toLowerCase().includes(q) ||
      (task.description && task.description.toLowerCase().includes(q));
    const matchesSubtasks =
      task.subtasks && task.subtasks.some((st) => st.title.toLowerCase().includes(q));

    return matchesParent || matchesSubtasks;
  });

  const handleCreateTaskSubmit = async (title: string) => {
    await createTask({
      title,
      status: group.id,
    });
    setIsAddingTask(false);
  };

  return (
    <div className="w-full mb-6">
      {/* Group Header & Column Bar */}
      <div className="flex items-center justify-between h-9 text-xs select-none border-b border-white/10 pb-1">
        {/* Left: Status Pill & Count */}
        <div className="flex items-center gap-2">
          {/* Collapse/Expand Chevron */}
          <button
            type="button"
            onClick={() => toggleStatusGroupCollapse(group.id)}
            className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? "Expand section" : "Collapse section"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Status Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white font-semibold text-[11px] tracking-wide shadow-sm">
            <DashedCircleIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>{group.name}</span>
          </div>

          {/* Task count */}
          <span className="text-xs text-slate-400 font-normal ml-1">
            {groupTasks.length}
          </span>
        </div>

        {/* Right: Table Column Headers + '+ Add' Button */}
        {showColumnHeader && (
          <div className="flex items-center text-slate-400 text-xs">
            {columns.find((c) => c.id === "assignee")?.visible && (
              <div className="w-24 sm:w-28 text-left px-2 font-normal text-slate-400">
                Assignee
              </div>
            )}
            {columns.find((c) => c.id === "dueDate")?.visible && (
              <div className="w-24 sm:w-28 text-left px-2 font-normal text-slate-400">
                Due date
              </div>
            )}
            {columns.find((c) => c.id === "priority")?.visible && (
              <div className="w-20 sm:w-24 text-left px-2 font-normal text-slate-400">
                Priority
              </div>
            )}

            {/* Green '+ Add' Button on far right as shown in screenshot */}
            <ColumnPickerModal>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs font-semibold transition-all cursor-pointer"
                title="Customize table columns"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add</span>
              </button>
            </ColumnPickerModal>
          </div>
        )}
      </div>

      {/* Group Content (When not collapsed) */}
      {!isCollapsed && (
        <div className="w-full flex flex-col">
          {/* List of Tasks */}
          {groupTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}

          {/* Inline Task Creator (when triggered) */}
          {isAddingTask && (
            <InlineTaskCreator
              placeholder="Task name..."
              status={group.id}
              onSave={handleCreateTaskSubmit}
              onCancel={() => setIsAddingTask(false)}
            />
          )}

          {/* '+ Add Task' Button */}
          {!isAddingTask && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsAddingTask(true)}
                className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] text-xs font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-400" />
                <span>Add Task</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
