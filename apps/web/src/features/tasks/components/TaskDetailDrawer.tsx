"use client";

import React, { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { Task, TaskPriority, TaskStatus } from "../types";
import {
  DashedCircleIcon,
  CompletedCircleIcon,
  PriorityFlagIcon,
  DocumentNoteIcon,
  SubtaskBranchIcon,
} from "./icons/CustomIcons";
import { DatePickerPopover, formatDueDate } from "./popovers/DatePickerPopover";
import { PriorityPicker } from "./popovers/PriorityPicker";
import { AssigneePicker } from "./popovers/AssigneePicker";
import { StatusPicker } from "./popovers/StatusPicker";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  User,
  Clock,
} from "lucide-react";

interface TaskDetailContentProps {
  task: Task;
  onClose: () => void;
}

function TaskDetailContent({ task, onClose }: TaskDetailContentProps) {
  const { updateTask, deleteTask, createSubtask } = useTasks();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const subtasks = task.subtasks || [];
  const dueDateInfo = formatDueDate(task.dueDate);

  const handleTitleBlur = () => {
    if (title.trim() && title.trim() !== task.title) {
      updateTask(task.id, { title: title.trim() });
    }
  };

  const handleDescBlur = () => {
    if (description !== (task.description || "")) {
      updateTask(task.id, { description });
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    await createSubtask(task.id, { title: newSubtaskTitle.trim() });
    setNewSubtaskTitle("");
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative z-10 w-full max-w-xl bg-[#0e1220] border-l border-white/10 shadow-2xl flex flex-col h-full overflow-y-auto animate-in slide-in-from-right duration-250 text-slate-200"
    >
      {/* Drawer Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e1220]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <StatusPicker
            currentStatus={task.status}
            onSelectStatus={(status) => updateTask(task.id, { status })}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              {task.status === TaskStatus.DONE ? (
                <CompletedCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <DashedCircleIcon className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{task.status}</span>
            </button>
          </StatusPicker>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => deleteTask(task.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close panel (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="p-6 space-y-6 flex-1">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full text-xl sm:text-2xl font-bold text-white bg-transparent border-b border-transparent hover:border-white/15 focus:border-indigo-500 focus:outline-none transition-colors pb-1"
            placeholder="Task title..."
          />
        </div>

        {/* Quick Properties Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
          {/* Assignee */}
          <div className="flex flex-col gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Assignee</span>
            </span>
            <AssigneePicker
              currentAssignee={task.assignee}
              onSelectAssignee={(assignee) =>
                updateTask(task.id, {
                  assignee,
                  assignedTo: assignee?.id || null,
                })
              }
            >
              {task.assignee ? (
                <div className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <img
                    src={task.assignee.avatarUrl}
                    alt={task.assignee.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/20"
                  />
                  <span className="text-white font-medium text-xs truncate">
                    {task.assignee.name}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 hover:text-white py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer inline-block">
                  + Assign member
                </span>
              )}
            </AssigneePicker>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>Due Date</span>
            </span>
            <DatePickerPopover
              currentDate={task.dueDate}
              onSelectDate={(dueDate) => updateTask(task.id, { dueDate })}
            >
              {dueDateInfo ? (
                <div className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <span
                    className={`font-semibold text-xs ${
                      dueDateInfo.isPastDue ? "text-rose-400" : "text-white"
                    }`}
                  >
                    {dueDateInfo.formatted}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 hover:text-white py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer inline-block">
                  + Set date
                </span>
              )}
            </DatePickerPopover>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <PriorityFlagIcon size={14} className="text-amber-400" />
              <span>Priority</span>
            </span>
            <PriorityPicker
              currentPriority={task.priority}
              onSelectPriority={(priority) => updateTask(task.id, { priority })}
            >
              {task.priority ? (
                <div className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <PriorityFlagIcon
                    size={14}
                    filled={true}
                    className={
                      task.priority === TaskPriority.URGENT
                        ? "text-rose-500"
                        : task.priority === TaskPriority.HIGH
                        ? "text-orange-500"
                        : task.priority === TaskPriority.MEDIUM
                        ? "text-blue-500"
                        : "text-slate-400"
                    }
                  />
                  <span className="capitalize text-white font-medium text-xs">
                    {task.priority === TaskPriority.LOW
                      ? "Low"
                      : task.priority.toLowerCase()}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 hover:text-white py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer inline-block">
                  + Set priority
                </span>
              )}
            </PriorityPicker>
          </div>

          {/* Timestamps */}
          <div className="flex flex-col gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Created</span>
            </span>
            <span className="py-1 px-2 text-slate-300 text-xs">
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString()
                : "Just now"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <DocumentNoteIcon className="w-4 h-4 text-indigo-400" />
            <span>Description</span>
          </div>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescBlur}
            placeholder="Add details, notes, or implementation guidelines..."
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y"
          />
        </div>

        {/* Subtasks Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <SubtaskBranchIcon className="w-4 h-4 text-sky-400" />
              <span>Subtasks ({subtasks.length})</span>
            </div>
          </div>

          <div className="space-y-1.5">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() =>
                      updateTask(subtask.id, {
                        status:
                          subtask.status === TaskStatus.DONE
                            ? TaskStatus.TODO
                            : TaskStatus.DONE,
                      })
                    }
                    className="cursor-pointer text-slate-400 hover:text-white transition-colors shrink-0"
                  >
                    {subtask.status === TaskStatus.DONE ? (
                      <CompletedCircleIcon className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <DashedCircleIcon className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <span
                    className={`truncate text-slate-200 ${
                      subtask.status === TaskStatus.DONE ? "line-through text-slate-500" : ""
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>

                <button
                  onClick={() => deleteTask(subtask.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Add subtask input */}
            <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add a new subtask..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaskDetailDrawer() {
  const { selectedTaskId, selectedTask, setSelectedTaskId } = useTasks();

  if (!selectedTaskId || !selectedTask) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={() => setSelectedTaskId(null)}
      />
      <TaskDetailContent
        key={selectedTask.id}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
}
