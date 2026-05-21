import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingModal from "@/components/features/BookingModal";
import { MOCK_WORKSPACES, MOCK_REVIEWS } from "@/lib/data";
import { formatCurrency, cn } from "@/lib/utils";

export default function WorkspaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workspace = MOCK_WORKSPACES.find((ws) => ws.id === id);
  const [showBooking, setShowBooking] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "amenities" | "reviews">("overview");

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Workspace not found</h2>
          <Link to="/marketplace" className="btn-primary mt-4">Browse Workspaces</Link>
        </div>
      </div>
    );
  }

  const reviews = MOCK_REVIEWS.filter((r) => r.workspaceId === workspace.id);
  const TYPE_LABELS: Record<string, string> = { "hot-desk": "Hot Desk", "dedicated-desk": "Dedicated Desk", "private-office": "Private Office", "meeting-room": "Meeting Room", "event-space": "Event Space" };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        {/* Images */}
        <div className="bg-slate-900 relative">
          <img src={workspace.images[activeImage]} alt={workspace.name} className="w-full h-80 lg:h-[480px] object-cover opacity-90" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {workspace.images.map((_, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={cn("w-2.5 h-2.5 rounded-full transition-all", activeImage === i ? "bg-white scale-125" : "bg-white/50")} />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <nav className="text-sm text-slate-400 mb-4">
                <Link to="/marketplace" className="hover:text-primary-600 transition-colors">Marketplace</Link>
                <span className="mx-2">›</span>
                <span className="text-slate-600 dark:text-slate-300">{workspace.name}</span>
              </nav>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge-primary">{TYPE_LABELS[workspace.type]}</span>
                    {workspace.featured && <span className="badge bg-amber-100 text-amber-700">⭐ Featured</span>}
                    <span className={cn("badge", workspace.available ? "badge-success" : "badge-error")}>{workspace.available ? "Available" : "Fully Booked"}</span>
                  </div>
                  <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">{workspace.name}</h1>
                  <div className="flex items-center gap-4 mt-2 text-slate-500">
                    <span className="flex items-center gap-1 text-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {workspace.address}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      {workspace.rating} ({workspace.reviewCount} reviews)
                    </span>
                    <span className="text-sm">Capacity: {workspace.capacity}</span>
                  </div>
                </div>
                <button className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6 w-fit">
                {(["overview", "amenities", "reviews"] as const).map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={cn("px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize", activeTab === t ? "bg-white dark:bg-slate-700 text-primary-600 shadow-sm" : "text-slate-500")}>
                    {t}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{workspace.description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Hourly", price: workspace.pricePerHour },
                      { label: "Daily", price: workspace.pricePerDay },
                      { label: "Monthly", price: workspace.pricePerMonth },
                    ].map((p) => (
                      <div key={p.label} className="card p-4 text-center">
                        <p className="text-xs text-slate-400 mb-1">{p.label}</p>
                        <p className="text-xl font-bold text-primary-600">{formatCurrency(p.price)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {workspace.tags.map((tag) => (
                      <span key={tag} className="badge-accent">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "amenities" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {workspace.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">No reviews yet</div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="card p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white text-sm">{review.userName}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating)].map((_, i) => <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                            </div>
                          </div>
                          <span className="ml-auto text-xs text-slate-400">{review.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-3xl font-bold text-primary-600 font-display">{formatCurrency(workspace.pricePerDay)}</span>
                  <span className="text-slate-400 text-sm">/day</span>
                </div>

                {/* Occupancy */}
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Current Occupancy</span>
                    <span className={cn("font-semibold", workspace.occupancy >= 90 ? "text-red-600" : workspace.occupancy >= 70 ? "text-amber-600" : "text-emerald-600")}>{workspace.occupancy}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                    <div className={cn("h-full rounded-full transition-all", workspace.occupancy >= 90 ? "bg-red-500" : workspace.occupancy >= 70 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${workspace.occupancy}%` }} />
                  </div>
                </div>

                <button onClick={() => setShowBooking(true)} disabled={!workspace.available} className={cn("w-full py-4 rounded-xl font-semibold text-base transition-all", workspace.available ? "btn-primary" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
                  {workspace.available ? "Book This Space" : "Currently Unavailable"}
                </button>

                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  {["Free cancellation 24hrs before", "Instant booking confirmation", "QR code check-in"].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-400 mb-2">Listed by</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{workspace.ownerName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBooking && <BookingModal workspace={workspace} onClose={() => setShowBooking(false)} />}
      <Footer />
    </div>
  );
}
