import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "Getting Started", icon: "M13 10V3L4 14h7v7l9-11h-7z", articles: ["How to create your account", "Choosing the right workspace type", "Making your first booking", "Understanding pricing & plans", "Setting up your profile"] },
  { label: "Bookings & Payments", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", articles: ["How to book a workspace", "Cancellation & refund policy", "Understanding invoices", "Payment methods accepted", "Booking for your team"] },
  { label: "Dashboard & Features", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10", articles: ["Navigating your dashboard", "Using AI recommendations", "Analytics & reports", "Team management", "QR code check-in"] },
  { label: "Account & Security", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944", articles: ["Account settings guide", "Two-factor authentication", "Privacy settings", "Data export & deletion", "Password & login help"] },
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center px-4">
          <h1 className="text-4xl font-bold font-display mb-4">How can we help?</h1>
          <div className="max-w-xl mx-auto mt-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for answers..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none text-base shadow-lg" />
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {CATEGORIES.map((cat, i) => (
                <div key={cat.label} className="card">
                  <button onClick={() => setOpenCat(openCat === i ? null : i)} className="w-full flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} /></svg>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{cat.label}</p>
                        <p className="text-xs text-slate-400">{cat.articles.length} articles</p>
                      </div>
                    </div>
                    <svg className={cn("w-4 h-4 text-slate-400 transition-transform", openCat === i && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {openCat === i && (
                    <div className="border-t border-slate-100 dark:border-slate-700 px-5 pb-4">
                      <ul className="space-y-2 pt-3">
                        {cat.articles.map((a) => (
                          <li key={a}><button className="text-sm text-primary-600 hover:underline text-left w-full">→ {a}</button></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="card p-8 text-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
              <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-2">Still need help?</h3>
              <p className="text-slate-500 mb-5">Our support team is available Mon–Fri, 9am–6pm PST.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="mailto:support@spacebility.com" className="btn-primary text-sm">Email Support</a>
                <a href="/support" className="btn-secondary text-sm">Live Chat</a>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
