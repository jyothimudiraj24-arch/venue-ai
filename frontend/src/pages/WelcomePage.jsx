import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Heart, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Building2,
  Users
} from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 text-center max-w-5xl mx-auto px-4">
        {/* Glow ambient circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/40 text-xs sm:text-sm font-semibold text-purple-300 shadow-rgb-glow mb-6">
          <Sparkles className="w-4 h-4 text-rgb-pink" />
          <span>Next-Generation Autonomous Event Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-['Outfit']">
          Welcome to <span className="rgb-gradient-text">SmartVenue AI</span>
        </h1>

        <p className="mt-4 text-lg sm:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
          Your Intelligent AI Assistant for Smarter Event Planning & Venue Decision-Making
        </p>

        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Powered by an orchestrated multi-agent AI pipeline that understands your budget, demographic needs, senior mobility, and child safety to select and configure the ultimate venue.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/demo"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink hover:opacity-95 text-white shadow-rgb-glow flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>▶ Watch Video Demo</span>
          </Link>

          <Link
            to="/event-input"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base glass-card-hover border border-slate-700 text-white flex items-center justify-center gap-2"
          >
            <span>Skip Demo → Start Planning</span>
            <ArrowRight className="w-4 h-4 text-rgb-pink" />
          </Link>
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] rgb-gradient-text">8</div>
            <div className="text-xs text-slate-400 mt-0.5">Specialized AI Agents</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Multi-Gen Accessibility</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] text-rgb-blue">2D Blueprint</div>
            <div className="text-xs text-slate-400 mt-0.5">Spatial Flow Preview</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] text-pink-400">₹0 Overrun</div>
            <div className="text-xs text-slate-400 mt-0.5">Variance-Guarded Budget</div>
          </div>
        </div>
      </section>

      {/* Interactive Video Showcase Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-wider font-semibold text-rgb-purple">Interactive Walkthrough</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit'] mt-1">
            Experience SmartVenue AI In Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-1">
            Watch the automated 11-step journey from wedding requirement ingestion to 2D floor zoning.
          </p>
        </div>

        <VideoPlayer onFinish={() => navigate('/event-input')} />

        <div className="mt-4 text-center">
          <Link
            to="/event-input"
            className="inline-flex items-center gap-2 text-sm font-bold text-rgb-pink hover:text-white transition-colors"
          >
            <span>Ready to plan your event? Launch Planning Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center">
          <span className="text-xs uppercase tracking-wider font-semibold text-rgb-blue">Agentic AI Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit'] mt-1">
            Why SmartVenue AI is Truly Agentic
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-1">
            Not just a static chatbot. A coordinated pipeline of autonomous domain agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-rgb-blue">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Multi-Agent Orchestration
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              8 domain-expert agents decompose requirements, query the catalog, calculate multi-dimensional scores, and reason about trade-offs.
            </p>
            <div className="text-[11px] text-blue-300 font-mono flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sequential reasoning graph
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-rgb-purple">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Multi-Generational Care
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deep demographic safety algorithms that audit wheelchair ramps, senior rest lounges, noise damping, and child-safe play perimeters.
            </p>
            <div className="text-[11px] text-purple-300 font-mono flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero-barrier comfort scores
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-rgb-pink">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              2D Spatial Experience Preview
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates an architectural 2D floor blueprint indicating stage, seating, buffet, kids zone, and valet drop-offs adapted to guest counts.
            </p>
            <div className="text-[11px] text-pink-300 font-mono flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Dynamic architectural layout
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
