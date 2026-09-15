import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Play, Layers } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

export default function VideoDemoPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-rgb-pink">Step 2 of 11</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-purple-300">Guided Walkthrough</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            SmartVenue AI System Demo
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Watch how the multi-agent pipeline processes requirements and selects ideal venues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-xs font-semibold glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Welcome</span>
          </Link>
          <Link
            to="/event-input"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rgb-blue to-rgb-purple text-white shadow-rgb-glow hover:opacity-90 flex items-center gap-1.5"
          >
            <span>Start Planning Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Video Container */}
      <VideoPlayer autoplay={true} onFinish={() => navigate('/event-input')} />

      {/* Demo Journey Steps Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rgb-purple" />
          <span>What You Will Experience in This Demo:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="p-1 rounded-md bg-blue-950 text-blue-400 font-bold font-mono">01</span>
            <div>
              <p className="font-semibold text-white">Event & Organizer Intake</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Input event date, Hyderabad location, 200 guests, and ₹1.5L budget.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="p-1 rounded-md bg-purple-950 text-purple-400 font-bold font-mono">02</span>
            <div>
              <p className="font-semibold text-white">Multi-Demographic Safety Guardrails</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Set kids play space and senior citizen wheelchair ramps.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="p-1 rounded-md bg-pink-950 text-pink-400 font-bold font-mono">03</span>
            <div>
              <p className="font-semibold text-white">8-Agent Orchestrated Reasoning</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Live execution across requirement, budget, accessibility & ranking agents.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="p-1 rounded-md bg-emerald-950 text-emerald-400 font-bold font-mono">04</span>
            <div>
              <p className="font-semibold text-white">Interactive 2D Spatial Floor Plan</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Blueprint preview displaying stage, seating, buffet, and quiet lounges.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav CTA */}
      <div className="flex justify-between items-center pt-4">
        <Link
          to="/"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Welcome Page
        </Link>

        <Link
          to="/event-input"
          className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>Continue to Event Input</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
