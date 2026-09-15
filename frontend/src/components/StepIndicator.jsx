import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Video, 
  Calendar, 
  Users, 
  FileCheck, 
  Cpu, 
  Building2, 
  Scale, 
  Award, 
  Map, 
  CheckCircle2 
} from 'lucide-react';

const STEPS = [
  { path: '/', label: 'Welcome', icon: Home },
  { path: '/demo', label: 'Video Demo', icon: Video },
  { path: '/event-input', label: 'Event Details', icon: Calendar },
  { path: '/age-preferences', label: 'Age & Facilities', icon: Users },
  { path: '/summary', label: 'Summary', icon: FileCheck },
  { path: '/agent-processing', label: 'AI Agents', icon: Cpu },
  { path: '/venues', label: 'Venues', icon: Building2 },
  { path: '/compare', label: 'Comparison', icon: Scale },
  { path: '/recommendation', label: 'Recommendation', icon: Award },
  { path: '/preview', label: 'Event Preview', icon: Map },
  { path: '/final-plan', label: 'Final Plan', icon: CheckCircle2 },
];

export default function StepIndicator() {
  const location = useLocation();

  const currentStepIndex = STEPS.findIndex((s) => s.path === location.pathname);

  // If on a subpage like /venue/:id, approximate step 6 (Venues)
  const activeIndex = currentStepIndex !== -1 ? currentStepIndex : (location.pathname.startsWith('/venue/') ? 6 : 0);

  return (
    <div className="w-full bg-dark-950/60 border-b border-slate-800/60 py-3 overflow-x-auto scrollbar-none no-print">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between min-w-[850px] gap-1">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isPassed = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <React.Fragment key={step.path}>
              <Link
                to={step.path}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-rgb-blue to-rgb-purple text-white shadow-rgb-glow font-semibold scale-105'
                    : isPassed
                    ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : isPassed ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{step.label}</span>
              </Link>

              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 min-w-[12px] rounded-full ${
                    idx < activeIndex ? 'bg-emerald-500/60' : 'bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
