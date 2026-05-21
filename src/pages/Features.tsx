import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FEATURES = [
  { category: "AI & Smart Technology", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", color: "from-violet-500 to-violet-700", items: ["AI-powered workspace matching", "Smart schedule optimization", "Predictive availability insights", "Usage pattern analytics", "Automated recommendations"] },
  { category: "Booking & Scheduling", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "from-primary-500 to-primary-700", items: ["Instant booking confirmation", "Hourly, daily & monthly options", "Recurring booking series", "Team calendar sync", "QR code check-in/out", "Booking modifications"] },
  { category: "Workspace Discovery", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", color: "from-cyan-500 to-cyan-700", items: ["12,000+ verified workspaces", "Advanced amenity filtering", "Real-time availability", "Neighborhood guides", "Virtual tours", "Instant availability check"] },
  { category: "Community & Events", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "from-emerald-500 to-emerald-700", items: ["Member networking profiles", "Community events calendar", "Interest-based groups", "Direct messaging", "Event RSVP management", "Community forums"] },
  { category: "Analytics & Reporting", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "from-amber-500 to-amber-700", items: ["Real-time occupancy dashboards", "Revenue & spend analytics", "Team productivity metrics", "Custom report builder", "Data export (CSV, PDF)", "API data access"] },
  { category: "Enterprise & Security", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "from-slate-500 to-slate-700", items: ["SSO & SAML support", "Role-based permissions", "SOC 2 Type II compliant", "GDPR & CCPA ready", "Audit logs", "Custom SLAs"] },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-24 bg-gradient-to-br from-slate-900 to-primary-900/50 text-white text-center px-4">
          <span className="badge bg-white/10 text-white border border-white/20 mb-6 mx-auto">Platform Features</span>
          <h1 className="text-5xl font-bold font-display mb-4">Everything You Need to Work Smarter</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">A complete workspace management ecosystem designed for the modern distributed workforce.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all">
            Start Free Trial →
          </Link>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {FEATURES.map((feature) => (
                <div key={feature.category} className="card p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-sm`}>
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white font-display">{feature.category}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center px-4">
          <h2 className="text-3xl font-bold font-display mb-4">Ready to See It In Action?</h2>
          <p className="text-primary-200 mb-8">Schedule a live demo with our product team.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50">Get Started Free</Link>
            <Link to="/contact" className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10">Book a Demo</Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
