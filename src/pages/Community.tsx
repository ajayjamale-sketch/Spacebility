import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MOCK_USERS } from "@/lib/data";
import { getInitials, getRoleLabel, getRoleColor, cn } from "@/lib/utils";

const GROUPS = [
  { name: "Freelancers Network", members: 1240, category: "Networking", img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop" },
  { name: "Tech Startups Hub", members: 890, category: "Startup", img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop" },
  { name: "Remote Work Collective", members: 2100, category: "Remote Work", img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=200&fit=crop" },
  { name: "Design & Creative", members: 560, category: "Creative", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop" },
  { name: "AI & Machine Learning", members: 1780, category: "Technology", img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop" },
  { name: "Women in Tech", members: 920, category: "Diversity", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=200&fit=crop" },
];

export default function Community() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        <section className="py-24 bg-gradient-to-br from-slate-900 to-primary-900/50 text-white px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold font-display mb-4">Join the Spacebility Community</h1>
            <p className="text-xl text-slate-300 mb-8">50,000+ professionals connecting, collaborating, and growing together at workspaces around the world.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isAuthenticated ? "/dashboard" : "/register"} className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50">{isAuthenticated ? "Go to Dashboard" : "Join Now Free"}</Link>
              <Link to="/events" className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10">Browse Events</Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">Community Groups</h2>
              <p className="text-slate-500">Find your tribe among our interest-based professional communities</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {GROUPS.map((group) => (
                <div key={group.name} className="card overflow-hidden group">
                  <div className="h-36 overflow-hidden">
                    <img src={group.img} alt={group.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <span className="badge-accent mb-2">{group.category}</span>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1">{group.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">{group.members.toLocaleString()} members</p>
                    <button onClick={() => toast.success(`Joined ${group.name}!`)} className="btn-primary w-full justify-center text-sm py-2.5">Join Group</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50 dark:bg-slate-800/30 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-8 text-center">Community Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_USERS.map((member) => (
                <div key={member.id} className="card p-5 flex items-center gap-4">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">{getInitials(member.name)}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 dark:text-white">{member.name}</h4>
                    <p className="text-xs text-slate-400 truncate">{member.company || member.email}</p>
                    <span className={cn("text-xs px-2 py-0.5 rounded-md font-medium mt-1 inline-block", getRoleColor(member.role))}>{getRoleLabel(member.role)}</span>
                  </div>
                  <button onClick={() => toast.success(`Connected with ${member.name}!`)} className="text-xs text-primary-600 font-medium border border-primary-200 dark:border-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex-shrink-0">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center px-4">
          <h2 className="text-3xl font-bold font-display mb-4">Ready to Connect?</h2>
          <p className="text-primary-200 mb-8">Join thousands of professionals already building meaningful connections through Spacebility.</p>
          <Link to={isAuthenticated ? "/dashboard" : "/register"} className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50">{isAuthenticated ? "Go to Dashboard" : "Join the Community"}</Link>
        </section>

        <Footer />
      </div>
    </div>
  );
}
