import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plane, 
  Train, 
  Bus, 
  Hotel, 
  Users, 
  Tag, 
  ShieldCheck, 
  Calculator, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Clock,
  Luggage,
  MapPin
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function CostEstimatorModal({
  pkg,
  onClose,
  currency,
  onProceedToCheckout,
  couponsData,
  loyaltyTier,
  setLoyaltyTier,
  selectedPackageIds = []
}) {
  const [originCity, setOriginCity] = useState('delhi');
  const [travelMode, setTravelMode] = useState(
    pkg?.category === 'international' ? 'flight' : 'flight'
  );
  const [hotelTier, setHotelTier] = useState('deluxe');
  const [travelersCount, setTravelersCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('ORBITNEW'); // default pre-applied for convenience
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimateData, setEstimateData] = useState(null);

  // Origin cities list
  const originCities = [
    { id: 'delhi', name: 'Delhi NCR' },
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'bengaluru', name: 'Bengaluru' },
    { id: 'kolkata', name: 'Kolkata' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'ahmedabad', name: 'Ahmedabad' }
  ];

  // Fetch or calculate real-time estimate
  const fetchEstimate = async () => {
    if (!pkg) return;
    setLoading(true);
    try {
      const res = await fetch('/api/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          originCity,
          travelMode,
          hotelTier,
          travelersCount,
          roomsCount,
          couponCode: appliedCoupon,
          loyaltyTier,
          selectedPackagesCount: Math.max(1, selectedPackageIds.length)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEstimateData(data);
      }
    } catch (err) {
      console.error('Estimate error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimate();
  }, [
    originCity, 
    travelMode, 
    hotelTier, 
    travelersCount, 
    roomsCount, 
    appliedCoupon, 
    loyaltyTier,
    selectedPackageIds.length
  ]);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    setAppliedCoupon(couponInput.trim().toUpperCase());
    setCouponError('');
  };

  if (!pkg) return null;

  const isInternational = pkg.category === 'international';
  const breakdown = estimateData?.breakdown;
  const transport = estimateData?.transportDetails;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                Live Cost Breakdown Matrix
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                {pkg.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Controls: Origin & Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
            {/* Origin City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Traveling From</span>
              </label>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-hidden"
              >
                {originCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Travelers Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Travelers</span>
              </label>
              <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-2 py-1">
                <button
                  onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs font-bold">{travelersCount} Person(s)</span>
                <button
                  onClick={() => setTravelersCount(travelersCount + 1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Rooms Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Hotel className="w-3.5 h-3.5 text-amber-600" />
                <span>Rooms Required</span>
              </label>
              <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-2 py-1">
                <button
                  onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs font-bold">{roomsCount} Room(s)</span>
                <button
                  onClick={() => setRoomsCount(roomsCount + 1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Mode of Transport Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                <span>Select Travel Mode</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                  Real-time simulated fares
                </span>
              </label>
              {isInternational && (
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                  International Sector: Scheduled Airline Included
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Flight Option */}
              <div
                onClick={() => setTravelMode('flight')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  travelMode === 'flight'
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <Plane className={`w-4 h-4 ${travelMode === 'flight' ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs text-slate-900">Flight (Fastest)</span>
                  </div>
                  {travelMode === 'flight' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  IndiGo / Air India / Partner
                </p>
                <p className="text-[11px] text-blue-700 font-semibold mt-1">
                  15kg-30kg Luggage Included
                </p>
              </div>

              {/* Train Option */}
              <div
                onClick={() => !isInternational && setTravelMode('train')}
                className={`p-3.5 rounded-2xl border-2 transition-all ${
                  isInternational
                    ? 'opacity-40 cursor-not-allowed border-slate-200 bg-slate-50'
                    : travelMode === 'train'
                    ? 'border-amber-600 bg-amber-50/50 shadow-sm cursor-pointer'
                    : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <Train className={`w-4 h-4 ${travelMode === 'train' ? 'text-amber-600' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs text-slate-900">Train (IRCTC Rail)</span>
                  </div>
                  {travelMode === 'train' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Vande Bharat / Rajdhani Express
                </p>
                <p className="text-[11px] text-amber-700 font-semibold mt-1">
                  Confirmed AC Berth
                </p>
              </div>

              {/* Bus Option */}
              <div
                onClick={() => !isInternational && setTravelMode('bus')}
                className={`p-3.5 rounded-2xl border-2 transition-all ${
                  isInternational
                    ? 'opacity-40 cursor-not-allowed border-slate-200 bg-slate-50'
                    : travelMode === 'bus'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm cursor-pointer'
                    : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <Bus className={`w-4 h-4 ${travelMode === 'bus' ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs text-slate-900">AC Luxury Bus</span>
                  </div>
                  {travelMode === 'bus' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Volvo Multi-Axle Sleeper
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Most Economical
                </p>
              </div>
            </div>
          </div>

          {/* Hotel Experience Tier */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-900 block">
              Hotel Experience Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'standard', name: 'Standard 3-Star', desc: 'Clean, comfortable mountain/city view hotel' },
                { id: 'deluxe', name: 'Deluxe 4-Star', desc: 'Pool, buffet breakfast & premium location' },
                { id: 'luxury', name: 'Luxury 5-Star / Villa', desc: 'Top tier luxury, jacuzzi & VIP amenities' }
              ].map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setHotelTier(tier.id)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    hotelTier === tier.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{tier.name}</span>
                    {hotelTier === tier.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Discounts & Loyalty Controls */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Coupon & Multi-Tier Discounts</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                Savings Auto-Applied
              </span>
            </div>

            {/* Coupon Code Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon (e.g. ORBITNEW, SUMMER2026)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs uppercase font-mono font-bold text-slate-800 outline-hidden focus:border-blue-500"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Loyalty tier toggle for Old / Regular customer discount */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-slate-700">Customer Loyalty Tier:</span>
              </div>
              <div className="flex gap-1.5">
                {[
                  { id: 'standard', label: 'New (0%)' },
                  { id: 'regular', label: 'Regular (5% Off)' },
                  { id: 'vip', label: 'VIP (10% Off)' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setLoyaltyTier(tier.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      loyaltyTier === tier.id
                        ? 'bg-amber-500 text-white font-bold shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Amount Breakdown Table */}
          {breakdown && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Detailed Amount Breakdown (Start to End)
                </span>
                <span className="text-xs text-slate-400">
                  {travelersCount} Traveler(s) • {originCity.toUpperCase()} Departure
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 1. Base Package */}
                <div className="flex justify-between text-slate-300">
                  <span>Base Package (Sightseeing & Coordination)</span>
                  <span>{formatPrice(breakdown.packageBaseTotal, currency)}</span>
                </div>

                {/* 2. Transport */}
                <div className="flex justify-between text-slate-300">
                  <span>
                    Transport: {transport?.mode} ({transport?.type})
                  </span>
                  <span className="font-semibold text-white">
                    {formatPrice(breakdown.transportTotal, currency)}
                  </span>
                </div>

                {/* 3. Hotel Stay */}
                {breakdown.hotelUpgradeTotal > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Hotel Room Tier Upgrade</span>
                    <span>{formatPrice(breakdown.hotelUpgradeTotal, currency)}</span>
                  </div>
                )}

                {/* 4. Local Transfers */}
                <div className="flex justify-between text-slate-300">
                  <span>Dedicated Private Transfers & Chauffeur</span>
                  <span>{formatPrice(breakdown.localCabAndGuide, currency)}</span>
                </div>

                {/* 5. Sightseeing & Permits */}
                <div className="flex justify-between text-slate-300">
                  <span>Sightseeing, Monument Passes & Forest Permits</span>
                  <span>{formatPrice(breakdown.sightseeingFees, currency)}</span>
                </div>

                {/* 6. Meals */}
                <div className="flex justify-between text-slate-300">
                  <span>Breakfast & Meals Plan</span>
                  <span>{formatPrice(breakdown.mealsAndBeverages, currency)}</span>
                </div>

                {/* Gross Subtotal */}
                <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                  <span>Subtotal Amount</span>
                  <span>{formatPrice(breakdown.grossSubtotal, currency)}</span>
                </div>

                {/* Discounts Section */}
                {breakdown.discounts.totalDiscounts > 0 && (
                  <div className="space-y-1.5 py-2 border-y border-emerald-500/30 text-emerald-400 font-medium">
                    {breakdown.discounts.coupon.amount > 0 && (
                      <div className="flex justify-between">
                        <span>🏷️ Coupon Discount ({breakdown.discounts.coupon.code})</span>
                        <span>-{formatPrice(breakdown.discounts.coupon.amount, currency)}</span>
                      </div>
                    )}
                    {breakdown.discounts.bundle.amount > 0 && (
                      <div className="flex justify-between">
                        <span>🎒 Multi-Trip Bundle Discount</span>
                        <span>-{formatPrice(breakdown.discounts.bundle.amount, currency)}</span>
                      </div>
                    )}
                    {breakdown.discounts.loyalty.amount > 0 && (
                      <div className="flex justify-between">
                        <span>👑 Customer Loyalty Discount</span>
                        <span>-{formatPrice(breakdown.discounts.loyalty.amount, currency)}</span>
                      </div>
                    )}
                    {breakdown.discounts.seasonal.amount > 0 && (
                      <div className="flex justify-between">
                        <span>☀️ Seasonal Promotion Discount</span>
                        <span>-{formatPrice(breakdown.discounts.seasonal.amount, currency)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* GST Tax */}
                <div className="flex justify-between text-slate-400">
                  <span>Government Goods & Services Tax (5% GST)</span>
                  <span>+{formatPrice(breakdown.gstAmount, currency)}</span>
                </div>

                {/* Final Net Amount */}
                <div className="flex justify-between items-baseline pt-3 border-t border-slate-800 text-sm font-extrabold text-white">
                  <div>
                    <span className="text-base text-white font-heading">Net Total Payable</span>
                    <span className="block text-[10px] text-slate-400 font-normal">All taxes & transit included</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-400 font-heading">
                    {formatPrice(breakdown.netTotalPayable, currency)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 sm:px-6 flex items-center justify-between z-20">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Total Payable</span>
            <p className="text-2xl font-black text-slate-900 font-heading">
              {formatPrice(breakdown?.netTotalPayable || pkg.price, currency)}
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onProceedToCheckout({
                pkg,
                estimateData,
                originCity,
                travelMode,
                hotelTier,
                travelersCount,
                roomsCount
              });
            }}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2 hover:scale-[1.02]"
          >
            <span>Proceed to Book with this Itinerary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
