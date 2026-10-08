import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Printer, 
  Share2, 
  Download, 
  Calendar, 
  MapPin, 
  Plane, 
  Train, 
  Bus, 
  ShieldCheck, 
  QrCode,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function BookingReceiptModal({
  booking,
  onClose,
  currency
}) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const destTitle = booking.destination || booking.packageTitle || 'Dream Tour';
  const passengerName = booking.userName || booking.name || 'Traveler';
  const paidTotal = booking.totalAmount || booking.netAmount || 0;

  const handleWhatsAppShare = () => {
    const text = `🎉 My Go Orbit Tour to ${destTitle} is confirmed! Booking ID: ${booking.id}. Itinerary & hotel confirmed. Check out Go Orbit!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto print:border-none print:shadow-none print:max-h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 text-center relative print:bg-emerald-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 text-white/80 transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-100">
            Payment & Booking Confirmed
          </span>
          <h2 className="text-2xl font-black font-heading mt-1">
            Ready for Departure!
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Official E-Ticket & Itinerary Voucher
          </p>
        </div>

        {/* Voucher Body (Printable) */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-800">
          {/* Booking ID & QR Code */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Booking Reference ID
              </span>
              <p className="text-2xl font-mono font-black text-blue-600 tracking-wider">
                {booking.id}
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-500 justify-center sm:justify-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Status: Confirmed & Paid via {booking.paymentMethod}</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center space-x-3 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://go-orbit.travel/verify/${booking.id}`}
                alt="Ticket QR Code"
                className="w-16 h-16"
              />
              <div className="text-[10px] text-slate-400">
                <p className="font-bold text-slate-700">Scan at Airport / Hotel Desk</p>
                <p>Instant check-in pass</p>
              </div>
            </div>
          </div>

          {/* Passenger & Trip Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Passenger</span>
              <p className="font-bold text-slate-900 mt-0.5">{passengerName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Departure Date</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.travelDate}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Travelers</span>
              <p className="font-bold text-slate-900 mt-0.5">{booking.travelers} Guest(s)</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Transit Mode</span>
              <p className="font-bold text-blue-600 uppercase mt-0.5">{booking.travelMode}</p>
            </div>
          </div>

          {/* Package Details */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Package Name</span>
            <h4 className="text-base font-bold text-slate-900">{booking.packageTitle}</h4>
            <p className="text-xs text-slate-500">
              Hotel Category: <strong className="text-slate-800">{booking.hotelTier || 'Standard Deluxe'}</strong> • Destination: <strong className="text-slate-800">{destTitle}</strong>
            </p>
          </div>

          {/* Financial Invoice Breakdown */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2.5 text-xs">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block border-b border-slate-800 pb-2">
              Tax Invoice & Receipt Summary
            </span>

            <div className="flex justify-between text-slate-300">
              <span>Base Package Fare</span>
              <span>{formatPrice(booking.basePrice || paidTotal, currency)}</span>
            </div>

            {booking.transportCost > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>Transport Fare ({booking.travelMode.toUpperCase()})</span>
                <span>{formatPrice(booking.transportCost, currency)}</span>
              </div>
            )}

            {booking.hotelUpgradeCost > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>Hotel Upgrade Premium</span>
                <span>{formatPrice(booking.hotelUpgradeCost, currency)}</span>
              </div>
            )}

            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Total Discounts Saved ({booking.couponCode})</span>
                <span>-{formatPrice(booking.discountAmount, currency)}</span>
              </div>
            )}

            {booking.taxAmount > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>GST / Taxes (5%)</span>
                <span>+{formatPrice(booking.taxAmount, currency)}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 text-sm font-black text-white">
              <span>Total Amount Paid</span>
              <span className="text-xl text-emerald-400 font-heading">
                {formatPrice(paidTotal, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer (Print, WhatsApp, Close) */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
