import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Door {
  id: string;
  name: string;
  status: "locked" | "unlocked";
  battery: number;
  lastAccess: string;
}

const MOCK_DOORS: Door[] = [
  { id: "d1", name: "Main Entrance", status: "locked", battery: 85, lastAccess: "2 mins ago" },
  { id: "d2", name: "Conference Room A", status: "unlocked", battery: 92, lastAccess: "15 mins ago" },
  { id: "d3", name: "Private Office 101", status: "locked", battery: 45, lastAccess: "2 hours ago" },
  { id: "d4", name: "Coworking Space 1", status: "locked", battery: 78, lastAccess: "5 mins ago" },
];

export default function DashboardAccess() {
  const [doors, setDoors] = useState<Door[]>(MOCK_DOORS);

  const toggleLock = (id: string) => {
    setDoors(doors.map(door => {
      if (door.id === id) {
        const newStatus = door.status === "locked" ? "unlocked" : "locked";
        toast.success(`${door.name} has been ${newStatus}.`);
        return { ...door, status: newStatus };
      }
      return door;
    }));
  };

  return (
    <DashboardLayout title="Smart Access & IoT">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Workspace Access</h2>
          <p className="text-slate-500 text-sm">Manage smart locks and monitor IoT occupancy</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Locks", value: "12", color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
          { label: "Daily Entries", value: "348", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Failed Attempts", value: "2", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { label: "Energy Usage", value: "140 kWh", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map((s) => (
          <div key={s.label} className={cn("card p-4 text-center", s.bg)}>
            <p className={cn("text-2xl font-bold font-display", s.color)}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Smart Doors</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {doors.map((door) => (
                <div key={door.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">{door.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">Battery: {door.battery}% • Last Access: {door.lastAccess}</p>
                  </div>
                  <button
                    onClick={() => toggleLock(door.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all",
                      door.status === "locked"
                        ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200"
                    )}
                  >
                    {door.status === "locked" ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Locked
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        Unlocked
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">IoT Sensors & Environment</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Temperature</p>
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-2xl font-bold text-slate-800 dark:text-white font-display">72°F</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Air Quality</p>
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-2xl font-bold text-slate-800 dark:text-white font-display">98%</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lighting</p>
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-2xl font-bold text-slate-800 dark:text-white font-display">Auto</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Access Logs</h3>
            <div className="space-y-4">
              {[
                { name: "John Doe", time: "10 mins ago", door: "Main Entrance", status: "success" },
                { name: "Alice Smith", time: "25 mins ago", door: "Conference Room A", status: "success" },
                { name: "Unknown User", time: "1 hour ago", door: "Private Office 101", status: "failed" },
                { name: "Bob Johnson", time: "2 hours ago", door: "Main Entrance", status: "success" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    log.status === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                  )}>
                    {log.status === "success" ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{log.name}</p>
                    <p className="text-xs text-slate-500">{log.door} • {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">View Full Log →</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
