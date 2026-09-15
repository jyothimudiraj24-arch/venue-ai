import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Bookmark, RotateCcw, Cpu, Layers } from 'lucide-react';
import { useEventContext } from '../context/EventContext';

export default function Navbar() {
  const location = useLocation();
  const { savedVenues, resetToDemoDefaults, eventData } = useEventContext();

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 backdrop-blur-xl bg-dark-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rgb-blue via-rgb-purple to-rgb-pink p-0.5 shadow-rgb-glow transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rgb-purple group-hover:text-rgb-pink transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-['Outfit']">
                SmartVenue <span className="rgb-gradient-text">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300">
                Agentic AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Event Planning & Venue Decision System</p>
          </div>
        </Link>

        {/* Quick Nav Links & Badges */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/venues"
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              location.pathname === '/venues'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-4 h-4 text-rgb-blue" />
            <span className="hidden md:inline">Venue Explorer</span>
          </Link>

          <Link
            to="/compare"
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              location.pathname === '/compare'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Cpu className="w-4 h-4 text-rgb-purple" />
            <span className="hidden md:inline">Comparison</span>
          </Link>

          <Link
            to="/saved"
            className={`relative px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              location.pathname === '/saved'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Bookmark className="w-4 h-4 text-rgb-pink" />
            <span>Saved</span>
            {savedVenues.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rgb-pink text-white">
                {savedVenues.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => {
              if (window.confirm('Reset event data to default sample scenario (Hyderabad Wedding)?')) {
                resetToDemoDefaults();
              }
            }}
            title="Reset to sample wedding demo state"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {!isHome && (
            <Link
              to="/event-input"
              className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-rgb-blue to-rgb-purple hover:from-blue-600 hover:to-purple-600 text-white shadow-rgb-glow transition-all hover:scale-[1.02]"
            >
              Plan Event
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
