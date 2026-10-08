import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Plane, 
  Hotel, 
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function CustomTripPlanner({
  destinations = [],
  onClose,
  currency,
  onBookCustomTrip
}) {
  const [selectedDestinations, setSelectedDestinations] = useState(['kashmir']);
  const [departureCity, setDepartureCity] = useState('Delhi');
  const [durationDays, setDurationDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [travelStyle, setTravelStyle] = useState('Comfort / 4-Star');
  const [preferredTransport, setPreferredTransport] = useState('Flight + Private Cab');
  const [specialRequests, setSpecialRequests] = useState('');
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Dynamic real-time estimation
  const baseCostPerDay = travelStyle.includes('Luxury') ? 12000 : travelStyle.includes('Comfort') ? 6500 : 3500;
  const rawEstimate = baseCostPerDay * durationDays * travelers;

  // Multi-destination bundle discount
  const isMultiDest = selectedDestinations.length >= 2;
  const bundleDiscountPercent = selectedDestinations.length >= 3 ? 15 : selectedDestinations.length === 2 ? 10 : 0;
  const bundleDiscount = Math.round((rawEstimate * bundleDiscountPercent) / 100);
  const estimatedTotal = rawEstimate - bundleDiscount;

  const toggleDestination = (id) => {
    if (selectedDestinations.includes(id)) {
      if (selectedDestinations.length > 1) {
        setSelectedDestinations(selectedDestinations.filter(d => d !== id));
      }
    } else {
      setSelectedDestinations([...selectedDestinations, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.phone) {
      alert('Please fill out your contact details.');
      return;
    }

    const destNames = selectedDestinations.map(
      id => destinations.find(d => d.id === id)?.name || id
    );

    // Build a package-like object for the checkout flow
    const customPkg = {
      id: 'custom-trip-' + Date.now(),
      title: 'Custom Trip: ' + destNames.join(' + '),
      category: 'india',
      badge: 'Custom Itinerary',
      duration: durationDays + ' Days / ' + (durationDays - 1) + ' Nights',
      price: estimatedTotal,
      originalPrice: rawEstimate,
      rating: 5.0,
      reviewCount: 0,
      image: destinations.find(d => d.id === selectedDestinations[0])?.image || '',
      gallery: selectedDestinations.map(id => destinations.find(d => d.id === id)?.image || '').filter(Boolean),
      overview: 'Custom curated trip to ' + destNames.join(', ') + ' with ' + travelStyle + ' accommodation and ' + preferredTransport + ' transport.',
      highlights: [
        destNames.length + ' destinations: ' + destNames.join(', '),
        travelStyle + ' accommodation',
        preferredTransport + ' transport from ' + departureCity,
        travelers + ' travelers for ' + durationDays + ' days'
      ],
      itinerary: [],
      inclusions: [
        travelStyle + ' hotel accommodation for ' + (durationDays - 1) + ' nights',
        preferredTransport + ' from ' + departureCity,
        'Daily breakfast and dinner',
        'All local sightseeing transfers',
        '24x7 Go Orbit tour coordinator'
      ],
      exclusions: [
        'Personal expenses and shopping',
        'Entry tickets to monuments',
        'Tips and gratuities'
      ],
      transportModes: ['flight', 'train', 'bus'],
      travelers: travelers,
      contactName: contact.name,
      contactEmail: contact.email,
      contactPhone: contact.phone,
      specialRequests: specialRequests
    };

    if (onBookCustomTrip) {
      onBookCustomTrip(customPkg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                Go Orbit Custom Concierge
              </span>
              <h3 className="text-xl font-extrabold font-heading text-white">
                Build Your Custom Itinerary
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
            {/* Step 1: Destination Selection (Multi-select) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-extrabold uppercase text-slate-900 tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>1. Choose Destinations (Multi-Select Supported)</span>
                </label>
                {selectedDestinations.length >= 2 && (
                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                    🎉 {bundleDiscountPercent}% Multi-Destination Discount Applied!
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-2xl">
                {destinations.map((d) => {
                  const isSelected = selectedDestinations.includes(d.id);
                  return (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => toggleDestination(d.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center space-x-1 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{isSelected ? '✓ ' : '+ '}</span>
                      <span>{d.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Trip Parameters (Duration, Travelers, Departure) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Departure City</label>
                <select
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                >
                  {['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Pune'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Number of Days</label>
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setDurationDays(Math.max(2, durationDays - 1))}
                    className="w-6 h-6 rounded bg-white text-slate-800 font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold">{durationDays} Days</span>
                  <button
                    type="button"
                    onClick={() => setDurationDays(durationDays + 1)}
                    className="w-6 h-6 rounded bg-white text-slate-800 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Travelers</label>
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-6 h-6 rounded bg-white text-slate-800 font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold">{travelers} Guests</span>
                  <button
                    type="button"
                    onClick={() => setTravelers(travelers + 1)}
                    className="w-6 h-6 rounded bg-white text-slate-800 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Travel Style & Transport */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Travel Style</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                >
                  <option value="Comfort / 4-Star">Comfort / 4-Star Hotels & Resorts</option>
                  <option value="Luxury 5-Star">Luxury 5-Star / Boutique Heritage</option>
                  <option value="Backpacker Budget">Budget / Backpacker Homestays</option>
                  <option value="Honeymoon Special">Romantic Honeymoon Deluxe</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Preferred Transport</label>
                <select
                  value={preferredTransport}
                  onChange={(e) => setPreferredTransport(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                >
                  <option value="Flight + Private Cab">Flight + Private Dedicated Cab</option>
                  <option value="Train + Local Cab">Train (IRCTC Rail) + Local Sightseeing Cab</option>
                  <option value="AC Sleeper Bus">Luxury AC Sleeper Bus</option>
                  <option value="Self Drive / Cab Only">Local Private Cab Only</option>
                </select>
              </div>
            </div>

            {/* Live Estimated Budget Widget */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div>
                <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                  Real-Time AI Estimated Quote
                </span>
                <p className="text-xl font-black text-emerald-400 font-heading">
                  {formatPrice(estimatedTotal, currency)}
                </p>
                <p className="text-[11px] text-slate-400">
                  Includes transport, {travelStyle} hotels, local cab & sightseeing
                </p>
              </div>

              {bundleDiscount > 0 && (
                <div className="bg-white/10 px-3 py-1.5 rounded-xl text-center sm:text-right">
                  <span className="text-[10px] text-amber-300 uppercase font-bold block">
                    Multi-Hub Bundle Savings
                  </span>
                  <span className="text-sm font-bold text-white">
                    -{formatPrice(bundleDiscount, currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Step 4: Contact Details */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="font-extrabold uppercase text-slate-900 tracking-wider block">
                Your Contact Details for Customized PDF Proposal
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile / WhatsApp"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Any special requests? (e.g. Paragliding add-on, river rafting, vegetarian food, anniversary flowers...)"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-hidden"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  );
}
