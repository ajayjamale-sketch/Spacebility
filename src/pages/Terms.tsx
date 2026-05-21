import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TERMS = [
  { title: "Acceptance of Terms", content: "By accessing or using Spacebility's platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services." },
  { title: "Account Registration", content: "You must create an account to use most features. You are responsible for maintaining the security of your account credentials and all activities under your account. You must be at least 18 years old to create an account." },
  { title: "Booking & Reservations", content: "Bookings are subject to workspace availability and owner confirmation. Prices displayed are in USD and include applicable taxes. Cancellation policies vary by workspace and booking type." },
  { title: "User Conduct", content: "Users must use workspaces respectfully, follow workspace rules, and not engage in illegal activities. Spacebility reserves the right to suspend accounts that violate these terms." },
  { title: "Payments & Refunds", content: "Payment is processed at time of booking. Refunds are governed by our 30-day money-back guarantee for subscriptions and individual workspace cancellation policies for bookings." },
  { title: "Intellectual Property", content: "Spacebility owns all rights to the platform, brand, and proprietary technology. Users retain ownership of content they create but grant Spacebility a license to display it on the platform." },
  { title: "Limitation of Liability", content: "Spacebility is not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount paid for services in the 12 months preceding the claim." },
  { title: "Governing Law", content: "These Terms are governed by California law. Disputes will be resolved through binding arbitration under AAA rules, except for injunctive relief claims." },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-16 bg-slate-50 dark:bg-slate-800/30 px-4 text-center">
          <h1 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-slate-400">Last updated: January 15, 2026</p>
        </section>
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <p className="text-slate-500 leading-relaxed">These Terms of Service govern your use of the Spacebility platform. Please read them carefully before using our services.</p>
            {TERMS.map((s) => (
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
