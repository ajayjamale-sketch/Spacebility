import React from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PRICING_PLANS } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { formatCurrency, cn } from "@/lib/utils";

export default function SubscriptionDetail() {
  const { user } = useAuth();
  const currentPlan = PRICING_PLANS.find((p) => p.id === user?.plan) || PRICING_PLANS[1];

  return (
    <DashboardLayout title="Subscription Details">
      <div className="max-w-2xl">
        <div className="mb-6">
          <Link to="/dashboard/billing" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Billing
          </Link>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Subscription Details</h2>
        </div>

        <div className="card p-6 mb-5 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-primary-100 dark:border-primary-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="badge-primary mb-2">{currentPlan.name} Plan</span>
              <p className="text-3xl font-bold text-slate-800 dark:text-white font-display">{formatCurrency(currentPlan.price)}<span className="text-sm text-slate-400 font-normal">/month</span></p>
            </div>
            <span className="badge-success">Active</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{ l: "Billing Cycle", v: "Monthly" }, { l: "Next Payment", v: "June 20, 2026" }, { l: "Started", v: "January 15, 2025" }, { l: "Auto-Renew", v: "Enabled" }].map((s) => (
              <div key={s.l}>
                <p className="text-xs text-slate-400">{s.l}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 mb-5">
          <h3 className="font-bold text-slate-800 dark:text-white font-display mb-4">Plan Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentPlan.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/dashboard/billing?tab=plans" className="btn-primary flex-1 justify-center">Upgrade Plan</Link>
          <button onClick={() => toast.info("Cancellation initiated")} className="flex-1 py-3 px-5 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:border-red-300 transition-all">Cancel Plan</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
