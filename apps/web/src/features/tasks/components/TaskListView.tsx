"use client";

import React, { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskStatusGroup } from "./TaskStatusGroup";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { NewStatusModal } from "./popovers/NewStatusModal";
import { TaskErrorBoundary } from "./ui/ErrorBoundary";
import {
  Plus,
  Search,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

export function TaskListView() {
  const {
    statusGroups,
    searchQuery,
    setSearchQuery,
    resetToInitialSeed,
    tasks,
  } = useTasks();

  const [isNewStatusOpen, setIsNewStatusOpen] = useState(false);

  // Total completed vs total count
  const allTasksCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "DONE").length;

  return (
    <TaskErrorBoundary>
      <div className="w-full max-w-7xl mx-auto flex flex-col space-y-4">
        {/* Top Filter & Toolbar Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{completedCount}/{allTasksCount} completed</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToInitialSeed}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              title="Reset task data to match the screenshot"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reset to Screenshot Demo</span>
            </button>
          </div>
        </div>

        {/* Main Task List Table Area */}
        <div className="w-full rounded-2xl bg-[#090c15] border border-white/[0.08] p-4 sm:p-6 shadow-2xl space-y-6">
          {/* Status Groups */}
          {statusGroups.map((group, index) => (
            <TaskStatusGroup
              key={group.id}
              group={group}
              showColumnHeader={index === 0}
            />
          ))}

          {/* '+ New status' Button at the bottom (matching screenshot) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsNewStatusOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] text-xs font-medium transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-400" />
              <span>New status</span>
            </button>
          </div>
        </div>

        {/* Modals & Drawers */}
        <NewStatusModal
          isOpen={isNewStatusOpen}
          onClose={() => setIsNewStatusOpen(false)}
        />
        <TaskDetailDrawer />
      </div>
    </TaskErrorBoundary>
  );
}
