import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingModal from "@/components/features/BookingModal";
import { MOCK_WORKSPACES } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const ROOMS = MOCK_WORKSPACES.filter((ws) => ws.type === "meeting-room" || ws.type === "event-space");
const ALL_ROOMS = MOCK_WORKSPACES.slice(0, 4);

export default function MeetingRooms() {
  const [booking, setBooking] = useState<typeof MOCK_WORKSPACES[0] | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-slate-900 to-primary-900/50 text-white px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="badge bg-white/10 text-white border border-white/20 mb-4">Meeting Rooms</span>
              <h1 className="text-5xl font-bold font-display mb-4">Book Professional Meeting Rooms</h1>
              <p className="text-xl text-slate-300 mb-6">Impress clients, run productive workshops, and host board meetings in world-class venues — bookable by the hour.</p>
              <Link to="/marketplace?type=meeting-room" className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50 inline-block">Browse Rooms</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&h=450&fit=crop" alt="Meeting Room" className="rounded-3xl shadow-2xl w-full" />
          </div>
        </section>

        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-3 text-center">Why Book with Spacebility</h2>
            <div className="grid sm:grid-cols-3 gap-5 mt-8">
              {[
                { t: "Instant Booking", d: "Book rooms in seconds. No back-and-forth emails or phone calls required.", i: "M13 10V3L4 14h7v7l9-11h-7z" },
                { t: "AV Included", d: "All rooms include displays, video conferencing, and whiteboard equipment.", i: "M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" },
                { t: "Catering Options", d: "Add coffee service, lunch, or full catering to any booking.", i: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
              ].map((f) => (
                <div key={f.t} className="card p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={f.i} /></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2">{f.t}</h3>
                  <p className="text-sm text-slate-500">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-8">Featured Meeting Spaces</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {ALL_ROOMS.map((ws) => (
                <div key={ws.id} className="card overflow-hidden group">
                  <div className="h-48 overflow-hidden"><img src={ws.images[0]} alt={ws.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1">{ws.name}</h3>
                    <p className="text-sm text-slate-400 mb-3">{ws.location} · Capacity {ws.capacity}</p>
                    <div className="flex items-center justify-between">
                      <div><span className="text-xl font-bold text-primary-600">{formatCurrency(ws.pricePerHour)}</span><span className="text-slate-400 text-sm">/hour</span></div>
                      <button onClick={() => setBooking(ws)} className="btn-primary text-sm py-2">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center px-4">
          <h2 className="text-2xl font-bold font-display mb-3">Need a Custom Meeting Solution?</h2>
          <p className="text-primary-200 mb-6">We offer tailored packages for recurring meetings and enterprise teams.</p>
          <Link to="/enterprise" className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50">Enterprise Solutions</Link>
        </section>

        {booking && <BookingModal workspace={booking} onClose={() => setBooking(null)} />}
        <Footer />
      </div>
    </div>
  );
}
