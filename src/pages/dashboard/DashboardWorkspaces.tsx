import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MOCK_WORKSPACES, WORKSPACE_AMENITIES, WORKSPACE_TYPES, CITIES } from "@/lib/data";
import { formatCurrency, cn, calculateOccupancyColor } from "@/lib/utils";
import type { Workspace } from "@/types";

interface WorkspaceForm {
  name: string;
  type: string;
  city: string;
  address: string;
  description: string;
  capacity: string;
  pricePerHour: string;
  pricePerDay: string;
  pricePerMonth: string;
  amenities: string[];
  imageUrl: string;
}

const EMPTY_FORM: WorkspaceForm = {
  name: "", type: "hot-desk", city: "", address: "", description: "",
  capacity: "", pricePerHour: "", pricePerDay: "", pricePerMonth: "",
  amenities: [], imageUrl: "",
};

export default function DashboardWorkspaces() {
  const [workspaces, setWorkspaces] = useState(MOCK_WORKSPACES);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [form, setForm] = useState<WorkspaceForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<WorkspaceForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setEditingWorkspace(null);
    setStep(1);
    setShowModal(true);
  };

  const openEdit = (ws: Workspace) => {
    setForm({
      name: ws.name,
      type: ws.type,
      city: ws.city,
      address: ws.address,
      description: ws.description,
      capacity: String(ws.capacity),
      pricePerHour: String(ws.pricePerHour),
      pricePerDay: String(ws.pricePerDay),
      pricePerMonth: String(ws.pricePerMonth),
      amenities: [...ws.amenities],
      imageUrl: ws.images[0] || "",
    });
    setEditingWorkspace(ws);
    setFormErrors({});
    setStep(1);
    setShowModal(true);
  };

  const validateStep1 = () => {
    const errs: Partial<WorkspaceForm> = {};
    if (!form.name.trim()) errs.name = "Workspace name is required";
    if (!form.city) errs.city = "City is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.description.trim()) errs.description = "Description is required";
    else if (form.description.length < 30) errs.description = "Description must be at least 30 characters";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Partial<WorkspaceForm> = {};
    if (!form.capacity || isNaN(Number(form.capacity)) || Number(form.capacity) < 1) errs.capacity = "Capacity must be at least 1";
    if (!form.pricePerDay || isNaN(Number(form.pricePerDay)) || Number(form.pricePerDay) < 1) errs.pricePerDay = "Daily price required";
    if (!form.pricePerHour || isNaN(Number(form.pricePerHour))) errs.pricePerHour = "Hourly price required";
    if (!form.pricePerMonth || isNaN(Number(form.pricePerMonth))) errs.pricePerMonth = "Monthly price required";
    if (form.amenities.length < 2) errs.amenities = "Select at least 2 amenities";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);

    if (editingWorkspace) {
      setWorkspaces((prev) =>
        prev.map((ws) =>
          ws.id === editingWorkspace.id
            ? {
                ...ws,
                name: form.name,
                type: form.type,
                city: form.city,
                address: form.address,
                description: form.description,
                capacity: Number(form.capacity),
                pricePerHour: Number(form.pricePerHour),
                pricePerDay: Number(form.pricePerDay),
                pricePerMonth: Number(form.pricePerMonth),
                amenities: form.amenities,
                images: form.imageUrl ? [form.imageUrl, ...(ws.images.slice(1))] : ws.images,
                location: form.city,
              }
            : ws
        )
      );
      toast.success("Workspace updated successfully!");
    } else {
      const newWs: Workspace = {
        id: `ws${Date.now()}`,
        name: form.name,
        type: form.type,
        location: form.city,
        address: form.address,
        city: form.city,
        country: "USA",
        pricePerHour: Number(form.pricePerHour),
        pricePerDay: Number(form.pricePerDay),
        pricePerMonth: Number(form.pricePerMonth),
        rating: 0,
        reviewCount: 0,
        capacity: Number(form.capacity),
        available: true,
        images: [form.imageUrl || `https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop`],
        amenities: form.amenities,
        description: form.description,
        ownerId: "u3",
        ownerName: "Marcus Johnson",
        tags: [],
        featured: false,
        occupancy: 0,
      };
      setWorkspaces((prev) => [newWs, ...prev]);
      toast.success("Workspace listed successfully! It will go live after review.");
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));
    setShowDeleteConfirm(null);
    toast.success("Workspace removed from your listings");
  };

  const toggleAvailability = (id: string) => {
    setWorkspaces((prev) => prev.map((ws) => ws.id === id ? { ...ws, available: !ws.available } : ws));
    toast.success("Workspace availability updated");
  };

  const toggleAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));
  };

  const typeLabel = (t: string) => WORKSPACE_TYPES.find((x) => x.value === t)?.label || t;

  const STEP_LABELS = ["Basic Info", "Pricing & Amenities", "Preview & Submit"];

  return (
    <DashboardLayout title="Workspaces">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display">My Workspaces</h2>
          <p className="text-slate-500 text-sm">{workspaces.length} spaces listed</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          List New Workspace
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Spaces", value: workspaces.length.toString(), color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
          { label: "Available Now", value: workspaces.filter((w) => w.available).length.toString(), color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Avg Occupancy", value: Math.round(workspaces.reduce((a, b) => a + b.occupancy, 0) / workspaces.length) + "%", color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
          { label: "Avg Rating", value: (workspaces.filter((w) => w.rating > 0).reduce((a, b) => a + b.rating, 0) / workspaces.filter((w) => w.rating > 0).length).toFixed(1) + "★", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map((s) => (
          <div key={s.label} className={cn("card p-4 text-center", s.bg)}>
            <p className={cn("text-2xl font-bold font-display", s.color)}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {workspaces.map((ws) => (
          <div key={ws.id} className="card p-5 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-36 h-36 sm:h-28 flex-shrink-0">
              <img src={ws.images[0]} alt={ws.name} className="w-full h-full rounded-2xl object-cover" />
              <span className={cn("absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold", ws.available ? "bg-emerald-500 text-white" : "bg-slate-400 text-white")}>
                {ws.available ? "Live" : "Paused"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{ws.name}</h3>
                  <p className="text-xs text-slate-400">{ws.address}</p>
                </div>
                <span className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  {typeLabel(ws.type)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Daily Rate</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{formatCurrency(ws.pricePerDay)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Rating</p>
                  <p className="text-sm font-bold text-amber-500">{ws.rating > 0 ? `${ws.rating}★ (${ws.reviewCount})` : "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Occupancy</p>
                  <p className={cn("text-sm font-bold", calculateOccupancyColor(ws.occupancy))}>{ws.occupancy}%</p>
                </div>
              </div>

              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", ws.occupancy >= 90 ? "bg-red-500" : ws.occupancy >= 70 ? "bg-amber-500" : "bg-emerald-500")}
                  style={{ width: `${ws.occupancy}%` }}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Link to={`/marketplace/${ws.id}`} className="btn-secondary text-xs py-2 px-3">View</Link>
                <button onClick={() => openEdit(ws)} className="btn-secondary text-xs py-2 px-3">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Edit
                </button>
                <button
                  onClick={() => toggleAvailability(ws.id)}
                  className={cn("text-xs py-2 px-3 rounded-xl border-2 font-medium transition-all",
                    ws.available ? "border-amber-200 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
                  )}
                >
                  {ws.available ? "Pause" : "Activate"}
                </button>
                <Link to="/dashboard/analytics" className="btn-primary text-xs py-2 px-3">Analytics</Link>
                <button
                  onClick={() => setShowDeleteConfirm(ws.id)}
                  className="text-xs py-2 px-3 rounded-xl border-2 border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── LIST/EDIT WORKSPACE MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col animate-scale-in">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">
                  {editingWorkspace ? "Edit Workspace" : "List New Workspace"}
                </h2>
                <p className="text-sm text-slate-400 mt-0.5">Step {step} of 3 — {STEP_LABELS[step - 1]}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Step Progress */}
            <div className="px-6 pt-4 flex items-center gap-2 flex-shrink-0">
              {[1, 2, 3].map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      step > s ? "bg-emerald-500 text-white" : step === s ? "bg-primary-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                    )}>
                      {step > s ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : s}
                    </div>
                    <span className={cn("text-xs font-medium hidden sm:block", step >= s ? "text-slate-700 dark:text-slate-300" : "text-slate-400")}>{STEP_LABELS[s - 1]}</span>
                  </div>
                  {i < 2 && <div className={cn("flex-1 h-0.5 rounded-full", step > s ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700")} />}
                </React.Fragment>
              ))}
            </div>

            {/* Scrollable Content */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6">

              {/* STEP 1 — Basic Info */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="field-label">Workspace Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. The Creative Hub Downtown"
                        className={cn("input-field", formErrors.name && "border-red-400")}
                      />
                      {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="field-label">Workspace Type *</label>
                      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                        {WORKSPACE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="field-label">City *</label>
                      <select
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className={cn("input-field", formErrors.city && "border-red-400")}
                      >
                        <option value="">Select a city</option>
                        {CITIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      {formErrors.city && <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="field-label">Full Address *</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="123 Main St, Suite 400, City, ST 12345"
                        className={cn("input-field", formErrors.address && "border-red-400")}
                      />
                      {formErrors.address && <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="field-label">Description *</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={4}
                        placeholder="Describe your workspace — highlight what makes it special, the community, and unique features..."
                        className={cn("input-field resize-none", formErrors.description && "border-red-400")}
                      />
                      <div className="flex justify-between mt-1">
                        {formErrors.description ? <p className="text-xs text-red-500">{formErrors.description}</p> : <span />}
                        <p className="text-xs text-slate-400">{form.description.length} chars</p>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="field-label">Cover Image URL (optional)</label>
                      <input
                        type="url"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="input-field"
                      />
                      {form.imageUrl && (
                        <img src={form.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Pricing & Amenities */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-up">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Pricing</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Per Hour ($)", key: "pricePerHour", placeholder: "25" },
                        { label: "Per Day ($)", key: "pricePerDay", placeholder: "75" },
                        { label: "Per Month ($)", key: "pricePerMonth", placeholder: "850" },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="field-label">{field.label} *</label>
                          <input
                            type="number"
                            min="0"
                            value={form[field.key as keyof WorkspaceForm] as string}
                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                            className={cn("input-field", formErrors[field.key as keyof WorkspaceForm] && "border-red-400")}
                          />
                          {formErrors[field.key as keyof WorkspaceForm] && (
                            <p className="text-xs text-red-500 mt-1">{formErrors[field.key as keyof WorkspaceForm]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Capacity (seats) *</label>
                    <input
                      type="number"
                      min="1"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      placeholder="50"
                      className={cn("input-field w-40", formErrors.capacity && "border-red-400")}
                    />
                    {formErrors.capacity && <p className="text-xs text-red-500 mt-1">{formErrors.capacity}</p>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="field-label mb-0">Amenities * <span className="text-slate-400 font-normal">(select at least 2)</span></label>
                      <span className="text-xs text-primary-600 font-semibold">{form.amenities.length} selected</span>
                    </div>
                    {formErrors.amenities && <p className="text-xs text-red-500 mb-2">{formErrors.amenities as string}</p>}
                    <div className="flex flex-wrap gap-2">
                      {WORKSPACE_AMENITIES.map((a) => {
                        const selected = form.amenities.includes(a);
                        return (
                          <button
                            key={a}
                            type="button"
                            onClick={() => toggleAmenity(a)}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-xs font-medium border-2 transition-all",
                              selected
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                          >
                            {selected && "✓ "}{a}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Preview */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-up">
                  <div className="bg-slate-50 dark:bg-slate-700/40 rounded-2xl overflow-hidden">
                    <img
                      src={form.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop"}
                      alt={form.name}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-white text-lg">{form.name}</h3>
                          <p className="text-sm text-slate-400">{form.address}</p>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full font-semibold">
                          {typeLabel(form.type)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">{form.description}</p>
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="text-center p-2 bg-white dark:bg-slate-700 rounded-xl">
                          <p className="text-lg font-bold text-primary-600">${form.pricePerHour}</p>
                          <p className="text-xs text-slate-400">per hour</p>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-slate-700 rounded-xl">
                          <p className="text-lg font-bold text-primary-600">${form.pricePerDay}</p>
                          <p className="text-xs text-slate-400">per day</p>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-slate-700 rounded-xl">
                          <p className="text-lg font-bold text-primary-600">${form.pricePerMonth}</p>
                          <p className="text-xs text-slate-400">per month</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-2">Amenities ({form.amenities.length})</p>
                        <div className="flex flex-wrap gap-1.5">
                          {form.amenities.map((a) => (
                            <span key={a} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg">{a}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">Capacity: {form.capacity} seats · {form.city}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                    <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {editingWorkspace ? "Changes will update your listing immediately." : "Your workspace will be reviewed within 24 hours before going live. You'll receive an email confirmation."}
                    </p>
                  </div>
                </div>
              )}
            </form>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex gap-3 flex-shrink-0">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary py-3 text-sm flex-1 justify-center">← Back</button>
              ) : (
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary py-3 text-sm flex-1 justify-center">Cancel</button>
              )}
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="btn-primary py-3 text-sm flex-1 justify-center">
                  Continue →
                </button>
              ) : (
                <button type="submit" onClick={handleSubmit} disabled={submitting} className="btn-primary py-3 text-sm flex-1 justify-center">
                  {submitting
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{editingWorkspace ? "Saving…" : "Submitting…"}</>
                    : editingWorkspace ? "Save Changes" : "Submit for Review"
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white text-center mb-2">Remove Workspace?</h3>
            <p className="text-slate-500 text-sm text-center mb-5">This will permanently remove the listing. Any active bookings will be transferred.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="btn-secondary flex-1 py-3 text-sm justify-center">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-3 text-sm font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-2">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
