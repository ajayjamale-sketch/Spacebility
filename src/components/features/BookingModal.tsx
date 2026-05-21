import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Workspace } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

interface Props {
  workspace: Workspace;
  onClose: () => void;
}

type BookingType = "hourly" | "daily" | "monthly";

interface PaymentForm {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  billingAddress: string;
  city: string;
  zip: string;
  country: string;
  saveCard: boolean;
}

const CARD_BRANDS: Record<string, string> = {
  "4": "VISA",
  "5": "MC",
  "3": "AMEX",
  "6": "DISC",
};

function formatCardNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export default function BookingModal({ workspace, onClose }: Props) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState<BookingType>("daily");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [seats, setSeats] = useState(1);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [payment, setPayment] = useState<PaymentForm>({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zip: "",
    country: "United States",
    saveCard: true,
  });
  const [payErrors, setPayErrors] = useState<Partial<PaymentForm>>({});

  const today = new Date().toISOString().split("T")[0];

  const getPrice = () => {
    if (bookingType === "hourly") {
      const hrs = Math.max(1, parseInt(endTime.split(":")[0]) - parseInt(startTime.split(":")[0]));
      return workspace.pricePerHour * hrs * seats;
    }
    if (bookingType === "daily") return workspace.pricePerDay * seats;
    return workspace.pricePerMonth * seats;
  };

  const totalPrice = getPrice();
  const serviceFee = Math.round(totalPrice * 0.08);
  const tax = Math.round(totalPrice * 0.1);
  const grandTotal = totalPrice + serviceFee + tax;

  const validatePayment = (): boolean => {
    const errs: Partial<PaymentForm> = {};
    if (!payment.cardName.trim()) errs.cardName = "Name is required";
    if (payment.cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter a valid 16-digit card number";
    if (payment.expiry.length < 5) errs.expiry = "Enter valid expiry MM/YY";
    if (payment.cvv.length < 3) errs.cvv = "Enter valid CVV";
    if (!payment.billingAddress.trim()) errs.billingAddress = "Address is required";
    if (!payment.city.trim()) errs.city = "City is required";
    if (!payment.zip.trim()) errs.zip = "ZIP is required";
    setPayErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBook = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!date) { toast.error("Please select a date"); return; }
    setStep(2);
  };

  const handlePayment = async () => {
    if (!validatePayment()) {
      toast.error("Please fix payment form errors");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    setStep(3);
    toast.success("Payment successful! Booking confirmed.");
  };

  const cardBrand = CARD_BRANDS[payment.cardNumber.replace(/\s/g, "")[0]] || null;

  const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Singapore", "Japan", "India", "UAE"];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-800 dark:text-white">
              {step === 1 ? "Book Workspace" : step === 2 ? "Payment Details" : "Booking Confirmed"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5 truncate max-w-xs">{workspace.name} · {workspace.location}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors ml-2 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-5 pt-3 pb-1 flex items-center gap-2 flex-shrink-0">
          {[
            { n: 1, label: "Details" },
            { n: 2, label: "Payment" },
            { n: 3, label: "Confirmed" },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  step > s.n ? "bg-emerald-500 text-white" : step === s.n ? "bg-primary-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                )}>
                  {step > s.n ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ) : s.n}
                </div>
                <span className={cn("text-xs font-medium hidden sm:block", step === s.n ? "text-primary-600 dark:text-primary-400" : "text-slate-400")}>{s.label}</span>
              </div>
              {i < 2 && <div className={cn("flex-1 h-0.5 rounded-full transition-all", step > s.n ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700")} />}
            </React.Fragment>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-5">
          {/* STEP 1 — Booking Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-up">
              {/* Booking Type */}
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Booking Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["hourly", "daily", "monthly"] as BookingType[]).map((t) => (
                    <button key={t} onClick={() => setBookingType(t)}
                      className={cn(
                        "py-3 rounded-xl text-sm font-semibold border-2 transition-all flex flex-col items-center gap-0.5",
                        bookingType === t
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                          : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500"
                      )}>
                      <span className="capitalize">{t}</span>
                      <span className="text-xs opacity-70">
                        {t === "hourly" ? formatCurrency(workspace.pricePerHour) + "/hr" : t === "daily" ? formatCurrency(workspace.pricePerDay) + "/day" : formatCurrency(workspace.pricePerMonth) + "/mo"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Date</label>
                <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} className="input-field" />
              </div>

              {/* Time (hourly) */}
              {bookingType === "hourly" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Start Time</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">End Time</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input-field" />
                  </div>
                </div>
              )}

              {/* Seats */}
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Number of Seats</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSeats(Math.max(1, seats - 1))}
                    className="w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 transition-all active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M20 12H4" /></svg>
                  </button>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-slate-800 dark:text-white tabular-nums">{seats}</span>
                    <p className="text-xs text-slate-400">of {workspace.capacity}</p>
                  </div>
                  <button
                    onClick={() => setSeats(Math.min(workspace.capacity, seats + 1))}
                    className="w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 transition-all active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 4v16M4 12h16" /></svg>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Special Requests <span className="font-normal text-slate-400">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any special requirements or accessibility needs..."
                  className="input-field resize-none"
                />
              </div>

              {/* Price Summary */}
              <div className="bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Estimated total</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary-600">{formatCurrency(totalPrice)}</span>
                    <p className="text-xs text-slate-400">+ fees & taxes</p>
                  </div>
                </div>
              </div>

              <button onClick={handleBook} className="btn-primary w-full justify-center py-3.5 text-sm">
                Continue to Payment
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          )}

          {/* STEP 2 — Payment */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-up">
              {/* Order Summary */}
              <div className="bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Order Summary</h4>
                {[
                  { label: workspace.name, value: formatCurrency(totalPrice) },
                  { label: "Service fee (8%)", value: formatCurrency(serviceFee) },
                  { label: "Taxes (10%)", value: formatCurrency(tax) },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{row.value}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 dark:border-slate-600 pt-2.5 flex justify-between">
                  <span className="font-bold text-slate-800 dark:text-white text-sm">Total Due</span>
                  <span className="font-bold text-primary-600 text-lg">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Card Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Card Information</h4>
                  <div className="flex gap-1.5">
                    {["VISA", "MC", "AMEX"].map((b) => (
                      <span key={b} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded">{b}</span>
                    ))}
                  </div>
                </div>

                {/* Card Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block uppercase tracking-wide">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Name as on card"
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    className={cn("input-field text-sm", payErrors.cardName && "border-red-400 focus:ring-red-400")}
                    autoComplete="cc-name"
                  />
                  {payErrors.cardName && <p className="text-xs text-red-500 mt-1">{payErrors.cardName}</p>}
                </div>

                {/* Card Number */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block uppercase tracking-wide">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                      className={cn("input-field text-sm pr-16 font-mono tracking-wider", payErrors.cardNumber && "border-red-400 focus:ring-red-400")}
                      autoComplete="cc-number"
                      inputMode="numeric"
                    />
                    {cardBrand && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded">
                        {cardBrand}
                      </span>
                    )}
                    {!cardBrand && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    )}
                  </div>
                  {payErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{payErrors.cardNumber}</p>}
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block uppercase tracking-wide">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                      className={cn("input-field text-sm font-mono", payErrors.expiry && "border-red-400 focus:ring-red-400")}
                      autoComplete="cc-exp"
                      inputMode="numeric"
                      maxLength={5}
                    />
                    {payErrors.expiry && <p className="text-xs text-red-500 mt-1">{payErrors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block uppercase tracking-wide">CVV / CVC</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="•••"
                        value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                        className={cn("input-field text-sm font-mono", payErrors.cvv && "border-red-400 focus:ring-red-400")}
                        autoComplete="cc-csc"
                        inputMode="numeric"
                      />
                    </div>
                    {payErrors.cvv && <p className="text-xs text-red-500 mt-1">{payErrors.cvv}</p>}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Billing Address</h4>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block uppercase tracking-wide">Street Address</label>
                  <input
                    type="text"
                    placeholder="123 Main Street, Apt 4"
                    value={payment.billingAddress}
                    onChange={(e) => setPayment({ ...payment, billingAddress: e.target.value })}
                    className={cn("input-field text-sm", payErrors.billingAddress && "border-red-400 focus:ring-red-400")}
                    autoComplete="street-address"
                  />
                  {payErrors.billingAddress && <p className="text-xs text-red-500 mt-1">{payErrors.billingAddress}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block uppercase tracking-wide">City</label>
                    <input
                      type="text"
                      placeholder="San Francisco"
                      value={payment.city}
                      onChange={(e) => setPayment({ ...payment, city: e.target.value })}
                      className={cn("input-field text-sm", payErrors.city && "border-red-400 focus:ring-red-400")}
                      autoComplete="address-level2"
                    />
                    {payErrors.city && <p className="text-xs text-red-500 mt-1">{payErrors.city}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block uppercase tracking-wide">ZIP / Postal Code</label>
                    <input
                      type="text"
                      placeholder="94105"
                      value={payment.zip}
                      onChange={(e) => setPayment({ ...payment, zip: e.target.value })}
                      className={cn("input-field text-sm", payErrors.zip && "border-red-400 focus:ring-red-400")}
                      autoComplete="postal-code"
                    />
                    {payErrors.zip && <p className="text-xs text-red-500 mt-1">{payErrors.zip}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block uppercase tracking-wide">Country</label>
                  <select
                    value={payment.country}
                    onChange={(e) => setPayment({ ...payment, country: e.target.value })}
                    className="input-field text-sm"
                    autoComplete="country-name"
                  >
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Save Card */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                    payment.saveCard ? "bg-primary-600 border-primary-600" : "border-slate-300 dark:border-slate-600 group-hover:border-primary-400"
                  )}
                  onClick={() => setPayment({ ...payment, saveCard: !payment.saveCard })}
                >
                  {payment.saveCard && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Save this card for future bookings</span>
              </label>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your payment is secured with 256-bit SSL encryption. We never store your card details.</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3 text-sm">
                  ← Back
                </button>
                <button onClick={handlePayment} disabled={isLoading} className="btn-primary flex-1 justify-center py-3 text-sm">
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      Pay {formatCurrency(grandTotal)}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Confirmation */}
          {step === 3 && (
            <div className="text-center space-y-5 animate-fade-up py-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-display">Booking Confirmed!</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">Your workspace has been reserved. A confirmation email with your QR check-in code has been sent.</p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20 rounded-2xl p-5 text-left space-y-3 border border-primary-100 dark:border-primary-800">
                <div className="text-center mb-2">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Your Booking Code</p>
                  <p className="text-2xl font-mono font-bold text-primary-600">SPB-{Date.now().toString().slice(-8)}</p>
                </div>
                {[
                  { label: "Workspace", value: workspace.name },
                  { label: "Location", value: workspace.location },
                  { label: "Date", value: date },
                  { label: "Type", value: bookingType.charAt(0).toUpperCase() + bookingType.slice(1) },
                  { label: "Seats", value: `${seats} seat${seats > 1 ? "s" : ""}` },
                  { label: "Amount Paid", value: formatCurrency(grandTotal) },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-xs">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="btn-secondary flex-1 justify-center text-sm py-3">
                  Close
                </button>
                <button onClick={() => navigate("/dashboard/bookings")} className="btn-primary flex-1 justify-center text-sm py-3">
                  View Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
