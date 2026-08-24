"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { createClient } from "@/utils/supabase/client";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // If user has an active session right away (email confirmation disabled)
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        // Confirmation email sent
        setSignupSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setOauthLoading(null);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "OAuth error occurred");
      setOauthLoading(null);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full bg-[#101423]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/50">
        {signupSuccess ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Check your email</h2>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                We sent a confirmation link to <strong className="text-white">{email}</strong>. Click the link in your email to activate your account.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#6c63ff] hover:bg-[#5b52f5] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
            >
              <span>Back to Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Card Header */}
            <div className="space-y-1.5 text-left mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Create an account
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Join your team on Kayabé today
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 text-rose-300 text-sm">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3.5 mb-5">
              <button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                disabled={loading || !!oauthLoading}
                className="w-full bg-[#171b2d] hover:bg-[#20253e] disabled:opacity-60 active:scale-[0.99] border border-white/10 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all text-sm shadow-sm cursor-pointer"
              >
                {oauthLoading === "google" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                )}
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin("github")}
                disabled={loading || !!oauthLoading}
                className="w-full bg-[#171b2d] hover:bg-[#20253e] disabled:opacity-60 active:scale-[0.99] border border-white/10 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all text-sm shadow-sm cursor-pointer"
              >
                {oauthLoading === "github" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                )}
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#101423] px-3 text-[11px] font-medium text-slate-400 tracking-wider">
                or sign up with email
              </span>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-[#161b2e] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff] focus:border-transparent transition-all shadow-inner"
                  />
                </div>
              </div>

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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-[#161b2e] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff] focus:border-transparent transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-[#161b2e] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#6c63ff] focus:border-transparent transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !!oauthLoading}
                className="w-full mt-3 bg-[#6c63ff] hover:bg-[#5b52f5] active:scale-[0.99] disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-slate-400 mt-5">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-white hover:text-indigo-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
