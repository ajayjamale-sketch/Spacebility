import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    freelancer: "Freelancer",
    startup: "Startup Team",
    owner: "Workspace Owner",
    community: "Community Manager",
    admin: "Admin",
  };
  return labels[role] || role;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-slate-100 text-slate-700",
    "checked-in": "bg-cyan-100 text-cyan-700",
    paid: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
    refunded: "bg-slate-100 text-slate-700",
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-slate-100 text-slate-700",
    suspended: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-slate-100 text-slate-700";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function calculateOccupancyColor(occupancy: number): string {
  if (occupancy >= 90) return "text-red-600";
  if (occupancy >= 70) return "text-amber-600";
  return "text-emerald-600";
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    freelancer: "bg-cyan-100 text-cyan-700",
    startup: "bg-violet-100 text-violet-700",
    owner: "bg-emerald-100 text-emerald-700",
    community: "bg-amber-100 text-amber-700",
    admin: "bg-red-100 text-red-700",
  };
  return colors[role] || "bg-slate-100 text-slate-700";
}
