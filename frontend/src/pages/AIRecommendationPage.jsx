import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Users, 
  IndianRupee, 
  Star, 
  Heart, 
  ShieldCheck, 
  Scale, 
  Map, 
  FileText,
  Sliders,
  TrendingUp
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import api from '../services/api';

export default function AIRecommendationPage() {
  const navigate = useNavigate();
  const { 
    eventData, 
    agentResponse, 
    setAgentResponse, 
    setSelectedVenue 
  } = useEventContext();

  const [loading, setLoading] = useState(!agentResponse);

  useEffect(() => {
    if (!agentResponse) {
      const fetchRecommendation = async () => {
        try {
          setLoading(true);
          const res = await api.executeAgentWorkflow(eventData);
          setAgentResponse(res);
          if (res.best_venue?.venue) {
            setSelectedVenue(res.best_venue.venue);
          }
        } catch (err) {
          console.error('Error fetching recommendation:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchRecommendation();
    } else {
      if (agentResponse.best_venue?.venue) {
        setSelectedVenue(agentResponse.best_venue.venue);
      }
    }
  }, [agentResponse, eventData, setAgentResponse, setSelectedVenue]);

  if (loading) {
    return (
      <div className="py-24 text-center glass-card rounded-2xl max-w-4xl mx-auto my-12">
        <Sparkles className="w-10 h-10 mx-auto mb-3 text-rgb-purple animate-spin-slow" />
        <p className="text-slate-400 text-sm">Decision-Making Agent synthesising final ranking...</p>
      </div>
    );
  }

  const bestRec = agentResponse?.best_venue;
  const bestVenue = bestRec?.venue;
  const scores = bestRec?.scores;
  const alternatives = agentResponse?.alternative_venues || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-rgb-pink">Step 9 of 11</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-purple-300">Decision-Making & Reasoning Synthesis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            AI Recommendation & Decision
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Autonomous multi-agent consensus for {eventData.event_type} in {eventData.city}.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/compare"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" /> Compare Matrix
          </Link>

          <Link
            to="/preview"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <span>Experience 2D Floor Layout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {bestRec && bestVenue && (
        <div className="space-y-8">
          {/* Best Recommended Hero Card */}
          <div className="relative glass-card rounded-3xl p-6 sm:p-8 border-2 border-purple-500/60 bg-gradient-to-br from-purple-950/40 via-dark-900/95 to-blue-950/40 shadow-rgb-glow overflow-hidden">
            {/* Top Glow Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rgb-pink to-rgb-purple text-white text-xs font-bold shadow-sm">
                <Award className="w-4 h-4" />
                <span>#1 Best Recommended Venue</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Overall AI Match Score:</span>
                <span className="px-3 py-1 rounded-xl bg-purple-950 border border-purple-500 text-base font-extrabold text-white font-mono shadow-rgb-glow">
                  {bestRec.ai_match_score}%
                </span>
              </div>
            </div>

            {/* Main Content Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
              {/* Image & Quick Info (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img
                    src={bestVenue.images && bestVenue.images[0]}
                    alt={bestVenue.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{bestVenue.rating} ({bestVenue.review_count}+ reviews)</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                    {bestVenue.name}
                  </h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rgb-blue shrink-0" />
                    <span>{bestVenue.city} • {bestVenue.area}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Est. Event Package</span>
                    <span className="text-pink-400 font-bold text-sm">
                      ₹{bestRec.estimated_cost?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Capacity</span>
                    <span className="text-white font-bold text-sm">
                      {bestVenue.capacity_min}-{bestVenue.capacity_max} Guests
                    </span>
                  </div>
                </div>
              </div>

              {/* Why AI Selected This Venue (7 cols) */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-rgb-pink" />
                    <span>Why AI Selected This Venue</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {bestRec.reasons && bestRec.reasons.map((reason, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-Dimension Scores Meter */}
                {scores && (
                  <div className="space-y-2 pt-3 border-t border-slate-800/80">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Multi-Dimensional Match Evaluation
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Budget Fit</span>
                        <span className="font-bold text-pink-400 font-mono text-sm">{scores.budget_match_score}%</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Capacity Alignment</span>
                        <span className="font-bold text-blue-400 font-mono text-sm">{scores.capacity_match_score}%</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Facilities Match</span>
                        <span className="font-bold text-purple-400 font-mono text-sm">{scores.facilities_match_score}%</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Accessibility Score</span>
                        <span className="font-bold text-cyan-400 font-mono text-sm">{scores.accessibility_score}%</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 block">Family & Child Comfort</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">{scores.family_comfort_score}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Advantages, Limitations & Customizations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Advantages */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Key Advantages</span>
              </h3>
              <div className="space-y-2">
                {bestRec.advantages && bestRec.advantages.map((adv, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Trade-offs & Limitations</span>
              </h3>
              <div className="space-y-2">
                {bestRec.limitations && bestRec.limitations.map((lim, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{lim}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Customizations */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>AI Setup Suggestions</span>
              </h3>
              <div className="space-y-2">
                {bestRec.suggested_customizations && bestRec.suggested_customizations.map((sug, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alternative Venues */}
          {alternatives.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  Alternative Venue Candidates
                </h3>
                <span className="text-xs text-slate-400">Ranked by score</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {alternatives.map((alt) => (
                  <div
                    key={alt.venue.id}
                    className="glass-card-hover rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                          Rank #{alt.rank}
                        </span>
                        <span className="text-xs font-bold text-purple-300 font-mono">
                          {alt.ai_match_score}% Match
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-['Outfit']">{alt.venue.name}</h4>
                      <p className="text-xs text-slate-400">{alt.venue.city} • {alt.venue.area}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-pink-400 font-bold">
                        ₹{alt.estimated_cost?.toLocaleString()}
                      </span>
                      <Link
                        to={`/venue/${alt.venue.id}`}
                        className="text-xs text-rgb-blue hover:underline"
                      >
                        Inspect →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Nav CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <Link to="/venues" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search Results
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/preview"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Event Experience Preview</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
