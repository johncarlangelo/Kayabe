import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Sparkles, Kanban, Users, Shield, Zap } from "lucide-react";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-white flex flex-col justify-between">
      {/* Top Bar */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6c63ff] flex items-center justify-center shadow-lg shadow-indigo-600/30">
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
          <span className="text-2xl font-bold tracking-tight text-white">Kayabé</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold text-white bg-[#6c63ff] hover:bg-[#5b52f5] px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/25"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl w-full mx-auto px-6 py-16 sm:py-24 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-indigo-300 text-xs sm:text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>The next-generation collaborative task workspace</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Build faster. <span className="text-[#8c85ff]">Ship together.</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            The all-in-one workspace your team has been waiting for — grounded in clarity, real-time collaboration, and speed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#6c63ff] hover:bg-[#5b52f5] text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-xl shadow-indigo-600/30 text-base"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold py-3.5 px-8 rounded-xl transition-all text-base"
          >
            Create free account
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-16 text-left">
          <div className="p-5 rounded-2xl bg-[#101423]/80 border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Team Collaboration</h3>
            <p className="text-xs text-slate-400">Real-time sync across projects and workspaces.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#101423]/80 border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Automated Workflows</h3>
            <p className="text-xs text-slate-400">Triple your team velocity with smart automations.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#101423]/80 border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Enterprise Security</h3>
            <p className="text-xs text-slate-400">Supabase Auth with role-based access control.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#101423]/80 border border-white/10 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Kanban className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Kanban & Boards</h3>
            <p className="text-xs text-slate-400">Deep analytics and structured task tracking.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Kayabé. All rights reserved.
      </footer>
    </div>
  );
}