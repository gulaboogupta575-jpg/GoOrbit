import React from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  Plane, 
  Train, 
  Bus, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  Clock 
} from 'lucide-react';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  onOpenCustomTrip,
  activeSeason
}) {
  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden pb-16 pt-8">
      {/* Background Ambience & Glows */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Active Seasonal Campaign Alert */}
        {activeSeason && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-400/40 rounded-2xl p-3 sm:p-4 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <span className="text-amber-300 font-bold text-sm tracking-wide uppercase">
                      {activeSeason.title}
                    </span>
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm">
                      {activeSeason.discountPercent}% OFF
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-0.5">{activeSeason.tagline}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs text-slate-300 hidden md:inline">Use coupon:</span>
                <span className="font-mono bg-white/10 border border-white/20 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300 tracking-wider">
                  SUMMER2026
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hero Headline */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Real-Time Travel Cost Breakdown: Flight, Train & Bus</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading leading-tight">
            Explore The Earth, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Orbit The World
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Curated journeys across <strong>10 India Destinations</strong> (with 4-5 places each), 
            <strong> 11 International Wonders</strong>, and <strong>6 High-Adrenaline Adventure Tours</strong>. 
            Real-time transport quotes, automated coupons, and instant payment.
          </p>
        </div>

        {/* Dynamic Search & Filter Bar */}
        <div className="max-w-4xl mx-auto mt-8 bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 text-slate-800 shadow-2xl border border-white/30">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search destination or sub-place */}
            <div className="md:col-span-5 flex items-center space-x-3 bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-3">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Where to? / Attraction
                </label>
                <input
                  type="text"
                  placeholder="e.g. Manali, Mumbai, Dal Lake, Dubai, Bali..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 outline-hidden border-none p-0"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-4 flex items-center space-x-3 bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-3">
              <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tour Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-hidden border-none p-0 cursor-pointer"
                >
                  <option value="all">🌍 All Destinations</option>
                  <option value="india">🇮🇳 India Tour (10 Destinations)</option>
                  <option value="international">✈️ International (11 Countries)</option>
                  <option value="adventure">🏔️ Adventure Sports (6 Categories)</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <div className="md:col-span-3">
              <button
                onClick={() => {
                  const target = document.getElementById('destinations-section');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full h-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <span>Find Journeys</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Filter Pill Suggestions */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Trending Picks:</span>
            {['Shimla-Manali', 'Kashmir', 'Mumbai', 'Dubai', 'Switzerland', 'Bali', 'Rishikesh Rafting', 'Bir Billing Paragliding'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  const target = document.getElementById('destinations-section');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-medium px-2.5 py-1 rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12 text-slate-300 text-xs sm:text-sm">
          <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Live Transport Matrix</p>
              <p className="text-[11px] text-slate-400">Flight, Train & AC Bus Breakdown</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Multi-Tier Discounts</p>
              <p className="text-[11px] text-slate-400">Coupons + Bundles + Loyalty</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Verified 4-5 Places/Hub</p>
              <p className="text-[11px] text-slate-400">Deep sights in every destination</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">Online Checkout</p>
              <p className="text-[11px] text-slate-400">Instant UPI & Card Invoicing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
