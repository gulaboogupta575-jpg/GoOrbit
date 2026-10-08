import React from 'react';
import { 
  Star, 
  Clock, 
  MapPin, 
  Plane, 
  Train, 
  Bus, 
  ArrowRight, 
  Check, 
  Calculator, 
  Sparkles,
  Luggage,
  Calendar
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function PackageCard({ 
  pkg, 
  currency, 
  onViewDetails, 
  onOpenEstimator, 
  onBookNow,
  isBundled,
  onToggleBundle
}) {
  const discountPercent = Math.round(
    ((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100
  );

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Package Image & Badges */}
        <div className="relative h-60 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"></div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="bg-blue-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{pkg.badge || 'Featured'}</span>
            </span>

            <span className="bg-rose-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          </div>

          {/* Bottom Info on Image */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center space-x-2 text-xs text-blue-200 font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{pkg.duration}</span>
              <span>•</span>
              <span className="flex items-center text-amber-300">
                <Star className="w-3 h-3 fill-amber-300 mr-1" />
                {pkg.rating} ({pkg.reviewCount})
              </span>
            </div>
            <h3 className="text-lg font-bold font-heading text-white line-clamp-1">
              {pkg.title}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-4">
          <p className="text-xs text-slate-600 line-clamp-2">
            {pkg.overview}
          </p>

          {/* Highlights checklist */}
          <div className="space-y-1.5 bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs text-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Key Highlights
            </span>
            {pkg.highlights.slice(0, 2).map((hl, i) => (
              <div key={i} className="flex items-start space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{hl}</span>
              </div>
            ))}
          </div>

          {/* Real-time Transport Modes supported */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="font-semibold text-slate-700">Available Transit:</span>
            <div className="flex items-center space-x-2">
              {pkg.transportModes.includes('flight') && (
                <span className="flex items-center space-x-0.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium" title="Flight Available">
                  <Plane className="w-3 h-3" />
                  <span>Flight</span>
                </span>
              )}
              {pkg.transportModes.includes('train') && (
                <span className="flex items-center space-x-0.5 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-medium" title="Train Available">
                  <Train className="w-3 h-3" />
                  <span>Train</span>
                </span>
              )}
              {pkg.transportModes.includes('bus') && (
                <span className="flex items-center space-x-0.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium" title="Bus Available">
                  <Bus className="w-3 h-3" />
                  <span>Bus</span>
                </span>
              )}
            </div>
          </div>

          {/* Multi-Package Bundle Checkbox */}
          <div 
            onClick={() => onToggleBundle(pkg.id)}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
              isBundled 
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isBundled}
                onChange={() => {}} // Handled by parent div
                className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
              />
              <span>Add to Multi-Trip Bundle</span>
            </div>
            <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded-md font-bold">
              +10% to 15% Extra Off
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Pricing & Action Buttons */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(pkg.originalPrice, currency)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 rounded-sm">
                Save {formatPrice(pkg.originalPrice - pkg.price, currency)}
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-slate-900 font-heading">
                {formatPrice(pkg.price, currency)}
              </span>
              <span className="text-[11px] text-slate-500">/ person</span>
            </div>
          </div>

          {/* Real-time Breakdown Calculator Button */}
          <button
            onClick={() => onOpenEstimator(pkg)}
            className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-xl border border-blue-200 transition-colors"
            title="Calculate exact flight/train/bus travel breakdown from your city"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Price Breakdown</span>
          </button>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(pkg)}
            className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs text-center transition-colors hover:bg-slate-50"
          >
            View Itinerary
          </button>
          <button
            onClick={() => onBookNow(pkg)}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs text-center shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-1 hover:scale-[1.02]"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
