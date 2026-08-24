"use client";

import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/features/auth";
import { TaskProvider, TaskListView } from "@/features/tasks";
import {
  LogOut,
  User as UserIcon,
  Shield,
  Clock,
  Sparkles,
  FolderKanban,
  CheckSquare,
  Users,
  Loader2,
  ListTodo,
  LayoutDashboard,
} from "lucide-react";

interface DashboardClientProps {
  user: User;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "overview">("tasks");

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
  };

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  const userRole = (user.app_metadata?.role as string) || "Member";
  const authProvider = user.app_metadata?.provider || "Email";

  return (
    <TaskProvider>
      <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col font-sans">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d111d]/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand & Tabs */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#6c63ff] flex items-center justify-center shadow-lg shadow-indigo-600/30">
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
                <span className="text-xl font-bold tracking-tight text-white">Kayabé</span>
              </div>

              {/* Navigation View Switcher */}
              <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "tasks"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <ListTodo className="w-3.5 h-3.5" />
                  <span>Tasks (List View)</span>
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Overview & Account</span>
                </button>
              </nav>
            </div>

            {/* User Nav Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-full bg-[#6c63ff]/20 text-[#a59eff] font-semibold flex items-center justify-center text-xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{displayName}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition-all text-xs sm:text-sm font-medium cursor-pointer"
              >
                {loggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile View Switcher */}
        <div className="md:hidden flex items-center justify-around border-b border-white/10 bg-[#0d111d] px-4 py-2 text-xs">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
              activeTab === "tasks" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
              activeTab === "overview" ? "bg-indigo-600 text-white" : "text-slate-400"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {activeTab === "tasks" ? (
            /* Task Management Section (Matching User's Screenshot) */
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                    <span>Sprint Tasks</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      Active
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Manage hierarchical project tasks, subtasks, assignees, due dates, and priorities.
                  </p>
                </div>
              </div>

              {/* Task List View Component */}
              <TaskListView />
            </div>
          ) : (
            /* Overview & Account Section */
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5b58d9] via-[#4845b8] to-[#2a267a] p-6 sm:p-8 border border-white/15 shadow-2xl">
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Authentication Active & Verified</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Welcome to your workspace, {displayName}!
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                    You are securely signed in through Supabase Authentication. Explore your projects and collaborative task boards.
                  </p>
                </div>
              </div>

              {/* User Account & Role Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* User Profile Card */}
                <div className="rounded-2xl bg-[#101423]/90 border border-white/10 p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Account Details</h3>
                      <p className="text-xs text-slate-400">Identity & profile</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs divide-y divide-white/5 pt-1">
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Name</span>
                      <span className="text-white font-medium">{displayName}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Email</span>
                      <span className="text-white font-medium truncate max-w-[180px]">{user.email}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Provider</span>
                      <span className="text-indigo-300 font-medium capitalize">{authProvider}</span>
                    </div>
                  </div>
                </div>

                {/* Role & Access Control */}
                <div className="rounded-2xl bg-[#101423]/90 border border-white/10 p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Role & Access</h3>
                      <p className="text-xs text-slate-400">Access control settings</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs divide-y divide-white/5 pt-1">
                    <div className="flex justify-between py-1.5 items-center">
                      <span className="text-slate-400">Current Role</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px] capitalize">
                        {userRole}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">User ID</span>
                      <span className="text-white font-mono text-[10px] truncate max-w-[180px]">
                        {user.id}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Email Verified</span>
                      <span className="text-emerald-400 font-medium">
                        {user.email_confirmed_at ? "Yes" : "Auto / Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="rounded-2xl bg-[#101423]/90 border border-white/10 p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Session Activity</h3>
                      <p className="text-xs text-slate-400">Security & timestamps</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs divide-y divide-white/5 pt-1">
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Last Sign In</span>
                      <span className="text-white font-medium">
                        {user.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : "Just now"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Created At</span>
                      <span className="text-white font-medium">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Session Status</span>
                      <span className="text-emerald-400 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Launch Cards */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white tracking-tight">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    onClick={() => setActiveTab("tasks")}
                    className="group p-5 rounded-2xl bg-[#101423]/80 hover:bg-[#151a2e] border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/15 text-[#a59eff] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ListTodo className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Task List View</h4>
                      <p className="text-xs text-slate-400 mt-1">Manage hierarchical subtasks & sprints</p>
                    </div>
                  </div>

                  <div className="group p-5 rounded-2xl bg-[#101423]/80 hover:bg-[#151a2e] border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Projects</h4>
                      <p className="text-xs text-slate-400 mt-1">Organize team initiatives</p>
                    </div>
                  </div>

                  <div className="group p-5 rounded-2xl bg-[#101423]/80 hover:bg-[#151a2e] border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Workspaces</h4>
                      <p className="text-xs text-slate-400 mt-1">Invite team members & assign roles</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab("tasks")}
                    className="group p-5 rounded-2xl bg-[#101423]/80 hover:bg-[#151a2e] border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">My Tasks</h4>
                      <p className="text-xs text-slate-400 mt-1">View personal assigned items</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </TaskProvider>
  );
}
