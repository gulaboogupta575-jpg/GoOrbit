import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DestinationSection from './components/DestinationSection';
import PackageCard from './components/PackageCard';
import PackageDetailModal from './components/PackageDetailModal';
import CostEstimatorModal from './components/CostEstimatorModal';
import CheckoutModal from './components/CheckoutModal';
import PaymentGatewayModal from './components/PaymentGatewayModal';
import BookingReceiptModal from './components/BookingReceiptModal';
import ReviewsSection from './components/ReviewsSection';
import CustomTripPlanner from './components/CustomTripPlanner';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { 
  Sparkles, 
  MapPin, 
  Plane, 
  Train, 
  Bus, 
  Calculator, 
  Tag, 
  Luggage, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Search
} from 'lucide-react';
import { formatPrice } from './utils/currency';

export default function App() {
  // Global Data
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [couponsData, setCouponsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // App UI State
  const [currency, setCurrency] = useState('INR');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('go_orbit_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Purge legacy demo users so the website starts fresh
        if (parsed.email === 'rishi.kapoor@example.com' || parsed.id === 'usr-1001' || parsed.email === 'pooja@example.com') {
          localStorage.removeItem('go_orbit_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });
  const [loyaltyTier, setLoyaltyTier] = useState(() => currentUser?.tier || 'standard');
  const [selectedPackageIds, setSelectedPackageIds] = useState([]);

  // Sync user changes to localStorage
  const handleUserLogin = (user) => {
    setCurrentUser(user);
    if (user?.tier) {
      setLoyaltyTier(user.tier);
    }
    try {
      localStorage.setItem('go_orbit_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleUserLogout = async () => {
    setCurrentUser(null);
    setLoyaltyTier('standard');
    try {
      localStorage.removeItem('go_orbit_user');
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {}
  };

  // Modals
  const [detailModalPkg, setDetailModalPkg] = useState(null);
  const [estimatorModalPkg, setEstimatorModalPkg] = useState(null);
  const [checkoutConfig, setCheckoutConfig] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [customTripOpen, setCustomTripOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch initial data & verify active session
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [destRes, pkgRes, revRes, cpnRes] = await Promise.all([
          fetch('/api/destinations').then(r => r.json()),
          fetch('/api/packages').then(r => r.json()),
          fetch('/api/reviews').then(r => r.json()),
          fetch('/api/coupons').then(r => r.json())
        ]);
        setDestinations(destRes);
        setPackages(pkgRes);
        setReviews(revRes);
        setCouponsData(cpnRes);

        // Verify active session via HttpOnly cookie
        try {
          const authMeRes = await fetch('/api/auth/me', { credentials: 'include' });
          if (authMeRes.ok) {
            const authData = await authMeRes.json();
            if (authData.user) {
              setCurrentUser(authData.user);
              if (authData.user.tier) setLoyaltyTier(authData.user.tier);
              localStorage.setItem('go_orbit_user', JSON.stringify(authData.user));
            }
          }
        } catch (authErr) {
          // Session check silent fallback
        }
      } catch (err) {
        console.error('Data loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // Multi-package bundle toggle
  const handleToggleBundle = (pkgId) => {
    if (selectedPackageIds.includes(pkgId)) {
      setSelectedPackageIds(selectedPackageIds.filter(id => id !== pkgId));
    } else {
      setSelectedPackageIds([...selectedPackageIds, pkgId]);
    }
  };

  // Filtered packages
  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = activeCategory === 'all' || pkg.category === activeCategory;
    const matchesSearch = !searchQuery || 
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destinationId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Guaranteed destination package helper
  const getDestinationPackage = (dest) => {
    const found = packages.find(p => p.destinationId === dest.id);
    if (found) return found;

    return {
      id: `pkg-${dest.id}`,
      destinationId: dest.id,
      title: `${dest.name} Tour Experience`,
      category: dest.category,
      badge: 'Verified Tour',
      duration: dest.duration || '5 Days / 4 Nights',
      price: dest.startingPrice,
      originalPrice: Math.round(dest.startingPrice * 1.35),
      rating: dest.rating || 4.8,
      reviewCount: dest.reviewCount || 150,
      image: dest.image,
      gallery: [dest.image, ...(dest.places || []).map(p => p.image)],
      overview: dest.tagline || `Discover the verified attractions of ${dest.name} with premium accommodation and guided excursions.`,
      highlights: (dest.places || []).map(p => p.name),
      itinerary: (dest.places || []).map((p, i) => ({
        day: i + 1,
        title: `${p.name} Excursion`,
        description: p.description,
        meals: 'Breakfast & Dinner Included',
        stay: '4-Star Premium Hotel'
      })),
      inclusions: [
        'Accommodation in handpicked 4-Star hotels/resorts',
        'Daily buffet breakfast and dinners',
        'All sightseeing & transfers in dedicated private AC vehicle',
        'Certified local guide & 24x7 tour coordinator'
      ],
      exclusions: ['Personal expenses & shopping', 'Camera tickets'],
      transportModes: ['flight', 'train', 'bus']
    };
  };

  const activeSeason = (couponsData?.seasonalEvents || []).find(s => s.isActive);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Header Navigation */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleUserLogout}
        onOpenAdmin={() => {
          if (currentUser && (currentUser.email || '').toLowerCase().trim() === 'nidhigupta3139@gmail.com') {
            setAdminOpen(true);
          }
        }}
        onOpenCustomTrip={() => setCustomTripOpen(true)}
        activeTab={activeCategory}
        setActiveTab={setActiveCategory}
        loyaltyTier={loyaltyTier}
        setLoyaltyTier={setLoyaltyTier}
        selectedPackageIds={selectedPackageIds}
        onOpenCartSummary={() => {
          if (packages.length > 0) {
            setEstimatorModalPkg(packages[0]);
          }
        }}
      />

      {/* 2. Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={activeCategory}
        setSelectedCategory={setActiveCategory}
        onOpenCustomTrip={() => setCustomTripOpen(true)}
        activeSeason={activeSeason}
      />

      {/* Multi-Trip Bundle Banner */}
      {selectedPackageIds.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 shadow-md sticky top-[69px] z-30 flex items-center justify-between">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold">
              <Luggage className="w-4 h-4 animate-bounce" />
              <span>
                {selectedPackageIds.length} Packages in Bundle:{' '}
                <strong>{selectedPackageIds.length >= 3 ? '15% Extra Off' : '10% Extra Off'} Active!</strong>
              </span>
            </div>
            <button
              onClick={() => {
                const pkgToEstimate = packages.find(p => p.id === selectedPackageIds[0]) || packages[0];
                setEstimatorModalPkg(pkgToEstimate);
              }}
              className="bg-white text-orange-950 font-black px-3.5 py-1 rounded-lg text-xs hover:bg-amber-100 transition-colors shadow-xs"
            >
              View Bundle Breakdown
            </button>
          </div>
        </div>
      )}

      {/* 3. Destinations & 4-5 Places Section */}
      <DestinationSection
        destinations={destinations}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        currency={currency}
        onSelectDestination={(dest) => {
          const pkg = getDestinationPackage(dest);
          setDetailModalPkg(pkg);
        }}
        onBookDestination={(dest) => {
          const pkg = getDestinationPackage(dest);
          setCheckoutConfig({
            pkg,
            estimateData: null,
            originCity: 'delhi',
            travelMode: pkg.category === 'international' ? 'flight' : 'flight',
            hotelTier: 'deluxe',
            travelersCount: 2,
            roomsCount: 1
          });
        }}
        onOpenEstimatorForDest={(dest) => {
          const pkg = getDestinationPackage(dest);
          setEstimatorModalPkg(pkg);
        }}
      />

      {/* 4. Packages Section with Real-Time Price Estimator & Booking */}
      <section id="packages-section" className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Featured Itineraries</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
                Day-Wise All-Inclusive Packages
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Real-time transport fares, guaranteed hotel stays, certified guides, and transparent amount breakdowns.
              </p>
            </div>

            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-xs text-slate-500 font-medium">
                Showing {filteredPackages.length} tours
              </span>
            </div>
          </div>

          {/* Package Grid */}
          {filteredPackages.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-8 max-w-xl mx-auto">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 font-heading">No Tour Packages Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                No tours match your current search or category filter. Try clearing your search keyword or switching categories.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Clear Search & Show All Tours
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  currency={currency}
                  onViewDetails={(p) => setDetailModalPkg(p)}
                  onOpenEstimator={(p) => setEstimatorModalPkg(p)}
                  onBookNow={(p) => {
                    setCheckoutConfig({
                      pkg: p,
                      estimateData: null,
                      originCity: 'delhi',
                      travelMode: p.category === 'international' ? 'flight' : 'flight',
                      hotelTier: 'deluxe',
                      travelersCount: 2,
                      roomsCount: 1
                    });
                  }}
                  isBundled={selectedPackageIds.includes(pkg.id)}
                  onToggleBundle={handleToggleBundle}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Custom Trip Concierge Banner */}
      <section className="py-12 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300">
              Need a Tailored Itinerary?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Plan A Custom Orbit Trip & Get Instant Estimated Quotes
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Combine multi-destinations (e.g. Kashmir + Ladakh or Dubai + Bali), pick your travel style (Budget / Comfort / 5-Star), and get instant 10%-15% bundle discounts!
            </p>
          </div>

          <button
            onClick={() => setCustomTripOpen(true)}
            className="py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs shadow-lg shadow-amber-400/25 transition-all flex items-center space-x-2 shrink-0 hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-slate-900" />
            <span>Open Custom Trip Architect</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. Customer Reviews & Trip Photo/Video Upload Section */}
      <ReviewsSection
        reviews={reviews}
        onReviewAdded={(newRev) => setReviews([newRev, ...reviews])}
        destinations={destinations}
      />

      {/* 7. Footer */}
      <Footer
        setActiveCategory={setActiveCategory}
        onOpenCustomTrip={() => setCustomTripOpen(true)}
      />

      {/* --- ALL MODALS --- */}

      {/* Modal 1: Day-Wise Package Detail */}
      {detailModalPkg && (
        <PackageDetailModal
          pkg={detailModalPkg}
          onClose={() => setDetailModalPkg(null)}
          currency={currency}
          onOpenEstimator={(p) => {
            setDetailModalPkg(null);
            setEstimatorModalPkg(p);
          }}
          onBookNow={(p) => {
            setDetailModalPkg(null);
            setCheckoutConfig({
              pkg: p,
              estimateData: null,
              originCity: 'delhi',
              travelMode: p.category === 'international' ? 'flight' : 'flight',
              hotelTier: 'deluxe',
              travelersCount: 2,
              roomsCount: 1
            });
          }}
        />
      )}

      {/* Modal 2: Real-time Flight/Train/Bus Travel Cost Breakdown Estimator */}
      {estimatorModalPkg && (
        <CostEstimatorModal
          pkg={estimatorModalPkg}
          onClose={() => setEstimatorModalPkg(null)}
          currency={currency}
          couponsData={couponsData}
          loyaltyTier={loyaltyTier}
          setLoyaltyTier={setLoyaltyTier}
          selectedPackageIds={selectedPackageIds}
          onProceedToCheckout={(cfg) => {
            setEstimatorModalPkg(null);
            setCheckoutConfig(cfg);
          }}
        />
      )}

      {/* Modal 3: Checkout Modal (Passenger Info & Date) */}
      {checkoutConfig && (
        <CheckoutModal
          bookingConfig={checkoutConfig}
          onClose={() => setCheckoutConfig(null)}
          currency={currency}
          currentUser={currentUser}
          onProceedToPayment={(payData) => {
            setCheckoutConfig(null);
            setPaymentData(payData);
          }}
        />
      )}

      {/* Modal 4: Payment Gateway (UPI QR, Card, NetBanking simulation) */}
      {paymentData && (
        <PaymentGatewayModal
          checkoutData={paymentData}
          onClose={() => setPaymentData(null)}
          currency={currency}
          onPaymentSuccess={(confirmed) => {
            setPaymentData(null);
            setConfirmedBooking(confirmed);
          }}
        />
      )}

      {/* Modal 5: Confirmed Booking Invoice & Ticket Receipt */}
      {confirmedBooking && (
        <BookingReceiptModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
          currency={currency}
        />
      )}

      {/* Modal 6: Admin Dashboard - Restricted to nidhigupta3139@gmail.com */}
      {adminOpen && (
        <AdminDashboard
          currentUser={currentUser}
          onClose={() => setAdminOpen(false)}
          currency={currency}
          couponsData={couponsData}
          onRefreshCoupons={() => {
            fetch('/api/coupons').then(r => r.json()).then(setCouponsData);
          }}
        />
      )}

      {/* Modal 7: Custom Trip Planner */}
      {customTripOpen && (
        <CustomTripPlanner
          destinations={destinations}
          onClose={() => setCustomTripOpen(false)}
          currency={currency}
          onBookCustomTrip={(customPkg) => {
            setCustomTripOpen(false);
            setCheckoutConfig({
              pkg: customPkg,
              estimateData: null,
              originCity: 'delhi',
              travelMode: 'flight',
              hotelTier: 'deluxe',
              travelersCount: customPkg.travelers || 2,
              roomsCount: 1
            });
          }}
        />
      )}

      {/* Modal 8: Authentication & Customer Tier Switcher */}
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          currentUser={currentUser}
          onLogin={handleUserLogin}
          onLogout={handleUserLogout}
          setLoyaltyTier={setLoyaltyTier}
        />
      )}
    </div>
  );
}
