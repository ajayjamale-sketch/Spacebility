import React from "react";
import { Link } from "react-router-dom";
import type { Workspace } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";

interface Props {
  workspace: Workspace;
  featured?: boolean;
  onBook?: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  "hot-desk": "Hot Desk",
  "dedicated-desk": "Dedicated Desk",
  "private-office": "Private Office",
  "meeting-room": "Meeting Room",
  "event-space": "Event Space",
};

export default function WorkspaceCard({ workspace, featured, onBook }: Props) {
  return (
    <div className={cn("card overflow-hidden group", featured && "ring-2 ring-primary-500")}>
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={workspace.images[0]}
          alt={workspace.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge bg-white/90 backdrop-blur-sm text-slate-700 font-medium text-xs">
            {TYPE_LABELS[workspace.type] || workspace.type}
          </span>
          {featured && (
            <span className="badge bg-primary-600 text-white text-xs">Featured</span>
          )}
          {workspace.occupancy >= 90 && (
            <span className="badge bg-red-500 text-white text-xs">Almost Full</span>
          )}
        </div>

        {/* Favorite */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Available indicator */}
        <div className="absolute bottom-3 right-3">
          <span className={cn("flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm",
            workspace.available ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"
          )}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {workspace.available ? "Available" : "Fully Booked"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-slate-800 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
            {workspace.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{workspace.rating}</span>
            <span className="text-xs text-slate-400">({workspace.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mb-3">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {workspace.location}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {workspace.amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">{a}</span>
          ))}
          {workspace.amenities.length > 3 && (
            <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-lg">+{workspace.amenities.length - 3} more</span>
          )}
        </div>

        {/* Occupancy Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Occupancy</span>
            <span className={cn(
              "font-medium",
              workspace.occupancy >= 90 ? "text-red-600" : workspace.occupancy >= 70 ? "text-amber-600" : "text-emerald-600"
            )}>{workspace.occupancy}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", workspace.occupancy >= 90 ? "bg-red-500" : workspace.occupancy >= 70 ? "bg-amber-500" : "bg-emerald-500")}
              style={{ width: `${workspace.occupancy}%` }}
            />
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">{formatCurrency(workspace.pricePerDay)}</span>
            <span className="text-sm text-slate-400">/day</span>
          </div>
          {onBook ? (
            <button onClick={onBook} className="btn-primary text-sm py-2.5 px-5">
              Book Now
            </button>
          ) : (
            <Link to={`/marketplace/${workspace.id}`} className="btn-primary text-sm py-2.5 px-5">
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
