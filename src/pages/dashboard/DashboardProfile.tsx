import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { getInitials, getRoleLabel, cn } from "@/lib/utils";

export default function DashboardProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", company: user?.company || "", bio: user?.bio || "", location: user?.location || "" });
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
        toast.success("Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser(form);
    setLoading(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">My Profile</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your personal information and preferences</p>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">{getInitials(user?.name || "U")}</div>
              )}
              <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white hover:bg-primary-700 transition-colors shadow-md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{user?.name}</h3>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge-primary">{getRoleLabel(user?.role || "")}</span>
                <span className="badge-accent capitalize">{user?.plan} Plan</span>
                {user?.verified && <span className="badge-success">✓ Verified</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">Personal Information</h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
                { label: "Email Address", key: "email", type: "email", placeholder: "your@email.com" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "+1 555 0100" },
                { label: "Company / Organization", key: "company", type: "text", placeholder: "Your company" },
                { label: "Location", key: "location", type: "text", placeholder: "City, Country" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Tell us about yourself..."
                className="input-field resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", company: user?.company || "", bio: user?.bio || "", location: user?.location || "" })} className="btn-secondary">
                Reset
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
