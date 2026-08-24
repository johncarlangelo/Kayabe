import React from "react";
import Link from "next/link";
import { Users, Zap, ShieldCheck, LayoutDashboard, Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0a0d16] text-white">
      {/* Left Column: Visual Showcase & Brand Value Props */}
      <div className="relative w-full lg:w-1/2 min-h-[480px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-[#5d5fe7] via-[#5249d9] to-[#3a33a8]">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-300/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top: Brand Header */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              {/* Minimal feather / quill / check SVG symbol */}
              <svg
                className="w-5 h-5 text-white fill-none stroke-current"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="15" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              Kayabé
            </span>
          </Link>
        </div>

        {/* Center: Hero Headlines & Feature Checklist */}
        <div className="relative z-10 my-auto py-10 space-y-8 max-w-lg">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white/95 text-xs sm:text-sm font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white/90" />
            <span>Trusted by 10,000+ teams worldwide</span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              Build faster.
            </h1>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              Ship together.
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-white/85 text-base sm:text-lg font-normal leading-relaxed">
            The all-in-one workspace your team has been waiting for — grounded in clarity.
          </p>

          {/* Features */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3.5 text-white/90 text-sm sm:text-base font-normal">
              <div className="w-8 h-8 rounded-full border border-white/30 bg-white/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span>Real-time team collaboration across all projects</span>
            </div>

            <div className="flex items-center gap-3.5 text-white/90 text-sm sm:text-base font-normal">
              <div className="w-8 h-8 rounded-full border border-white/30 bg-white/10 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span>Automated workflows that triple your team velocity</span>
            </div>

            <div className="flex items-center gap-3.5 text-white/90 text-sm sm:text-base font-normal">
              <div className="w-8 h-8 rounded-full border border-white/30 bg-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span>Enterprise-grade security, SOC2 compliant</span>
            </div>

            <div className="flex items-center gap-3.5 text-white/90 text-sm sm:text-base font-normal">
              <div className="w-8 h-8 rounded-full border border-white/30 bg-white/10 flex items-center justify-center shrink-0">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <span>Kanban, calendar, and deep analytics — one place</span>
            </div>
          </div>
        </div>

        {/* Bottom: Social Proof Avatar Stack */}
        <div className="relative z-10 pt-4 flex items-center gap-3.5">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full ring-2 ring-[#5249d9] bg-indigo-200 text-indigo-900 font-bold text-xs">
              A
            </div>
            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full ring-2 ring-[#5249d9] bg-purple-200 text-purple-900 font-bold text-xs">
              S
            </div>
            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full ring-2 ring-[#5249d9] bg-blue-200 text-blue-900 font-bold text-xs">
              M
            </div>
            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full ring-2 ring-[#5249d9] bg-pink-200 text-pink-900 font-bold text-xs">
              P
            </div>
            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full ring-2 ring-[#5249d9] bg-violet-200 text-violet-900 font-bold text-xs">
              J
            </div>
          </div>
          <span className="text-white/85 text-xs sm:text-sm">
            Join <strong className="font-semibold text-white">2,400+</strong> teams already on Kayabé
          </span>
        </div>
      </div>

      {/* Right Column: Centered Form Card */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[#080b12] relative overflow-hidden">
        {/* Subtle ambient light behind form card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};
