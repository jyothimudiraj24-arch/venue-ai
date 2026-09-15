import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Users, 
  IndianRupee, 
  Star, 
  Scale, 
  Bookmark, 
  Filter, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Award,
  Eye
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import api from '../services/api';

export default function VenueResultsPage() {
  const navigate = useNavigate();
  const { 
    eventData, 
    compareVenueIds, 
    toggleCompareVenue, 
    toggleSaveVenue, 
    isVenueSaved, 
    setSelectedVenue 
  } = useEventContext();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState(eventData.city || 'Hyderabad');
  const [typeFilter, setTypeFilter] = useState('All');
  const [maxBudgetFilter, setMaxBudgetFilter] = useState(eventData.budget || 200000);
  const [minGuestsFilter, setMinGuestsFilter] = useState(eventData.guests || 200);

  useEffect(() => {
    fetchFilteredVenues();
  }, [cityFilter, typeFilter, maxBudgetFilter, minGuestsFilter]);

  const fetchFilteredVenues = async () => {
    try {
      setLoading(true);
      const results = await api.searchVenues({
        city: cityFilter,
        venue_type: typeFilter === 'All' ? null : typeFilter,
        max_budget: maxBudgetFilter,
        guests: minGuestsFilter,
        facilities: eventData.facilities
      });
      setVenues(results);
    } catch (err) {
      console.error('Error searching venues:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-rgb-blue">Step 7 of 11</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-purple-300">Venue Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Venue Search Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Retrieved and ranked venues matching {eventData.event_type} specifications in {cityFilter}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/compare"
            className="px-4 py-2 rounded-xl text-xs font-semibold glass-card-hover border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-rgb-purple" />
            <span>Compare Selected ({compareVenueIds.length})</span>
          </Link>

          <Link
            to="/recommendation"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rgb-blue to-rgb-purple text-white shadow-rgb-glow hover:opacity-90 flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>AI Recommendation →</span>
          </Link>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-card rounded-2xl p-5 border border-slate-700/80 bg-dark-900/90 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <Filter className="w-4 h-4 text-rgb-pink" />
          <span>Interactive Catalog Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* City */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-semibold uppercase">City</label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="All">All Cities</option>
            </select>
          </div>

          {/* Venue Type */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-semibold uppercase">Venue Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Venue Types</option>
              <option value="Convention Center">Convention Center</option>
              <option value="Banquet Hall">Banquet Hall</option>
              <option value="Heritage Palace">Heritage Palace & Lawn</option>
              <option value="5-Star Hotel">5-Star Hotel</option>
              <option value="Resort">Resort</option>
              <option value="Rooftop">Rooftop & Lounge</option>
            </select>
          </div>

          {/* Max Daily Budget */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-semibold uppercase">
              Max Daily Rental: ₹{maxBudgetFilter?.toLocaleString()}
            </label>
            <input
              type="range"
              min="50000"
              max="400000"
              step="10000"
              value={maxBudgetFilter}
              onChange={(e) => setMaxBudgetFilter(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rgb-purple"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-semibold uppercase">
              Min Guest Capacity: {minGuestsFilter}
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={minGuestsFilter}
              onChange={(e) => setMinGuestsFilter(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rgb-blue"
            />
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      {loading ? (
        <div className="py-20 text-center glass-card rounded-2xl">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-rgb-purple animate-spin-slow" />
          <p className="text-slate-400 text-sm">Searching verified venue catalog...</p>
        </div>
      ) : venues.length === 0 ? (
        <div className="py-16 text-center glass-card rounded-2xl p-8 space-y-4">
          <Building2 className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-white">No matching venues found</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            “No matching venues found. Try changing your budget, location, or guest count.”
          </p>
          <button
            onClick={() => {
              setCityFilter('Hyderabad');
              setTypeFilter('All');
              setMaxBudgetFilter(250000);
              setMinGuestsFilter(100);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-900/60 border border-purple-500 text-purple-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => {
            const isCompared = compareVenueIds.includes(venue.id);
            const isSaved = isVenueSaved(venue.id);

            return (
              <div
                key={venue.id}
                className="glass-card-hover rounded-2xl overflow-hidden border border-slate-700/80 bg-dark-900/80 flex flex-col justify-between group"
              >
                {/* Venue Thumbnail & Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <img
                    src={venue.images && venue.images.length > 0 ? venue.images[0] : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                    alt={venue.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {venue.is_demo_data && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-slate-950 uppercase shadow-sm">
                        Demo Data
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md text-slate-200 border border-slate-700">
                      {venue.venue_type}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleSaveVenue(venue.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      isSaved
                        ? 'bg-pink-600 text-white shadow-rgb-glow-pink'
                        : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/90'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save / Bookmark Venue'}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {/* Rating Pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{venue.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({venue.review_count})</span>
                  </div>
                </div>

                {/* Venue Details Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white font-['Outfit'] group-hover:text-rgb-purple transition-colors">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rgb-blue shrink-0" />
                      <span className="truncate">{venue.city} • {venue.area}</span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Capacity</span>
                      <span className="font-bold text-slate-200 font-mono flex items-center gap-1">
                        <Users className="w-3 h-3 text-rgb-blue" />
                        {venue.capacity_min} - {venue.capacity_max} pax
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Daily Rental</span>
                      <span className="font-bold text-pink-400 font-mono flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        ₹{venue.price_per_day?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Facility Chips */}
                  <div className="flex flex-wrap gap-1">
                    {venue.facilities.slice(0, 4).map((fac, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 border border-slate-700/60 text-slate-300"
                      >
                        {fac}
                      </span>
                    ))}
                    {venue.facilities.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-mono">
                        +{venue.facilities.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => toggleCompareVenue(venue.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        isCompared
                          ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'Comparing ✓' : 'Compare'}</span>
                    </button>

                    <Link
                      to={`/venue/${venue.id}`}
                      onClick={() => setSelectedVenue(venue)}
                      className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-rgb-blue" />
                      <span>Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Compare Action Bar if venues are chosen */}
      {compareVenueIds.length > 0 && (
        <div className="sticky bottom-4 z-40 max-w-2xl mx-auto glass-card border border-purple-500/50 p-4 rounded-2xl shadow-rgb-glow flex items-center justify-between gap-4 bg-dark-950/95 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-rgb-pink" />
            <span className="text-xs sm:text-sm font-bold text-white">
              {compareVenueIds.length} venue(s) selected for side-by-side comparison
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/compare"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rgb-blue to-rgb-purple text-white shadow-md hover:scale-105 transition-transform"
            >
              Compare Now →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
