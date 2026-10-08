import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Star, 
  Check, 
  Clock, 
  Utensils, 
  Hotel, 
  Plane, 
  Calculator, 
  ArrowRight,
  ShieldAlert,
  Share2,
  Sparkles
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function PackageDetailModal({
  pkg,
  onClose,
  currency,
  onOpenEstimator,
  onBookNow
}) {
  const [activeDay, setActiveDay] = useState(1);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!pkg) return null;

  const gallery = pkg.gallery && pkg.gallery.length > 0 ? pkg.gallery : [pkg.image];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-20">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              {pkg.category} Tour
            </span>
            <span className="text-xs text-slate-500 font-semibold flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{pkg.duration}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: pkg.title,
                    text: `Check out this tour package on Go Orbit: ${pkg.title}`,
                    url: window.location.href
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Trip link copied to clipboard!');
                }
              }}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              title="Share Itinerary"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* Gallery Carousel */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md">
              <img
                src={gallery[activePhotoIdx]}
                alt={pkg.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{pkg.rating} ({pkg.reviewCount} Reviews)</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {gallery.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === i ? 'border-blue-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Overview */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {pkg.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {pkg.overview}
            </p>
          </div>

          {/* Highlights */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Package Highlights & Experiences</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pkg.highlights.map((hl, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day-Wise Detailed Itinerary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Day-Wise Detailed Itinerary
                </h3>
                <p className="text-xs text-slate-500">Every single day planned with stay and meals</p>
              </div>

              {/* Quick day switcher pills */}
              <div className="flex space-x-1 overflow-x-auto max-w-xs pb-1">
                {pkg.itinerary.map((item) => (
                  <button
                    key={item.day}
                    onClick={() => setActiveDay(item.day)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      activeDay === item.day
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Day {item.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Itinerary Accordion / Timeline */}
            <div className="space-y-3">
              {pkg.itinerary.map((item) => {
                const isCurrent = activeDay === item.day;
                return (
                  <div
                    key={item.day}
                    onClick={() => setActiveDay(item.day)}
                    className={`rounded-2xl border transition-all cursor-pointer p-4 ${
                      isCurrent
                        ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                          isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          D{item.day}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isCurrent && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 text-xs">
                        <p className="text-slate-600 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-1 text-slate-600">
                          {item.meals && (
                            <span className="flex items-center space-x-1.5 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-medium">
                              <Utensils className="w-3.5 h-3.5 text-amber-600" />
                              <span>{item.meals}</span>
                            </span>
                          )}
                          {item.stay && (
                            <span className="flex items-center space-x-1.5 bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-lg font-medium">
                              <Hotel className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{item.stay}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inclusions & Exclusions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Inclusions */}
            <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>What's Included</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {pkg.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-rose-50/40 border border-rose-200/80 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center space-x-1.5">
                <X className="w-4 h-4 text-rose-600" />
                <span>What's Excluded</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {pkg.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Special Offer Price</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 font-heading">
                {formatPrice(pkg.price, currency)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(pkg.originalPrice, currency)}
              </span>
              <span className="text-xs text-slate-500"> / person</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenEstimator(pkg);
              }}
              className="flex-1 sm:flex-initial py-3 px-4 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Real-Time Travel Cost</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onBookNow(pkg);
              }}
              className="flex-1 sm:flex-initial py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
            >
              <span>Book This Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
