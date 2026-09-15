import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Users, 
  IndianRupee, 
  Clock, 
  Smile, 
  Heart, 
  Sparkles, 
  Printer, 
  Bookmark, 
  ArrowLeft, 
  RotateCcw, 
  Scale, 
  Building2, 
  ShieldCheck,
  CheckSquare,
  Award,
  Layers,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEventContext } from '../context/EventContext';
import api from '../services/api';

export default function FinalEventPlanPage() {
  const navigate = useNavigate();
  const { 
    eventData, 
    selectedVenue, 
    agentResponse, 
    toggleSaveVenue, 
    isVenueSaved, 
    resetToDemoDefaults 
  } = useEventContext();

  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSavedLocally, setIsSavedLocally] = useState(false);

  const venueToUse = selectedVenue || agentResponse?.best_venue?.venue || { id: 1, name: 'Grand Imperial Convention' };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const res = await api.getEventPlan(agentResponse?.event_id || 'evt_demo_wedding', {
          venue_id: venueToUse.id,
          city: eventData.city,
          guests: eventData.guests,
          budget: eventData.budget,
          event_type: eventData.event_type,
          organizer_type: eventData.organizer_type
        });
        setPlanData(res);

        // Confetti celebration effect on complete event plan formulation
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error('Error generating event plan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [agentResponse, eventData, venueToUse.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleSavePlan = async () => {
    await toggleSaveVenue(venueToUse.id);
    setIsSavedLocally(true);
    alert(`Event Plan for "${eventData.event_type}" at ${venueToUse.name} successfully saved!`);
  };

  if (loading) {
    return (
      <div className="py-24 text-center glass-card rounded-2xl max-w-4xl mx-auto my-12">
        <Sparkles className="w-10 h-10 mx-auto mb-3 text-rgb-purple animate-spin-slow" />
        <p className="text-slate-400 text-sm">Compiling complete Smart Event Dossier & Timeline...</p>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="py-24 text-center glass-card rounded-2xl max-w-4xl mx-auto my-12 space-y-4">
        <FileCheck className="w-12 h-12 mx-auto text-slate-600" />
        <h3 className="text-lg font-bold text-white">Event Plan not available</h3>
        <Link to="/event-input" className="text-xs text-rgb-blue underline">
          Re-enter Event Criteria
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Step 11 of 11 • Final Blueprint</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-purple-300">Smart Event Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Your Smart Event Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Comprehensive itinerary, budget allocation, multi-generational care, and logistics checklist.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold glass-card border border-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4 text-rgb-blue" />
            <span>Print / Export PDF</span>
          </button>

          <button
            onClick={handleSavePlan}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              isVenueSaved(venueToUse.id) || isSavedLocally
                ? 'bg-pink-600 border-pink-500 text-white shadow-rgb-glow-pink'
                : 'bg-gradient-to-r from-rgb-purple to-rgb-pink border-purple-400 text-white shadow-rgb-glow'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span>{isVenueSaved(venueToUse.id) || isSavedLocally ? 'Event Plan Saved ✓' : 'Save Event Plan'}</span>
          </button>
        </div>
      </div>

      {/* Main Printable Dossier Card */}
      <div className="space-y-6">
        {/* Header Summary Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 bg-gradient-to-br from-slate-900/95 via-dark-900/95 to-slate-900/95 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400">
                Official AI Blueprint • {planData.event_id}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
                {planData.event_title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-rgb-pink shrink-0" />
                <span className="font-bold text-white">{planData.selected_venue.name}</span>
                <span>• {planData.selected_venue.city} ({planData.selected_venue.area})</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Target Budget</span>
              <span className="text-2xl font-extrabold text-pink-400 font-mono">
                ₹{planData.budget?.toLocaleString()}
              </span>
              <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                Estimated Package: ₹{planData.estimated_cost?.toLocaleString()} ({planData.budget_variance >= 0 ? `₹${planData.budget_variance?.toLocaleString()} buffer` : 'Exact fit'})
              </div>
            </div>
          </div>

          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Event Type</span>
              <span className="font-bold text-white text-sm">{planData.event_type}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Scheduled Date</span>
              <span className="font-bold text-white text-sm">{planData.event_date}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Guest Headcount</span>
              <span className="font-bold text-blue-400 font-mono text-sm">{planData.guest_count} Attendees</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Organizer</span>
              <span className="font-bold text-purple-300 text-sm">{planData.organizer_type}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Event Timeline */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Clock className="w-5 h-5 text-rgb-blue" />
              <span>Recommended Event Timeline & Program Schedule</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Sequential Flow</span>
          </div>

          <div className="space-y-4">
            {planData.timeline.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="px-3 py-1.5 rounded-lg bg-purple-950/90 border border-purple-500/50 text-purple-300 font-mono font-bold text-xs shrink-0">
                    {item.time}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{item.description}</p>
                  </div>
                </div>

                <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 shrink-0 self-start sm:self-center font-mono">
                  📍 {item.zone}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Budget Breakdown & Allocation */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
          <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-3">
            <IndianRupee className="w-5 h-5 text-pink-400" />
            <span>AI Budget Allocation Model</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(planData.budget_breakdown).map(([category, amount], idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">{category}</span>
                <span className="text-base font-bold text-pink-400 font-mono">
                  ₹{amount?.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  ~{Math.round((amount / planData.budget) * 100)}% of total budget
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Multi-Generational Plans (Kids & Senior Citizens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kids Plan */}
          <div className="glass-card rounded-2xl p-6 border border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2 text-pink-300 border-b border-slate-800 pb-3">
              <Smile className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Children's Activity & Care Plan
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {planData.kids_plan.activity_zone_setup}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Child Safety Measures</h4>
              {planData.kids_plan.safety_measures.map((m, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rgb-pink shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>

            {planData.kids_plan.recommended_menu_items?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Kids Menu Favorites</h4>
                <div className="flex flex-wrap gap-1.5">
                  {planData.kids_plan.recommended_menu_items.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-pink-950/60 border border-pink-500/30 text-pink-200">
                      🍰 {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Senior Citizens Plan */}
          <div className="glass-card rounded-2xl p-6 border border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2 text-cyan-300 border-b border-slate-800 pb-3">
              <Heart className="w-5 h-5" />
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Senior Citizen Comfort & Mobility Plan
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {planData.senior_plan.quiet_rest_zone_details}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mobility & Access Guidelines</h4>
              {planData.senior_plan.mobility_support.map((m, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              <span className="font-semibold text-slate-400 block mb-1">Arrival Drop-off Protocol:</span>
              <p>{planData.senior_plan.dropoff_protocol}</p>
            </div>
          </div>
        </div>

        {/* Section 4: Coordinator Checklist */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
          <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <span>Event Coordinator Master Checklist</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {planData.coordinator_checklist.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-purple-600 focus:ring-0 accent-purple-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Alternative Venues */}
        {planData.alternative_venues?.length > 0 && (
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
            <h3 className="text-lg font-bold text-white font-['Outfit'] border-b border-slate-800 pb-3">
              Alternative Venues for Contingency
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {planData.alternative_venues.map((alt) => (
                <div key={alt.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                  <h4 className="font-bold text-white">{alt.name}</h4>
                  <p className="text-slate-400">{alt.city} • {alt.area}</p>
                  <p className="text-pink-400 font-mono font-bold">₹{alt.price_per_day?.toLocaleString()}/day</p>
                  <Link to={`/venue/${alt.id}`} className="text-rgb-blue hover:underline inline-block pt-1">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Completion Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800 no-print">
        <Link
          to="/compare"
          className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold glass-card border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
        >
          <Scale className="w-4 h-4" /> Compare Other Venues
        </Link>

        <button
          onClick={() => {
            resetToDemoDefaults();
            navigate('/event-input');
          }}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rgb-blue to-rgb-purple text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Plan Another Event</span>
        </button>
      </div>
    </div>
  );
}
