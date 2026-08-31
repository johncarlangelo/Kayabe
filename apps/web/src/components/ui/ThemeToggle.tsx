"use client";

import React, { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("kayabe-theme") as "dark" | "light") || "dark";
}

function getServerSnapshot(): "dark" | "light" {
  return "dark";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("kayabe-theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-xl nm-btn flex items-center justify-center transition-all cursor-pointer select-none text-[var(--text-primary)] ${className}`}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode (Temporary)`}
      aria-label="Toggle Light / Dark mode"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-600" />
      )}
    </button>
  );
}
