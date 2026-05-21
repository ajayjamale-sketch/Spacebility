import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WorkspaceCard from "@/components/features/WorkspaceCard";
import { MOCK_WORKSPACES, WORKSPACE_AMENITIES, CITIES, WORKSPACE_TYPES } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MOCK_WORKSPACES.filter((ws) => {
    if (search && !ws.name.toLowerCase().includes(search.toLowerCase()) && !ws.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (city && ws.city !== city) return false;
    if (type && ws.type !== type) return false;
    if (ws.pricePerDay < priceRange[0] || ws.pricePerDay > priceRange[1]) return false;
    if (amenities.length > 0 && !amenities.every((a) => ws.amenities.includes(a))) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-low") return a.pricePerDay - b.pricePerDay;
    if (sortBy === "price-high") return b.pricePerDay - a.pricePerDay;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const toggleAmenity = (a: string) => setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold font-display mb-4">Workspace Marketplace</h1>
            <p className="text-primary-200 text-lg mb-8">Discover {MOCK_WORKSPACES.length} premium workspaces across the country</p>
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, location..." className="flex-1 px-4 py-3 bg-white/10 rounded-xl text-white placeholder-white/60 outline-none border border-white/20 focus:border-white/40 text-sm" />
              <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none">
                <option value="">All Cities</option>
                {CITIES.map((c) => <option key={c} className="text-slate-800">{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600 dark:text-slate-400">{filtered.length} workspaces found</p>
            <div className="flex gap-3">
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-secondary text-sm py-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                Filters
              </button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field w-auto py-2 text-sm">
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <aside className={cn("w-72 flex-shrink-0 space-y-5", showFilters ? "block" : "hidden lg:block")}>
              <div className="card p-5">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 font-display">Workspace Type</h3>
                <div className="space-y-2">
                  {[{ value: "", label: "All Types" }, ...WORKSPACE_TYPES].map((t) => (
                    <label key={t.value} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="type" value={t.value} checked={type === t.value} onChange={() => setType(t.value)} className="accent-primary-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 font-display">Daily Price</h3>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <span>${priceRange[0]}</span>
                  <span className="flex-1 text-center">—</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input type="range" min={0} max={500} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full accent-primary-600" />
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 font-display">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {WORKSPACE_AMENITIES.slice(0, 12).map((a) => (
                    <button key={a} onClick={() => toggleAmenity(a)}
                      className={cn("text-xs px-3 py-1.5 rounded-lg border transition-all", amenities.includes(a) ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300")}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {(search || city || type || amenities.length > 0) && (
                <button onClick={() => { setSearch(""); setCity(""); setType(""); setAmenities([]); }} className="w-full btn-secondary text-sm py-2.5 text-red-600">Clear All Filters</button>
              )}
            </aside>

            {/* Results */}
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <p className="text-slate-500 font-medium">No workspaces found</p>
                  <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((ws) => <WorkspaceCard key={ws.id} workspace={ws} featured={ws.featured} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
