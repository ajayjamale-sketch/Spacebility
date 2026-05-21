import React, { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Support() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    { from: "bot", text: "Hi! I'm the Spacebility support assistant. How can I help you today?" },
  ]);

  const QUICK = ["How do I cancel a booking?", "I can't access my workspace", "How does billing work?", "Reset my password"];

  const send = async (text: string) => {
    if (!text.trim()) return;
    setChat((prev) => [...prev, { from: "user", text }]);
    setMsg("");
    await new Promise((r) => setTimeout(r, 800));
    const REPLIES: Record<string, string> = {
      "How do I cancel a booking?": "To cancel a booking: Go to Dashboard → My Bookings → select your booking → click 'Cancel Booking'. Cancellations made 24+ hours before are fully refunded.",
      "I can't access my workspace": "Check your booking code in the app, ensure it's the correct date/time. For access issues on-site, contact the workspace directly or call our 24/7 support line.",
      "How does billing work?": "Your subscription renews monthly or annually. Individual bookings are charged at time of booking. All invoices are in your Dashboard → Billing section.",
      "Reset my password": "Go to the Login page and click 'Forgot password'. Enter your email and we'll send a reset link within 2 minutes.",
    };
    setChat((prev) => [...prev, { from: "bot", text: REPLIES[text] || "I understand. Let me connect you with a human agent who can help you further. Our team responds within 2 hours during business hours (Mon-Fri, 9am-6pm PST)." }]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center px-4">
          <h1 className="text-4xl font-bold font-display mb-3">Support Center</h1>
          <p className="text-primary-200">We're here to help. Average response time: 2 hours.</p>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
            {/* Live Chat */}
            <div className="card overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-800 dark:text-white text-sm">Live Support Chat</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chat.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${m.from === "user" ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex flex-wrap gap-2 mb-3">
                  {QUICK.map((q) => (
                    <button key={q} onClick={() => send(q)} className="text-xs px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-100 transition-colors">{q}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(msg)} placeholder="Type your message..." className="input-field flex-1 py-2.5 text-sm" />
                  <button onClick={() => send(msg)} className="btn-primary text-sm py-2.5">Send</button>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="space-y-4">
              {[
                { title: "Email Support", desc: "support@spacebility.com", sub: "Response within 24 hours", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", action: () => toast.info("Opening email client...") },
                { title: "Phone Support", desc: "+1 (888) SPACE-01", sub: "Mon–Fri, 9am–6pm PST", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", action: () => toast.info("Calling support...") },
                { title: "Help Center", desc: "Browse 200+ help articles", sub: "Available 24/7", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", action: () => window.location.href = "/help" },
              ].map((c) => (
                <div key={c.title} className="card p-5 flex items-center gap-4 cursor-pointer hover:shadow-card-hover transition-shadow" onClick={c.action}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={c.icon} /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{c.title}</h4>
                    <p className="text-sm text-primary-600 font-medium">{c.desc}</p>
                    <p className="text-xs text-slate-400">{c.sub}</p>
                  </div>
                </div>
              ))}
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-800 dark:text-white">Platform Status</span>
                </div>
                {["API", "Booking Engine", "Payments", "Community"].map((s) => (
                  <div key={s} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-slate-500">{s}</span>
                    <span className="text-xs font-medium text-emerald-600">Operational</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
