import React, { useState, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  Calendar, 
  Users, 
  DollarSign, 
  Tag, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function AdminDashboard({
  onClose,
  currency,
  couponsData,
  onRefreshCoupons,
  currentUser
}) {
  const isAuthorizedAdmin = (currentUser?.email || '').toLowerCase().trim() === 'nidhigupta3139@gmail.com';

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'inquiries' | 'coupons' | 'seasonal'
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    pendingInquiries: 0,
    averageRating: '4.9'
  });
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // New coupon form state
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    minSpend: 10000,
    description: ''
  });

  const fetchData = async () => {
    if (!isAuthorizedAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const adminHeaders = {
        'x-admin-email': currentUser?.email || ''
      };
      const [resStats, resBookings, resInq] = await Promise.all([
        fetch('/api/admin/stats', { headers: adminHeaders }).then(r => r.json()),
        fetch('/api/bookings').then(r => r.json()),
        fetch('/api/inquiries').then(r => r.json())
      ]);
      setStats(resStats && !resStats.error ? resStats : {
        totalRevenue: 0,
        totalBookings: 0,
        pendingInquiries: 0,
        averageRating: '0.0'
      });
      setBookings(Array.isArray(resBookings) ? resBookings : []);
      setInquiries(Array.isArray(resInq) ? resInq : []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || ''
        },
        body: JSON.stringify({ bookingStatus: status })
      });
      if (res.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, bookingStatus: status } : b));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || ''
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // If unauthorized user or guest tries to render AdminDashboard, display access denied
  if (!isAuthorizedAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-500/30 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/40">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-white">Access Denied</h3>
            <p className="text-xs text-slate-400 mt-1">
              Admin panel and administrative controls are restricted to{' '}
              <span className="text-amber-400 font-semibold font-mono">nidhigupta3139@gmail.com</span> only.
            </p>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 text-xs text-slate-300">
            {currentUser ? (
              <p>You are currently signed in as <span className="font-semibold text-white">{currentUser.email}</span>, which does not have administrator privileges.</p>
            ) : (
              <p>You are currently not signed in. Please sign in with the administrator account.</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors border border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-3xl max-w-6xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden my-auto">
        {/* Admin Navigation Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black font-heading text-white">
                  Go Orbit Command Center
                </h3>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Sole Admin: nidhigupta3139@gmail.com
                </span>
              </div>
              <p className="text-xs text-slate-400">Live booking analytics, coupon engine & custom inquiries</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KPI Analytics Cards */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Total Tour Revenue
              </span>
              <p className="text-2xl font-black text-emerald-400 font-heading mt-1">
                {formatPrice(stats.totalRevenue, currency)}
              </p>
              <span className="text-[11px] text-emerald-500 flex items-center space-x-1 mt-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Verified Online Checkout</span>
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Total Bookings
              </span>
              <p className="text-2xl font-black text-white font-heading mt-1">
                {stats.totalBookings}
              </p>
              <span className="text-[11px] text-blue-400 mt-1 block">
                Across India, Intl & Adventure
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Custom Trip Inquiries
              </span>
              <p className="text-2xl font-black text-amber-400 font-heading mt-1">
                {stats.pendingInquiries} Pending
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                From Custom Itinerary Form
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Customer Rating
              </span>
              <p className="text-2xl font-black text-amber-300 font-heading mt-1">
                ★ {stats.averageRating}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {stats.totalReviews || 0} Verified Trip Reviews
              </span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900 text-xs font-bold text-slate-400 space-x-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'bookings'
                ? 'border-blue-500 text-blue-400 font-extrabold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Customer Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'inquiries'
                ? 'border-blue-500 text-blue-400 font-extrabold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Custom Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'coupons'
                ? 'border-blue-500 text-blue-400 font-extrabold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupon Codes & Loyalty Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('seasonal')}
            className={`py-3 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'seasonal'
                ? 'border-blue-500 text-blue-400 font-extrabold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Seasonal Sales & Promotions</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 rounded-l-xl">Ref ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Tour Package</th>
                      <th className="p-3">Departure Date</th>
                      <th className="p-3">Mode</th>
                      <th className="p-3">Total Paid</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-10 text-center text-slate-400">
                          <Calendar className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                          <p className="font-semibold text-sm text-slate-300">No bookings recorded yet</p>
                          <p className="text-xs text-slate-500 mt-1">Confirmed traveler bookings will appear here in real-time.</p>
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-400">{b.id}</td>
                        <td className="p-3">
                          <p className="font-bold text-white">{b.userName}</p>
                          <p className="text-[11px] text-slate-400">{b.phone}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-200">{b.packageTitle}</p>
                          <p className="text-[10px] text-slate-400">{b.travelers} Guests • {b.hotelTier}</p>
                        </td>
                        <td className="p-3">{b.travelDate}</td>
                        <td className="p-3 uppercase text-[11px] font-bold text-amber-400">{b.travelMode}</td>
                        <td className="p-3 font-bold text-emerald-400">
                          {formatPrice(b.totalAmount, currency)}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.bookingStatus === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={b.bookingStatus}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-hidden cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 rounded-l-xl">Inquiry ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Requested Destinations</th>
                      <th className="p-3">Days & Guests</th>
                      <th className="p-3">Estimated Budget</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-10 text-center text-slate-400">
                          <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                          <p className="font-semibold text-sm text-slate-300">No custom trip inquiries yet</p>
                          <p className="text-xs text-slate-500 mt-1">Custom itinerary inquiries submitted by travelers will appear here.</p>
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-amber-400">{inq.id}</td>
                        <td className="p-3">
                          <p className="font-bold text-white">{inq.name}</p>
                          <p className="text-[11px] text-slate-400">{inq.phone} • {inq.email}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-200">
                            {Array.isArray(inq.destinations) ? inq.destinations.join(' + ') : inq.destinations}
                          </p>
                          <p className="text-[10px] text-slate-400">{inq.travelStyle} • From {inq.departureCity}</p>
                        </td>
                        <td className="p-3">{inq.durationDays} Days / {inq.travelers} Guests</td>
                        <td className="p-3 font-bold text-emerald-400">{inq.estimatedBudget}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inq.status === 'Pending'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : inq.status === 'Contacted'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-hidden cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COUPONS & LOYALTY */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              {/* Active Coupons List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Promo Coupons
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(couponsData?.coupons || []).map((cpn, idx) => (
                    <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-black text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                          {cpn.code}
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                          {cpn.type === 'flat' ? `₹${cpn.value} FLAT` : `${cpn.value}% OFF`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{cpn.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                        <span>Min Spend: ₹{cpn.minSpend.toLocaleString()}</span>
                        <span>Exp: {cpn.expiry}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loyalty Discount Policy */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Customer Loyalty & Bundle Discount Rules</span>
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                  <li><strong>Regular Customers:</strong> 5% automatic discount on any domestic or international tour.</li>
                  <li><strong>Gold VIP Pioneers:</strong> 10% automatic VIP discount + free airport lounge/transfer assistance.</li>
                  <li><strong>Double Destination Bundle:</strong> 10% Extra OFF when 2 destinations or packages are selected.</li>
                  <li><strong>Grand Explorer (3+ Destinations):</strong> 15% Extra OFF automatically deducted at checkout.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: SEASONAL SALES */}
          {activeTab === 'seasonal' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Seasonal Promotions & Banners
              </h4>
              <div className="space-y-3">
                {(couponsData?.seasonalEvents || []).map((season) => (
                  <div key={season.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{season.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          season.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                        }`}>
                          {season.isActive ? 'ACTIVE NOW' : 'OFFLINE'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{season.tagline}</p>
                      <p className="text-[11px] text-amber-300">Discount: {season.discountPercent}% OFF • Valid until: {season.validUntil}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Banner Live:</span>
                      <span className="font-mono font-bold text-emerald-400">{season.isActive ? 'YES' : 'NO'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
