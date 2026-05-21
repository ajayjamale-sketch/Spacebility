import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const ROLES = [
  {
    value: "freelancer" as UserRole,
    label: "Freelancer",
    desc: "Individual workspace & productivity tools",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800",
    activeBg: "bg-violet-600",
    activeBorder: "border-violet-500",
    textColor: "text-violet-700 dark:text-violet-300",
  },
  {
    value: "startup" as UserRole,
    label: "Startup / Team",
    desc: "Collaborative space for growing teams",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    activeBg: "bg-blue-600",
    activeBorder: "border-blue-500",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    value: "owner" as UserRole,
    label: "Workspace Owner",
    desc: "List, manage and monetize your spaces",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    activeBg: "bg-emerald-600",
    activeBorder: "border-emerald-500",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "community" as UserRole,
    label: "Community Manager",
    desc: "Events, networking & member engagement",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    activeBg: "bg-amber-500",
    activeBorder: "border-amber-500",
    textColor: "text-amber-700 dark:text-amber-300",
  },
];

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Special char", pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const label = ["", "Weak", "Fair", "Good", "Strong"][score];
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-1.5 rounded-full transition-all duration-300",
              score >= i ? colors[score] : "bg-slate-200 dark:bg-slate-700"
            )}
          />
        ))}
        <span className={cn("text-xs font-semibold ml-1", score <= 1 ? "text-red-500" : score === 2 ? "text-amber-500" : "text-emerald-500")}>
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((c) => (
          <span key={c.label} className={cn("text-xs flex items-center gap-1", c.pass ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500")}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {c.pass
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
            </svg>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>("freelancer");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!agreed) errs.agreed = "You must accept the terms to continue";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    const result = await register({ name, email, password, role, company });
    setLoading(false);
    if (result.success) {
      toast.success("Account created! Welcome to Spacebility.");
      navigate("/dashboard");
    } else {
      toast.error(result.error || "Registration failed. Please try again.");
    }
  };

  const selectedRole = ROLES.find((r) => r.value === role)!;

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-900">

      {/* ── Left panel: image + branding ── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-5/12 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1400&h=1200&fit=crop&q=80"
          alt="Coworking community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-primary-900/70 to-cyan-900/50" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H15V16H9V22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold font-display text-white">Spacebility</span>
          </Link>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl xl:text-5xl font-bold font-display text-white leading-tight mb-3">
                Your community<br />awaits.
              </h2>
              <p className="text-white/65 text-lg leading-relaxed max-w-sm">
                Discover workspaces, build your network, and grow your business alongside 50,000+ ambitious professionals.
              </p>
            </div>

            {/* Benefit list */}
            <div className="space-y-3">
              {[
                { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "AI-powered workspace recommendations" },
                { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: "Instant booking — no phone calls" },
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Verified spaces with real-time availability" },
                { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label: "200+ community events every month" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/12 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                    </svg>
                  </div>
                  <p className="text-white/80 text-sm">{b.label}</p>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2.5">
                {[
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-8 h-8 rounded-full ring-2 ring-slate-800 object-cover" />
                ))}
              </div>
              <p className="text-white/60 text-sm">
                <span className="font-semibold text-white">50,000+</span> members already inside
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 overflow-y-auto bg-white dark:bg-slate-900">
        <div className="w-full max-w-lg py-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H15V16H9V22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">Spacebility</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400">Join 50,000+ teams working smarter with Spacebility</p>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-3 mb-8">
            {[
              { n: 1, label: "Your Role" },
              { n: 2, label: "Your Details" },
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                    step > s.n
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : step === s.n
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                  )}>
                    {step > s.n ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s.n}
                  </div>
                  <span className={cn(
                    "text-sm font-medium hidden sm:block",
                    step >= s.n ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-500"
                  )}>
                    {s.label}
                  </span>
                </div>
                {i < 1 && (
                  <div className={cn("flex-1 h-0.5 rounded-full transition-all", step > 1 ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700")} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ─ STEP 1: Role selection ─ */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-up">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">How will you use Spacebility?</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Choose a role to personalise your experience. You can change this later.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLES.map((r) => {
                  const isSelected = role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={cn(
                        "flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
                        isSelected
                          ? `${r.activeBorder} bg-primary-50 dark:bg-primary-900/20`
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
                        isSelected ? r.color : "from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600"
                      )}>
                        <svg
                          className={cn("w-5 h-5", isSelected ? "text-white" : "text-slate-500 dark:text-slate-400")}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d={r.icon} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-semibold leading-tight", isSelected ? "text-primary-700 dark:text-primary-300" : "text-slate-800 dark:text-white")}>
                          {r.label}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                        isSelected ? "border-primary-600 bg-primary-600" : "border-slate-300 dark:border-slate-600"
                      )}>
                        {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] mt-2"
              >
                Continue as {selectedRole.label}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          )}

          {/* ─ STEP 2: Details form ─ */}
          {step === 2 && (
            <form onSubmit={handleSubmit} noValidate className="space-y-5 animate-fade-up">

              {/* Selected role badge */}
              <div className={cn("inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold", selectedRole.bg, selectedRole.textColor)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={selectedRole.icon} />
                </svg>
                {selectedRole.label}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-xs underline font-normal"
                >
                  Change
                </button>
              </div>

              {/* Name + Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: "" }); }}
                    placeholder="Alex Rivera"
                    autoComplete="name"
                    className={cn(
                      "w-full px-4 py-3.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2",
                      errors.name ? "border-red-400 dark:border-red-500 focus:ring-red-400/20" : "border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/20"
                    )}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Company <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company or studio"
                    autoComplete="organization"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: "" }); }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={cn(
                      "w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2",
                      errors.email ? "border-red-400 dark:border-red-500 focus:ring-red-400/20" : "border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/20"
                    )}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: "" }); }}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className={cn(
                      "w-full pl-11 pr-12 py-3.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:ring-2",
                      errors.password ? "border-red-400 dark:border-red-500 focus:ring-red-400/20" : "border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:ring-primary-500/20"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {showPass ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                <PasswordStrength password={password} />
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    onClick={() => { setAgreed(!agreed); if (errors.agreed) setErrors({ ...errors, agreed: "" }); }}
                    className={cn(
                      "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
                      agreed
                        ? "bg-primary-600 border-primary-600"
                        : errors.agreed
                          ? "border-red-400"
                          : "border-slate-300 dark:border-slate-600 group-hover:border-primary-400"
                    )}
                  >
                    {agreed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    I agree to Spacebility's{" "}
                    <Link to="/terms" target="_blank" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy" target="_blank" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreed && <p className="mt-1.5 text-xs text-red-500 ml-8">{errors.agreed}</p>}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="border-2 border-white/30 border-t-white rounded-full animate-spin" style={{ width: "18px", height: "18px" }} />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Google alternative */}
              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400 font-medium">or sign up with</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              <button
                type="button"
                onClick={() => toast.info("Google OAuth would connect here")}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </form>
          )}

          {/* Sign in link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Sign in →
            </Link>
          </p>

          <div className="text-center mt-3">
            <Link to="/" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Spacebility
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
