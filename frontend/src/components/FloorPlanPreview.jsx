import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  Utensils, 
  Car, 
  ShieldCheck, 
  Heart, 
  Smile, 
  Armchair, 
  Info, 
  Compass, 
  Layers,
  ArrowRight,
  Maximize2
} from 'lucide-react';

const ICON_MAP = {
  Stage: Sparkles,
  Users: Users,
  Utensils: Utensils,
  Car: Car,
  UserCheck: ShieldCheck,
  Sparkles: Smile,
  Armchair: Armchair,
};

export default function FloorPlanPreview({ layoutData, venueName = "Grand Imperial Convention" }) {
  const [selectedZone, setSelectedZone] = useState(null);

  if (!layoutData || !layoutData.zones) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl text-slate-400">
        <Compass className="w-10 h-10 mx-auto mb-3 text-rgb-purple animate-spin-slow" />
        <p>Loading interactive 2D event layout simulation...</p>
      </div>
    );
  }

  const activeZone = selectedZone || layoutData.zones[0];
  const ActiveIcon = ICON_MAP[activeZone.icon] || Layers;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-700/80 bg-gradient-to-r from-slate-900/90 via-dark-900/90 to-slate-900/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rgb-pink" />
              Dynamic Spatial Architecture
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Total Area: ~{layoutData.total_area_sqft?.toLocaleString()} sq.ft
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
            {venueName} — Intelligent Event Floor Experience
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Interactive 2D multi-zone blueprint optimized for {layoutData.guest_count} guests with barrier-free flows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Layout: {layoutData.event_type}</span>
          </div>
        </div>
      </div>

      {/* Blueprint Grid + Interactive Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2D Canvas Map (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 border border-slate-700/80 bg-dark-950 relative overflow-hidden">
          {/* Blueprint Grid Watermark Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px), radial-gradient(#3b82f6 1px, #070913 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px'
            }}
          />

          {/* Hall Boundary Container */}
          <div className="relative aspect-[4/3] w-full border-2 border-dashed border-slate-700/80 rounded-xl p-4 flex flex-col justify-between bg-dark-900/70">
            {/* North Indicator */}
            <div className="absolute top-2 right-3 flex items-center gap-1 text-[10px] font-mono text-slate-500 uppercase">
              <Compass className="w-3.5 h-3.5 text-rgb-blue" />
              <span>North Entrance</span>
            </div>

            {/* Render Absolute Positioned Zones */}
            {layoutData.zones.map((zone) => {
              const Icon = ICON_MAP[zone.icon] || Layers;
              const isSelected = activeZone.id === zone.id;

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                    borderColor: isSelected ? '#ec4899' : `${zone.color}80`,
                    backgroundColor: isSelected ? `${zone.color}35` : `${zone.color}18`,
                    boxShadow: isSelected ? `0 0 20px ${zone.color}60` : 'none',
                  }}
                  className={`absolute rounded-xl border-2 p-2 sm:p-3 cursor-pointer transition-all duration-300 flex flex-col justify-between backdrop-blur-sm group hover:scale-[1.02] hover:z-20 ${
                    isSelected ? 'z-30 scale-[1.02]' : 'z-10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="p-1 rounded-md text-white shadow-sm"
                      style={{ backgroundColor: zone.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {zone.capacity && (
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-black/60 text-slate-200">
                        {zone.capacity} pax
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-rgb-pink transition-colors">
                      {zone.name}
                    </h4>
                    <p className="text-[10px] text-slate-300 line-clamp-1 hidden sm:block">
                      {zone.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Center Flow Axis Arrow Simulation */}
            <div className="absolute inset-x-1/2 top-[32%] bottom-[20%] w-0.5 border-l border-dashed border-purple-500/40 pointer-events-none flex flex-col items-center justify-center">
              <span className="bg-purple-950/80 border border-purple-500/40 text-[9px] text-purple-300 px-1 rounded transform -rotate-90">
                Aisle
              </span>
            </div>
          </div>

          {/* Interactive Instructions */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>💡 Click on any zone box above to inspect seating, equipment, & safety protocols.</span>
            <span className="font-mono text-emerald-400">Universal Ramp Flow: Enabled</span>
          </div>
        </div>

        {/* Zone Details Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-slate-700/80 bg-dark-900/90 h-full flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div 
                  className="p-3 rounded-xl text-white shadow-rgb-glow"
                  style={{ backgroundColor: activeZone.color }}
                >
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Zone Inspector
                  </span>
                  <h4 className="text-lg font-bold text-white font-['Outfit']">
                    {activeZone.name}
                  </h4>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeZone.description}
                </p>

                {activeZone.capacity && (
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Allocated Zone Capacity:</span>
                    <span className="text-sm font-bold text-white font-mono">{activeZone.capacity} Guests</span>
                  </div>
                )}

                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Key Zone Amenities & Setup
                  </h5>
                  <div className="space-y-1.5">
                    {activeZone.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        <ArrowRight className="w-3 h-3 text-rgb-pink shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Demographic Highlights Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Smart Multi-Gen Positioning</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Senior rest lounge and kids activity zones are placed along quiet perimeters with zero obstruction to buffet pathways.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Flow & Accessibility Notes Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-rgb-blue" />
            <span>Traffic & Guest Circulation Flow</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {layoutData.smart_flow_notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rgb-blue font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>Accessibility & Multi-Gen Guidelines</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {layoutData.accessibility_notes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
