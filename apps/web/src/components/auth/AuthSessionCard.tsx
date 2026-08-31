"use client";

import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/features/auth";
import { User as UserIcon, Shield, Clock, LogOut, CheckCircle2, Loader2 } from "lucide-react";

interface AuthSessionCardProps {
  user: User;
}

export function AuthSessionCard({ user }: AuthSessionCardProps) {
  const { signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

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
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--text-primary)] flex items-center justify-center p-6 sm:p-10 selection:bg-cyan-500/20 selection:text-cyan-300 transition-colors duration-200">
      <div className="w-full max-w-lg nm-raised rounded-3xl p-8 sm:p-10 border border-[var(--border-subtle)] text-left space-y-6">
        {/* Header with Brand Icon */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl nm-raised flex items-center justify-center border border-[var(--border-subtle)]">
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
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Kayabé</h1>
              <p className="text-[11px] font-mono text-cyan-400">AUTHENTICATION ACTIVE</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full nm-inset text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SESSION VALID</span>
          </div>
        </div>

        {/* User Identity Banner */}
        <div className="p-5 rounded-2xl nm-inset flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl nm-raised text-cyan-400 font-bold flex items-center justify-center text-base shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[var(--text-primary)] truncate">{displayName}</h2>
            <p className="text-xs text-[var(--text-secondary)] font-mono truncate">{user.email}</p>
          </div>
        </div>

        {/* Session Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl nm-raised border border-[var(--border-subtle)] space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono text-[11px]">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>ROLE</span>
            </div>
            <p className="font-bold text-[var(--text-primary)] capitalize">{userRole}</p>
          </div>

          <div className="p-3.5 rounded-2xl nm-raised border border-[var(--border-subtle)] space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono text-[11px]">
              <UserIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>PROVIDER</span>
            </div>
            <p className="font-bold text-[var(--text-primary)] capitalize">{authProvider}</p>
          </div>

          <div className="p-3.5 rounded-2xl nm-raised border border-[var(--border-subtle)] space-y-1 col-span-2">
            <div className="flex items-center justify-between text-[var(--text-muted)] font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>USER ID</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>VERIFIED</span>
              </div>
            </div>
            <p className="font-mono text-[11px] text-[var(--text-secondary)] truncate">{user.id}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="w-full py-3 rounded-xl nm-btn text-rose-400 hover:text-rose-300 font-semibold flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
          >
            {loggingOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Sign out of session</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
