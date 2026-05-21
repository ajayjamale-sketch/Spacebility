import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PRICING_PLANS, MOCK_INVOICES } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatShortDate, getStatusColor, cn } from "@/lib/utils";

function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

interface SavedCard { brand: string; last4: string; expiry: string; isDefault: boolean; }

const INITIAL_CARDS: SavedCard[] = [
  { brand: "VISA", last4: "4242", expiry: "12/27", isDefault: true },
];

interface PaymentForm {
  cardName: string; cardNumber: string; expiry: string; cvv: string;
  billingAddress: string; city: string; zip: string; country: string;
}

export default function DashboardBilling() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"overview" | "plans" | "invoices" | "payment-methods">("overview");
  const [cards, setCards] = useState<SavedCard[]>(INITIAL_CARDS);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [payForm, setPayForm] = useState<PaymentForm>({
    cardName: "", cardNumber: "", expiry: "", cvv: "",
    billingAddress: "", city: "", zip: "", country: "United States",
  });
  const [payErrors, setPayErrors] = useState<Partial<PaymentForm>>({});
  const [downloadingInv, setDownloadingInv] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);

  const currentPlan = PRICING_PLANS.find((p) => p.id === user?.plan) || PRICING_PLANS[0];

  const validateCard = () => {
    const errs: Partial<PaymentForm> = {};
    if (!payForm.cardName.trim()) errs.cardName = "Name is required";
    if (payForm.cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter a valid 16-digit card number";
    if (payForm.expiry.length < 5) errs.expiry = "Enter valid MM/YY";
    if (payForm.cvv.length < 3) errs.cvv = "Invalid CVV";
    if (!payForm.billingAddress.trim()) errs.billingAddress = "Address required";
    if (!payForm.city.trim()) errs.city = "City required";
    if (!payForm.zip.trim()) errs.zip = "ZIP required";
    setPayErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCard()) return;
    setProcessingPayment(true);
    await new Promise((r) => setTimeout(r, 1800));
    setProcessingPayment(false);
    const digits = payForm.cardNumber.replace(/\s/g, "");
    const brandMap: Record<string, string> = { "4": "VISA", "5": "MC", "3": "AMEX", "6": "DISC" };
    const brand = brandMap[digits[0]] || "CARD";
    const newCard: SavedCard = { brand, last4: digits.slice(-4), expiry: payForm.expiry, isDefault: cards.length === 0 };
    setCards((prev) => [...prev, newCard]);
    setShowAddCard(false);
    setPayForm({ cardName: "", cardNumber: "", expiry: "", cvv: "", billingAddress: "", city: "", zip: "", country: "United States" });
    toast.success("Payment method added successfully!");
  };

  const handleSetDefault = (idx: number) => {
    setCards((prev) => prev.map((c, i) => ({ ...c, isDefault: i === idx })));
    toast.success("Default payment method updated");
  };

  const handleRemoveCard = (idx: number) => {
    setCards((prev) => prev.filter((_, i) => i !== idx));
    toast.success("Card removed");
  };

  const handleSwitchPlan = async (planId: string) => {
    setProcessingPayment(true);
    await new Promise((r) => setTimeout(r, 1500));
    setProcessingPayment(false);
    setShowUpgradeModal(null);
    toast.success(`Successfully switched to ${PRICING_PLANS.find((p) => p.id === planId)?.name} plan!`);
  };

  const handleCancel = async () => {
    setProcessingPayment(true);
    await new Promise((r) => setTimeout(r, 1200));
    setProcessingPayment(false);
    setShowCancelModal(false);
    toast.success("Your plan has been cancelled. It remains active until June 20, 2026.");
  };

  const brandColors: Record<string, string> = {
    VISA: "from-blue-700 to-blue-900",
    MC: "from-red-600 to-red-800",
    AMEX: "from-emerald-700 to-emerald-900",
    DISC: "from-orange-500 to-orange-700",
    CARD: "from-slate-600 to-slate-800",
  };

  const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Singapore", "Japan", "India", "UAE"];

  return (
    <DashboardLayout title="Billing & Plans">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">Billing & Subscription</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your plan, payment methods, and invoices</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6 w-fit flex-wrap">
        {([
          { key: "overview", label: "Overview" },
          { key: "plans", label: "Plans" },
          { key: "payment-methods", label: "Payment Methods" },
          { key: "invoices", label: "Invoices" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              tab === t.key ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Current Plan Card */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 dark:text-white font-display mb-5">Current Subscription</h3>
              <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-primary-500 to-primary-700 text-white mb-3">
                    {currentPlan.name} Plan
                  </span>
                  <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-bold text-slate-800 dark:text-white font-display">
                      {currentPlan.price === 0 ? "Free" : `$${currentPlan.price}`}
                    </p>
                    {currentPlan.price > 0 && <span className="text-slate-400 text-sm">/month</span>}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Next billing date: <span className="font-semibold text-slate-700 dark:text-slate-300">June 20, 2026</span></p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-semibold mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Active
                  </span>
                  <p className="text-xs text-slate-400">Auto-renewal ON</p>
                </div>
              </div>

              {/* Usage bars */}
              <div className="space-y-3 mb-6 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">Usage This Month</p>
                {[
                  { label: "Bookings", used: 8, max: 20, color: "bg-primary-500" },
                  { label: "Meeting Room Hours", used: 12, max: 20, color: "bg-cyan-500" },
                  { label: "Team Members", used: 2, max: 5, color: "bg-violet-500" },
                ].map((u) => (
                  <div key={u.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-600 dark:text-slate-400">{u.label}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{u.used} / {u.max}</span>
                    </div>
                    <div className="h-2 bg-white dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", u.color)} style={{ width: `${(u.used / u.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setTab("plans")}
                  className="btn-primary text-sm"
                >
                  Upgrade Plan
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white font-display">Recent Invoices</h3>
                <button onClick={() => setTab("invoices")} className="text-sm text-primary-600 font-medium hover:text-primary-700">View all</button>
              </div>
              <div className="space-y-3">
                {MOCK_INVOICES.map((inv) => (
                  <div key={inv.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{inv.invoiceNumber}</p>
                      <p className="text-xs text-slate-400">{formatShortDate(inv.date)}</p>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white text-sm">{formatCurrency(inv.amount)}</span>
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", getStatusColor(inv.status))}>{inv.status}</span>
                    <button 
                      onClick={async () => {
                        setDownloadingInv(inv.id);
                        await new Promise(r => setTimeout(r, 1200));
                        setDownloadingInv(null);
                        toast.success(`${inv.invoiceNumber} downloaded successfully`);
                      }}
                      disabled={downloadingInv === inv.id}
                      className="text-primary-600 text-sm font-medium hover:text-primary-700 disabled:opacity-50"
                    >
                      {downloadingInv === inv.id ? "..." : "PDF"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Default card */}
            <div className="card p-5">
              <h4 className="font-semibold text-slate-800 dark:text-white mb-4">Payment Method</h4>
              {cards.filter((c) => c.isDefault).map((card, i) => (
                <div key={i} className={cn("rounded-2xl p-4 bg-gradient-to-br text-white mb-3", brandColors[card.brand] || brandColors.CARD)}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold opacity-80">{card.brand}</span>
                    <svg className="w-8 h-5 opacity-60" viewBox="0 0 40 24" fill="none">
                      <circle cx="15" cy="12" r="10" fill="white" fillOpacity="0.5" />
                      <circle cx="25" cy="12" r="10" fill="white" fillOpacity="0.3" />
                    </svg>
                  </div>
                  <p className="font-mono text-sm tracking-widest mb-3">•••• •••• •••• {card.last4}</p>
                  <div className="flex justify-between text-xs opacity-80">
                    <span>Expires {card.expiry}</span>
                    <span className="font-semibold">Default</span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setTab("payment-methods")}
                className="w-full text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 text-center py-2 border border-primary-200 dark:border-primary-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                Manage Payment Methods
              </button>
            </div>

            {/* Plan features */}
            <div className="card p-5">
              <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Plan Includes</h4>
              <ul className="space-y-2">
                {currentPlan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── PLANS ── */}
      {tab === "plans" && (
        <div>
          <div className="mb-6 text-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Choose Your Plan</h3>
            <p className="text-slate-500 text-sm">Upgrade or downgrade at any time. Changes take effect immediately.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_PLANS.map((plan) => {
              const isCurrent = user?.plan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "rounded-3xl p-5 border-2 flex flex-col transition-all",
                    isCurrent
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-200 dark:ring-primary-800"
                      : plan.highlighted
                        ? "border-primary-300 bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-900/10 dark:to-slate-800 dark:border-primary-700"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-200 dark:hover:border-primary-700"
                  )}
                >
                  {isCurrent && (
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 block mb-3 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      CURRENT PLAN
                    </span>
                  )}
                  {plan.highlighted && !isCurrent && (
                    <span className="text-xs font-bold text-primary-600 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/40 rounded-full w-fit mb-3">Most Popular</span>
                  )}
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary-600 font-display">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && <span className="text-xs text-slate-400 ml-1">/month</span>}
                  </div>
                  <ul className="space-y-2 mb-5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => isCurrent ? null : setShowUpgradeModal(plan.id)}
                    disabled={isCurrent}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
                      isCurrent
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-400 cursor-not-allowed"
                        : "bg-primary-600 hover:bg-primary-700 text-white active:scale-95"
                    )}
                  >
                    {isCurrent ? "Current Plan" : plan.id === "enterprise" ? "Contact Sales" : "Switch to this Plan"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PAYMENT METHODS ── */}
      {tab === "payment-methods" && (
        <div className="max-w-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white">Saved Payment Methods</h3>
            <button
              onClick={() => setShowAddCard(true)}
              className="btn-primary text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add New Card
            </button>
          </div>

          {cards.length === 0 && (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-1">No payment methods saved</p>
              <p className="text-sm text-slate-400 mb-4">Add a card to manage your subscriptions and bookings</p>
              <button onClick={() => setShowAddCard(true)} className="btn-primary text-sm mx-auto">Add Your First Card</button>
            </div>
          )}

          <div className="space-y-3">
            {cards.map((card, idx) => (
              <div key={idx} className="card p-5 flex items-center gap-4">
                <div className={cn("w-14 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0", brandColors[card.brand] || brandColors.CARD)}>
                  <span className="text-white text-xs font-bold">{card.brand}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">•••• •••• •••• {card.last4}</p>
                  <p className="text-xs text-slate-400">Expires {card.expiry}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {card.isDefault ? (
                    <span className="text-xs px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-semibold">Default</span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(idx)}
                      className="text-xs text-slate-500 hover:text-primary-600 font-medium transition-colors"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveCard(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Card Form */}
          {showAddCard && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-bold text-slate-800 dark:text-white">Add New Payment Method</h4>
                <button onClick={() => setShowAddCard(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleAddCard} className="space-y-4">
                {/* Card Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Name as on card"
                    value={payForm.cardName}
                    onChange={(e) => setPayForm({ ...payForm, cardName: e.target.value })}
                    className={cn("input-field text-sm", payErrors.cardName && "border-red-400 focus:ring-red-400/20")}
                    autoComplete="cc-name"
                  />
                  {payErrors.cardName && <p className="text-xs text-red-500 mt-1">{payErrors.cardName}</p>}
                </div>

                {/* Card Number */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={payForm.cardNumber}
                      onChange={(e) => setPayForm({ ...payForm, cardNumber: formatCardNumber(e.target.value) })}
                      className={cn("input-field text-sm font-mono tracking-wider pr-16", payErrors.cardNumber && "border-red-400")}
                      inputMode="numeric"
                      autoComplete="cc-number"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      {["VISA", "MC"].map((b) => (
                        <span key={b} className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">{b}</span>
                      ))}
                    </div>
                  </div>
                  {payErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{payErrors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={payForm.expiry}
                      onChange={(e) => setPayForm({ ...payForm, expiry: formatExpiry(e.target.value) })}
                      maxLength={5}
                      className={cn("input-field text-sm font-mono", payErrors.expiry && "border-red-400")}
                      autoComplete="cc-exp"
                    />
                    {payErrors.expiry && <p className="text-xs text-red-500 mt-1">{payErrors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">CVV</label>
                    <input
                      type="text"
                      placeholder="•••"
                      value={payForm.cvv}
                      onChange={(e) => setPayForm({ ...payForm, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      className={cn("input-field text-sm font-mono", payErrors.cvv && "border-red-400")}
                      autoComplete="cc-csc"
                    />
                    {payErrors.cvv && <p className="text-xs text-red-500 mt-1">{payErrors.cvv}</p>}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Billing Address</p>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Street address"
                        value={payForm.billingAddress}
                        onChange={(e) => setPayForm({ ...payForm, billingAddress: e.target.value })}
                        className={cn("input-field text-sm", payErrors.billingAddress && "border-red-400")}
                        autoComplete="street-address"
                      />
                      {payErrors.billingAddress && <p className="text-xs text-red-500 mt-1">{payErrors.billingAddress}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="City"
                          value={payForm.city}
                          onChange={(e) => setPayForm({ ...payForm, city: e.target.value })}
                          className={cn("input-field text-sm", payErrors.city && "border-red-400")}
                        />
                        {payErrors.city && <p className="text-xs text-red-500 mt-1">{payErrors.city}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="ZIP / Postal"
                          value={payForm.zip}
                          onChange={(e) => setPayForm({ ...payForm, zip: e.target.value })}
                          className={cn("input-field text-sm", payErrors.zip && "border-red-400")}
                        />
                        {payErrors.zip && <p className="text-xs text-red-500 mt-1">{payErrors.zip}</p>}
                      </div>
                    </div>
                    <select
                      value={payForm.country}
                      onChange={(e) => setPayForm({ ...payForm, country: e.target.value })}
                      className="input-field text-sm"
                    >
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  256-bit SSL encryption · We never store your full card number
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowAddCard(false)} className="btn-secondary flex-1 py-3 text-sm justify-center">Cancel</button>
                  <button type="submit" disabled={processingPayment} className="btn-primary flex-1 py-3 text-sm justify-center">
                    {processingPayment ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                    ) : "Save Card"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── INVOICES ── */}
      {tab === "invoices" && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white">Invoice History</h3>
            <button 
              onClick={async () => {
                setExportingAll(true);
                await new Promise(r => setTimeout(r, 2000));
                setExportingAll(false);
                toast.success("All invoices exported as ZIP!");
              }} 
              disabled={exportingAll}
              className="btn-secondary text-sm py-2"
            >
              {exportingAll ? (
                 <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              )}
              {exportingAll ? "Exporting..." : "Export All"}
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {MOCK_INVOICES.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-400">{inv.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(inv.amount)}</span>
                  <span className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", getStatusColor(inv.status))}>{inv.status}</span>
                  <p className="text-xs text-slate-400 hidden sm:block">{formatShortDate(inv.date)}</p>
                  <button
                    onClick={async () => {
                      setDownloadingInv(inv.id);
                      await new Promise(r => setTimeout(r, 1200));
                      setDownloadingInv(null);
                      toast.success(`${inv.invoiceNumber} downloaded successfully`);
                    }}
                    disabled={downloadingInv === inv.id}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {downloadingInv === inv.id ? (
                      <span className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    )}
                    {downloadingInv === inv.id ? "Downloading..." : "Download"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── UPGRADE MODAL ── */}
      {showUpgradeModal && (() => {
        const plan = PRICING_PLANS.find((p) => p.id === showUpgradeModal)!;
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowUpgradeModal(null); }}>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white font-display mb-2">Switch to {plan.name}</h3>
              <p className="text-slate-500 text-sm mb-5">Your plan changes immediately. You'll be billed the pro-rated difference.</p>
              <div className="bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-4 mb-5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">New plan</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{plan.name} — ${plan.price}/mo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Effective date</span>
                  <span className="font-semibold text-slate-800 dark:text-white">Immediately</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-200 dark:border-slate-600 pt-2 mt-2">
                  <span className="font-bold text-slate-800 dark:text-white">Next billing</span>
                  <span className="font-bold text-primary-600">${plan.price} on Jun 20, 2026</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUpgradeModal(null)} className="btn-secondary flex-1 py-3 text-sm justify-center">Cancel</button>
                <button onClick={() => handleSwitchPlan(plan.id)} disabled={processingPayment} className="btn-primary flex-1 py-3 text-sm justify-center">
                  {processingPayment ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Switching…</> : `Confirm Switch`}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── CANCEL MODAL ── */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowCancelModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white text-center mb-2">Cancel Subscription?</h3>
            <p className="text-slate-500 text-sm text-center mb-5 leading-relaxed">
              Your {currentPlan.name} plan will remain active until <strong className="text-slate-700 dark:text-slate-300">June 20, 2026</strong>. After that, you'll be downgraded to the Free plan.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 mb-5">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">You'll lose access to:</p>
              <ul className="space-y-1.5">
                {currentPlan.features.slice(2, 5).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="btn-secondary flex-1 py-3 text-sm justify-center">Keep Plan</button>
              <button onClick={handleCancel} disabled={processingPayment} className="flex-1 py-3 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-2">
                {processingPayment ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</> : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
