import React from 'react';
import { Sparkles, ShieldCheck, Database, Cpu, Brain, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-card border-t border-slate-800/80 mt-20 pt-12 pb-8 bg-dark-950/90 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1 */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rgb-blue to-rgb-pink p-0.5">
                <div className="w-full h-full bg-dark-950 rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rgb-purple" />
                </div>
              </div>
              <span className="font-bold text-base text-white font-['Outfit']">SmartVenue AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An academic mini-project pioneering Agentic AI workflow orchestration for multi-dimensional event planning and venue decision-making.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-md w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Dataset Mode • 100% Offline Reliable</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">8 AI Agents</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="hover:text-slate-200">1. Requirement Analysis Agent</li>
              <li className="hover:text-slate-200">2. Event Planning Agent</li>
              <li className="hover:text-slate-200">3. Venue Research Agent</li>
              <li className="hover:text-slate-200">4. Venue Comparison Agent</li>
              <li className="hover:text-slate-200">5. Age & Accessibility Agent</li>
              <li className="hover:text-slate-200">6. Budget Analysis Agent</li>
              <li className="hover:text-slate-200">7. Decision-Making Agent</li>
              <li className="hover:text-slate-200">8. Recommendation Explanation Agent</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Technology Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] text-blue-300">React.js + Vite</span>
              <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] text-purple-300">Tailwind CSS (RGB)</span>
              <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] text-pink-300">FastAPI (Python)</span>
              <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] text-emerald-300">SQLAlchemy + SQLite</span>
              <span className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] text-amber-300">Agentic Orchestrator</span>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Academic Mini-Project</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Designed to showcase end-to-end intelligent decision synthesis with real-time floor plan layout generation, senior citizen accommodations, and budget variance tracking.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Academic Submission • 2026
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 SmartVenue AI System. All sample datasets are for academic demonstration purposes.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-rgb-blue" /> Multi-Agent Engine</span>
            <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5 text-rgb-purple" /> SQLite DB</span>
            <span className="flex items-center gap-1"><Brain className="w-3.5 h-3.5 text-rgb-pink" /> Heuristic + LLM Dual Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
