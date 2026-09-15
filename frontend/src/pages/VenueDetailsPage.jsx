import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  IndianRupee, 
  Star, 
  ShieldCheck, 
  Heart, 
  Smile, 
  Building2, 
  Phone, 
  Mail, 
  Bookmark, 
  Scale, 
  Award, 
  Sparkles,
  CheckCircle2,
  Video
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import api from '../services/api';

export default function VenueDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    compareVenueIds, 
    toggleCompareVenue, 
    toggleSaveVenue, 
    isVenueSaved, 
    setSelectedVenue 
  } = useEventContext();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const data = await api.getVenueDetails(id);
        setVenue(data);
        setSelectedVenue(data);
      } catch (err) {
        console.error('Error fetching venue details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id, setSelectedVenue]);

  if (loading) {
    return (
      <div className="py-24 text-center glass-card rounded-2xl max-w-4xl mx-auto my-12">
        <Sparkles className="w-10 h-10 mx-auto mb-3 text-rgb-purple animate-spin-slow" />
        <p className="text-slate-400 text-sm">Loading venue dossier...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="py-24 text-center glass-card rounded-2xl max-w-4xl mx-auto my-12 space-y-4">
        <Building2 className="w-12 h-12 mx-auto text-slate-600" />
        <h3 className="text-lg font-bold text-white">Venue not found</h3>
        <Link to="/venues" className="text-xs text-rgb-blue underline">
          Back to Venue Search Results
        </Link>
      </div>
    );
  }

  const isCompared = compareVenueIds.includes(venue.id);
  const isSaved = isVenueSaved(venue.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/venues"
            className="p-2 rounded-xl glass-card border border-slate-700 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold text-rgb-blue">{venue.venue_type}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-[10px] uppercase font-bold bg-amber-500/80 text-black px-2 py-0.5 rounded">
                Demo Profile
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              {venue.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => toggleSaveVenue(venue.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isSaved
                ? 'bg-pink-600 border-pink-500 text-white shadow-rgb-glow-pink'
                : 'glass-card border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{isSaved ? 'Saved' : 'Save Venue'}</span>
          </button>

          <button
            onClick={() => toggleCompareVenue(venue.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isCompared
                ? 'bg-purple-950 border-purple-500 text-purple-200 shadow-rgb-glow'
                : 'glass-card border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isCompared ? 'In Comparison ✓' : 'Add to Compare'}</span>
          </button>

          <Link
            to="/recommendation"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rgb-blue to-rgb-purple text-white shadow-rgb-glow hover:opacity-95 flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>AI Decision Matrix</span>
          </Link>
        </div>
      </div>

      {/* Gallery & Quick Specs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden glass-card border border-slate-700 bg-dark-950">
            <img
              src={venue.images[selectedImageIndex] || venue.images[0]}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-amber-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{venue.rating} ({venue.review_count} reviews)</span>
            </div>
            <div className="absolute bottom-3 left-3 text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
              Demo Visual Reference
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {venue.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImageIndex === idx ? 'border-purple-500 scale-105 shadow-rgb-glow' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Specs Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-slate-700/80 bg-dark-900/90 space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-rgb-blue shrink-0" />
              <span>{venue.address || `${venue.area}, ${venue.city}`}</span>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Demo Base Day Rental:</span>
                <span className="text-base font-bold text-pink-400 font-mono">
                  ₹{venue.price_per_day?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Catering Rate per Plate:</span>
                <span className="text-sm font-bold text-white font-mono">
                  ₹{venue.price_per_plate?.toLocaleString()}/head
                </span>
              </div>
            </div>

            {/* Capacity Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase block">Guest Capacity Band</span>
                <span className="text-sm font-bold text-white font-mono">
                  {venue.capacity_min} to {venue.capacity_max} Guests
                </span>
              </div>
              <Users className="w-6 h-6 text-rgb-blue" />
            </div>

            {/* Contact Box */}
            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{venue.contact_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{venue.contact_email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Amenities Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Description & Facilities */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] mb-2">Venue Overview</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {venue.description}
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] mb-3">Included Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {venue.facilities.map((fac, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200"
                >
                  ✓ {fac}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Generational & Accessibility Protocols */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2 text-blue-400 mb-3">
              <Heart className="w-4 h-4" />
              <span>Universal Senior Accessibility Features</span>
            </h3>
            <div className="space-y-2">
              {venue.accessibility_features && venue.accessibility_features.length > 0 ? (
                venue.accessibility_features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Standard ground floor access available.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2 text-pink-400 mb-3">
              <Smile className="w-4 h-4" />
              <span>Family & Child Amenities</span>
            </h3>
            <div className="space-y-2">
              {venue.family_features && venue.family_features.length > 0 ? (
                venue.family_features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rgb-pink shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Standard family amenities provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
