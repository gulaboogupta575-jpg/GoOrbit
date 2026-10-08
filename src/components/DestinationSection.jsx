import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  Compass, 
  Camera, 
  Info,
  X,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function DestinationSection({ 
  destinations = [], 
  activeCategory, 
  setActiveCategory, 
  currency,
  onSelectDestination,
  onBookDestination,
  onOpenEstimatorForDest
}) {
  const [selectedDestForPlacesModal, setSelectedDestForPlacesModal] = useState(null);

  const categories = [
    { id: 'all', label: '🌍 All Hubs', count: destinations.length },
    { id: 'india', label: '🇮🇳 India Tour (10 Destinations)', count: destinations.filter(d => d.category === 'india').length },
    { id: 'international', label: '✈️ International (11 Destinations)', count: destinations.filter(d => d.category === 'international').length },
    { id: 'adventure', label: '🏔️ Adventure Tour (6 Activities)', count: destinations.filter(d => d.category === 'adventure').length }
  ];

  const filteredDestinations = activeCategory === 'all' 
    ? destinations 
    : destinations.filter(d => d.category === activeCategory);

  return (
    <section id="destinations-section" className="py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>Handpicked Destinations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
              Explore Destinations & Attractions
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Each destination includes <strong>4 to 5 verified key attractions</strong>, curated day-wise itineraries, and real-time travel cost estimates.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      <span>{dest.state ? `${dest.state}, ${dest.country}` : dest.country}</span>
                    </span>

                    <span className="bg-amber-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-xs">
                      <Star className="w-3 h-3 fill-slate-900" />
                      <span>{dest.rating}</span>
                      <span className="text-[10px] text-slate-800 font-normal">({dest.reviewCount})</span>
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300">
                      {dest.category === 'india' ? 'India Tour' : dest.category === 'international' ? 'International Tour' : 'Adventure Tour'}
                    </span>
                    <h3 className="text-xl font-bold font-heading text-white drop-shadow-sm leading-tight">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    "{dest.tagline}"
                  </p>

                  {/* 4 to 5 Places inside this destination */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                        <span>Included Places ({dest.places.length} Spots)</span>
                      </span>
                      <button
                        onClick={() => setSelectedDestForPlacesModal(dest)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-0.5"
                      >
                        <span>View Photos</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {dest.places.map((place, idx) => (
                        <span
                          key={idx}
                          onClick={() => setSelectedDestForPlacesModal(dest)}
                          className="bg-white text-slate-700 border border-slate-200/80 text-[11px] font-medium px-2 py-0.5 rounded-md hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-colors"
                          title={place.description}
                        >
                          📍 {place.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dest.duration}</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                      Best: {dest.bestTimeToVisit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-4 sm:p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Starting from</span>
                    <span className="text-xl font-extrabold text-slate-900 font-heading">
                      {formatPrice(dest.startingPrice, currency)}
                    </span>
                    <span className="text-[10px] text-slate-500"> / person</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center space-x-1"
                      title="View Full Day-Wise Itinerary"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onBookDestination ? onBookDestination(dest) : onSelectDestination(dest)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1"
                      title="Direct Book This Destination"
                    >
                      <span>Book Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: View 4 to 5 Places inside Destination */}
      {selectedDestForPlacesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                  Attractions & Places Guide
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                  {selectedDestForPlacesModal.name} ({selectedDestForPlacesModal.places.length} Key Places)
                </h3>
              </div>
              <button
                onClick={() => setSelectedDestForPlacesModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Places List */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Here are the verified must-visit attractions covered in this Go Orbit destination tour:
              </p>

              <div className="space-y-4">
                {selectedDestForPlacesModal.places.map((place, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-3.5 bg-slate-50 rounded-2xl p-3 border border-slate-200/80 items-center">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full sm:w-28 h-24 object-cover rounded-xl shrink-0"
                    />
                    <div className="space-y-1 text-left w-full">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{place.name}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{place.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500">Package Starting at</span>
                  <p className="text-lg font-bold text-slate-900 font-heading">
                    {formatPrice(selectedDestForPlacesModal.startingPrice, currency)}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const dest = selectedDestForPlacesModal;
                      setSelectedDestForPlacesModal(null);
                      onSelectDestination(dest);
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center space-x-1"
                  >
                    <span>View Itinerary</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      const dest = selectedDestForPlacesModal;
                      setSelectedDestForPlacesModal(null);
                      if (onBookDestination) onBookDestination(dest);
                      else onSelectDestination(dest);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center space-x-1.5"
                  >
                    <span>Book This Tour Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
