import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/features/StatsCard";
import AIRecommendations from "@/components/features/AIRecommendations";
import { useAuth } from "@/lib/auth";
import { MOCK_BOOKINGS, MOCK_WORKSPACES, ANALYTICS_DATA } from "@/lib/data";
import { formatCurrency, formatShortDate, getStatusColor, cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function DashboardHome() {
  const { user } = useAuth();

  const roleStats: Record<string, { label: string; value: string; change: string; changeType: "up" | "down"; icon: string; color: string }[]> = {
    freelancer: [
      { label: "Bookings This Month", value: "8", change: "33%", changeType: "up", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "primary" },
      { label: "Hours Booked", value: "64", change: "12%", changeType: "up", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "cyan" },
      { label: "Total Spent", value: "$482", change: "8%", changeType: "up", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", color: "emerald" },
      { label: "AI Match Score", value: "96%", change: "4%", changeType: "up", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", color: "violet" },
    ],
    startup: [
      { label: "Team Bookings", value: "24", change: "50%", changeType: "up", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "primary" },
      { label: "Active Members", value: "12", change: "20%", changeType: "up", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", color: "cyan" },
      { label: "Monthly Spend", value: "$3,500", change: "5%", changeType: "down", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", color: "emerald" },
      { label: "Productivity Score", value: "92%", change: "7%", changeType: "up", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "amber" },
    ],
    owner: [
      { label: "Total Revenue", value: "$14,280", change: "18%", changeType: "up", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "emerald" },
      { label: "Active Bookings", value: "47", change: "23%", changeType: "up", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "primary" },
      { label: "Avg Occupancy", value: "78%", change: "12%", changeType: "up", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "cyan" },
      { label: "Total Spaces", value: "6", change: "1 new", changeType: "up", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5", color: "violet" },
    ],
    community: [
      { label: "Events Created", value: "12", change: "4 this mo", changeType: "up", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "primary" },
      { label: "Active Members", value: "2,340", change: "15%", changeType: "up", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "cyan" },
      { label: "Engagement Rate", value: "87%", change: "9%", changeType: "up", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "emerald" },
      { label: "New Groups", value: "8", change: "3 this mo", changeType: "up", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "amber" },
    ],
    admin: [
      { label: "Total Revenue", value: "$70,420", change: "15%", changeType: "up", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "emerald" },
      { label: "Active Users", value: "3,100", change: "20%", changeType: "up", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "primary" },
      { label: "Total Bookings", value: "620", change: "14%", changeType: "up", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "cyan" },
      { label: "Platform Health", value: "99.9%", change: "stable", changeType: "up", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "emerald" },
    ],
  };

  const stats = roleStats[user?.role || "freelancer"] || roleStats.freelancer;

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-display">
          Good morning, {user?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-slate-500 mt-1">Here's what's happening with your workspace today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <StatsCard key={s.label} label={s.label} value={s.value} change={s.change} changeType={s.changeType} icon={s.icon} color={s.color} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white font-display">
              {user?.role === "admin" || user?.role === "owner" ? "Revenue Overview" : "Spending Overview"}
            </h3>
            <select className="text-sm text-slate-500 bg-transparent border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 focus:outline-none">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>This year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ANALYTICS_DATA.revenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fill="url(#colorRevenue)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Recommendations */}
        <div>
          <AIRecommendations />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 dark:text-white font-display">Recent Bookings</h3>
            <Link to="/dashboard/bookings" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {MOCK_BOOKINGS.map((booking) => (
              <Link key={booking.id} to={`/dashboard/bookings/${booking.id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <img src={booking.workspaceImage} alt={booking.workspaceName} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 dark:text-white text-sm group-hover:text-primary-600 transition-colors truncate">{booking.workspaceName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatShortDate(booking.startDate)} · {booking.duration}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{formatCurrency(booking.totalPrice)}</p>
                  <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getStatusColor(booking.status))}>{booking.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Occupancy Bar Chart */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">Weekly Occupancy</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS_DATA.occupancy} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, "Occupancy"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="value" fill="#06B6D4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">📈 Wednesday is your peak day at 91% occupancy</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 card p-6">
        <h3 className="font-bold text-slate-800 dark:text-white font-display mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Book Workspace", href: "/marketplace", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", color: "bg-primary-50 dark:bg-primary-900/20 text-primary-600" },
            { label: "View Bookings", href: "/dashboard/bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600" },
            { label: "See Analytics", href: "/dashboard/analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" },
            { label: "Billing & Plans", href: "/dashboard/billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600" },
          ].map((action) => (
            <Link key={action.label} to={action.href} className={cn("flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all hover:scale-105 text-center", action.color)}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
              </svg>
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
