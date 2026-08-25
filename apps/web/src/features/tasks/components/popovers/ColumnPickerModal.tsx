"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTasks } from "../../context/TaskContext";
import { Check, SlidersHorizontal } from "lucide-react";

interface ColumnPickerModalProps {
  children: React.ReactNode;
}

export function ColumnPickerModal({ children }: ColumnPickerModalProps) {
  const { columns, toggleColumnVisibility } = useTasks();
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
          className="absolute right-0 top-full mt-2 z-50 w-52 rounded-2xl bg-[#121626] border border-white/15 p-2 shadow-2xl backdrop-blur-xl text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-slate-300 border-b border-white/10">
            <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
            <span>Customize Columns</span>
          </div>

          <div className="space-y-0.5">
            {columns.map((col) => (
              <button
                key={col.id}
                disabled={col.required}
                onClick={() => toggleColumnVisibility(col.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  col.required ? "opacity-60 cursor-not-allowed" : "hover:bg-white/5"
                } ${col.visible ? "text-white" : "text-slate-500"}`}
              >
                <span>{col.label}</span>
                {col.visible && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>

          <div className="pt-1 border-t border-white/10 px-2 text-[10px] text-slate-400">
            Click to toggle column visibility.
          </div>
        </div>
      )}
    </div>
  );
}
