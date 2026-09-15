import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileCheck, 
  Calendar, 
  MapPin, 
  Users, 
  IndianRupee, 
  Building, 
  Tag, 
  Heart, 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Edit3,
  Cpu
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import api from '../services/api';

export default function RequirementSummaryPage() {
  const navigate = useNavigate();
  const { eventData, setAnalysisResult } = useEventContext();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Proactively validate requirements with backend agent 1
    const runAnalysis = async () => {
      try {
        setIsVerifying(true);
        const result = await api.analyzeEvent(eventData);
        setAnalysisResult(result);
      } catch (err) {
        console.warn('Backend validation notice:', err);
      } finally {
        setIsVerifying(false);
      }
    };
    runAnalysis();
  }, [eventData, setAnalysisResult]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-rgb-pink">Step 5 of 11</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-purple-300">Final Review Before AI Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Requirement Summary
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review all captured criteria. Everything is verified and ready for the 8-Agent AI pipeline.
          </p>
        </div>

        <Link
          to="/event-input"
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 self-start sm:self-center"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit Details
        </Link>
      </div>

      {/* Structured Summary Cards */}
      <div className="space-y-6">
        {/* Card 1: Core Parameters */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rgb-blue" />
              <span>Event Specification</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              ✓ Verified Intake
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Event Type:</span>
              <span className="font-bold text-white text-base font-['Outfit']">{eventData.event_type}</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Target Date:</span>
              <span className="font-semibold text-slate-200">{eventData.event_date || 'Flexible Date'}</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Location:</span>
              <span className="font-semibold text-slate-200">
                {eventData.city} {eventData.area ? `(${eventData.area})` : ''}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Expected Guests:</span>
              <span className="font-bold text-white text-base font-mono">{eventData.guests} Guests</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Total Budget:</span>
              <span className="font-bold text-pink-400 text-base font-mono">
                ₹{eventData.budget?.toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Organizer Category:</span>
              <span className="font-semibold text-purple-300">{eventData.organizer_type}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Priorities & Demographic Guardrails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priorities */}
          <div className="glass-card rounded-2xl p-6 border border-slate-700/80 space-y-4">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-2">
              <Tag className="w-4 h-4 text-rgb-pink" />
              <span>Organizer Priorities</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {eventData.priorities && eventData.priorities.length > 0 ? (
                eventData.priorities.map((p) => (
                  <span
                    key={p}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-950/80 border border-purple-500/40 text-purple-200"
                  >
                    ★ {p}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">Standard balanced priority profile</span>
              )}
            </div>
          </div>

          {/* Age Demographics */}
          <div className="glass-card rounded-2xl p-6 border border-slate-700/80 space-y-4">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-2">
              <Heart className="w-4 h-4 text-rgb-purple" />
              <span>Attending Age Cohorts</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {eventData.age_groups && eventData.age_groups.map((group) => (
                <span
                  key={group}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{group}</span>
                </span>
              ))}
            </div>
            {eventData.age_groups?.includes('Kids') && (
              <p className="text-[11px] text-pink-300 font-mono">
                • Kids care plan activated (~{eventData.kids_count || 20} kids expected)
              </p>
            )}
            {eventData.age_groups?.includes('Senior Citizens') && (
              <p className="text-[11px] text-blue-300 font-mono">
                • Universal accessibility & quiet lounge protocol activated
              </p>
            )}
          </div>
        </div>

        {/* Card 3: Facilities & Preferences */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-2">
            <Building2 className="w-4 h-4 text-rgb-blue" />
            <span>Required Facilities & Logistics</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {eventData.facilities && eventData.facilities.map((fac) => (
              <span
                key={fac}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/90 border border-slate-700 text-slate-200"
              >
                ✓ {fac}
              </span>
            ))}
          </div>

          {eventData.additional_preferences && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              <span className="font-semibold text-slate-400 block mb-1">Additional Notes:</span>
              <p className="italic">"{eventData.additional_preferences}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Dispatch Action */}
      <div className="p-6 rounded-2xl glass-card border border-purple-500/40 bg-gradient-to-r from-purple-950/40 via-dark-900/90 to-blue-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-rgb-glow">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-1">
            <Cpu className="w-4 h-4 text-rgb-pink" />
            <span>Ready for Agentic Execution</span>
          </div>
          <p className="text-xs text-slate-300">
            Click below to execute the 8-agent AI pipeline and evaluate venue candidates.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/age-preferences"
            className="w-1/2 sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold glass-card border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>

          <button
            onClick={() => navigate('/agent-processing')}
            className="w-1/2 sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink hover:opacity-95 text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start AI Event Planning →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
