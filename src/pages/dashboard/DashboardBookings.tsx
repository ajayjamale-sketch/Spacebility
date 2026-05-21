import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_BOOKINGS } from "@/lib/data";
import { formatCurrency, formatShortDate, getStatusColor, cn } from "@/lib/utils";
import type { Booking } from "@/types";

const STATUS_FILTERS = ["All", "Confirmed", "Checked-in", "Completed", "Cancelled"];

export default function DashboardBookings() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const filtered = bookings.filter((b) => {
    const matchFilter = filter === "All" || b.status.toLowerCase() === filter.toLowerCase().replace("-", "-");
    const matchSearch = !search || b.workspaceName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleCancel = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" as const } : b));
    toast.success("Booking cancelled successfully");
  };

  return (
    <DashboardLayout title="My Bookings">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">My Bookings</h2>
          <p className="text-slate-500 text-sm mt-1">{bookings.length} total bookings</p>
        </div>
        <Link to="/marketplace" className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New Booking
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search workspaces..." className="input-field pl-10 py-2.5 text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all", filter === f ? "border-primary-600 bg-primary-600 text-white" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-slate-500 font-medium">No bookings found</p>
          <p className="text-sm text-slate-400 mt-1">Try a different filter or book a new workspace</p>
          <Link to="/marketplace" className="btn-primary mt-4 text-sm">Find Workspaces</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div key={booking.id} className="card p-5 flex flex-col sm:flex-row gap-4">
              <img src={booking.workspaceImage} alt={booking.workspaceName} className="w-full sm:w-28 h-36 sm:h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{booking.workspaceName}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{formatShortDate(booking.startDate)} · {booking.duration} · {booking.seats} seat{booking.seats > 1 ? "s" : ""}</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">{booking.bookingCode}</p>
                  </div>
                  <span className={cn("text-xs px-3 py-1.5 rounded-full font-semibold flex-shrink-0", getStatusColor(booking.status))}>{booking.status}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-slate-800 dark:text-white">{formatCurrency(booking.totalPrice)}</span>
                  <div className="flex gap-2">
                    <Link to={`/dashboard/bookings/${booking.id}`} className="btn-secondary text-sm py-2 px-4">View Details</Link>
                    {booking.status === "confirmed" && (
                      <button onClick={() => handleCancel(booking.id)} className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all">Cancel</button>
                    )}
                    {booking.status === "confirmed" && (
                      <button className="btn-primary text-sm py-2 px-4">Check In</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
