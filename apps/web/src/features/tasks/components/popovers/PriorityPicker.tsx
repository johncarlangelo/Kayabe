"use client";

import React, { useState, useRef, useEffect } from "react";
import { TaskPriority } from "../../types";
import { PriorityFlagIcon } from "../icons/CustomIcons";
import { X } from "lucide-react";

interface PriorityPickerProps {
  currentPriority?: TaskPriority | null;
  onSelectPriority: (priority: TaskPriority | null) => void;
  children: React.ReactNode;
}

export function PriorityPicker({
  currentPriority,
  onSelectPriority,
  children,
}: PriorityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const options = [
    { priority: TaskPriority.URGENT, label: "Urgent", color: "#ef4444" },
    { priority: TaskPriority.HIGH, label: "High", color: "#f97316" },
    { priority: TaskPriority.MEDIUM, label: "Medium", color: "#3b82f6" },
    { priority: TaskPriority.LOW, label: "Low", color: "#9ca3af" },
  ];

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
          className="absolute left-0 top-full mt-2 z-50 w-44 rounded-2xl bg-[#121626] border border-white/15 p-2 shadow-2xl backdrop-blur-xl text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2 py-1 text-[10px] font-semibold tracking-wider uppercase text-slate-400 border-b border-white/10 flex items-center justify-between">
            <span>Set Priority</span>
            {currentPriority && (
              <button
                onClick={() => {
                  onSelectPriority(null);
                  setIsOpen(false);
                }}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-0.5 text-[10px]"
              >
                <X className="w-2.5 h-2.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="pt-1 space-y-0.5">
            {options.map((opt) => {
              const isSelected = currentPriority === opt.priority;
              return (
                <button
                  key={opt.priority}
                  onClick={() => {
                    onSelectPriority(opt.priority);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    isSelected
                      ? "bg-white/15 text-white font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PriorityFlagIcon
                      size={14}
                      filled={true}
                      style={{ color: opt.color }}
                      className="shrink-0"
                    />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
