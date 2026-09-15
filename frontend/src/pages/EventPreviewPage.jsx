import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Map, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Layers, 
  CheckCircle2, 
  Check, 
  Compass, 
  FileText 
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import FloorPlanPreview from '../components/FloorPlanPreview';
import api from '../services/api';

export default function EventPreviewPage() {
  const navigate = useNavigate();
  const { eventData, selectedVenue, agentResponse } = useEventContext();

  const [layoutData, setLayoutData] = useState(null);
  const [loading, setLoading] = useState(true);

  const venueToUse = selectedVenue || agentResponse?.best_venue?.venue || { id: 1, name: 'Grand Imperial Convention' };

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        setLoading(true);
        const res = await api.generatePreviewLayout(eventData, venueToUse.id);
        setLayoutData(res);
      } catch (err) {
        console.error('Error fetching preview layout:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLayout();
  }, [eventData, venueToUse.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-rgb-blue">Step 10 of 11</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-pink-300">Spatial Experience Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            AI Event Experience Preview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Visualizing dynamic spatial organization inside {venueToUse.name} tailored for {eventData.guests} guests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recommendation"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> AI Recommendation
          </Link>

          <Link
            to="/final-plan"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <span>Generate Final Event Plan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Floor Plan Component */}
      {loading ? (
        <div className="py-24 text-center glass-card rounded-2xl max-w-4xl mx-auto my-12">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-rgb-purple animate-spin-slow" />
          <p className="text-slate-400 text-sm">Generating intelligent 2D architectural blueprint...</p>
        </div>
      ) : (
        <FloorPlanPreview layoutData={layoutData} venueName={venueToUse.name} />
      )}

      {/* Bottom Nav CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <Link to="/recommendation" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to AI Decision
        </Link>

        <Link
          to="/final-plan"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rgb-blue via-rgb-purple to-rgb-pink text-white shadow-rgb-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Proceed to Final Event Plan →</span>
        </Link>
      </div>
    </div>
  );
}
