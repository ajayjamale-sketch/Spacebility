import React, { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MOCK_EVENTS } from "@/lib/data";
import { formatDate, cn } from "@/lib/utils";

const EVENT_TYPES = ["All", "Networking", "Workshop", "Conference", "Meetup", "Webinar"];

export default function Events() {
  const [filter, setFilter] = useState("All");

  const filtered = MOCK_EVENTS.filter((e) => filter === "All" || e.type === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-slate-900 to-primary-900/50 text-white px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold font-display mb-4">Community Events</h1>
            <p className="text-xl text-slate-300 mb-8">Connect, learn, and grow at curated events across our global workspace network.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {EVENT_TYPES.map((t) => (
                <button key={t} onClick={() => setFilter(t)} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all", filter === t ? "bg-white text-primary-600" : "bg-white/10 text-white hover:bg-white/20 border border-white/20")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <div key={event.id} className="card overflow-hidden group">
                  <div className="relative overflow-hidden h-48">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="badge bg-white/90 backdrop-blur-sm text-slate-700 capitalize">{event.type}</span>
                      <span className={cn("badge", event.price === 0 ? "bg-emerald-500 text-white" : "bg-amber-500 text-white")}>
                        {event.price === 0 ? "Free" : `$${event.price}`}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2 leading-tight">{event.title}</h3>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">{event.description}</p>
                    <div className="space-y-1.5 mb-4 text-xs text-slate-400">
                      <div className="flex items-center gap-2"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{formatDate(event.date)} · {event.time}</div>
                      <div className="flex items-center gap-2"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>{event.location}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full w-32 mb-1">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }} />
                        </div>
                        <p className="text-xs text-slate-400">{event.attendees}/{event.maxAttendees} attending</p>
                      </div>
                      <button onClick={() => toast.success(`Registered for ${event.title}!`)} className="btn-primary text-sm py-2 px-4">
                        {event.price === 0 ? "Register Free" : `Register · $${event.price}`}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center px-4">
          <h2 className="text-3xl font-bold font-display mb-4">Host Your Own Event</h2>
          <p className="text-primary-200 mb-8">Reach thousands of professionals in our network by hosting events at Spacebility venues.</p>
          <Link to="/contact" className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50">Submit Event Proposal</Link>
        </section>

        <Footer />
      </div>
    </div>
  );
}
