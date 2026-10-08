import React from 'react';
import { 
  Compass, 
  Globe, 
  Sparkles, 
  User, 
  ShieldCheck, 
  MapPin, 
  Luggage, 
  Tag, 
  PhoneCall,
  Menu,
  X
} from 'lucide-react';
import { CURRENCIES, formatPrice } from '../utils/currency';

export default function Navbar({
  currency,
  setCurrency,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  onOpenCustomTrip,
  activeTab,
  setActiveTab,
  loyaltyTier,
  setLoyaltyTier,
  selectedPackageIds = [],
  onOpenCartSummary
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider animate-pulse">
              Summer Special
            </span>
            <span className="hidden sm:inline">Use code <strong className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-white">ORBITNEW</strong> for flat ₹2,500 OFF + 10% Extra on Double Destinations!</span>
            <span className="sm:hidden">Code <strong className="font-mono bg-white/20 px-1 rounded">ORBITNEW</strong> for ₹2,500 OFF!</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Loyalty tier quick switcher/badge */}
            <div className="hidden md:flex items-center space-x-1.5 bg-black/20 px-2.5 py-0.5 rounded-full text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Customer Tier:</span>
              <select 
                value={loyaltyTier}
                onChange={(e) => setLoyaltyTier(e.target.value)}
                className="bg-transparent text-amber-200 font-semibold cursor-pointer outline-hidden border-none text-[11px]"
                title="Change customer status to see automatic loyalty discounts"
              >
                <option value="standard" className="text-slate-900">New Traveler (0%)</option>
                <option value="regular" className="text-slate-900">Regular Customer (5% Off)</option>
                <option value="vip" className="text-slate-900">Gold VIP (10% Off)</option>
              </select>
            </div>

            <a 
              href="https://wa.me/917304363139?text=Hello%20Go%20Orbit%2C%20I%20want%20to%20inquire%20about%20a%20tour%20package."
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-emerald-300 transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span className="hidden lg:inline">24x7 Help: +91 7304363139</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => { setActiveTab('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-heading">
                go<span className="text-blue-600">orbit</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
              Explore The World
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-600">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === 'all' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-slate-100'
            }`}
          >
            All Tours
          </button>
          <button
            onClick={() => setActiveTab('india')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'india' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-slate-100'
            }`}
          >
            <span>🇮🇳 India Tour</span>
            <span className="text-[11px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded-full">10 Hubs</span>
          </button>
          <button
            onClick={() => setActiveTab('international')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'international' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-slate-100'
            }`}
          >
            <span>✈️ International</span>
            <span className="text-[11px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.2 rounded-full">11 Hubs</span>
          </button>
          <button
            onClick={() => setActiveTab('adventure')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'adventure' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-blue-600 hover:bg-slate-100'
            }`}
          >
            <span>🏔️ Adventure</span>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded-full">6 Sports</span>
          </button>

          <button
            onClick={onOpenCustomTrip}
            className="px-3 py-2 rounded-lg text-indigo-600 hover:bg-indigo-50 font-semibold transition-all flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Plan Custom Trip</span>
          </button>
        </nav>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-100 hover:bg-slate-200/80 rounded-lg px-2.5 py-1.5 transition-colors border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden cursor-pointer"
            >
              {Object.keys(CURRENCIES).map((curr) => (
                <option key={curr} value={curr}>
                  {CURRENCIES[curr].label}
                </option>
              ))}
            </select>
          </div>

          {/* Bundle Cart Badge */}
          {selectedPackageIds.length > 0 && (
            <button
              onClick={onOpenCartSummary}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm shadow-orange-500/25 hover:brightness-105 transition-all animate-bounce"
              title="Multi-package bundle discount active!"
            >
              <Luggage className="w-3.5 h-3.5" />
              <span>{selectedPackageIds.length} Trips ({selectedPackageIds.length >= 3 ? '15% Off' : '10% Off'})</span>
            </button>
          )}

          {/* Admin Dashboard Button - Restricted strictly to nidhigupta3139@gmail.com */}
          {currentUser && (currentUser.email || '').toLowerCase().trim() === 'nidhigupta3139@gmail.com' && (
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300 shadow-xs transition-colors"
              title="Open Travel Admin Portal (Nidhi Gupta)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Auth Button */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors border border-blue-200"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline">{currentUser.name || 'Traveler'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs shadow-sm shadow-blue-500/20 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => { setActiveTab('all'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left font-medium ${activeTab === 'all' ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-slate-50'}`}
            >
              🌍 All Packages
            </button>
            <button
              onClick={() => { setActiveTab('india'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left font-medium ${activeTab === 'india' ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-slate-50'}`}
            >
              🇮🇳 India Tour (10 Hubs)
            </button>
            <button
              onClick={() => { setActiveTab('international'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left font-medium ${activeTab === 'international' ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-slate-50'}`}
            >
              ✈️ International (11 Hubs)
            </button>
            <button
              onClick={() => { setActiveTab('adventure'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left font-medium ${activeTab === 'adventure' ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-slate-50'}`}
            >
              🏔️ Adventure (6 Sports)
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            <button
              onClick={() => { onOpenCustomTrip(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-sm text-center flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Plan Custom Trip</span>
            </button>

            {/* Admin Dashboard Button - Restricted strictly to nidhigupta3139@gmail.com */}
            {currentUser && (currentUser.email || '').toLowerCase().trim() === 'nidhigupta3139@gmail.com' && (
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="w-full py-2 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg font-bold text-xs text-center flex items-center justify-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Open Admin Dashboard (Nidhi Gupta)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
