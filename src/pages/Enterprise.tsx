import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ENTERPRISE_FEATURES = [
  { title: "Dedicated Account Manager", desc: "A dedicated workspace specialist helps your team optimize usage and costs.", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { title: "Custom SLA", desc: "Guaranteed 99.99% uptime with custom SLAs and priority incident response.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944" },
  { title: "SSO & SAML", desc: "Seamless integration with your existing identity provider (Okta, Azure AD).", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { title: "Custom Reporting", desc: "Advanced analytics dashboards and custom reports for C-suite visibility.", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414" },
  { title: "Volume Discounts", desc: "Significant cost savings with enterprise pricing based on team size and usage.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v1" },
  { title: "Global Workspace Network", desc: "Access to 12,000+ workspaces in 80+ cities for distributed teams worldwide.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
];

const CLIENTS = ["Stripe", "Figma", "Notion", "Vercel", "Linear", "GitHub"];

export default function Enterprise() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-24 bg-gradient-to-br from-slate-900 to-primary-900/50 text-white px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="badge bg-white/10 text-white border border-white/20 mb-6 mx-auto">Enterprise Solutions</span>
            <h1 className="text-5xl lg:text-6xl font-bold font-display mb-6">Workspace Infrastructure for Your Entire Organization</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">Give your distributed teams access to world-class workspaces globally. Enterprise-grade security, custom billing, and dedicated support.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50">Talk to Sales</Link>
              <Link to="/pricing" className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10">View Pricing</Link>
            </div>
          </div>
        </section>

        <section className="py-12 bg-slate-50 dark:bg-slate-800/30 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-medium text-slate-400 mb-6 tracking-wider uppercase">Trusted by leading companies</p>
            <div className="flex flex-wrap justify-center gap-8">
              {CLIENTS.map((c) => <span key={c} className="text-xl font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">{c}</span>)}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">Built for Enterprise Scale</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Everything your organization needs to manage workspaces across teams, offices, and continents.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ENTERPRISE_FEATURES.map((f) => (
                <div key={f.title} className="card p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center px-4">
          <h2 className="text-3xl font-bold font-display mb-4">Ready to Scale Your Workspace?</h2>
          <p className="text-primary-200 text-lg mb-8">Talk to our enterprise team for a custom demo and pricing.</p>
          <Link to="/contact" className="bg-white text-primary-600 font-semibold px-10 py-4 rounded-xl hover:bg-primary-50 inline-block">Schedule a Demo</Link>
        </section>
        <Footer />
      </div>
    </div>
  );
}
