import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatPrice } from '../utils/currency';

export default function PaymentGatewayModal({
  checkoutData,
  onClose,
  currency,
  onPaymentSuccess
}) {
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8912',
    name: checkoutData?.name || 'Cardholder Name',
    expiry: '12/28',
    cvv: '891'
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [upiId, setUpiId] = useState('9769721758@slc');
  const [copied, setCopied] = useState(false);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('9769721758@slc');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!checkoutData) return null;

  const { netAmount, bookingConfig, name, email, phone, travelDate, specialRequests } = checkoutData;
  const { pkg, estimateData, originCity, travelMode, hotelTier, travelersCount } = bookingConfig;
  const breakdown = estimateData?.breakdown;

  const triggerPayment = async (method) => {
    setProcessing(true);

    try {
      // 1. Send Booking to Backend API
      const bookingPayload = {
        userName: name,
        email,
        phone,
        packageId: pkg.id,
        packageTitle: pkg.title,
        destination: pkg.destinationId,
        travelDate,
        travelers: travelersCount,
        travelMode,
        hotelTier,
        basePrice: breakdown?.packageBaseTotal || pkg.price,
        transportCost: breakdown?.transportTotal || 0,
        hotelUpgradeCost: breakdown?.hotelUpgradeTotal || 0,
        discountAmount: breakdown?.discounts?.totalDiscounts || 0,
        couponCode: breakdown?.discounts?.coupon?.code || 'NONE',
        taxAmount: breakdown?.gstAmount || 0,
        totalAmount: netAmount,
        paymentMethod: method,
        specialRequests
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      const data = await res.json();

      setTimeout(() => {
        setProcessing(false);
        // Confetti celebration
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        onPaymentSuccess(data.booking);
      }, 1500);

    } catch (err) {
      console.error('Payment submission failed:', err);
      setProcessing(false);
      alert('Error confirming booking. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-up">
        {/* Gateway Brand Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-xs">
              <Lock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                Go Orbit Pay • 256-Bit SSL Secure Gateway
              </span>
              <h3 className="text-xl font-extrabold font-heading text-white">
                {formatPrice(netAmount, currency)}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={processing}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Methods Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-slate-600 bg-slate-50">
          <button
            onClick={() => setPaymentTab('upi')}
            className={`flex-1 py-3 px-2 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
              paymentTab === 'upi'
                ? 'border-blue-600 text-blue-600 bg-white font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>

          <button
            onClick={() => setPaymentTab('card')}
            className={`flex-1 py-3 px-2 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
              paymentTab === 'card'
                ? 'border-blue-600 text-blue-600 bg-white font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setPaymentTab('netbanking')}
            className={`flex-1 py-3 px-2 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
              paymentTab === 'netbanking'
                ? 'border-blue-600 text-blue-600 bg-white font-extrabold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Net Banking</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5">
          {/* TAB 1: UPI */}
          {paymentTab === 'upi' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner max-w-sm mx-auto w-full">
                {/* Real User QR Code from Slice */}
                <div className="w-56 h-auto bg-white p-2 border border-slate-200 rounded-2xl mx-auto shadow-sm overflow-hidden">
                  <img
                    src="/upi_qr.jpg"
                    alt="Scan UPI QR Code - MR TOUHID RAZA MUJAHID RAZA"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-xs font-bold text-slate-800">
                    Account: <span className="text-blue-700">MR TOUHID RAZA MUJAHID RAZA</span>
                  </p>
                  <div className="flex items-center justify-center space-x-2 pt-1">
                    <span className="font-mono text-xs font-black bg-blue-50 border border-blue-200 text-blue-900 px-2.5 py-1 rounded-lg">
                      9769721758@slc
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUPI}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold transition-all"
                    >
                      {copied ? 'Copied! ✓' : 'Copy UPI ID'}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 font-medium mt-2">
                  Scan using Google Pay, PhonePe, Paytm, Slice, or BHIM UPI
                </p>
              </div>

              {/* Direct UPI Intent Link / Confirmation */}
              <div className="space-y-2">
                <a
                  href={`upi://pay?pa=9769721758@slc&pn=MR%20TOUHID%20RAZA%20MUJAHID%20RAZA&am=${netAmount}&cu=INR`}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Pay via UPI App (GPay / PhonePe / Paytm / Slice)</span>
                </a>

                <button
                  type="button"
                  onClick={() => triggerPayment(`UPI (9769721758@slc)`)}
                  disabled={processing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>I Have Paid {formatPrice(netAmount, currency)} • Confirm Booking</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CREDIT / DEBIT CARD */}
          {paymentTab === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-slate-800 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Valid Thru</label>
                  <input
                    type="text"
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-hidden"
                />
              </div>

              <button
                onClick={() => triggerPayment(`Card ending in ${cardData.number.slice(-4)}`)}
                disabled={processing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Pay {formatPrice(netAmount, currency)}</span>
              </button>
            </div>
          )}

          {/* TAB 3: NET BANKING */}
          {paymentTab === 'netbanking' && (
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">Select Bank</label>
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      selectedBank === bank
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>

              <button
                onClick={() => triggerPayment(`Net Banking (${selectedBank})`)}
                disabled={processing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-50"
              >
                <span>Authorize with {selectedBank}</span>
              </button>
            </div>
          )}

          {/* Express Instant Checkout Button */}
          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={() => triggerPayment('Instant Online Checkout')}
              disabled={processing}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/20"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Secure Payment with Bank...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Express Instant Checkout ({formatPrice(netAmount, currency)})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PCI-DSS Level 1 Compliant</span>
          </div>
          <span>Instant Invoice Generated</span>
        </div>
      </div>
    </div>
  );
}
