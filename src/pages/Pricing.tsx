import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRICING_PLANS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const FAQ = [
  { q: "Can I switch plans at any time?", a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle." },
  { q: "Is there a free trial?", a: "All paid plans come with a 14-day free trial. No credit card required to start." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, PayPal, and bank transfers for Enterprise plans." },
  { q: "Can I get a refund?", a: "Yes, we offer a 30-day money-back guarantee on all plans if you're not completely satisfied." },
  { q: "Is there a discount for annual billing?", a: "Yes! Save 20% when you choose annual billing on any paid plan." },
  { q: "How does the Enterprise plan work?", a: "Enterprise plans are customized to your organization's needs. Contact our sales team for a tailored quote." },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<typeof PRICING_PLANS[0] | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanClick = (plan: typeof PRICING_PLANS[0]) => {
    if (plan.id === "enterprise") {
      navigate("/contact");
    } else if (isAuthenticated) {
      setSelectedPlan(plan);
      setShowPaymentModal(true);
    } else {
      navigate("/register");
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowPaymentModal(false);
    toast.success("Payment successful! Your subscription is now active.");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-primary-900/30 to-slate-900 text-white text-center px-4">
          <span className="badge bg-white/10 text-white border border-white/20 mb-6 mx-auto">Transparent Pricing</span>
          <h1 className="text-5xl font-bold font-display mb-4">Simple Plans for Every Team</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">No hidden fees. No surprises. Choose the plan that works for your team and scale as you grow.</p>
          <div className="inline-flex items-center gap-3 bg-white/10 rounded-2xl p-1.5">
            <button onClick={() => setAnnual(false)} className={cn("px-6 py-2.5 rounded-xl text-sm font-medium transition-all", !annual ? "bg-white text-slate-900" : "text-slate-300")}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={cn("px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2", annual ? "bg-white text-slate-900" : "text-slate-300")}>
              Annual <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">-20%</span>
            </button>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/30">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div key={plan.id} className={cn("rounded-3xl p-6 flex flex-col", plan.highlighted ? "bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-glow ring-2 ring-primary-400" : "bg-white dark:bg-slate-800 shadow-card border border-slate-100 dark:border-slate-700")}>
                {plan.highlighted && <span className="text-xs font-bold px-3 py-1 bg-white/20 rounded-full w-fit mb-4">⭐ Most Popular</span>}
                <h3 className={cn("text-xl font-bold font-display mb-1", plan.highlighted ? "text-white" : "text-slate-800 dark:text-white")}>{plan.name}</h3>
                <p className={cn("text-sm mb-4", plan.highlighted ? "text-primary-200" : "text-slate-500")}>{plan.description}</p>
                <div className="mb-6">
                  <span className={cn("text-4xl font-bold font-display", plan.highlighted ? "text-white" : "text-slate-800 dark:text-white")}>
                    {plan.price === 0 ? "Free" : `$${annual ? Math.floor(plan.price * 0.8) : plan.price}`}
                  </span>
                  {plan.price > 0 && <span className={cn("text-sm", plan.highlighted ? "text-primary-200" : "text-slate-400")}>/month</span>}
                </div>
                <ul className="flex-1 space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg className={cn("w-4 h-4 flex-shrink-0 mt-0.5", plan.highlighted ? "text-primary-200" : "text-emerald-500")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className={plan.highlighted ? "text-primary-100" : "text-slate-600 dark:text-slate-400"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handlePlanClick(plan)} 
                  className={cn("w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all", plan.highlighted ? "bg-white text-primary-600 hover:bg-primary-50" : "bg-primary-600 text-white hover:bg-primary-700")}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white text-center mb-10">Compare All Features</h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">Feature</th>
                      {PRICING_PLANS.map((p) => <th key={p.id} className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-white">{p.name}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {[["Monthly Bookings", "5", "20", "Unlimited", "Unlimited"], ["Workspace Types", "Hot Desk", "Hot + Dedicated", "All Types", "All Types"], ["Meeting Room Hours", "0", "4h/mo", "20h/mo", "Unlimited"], ["Team Members", "1", "1", "5", "Unlimited"], ["AI Recommendations", "❌", "✅", "✅", "✅"], ["Analytics", "Basic", "Standard", "Advanced", "Enterprise"], ["API Access", "❌", "❌", "✅", "✅"], ["Support", "Email", "Priority", "Dedicated", "24/7 Phone"]].map(([feat, ...vals]) => (
                      <tr key={feat} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{feat}</td>
                        {vals.map((v, i) => <td key={i} className="px-6 py-4 text-sm text-center text-slate-700 dark:text-slate-300">{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-800/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div key={i} className="card">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span className="font-semibold text-slate-800 dark:text-white text-sm">{item.q}</span>
                    <svg className={cn("w-5 h-5 text-slate-400 flex-shrink-0 transition-transform", openFaq === i && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {openFaq === i && <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary-600 to-primary-800 text-white text-center">
          <h2 className="text-3xl font-bold font-display mb-4">Ready to Get Started?</h2>
          <p className="text-primary-200 text-lg mb-8">Join 50,000+ teams already working smarter with Spacebility.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => handlePlanClick(PRICING_PLANS[1] || PRICING_PLANS[0])} className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all">Start Free Trial</button>
            <Link to="/contact" className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">Talk to Sales</Link>
          </div>
        </section>

        <Footer />
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowPaymentModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-display mb-1">Complete Purchase</h2>
                <p className="text-slate-500 text-sm">Subscribe to the {selectedPlan.name} plan</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-800 dark:text-white">{selectedPlan.name} Plan ({annual ? 'Annual' : 'Monthly'})</span>
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  ${annual ? Math.floor(selectedPlan.price * 0.8) : selectedPlan.price}
                  <span className="text-sm font-normal text-slate-500">/{annual ? 'mo' : 'mo'}</span>
                </span>
              </div>
              {annual && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Billed annually at ${Math.floor(selectedPlan.price * 0.8 * 12)}/year</p>
              )}
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="field-label">Card Information</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <input type="text" required placeholder="0000 0000 0000 0000" className="input-field pl-10" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Expiry Date</label>
                  <input type="text" required placeholder="MM/YY" className="input-field" />
                </div>
                <div>
                  <label className="field-label">CVC</label>
                  <input type="text" required placeholder="123" className="input-field" />
                </div>
              </div>

              <div>
                <label className="field-label">Name on Card</label>
                <input type="text" required placeholder="Jane Doe" className="input-field" />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full btn-primary justify-center py-3.5 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      Pay ${annual ? Math.floor(selectedPlan.price * 0.8 * 12) : selectedPlan.price}
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-3">
                  Payments are secure and encrypted. You can cancel your subscription at any time.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
