import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_USERS } from "@/lib/data";
import { getRoleLabel, getRoleColor, getInitials, cn, formatDate } from "@/lib/utils";
import type { User } from "@/types";

type UserStatus = "active" | "suspended" | "pending";

interface ManagedUser extends User { 
  status: UserStatus; 
  lastLogin: string; 
}

const INITIAL_USERS: ManagedUser[] = MOCK_USERS.map((u, i) => ({
  ...u,
  status: i === 0 ? "active" : i === 4 ? "active" : "active",
  lastLogin: ["1h ago", "3h ago", "2d ago", "5h ago", "Just now"][i] || "1d ago",
}));

export default function DashboardUsers() {
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "freelancer", message: "" });
  const [inviteErrors, setInviteErrors] = useState<{ name?: string; email?: string }>({});
  const [inviting, setInviting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; userId: string } | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
    setConfirmAction(null);
    setShowUserModal(false);
    const user = users.find((u) => u.id === userId);
    if (user) {
      const msgs: Record<string, string> = { suspended: `${user.name} has been suspended`, active: `${user.name} has been reinstated`, pending: `${user.name} set to pending review` };
      toast.success(msgs[newStatus] || "Status updated");
    }
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
    
    // Add dummy user for demo
    const newUser: ManagedUser = {
      id: `u${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role as any,
      avatar: "",
      verified: false,
      company: "",
      location: "",
      bio: "",
      joinedAt: new Date().toISOString().split('T')[0],
      plan: "free",
      status: "pending",
      lastLogin: "Never"
    };
    
    setUsers([newUser, ...users]);
    setInviteForm({ name: "", email: "", role: "freelancer", message: "" });
    toast.success(`Invitation sent to ${inviteForm.email}!`);
  };

  const statusColors: Record<UserStatus, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <DashboardLayout title="User Management">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">User Management</h2>
          <p className="text-slate-500 text-sm">{users.length} total users</p>
        </div>
        <button onClick={() => setShowInviteModal(true)} className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Invite User
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-10 py-2.5 text-sm" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field w-auto py-2.5 text-sm">
          <option>All</option>
          <option value="freelancer">Freelancer</option>
          <option value="startup">Startup</option>
          <option value="owner">Owner</option>
          <option value="community">Community</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                {["User", "Role", "Plan", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">{getInitials(user.name)}</div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("text-xs px-2.5 py-1 rounded-md font-medium", getRoleColor(user.role))}>{getRoleLabel(user.role)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">{user.plan}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-500">{formatDate(user.joinedAt)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", statusColors[user.status])}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => { setSelectedUser(user); setShowUserModal(true); }} className="text-xs text-primary-600 hover:underline font-medium">View</button>
                      {user.status === "active" ? (
                        <button onClick={() => setConfirmAction({ type: "suspend", userId: user.id })} className="text-xs text-red-600 hover:underline font-medium">Suspend</button>
                      ) : (
                        <button onClick={() => handleStatusChange(user.id, "active")} className="text-xs text-emerald-600 hover:underline font-medium">Reinstate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                  { label: "Joined", value: formatDate(selectedUser.joinedAt) },
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
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="input-field"
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="startup">Startup Team</option>
                  <option value="owner">Workspace Owner</option>
                  <option value="community">Community Manager</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
              <div>
                <label className="field-label">Personal Message (Optional)</label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  placeholder="Welcome to Spacebility!"
                  className="input-field min-h-[80px]"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full btn-primary py-3 justify-center"
                >
                  {inviting ? "Sending Invitation..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
