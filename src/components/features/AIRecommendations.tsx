import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MOCK_WORKSPACES } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function AIRecommendations() {
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);

  const recommendations = MOCK_WORKSPACES.slice(0, 3).map((ws, i) => ({
    ...ws,
    match: [96, 91, 87][i],
    reason: [
      "Matches your work schedule & team size preference",
      "Top-rated in your preferred location with your required amenities",
      "Best value for your budget with community events",
    ][i],
  }));

  const handleGetRecs = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setShown(true);
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-3xl p-6 border border-primary-100 dark:border-primary-800">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white font-display">AI Workspace Matcher</h3>
          <p className="text-xs text-slate-500">Powered by Spacebility AI</p>
        </div>
      </div>

      {!shown ? (
        <div className="text-center py-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Get personalized workspace recommendations based on your work style, team size, and preferences.
          </p>
          <button onClick={handleGetRecs} disabled={loading} className="btn-primary">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing your profile...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Get AI Recommendations</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-up">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            ✨ Found {recommendations.length} perfect matches for you
          </p>
          {recommendations.map((ws) => (
            <div key={ws.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex gap-3 border border-slate-100 dark:border-slate-700 hover:border-primary-300 transition-colors">
              <img src={ws.images[0]} alt={ws.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{ws.name}</h4>
                  <span className="flex-shrink-0 text-xs font-bold text-primary-600 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">{ws.match}% match</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{ws.location}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{ws.reason}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-primary-600">{formatCurrency(ws.pricePerDay)}/day</span>
                  <Link to={`/marketplace/${ws.id}`} className="text-xs text-primary-600 hover:underline font-medium">View →</Link>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setShown(false)} className="text-xs text-slate-400 hover:text-primary-600 transition-colors w-full text-center mt-2">
            Refresh recommendations
          </button>
        </div>
      )}
    </div>
  );
}
