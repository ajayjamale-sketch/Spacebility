import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const SECURITY_FEATURES = [
  { title: "SOC 2 Type II Certified", desc: "Independently audited security controls covering availability, confidentiality, and processing integrity.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "End-to-End Encryption", desc: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { title: "GDPR & CCPA Compliant", desc: "Full compliance with EU and California privacy regulations with proper data handling and user rights.", icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" },
  { title: "Two-Factor Authentication", desc: "Optional 2FA for all accounts using TOTP apps or SMS verification.", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { title: "99.9% Uptime SLA", desc: "Enterprise-grade infrastructure with redundancy and failover ensuring platform availability.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" },
  { title: "Vulnerability Disclosure", desc: "Responsible disclosure program with security researchers. Report issues to security@spacebility.com.", icon: "M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

export default function Security() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-slate-900 to-primary-900/50 text-white text-center px-4">
          <h1 className="text-5xl font-bold font-display mb-4">Security at Spacebility</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Your data security is our highest priority. We employ enterprise-grade security measures to protect your information.</p>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {SECURITY_FEATURES.map((f) => (
                <div key={f.title} className="card p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="card p-8 text-center">
              <h2 className="text-2xl font-bold font-display text-slate-800 dark:text-white mb-3">Report a Security Issue</h2>
              <p className="text-slate-500 mb-5">Found a vulnerability? We take all security reports seriously and respond within 24 hours.</p>
              <a href="mailto:security@spacebility.com" className="btn-primary">security@spacebility.com</a>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
