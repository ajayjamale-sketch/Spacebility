import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_EVENTS } from "@/lib/data";
import { formatDate, cn } from "@/lib/utils";

const EVENT_TYPES = ["networking", "workshop", "conference", "meetup", "webinar", "hackathon"];
const today = new Date().toISOString().split("T")[0];

export default function DashboardEvents() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "", date: "", time: "18:00", location: "", type: "networking",
    description: "", maxAttendees: "", price: "0",
  });
  const [eventErrors, setEventErrors] = useState<Partial<typeof eventForm>>({});
  const [submittingEvent, setSubmittingEvent] = useState(false);

  const validateEvent = () => {
    const errs: Partial<typeof eventForm> = {};
    if (!eventForm.title.trim()) errs.title = "Title required";
    if (!eventForm.date) errs.date = "Date required";
    if (!eventForm.location.trim()) errs.location = "Location required";
    if (!eventForm.maxAttendees || Number(eventForm.maxAttendees) < 1) errs.maxAttendees = "Capacity required";
    setEventErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEvent()) return;
    setSubmittingEvent(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmittingEvent(false);

    if (editingEventId) {
      setEvents(events.map(ev => ev.id === editingEventId ? {
        ...ev,
        title: eventForm.title,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        type: eventForm.type as any,
        maxAttendees: Number(eventForm.maxAttendees),
        price: Number(eventForm.price),
      } : ev));
      toast.success("Event updated successfully!");
    } else {
      const newEvent = {
        id: `e${Date.now()}`,
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        type: eventForm.type as any,
        attendees: 0,
        maxAttendees: Number(eventForm.maxAttendees),
        price: Number(eventForm.price),
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
        organizer: "Current User",
        tags: ["Community", eventForm.type],
        featured: false,
      };
      setEvents((prev) => [newEvent, ...prev]);
      toast.success("Event created successfully!");
    }
    
    setShowEventModal(false);
  };

  const openCreateModal = () => {
    setEditingEventId(null);
    setEventForm({ title: "", date: "", time: "18:00", location: "", type: "networking", description: "", maxAttendees: "", price: "0" });
    setShowEventModal(true);
  };

  const openEditModal = (event: typeof MOCK_EVENTS[0]) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title, date: event.date, time: event.time, location: event.location, type: event.type,
      description: event.description || "", maxAttendees: String(event.maxAttendees), price: String(event.price),
    });
    setShowEventModal(true);
  };

  return (
    <DashboardLayout title="Event Management">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Event Management</h2>
          <p className="text-slate-500 text-sm">{events.length} events managed</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[{ l: "Total Events", v: events.length }, { l: "Free Events", v: events.filter(e => e.price === 0).length }, { l: "Total Attendees", v: events.reduce((s, e) => s + e.attendees, 0).toLocaleString() }, { l: "Avg Attendance", v: `${events.length ? Math.round(events.reduce((s, e) => s + (e.attendees / e.maxAttendees) * 100, 0) / events.length) : 0}%` }].map((s) => (
          <div key={s.l} className="card p-5 text-center">
            <p className="text-2xl font-bold text-primary-600 font-display">{s.v}</p>
            <p className="text-sm text-slate-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="card p-5 flex flex-col sm:flex-row gap-4">
            <img src={event.image} alt={event.title} className="w-full sm:w-36 h-36 sm:h-24 rounded-2xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{event.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{formatDate(event.date)} · {event.time} · {event.location}</p>
                </div>
                <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0", event.price === 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                  {event.price === 0 ? "Free" : `$${event.price}`}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Registrations</span>
                    <span>{event.attendees}/{event.maxAttendees}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 capitalize">{event.type}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(event)} className="btn-secondary text-sm py-2">Edit</button>
                <button onClick={() => toast.success("Event promoted!")} className="btn-primary text-sm py-2">Promote</button>
                <Link to="/events" className="btn-secondary text-sm py-2">View Public</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowEventModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-scale-in">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">{editingEventId ? "Edit Event" : "Create New Event"}</h2>
              <button onClick={() => setShowEventModal(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="field-label">Event Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Startup Founders Networking Night"
                  className={cn("input-field", eventErrors.title && "border-red-400")}
                />
                {eventErrors.title && <p className="text-xs text-red-500 mt-1">{eventErrors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Event Type *</label>
                  <select value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })} className="input-field capitalize">
                    {EVENT_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Ticket Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                    placeholder="0 = Free"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Date *</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    min={today}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className={cn("input-field", eventErrors.date && "border-red-400")}
                  />
                  {eventErrors.date && <p className="text-xs text-red-500 mt-1">{eventErrors.date}</p>}
                </div>
                <div>
                  <label className="field-label">Time *</label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Location *</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="e.g. The Innovation Hub, SF or Online"
                  className={cn("input-field", eventErrors.location && "border-red-400")}
                />
                {eventErrors.location && <p className="text-xs text-red-500 mt-1">{eventErrors.location}</p>}
              </div>

              <div>
                <label className="field-label">Max Attendees *</label>
                <input
                  type="number"
                  min="1"
                  value={eventForm.maxAttendees}
                  onChange={(e) => setEventForm({ ...eventForm, maxAttendees: e.target.value })}
                  placeholder="100"
                  className={cn("input-field", eventErrors.maxAttendees && "border-red-400")}
                />
                {eventErrors.maxAttendees && <p className="text-xs text-red-500 mt-1">{eventErrors.maxAttendees}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEventModal(false)} className="btn-secondary flex-1 py-3 text-sm justify-center">Cancel</button>
                <button type="submit" disabled={submittingEvent} className="btn-primary flex-1 py-3 text-sm justify-center">
                  {submittingEvent ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : (editingEventId ? "Save Changes" : "Create Event")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
