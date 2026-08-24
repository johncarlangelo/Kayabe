"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { createClient } from "@/utils/supabase/client";
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full bg-[#101423]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/50">
        {success ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Reset link sent</h2>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                We sent a password reset link to <strong className="text-white">{email}</strong>. Check your inbox to set a new password.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#6c63ff] hover:bg-[#5b52f5] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign in</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Card Header */}
            <div className="space-y-1.5 text-left mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Reset password
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Enter your email to receive a password reset link
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 text-rose-300 text-sm">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-[#161b2e] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff] focus:border-transparent transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#6c63ff] hover:bg-[#5b52f5] active:scale-[0.99] disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  <>
                    <span>Send reset link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign in</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
