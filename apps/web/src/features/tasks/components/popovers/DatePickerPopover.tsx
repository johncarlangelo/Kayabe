"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, X, Clock } from "lucide-react";

interface DatePickerPopoverProps {
  currentDate?: string | null;
  onSelectDate: (dateStr: string | null) => void;
  children: React.ReactNode;
}

export function DatePickerPopover({
  currentDate,
  onSelectDate,
  children,
}: DatePickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customDate, setCustomDate] = useState(currentDate || "");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  const handleQuickSelect = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const iso = d.toISOString().split("T")[0];
    onSelectDate(iso);
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDate) {
      onSelectDate(customDate);
    } else {
      onSelectDate(null);
    }
    setIsOpen(false);
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
          className="absolute left-0 top-full mt-2 z-50 w-64 rounded-2xl bg-[#121626] border border-white/15 p-3 shadow-2xl backdrop-blur-xl text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Set Due Date</span>
            </div>
            {currentDate && (
              <button
                onClick={() => {
                  onSelectDate(null);
                  setIsOpen(false);
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleQuickSelect(0)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left text-slate-200 hover:text-white transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => handleQuickSelect(1)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left text-slate-200 hover:text-white transition-colors"
            >
              Tomorrow
            </button>
            <button
              onClick={() => handleQuickSelect(7)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left text-slate-200 hover:text-white transition-colors"
            >
              Next Week
            </button>
            <button
              onClick={() => {
                // Set to 7/13/2026 like screenshot
                onSelectDate("2026-07-13");
                setIsOpen(false);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-left text-indigo-300 transition-colors"
            >
              7/13/26 (Demo)
            </button>
          </div>

          {/* Custom Date Input */}
          <form onSubmit={handleCustomSubmit} className="space-y-2 pt-1 border-t border-white/5">
            <label className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Choose Date:</span>
            </label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded-md text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// Formatter to render M/D/YY (like 7/13/26 in screenshot)
export function formatDueDate(dateString?: string | null): { formatted: string; isPastDue: boolean } | null {
  if (!dateString) return null;

  try {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      
      const shortYear = year % 100;
      const formatted = `${month}/${day}/${shortYear}`;
      
      // Determine if overdue
      const targetDate = new Date(year, month - 1, day, 23, 59, 59);
      const now = new Date();
      const isPastDue = targetDate.getTime() < now.getTime();

      return { formatted, isPastDue };
    }

    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;

    const month = d.getMonth() + 1;
    const day = d.getDate();
    const shortYear = d.getFullYear() % 100;
    const formatted = `${month}/${day}/${shortYear}`;
    const isPastDue = d.getTime() < Date.now();

    return { formatted, isPastDue };
  } catch {
    return null;
  }
}
