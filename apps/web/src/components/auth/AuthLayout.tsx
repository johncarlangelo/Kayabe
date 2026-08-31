import React from "react";
import Link from "next/link";
import { Shield, Terminal, Zap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[var(--bg-canvas)] text-[var(--text-primary)] selection:bg-cyan-500/20 selection:text-cyan-300 transition-colors duration-200">
      {/* Left Column: Architectural Showcase & Technical Proof */}
      <div className="relative w-full lg:w-1/2 min-h-[440px] lg:min-h-[100dvh] flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-[var(--bg-panel)] border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] transition-colors duration-200">
        {/* Subtle 45° Directional Specular Sheen */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(0,210,238,0.06)_0%,transparent_60%)]" />

        {/* Top: Brand Header */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl nm-raised flex items-center justify-center border border-white/10 transition-transform group-hover:scale-105">
              <svg
                className="w-5 h-5 text-cyan-400 fill-none stroke-current"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="15" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Kayabé</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.0
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Architectural System Brief */}
        <div className="relative z-10 my-auto py-10 space-y-7 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg nm-inset text-[var(--text-secondary)] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>SESSION AUTHENTICATION GATEWAY</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1]">
              Tactile task orchestration.
            </h1>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
              A high-performance environment engineered for structured project delivery, real-time board sync, and keyboard-first task execution.
            </p>
          </div>

          {/* Architectural Feature Trays */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl nm-raised border border-[var(--border-subtle)] flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl nm-inset flex items-center justify-center text-cyan-400 shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[var(--text-primary)] block">Keyboard-First Dispatch</span>
                <span className="text-[var(--text-secondary)]">Instant command palette and keyboard accelerator routing.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl nm-raised border border-[var(--border-subtle)] flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl nm-inset flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[var(--text-primary)] block">Deterministic Socket Sync</span>
                <span className="text-[var(--text-secondary)]">Low-latency task board state propagation.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl nm-raised border border-[var(--border-subtle)] flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl nm-inset flex items-center justify-center text-blue-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[var(--text-primary)] block">Role-Based Isolation</span>
                <span className="text-[var(--text-secondary)]">Supabase Auth with workspace-level permissions.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Telemetry Footer */}
        <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>AUTHENTICATION SERVICE ACTIVE</span>
          </div>
          <span>SECURE TLS · SHA-256</span>
        </div>
      </div>

      {/* Right Column: Centered Neumorphic Form Card */}
      <div className="w-full lg:w-1/2 min-h-[100dvh] flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[var(--bg-canvas)] relative overflow-hidden transition-colors duration-200">
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};
