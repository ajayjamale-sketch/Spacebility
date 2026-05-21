import React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const INTEGRATIONS = [
  { name: "Google Calendar", cat: "Productivity", desc: "Sync workspace bookings directly to your calendar.", logo: "📅" },
  { name: "Slack", cat: "Communication", desc: "Receive booking confirmations and reminders in Slack.", logo: "💬" },
  { name: "Zoom", cat: "Video", desc: "Auto-generate Zoom links for meeting room bookings.", logo: "🎥" },
  { name: "Stripe", cat: "Payments", desc: "Secure payment processing for all transactions.", logo: "💳" },
  { name: "Salesforce", cat: "CRM", desc: "Sync workspace usage data with your CRM.", logo: "☁️" },
  { name: "Microsoft Teams", cat: "Communication", desc: "Booking notifications and team coordination.", logo: "🔷" },
  { name: "Notion", cat: "Productivity", desc: "Embed workspace schedules in Notion pages.", logo: "📝" },
  { name: "HubSpot", cat: "CRM", desc: "Track enterprise workspace usage in HubSpot.", logo: "🔶" },
];

export default function Integrations() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-slate-900 to-primary-900/50 text-white text-center px-4">
          <h1 className="text-5xl font-bold font-display mb-4">Integrations & API</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Connect Spacebility with your favorite tools. Build custom workflows with our powerful REST API.</p>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-8 text-center">Available Integrations</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {INTEGRATIONS.map((int) => (
                <div key={int.name} className="card p-5 text-center hover:shadow-card-hover">
                  <div className="text-4xl mb-3">{int.logo}</div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-1 text-sm">{int.name}</h3>
                  <span className="badge-accent mb-2">{int.cat}</span>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{int.desc}</p>
                  <button onClick={() => toast.success(`${int.name} integration enabled!`)} className="mt-4 w-full py-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-sm font-medium hover:bg-primary-100 transition-colors">Connect</button>
                </div>
              ))}
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold font-display text-slate-800 dark:text-white mb-3">REST API</h2>
              <p className="text-slate-500 mb-5">Build custom integrations with our comprehensive API. Access workspace listings, booking management, and analytics programmatically.</p>
              <div className="bg-slate-900 rounded-xl p-5 font-mono text-sm text-emerald-400 mb-5">
                <p className="text-slate-400 mb-2"># Get available workspaces</p>
                <p>GET https://api.spacebility.com/v1/workspaces</p>
                <p className="text-slate-400 mt-3 mb-2"># Create a booking</p>
                <p>POST https://api.spacebility.com/v1/bookings</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => toast.info("API docs coming soon!")} className="btn-primary text-sm">View API Docs</button>
                <Link to="/contact" className="btn-secondary text-sm">Request API Key</Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
