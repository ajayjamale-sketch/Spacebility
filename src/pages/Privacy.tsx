import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const SECTIONS = [
  { title: "Information We Collect", content: "We collect information you provide directly (name, email, company), information from your use of our services (booking history, preferences, usage patterns), and technical information (IP address, device type, cookies). We use this data to provide, improve, and personalize our services." },
  { title: "How We Use Your Information", content: "Your information is used to process bookings, send confirmations, provide AI-powered recommendations, process payments, communicate service updates, and improve our platform. We do not sell your personal information to third parties." },
  { title: "Information Sharing", content: "We share information with workspace owners to facilitate your bookings, payment processors for transaction handling, and service providers who assist our operations. All third parties are bound by confidentiality agreements and data protection standards." },
  { title: "Data Retention", content: "We retain your account information for as long as your account is active. Booking records are kept for 7 years for tax and legal compliance. You may request deletion of your account and associated data at any time." },
  { title: "Your Rights", content: "You have the right to access, correct, or delete your personal data. You may opt out of marketing communications at any time. EU and California residents have additional rights under GDPR and CCPA respectively." },
  { title: "Cookies", content: "We use essential cookies for platform functionality and analytics cookies to understand how our services are used. You can control cookie preferences through your browser settings." },
  { title: "Security", content: "We implement industry-standard security measures including encryption in transit and at rest, access controls, and regular security audits. We are SOC 2 Type II certified." },
  { title: "Contact Us", content: "For privacy inquiries, contact our Data Protection Officer at privacy@spacebility.com or at 100 Market St, San Francisco, CA 94105, United States." },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-16 bg-slate-50 dark:bg-slate-800/30 px-4 text-center">
          <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: January 15, 2026</p>
        </section>
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <p className="text-slate-500 leading-relaxed">At Spacebility, we take your privacy seriously. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our platform.</p>
            {SECTIONS.map((s) => (
              <div key={s.title} className="border-b border-slate-100 dark:border-slate-700 pb-8">
                <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-3">{s.title}</h2>
                <p className="text-slate-500 leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
