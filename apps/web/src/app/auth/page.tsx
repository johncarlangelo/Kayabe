"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle2, Terminal, Zap, Shield } from "lucide-react";
import { C } from "../lib/colors";

interface AuthPageProps {
  onLogin: () => void;
  isDark?: boolean;
}

const features = [
  { icon: Terminal, title: "Keyboard Accelerator Dispatch", text: "Instant command palette and keyboard routing across boards." },
  { icon: Zap,      title: "Deterministic Socket Sync",     text: "Low-latency task board state propagation with zero conflicts." },
  { icon: Shield,   title: "Role-Based Isolation",          text: "Granular workspace permissions backed by Supabase Auth." },
];

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [view,          setView]          = useState<"login"|"register"|"forgot"|"verify">("login");
  const [showPassword,  setShowPassword]  = useState(false);
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [name,          setName]          = useState("");

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row" style={{ background: C.app }}>

      {/* ── Left architectural panel ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: C.panel, borderRight: `1px solid ${C.bSubtle}` }}>

        {/* Specular sheen */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(0,210,238,0.06)_0%,transparent_60%)]" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center nm-raised border border-white/10">
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
              <span className="text-xl font-bold tracking-tight" style={{ color: C.t1 }}>Kayabé</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.0
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg nm-inset text-xs font-mono" style={{ color: C.t2 }}>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>TASK ORCHESTRATION GATEWAY</span>
            </div>
            <h1 style={{ fontSize: "40px", fontWeight: 800, color: C.t1, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              Tactile task orchestration.
            </h1>
            <p className="text-base leading-relaxed max-w-[48ch]" style={{ color: C.t2 }}>
              A high-performance environment engineered for structured project delivery, real-time board sync, and keyboard-first execution.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3.5">
            {features.map(({ icon: Icon, title, text }, i) => (
              <div key={i} className="p-3.5 rounded-2xl nm-raised flex items-center gap-3.5" style={{ border: `1px solid ${C.bSubtle}` }}>
                <div className="w-8 h-8 rounded-xl nm-inset flex items-center justify-center flex-shrink-0 text-cyan-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold block" style={{ color: C.t1 }}>{title}</span>
                  <span style={{ color: C.t2 }}>{text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry footer */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono" style={{ color: C.t3 }}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>AUTHENTICATION ENGINE ACTIVE</span>
          </div>
          <span>TLS 1.3 · SHA-256</span>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10" style={{ background: C.app }}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl nm-raised flex items-center justify-center border border-white/10">
              <svg
                className="w-4.5 h-4.5 text-cyan-400 fill-none stroke-current"
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
            <span style={{ fontWeight: 800, fontSize: "18px", color: C.t1 }}>Kayabé</span>
          </div>

          {/* Auth card */}
          <div className="p-8 sm:p-10 rounded-3xl nm-raised border border-white/10">
            {view === "login"    && <LoginForm    {...{ email, setEmail, password, setPassword, showPassword, setShowPassword, onLogin, onRegister: () => setView("register"), onForgot: () => setView("forgot") }} />}
            {view === "register" && <RegisterForm {...{ name, setName, email, setEmail, password, setPassword, showPassword, setShowPassword, onRegister: onLogin, onLogin: () => setView("login") }} />}
            {view === "forgot"   && <ForgotForm   {...{ email, setEmail, onSend: () => setView("verify"), onBack: () => setView("login") }} />}
            {view === "verify"   && <VerifyForm   email={email} onLogin={() => setView("login")} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */

function NMInput({ label, type, value, onChange, placeholder, icon: Icon, rightEl }: {
  label: string; type: string; value: string; onChange: (v: string) => void;
  placeholder: string; icon: React.ElementType; rightEl?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: C.t2 }}>{label}</label>
      <div className="relative">
        <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: C.t3 }} />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none font-medium nm-input transition-all font-sans"
          style={{ color: C.t1 }}
        />
        {rightEl && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
    </div>
  );
}

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 nm-btn-primary cursor-pointer"
    >
      {children}
    </button>
  );
}

function SocialBtn({ label, provider }: { label: string; provider: "google" | "github" }) {
  return (
    <button
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold nm-btn cursor-pointer"
      style={{ color: C.t2 }}
    >
      {provider === "google" ? (
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
          <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
          <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )}
      {label}
    </button>
  );
}

function Divider() {
  return (
    <div className="relative flex items-center justify-center my-6">
      <div className="w-full border-t border-white/5" />
      <span className="absolute bg-[#131828] px-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
        or email authentication
      </span>
    </div>
  );
}

function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  onLogin,
  onRegister,
  onForgot,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  onLogin: () => void;
  onRegister: () => void;
  onForgot: () => void;
}) {
  return (
    <div>
      <h2 style={{ color: C.t1, fontWeight: 800, fontSize: "24px", letterSpacing: "-0.02em" }}>Sign in</h2>
      <p className="text-sm mt-1 mb-6" style={{ color: C.t2 }}>Access your Kayabé workspace and project boards</p>
      <div className="flex gap-3"><SocialBtn provider="google" label="Google" /><SocialBtn provider="github" label="GitHub" /></div>
      <Divider />
      <div className="space-y-4 mb-4">
        <NMInput label="Work Email" type="email" value={email} onChange={setEmail} placeholder="name@company.com" icon={Mail} />
        <NMInput label="Password" type={showPassword ? "text" : "password"} value={password} onChange={setPassword}
          placeholder="Your password" icon={Lock}
          rightEl={<button onClick={() => setShowPassword(!showPassword)} style={{ color: C.t3 }}>
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>} />
      </div>
      <div className="flex justify-end mb-5">
        <button onClick={onForgot} className="text-xs font-mono text-cyan-400 hover:text-cyan-300">Forgot password?</button>
      </div>
      <PrimaryBtn onClick={onLogin}>Sign in <ArrowRight className="w-4 h-4" /></PrimaryBtn>
      <p className="text-center text-xs mt-6 font-mono" style={{ color: C.t2 }}>
        Need an account?{" "}
        <button onClick={onRegister} className="text-cyan-400 hover:text-cyan-300 font-semibold">Register workspace</button>
      </p>
    </div>
  );
}

function RegisterForm({ name, setName, email, setEmail, password, setPassword, showPassword, setShowPassword, onRegister, onLogin }: {
  name: string; setName: (v: string) => void; email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void; showPassword: boolean; setShowPassword: (v: boolean) => void;
  onRegister: () => void; onLogin: () => void;
}) {
  return (
    <div>
      <h2 style={{ color: C.t1, fontWeight: 800, fontSize: "24px", letterSpacing: "-0.02em" }}>Create account</h2>
      <p className="text-sm mt-1 mb-6" style={{ color: C.t2 }}>Deploy your Kayabé workspace and invite teammates</p>
      <div className="flex gap-3"><SocialBtn provider="google" label="Google" /><SocialBtn provider="github" label="GitHub" /></div>
      <Divider />
      <div className="space-y-4 mb-5">
        <NMInput label="Full Name"   type="text"  value={name}     onChange={setName}     placeholder="Jane Smith"          icon={User} />
        <NMInput label="Work Email"  type="email" value={email}    onChange={setEmail}    placeholder="name@company.com"    icon={Mail} />
        <NMInput label="Password"    type={showPassword ? "text" : "password"} value={password} onChange={setPassword}
          placeholder="Create strong password" icon={Lock}
          rightEl={<button onClick={() => setShowPassword(!showPassword)} style={{ color: C.t3 }}>
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>} />
      </div>
      <PrimaryBtn onClick={onRegister}>Create workspace <ArrowRight className="w-4 h-4" /></PrimaryBtn>
      <p className="text-center text-xs mt-6 font-mono" style={{ color: C.t2 }}>
        Already registered?{" "}
        <button onClick={onLogin} className="text-cyan-400 hover:text-cyan-300 font-semibold">Sign in</button>
      </p>
    </div>
  );
}

function ForgotForm({ email, setEmail, onSend, onBack }: { email: string; setEmail: (v: string) => void; onSend: () => void; onBack: () => void }) {
  return (
    <div>
      <h2 style={{ color: C.t1, fontWeight: 800, fontSize: "24px", letterSpacing: "-0.02em" }}>Reset password</h2>
      <p className="text-sm mt-1 mb-6" style={{ color: C.t2 }}>Enter your verified email for a secure recovery link</p>
      <div className="mb-5">
        <NMInput label="Account Email" type="email" value={email} onChange={setEmail} placeholder="name@company.com" icon={Mail} />
      </div>
      <PrimaryBtn onClick={onSend}>Send reset link <ArrowRight className="w-4 h-4" /></PrimaryBtn>
      <button onClick={onBack} className="w-full mt-4 text-xs font-mono text-cyan-400 hover:text-cyan-300">
        ← Back to sign in
      </button>
    </div>
  );
}

function VerifyForm({ email, onLogin }: { email: string; onLogin: () => void }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl nm-inset flex items-center justify-center mx-auto mb-5 text-emerald-400">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h2 style={{ color: C.t1, fontWeight: 800, fontSize: "22px" }}>Check your inbox</h2>
      <p className="text-sm mt-2 mb-1" style={{ color: C.t2 }}>We sent a verification link to</p>
      <p className="text-sm font-bold mb-7 text-cyan-400">{email || "your@email.com"}</p>
      <button onClick={onLogin} className="w-full py-3 rounded-xl text-sm font-semibold nm-btn text-slate-200">
        Back to sign in
      </button>
    </div>
  );
}
