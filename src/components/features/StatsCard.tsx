import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: string;
  color?: string;
  description?: string;
}

export default function StatsCard({ label, value, change, changeType = "up", icon, color = "primary", description }: Props) {
  const colorMap: Record<string, string> = {
    primary: "from-primary-500 to-primary-600",
    cyan: "from-cyan-400 to-cyan-600",
    emerald: "from-emerald-400 to-emerald-600",
    amber: "from-amber-400 to-amber-600",
    red: "from-red-400 to-red-600",
    violet: "from-violet-400 to-violet-600",
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm flex-shrink-0", colorMap[color])}>
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        {change && (
          <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full",
            changeType === "up" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
            changeType === "down" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
            "bg-slate-100 text-slate-600"
          )}>
            {changeType === "up" ? "↑" : changeType === "down" ? "↓" : "→"} {change}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold text-slate-800 dark:text-white font-display">{value}</p>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </div>
    </div>
  );
}
