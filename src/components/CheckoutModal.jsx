import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CreditCard,
  Luggage,
  Hotel,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function CheckoutModal({
  bookingConfig,
  onClose,
  currency,
  onProceedToPayment,
  currentUser
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [dateError, setDateError] = useState('');

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    travelDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    specialRequests: ''
  });

  if (!bookingConfig) return null;

  const { pkg, estimateData, originCity, travelMode, hotelTier, travelersCount, roomsCount } = bookingConfig;
  const breakdown = estimateData?.breakdown;
  const netAmount = breakdown?.netTotalPayable || pkg.price;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.travelDate || formData.travelDate < todayStr) {
      setDateError('Booking for past dates is not allowed. Please choose today or a future date.');
      return;
    }

    onProceedToPayment({
      ...formData,
      bookingConfig,
      netAmount
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-20">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                Step 1 of 2: Traveler Details
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                Confirm Booking & Passenger Info
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Trip Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Selected Tour Package
            </span>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{pkg.title}</h4>
                <p className="text-xs text-slate-500">
                  {pkg.duration} • {travelersCount} Traveler(s) • From {originCity.toUpperCase()} via {travelMode.toUpperCase()}
                </p>
              </div>
              <span className="text-lg font-black text-blue-600 font-heading">
                {formatPrice(netAmount, currency)}
              </span>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Primary Traveler & Contact</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (as per Passport/Aadhaar)
                </label>
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email (for Ticket & Invoice)
                </label>
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile / WhatsApp Number
                </label>
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Travel Start Date
                </label>
                <div className={`flex items-center space-x-2 bg-slate-50 border rounded-xl px-3 py-2 transition-all ${
                  dateError ? 'border-rose-400 bg-rose-50/40 ring-1 ring-rose-400' : 'border-slate-200'
                }`}>
                  <Calendar className={`w-4 h-4 shrink-0 ${dateError ? 'text-rose-500' : 'text-slate-400'}`} />
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={formData.travelDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ ...formData, travelDate: val });
                      if (val && val < todayStr) {
                        setDateError('Selected date has already passed. Please choose today or an upcoming date.');
                      } else {
                        setDateError('');
                      }
                    }}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0 cursor-pointer"
                  />
                </div>
                {dateError && (
                  <div className="flex items-center space-x-1.5 text-[11px] font-bold text-rose-600 mt-1.5 animate-shake">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{dateError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Requests or Dietary Requirements (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-hidden focus:border-blue-500"
                placeholder="Vegetarian meals, honeymoon bed decoration, early check-in, etc."
              />
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Secure Checkout with 256-Bit SSL Encryption</span>
            </div>
            <span className="font-bold">Instant Confirmation</span>
          </div>

          {/* Sticky footer action */}
          <div className="pt-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Amount</span>
              <p className="text-xl font-black text-slate-900 font-heading">
                {formatPrice(netAmount, currency)}
              </p>
            </div>

            <button
              type="submit"
              disabled={!!dateError || (formData.travelDate && formData.travelDate < todayStr)}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
