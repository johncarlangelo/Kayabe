"use client";

import React, { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "../types";
import { useTasks } from "../context/TaskContext";
import {
  DashedCircleIcon,
  CompletedCircleIcon,
  InProgressCircleIcon,
  DocumentNoteIcon,
  CalendarPlusIcon,
  PriorityFlagIcon,
} from "./icons/CustomIcons";
import { DatePickerPopover, formatDueDate } from "./popovers/DatePickerPopover";
import { PriorityPicker } from "./popovers/PriorityPicker";
import { AssigneePicker } from "./popovers/AssigneePicker";
import { StatusPicker } from "./popovers/StatusPicker";
import { Trash2 } from "lucide-react";

interface SubtaskRowProps {
  subtask: Task;
  parentId?: string;
}

export function SubtaskRow({ subtask }: SubtaskRowProps) {
  const { updateTask, deleteTask, setSelectedTaskId, columns } = useTasks();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(subtask.title);

  const isCompleted = subtask.status === TaskStatus.DONE;
  const isInProgress = subtask.status === TaskStatus.IN_PROGRESS;
  const dueDateInfo = formatDueDate(subtask.dueDate);

  const handleTitleSubmit = async () => {
    setIsEditingTitle(false);
    if (titleValue.trim() && titleValue.trim() !== subtask.title) {
      await updateTask(subtask.id, { title: titleValue.trim() });
    } else {
      setTitleValue(subtask.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    } else if (e.key === "Escape") {
      setTitleValue(subtask.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="group relative flex items-center h-10 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors text-xs select-none">
      {/* 1. Name Column (Indented under parent task) */}
      <div className="flex-1 flex items-center min-w-0 pl-8 sm:pl-10 pr-4 gap-2.5">
        {/* Status Indicator Icon */}
        <StatusPicker
          currentStatus={subtask.status}
          onSelectStatus={(status) => updateTask(subtask.id, { status })}
        >
          <button
            type="button"
            className="text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title={`Status: ${subtask.status}`}
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

        {/* Title / Inline Edit */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              className="w-full bg-white/5 border border-indigo-500/50 rounded px-1.5 py-0.5 text-white text-xs focus:outline-none"
            />
          ) : (
            <span
              onDoubleClick={() => setIsEditingTitle(true)}
              onClick={() => setSelectedTaskId(subtask.id)}
              className={`truncate cursor-pointer hover:text-indigo-200 transition-colors font-normal text-[#e2e8f0] ${
                isCompleted ? "line-through text-slate-500" : ""
              }`}
            >
              {subtask.title}
            </span>
          )}

          {/* Description Icon (≡) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTaskId(subtask.id);
            }}
            className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 p-0.5"
            title="Open subtask details"
          >
            <DocumentNoteIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Delete subtask action on hover */}
        <button
          type="button"
          onClick={() => deleteTask(subtask.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 rounded transition-opacity shrink-0"
          title="Delete subtask"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* 2. Assignee Column */}
      {columns.find((c) => c.id === "assignee")?.visible && (
        <div className="w-24 sm:w-28 flex items-center justify-start shrink-0 px-2">
          <AssigneePicker
            currentAssignee={subtask.assignee}
            onSelectAssignee={(assignee) =>
              updateTask(subtask.id, {
                assignee,
                assignedTo: assignee?.id || null,
              })
            }
          >
            {subtask.assignee ? (
              <div className="flex items-center gap-1.5 cursor-pointer group/avatar">
                <img
                  src={subtask.assignee.avatarUrl}
                  alt={subtask.assignee.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/20 group-hover/avatar:border-indigo-400 transition-colors"
                  title={subtask.assignee.name}
                />
              </div>
            ) : (
              <div
                className="w-5 h-5 rounded-full border border-dashed border-white/20 hover:border-white/40 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                title="Assign member"
              >
                <span className="text-[10px]">+</span>
              </div>
            )}
          </AssigneePicker>
        </div>
      )}

      {/* 3. Due Date Column */}
      {columns.find((c) => c.id === "dueDate")?.visible && (
        <div className="w-24 sm:w-28 flex items-center justify-start shrink-0 px-2">
          <DatePickerPopover
            currentDate={subtask.dueDate}
            onSelectDate={(dueDate) => updateTask(subtask.id, { dueDate })}
          >
            {dueDateInfo ? (
              <span
                className={`text-xs font-medium cursor-pointer transition-colors ${
                  dueDateInfo.isPastDue ? "text-rose-400 hover:text-rose-300" : "text-slate-300 hover:text-white"
                }`}
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
            currentPriority={subtask.priority}
            onSelectPriority={(priority) => updateTask(subtask.id, { priority })}
          >
            {subtask.priority ? (
              <div className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white transition-colors">
                <PriorityFlagIcon
                  size={14}
                  filled={true}
                  className={
                    subtask.priority === TaskPriority.URGENT
                      ? "text-rose-500"
                      : subtask.priority === TaskPriority.HIGH
                      ? "text-orange-500"
                      : subtask.priority === TaskPriority.MEDIUM
                      ? "text-blue-500"
                      : "text-slate-400"
                  }
                />
                <span className="capitalize text-[11px]">
                  {subtask.priority === TaskPriority.LOW ? "Low" : subtask.priority.toLowerCase()}
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
  );
}
