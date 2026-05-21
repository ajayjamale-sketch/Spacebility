import React, { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "General Inquiry", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", company: "", subject: "General Inquiry", message: "" });
  };

  const CONTACTS = [
    { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Email Us", val: "hello@spacebility.com", sub: "We reply within 24 hours" },
    { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "Call Us", val: "+1 (888) SPACE-01", sub: "Mon-Fri, 9am-6pm PST" },
    { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", title: "Headquarters", val: "100 Market St, San Francisco, CA 94105", sub: "United States" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-primary-900/50 text-white text-center px-4">
          <h1 className="text-5xl font-bold font-display mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-300 max-w-xl mx-auto">We'd love to hear from you. Our friendly team is always here to help.</p>
        </section>

        {/* Contact Info */}
        <section className="py-12 px-4 bg-slate-50 dark:bg-slate-800/30">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5">
            {CONTACTS.map((c) => (
              <div key={c.title} className="card p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={c.icon} /></svg>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-1">{c.title}</h3>
                <p className="text-primary-600 font-medium text-sm">{c.val}</p>
                <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white text-center mb-10">Send Us a Message</h2>
            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Alex Rivera" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@company.com" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company</label>
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Your company name" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field">
                    <option>General Inquiry</option>
                    <option>Enterprise Sales</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                    <option>Press & Media</option>
                    <option>Workspace Listing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="Tell us how we can help..." className="input-field resize-none" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</> : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="h-80 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=400&fit=crop" alt="Map" className="w-full h-full object-cover opacity-50 dark:opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card-hover p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg></div>
              <div><p className="font-bold text-slate-800 dark:text-white text-sm">Spacebility HQ</p><p className="text-xs text-slate-400">100 Market St, San Francisco</p></div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
