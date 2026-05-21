import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const JOBS = [
  { title: "Senior Full-Stack Engineer", dept: "Engineering", loc: "San Francisco / Remote", type: "Full-time" },
  { title: "AI/ML Product Manager", dept: "Product", loc: "New York / Remote", type: "Full-time" },
  { title: "Head of Enterprise Sales", dept: "Sales", loc: "San Francisco", type: "Full-time" },
  { title: "Senior UX Designer", dept: "Design", loc: "Remote", type: "Full-time" },
  { title: "DevOps Engineer", dept: "Engineering", loc: "Remote", type: "Full-time" },
  { title: "Community Growth Manager", dept: "Community", loc: "Austin / Remote", type: "Full-time" },
];

const PERKS = [
  { title: "Remote-First", desc: "Work from anywhere — or any Spacebility location worldwide.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
  { title: "Equity Package", desc: "Every team member shares in the company's success.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { title: "Unlimited Workspaces", desc: "Free access to any Spacebility workspace globally.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" },
  { title: "Learning Budget", desc: "$2,500/year for courses, conferences, and books.", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
];

export default function Careers() {
  const [dept, setDept] = useState("All");
  const depts = ["All", ...new Set(JOBS.map((j) => j.dept))];
  const filtered = dept === "All" ? JOBS : JOBS.filter((j) => j.dept === dept);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-24 bg-gradient-to-br from-slate-900 to-primary-900/50 text-white text-center px-4">
          <h1 className="text-5xl font-bold font-display mb-4">Work at Spacebility</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Help us build the future of work. We're looking for passionate people who believe great workspaces change everything.</p>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
              {PERKS.map((p) => (
                <div key={p.title} className="card p-5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={p.icon} /></svg>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-1 text-sm">{p.title}</h3>
                  <p className="text-xs text-slate-500">{p.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-5">Open Positions</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {depts.map((d) => (
                <button key={d} onClick={() => setDept(d)} className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${dept === d ? "border-primary-600 bg-primary-600 text-white" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400"}`}>{d}</button>
              ))}
            </div>
            <div className="space-y-3">
              {filtered.map((job) => (
                <div key={job.title} className="card p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{job.title}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">{job.dept} · {job.loc} · {job.type}</p>
                  </div>
                  <button onClick={() => toast.success(`Application for ${job.title} submitted!`)} className="btn-primary text-sm py-2 flex-shrink-0">Apply Now</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center px-4">
          <h2 className="text-2xl font-bold font-display mb-3">Don't See a Perfect Fit?</h2>
          <p className="text-primary-200 mb-6">We're always looking for talented people. Send us your resume.</p>
          <Link to="/contact" className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50">Get in Touch</Link>
        </section>
        <Footer />
      </div>
    </div>
  );
}
