import React from "react";
import { ToastMessage } from "../../types";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === "error"
              ? "bg-rose-950/90 border-rose-800/60 text-rose-200"
              : toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-800/60 text-emerald-200"
              : toast.type === "warning"
              ? "bg-amber-950/90 border-amber-800/60 text-amber-200"
              : "bg-slate-900/90 border-slate-700/60 text-slate-200"
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {toast.type === "info" && <Info className="w-4 h-4 text-blue-400" />}
          </div>

          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-semibold leading-tight">{toast.title}</h5>
            {toast.message && (
              <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{toast.message}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 text-white/50 hover:text-white transition-colors p-0.5"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
