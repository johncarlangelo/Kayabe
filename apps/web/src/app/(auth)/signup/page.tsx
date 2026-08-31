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
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push("/");
        router.refresh();
      } else {
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
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
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

  if (signupSuccess) {
    return (
      <AuthLayout>
        <div className="w-full nm-raised border border-[var(--border-subtle)] rounded-3xl p-8 sm:p-10 text-center space-y-6 transition-colors duration-200">
          <div className="w-16 h-16 rounded-2xl nm-inset flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              Verification email sent
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
              We sent an authentication link to <strong className="text-[var(--text-primary)]">{email}</strong>.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 nm-btn text-[var(--text-primary)] font-semibold py-3 px-6 rounded-xl text-sm transition-all"
          >
            <span>Proceed to sign in</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full nm-raised border border-[var(--border-subtle)] rounded-3xl p-8 sm:p-10 text-left transition-colors duration-200">
        {/* Header */}
        <div className="space-y-1.5 mb-7">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Create account
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            Deploy your Kayabé workspace and invite teammates
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            disabled={loading || !!oauthLoading}
            className="w-full nm-btn disabled:opacity-60 text-[var(--text-primary)] font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 text-sm cursor-pointer"
          >
            {oauthLoading === "google" ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--text-primary)]" />
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
            className="w-full nm-btn disabled:opacity-60 text-[var(--text-primary)] font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 text-sm cursor-pointer"
          >
            {oauthLoading === "github" ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--text-primary)]" />
            ) : (
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            )}
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-full border-t border-[var(--border-subtle)]" />
          <span className="absolute bg-[var(--bg-card)] px-3 text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            or registration info
          </span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full nm-input rounded-xl py-2.5 pl-10 pr-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 tracking-wide">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full nm-input rounded-xl py-2.5 pl-10 pr-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full nm-input rounded-xl py-2.5 pl-10 pr-10 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full nm-input rounded-xl py-2.5 pl-10 pr-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none transition-all font-sans"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!oauthLoading}
            className="w-full mt-3 nm-btn-primary disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Creating workspace...</span>
              </>
            ) : (
              <>
                <span>Register account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--text-secondary)] mt-6 font-mono">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-[var(--accent-link)] hover:opacity-80 font-semibold transition-opacity"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
