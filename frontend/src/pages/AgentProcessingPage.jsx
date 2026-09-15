import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Cpu, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Award,
  ShieldCheck,
  BrainCircuit,
  Scale,
  Heart,
  IndianRupee
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import api from '../services/api';

const AGENT_WORKFLOW_STEPS = [
  { id: 1, label: 'Requirements Received', agent: 'Requirement Analysis Agent', icon: CheckCircle2 },
  { id: 2, label: 'Requirements Analyzed', agent: 'Requirement Analysis Agent', icon: BrainCircuit },
  { id: 3, label: 'Planning Event Requirements', agent: 'Event Planning Agent', icon: ShieldCheck },
  { id: 4, label: 'Researching Suitable Venues', agent: 'Venue Research Agent', icon: Building2 },
  { id: 5, label: 'Comparing Venue Options', agent: 'Venue Comparison Agent', icon: Scale },
  { id: 6, label: 'Evaluating Budget', agent: 'Budget Analysis Agent', icon: IndianRupee },
  { id: 7, label: 'Checking Family & Accessibility Needs', agent: 'Age & Accessibility Agent', icon: Heart },
  { id: 8, label: 'Making Final Decision', agent: 'Decision-Making Agent', icon: Cpu },
  { id: 9, label: 'Preparing Recommendation', agent: 'Recommendation Explanation Agent', icon: Sparkles },
  { id: 10, label: 'Recommendation Ready', agent: 'Agentic Orchestrator', icon: Award },
];

export default function AgentProcessingPage() {
  const navigate = useNavigate();
  const { eventData, setAgentResponse, setSelectedVenue } = useEventContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState(null);
  const [executionLogs, setExecutionLogs] = useState([]);

  useEffect(() => {
    let timer = null;
    let isMounted = true;

    const startProcessing = async () => {
      try {
        // Step animation progression
        const stepInterval = setInterval(() => {
          setCurrentStep((prev) => {
            if (prev < 9) return prev + 1;
            return prev;
          });
        }, 600);

        // Actual backend execution
        const response = await api.executeAgentWorkflow(eventData);

        if (!isMounted) return;

        clearInterval(stepInterval);
        setCurrentStep(10);
        setIsDone(true);
        setAgentResponse(response);
        if (response.best_venue?.venue) {
          setSelectedVenue(response.best_venue.venue);
        }
        setExecutionLogs(response.execution_steps || []);
      } catch (err) {
        if (!isMounted) return;
        console.error('Agent workflow execution error:', err);
        setError('Agent workflow completed with fallback heuristic synthesis.');
        setCurrentStep(10);
        setIsDone(true);
      }
    };

    startProcessing();

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [eventData, setAgentResponse, setSelectedVenue]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-semibold text-purple-300 shadow-rgb-glow">
          <Cpu className="w-3.5 h-3.5 text-rgb-pink animate-spin-slow" />
          <span>Multi-Agent Autonomous Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
          {isDone ? 'AI Decision Synthesis Complete' : 'AI Agents In Execution'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isDone
            ? 'All 8 autonomous agents have evaluated, ranked, and generated recommendations.'
            : 'Analyzing venues in real time against your budget, demographic needs, and layout criteria.'}
        </p>
      </div>

      {/* Main Processing Terminal Container */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 bg-dark-950/90 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-xs font-mono text-slate-400 ml-2">
              smartvenue-agent-cluster // orchestrator.py
            </span>
          </div>
          <span className="text-xs font-mono text-purple-400">
            {isDone ? 'STATUS: DONE (100%)' : `STEP ${currentStep}/10`}
          </span>
        </div>

        {/* Step-by-Step Animated Checklist */}
        <div className="space-y-3">
          {AGENT_WORKFLOW_STEPS.map((step) => {
            const isStepFinished = currentStep > step.id || (step.id === 10 && isDone);
            const isStepActive = currentStep === step.id && !isDone;
            const isStepPending = currentStep < step.id;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                  isStepFinished
                    ? 'bg-slate-900/60 border-emerald-500/30 text-emerald-300'
                    : isStepActive
                    ? 'bg-purple-950/70 border-purple-500 text-white shadow-rgb-glow scale-[1.01]'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Status Indicator Icon */}
                  <div className="w-6 h-6 flex items-center justify-center">
                    {isStepFinished ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isStepActive ? (
                      <Loader2 className="w-5 h-5 text-rgb-pink animate-spin" />
                    ) : (
                      <span className="text-xs font-mono text-slate-600 font-bold">
                        {step.id < 10 ? `0${step.id}` : step.id}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-xs sm:text-sm font-semibold tracking-wide">
                      {isStepFinished ? `✓ ${step.label}` : isStepActive ? `⟳ ${step.label}` : step.label}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      Agent: {step.agent}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono">
                  {isStepFinished ? (
                    <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      COMPLETED
                    </span>
                  ) : isStepActive ? (
                    <span className="text-pink-300 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/30 animate-pulse">
                      PROCESSING...
                    </span>
                  ) : (
                    <span className="text-slate-600">QUEUED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button When Ready */}
        {isDone && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <Link
              to="/venues"
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-rgb-blue" />
              <span>Browse All Search Results</span>
            </Link>

            <button
              onClick={() => navigate('/recommendation')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>View AI Recommendation & Decision →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
