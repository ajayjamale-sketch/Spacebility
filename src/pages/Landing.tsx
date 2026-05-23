import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WorkspaceCard from "@/components/features/WorkspaceCard";
import BookingModal from "@/components/features/BookingModal";
import { MOCK_WORKSPACES, MOCK_EVENTS, PRICING_PLANS, MOCK_REVIEWS } from "@/lib/data";
import { formatCurrency, cn } from "@/lib/utils";

// Animated counter
function useCounter(target: number, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

// Intersection observer hook
function useVisible(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const BRANDS = [
  { name: "Stripe", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { name: "Notion", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" },
  { name: "Figma", icon: "M5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5zM12 2h3.5a3.5 3.5 0 110 7H12V2zM12 12.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM5 19.5A3.5 3.5 0 018.5 16H12v3.5a3.5 3.5 0 11-7 0zM5 12.5A3.5 3.5 0 018.5 9H12v7H8.5A3.5 3.5 0 015 12.5z" },
  { name: "Vercel", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
  { name: "Linear", icon: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" },
  { name: "Loom", icon: "M21 16s-2.5 2-9 2-9-2-9-2V8s2.5-2 9-2 9 2 9 2v8z" },
  { name: "GitHub", icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" },
  { name: "Slack", icon: "M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" },
];

const FEATURES = [
  {
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    title: "AI-Powered Matching",
    desc: "Our recommendation engine learns your work style, preferred environment, and team dynamics to surface exactly the right workspace at the right time.",
    badge: "Smart AI",
    badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    gradient: "from-violet-500 to-violet-700",
  },
  {
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    title: "Instant Booking",
    desc: "Reserve hot desks, private offices, and board rooms in under 60 seconds. No phone calls, no waitlists, no friction.",
    badge: "Real-time",
    badgeColor: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    gradient: "from-primary-500 to-primary-700",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Advanced Analytics",
    desc: "Understand how your team works. Track occupancy, spending trends, and productivity patterns with live dashboards built for decision-makers.",
    badge: "Insights",
    badgeColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    gradient: "from-cyan-500 to-cyan-700",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    title: "Community Network",
    desc: "Join 50,000+ founders, freelancers, and remote teams. Attend curated events, find collaborators, and grow your professional circle.",
    badge: "Community",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    gradient: "from-emerald-500 to-emerald-700",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search & Discover",
    desc: "Browse workspaces filtered by location, type, capacity, amenities, and price. See real-time availability.",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    step: "02",
    title: "AI Recommends",
    desc: "Our model analyzes your profile and past bookings to surface spaces that match your productivity style.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    step: "03",
    title: "Book in 60s",
    desc: "Confirm your seat, pay securely, and receive a QR code for seamless check-in. No phone calls needed.",
    icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  {
    step: "04",
    title: "Work & Grow",
    desc: "Access your space, tap into the community, and track your workspace ROI with built-in analytics.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
];

const WORKSPACE_TYPES = ["All", "Hot Desk", "Private Office", "Meeting Room", "Dedicated Desk"];
const TYPE_MAP: Record<string, string> = {
  "Hot Desk": "hot-desk",
  "Private Office": "private-office",
  "Meeting Room": "meeting-room",
  "Dedicated Desk": "dedicated-desk",
};

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [bookingWorkspace, setBookingWorkspace] = useState<typeof MOCK_WORKSPACES[0] | null>(null);

  const { ref: statsRef, visible: statsVisible } = useVisible(0.3);
  const workspacesCount = useCounter(12000, 2000, statsVisible);
  const citiesCount = useCounter(80, 1500, statsVisible);
  const membersCount = useCounter(50000, 2200, statsVisible);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCity) params.set("city", selectedCity);
    navigate(`/marketplace?${params.toString()}`);
  };

  const filteredWorkspaces = MOCK_WORKSPACES.filter((ws) => {
    if (activeFilter === "All") return true;
    return ws.type === TYPE_MAP[activeFilter];
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      {/* ── 1. HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop&q=80"
            alt="Modern coworking space"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(79,70,229,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
          <div className="max-w-2xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/8 backdrop-blur-sm border border-white/15 text-white text-xs font-semibold mb-8 animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-300">Live availability in 80+ cities worldwide</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-white leading-[1.05] tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Your workspace,
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-primary-400 bg-clip-text text-transparent">on your terms.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-lg animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Discover and book premium coworking spaces, private offices, and meeting rooms — powered by AI that learns what you need.
            </p>

            {/* Search */}
            <div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700 p-2 flex flex-col sm:flex-row gap-2 mb-8 animate-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              <div className="flex-1 flex items-center gap-3 px-4">
                <svg className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search workspaces or neighborhoods…"
                  className="flex-1 py-3 text-slate-800 dark:text-white bg-transparent outline-none placeholder-slate-400 text-sm"
                />
              </div>
              <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-700 my-2" />
              <div className="flex items-center gap-3 px-4">
                <svg className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-slate-600 dark:text-slate-300 outline-none text-sm py-3 pr-2 min-w-0"
                >
                  <option value="">Any city</option>
                  {["San Francisco", "New York", "Chicago", "Austin", "Seattle", "Miami", "Boston", "Los Angeles"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 inline-flex items-center gap-2 justify-center text-sm whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Spaces
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link to={isAuthenticated ? "/dashboard" : "/register"} className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-7 py-3.5 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-sm">
                {isAuthenticated ? "Go to Dashboard" : "Start for free"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
              <Link to="/marketplace" className="inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl border border-white/25 hover:bg-white/10 transition-all duration-200 text-sm">
                Browse workspaces
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-3 gap-6 mt-16 max-w-sm animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: workspacesCount.toLocaleString() + "+", label: "Workspaces" },
              { value: citiesCount + "+", label: "Cities" },
              { value: membersCount.toLocaleString() + "+", label: "Members" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white font-display tabular-nums">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
          <span className="text-xs text-slate-400 tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── 2. TRUSTED BRANDS ─────────────────────────── */}
      <section className="py-14 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 mb-8 tracking-widest uppercase">
            Trusted by teams at the world's best companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {BRANDS.map((brand) => (
              <div key={brand.name} className="flex items-center gap-2 group cursor-default">
                <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={brand.icon} />
                </svg>
                <span className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-semibold text-sm tracking-tight">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WORKSPACE SHOWCASE ─────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Workspace Catalogue
              </span>
              <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white leading-tight">
                Premium spaces,<br />every city.
              </h2>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {WORKSPACE_TYPES.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 whitespace-nowrap",
                    activeFilter === f
                      ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-slate-800"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkspaces.slice(0, 6).map((ws, i) => (
              <div key={ws.id} className={cn(i === 0 && "md:col-span-2 lg:col-span-1")}>
                <WorkspaceCard workspace={ws} featured={ws.featured} onBook={() => setBookingWorkspace(ws)} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-500 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 text-sm"
            >
              Explore all {MOCK_WORKSPACES.length}+ workspaces
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. SMART FEATURES ─────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Platform Capabilities
            </span>
            <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Built for how<br />modern teams work.
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              From solo freelancers to 500-person enterprise teams — every feature is designed to reduce friction and increase output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-7 border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300", feature.gradient)}>
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-bold text-slate-800 dark:text-white font-display">{feature.title}</h3>
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", feature.badgeColor)}>{feature.badge}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                    <Link to="/features" className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-semibold mt-3 hover:gap-2 transition-all">
                      Learn more <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ───────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              How It Works
            </span>
            <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-4">
              From search to<br />check-in in minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent hidden lg:block" />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-primary-900/30 dark:to-cyan-900/30 border border-primary-100 dark:border-primary-800 mb-5 mx-auto group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <svg className="w-9 h-9 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 font-display">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-sm"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get started — it's free"}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">No credit card required · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ── 6. COMMUNITY & EVENTS ─────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Community & Events
              </span>
              <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-5 leading-tight">
                Work alongside<br />people who inspire you.
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                50,000+ founders, designers, engineers, and creatives call Spacebility their professional home. Attend curated events, find co-founders, and grow faster together.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: "Monthly Events", value: "200+" },
                  { label: "Community Groups", value: "150+" },
                  { label: "Active Members", value: "50K+" },
                  { label: "Cities", value: "80+" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-xl font-bold text-primary-600 dark:text-primary-400 font-display">{stat.value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <Link
                to="/community"
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-sm"
              >
                Join the community
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            {/* Events */}
            <div className="space-y-3">
              {MOCK_EVENTS.slice(0, 3).map((event) => (
                <Link
                  key={event.id}
                  to="/events"
                  className="flex gap-4 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200 group"
                >
                  <img src={event.image} alt={event.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm leading-snug line-clamp-1">{event.title}</h4>
                      <span className={cn("flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full", event.price === 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400")}>
                        {event.price === 0 ? "Free" : `$${event.price}`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5">{event.date} · {event.location}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1.5">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-cyan-400 border-2 border-white dark:border-slate-800" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{event.attendees} attending</span>
                    </div>
                  </div>
                </Link>
              ))}
              <Link to="/events" className="block text-center text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 py-1 transition-colors">
                View all upcoming events →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ───────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Member Stories
            </span>
            <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Words from our community.
            </h2>
            <div className="flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">4.9/5</span>
              <span className="text-sm text-slate-400 dark:text-slate-500">· 2,400+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_REVIEWS.map((review, i) => (
              <div
                key={review.id}
                className={cn(
                  "bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-200",
                  i === 1 && "lg:mt-6"
                )}
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-4">"{review.comment}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">{review.userName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. PRICING ────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Pricing
            </span>
            <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-3">
              Transparent plans,<br />no surprises.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-7 text-base">Choose a plan that grows with you. Cancel or upgrade at any time.</p>

            <div className="inline-flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setBillingAnnual(false)}
                className={cn("px-5 py-2 rounded-lg text-sm font-semibold transition-all", !billingAnnual ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200")}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingAnnual(true)}
                className={cn("px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2", billingAnnual ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200")}
              >
                Annual
                <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">−20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "rounded-2xl p-6 flex flex-col transition-all duration-300",
                  plan.highlighted
                    ? "bg-slate-900 dark:bg-primary-600 text-white shadow-xl ring-2 ring-slate-900/50 dark:ring-primary-500 lg:-translate-y-1"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md"
                )}
              >
                {plan.highlighted && (
                  <span className="text-xs font-bold px-2.5 py-1 bg-white/10 rounded-full w-fit mb-4 text-white/90">
                    Most Popular
                  </span>
                )}
                <h3 className={cn("text-base font-bold font-display mb-1", plan.highlighted ? "text-white" : "text-slate-800 dark:text-white")}>{plan.name}</h3>
                <p className={cn("text-xs mb-5 leading-relaxed", plan.highlighted ? "text-white/70" : "text-slate-500 dark:text-slate-400")}>{plan.description}</p>
                <div className="mb-5">
                  <span className={cn("text-3xl font-bold font-display", plan.highlighted ? "text-white" : "text-slate-900 dark:text-white")}>
                    {plan.price === 0 ? "Free" : `$${billingAnnual ? Math.floor(plan.price * 0.8) : plan.price}`}
                  </span>
                  {plan.price > 0 && <span className={cn("text-xs ml-1", plan.highlighted ? "text-white/60" : "text-slate-400 dark:text-slate-500")}>/month</span>}
                </div>
                <ul className="flex-1 space-y-2 mb-6">
                  {plan.features.slice(0, 6).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <svg className={cn("w-3.5 h-3.5 flex-shrink-0 mt-0.5", plan.highlighted ? "text-cyan-300" : "text-emerald-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.highlighted ? "text-white/80" : "text-slate-600 dark:text-slate-400"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.id === "enterprise" ? "/contact" : "/register"}
                  className={cn(
                    "text-center py-2.5 px-5 rounded-xl font-semibold text-sm transition-all duration-200",
                    plan.highlighted
                      ? "bg-white text-slate-900 hover:bg-slate-100 active:scale-95"
                      : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-95"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
            14-day free trial on all paid plans. No credit card required.{" "}
            <Link to="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Compare all features →</Link>
          </p>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold font-display text-white mb-5 leading-tight">
            Your next great idea<br />deserves a great space.
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Join 50,000+ professionals already working smarter with Spacebility.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-200 shadow-lg active:scale-95 text-sm"
            >
              {isAuthenticated ? "Go to Dashboard" : "Start for free today"}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-200 text-sm"
            >
              Talk to sales
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. FOOTER ─────────────────────────────────── */}
      <Footer />

      {/* Booking Modal */}
      {bookingWorkspace && (
        <BookingModal workspace={bookingWorkspace} onClose={() => setBookingWorkspace(null)} />
      )}
    </div>
  );
}
