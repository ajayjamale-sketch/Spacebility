import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function DashboardSettings() {
  const { theme, toggleTheme } = useTheme();
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false, weekly: true, events: true, promotions: false });
  const [privacy, setPrivacy] = useState({ profilePublic: true, showEmail: false, showActivity: true });
  const [twoFA, setTwoFA] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Delete Account State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Change Password State
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  
  // Sessions State
  const [isSessionsDialogOpen, setIsSessionsDialogOpen] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: "Windows • Chrome", location: "New York, USA", current: true, date: "Active now" },
    { id: 2, device: "MacBook Pro • Safari", location: "New York, USA", current: false, date: "2 hours ago" },
    { id: 3, device: "iPhone 13 • App", location: "Boston, USA", current: false, date: "Yesterday" }
  ]);

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("Settings saved successfully!");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match!");
      return;
    }
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Changing password...',
        success: () => {
          setIsPasswordDialogOpen(false);
          setPasswords({ current: "", new: "", confirm: "" });
          return 'Password updated successfully';
        },
        error: 'Failed to update password'
      }
    );
  };

  const revokeSession = (id: number) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast.success("Session revoked successfully");
  };

  const revokeAllOtherSessions = () => {
    setSessions(sessions.filter(s => s.current));
    toast.success("All other sessions revoked");
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="card p-6 mb-5">
      <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">{title}</h3>
      {children}
    </div>
  );

  const Toggle = ({ checked, onChange, label, desc }: { checked: boolean; onChange: () => void; label: string; desc?: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-white">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button onClick={onChange} className={cn("relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none", checked ? "bg-primary-600" : "bg-slate-200 dark:bg-slate-700")}>
        <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200", checked ? "translate-x-7" : "translate-x-1")} />
      </button>
    </div>
  );

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Account Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Configure your preferences and account options</p>
        </div>

        <Section title="Appearance">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">Theme</p>
              <p className="text-xs text-slate-400 mt-0.5">Choose between light and dark mode</p>
            </div>
            <div className="flex gap-2">
              {["light", "dark"].map((t) => (
                <button key={t} onClick={() => { if (theme !== t) toggleTheme(); }}
                  className={cn("px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border-2", theme === t ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400")}>
                  {t === "light" ? "☀️ Light" : "🌙 Dark"}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Notifications">
          <Toggle checked={notifs.email} onChange={() => setNotifs({ ...notifs, email: !notifs.email })} label="Email Notifications" desc="Receive booking confirmations and updates via email" />
          <Toggle checked={notifs.push} onChange={() => setNotifs({ ...notifs, push: !notifs.push })} label="Push Notifications" desc="Browser and mobile push notifications" />
          <Toggle checked={notifs.sms} onChange={() => setNotifs({ ...notifs, sms: !notifs.sms })} label="SMS Notifications" desc="Text messages for important updates" />
          <Toggle checked={notifs.weekly} onChange={() => setNotifs({ ...notifs, weekly: !notifs.weekly })} label="Weekly Digest" desc="Summary of your workspace activity each week" />
          <Toggle checked={notifs.events} onChange={() => setNotifs({ ...notifs, events: !notifs.events })} label="Community Events" desc="Get notified about nearby events and meetups" />
          <Toggle checked={notifs.promotions} onChange={() => setNotifs({ ...notifs, promotions: !notifs.promotions })} label="Promotions & Offers" desc="Special deals and workspace discounts" />
        </Section>

        <Section title="Privacy">
          <Toggle checked={privacy.profilePublic} onChange={() => setPrivacy({ ...privacy, profilePublic: !privacy.profilePublic })} label="Public Profile" desc="Allow other members to find and view your profile" />
          <Toggle checked={privacy.showEmail} onChange={() => setPrivacy({ ...privacy, showEmail: !privacy.showEmail })} label="Show Email" desc="Display email on your public profile" />
          <Toggle checked={privacy.showActivity} onChange={() => setPrivacy({ ...privacy, showActivity: !privacy.showActivity })} label="Activity Status" desc="Show when you're active on the platform" />
        </Section>

        <Section title="Security">
          <Toggle checked={twoFA} onChange={() => setTwoFA(!twoFA)} label="Two-Factor Authentication" desc="Add an extra layer of security to your account" />
          <div className="mt-4 flex gap-3">
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <button className="btn-secondary text-sm">Change Password</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handlePasswordChange}>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Update your account password here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="current" className="text-right text-sm">Current</Label>
                      <Input id="current" type="password" required value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="new" className="text-right text-sm">New</Label>
                      <Input id="new" type="password" required value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="confirm" className="text-right text-sm">Confirm</Label>
                      <Input id="confirm" type="password" required value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isSessionsDialogOpen} onOpenChange={setIsSessionsDialogOpen}>
              <DialogTrigger asChild>
                <button className="btn-secondary text-sm">Manage Sessions</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Active Sessions</DialogTitle>
                  <DialogDescription>
                    These are the devices currently logged into your account. Revoke any sessions you don't recognize.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {sessions.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No active sessions found.</p>
                  ) : (
                    sessions.map(session => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg border-slate-200 dark:border-slate-800">
                        <div>
                          <p className="font-medium flex items-center gap-2 text-sm">
                            {session.device} 
                            {session.current && <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full font-medium">Current</span>}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{session.location} • {session.date}</p>
                        </div>
                        {!session.current && (
                          <Button variant="ghost" size="sm" onClick={() => revokeSession(session.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">Revoke</Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <DialogFooter className="sm:justify-between items-center flex-row">
                  <Button type="button" variant="outline" onClick={() => setIsSessionsDialogOpen(false)}>Close</Button>
                  {sessions.length > 1 && (
                    <Button type="button" variant="destructive" onClick={revokeAllOtherSessions}>Revoke all other</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Section>

        <div className="flex justify-between items-center">
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">Delete Account</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your account? This action is irreversible. All your data, bookings, and active subscriptions will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-between items-center flex-row mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleting}>Cancel</Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  disabled={deleting}
                  onClick={async () => {
                    setDeleting(true);
                    await new Promise(r => setTimeout(r, 1500));
                    logout();
                    toast.success("Account deleted successfully");
                    navigate("/register");
                  }}
                >
                  {deleting ? "Deleting..." : "Yes, Delete Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <button onClick={handleSave} disabled={loading} className="btn-primary">
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : "Save Settings"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

