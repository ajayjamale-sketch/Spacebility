import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/features/StatsCard";
import { ANALYTICS_DATA } from "@/lib/data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const PIE_DATA = [
  { name: "Hot Desks", value: 45, color: "#4F46E5" },
  { name: "Private Offices", value: 30, color: "#06B6D4" },
  { name: "Meeting Rooms", value: 15, color: "#10B981" },
  { name: "Event Spaces", value: 10, color: "#F59E0B" },
];

export default function DashboardAnalytics() {
  const [period, setPeriod] = useState("6m");

  const getFilteredData = (data: any[], p: string) => {
    if (p === "1m") return data.slice(-1);
    if (p === "3m") return data.slice(-3);
    if (p === "6m") return data;
    if (p === "1y") return [...data.map(d => ({ ...d, value: Math.floor(d.value * 0.7), month: "Last " + d.month })), ...data];
    return data;
  };

  const revenueData = React.useMemo(() => getFilteredData(ANALYTICS_DATA.revenue, period), [period]);
  const bookingsData = React.useMemo(() => getFilteredData(ANALYTICS_DATA.bookings, period), [period]);
  const userGrowthData = React.useMemo(() => getFilteredData(ANALYTICS_DATA.userGrowth, period), [period]);

  return (
    <DashboardLayout title="Analytics">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Analytics Dashboard</h2>
          <p className="text-slate-500 text-sm">Track your workspace performance metrics</p>
        </div>
        <div className="flex gap-2">
          {["1m", "3m", "6m", "1y"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${period === p ? "border-primary-600 bg-primary-600 text-white" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400"}`}>{p}</button>
          ))}
          <button className="btn-secondary text-sm py-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: "$70,420", change: "15%", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "emerald" },
          { label: "Total Bookings", value: "620", change: "14%", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "primary" },
          { label: "Avg Occupancy", value: "74%", change: "8%", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10", color: "cyan" },
          { label: "User Growth", value: "+3.1K", change: "158%", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "violet" },
        ].map((s) => <StatsCard key={s.label} {...s} changeType="up" />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fill="url(#rev)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingsData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="value" fill="#06B6D4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">Workspace Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {PIE_DATA.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
              <Tooltip formatter={(v: number) => [v.toLocaleString(), "Users"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
