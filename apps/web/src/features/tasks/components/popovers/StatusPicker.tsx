"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTasks } from "../../context/TaskContext";
import { DashedCircleIcon, InProgressCircleIcon, CompletedCircleIcon } from "../icons/CustomIcons";
import { Check } from "lucide-react";

interface StatusPickerProps {
  currentStatus: string;
  onSelectStatus: (status: string) => void;
  children: React.ReactNode;
}

export function StatusPicker({
  currentStatus,
  onSelectStatus,
  children,
}: StatusPickerProps) {
  const { statusGroups } = useTasks();
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

  const renderStatusIcon = (statusId: string) => {
    if (statusId === "DONE") {
      return <CompletedCircleIcon className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (statusId === "IN_PROGRESS") {
      return <InProgressCircleIcon className="w-3.5 h-3.5 text-sky-400" />;
    }
    return <DashedCircleIcon className="w-3.5 h-3.5 text-slate-400" />;
  };

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
          className="absolute left-0 top-full mt-2 z-50 w-48 rounded-2xl bg-[#121626] border border-white/15 p-2 shadow-2xl backdrop-blur-xl text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/10">
            Change Status
          </div>

          <div className="space-y-0.5 pt-1">
            {statusGroups.map((group) => {
              const isSelected = currentStatus === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => {
                    onSelectStatus(group.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    isSelected
                      ? "bg-white/15 text-white font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {renderStatusIcon(group.id)}
                    <span>{group.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
