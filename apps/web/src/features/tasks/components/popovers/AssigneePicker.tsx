"use client";

import React, { useState, useRef, useEffect } from "react";
import { TaskAssignee } from "../../types";
import { DEFAULT_ASSIGNEES } from "../../constants";
import { Search, X, Check } from "lucide-react";

interface AssigneePickerProps {
  currentAssignee?: TaskAssignee | null;
  onSelectAssignee: (assignee: TaskAssignee | null) => void;
  children: React.ReactNode;
}

export function AssigneePicker({
  currentAssignee,
  onSelectAssignee,
  children,
}: AssigneePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredAssignees = DEFAULT_ASSIGNEES.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-flex items-center" ref={popoverRef}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-2 z-50 w-56 rounded-2xl bg-[#121626] border border-white/15 p-2 shadow-2xl backdrop-blur-xl text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header & Search */}
          <div className="space-y-1.5 border-b border-white/10 pb-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span>Assignee</span>
              {currentAssignee && (
                <button
                  onClick={() => {
                    onSelectAssignee(null);
                    setIsOpen(false);
                  }}
                  className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                  <span>Unassign</span>
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search member..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filteredAssignees.map((assignee) => {
              const isSelected = currentAssignee?.id === assignee.id;
              return (
                <button
                  key={assignee.id}
                  onClick={() => {
                    onSelectAssignee(assignee);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left transition-colors ${
                    isSelected ? "bg-white/15" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={assignee.avatarUrl}
                      alt={assignee.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/20 shrink-0"
                    />
                    <div className="min-w-0 truncate">
                      <p className="text-xs font-medium text-white truncate leading-tight">
                        {assignee.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate leading-tight">
                        {assignee.email}
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
                </button>
              );
            })}

            {filteredAssignees.length === 0 && (
              <p className="text-center py-2 text-[11px] text-slate-500">No member found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
