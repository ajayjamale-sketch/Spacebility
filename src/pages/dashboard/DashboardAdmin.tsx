import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_USERS, MOCK_WORKSPACES, ANALYTICS_DATA } from "@/lib/data";
import { getRoleLabel, getRoleColor, getStatusColor, cn, formatCurrency, getInitials } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import StatsCard from "@/components/features/StatsCard";
import type { User } from "@/types";

type UserStatus = "active" | "suspended" | "pending";

interface ManagedUser extends User { status: UserStatus; lastLogin: string; }

const INITIAL_USERS: ManagedUser[] = MOCK_USERS.map((u, i) => ({
  ...u,
  status: i === 0 ? "active" : i === 4 ? "active" : "active",
  lastLogin: ["1h ago", "3h ago", "2d ago", "5h ago", "Just now"][i],
}));

const PENDING_WORKSPACES = [
  { id: "pw1", name: "Zen Creative Studio", owner: "Jordan Lee", city: "Portland", submitted: "2026-05-19", type: "hot-desk" },
  { id: "pw2", name: "Harbor Tech Hub", owner: "Riley Kim", city: "Seattle", submitted: "2026-05-18", type: "private-office" },
  { id: "pw3", name: "Mission District Desk", owner: "Casey Park", city: "San Francisco", submitted: "2026-05-17", type: "dedicated-desk" },
];

const PAYMENT_ACTIVITY = [
  { id: "p1", user: "Sarah Chen", amount: 3500, type: "Monthly Subscription", status: "paid", date: "2026-05-22" },
  { id: "p2", user: "Alex Rivera", amount: 195, type: "Meeting Room Booking", status: "paid", date: "2026-05-20" },
  { id: "p3", user: "Emma Wilson", amount: 79, type: "Professional Plan", status: "paid", date: "2026-05-20" },
  { id: "p4", user: "Marcus Johnson", amount: 850, type: "Workspace Monthly", status: "refunded", date: "2026-05-19" },
  { id: "p5", user: "Anika Patel", amount: 29, type: "Starter Plan", status: "failed", date: "2026-05-18" },
];

export default function DashboardAdmin() {
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [pendingWorkspaces, setPendingWorkspaces] = useState(PENDING_WORKSPACES);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "workspaces" | "payments" | "reports">("overview");
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "freelancer", message: "" });
  const [inviteErrors, setInviteErrors] = useState<{ name?: string; email?: string }>({});
  const [inviting, setInviting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; userId: string } | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchSearch = !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
    setConfirmAction(null);
    setShowUserModal(false);
    const user = users.find((u) => u.id === userId)!;
    const msgs: Record<string, string> = { suspended: `${user.name} has been suspended`, active: `${user.name} has been reinstated`, pending: `${user.name} set to pending review` };
    toast.success(msgs[newStatus] || "Status updated");
  };

  const handleApproveWorkspace = (id: string) => {
    setPendingWorkspaces((prev) => prev.filter((w) => w.id !== id));
    toast.success("Workspace approved and now live!");
  };

  const handleRejectWorkspace = (id: string) => {
    setPendingWorkspaces((prev) => prev.filter((w) => w.id !== id));
    toast.success("Workspace rejected and owner notified");
  };

  const validateInvite = () => {
    const errs: { name?: string; email?: string } = {};
    if (!inviteForm.name.trim()) errs.name = "Name required";
    if (!inviteForm.email.trim()) errs.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.email)) errs.email = "Invalid email";
    setInviteErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInvite()) return;
    setInviting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setInviting(false);
    setShowInviteModal(false);
    setInviteForm({ name: "", email: "", role: "freelancer", message: "" });
    toast.success(`Invitation sent to ${inviteForm.email}!`);
  };

  const usersByRole = {
    freelancer: users.filter((u) => u.role === "freelancer").length,
    startup: users.filter((u) => u.role === "startup").length,
    owner: users.filter((u) => u.role === "owner").length,
    community: users.filter((u) => u.role === "community").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  const statusColors: Record<UserStatus, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };

  const TABS = [
    { key: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { key: "users", label: "Users", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { key: "workspaces", label: "Workspaces", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" },
    { key: "payments", label: "Payments", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { key: "reports", label: "Reports", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ] as const;

  return (
    <DashboardLayout title="Admin Panel">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Admin Control Panel</h2>
            <p className="text-slate-500 text-sm">Platform-wide management and oversight</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowInviteModal(true)} className="btn-primary text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Invite User
          </button>
        </div>
      </div>

      {/* Pending Alert */}
      {pendingWorkspaces.length > 0 && (
        <div className="mb-5 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">{pendingWorkspaces.length} workspace{pendingWorkspaces.length > 1 ? "s" : ""} pending moderation review</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Review and approve new workspace listings</p>
          </div>
          <button onClick={() => setActiveTab("workspaces")} className="text-sm font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-800 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg transition-colors">
            Review
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              activeTab === t.key ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={t.icon} /></svg>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Platform Revenue", value: "$70,420", change: "15%", changeType: "up" as const, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "emerald" },
              { label: "Registered Users", value: users.length.toString(), change: "20%", changeType: "up" as const, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "primary" },
              { label: "Total Workspaces", value: "12,480", change: "8%", changeType: "up" as const, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5", color: "cyan" },
              { label: "System Uptime", value: "99.9%", change: "stable", changeType: "neutral" as const, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "emerald" },
            ].map((s) => <StatsCard key={s.label} {...s} />)}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* User Growth Chart */}
            <div className="lg:col-span-2 card p-6">
              <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">User Growth</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={ANALYTICS_DATA.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} dot={{ fill: "#4F46E5", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* User by Role */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 dark:text-white font-display mb-4">Users by Role</h3>
              <div className="space-y-3">
                {Object.entries(usersByRole).map(([role, count]) => (
                  <div key={role}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-md", getRoleColor(role as any))}>{getRoleLabel(role as any)}</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(count / users.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white font-display mb-4">System Status</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { service: "API Gateway", status: "operational", latency: "12ms" },
                { service: "Booking Engine", status: "operational", latency: "34ms" },
                { service: "Payment Processing", status: "operational", latency: "89ms" },
                { service: "AI Matching", status: "degraded", latency: "420ms" },
              ].map((s) => (
                <div key={s.service} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", s.status === "operational" ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">{s.service}</p>
                    <p className="text-xs text-slate-400">{s.latency} · {s.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {activeTab === "users" && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="card p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search by name or email..." className="input-field pl-10 py-2.5 text-sm" />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field w-auto py-2.5 text-sm">
              <option value="All">All Roles</option>
              <option value="freelancer">Freelancer</option>
              <option value="startup">Startup</option>
              <option value="owner">Owner</option>
              <option value="community">Community</option>
              <option value="admin">Admin</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto py-2.5 text-sm">
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap py-2">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    {["User", "Role", "Plan", "Status", "Last Login", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{getInitials(user.name)}</div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.name}</p>
                              {user.verified && (
                                <svg className="w-3.5 h-3.5 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("text-xs px-2.5 py-1 rounded-md font-semibold", getRoleColor(user.role))}>{getRoleLabel(user.role)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-300 capitalize font-medium">{user.plan}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", statusColors[user.status])}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-slate-400">{user.lastLogin}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                          >
                            View
                          </button>
                          {user.status === "active" ? (
                            <button
                              onClick={() => setConfirmAction({ type: "suspend", userId: user.id })}
                              className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(user.id, "active")}
                              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                            >
                              Reinstate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No users match the current filters</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── WORKSPACES MODERATION ── */}
      {activeTab === "workspaces" && (
        <div className="space-y-5">
          {pendingWorkspaces.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                Pending Review ({pendingWorkspaces.length})
              </h3>
              <div className="space-y-3">
                {pendingWorkspaces.map((ws) => (
                  <div key={ws.id} className="card p-5 flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 dark:text-white">{ws.name}</h4>
                      <p className="text-sm text-slate-400 mt-0.5">by {ws.owner} · {ws.city} · {ws.type}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Submitted {ws.submitted}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setConfirmAction({ type: "preview_workspace", userId: ws.id });
                        }}
                        className="text-xs px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 font-medium transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleApproveWorkspace(ws.id)}
                        className="text-xs px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectWorkspace(ws.id)}
                        className="text-xs px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-3">All Listed Workspaces</h3>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      {["Workspace", "Type", "Location", "Rating", "Occupancy", "Status"].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {MOCK_WORKSPACES.map((ws) => (
                      <tr key={ws.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={ws.images[0]} alt={ws.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{ws.name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-500 capitalize">{ws.type.replace("-", " ")}</td>
                        <td className="px-5 py-4 text-sm text-slate-500">{ws.city}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-amber-500">{ws.rating > 0 ? `${ws.rating}★` : "—"}</td>
                        <td className="px-5 py-4 text-sm font-semibold">{ws.occupancy}%</td>
                        <td className="px-5 py-4">
                          <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", ws.available ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-500")}>
                            {ws.available ? "Live" : "Paused"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENTS ── */}
      {activeTab === "payments" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: "$70,420", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Paid Today", value: "$3,774", color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
              { label: "Refunded", value: "$850", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
              { label: "Failed", value: "$29", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
            ].map((s) => (
              <div key={s.label} className={cn("card p-5", s.bg)}>
                <p className={cn("text-2xl font-bold font-display", s.color)}>{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800 dark:text-white font-display">Recent Transactions</h3>
              <button onClick={() => toast.info("Exporting payment data...")} className="btn-secondary text-sm py-2">Export CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    {["User", "Type", "Amount", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {PAYMENT_ACTIVITY.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3.5 text-sm font-semibold text-slate-800 dark:text-white">{p.user}</td>
                      <td className="py-3.5 text-sm text-slate-500">{p.type}</td>
                      <td className="py-3.5 text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(p.amount)}</td>
                      <td className="py-3.5">
                        <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", getStatusColor(p.status))}>{p.status}</span>
                      </td>
                      <td className="py-3.5 text-sm text-slate-400">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── REPORTS ── */}
      {activeTab === "reports" && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Monthly Revenue Report", desc: "Breakdown of all revenue streams for the past month", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
              { title: "User Growth Analysis", desc: "Registration trends, churn rates, and cohort analysis", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "text-primary-600 bg-primary-50 dark:bg-primary-900/20" },
              { title: "Occupancy Report", desc: "Workspace utilization rates across all cities", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5", color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20" },
              { title: "Booking Analytics", desc: "Booking trends, peak times, and conversion rates", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20" },
              { title: "Community Report", desc: "Event attendance, group growth, and engagement metrics", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
              { title: "Security Audit Log", desc: "Login attempts, role changes, and flagged activity", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
            ].map((r) => (
              <div key={r.title} className="card p-5 hover:shadow-md transition-all group">
                <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center mb-4", r.color)}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={r.icon} /></svg>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{r.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{r.desc}</p>
                <button onClick={() => toast.info(`Generating ${r.title}...`)} className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:gap-2 transition-all">
                  Generate Report
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">Revenue vs Bookings</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ANALYTICS_DATA.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── USER DETAIL MODAL ── */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowUserModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">User Details</h2>
              <button onClick={() => setShowUserModal(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* User Info */}
              <div className="flex items-center gap-4">
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">{getInitials(selectedUser.name)}</div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 dark:text-white">{selectedUser.name}</h3>
                    {selectedUser.verified && <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>}
                  </div>
                  <p className="text-sm text-slate-400">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("text-xs px-2 py-0.5 rounded-md font-semibold", getRoleColor(selectedUser.role))}>{getRoleLabel(selectedUser.role)}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", statusColors[selectedUser.status])}>{selectedUser.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {[
                  { label: "Company", value: selectedUser.company || "—" },
                  { label: "Location", value: selectedUser.location || "—" },
                  { label: "Plan", value: selectedUser.plan || "free", className: "capitalize" },
                  { label: "Joined", value: selectedUser.joinedAt },
                  { label: "Last Login", value: selectedUser.lastLogin },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-slate-400">{item.label}</span>
                    <span className={cn("font-semibold text-slate-700 dark:text-slate-300", item.className)}>{item.value}</span>
                  </div>
                ))}
              </div>

              {selectedUser.bio && (
                <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Bio</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{selectedUser.bio}</p>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => toast.success(`Email sent to ${selectedUser.name}`)}
                  className="btn-secondary flex-1 py-2.5 text-sm justify-center"
                >
                  Send Email
                </button>
                {selectedUser.status === "active" ? (
                  <button
                    onClick={() => { setConfirmAction({ type: "suspend", userId: selectedUser.id }); setShowUserModal(false); }}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all"
                  >
                    Suspend User
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(selectedUser.id, "active")}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
                  >
                    Reinstate User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUSPEND CONFIRM ── */}
      {confirmAction?.type === "suspend" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white text-center mb-2">Suspend User?</h3>
            <p className="text-slate-500 text-sm text-center mb-5">
              This will immediately revoke access. The user will be notified by email.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="btn-secondary flex-1 py-3 text-sm justify-center">Cancel</button>
              <button
                onClick={() => handleStatusChange(confirmAction.userId, "suspended")}
                className="flex-1 py-3 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PREVIEW WORKSPACE MODAL ── */}
      {confirmAction?.type === "preview_workspace" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setConfirmAction(null); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            {(() => {
              const ws = pendingWorkspaces.find((w) => w.id === confirmAction.userId);
              if (!ws) return null;
              return (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-display mb-1">{ws.name}</h2>
                      <p className="text-sm text-slate-500">by {ws.owner} · {ws.city}</p>
                    </div>
                    <button onClick={() => setConfirmAction(null)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 mb-6 border border-slate-100 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Type</p>
                        <p className="font-medium text-slate-700 dark:text-slate-300 capitalize">{ws.type.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Submission Date</p>
                        <p className="font-medium text-slate-700 dark:text-slate-300">{ws.submitted}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mb-6 flex gap-3">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      This is a preview of the submitted workspace. Please review the details before approving it for the marketplace.
                    </p>
                  </div>

                  <div className="flex gap-3 justify-end border-t border-slate-100 dark:border-slate-700 pt-5">
                    <button onClick={() => setConfirmAction(null)} className="btn-secondary py-2.5 px-5 text-sm font-semibold">
                      Close
                    </button>
                    <button onClick={() => { handleRejectWorkspace(ws.id); setConfirmAction(null); }} className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 px-5 text-sm font-semibold transition-colors">
                      Reject Workspace
                    </button>
                    <button onClick={() => { handleApproveWorkspace(ws.id); setConfirmAction(null); }} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 px-5 text-sm font-semibold transition-colors">
                      Approve & Publish
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── INVITE USER MODAL ── */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowInviteModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">Invite New User</h2>
              <button onClick={() => setShowInviteModal(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="field-label">Full Name *</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="Jane Smith"
                  className={cn("input-field", inviteErrors.name && "border-red-400")}
                />
                {inviteErrors.name && <p className="text-xs text-red-500 mt-1">{inviteErrors.name}</p>}
              </div>
              <div>
                <label className="field-label">Email Address *</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="jane@example.com"
                  className={cn("input-field", inviteErrors.email && "border-red-400")}
                />
                {inviteErrors.email && <p className="text-xs text-red-500 mt-1">{inviteErrors.email}</p>}
              </div>
              <div>
                <label className="field-label">Assign Role</label>
                <select value={inviteForm.role} onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })} className="input-field">
                  <option value="freelancer">Freelancer</option>
                  <option value="startup">Startup / Team</option>
                  <option value="owner">Workspace Owner</option>
                  <option value="community">Community Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="field-label">Personal Message <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  rows={3}
                  placeholder="Hi! I'd like to invite you to join Spacebility..."
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowInviteModal(false)} className="btn-secondary flex-1 py-3 text-sm justify-center">Cancel</button>
                <button type="submit" disabled={inviting} className="btn-primary flex-1 py-3 text-sm justify-center">
                  {inviting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</> : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
