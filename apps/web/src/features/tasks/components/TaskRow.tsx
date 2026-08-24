"use client";

import React, { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "../types";
import { useTasks } from "../context/TaskContext";
import { SubtaskRow } from "./SubtaskRow";
import { InlineTaskCreator } from "./InlineTaskCreator";
import {
  DashedCircleIcon,
  CompletedCircleIcon,
  InProgressCircleIcon,
  SubtaskBranchIcon,
  DocumentNoteIcon,
  PriorityFlagIcon,
  CalendarPlusIcon,
} from "./icons/CustomIcons";
import { DatePickerPopover, formatDueDate } from "./popovers/DatePickerPopover";
import { PriorityPicker } from "./popovers/PriorityPicker";
import { AssigneePicker } from "./popovers/AssigneePicker";
import { StatusPicker } from "./popovers/StatusPicker";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

interface TaskRowProps {
  task: Task;
}

export function TaskRow({ task }: TaskRowProps) {
  const {
    updateTask,
    deleteTask,
    createSubtask,
    expandedTaskIds,
    toggleSubtaskExpansion,
    setSelectedTaskId,
    columns,
  } = useTasks();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const isExpanded = expandedTaskIds.includes(task.id);
  const subtasks = task.subtasks || [];
  const hasSubtasks = subtasks.length > 0;
  const isCompleted = task.status === TaskStatus.DONE;
  const isInProgress = task.status === TaskStatus.IN_PROGRESS;
  const dueDateInfo = formatDueDate(task.dueDate);

  const handleTitleSubmit = async () => {
    setIsEditingTitle(false);
    if (titleValue.trim() && titleValue.trim() !== task.title) {
      await updateTask(task.id, { title: titleValue.trim() });
    } else {
      setTitleValue(task.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    } else if (e.key === "Escape") {
      setTitleValue(task.title);
      setIsEditingTitle(false);
    }
  };

  const handleAddSubtaskSubmit = async (subtaskTitle: string) => {
    await createSubtask(task.id, { title: subtaskTitle, status: TaskStatus.TODO });
    setIsAddingSubtask(false);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Main Parent Task Row */}
      <div className="group relative flex items-center h-10 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors text-xs select-none">
        {/* 1. Name & Metadata Column */}
        <div className="flex-1 flex items-center min-w-0 pl-2 sm:pl-3 pr-4 gap-2">
          {/* Subtask Expand/Collapse Chevron */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSubtaskExpansion(task.id);
            }}
            className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0 p-0.5"
            title={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Status Indicator Icon */}
          <StatusPicker
            currentStatus={task.status}
            onSelectStatus={(status) => updateTask(task.id, { status })}
          >
            <button
              type="button"
              className="text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title={`Status: ${task.status}`}
            >
              {isCompleted ? (
                <CompletedCircleIcon className="w-4 h-4 text-emerald-400" />
              ) : isInProgress ? (
                <InProgressCircleIcon className="w-4 h-4 text-sky-400" />
              ) : (
                <DashedCircleIcon className="w-4 h-4 text-slate-400 hover:text-slate-200" />
              )}
            </button>
          </StatusPicker>

          {/* Title & Icons */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleKeyDown}
                className="w-full bg-white/5 border border-indigo-500/50 rounded px-2 py-0.5 text-white text-xs font-medium focus:outline-none"
              />
            ) : (
              <span
                onDoubleClick={() => setIsEditingTitle(true)}
                onClick={() => setSelectedTaskId(task.id)}
                className={`truncate cursor-pointer hover:text-indigo-200 transition-colors font-semibold text-white text-xs sm:text-[13px] ${
                  isCompleted ? "line-through text-slate-500 font-normal" : ""
                }`}
              >
                {task.title}
              </span>
            )}

            {/* Subtask count badge (branch icon + count) */}
            {hasSubtasks && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubtaskExpansion(task.id);
                }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
                title={`${subtasks.length} subtasks`}
              >
                <SubtaskBranchIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-400">{subtasks.length}</span>
              </button>
            )}

            {/* Notes/Details Icon (≡) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTaskId(task.id);
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 p-0.5"
              title="View task description"
            >
              <DocumentNoteIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hover Actions: Add Subtask & Delete */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsAddingSubtask(true);
                if (!isExpanded) toggleSubtaskExpansion(task.id);
              }}
              className="text-slate-400 hover:text-indigo-300 p-1 rounded hover:bg-white/5 transition-colors"
              title="Add subtask"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-white/5 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Assignee Column */}
        {columns.find((c) => c.id === "assignee")?.visible && (
          <div className="w-24 sm:w-28 flex items-center justify-start shrink-0 px-2">
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
                <div className="flex items-center gap-1.5 cursor-pointer group/avatar">
                  <img
                    src={task.assignee.avatarUrl}
                    alt={task.assignee.name}
                    className="w-6 h-6 rounded-full object-cover border border-white/20 group-hover/avatar:border-indigo-400 transition-colors shadow-sm"
                    title={task.assignee.name}
                  />
                </div>
              ) : (
                <div
                  className="w-6 h-6 rounded-full border border-dashed border-white/20 hover:border-white/40 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title="Assign member"
                >
                  <span className="text-[10px]">+</span>
                </div>
              )}
            </AssigneePicker>
          </div>
        )}

        {/* 3. Due Date Column (Styled in red like 7/13/26 in screenshot) */}
        {columns.find((c) => c.id === "dueDate")?.visible && (
          <div className="w-24 sm:w-28 flex items-center justify-start shrink-0 px-2">
            <DatePickerPopover
              currentDate={task.dueDate}
              onSelectDate={(dueDate) => updateTask(task.id, { dueDate })}
            >
              {dueDateInfo ? (
                <span
                  className="text-xs font-semibold text-rose-500 hover:text-rose-400 cursor-pointer transition-colors"
                  title="Due date"
                >
                  {dueDateInfo.formatted}
                </span>
              ) : (
                <div
                  className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer p-0.5"
                  title="Set due date"
                >
                  <CalendarPlusIcon className="w-4 h-4" />
                </div>
              )}
            </DatePickerPopover>
          </div>
        )}

        {/* 4. Priority Column */}
        {columns.find((c) => c.id === "priority")?.visible && (
          <div className="w-20 sm:w-24 flex items-center justify-start shrink-0 px-2">
            <PriorityPicker
              currentPriority={task.priority}
              onSelectPriority={(priority) => updateTask(task.id, { priority })}
            >
              {task.priority ? (
                <div className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white transition-colors">
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
                  <span className="capitalize text-xs text-slate-300 font-medium">
                    {task.priority === TaskPriority.LOW ? "Low" : task.priority.toLowerCase()}
                  </span>
                </div>
              ) : (
                <div
                  className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer p-0.5"
                  title="Set priority"
                >
                  <PriorityFlagIcon size={15} filled={false} />
                </div>
              )}
            </PriorityPicker>
          </div>
        )}
      </div>

      {/* Subtasks Container */}
      {isExpanded && (
        <div className="flex flex-col bg-black/10">
          {subtasks.map((subtask) => (
            <SubtaskRow key={subtask.id} subtask={subtask} parentId={task.id} />
          ))}

          {/* Inline Subtask Creator when opened */}
          {isAddingSubtask && (
            <InlineTaskCreator
              placeholder="Subtask name..."
              parentId={task.id}
              isSubtask={true}
              onSave={handleAddSubtaskSubmit}
              onCancel={() => setIsAddingSubtask(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
