import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  IndianRupee, 
  Building, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Tag
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';

const EVENT_TYPES = [
  'Wedding', 'Birthday', 'Engagement', 'Conference', 
  'Corporate Meeting', 'College Event', 'Party', 
  'Exhibition', 'Cultural Event', 'Family Function', 'Other'
];

const ORGANIZER_TYPES = [
  'Individual', 'Family', 'College/Student Group', 
  'Company', 'Event Management Company', 
  'Community Organization', 'Government/Institution'
];

const PRIORITIES = [
  'Low Budget', 'Premium Experience', 'Large Capacity', 
  'Accessibility', 'Best Location', 'Family Friendly', 
  'Luxury', 'Entertainment', 'Professional Setup'
];

const POPULAR_CITIES = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Pune'];

export default function EventInputPage() {
  const navigate = useNavigate();
  const { eventData, updateEventData, togglePriority } = useEventContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventData.event_type || !eventData.city || !eventData.guests || !eventData.budget) {
      alert('Please fill out all required event details.');
      return;
    }
    navigate('/age-preferences');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-rgb-blue">Step 3 of 11</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-purple-300">Basic Parameters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Tell Us About Your Event
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Provide the foundational requirements to calibrate the Agentic AI decision engine.
          </p>
        </div>

        <Link
          to="/demo"
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Demo
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Event Details */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calendar className="w-5 h-5 text-rgb-blue" />
            <span>Event Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Event Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Event Type <span className="text-pink-500">*</span>
              </label>
              <select
                value={eventData.event_type}
                onChange={(e) => updateEventData({ event_type: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                required
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={eventData.event_date || ''}
                onChange={(e) => updateEventData({ event_date: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                City <span className="text-pink-500">*</span>
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={eventData.city}
                  onChange={(e) => updateEventData({ city: e.target.value })}
                  placeholder="e.g. Hyderabad"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
                {/* Popular City Quick Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CITIES.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => updateEventData({ city: c })}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                        eventData.city === c
                          ? 'bg-purple-950 border-purple-500 text-purple-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Area / Preferred Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Area / Preferred Location
              </label>
              <input
                type="text"
                value={eventData.area || ''}
                onChange={(e) => updateEventData({ area: e.target.value })}
                placeholder="e.g. Banjara Hills, Gachibowli, Madhapur"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Guest Count & Budget Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* Number of Guests */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-rgb-blue" />
                  <span>Number of Guests</span>
                </label>
                <span className="font-mono text-base font-bold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                  {eventData.guests} Guests
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="1200"
                step="10"
                value={eventData.guests}
                onChange={(e) => updateEventData({ guests: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rgb-blue"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>20 Intimate</span>
                <span>200 Standard</span>
                <span>1200+ Grand</span>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-pink-400" />
                  <span>Total Budget</span>
                </label>
                <span className="font-mono text-base font-bold text-pink-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                  ₹{eventData.budget?.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="30000"
                max="1000000"
                step="10000"
                value={eventData.budget}
                onChange={(e) => updateEventData({ budget: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rgb-pink"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>₹30K Low</span>
                <span>₹1.5L Target</span>
                <span>₹10L+ Luxury</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Organizer Type */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-5 h-5 text-rgb-purple" />
            <span>Organizer Type</span>
          </h2>
          <p className="text-xs text-slate-400">
            Tell the AI agent who is hosting this event so it can customize hospitality expectations.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ORGANIZER_TYPES.map((org) => {
              const isSelected = eventData.organizer_type === org;
              return (
                <button
                  type="button"
                  key={org}
                  onClick={() => updateEventData({ organizer_type: org })}
                  className={`p-3 rounded-xl text-left border text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-950/80 border-purple-500 text-white shadow-rgb-glow scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{org}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-rgb-pink shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Main Priorities */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-3">
            <Tag className="w-5 h-5 text-rgb-pink" />
            <span>Main Priorities (Select all that apply)</span>
          </h2>
          <p className="text-xs text-slate-400">
            These priorities directly weight the Decision-Making Agent's mathematical score vectors.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {PRIORITIES.map((p) => {
              const isSelected = eventData.priorities?.includes(p);
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => togglePriority(p)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-rgb-blue to-rgb-purple border-purple-400 text-white shadow-rgb-glow'
                      : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-600'}`} />
                  <span>{p}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            to="/demo"
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Demo
          </Link>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue → Guest Preferences & Facilities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
