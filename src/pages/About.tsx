import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TEAM = [
  { name: "James Park", role: "CEO & Co-founder", bio: "Former WeWork VP, 15 years in commercial real estate tech.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face" },
  { name: "Sarah Chen", role: "CTO & Co-founder", bio: "Ex-Google engineer, built AI systems at scale for Fortune 500s.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face" },
  { name: "Alex Rivera", role: "Head of Design", bio: "Award-winning designer who shaped products at Airbnb and Stripe.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
  { name: "Emma Wilson", role: "VP Community", bio: "Built 3 startup communities from zero to thousands of members.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" },
];

const VALUES = [
  { title: "Human First", desc: "Every feature we build starts with the person using it. Technology serves people, not the other way around.", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { title: "Radical Transparency", desc: "Open pricing, honest communication, and no hidden fees. We believe trust is the foundation of great relationships.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "Sustainable Growth", desc: "We grow thoughtfully, building lasting value for our community rather than chasing short-term metrics.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { title: "Inclusive Access", desc: "Premium workspace should be accessible to everyone — from solo freelancers to growing enterprises.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-primary-900/30 to-slate-900 text-white text-center px-4">
          <span className="badge bg-white/10 text-white border border-white/20 mb-6 mx-auto">Our Story</span>
          <h1 className="text-5xl lg:text-6xl font-bold font-display mb-6 max-w-3xl mx-auto">We're Reimagining How the World Works</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Founded in 2023, Spacebility started with a simple belief: finding and booking a great workspace should be as easy as booking a flight.</p>
        </section>

        {/* Mission */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge-primary mb-4">Our Mission</span>
              <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-6">Empowering Every Professional to Work from Anywhere</h2>
              <p className="text-slate-500 leading-relaxed mb-4">We built Spacebility because we experienced the frustration firsthand. Finding a great workspace meant endless emails, outdated websites, and surprise fees.</p>
              <p className="text-slate-500 leading-relaxed mb-6">Today, we're proud to serve 50,000+ professionals across 80+ cities, connecting them with 12,000+ premium workspaces — all powered by AI that learns what you need before you even ask.</p>
              <Link to="/register" className="btn-primary">Join the Movement</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" alt="Workspace" className="rounded-3xl h-52 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&h=300&fit=crop" alt="Community" className="rounded-3xl h-52 w-full object-cover mt-8" />
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop" alt="Collaboration" className="rounded-3xl h-52 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop" alt="Remote" className="rounded-3xl h-52 w-full object-cover mt-8" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-slate-800 dark:to-slate-900 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[{ v: "2023", l: "Founded" }, { v: "50K+", l: "Members" }, { v: "12K+", l: "Workspaces" }, { v: "80+", l: "Cities" }].map((s) => (
              <div key={s.l} className="card p-6">
                <p className="text-4xl font-bold text-primary-600 font-display">{s.v}</p>
                <p className="text-slate-500 mt-2">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="badge-accent mb-4">Our Values</span>
              <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white">What Drives Us</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="card p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={v.icon} /></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2 font-display">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-slate-50 dark:bg-slate-800/30 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="badge-primary mb-4">Our Team</span>
              <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white">The People Behind Spacebility</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((member) => (
                <div key={member.name} className="card p-5 text-center">
                  <img src={member.img} alt={member.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 dark:text-white">{member.name}</h4>
                  <p className="text-xs text-primary-600 font-medium mt-0.5 mb-2">{member.role}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 text-center bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <h2 className="text-3xl font-bold font-display mb-4">Join Our Journey</h2>
          <p className="text-primary-200 text-lg mb-8 max-w-xl mx-auto">Be part of the workspace revolution. Thousands of teams already trust Spacebility to power their work.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all">Get Started Free</Link>
            <Link to="/careers" className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">Join Our Team</Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
