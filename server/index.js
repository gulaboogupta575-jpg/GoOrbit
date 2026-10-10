const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Automatically load .env configuration if present
const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(envFile);
  } catch (e) {
    console.warn('[Go Orbit] Notice: Could not load .env file:', e.message);
  }
}

const {
  validatePassword,
  validateEmail,
  createSessionToken,
  verifySessionToken,
  parseCookies,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  generateOTP,
  verifyOTP,
  isValidResetTicket,
  consumeResetTicket
} = require('./services/authSecurity');

const { sendPasswordResetOTP } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5005;

// CORS with credentials support for HttpOnly cookies
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Custom cookie parsing middleware
app.use((req, res, next) => {
  req.cookies = parseCookies(req.headers.cookie);
  next();
});

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage for media uploads (trip photos & videos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// Helper functions to read & write JSON files
const getData = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
};

const saveData = (filename, data) => {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// System Health & Uptime Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Go Orbit Travel Engine',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

/* ----------------------------------------------------
   ADMIN ACCESS CONTROL (STRICT: nidhigupta3139@gmail.com)
----------------------------------------------------- */
const ADMIN_EMAIL = 'nidhigupta3139@gmail.com';

const requireAdminAccess = (req, res, next) => {
  const callerEmail = (
    req.headers['x-admin-email'] ||
    req.headers['x-user-email'] ||
    req.query.adminEmail ||
    req.query.email ||
    (req.body && (req.body.adminEmail || req.body.email)) ||
    ''
  ).toString().toLowerCase().trim();

  if (!callerEmail || callerEmail !== ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: Administrative controls and panel access are strictly restricted to nidhigupta3139@gmail.com.'
    });
  }

  const users = getData('users.json');
  const user = users.find(u => (u.email || '').toLowerCase().trim() === ADMIN_EMAIL);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: Administrator role privileges not active for this account.'
    });
  }

  req.adminUser = user;
  next();
};

/* ----------------------------------------------------
   1. DESTINATIONS API
----------------------------------------------------- */
app.get('/api/destinations', (req, res) => {
  const destinations = getData('destinations.json');
  const { category, search } = req.query;

  let results = [...destinations];
  if (category && category !== 'all') {
    results = results.filter(d => d.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      (d.state && d.state.toLowerCase().includes(q)) ||
      d.places.some(p => p.name.toLowerCase().includes(q))
    );
  }

  res.json(results);
});

app.get('/api/destinations/:id', (req, res) => {
  const destinations = getData('destinations.json');
  const packages = getData('packages.json');
  const dest = destinations.find(d => d.id === req.params.id);

  if (!dest) {
    return res.status(404).json({ error: 'Destination not found' });
  }

  const relatedPackages = packages.filter(p => p.destinationId === dest.id);
  res.json({ ...dest, packages: relatedPackages });
});

/* ----------------------------------------------------
   2. PACKAGES API
----------------------------------------------------- */
app.get('/api/packages', (req, res) => {
  const packages = getData('packages.json');
  const { category, destinationId, maxPrice, search } = req.query;

  let results = [...packages];
  if (category && category !== 'all') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (destinationId) {
    results = results.filter(p => p.destinationId === destinationId);
  }
  if (maxPrice) {
    results = results.filter(p => p.price <= parseInt(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.overview.toLowerCase().includes(q) ||
      p.highlights.some(h => h.toLowerCase().includes(q))
    );
  }

  res.json(results);
});

app.get('/api/packages/:id', (req, res) => {
  const packages = getData('packages.json');
  const pkg = packages.find(p => p.id === req.params.id);
  if (!pkg) {
    return res.status(404).json({ error: 'Package not found' });
  }
  res.json(pkg);
});

/* ----------------------------------------------------
   3. REAL-TIME TRAVEL COST ESTIMATOR API
----------------------------------------------------- */
// Realistic pricing matrix based on departure cities and destination regions
const originDistanceMatrix = {
  delhi: { baseFlightMultiplier: 1.0, baseTrainMultiplier: 0.9, baseBusMultiplier: 0.8 },
  mumbai: { baseFlightMultiplier: 1.1, baseTrainMultiplier: 1.1, baseBusMultiplier: 1.0 },
  bengaluru: { baseFlightMultiplier: 1.25, baseTrainMultiplier: 1.3, baseBusMultiplier: 1.2 },
  kolkata: { baseFlightMultiplier: 1.2, baseTrainMultiplier: 1.15, baseBusMultiplier: 1.1 },
  chennai: { baseFlightMultiplier: 1.3, baseTrainMultiplier: 1.35, baseBusMultiplier: 1.25 },
  hyderabad: { baseFlightMultiplier: 1.15, baseTrainMultiplier: 1.1, baseBusMultiplier: 1.05 },
  ahmedabad: { baseFlightMultiplier: 1.05, baseTrainMultiplier: 1.0, baseBusMultiplier: 0.95 }
};

const handleEstimator = (req, res) => {
  const {
    packageId,
    originCity = 'delhi',
    travelMode = 'flight', // 'flight' | 'train' | 'bus'
    hotelTier = 'deluxe', // 'standard' | 'deluxe' | 'luxury'
    travelersCount = 1,
    roomsCount = 1,
    couponCode = '',
    loyaltyTier = 'standard', // 'standard' | 'regular' | 'vip'
    selectedPackagesCount = 1
  } = req.body;

  const packages = getData('packages.json');
  const couponsData = getData('coupons.json');
  const pkg = packages.find(p => p.id === packageId) || packages[0];

  const cityKey = originCity.toLowerCase();
  const mult = originDistanceMatrix[cityKey] || { baseFlightMultiplier: 1.0, baseTrainMultiplier: 1.0, baseBusMultiplier: 1.0 };

  const isInternational = pkg.category === 'international';
  const isAdventure = pkg.category === 'adventure';

  // Base Package Cost (Activities, Sightseeing & Local Logistics)
  const perPersonBase = pkg.price;
  const packageTotal = perPersonBase * travelersCount;

  // Real-time Transport Pricing Simulation
  let transportPerPerson = 0;
  let transportDetails = {};

  if (isInternational) {
    // Only flights valid for international
    const intlBaseFlights = {
      dubai: 24000,
      japan: 58000,
      bali: 29000,
      turkey: 42000,
      switzerland: 62000,
      london: 54000,
      paris: 56000,
      singapore: 26000,
      malaysia: 22000,
      maldives: 28000,
      usa: 88000
    };
    const destKey = pkg.destinationId.toLowerCase();
    const flightRate = (intlBaseFlights[destKey] || 35000) * mult.baseFlightMultiplier;
    transportPerPerson = Math.round(flightRate);
    transportDetails = {
      mode: 'Flight',
      airline: 'Emirates / Singapore Airlines / Air India partner',
      type: 'Economy Roundtrip Ticket',
      baggage: 'Check-in 25-30kg + Cabin 7kg included',
      duration: 'Direct / 1-Stop Fast Connection',
      ratePerPerson: transportPerPerson
    };
  } else {
    // Domestic India & Adventure routes
    if (travelMode === 'flight') {
      const flightBase = isAdventure ? 5500 : 7500;
      transportPerPerson = Math.round(flightBase * mult.baseFlightMultiplier);
      transportDetails = {
        mode: 'Flight',
        airline: 'IndiGo / Air India / Vistara',
        type: 'Fastest Transit (Morning/Afternoon Departure)',
        baggage: '15kg Check-in + 7kg Cabin',
        duration: '1h 45m - 2h 50m Direct',
        ratePerPerson: transportPerPerson
      };
    } else if (travelMode === 'train') {
      const trainBase = isAdventure ? 1600 : 2800;
      transportPerPerson = Math.round(trainBase * mult.baseTrainMultiplier);
      transportDetails = {
        mode: 'Train (IRCTC Rail)',
        trainName: 'Vande Bharat / Rajdhani / Shatabdi Express',
        type: 'AC 3-Tier / AC Chair Car Confirmed Berth',
        baggage: 'Up to 40kg free allowance',
        duration: 'Scenic overland mountain/coastal journey',
        ratePerPerson: transportPerPerson
      };
    } else {
      // Luxury AC Sleeper Bus
      const busBase = isAdventure ? 1100 : 1800;
      transportPerPerson = Math.round(busBase * mult.baseBusMultiplier);
      transportDetails = {
        mode: 'Bus (AC Volvo)',
        busOperator: 'IntrCity / Zingbus / Private Multi-axle Volvo',
        type: 'AC Multi-axle Luxury Sleeper with charging points',
        baggage: '20kg Luggage bay allowance',
        duration: 'Overnight comfortable sleeper travel',
        ratePerPerson: transportPerPerson
      };
    }
  }

  const transportTotal = transportPerPerson * travelersCount;

  // Hotel Stay Tier adjustment (Per Room / Nights)
  let hotelUpgradePerRoom = 0;
  let hotelTierLabel = 'Standard 3-Star Resort (Included)';
  if (hotelTier === 'deluxe') {
    hotelUpgradePerRoom = isInternational ? 4000 : 1800;
    hotelTierLabel = 'Deluxe 4-Star Premium Hotel (+ Pool & Mountain/Sea View)';
  } else if (hotelTier === 'luxury') {
    hotelUpgradePerRoom = isInternational ? 10000 : 4500;
    hotelTierLabel = 'Luxury 5-Star Heritage / Villa Experience (+ Bathtub & VIP Club)';
  }
  const hotelUpgradeTotal = hotelUpgradePerRoom * roomsCount;

  // Local transfers & private chauffeur allowance
  const localCabAndGuide = isInternational ? 3500 * travelersCount : 1500 * travelersCount;

  // Sightseeing, entrance monument passes & permits
  const sightseeingFees = isInternational ? 4500 * travelersCount : 1200 * travelersCount;

  // Meals & Hospitality Plan
  const mealsAndBeverages = 1800 * travelersCount;

  // Gross Subtotal
  const grossSubtotal = packageTotal + transportTotal + hotelUpgradeTotal + localCabAndGuide + sightseeingFees + mealsAndBeverages;

  // 1. Coupon Discount Calculation
  let couponDiscount = 0;
  let couponMessage = '';
  if (couponCode) {
    const foundCoupon = (couponsData.coupons || []).find(
      c => c.code.toUpperCase() === couponCode.trim().toUpperCase()
    );
    if (foundCoupon) {
      if (grossSubtotal >= foundCoupon.minSpend) {
        if (foundCoupon.type === 'flat') {
          couponDiscount = foundCoupon.value;
        } else {
          const calc = Math.round((grossSubtotal * foundCoupon.value) / 100);
          couponDiscount = foundCoupon.maxDiscount ? Math.min(calc, foundCoupon.maxDiscount) : calc;
        }
        couponMessage = `Applied ${foundCoupon.code}: -₹${couponDiscount.toLocaleString()}`;
      } else {
        couponMessage = `Coupon requires minimum spend of ₹${foundCoupon.minSpend.toLocaleString()}`;
      }
    } else {
      couponMessage = 'Invalid coupon code';
    }
  }

  // 2. Multi-Package / Multi-Destination Bundle Discount
  let bundleDiscount = 0;
  let bundleLabel = 'None';
  if (selectedPackagesCount >= 3) {
    bundleDiscount = Math.round(grossSubtotal * 0.15);
    bundleLabel = 'Grand Tour Bundle (3+ Destinations) - 15% OFF';
  } else if (selectedPackagesCount === 2) {
    bundleDiscount = Math.round(grossSubtotal * 0.10);
    bundleLabel = 'Double Destination Bundle (2 Destinations) - 10% OFF';
  }

  // 3. Old / Regular Customer Loyalty Tier Discount
  let loyaltyDiscount = 0;
  let loyaltyLabel = 'Orbit Starter (0%)';
  if (loyaltyTier === 'regular') {
    loyaltyDiscount = Math.round(grossSubtotal * 0.05);
    loyaltyLabel = 'Orbit Explorer (Regular Customer) - 5% OFF';
  } else if (loyaltyTier === 'vip') {
    loyaltyDiscount = Math.round(grossSubtotal * 0.10);
    loyaltyLabel = 'Orbit Pioneer (VIP Gold Elite) - 10% OFF';
  }

  // 4. Seasonal Event Discount
  let seasonalDiscount = 0;
  let seasonalTitle = 'None';
  const activeSeason = (couponsData.seasonalEvents || []).find(s => s.isActive);
  if (activeSeason) {
    seasonalDiscount = Math.round(grossSubtotal * (activeSeason.discountPercent / 100));
    seasonalTitle = `${activeSeason.title} (${activeSeason.discountPercent}% OFF)`;
  }

  const totalDiscounts = couponDiscount + bundleDiscount + loyaltyDiscount + seasonalDiscount;
  const taxableAmount = Math.max(0, grossSubtotal - totalDiscounts);

  // Government Taxes & GST (5% for tour packages in India)
  const gstAmount = Math.round(taxableAmount * 0.05);
  const netTotalPayable = taxableAmount + gstAmount;

  res.json({
    packageId: pkg.id,
    packageTitle: pkg.title,
    originCity,
    travelMode,
    hotelTier,
    travelersCount,
    roomsCount,
    transportDetails,
    breakdown: {
      packageBaseTotal: packageTotal,
      transportTotal,
      hotelUpgradeTotal,
      hotelTierLabel,
      localCabAndGuide,
      sightseeingFees,
      mealsAndBeverages,
      grossSubtotal,
      discounts: {
        coupon: { code: couponCode, amount: couponDiscount, message: couponMessage },
        bundle: { label: bundleLabel, amount: bundleDiscount },
        loyalty: { label: loyaltyLabel, amount: loyaltyDiscount },
        seasonal: { label: seasonalTitle, amount: seasonalDiscount },
        totalDiscounts
      },
      taxableAmount,
      gstAmount,
      netTotalPayable
    }
  });
};

app.post('/api/estimator', handleEstimator);
app.post('/api/packages/estimate', handleEstimator);

/* ----------------------------------------------------
   4. COUPONS & PROMOTIONS API
----------------------------------------------------- */
app.get('/api/coupons', (req, res) => {
  const couponsData = getData('coupons.json');
  res.json(couponsData);
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, amount = 0, category = 'all' } = req.body;
  const couponsData = getData('coupons.json');
  const foundCoupon = (couponsData.coupons || []).find(
    c => c.code.toUpperCase() === (code || '').trim().toUpperCase()
  );

  if (!foundCoupon) {
    return res.status(404).json({ valid: false, message: 'Invalid coupon code.' });
  }

  if (amount < foundCoupon.minSpend) {
    return res.status(400).json({
      valid: false,
      message: `Minimum booking spend of ₹${foundCoupon.minSpend.toLocaleString()} required.`
    });
  }

  let discount = 0;
  if (foundCoupon.type === 'flat') {
    discount = foundCoupon.value;
  } else {
    const calc = Math.round((amount * foundCoupon.value) / 100);
    discount = foundCoupon.maxDiscount ? Math.min(calc, foundCoupon.maxDiscount) : calc;
  }

  res.json({
    valid: true,
    code: foundCoupon.code,
    discount,
    description: foundCoupon.description
  });
});

/* ----------------------------------------------------
   5. BOOKINGS & PAYMENT API
----------------------------------------------------- */
app.get('/api/bookings', (req, res) => {
  const bookings = getData('bookings.json');
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const bookings = getData('bookings.json');
  const bookingData = req.body || {};

  const todayStr = new Date().toISOString().split('T')[0];
  const requestedDate = (bookingData.travelDate || todayStr).toString().trim();

  // Reject booking of dates that have already passed
  if (requestedDate < todayStr) {
    return res.status(400).json({
      success: false,
      error: 'Invalid travel date. Bookings for dates that have already passed are not allowed. Please choose today or a future date.'
    });
  }

  const customerName = (bookingData.userName || bookingData.name || bookingData.customerName || 'Traveler').toString().trim().slice(0, 80);
  const customerEmail = (bookingData.email || bookingData.customerEmail || '').toString().trim().toLowerCase().slice(0, 120);
  const customerPhone = (bookingData.phone || bookingData.customerPhone || '').toString().trim().slice(0, 30);
  const packageTitle = (bookingData.packageTitle || bookingData.packageName || 'Go Orbit Tour Package').toString().trim().slice(0, 150);

  const newBookingId = 'GO-' + Math.floor(100000 + Math.random() * 900000);
  const newBooking = {
    id: newBookingId,
    ...bookingData,
    userName: customerName,
    name: customerName,
    email: customerEmail,
    phone: customerPhone,
    packageTitle,
    travelDate: requestedDate,
    travelers: parseInt(bookingData.travelers || bookingData.travelersCount) || 1,
    travelMode: bookingData.travelMode || 'flight',
    hotelTier: bookingData.hotelTier || 'standard',
    totalAmount: Number(bookingData.totalAmount || bookingData.netAmount) || 0,
    paymentMethod: (bookingData.paymentMethod || 'Online').toString().slice(0, 60),
    paymentStatus: bookingData.paymentStatus || 'Paid',
    bookingStatus: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  saveData('bookings.json', bookings);

  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully!',
    booking: newBooking
  });
});

app.patch('/api/bookings/:id', requireAdminAccess, (req, res) => {
  const bookings = getData('bookings.json');
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  bookings[index] = { ...bookings[index], ...req.body };
  saveData('bookings.json', bookings);
  res.json(bookings[index]);
});

/* ----------------------------------------------------
   6. REVIEWS & MEDIA UPLOAD API
----------------------------------------------------- */
app.get('/api/reviews', (req, res) => {
  const reviews = getData('reviews.json');
  const { destination } = req.query;

  let results = [...reviews];
  if (destination) {
    results = results.filter(r => r.destination.toLowerCase().includes(destination.toLowerCase()));
  }
  res.json(results);
});

app.post('/api/reviews', upload.array('photos', 5), (req, res) => {
  const reviews = getData('reviews.json');
  const { userName, destination, packageTitle, rating, comment, videoUrl } = req.body;

  const uploadedPhotos = (req.files || []).map(f => `/uploads/${f.filename}`);
  let photos = [];
  try {
    photos = req.body.photoUrls ? JSON.parse(req.body.photoUrls) : [];
    if (!Array.isArray(photos)) photos = [];
  } catch (e) {
    photos = [];
  }

  const numericRating = Math.max(1, Math.min(5, parseInt(rating) || 5));

  const newReview = {
    id: 'rev-' + Date.now(),
    userName: (userName || 'Anonymous Traveler').trim().slice(0, 80),
    userAvatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=150&q=80`,
    destination: (destination || 'General Trip').trim().slice(0, 100),
    packageTitle: (packageTitle || 'Go Orbit Tour').trim().slice(0, 120),
    rating: numericRating,
    date: new Date().toISOString().split('T')[0],
    comment: (comment || '').trim().slice(0, 1000),
    photos: [...photos, ...uploadedPhotos].slice(0, 10),
    videoUrl: (videoUrl || '').trim().slice(0, 250),
    verified: true,
    likes: 0
  };

  reviews.unshift(newReview);
  saveData('reviews.json', reviews);

  res.status(201).json({
    success: true,
    message: 'Review and media uploaded successfully!',
    review: newReview
  });
});

/* ----------------------------------------------------
   7. CUSTOM TRIP PLANNER / ENQUIRY API
----------------------------------------------------- */
app.get('/api/inquiries', (req, res) => {
  const inquiries = getData('inquiries.json');
  res.json(inquiries);
});

app.post('/api/inquiries', (req, res) => {
  const inquiries = getData('inquiries.json');
  const { name, email, phone, destinations, departureCity, travelDates, durationDays, travelers, travelStyle, preferredTransport, estimatedBudget, specialRequests } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, email, and phone number are required to submit an inquiry.' 
    });
  }

  const newInquiry = {
    id: 'INQ-' + Math.floor(1000 + Math.random() * 9000),
    name: name.toString().trim().slice(0, 100),
    email: email.toString().trim().toLowerCase().slice(0, 120),
    phone: phone.toString().trim().slice(0, 30),
    destinations: destinations || [],
    departureCity: departureCity || 'Delhi',
    travelDates: travelDates || '',
    durationDays: parseInt(durationDays) || 7,
    travelers: parseInt(travelers) || 2,
    travelStyle: travelStyle || 'Comfort / 4-Star',
    preferredTransport: preferredTransport || 'Flight + Private Cab',
    estimatedBudget: estimatedBudget || '',
    specialRequests: (specialRequests || '').toString().trim().slice(0, 500),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  saveData('inquiries.json', inquiries);

  res.status(201).json({
    success: true,
    message: 'Custom trip inquiry received! Our travel specialist will curate your itinerary.',
    inquiry: newInquiry
  });
});

app.patch('/api/inquiries/:id', requireAdminAccess, (req, res) => {
  const inquiries = getData('inquiries.json');
  const index = inquiries.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  inquiries[index] = { ...inquiries[index], ...req.body };
  saveData('inquiries.json', inquiries);
  res.json(inquiries[index]);
});

/* ----------------------------------------------------
   8. ADMIN DASHBOARD STATS & CONTROLS (RESTRICTED TO nidhigupta3139@gmail.com)
----------------------------------------------------- */
app.get('/api/admin/stats', requireAdminAccess, (req, res) => {
  const bookings = getData('bookings.json');
  const inquiries = getData('inquiries.json');
  const reviews = getData('reviews.json');
  const packages = getData('packages.json');

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalBookings = bookings.length;
  const pendingInquiries = inquiries.filter(i => i.status === 'Pending').length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : '5.0';

  res.json({
    totalRevenue,
    totalBookings,
    pendingInquiries,
    averageRating,
    totalPackages: packages.length,
    totalReviews: reviews.length
  });
});

/* ----------------------------------------------------
   9. AUTHENTICATION & SECURE CREDENTIALS API (NO OTP)
----------------------------------------------------- */
// Secure Password Hashing & Verification (scrypt with random 16-byte salt)
const hashPassword = (password) => {
  const cleanPass = (password || '').toString().trim();
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(cleanPass, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedPassword) => {
  if (!storedPassword || typeof storedPassword !== 'string' || !password) return false;
  // If stored password is plain text (legacy migration), compare directly
  if (!storedPassword.includes(':')) {
    return storedPassword === password || storedPassword === password.toString().trim();
  }
  const [salt, key] = storedPassword.split(':');
  if (!salt || !key) return false;
  try {
    const keyBuffer = Buffer.from(key, 'hex');
    const cleanPass = password.toString().trim();

    // 1. Check direct trimmed password
    const derivedKey = crypto.scryptSync(cleanPass, salt, 64);
    if (keyBuffer.length === derivedKey.length && crypto.timingSafeEqual(keyBuffer, derivedKey)) {
      return true;
    }

    // 2. Also check raw password if different (accommodates passwords with intentional spacing)
    if (password !== cleanPass) {
      const derivedRaw = crypto.scryptSync(password.toString(), salt, 64);
      if (keyBuffer.length === derivedRaw.length && crypto.timingSafeEqual(keyBuffer, derivedRaw)) {
        return true;
      }
    }

    return false;
  } catch (err) {
    return false;
  }
};

// Helper to normalize phone numbers (extracts trailing 10 digits for standard Indian / international numbers)
const normalizePhone = (phoneStr) => {
  if (!phoneStr) return '';
  const digits = phoneStr.toString().replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

// Helper to find a user by email OR mobile phone
const findUserByIdentifier = (users, identifier) => {
  if (!identifier) return null;
  const clean = identifier.toString().trim().toLowerCase();
  const digits = clean.replace(/\D/g, '');
  const digits10 = digits.length >= 10 ? digits.slice(-10) : digits;

  return users.find(u => {
    const uEmail = (u.email || '').trim().toLowerCase();
    const uPhoneDigits = (u.phone || '').toString().replace(/\D/g, '');
    const uPhone10 = uPhoneDigits.length >= 10 ? uPhoneDigits.slice(-10) : uPhoneDigits;

    // Direct email match
    if (uEmail && uEmail === clean) return true;

    // Exact phone digits match
    if (digits && uPhoneDigits && uPhoneDigits === digits) return true;

    // Normalized 10-digit mobile phone match (handles +91, 0, or formatted numbers)
    if (digits10 && digits10.length >= 7 && uPhone10 && uPhone10 === digits10) return true;

    return false;
  });
};

const sanitizeUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  tier: u.tier || 'regular',
  role: u.role || 'user',
  isVerified: !!u.isVerified,
  createdAt: u.createdAt,
  lastLogin: u.lastLogin
});

// 9.1 Secure Sign Up -> Saves account with scrypt password hash in database
const handleDirectSignUp = (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide full name, email, mobile number, and password.' 
    });
  }

  // 1. Validate password complexity (>= 8 chars, 1 digit, 1 special char)
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.valid) {
    return res.status(400).json({
      success: false,
      error: passwordCheck.error
    });
  }

  const cleanPass = passwordCheck.password;
  const cleanEmail = email.toString().toLowerCase().trim();
  const cleanPhone = phone.toString().trim().replace(/\D/g, '');

  // 2. Validate email format
  if (!validateEmail(cleanEmail)) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid email address (e.g. name@example.com).'
    });
  }

  // 3. Validate phone number length
  if (cleanPhone.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid 10-digit mobile number.'
    });
  }

  const users = getData('users.json');

  // 4. Check duplicate email
  const existingByEmail = users.find(u => (u.email || '').toLowerCase().trim() === cleanEmail);
  if (existingByEmail) {
    return res.status(409).json({
      success: false,
      code: 'ACCOUNT_EXISTS',
      error: `An account with email "${cleanEmail}" already exists. Please sign in to your existing account.`,
      existingEmail: existingByEmail.email,
      existingPhone: existingByEmail.phone
    });
  }

  // 5. Check duplicate phone
  const phone10 = normalizePhone(cleanPhone);
  const existingByPhone = users.find(u => normalizePhone(u.phone) === phone10);
  if (existingByPhone) {
    return res.status(409).json({
      success: false,
      code: 'ACCOUNT_EXISTS',
      error: `An account with mobile number "${phone}" already exists. Please sign in to your existing account.`,
      existingEmail: existingByPhone.email,
      existingPhone: existingByPhone.phone
    });
  }

  // 6. Create new user with hashed password (Only nidhigupta3139@gmail.com has admin role)
  const isSoleAdmin = cleanEmail === ADMIN_EMAIL;
  const newUser = {
    id: 'usr-' + Date.now(),
    name: name.toString().trim(),
    email: cleanEmail,
    phone: cleanPhone,
    password: hashPassword(cleanPass),
    tier: isSoleAdmin ? 'vip' : 'regular',
    role: isSoleAdmin ? 'admin' : 'user',
    isVerified: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  users.push(newUser);
  saveData('users.json', users);

  console.log(`[Go Orbit Auth] User Registered (Password Hashed): ${newUser.email} (ID: ${newUser.id})`);

  // Create session token & set HttpOnly cookie
  const sessionToken = createSessionToken(newUser);
  res.cookie('auth_token', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully! Welcome to Go Orbit.',
    token: sessionToken,
    user: sanitizeUser(newUser)
  });
};

app.post('/api/auth/signup', handleDirectSignUp);
app.post('/api/auth/register', handleDirectSignUp);
app.post('/api/auth/register-init', handleDirectSignUp);
app.post('/api/auth/register-verify', handleDirectSignUp);

// 9.2 Secure Sign In -> Authenticates with Email/Phone & Hashed Password with rate limiting
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const rateLimitKey = `${clientIp}_${(identifier || '').toString().toLowerCase().trim()}`;

  // Check rate limiter against brute-force attacks
  const rateLimitStatus = checkRateLimit(rateLimitKey);
  if (!rateLimitStatus.allowed) {
    return res.status(429).json({
      success: false,
      code: 'TOO_MANY_REQUESTS',
      error: rateLimitStatus.error
    });
  }

  if (!identifier || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please enter your registered email or mobile number, and password.' 
    });
  }

  const users = getData('users.json');
  const user = findUserByIdentifier(users, identifier);

  // Generic credential verification error defense to mitigate account enumeration
  if (!user || !verifyPassword(password, user.password)) {
    recordFailedAttempt(rateLimitKey);
    return res.status(401).json({ 
      success: false, 
      code: 'INVALID_CREDENTIALS',
      error: 'Invalid email/mobile or password. Please verify your credentials and try again.' 
    });
  }

  // Clear failed attempts counter on success
  clearFailedAttempts(rateLimitKey);

  // If user had a legacy plaintext password, upgrade to hash automatically
  if (!user.password.includes(':')) {
    user.password = hashPassword(password);
  }

  // Update last login timestamp & save
  user.lastLogin = new Date().toISOString();
  saveData('users.json', users);

  console.log(`[Go Orbit Auth] User logged in: ${user.email}`);

  // Create cryptographic session token & set HttpOnly cookie
  const sessionToken = createSessionToken(user);
  res.cookie('auth_token', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token: sessionToken,
    user: sanitizeUser(user)
  });
});

// 9.3 Authenticated Password Recovery: Step 1 - Send 6-Digit Verification OTP
app.post('/api/auth/forgot-init', async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please enter your registered email address or mobile number.' 
    });
  }

  const users = getData('users.json');
  const user = findUserByIdentifier(users, identifier);

  if (!user) {
    return res.status(404).json({ 
      success: false, 
      code: 'USER_NOT_FOUND', 
      error: 'No registered account found with this email or mobile number.' 
    });
  }

  // Generate cryptographically secure OTP for authentication challenge
  const { otp, expiresAt } = generateOTP(user.email);
  console.log(`[Go Orbit Auth Security] Password Reset OTP challenge initiated for ${user.email}`);

  // Dispatch email directly to the registered user's email address
  try {
    await sendPasswordResetOTP(user.email, user.name, otp);
  } catch (mailErr) {
    console.error('[Go Orbit Auth Security] Failed to dispatch verification email:', mailErr.message);
  }

  // Mask email: j***n@example.com
  const emailParts = user.email.split('@');
  const maskedName = emailParts[0].length <= 2 
    ? emailParts[0][0] + '***' 
    : emailParts[0][0] + '***' + emailParts[0].slice(-1);
  const maskedEmail = `${maskedName}@${emailParts[1]}`;

  // STRICT SECURITY: Never send the OTP code back to the client!
  // The code can ONLY be accessed by the authentic owner of that email account.
  res.json({ 
    success: true, 
    message: `A 6-digit security verification code has been dispatched to ${maskedEmail}. Please check your email inbox.`,
    userEmail: user.email,
    maskedEmail,
    userName: user.name,
    expiresAt
  });
});

// 9.4 Authenticated Password Recovery: Step 2 - Verify OTP & Issue One-Time Reset Ticket
app.post('/api/auth/forgot-verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      error: 'Please provide your registered email and the 6-digit verification code.'
    });
  }

  const result = verifyOTP(email, otp);
  if (!result.valid) {
    return res.status(401).json({
      success: false,
      code: 'INVALID_OTP',
      error: result.error
    });
  }

  res.json({
    success: true,
    message: 'Identity verified successfully! You may now set your new password.',
    resetTicket: result.resetTicket
  });
});

// 9.5 Authenticated Password Recovery: Step 3 - Set New Password with One-Time Reset Ticket
const handleDirectForgot = (req, res) => {
  const { email, identifier, newPassword, resetTicket } = req.body;
  const userIdentifier = email || identifier;

  if (!userIdentifier || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide your email and new password.' 
    });
  }

  const users = getData('users.json');
  const user = findUserByIdentifier(users, userIdentifier);

  if (!user) {
    return res.status(404).json({ 
      success: false, 
      code: 'USER_NOT_FOUND', 
      error: 'No registered account found with this email or mobile number.' 
    });
  }

  // Security enforcement: require valid cryptographic one-time reset ticket
  if (!resetTicket || !isValidResetTicket(resetTicket, user.email)) {
    return res.status(403).json({
      success: false,
      code: 'UNAUTHORIZED_RESET',
      error: 'Security Verification Required: You must verify your identity via the one-time verification code before changing the password.'
    });
  }

  const passwordCheck = validatePassword(newPassword);
  if (!passwordCheck.valid) {
    return res.status(400).json({ 
      success: false, 
      code: 'WEAK_PASSWORD',
      error: passwordCheck.error 
    });
  }

  // Atomically consume reset ticket now that password passes all security requirements
  if (!consumeResetTicket(resetTicket, user.email)) {
    return res.status(403).json({
      success: false,
      code: 'UNAUTHORIZED_RESET',
      error: 'Security reset ticket has already been used or expired.'
    });
  }

  const cleanPass = passwordCheck.password;

  // Hash new password and save to database
  user.password = hashPassword(cleanPass);
  user.lastLogin = new Date().toISOString();
  saveData('users.json', users);

  console.log(`[Go Orbit Auth Security] Password successfully verified & updated (Hashed) for: ${user.email}`);

  // Create session token & set HttpOnly cookie
  const sessionToken = createSessionToken(user);
  res.cookie('auth_token', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    message: 'Your identity was verified and your password has been securely updated! Welcome back.',
    token: sessionToken,
    user: sanitizeUser(user)
  });
};

app.post('/api/auth/forgot-password', handleDirectForgot);
app.post('/api/auth/forgot-verify', handleDirectForgot);

// 9.5 Session Invalidation / Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    sameSite: 'lax'
  });
  res.json({
    success: true,
    message: 'Signed out successfully.'
  });
});

// 9.6 Current User Profile check via HttpOnly cookie or bearer token
app.get('/api/auth/me', (req, res) => {
  const token = req.cookies.auth_token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (token) {
    const session = verifySessionToken(token);
    if (session && session.email) {
      const users = getData('users.json');
      const user = users.find(u => u.email.toLowerCase() === session.email.toLowerCase());
      if (user) {
        return res.json({ success: true, user: sanitizeUser(user) });
      }
    }
  }

  // Fallback to explicit query / header
  const email = (req.query.email || req.headers['x-user-email'] || '').toLowerCase().trim();
  if (email) {
    const users = getData('users.json');
    const user = users.find(u => u.email.toLowerCase() === email);
    if (user) {
      return res.json({ success: true, user: sanitizeUser(user) });
    }
  }

  res.status(401).json({ success: false, error: 'Unauthorized: No active session.' });
});

// Serve frontend production build (SPA)
const distPath = path.join(__dirname, '..', 'dist');
console.log(`[Go Orbit] Frontend assets directory: ${distPath} (Exists: ${fs.existsSync(distPath)})`);

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

app.listen(PORT, () => {
  console.log(`[Go Orbit] Server running smoothly on http://localhost:${PORT}`);
});
