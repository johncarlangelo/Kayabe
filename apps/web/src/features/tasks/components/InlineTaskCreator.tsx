"use client";

import React, { useState, useRef, useEffect } from "react";
import { DashedCircleIcon } from "./icons/CustomIcons";
import { X, CornerDownLeft } from "lucide-react";

interface InlineTaskCreatorProps {
  placeholder?: string;
  parentId?: string | null;
  status?: string;
  onSave: (title: string) => Promise<boolean | void>;
  onCancel: () => void;
  isSubtask?: boolean;
}

export function InlineTaskCreator({
  placeholder = "Task name...",
  onSave,
  onCancel,
  isSubtask = false,
}: InlineTaskCreatorProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSave(title.trim());
      setTitle("");
      inputRef.current?.focus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-3 py-2 px-3 rounded-xl bg-white/[0.04] border border-indigo-500/40 my-1 transition-all shadow-lg shadow-indigo-500/5 ${
        isSubtask ? "ml-8" : ""
      }`}
    >
      <div className="text-slate-500 shrink-0">
        <DashedCircleIcon className="w-4 h-4 animate-pulse text-indigo-400" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isSubmitting}
        className="flex-1 bg-transparent text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none"
      />

      <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
        <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
          <span>Enter</span>
          <CornerDownLeft className="w-2.5 h-2.5" />
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Cancel (Esc)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}
