import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Scale, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X, 
  Sparkles, 
  Star, 
  Award, 
  IndianRupee, 
  Users, 
  Building2,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import api from '../services/api';

export default function VenueComparePage() {
  const navigate = useNavigate();
  const { eventData, compareVenueIds, toggleCompareVenue } = useEventContext();

  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparison();
  }, [compareVenueIds, eventData]);

  const fetchComparison = async () => {
    const ids = compareVenueIds.length >= 2 ? compareVenueIds : [1, 2];
    try {
      setLoading(true);
      const res = await api.compareVenues({
        venue_ids: ids,
        event_type: eventData.event_type,
        budget: eventData.budget,
        guests: eventData.guests,
        facilities: eventData.facilities,
        age_groups: eventData.age_groups
      });
      setCompareData(res);
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-rgb-purple">Step 8 of 11</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-pink-300">Multi-Attribute Comparison Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Venue Details & Comparison Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Side-by-side analysis of candidate venues against budget, capacity, accessibility, and ratings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/venues"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Venue Catalog
          </Link>

          <Link
            to="/recommendation"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <span>Get AI Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center glass-card rounded-2xl">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-rgb-purple animate-spin-slow" />
          <p className="text-slate-400 text-sm">Computing comparative trade-off vectors...</p>
        </div>
      ) : !compareData ? (
        <div className="py-16 text-center glass-card rounded-2xl p-8 space-y-4">
          <Scale className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-white">Select at least 2 venues to compare</h3>
          <Link to="/venues" className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-900/60 text-purple-200 inline-block">
            Browse Venues
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* AI Comparison Verdict Card */}
          <div className="glass-card rounded-2xl p-6 border border-purple-500/40 bg-gradient-to-r from-purple-950/40 via-dark-900/90 to-blue-950/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
              <Award className="w-4 h-4 text-rgb-pink" />
              <span>Comparison Agent Synthesis Verdict</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {compareData.summary_verdict}
            </p>
          </div>

          {/* Comparative Matrix Table / Grid */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[800px] grid grid-cols-12 gap-4">
              {/* Feature Headers Column (3 cols) */}
              <div className="col-span-3 space-y-4 pt-48 font-semibold text-xs text-slate-400">
                <div className="h-12 flex items-center border-b border-slate-800">Total Est. Cost</div>
                <div className="h-12 flex items-center border-b border-slate-800">Capacity Fit</div>
                <div className="h-12 flex items-center border-b border-slate-800">Facilities Match %</div>
                <div className="h-12 flex items-center border-b border-slate-800">Accessibility Score</div>
                <div className="h-12 flex items-center border-b border-slate-800">Family Comfort Score</div>
                <div className="h-12 flex items-center border-b border-slate-800">Overall AI Match</div>
                <div className="h-32 flex items-start pt-2 border-b border-slate-800">Key Advantages</div>
                <div className="h-24 flex items-start pt-2">Key Limitations</div>
              </div>

              {/* Venue Columns */}
              {compareData.metrics.map((m, idx) => {
                const venue = compareData.venues.find((v) => v.id === m.venue_id);
                const isBestOverall = compareData.best_luxury_venue_id === m.venue_id;

                return (
                  <div
                    key={m.venue_id}
                    className={`col-span-${Math.floor(9 / compareData.metrics.length)} glass-card rounded-2xl p-5 border flex flex-col justify-between ${
                      isBestOverall
                        ? 'border-purple-500 bg-purple-950/20 shadow-rgb-glow'
                        : 'border-slate-800 bg-dark-900/60'
                    }`}
                  >
                    {/* Top Venue Header Card */}
                    <div className="space-y-3 pb-4 border-b border-slate-800 h-44 flex flex-col justify-between">
                      <div>
                        {isBestOverall && (
                          <span className="inline-block mb-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-rgb-pink to-rgb-purple text-white">
                            ★ Top AI Match
                          </span>
                        )}
                        <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit'] line-clamp-2">
                          {m.venue_name}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {venue?.city} • {venue?.area}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{venue?.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {venue?.capacity_min}-{venue?.capacity_max} cap
                        </span>
                      </div>
                    </div>

                    {/* Metrics Row Data */}
                    <div className="space-y-4 text-xs font-medium pt-3">
                      {/* Price */}
                      <div className="h-12 flex items-center border-b border-slate-800/80 font-mono font-bold text-pink-400">
                        ₹{m.price_total?.toLocaleString()}
                      </div>

                      {/* Capacity Fit */}
                      <div className="h-12 flex items-center border-b border-slate-800/80 font-mono">
                        <span className="text-emerald-400 font-bold">{m.capacity_fit_score}%</span>
                      </div>

                      {/* Facilities Match */}
                      <div className="h-12 flex items-center border-b border-slate-800/80">
                        <span className="text-blue-300 font-bold font-mono">{m.facilities_match_percentage}%</span>
                        <span className="text-[10px] text-slate-500 ml-1">({m.facilities_match_count} matched)</span>
                      </div>

                      {/* Accessibility */}
                      <div className="h-12 flex items-center border-b border-slate-800/80 text-cyan-300 font-bold font-mono">
                        {m.accessibility_score}%
                      </div>

                      {/* Family */}
                      <div className="h-12 flex items-center border-b border-slate-800/80 text-purple-300 font-bold font-mono">
                        {m.family_score}%
                      </div>

                      {/* Overall AI Score */}
                      <div className="h-12 flex items-center border-b border-slate-800/80">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/50 text-white font-bold font-mono text-sm">
                          {m.overall_score}%
                        </span>
                      </div>

                      {/* Pros */}
                      <div className="h-32 pt-2 border-b border-slate-800/80 space-y-1 overflow-y-auto">
                        {m.pros.map((p, i) => (
                          <div key={i} className="text-[11px] text-emerald-300 flex items-start gap-1">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{p}</span>
                          </div>
                        ))}
                      </div>

                      {/* Cons */}
                      <div className="h-24 pt-2 space-y-1 overflow-y-auto">
                        {m.cons.map((c, i) => (
                          <div key={i} className="text-[11px] text-amber-300/80 flex items-start gap-1">
                            <span className="text-amber-500 font-bold shrink-0">•</span>
                            <span className="line-clamp-2">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Choose Action */}
                    <div className="pt-4 mt-2">
                      <Link
                        to={`/venue/${m.venue_id}`}
                        className="w-full py-2 rounded-xl text-xs font-bold text-center block glass-card hover:bg-slate-800 text-white border border-slate-700 transition-colors"
                      >
                        Inspect Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer Nav CTA */}
      <div className="flex justify-between items-center pt-4">
        <Link to="/venues" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Venues
        </Link>

        <Link
          to="/recommendation"
          className="px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>Get AI Recommendation & Decision</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
