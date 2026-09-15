import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  Smile, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Accessibility, 
  Building2,
  Info
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';

const AGE_GROUPS = [
  { id: 'Kids', label: 'Kids (0 - 12 yrs)', icon: Smile, desc: 'Requires soft play zones, childproof safety, & kid menus' },
  { id: 'Teenagers', label: 'Teenagers (13 - 19 yrs)', icon: Sparkles, desc: 'Enjoys DJ, photo booths, and active social areas' },
  { id: 'Adults', label: 'Adults (20 - 59 yrs)', icon: Users, desc: 'Standard banquet dining, cocktails, and networking' },
  { id: 'Senior Citizens', label: 'Senior Citizens (60+ yrs)', icon: Heart, desc: 'Requires wheelchair ramps, lifts, quiet lounges, & low-spice dining' },
];

const FACILITIES_LIST = [
  'Parking', 'Catering', 'Stage', 'Decoration', 
  'Music/DJ', 'Projector', 'Wi-Fi', 'Air Conditioning', 
  'Outdoor Area', 'Indoor Hall', 'Kids Area', 
  'Senior Rest Area', 'Wheelchair Accessibility'
];

export default function AgePreferencesPage() {
  const navigate = useNavigate();
  const { eventData, updateEventData, toggleAgeGroup, toggleFacility } = useEventContext();

  const isKidsSelected = eventData.age_groups?.includes('Kids');
  const isSeniorsSelected = eventData.age_groups?.includes('Senior Citizens');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventData.age_groups || eventData.age_groups.length === 0) {
      alert('Please select at least one attending age group.');
      return;
    }
    navigate('/summary');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-rgb-purple">Step 4 of 11</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-pink-300">Demographics & Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Guest Preferences & Facilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Specify demographic requirements to activate specialized safety and comfort agents.
          </p>
        </div>

        <Link
          to="/event-input"
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Event Details
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Age Groups */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-5 h-5 text-rgb-purple" />
            <span>Attending Age Groups</span>
          </h2>
          <p className="text-xs text-slate-400">
            Select all demographic cohorts who will attend this {eventData.event_type}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AGE_GROUPS.map((group) => {
              const Icon = group.icon;
              const isSelected = eventData.age_groups?.includes(group.id);

              return (
                <div
                  key={group.id}
                  onClick={() => toggleAgeGroup(group.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-purple-950/70 border-purple-500 text-white shadow-rgb-glow'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{group.label}</h4>
                      {isSelected && <Check className="w-4 h-4 text-rgb-pink" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{group.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conditional Sub-panel: Kids Preferences */}
          {isKidsSelected && (
            <div className="mt-4 p-4 rounded-xl bg-pink-950/30 border border-pink-500/30 space-y-3">
              <div className="flex items-center gap-2 text-pink-300 text-xs font-semibold">
                <Smile className="w-4 h-4" />
                <span>Child Safety & Entertainment Ingestion</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Approximate Number of Kids</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={eventData.kids_count || 20}
                    onChange={(e) => updateEventData({ kids_count: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex items-center">
                  💡 The AI Planning Agent will allocate dedicated safe activity perimeters and child-safe catering items.
                </div>
              </div>
            </div>
          )}

          {/* Conditional Sub-panel: Senior Citizen Preferences */}
          {isSeniorsSelected && (
            <div className="mt-4 p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-3">
              <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold">
                <Accessibility className="w-4 h-4" />
                <span>Universal Accessibility & Senior Comfort Protocols</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                <span className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">✓ Wheelchair Ramps</span>
                <span className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">✓ Elevators / Lifts</span>
                <span className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">✓ Accessible Toilets</span>
                <span className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">✓ Padded Seating</span>
                <span className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">✓ Valet Drop-off</span>
                <span className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">✓ Quiet Rest Lounge</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Required Facilities */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-5 h-5 text-rgb-pink" />
            <span>Required Facilities (Select all that apply)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Venues matching these facilities will be scored with higher priority by the Research Agent.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {FACILITIES_LIST.map((fac) => {
              const isSelected = eventData.facilities?.includes(fac);
              return (
                <button
                  type="button"
                  key={fac}
                  onClick={() => toggleFacility(fac)}
                  className={`p-3 rounded-xl text-left border text-xs font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-rgb-blue/40 to-rgb-purple/40 border-purple-500 text-white shadow-rgb-glow scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{fac}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-rgb-pink shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Additional Preferences */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2 border-b border-slate-800 pb-3">
            <Info className="w-5 h-5 text-rgb-blue" />
            <span>Additional Preferences (Optional)</span>
          </h2>
          <textarea
            rows="3"
            value={eventData.additional_preferences || ''}
            onChange={(e) => updateEventData({ additional_preferences: e.target.value })}
            placeholder="e.g. Prefer grand floral stage decorations, sound-isolated seating for grandparents, and organic vegetarian dining."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            to="/event-input"
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Event Details
          </Link>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue → Review Requirements</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
