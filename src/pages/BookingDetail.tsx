import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_BOOKINGS } from "@/lib/data";
import { formatCurrency, formatShortDate, formatTime, getStatusColor, cn } from "@/lib/utils";

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(MOCK_BOOKINGS.find((b) => b.id === id) || null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setBooking(MOCK_BOOKINGS.find((b) => b.id === id) || null);
  }, [id]);

  if (!booking) {
    return (
      <DashboardLayout title="Booking Not Found">
        <div className="text-center py-16">
          <p className="text-slate-500 mb-4">This booking could not be found.</p>
          <Link to="/dashboard/bookings" className="btn-primary">Back to Bookings</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Booking Details">
      <div className="max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate("/dashboard/bookings")} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Booking #{booking.bookingCode}</h2>
        </div>

        {/* Status Card */}
        <div className="card p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <span className={cn("px-4 py-2 rounded-full text-sm font-semibold", getStatusColor(booking.status))}>{booking.status}</span>
            <span className={cn("px-4 py-2 rounded-full text-sm font-semibold", getStatusColor(booking.paymentStatus))}>Payment: {booking.paymentStatus}</span>
          </div>
          <img src={booking.workspaceImage} alt={booking.workspaceName} className="w-full h-48 rounded-2xl object-cover mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">{booking.workspaceName}</h3>
        </div>

        {/* Details */}
        <div className="card p-6 mb-5">
          <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">Booking Details</h3>
          <div className="space-y-4">
            {[
              { label: "Booking Code", value: booking.bookingCode, mono: true },
              { label: "Date", value: formatShortDate(booking.startDate) },
              { label: "Time", value: `${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}` },
              { label: "Duration", value: booking.duration },
              { label: "Seats", value: `${booking.seats} seat${booking.seats > 1 ? "s" : ""}` },
              { label: "Booking Type", value: booking.type.charAt(0).toUpperCase() + booking.type.slice(1) },
              { label: "Total Amount", value: formatCurrency(booking.totalPrice), bold: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-sm text-slate-500">{item.label}</span>
                <span className={cn("text-sm", item.bold ? "text-xl font-bold text-primary-600" : "font-medium text-slate-800 dark:text-white", item.mono && "font-mono")}>{item.value}</span>
              </div>
            ))}
          </div>
          {booking.notes && (
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <p className="text-xs text-slate-400 mb-1">Notes</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* QR Code (simulated) */}
        {(booking.status === "confirmed" || booking.status === "checked-in") && (
          <div className="card p-6 mb-5 text-center">
            <h3 className="font-bold text-slate-800 dark:text-white font-display mb-4">Check-In QR Code</h3>
            <div className="w-40 h-40 mx-auto bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-3">
              <div className="w-28 h-28 grid grid-cols-7 gap-0.5">
                {[...Array(49)].map((_, i) => (
                  <div key={i} className={cn("rounded-sm", (i + Math.floor(i / 7)) % 3 === 0 ? "bg-slate-800 dark:bg-white" : "bg-slate-200 dark:bg-slate-600")} />
                ))}
              </div>
            </div>
            <p className="text-sm font-mono text-slate-500">{booking.bookingCode}</p>
            <p className="text-xs text-slate-400 mt-1">Present this code at the workspace entrance</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <Link to={`/marketplace/${booking.workspaceId}`} className="btn-secondary flex-1 justify-center">View Workspace</Link>
          {booking.status === "confirmed" && (
            <button 
              onClick={() => {
                setBooking({ ...booking, status: "cancelled" });
                toast.success("Booking cancelled successfully");
                setTimeout(() => navigate("/dashboard/bookings"), 1500);
              }} 
              className="flex-1 py-3 px-5 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:border-red-300 transition-all"
            >
              Cancel Booking
            </button>
          )}
          <button 
            onClick={async () => {
              setDownloading(true);
              await new Promise(r => setTimeout(r, 1200));
              setDownloading(false);
              toast.success("Receipt downloaded!");
            }} 
            disabled={downloading}
            className="btn-primary flex-1 justify-center disabled:opacity-50"
          >
            {downloading ? "Downloading..." : "Download Receipt"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
