import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { cn, getInitials, getRoleColor, getRoleLabel } from "@/lib/utils";
import { MOCK_NOTIFICATIONS } from "@/lib/data";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Messages", href: "/dashboard/messages", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { label: "My Bookings", href: "/dashboard/bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Workspaces", href: "/dashboard/workspaces", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", roles: ["owner", "admin"] },
  { label: "Smart Access", href: "/dashboard/access", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", roles: ["owner", "admin"] },
  { label: "Analytics", href: "/dashboard/analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", roles: ["owner", "admin", "startup"] },
  { label: "Community", href: "/dashboard/community", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", roles: ["community", "admin"] },
  { label: "Events", href: "/dashboard/events", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z", roles: ["community", "admin"] },
  { label: "Billing", href: "/dashboard/billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { label: "Users", href: "/dashboard/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", roles: ["admin"] },
  { label: "Admin Panel", href: "/dashboard/admin", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", roles: ["admin"] },
  { label: "Reports", href: "/dashboard/reports", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", roles: ["admin", "owner"] },
  { label: "Profile", href: "/dashboard/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: "Settings", href: "/dashboard/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  // Close notification dropdown on route change
  useEffect(() => {
    setNotifOpen(false);
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close notification dropdown on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
      }
    };
    if (notifOpen) {
      document.addEventListener("keydown", handler);
    }
    return () => document.removeEventListener("keydown", handler);
  }, [notifOpen]);

  const unreadNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role || "")
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const roleColors: Record<string, string> = {
    freelancer: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    startup: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    owner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    community: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700/60 flex flex-col transition-transform duration-300 ease-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/60">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H15V16H9V22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-base font-display text-slate-900 dark:text-white leading-none block">Spacebility</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider">WORKSPACE OS</span>
            </div>
          </Link>
        </div>

        {/* User Profile — no role switcher */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 ring-2 ring-white dark:ring-slate-600" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {getInitials(user?.name || "U")}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate leading-tight">{user?.name}</p>
              <span className={cn("text-xs px-2 py-0.5 rounded-md font-semibold inline-block mt-0.5", roleColors[user?.role || ""] || "bg-slate-100 text-slate-600")}>
                {getRoleLabel(user?.role || "")}
              </span>
            </div>
            <Link to="/dashboard/profile" className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-0.5">
          {/* Group label */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-2 mt-1">Main Menu</p>
          {filteredNavItems.slice(0, filteredNavItems.findIndex(i => i.href === "/dashboard/profile")).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <svg className="w-4.5 h-4.5 flex-shrink-0" style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-2 mt-3">Account</p>
          {filteredNavItems.slice(filteredNavItems.findIndex(i => i.href === "/dashboard/profile")).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
          <Link to="/marketplace" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Workspaces
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors">
            <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {title && (
              <div>
                <h1 className="font-bold text-slate-800 dark:text-white text-base leading-tight">{title}</h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors relative"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-card-hover border border-slate-100 dark:border-slate-700 overflow-hidden animate-fade-up z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Notifications</h3>
                    {unreadNotifs > 0 && <span className="badge-primary">{unreadNotifs} new</span>}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {MOCK_NOTIFICATIONS.map((n) => (
                      <Link
                        key={n.id}
                        to={n.actionUrl || "#"}
                        onClick={() => setNotifOpen(false)}
                        className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("w-2 h-2 mt-1.5 rounded-full flex-shrink-0", n.read ? "bg-slate-300 dark:bg-slate-600" : "bg-primary-500")} />
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-white leading-snug">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link to="/dashboard/notifications" onClick={() => setNotifOpen(false)} className="block p-3 text-center text-sm text-primary-600 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    View all notifications →
                  </Link>
                </div>
              )}
            </div>

            {/* Avatar */}
            <Link to="/dashboard/profile" className="flex items-center gap-2 ml-1 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} className="w-8 h-8 rounded-lg object-cover ring-2 ring-slate-200 dark:ring-slate-600" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user?.name || "U")}
                </div>
              )}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">{user?.name?.split(" ")[0]}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
