import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  Trash2, 
  ArrowLeft, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Users, 
  Star, 
  History, 
  Calendar, 
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import api from '../services/api';

export default function SavedVenuesPage() {
  const navigate = useNavigate();
  const { savedVenues, fetchSavedVenues, toggleSaveVenue, updateEventData } = useEventContext();
  const [historyItems, setHistoryItems] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchSavedVenues();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await api.getSearchHistory();
      setHistoryItems(data);
    } catch (err) {
      console.warn('Could not fetch search history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadPastSearch = (item) => {
    updateEventData({
      event_type: item.event_type,
      event_date: item.event_date,
      city: item.city,
      area: item.area || '',
      guests: item.guests,
      budget: item.budget,
      organizer_type: item.organizer_type,
      priorities: item.priorities || [],
      age_groups: item.age_groups || [],
      facilities: item.facilities || [],
      kids_count: item.kids_count || 0,
      additional_preferences: item.additional_preferences || ''
    });
    navigate('/summary');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-rgb-pink">Vault</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-purple-300">Saved Bookmarks & Search Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Saved Venues & Planning History
          </h1>
        </div>

        <Link
          to="/venues"
          className="px-3.5 py-1.5 rounded-lg text-xs font-medium glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Venues
        </Link>
      </div>

      {/* Section 1: Bookmarked Venues */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-rgb-pink" />
          <h2 className="text-lg font-bold text-white font-['Outfit']">
            Bookmarked Venues ({savedVenues.length})
          </h2>
        </div>

        {savedVenues.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400 space-y-2">
            <Bookmark className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-sm">No venues saved yet.</p>
            <Link to="/venues" className="text-xs text-rgb-blue underline inline-block pt-1">
              Explore and save candidate venues →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedVenues.map((item) => {
              const venue = item.venue;
              if (!venue) return null;

              return (
                <div
                  key={item.id}
                  className="glass-card-hover rounded-2xl overflow-hidden border border-slate-700/80 bg-dark-900/80 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] w-full bg-slate-950">
                    <img
                      src={venue.images && venue.images[0]}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{venue.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit']">{venue.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-rgb-blue" />
                        <span>{venue.city} • {venue.area}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-pink-400 font-mono font-bold">
                        ₹{venue.price_per_day?.toLocaleString()}/day
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/venue/${venue.id}`}
                          className="text-rgb-blue font-semibold hover:underline"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => toggleSaveVenue(venue.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 2: Search History Logs */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-rgb-purple" />
          <h2 className="text-lg font-bold text-white font-['Outfit']">
            Search & Planning History
          </h2>
        </div>

        {loadingHistory ? (
          <div className="p-6 text-center text-xs text-slate-500">Loading history logs...</div>
        ) : historyItems.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center text-xs text-slate-500">
            No past search logs recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {historyItems.map((hist) => (
              <div
                key={hist.id}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-['Outfit']">
                      {hist.event_type} in {hist.city}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-semibold border border-purple-500/40">
                      {hist.organizer_type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>{hist.guests} Guests</span>
                    <span>•</span>
                    <span className="text-pink-400 font-mono font-semibold">
                      ₹{hist.budget?.toLocaleString()}
                    </span>
                    <span>•</span>
                    <span>{new Date(hist.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => loadPastSearch(hist)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center gap-1.5 self-start sm:self-center transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rgb-blue" />
                  <span>Reload Scenario</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
