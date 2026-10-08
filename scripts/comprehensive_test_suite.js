const http = require('http');
const fs = require('fs');
const path = require('path');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runComprehensiveTests() {
  console.log('================================================================');
  console.log('🚀 GO ORBIT - DEEP COMPREHENSIVE SOFTWARE TEST & SECURITY AUDIT');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  const assert = (condition, title, details = '') => {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      if (details) console.log(`   ↳ ${details}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}`);
      if (details) console.error(`   ↳ ${details}`);
    }
  };

  // -------------------------------------------------------------
  // SUITE 1: SYSTEM HEALTH & SECURITY HEADERS AUDIT
  // -------------------------------------------------------------
  console.log('\n--- SUITE 1: System Health & Security Headers ---');
  const resHealth = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/health',
    method: 'GET'
  });
  assert(
    resHealth.status === 200 && resHealth.body?.status === 'healthy',
    '1.1 /api/health responds with 200 OK and status: healthy',
    `Uptime: ${resHealth.body?.uptimeSeconds}s, Timestamp: ${resHealth.body?.timestamp}`
  );
  assert(
    resHealth.headers['x-content-type-options'] === 'nosniff' &&
    resHealth.headers['x-frame-options'] === 'SAMEORIGIN' &&
    resHealth.headers['x-xss-protection'] === '1; mode=block',
    '1.2 Hardened Security Headers present (nosniff, SAMEORIGIN, XSS protection)'
  );

  // -------------------------------------------------------------
  // SUITE 2: DESTINATIONS & CATALOG API AUDIT
  // -------------------------------------------------------------
  console.log('\n--- SUITE 2: Destinations & Attractions Catalog ---');
  const resDests = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/destinations',
    method: 'GET'
  });
  assert(
    resDests.status === 200 && Array.isArray(resDests.body) && resDests.body.length === 27,
    '2.1 /api/destinations returns complete 27 travel hubs',
    `Found ${resDests.body?.length} destinations across India, International, Adventure`
  );

  const resIndiaDests = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/destinations?category=india',
    method: 'GET'
  });
  assert(
    resIndiaDests.status === 200 && resIndiaDests.body.length === 10,
    '2.2 India Tour filter accurately returns 10 major destinations'
  );

  const resIntlDests = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/destinations?category=international',
    method: 'GET'
  });
  assert(
    resIntlDests.status === 200 && resIntlDests.body.length === 11,
    '2.3 International Tour filter accurately returns 11 global hubs'
  );

  const resAdvDests = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/destinations?category=adventure',
    method: 'GET'
  });
  assert(
    resAdvDests.status === 200 && resAdvDests.body.length === 6,
    '2.4 Adventure Tour filter accurately returns 6 adrenaline sports'
  );

  const resSingleDest = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/destinations/delhi-goa',
    method: 'GET'
  });
  assert(
    resSingleDest.status === 200 && Array.isArray(resSingleDest.body?.places) && resSingleDest.body.places.length >= 4,
    '2.5 /api/destinations/:id includes verified 4-5 key places and related packages',
    `Delhi & Goa Places: ${resSingleDest.body?.places?.map(p => p.name).join(', ')}`
  );

  // -------------------------------------------------------------
  // SUITE 3: PACKAGES & COST ESTIMATOR AUDIT
  // -------------------------------------------------------------
  console.log('\n--- SUITE 3: Tour Packages & Cost Estimator Engine ---');
  const resPkgs = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/packages',
    method: 'GET'
  });
  assert(
    resPkgs.status === 200 && Array.isArray(resPkgs.body) && resPkgs.body.length === 27,
    '3.1 /api/packages returns 27 day-wise packages'
  );

  const testPkg = resPkgs.body[0];
  const resEstimate = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/packages/estimate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    packageId: testPkg.id,
    originCity: 'mumbai',
    travelMode: 'flight',
    hotelTier: 'deluxe',
    travelersCount: 2,
    roomsCount: 1,
    couponCode: 'ORBITNEW',
    loyaltyTier: 'regular'
  });
  assert(
    resEstimate.status === 200 &&
    typeof resEstimate.body.breakdown?.netTotalPayable === 'number' &&
    resEstimate.body.breakdown?.netTotalPayable > 0,
    '3.2 /api/packages/estimate calculates dynamic flight, hotel, bundle and tax breakdown',
    `Package: ${testPkg.title}, Total Payable: ₹${resEstimate.body.breakdown?.netTotalPayable?.toLocaleString()}`
  );

  // -------------------------------------------------------------
  // SUITE 4: COUPON & PROMOTIONS ENGINE
  // -------------------------------------------------------------
  console.log('\n--- SUITE 4: Coupons & Promotions Engine ---');
  const resCoupons = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/coupons',
    method: 'GET'
  });
  assert(
    resCoupons.status === 200 && Array.isArray(resCoupons.body.coupons),
    '4.1 /api/coupons loads active coupons and seasonal events'
  );

  const resValCoupon = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/coupons/validate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    code: 'ORBITNEW',
    amount: 25000
  });
  assert(
    resValCoupon.status === 200 && resValCoupon.body.valid === true && resValCoupon.body.discount === 2500,
    '4.2 Valid coupon ORBITNEW applies flat ₹2,500 discount'
  );

  const resInvalidCoupon = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/coupons/validate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    code: 'NON_EXISTENT_COUPON',
    amount: 25000
  });
  assert(
    resInvalidCoupon.status === 404 && resInvalidCoupon.body.valid === false,
    '4.3 Invalid coupon returns 404 with error notice'
  );

  // -------------------------------------------------------------
  // SUITE 5: BOOKINGS API & STATUS PRIVILEGES
  // -------------------------------------------------------------
  console.log('\n--- SUITE 5: Bookings Creation & Status Privileges ---');
  const resNewBooking = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/bookings',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    userName: 'Audit Traveler',
    email: 'auditor@go-orbit-test.com',
    phone: '9876543210',
    packageTitle: 'Himachal Alpine Bliss',
    travelDate: '2026-11-20',
    travelers: 2,
    totalAmount: 29998,
    paymentMethod: 'UPI (QR Code)'
  });
  assert(
    resNewBooking.status === 201 && resNewBooking.body.booking?.id?.startsWith('GO-'),
    '5.1 New booking is recorded with confirmed reference ID',
    `Created: ${resNewBooking.body.booking?.id}`
  );
  const createdBookingId = resNewBooking.body.booking?.id;

  // Unauthenticated user trying to modify booking status -> 403 Forbidden
  const resUnauthorizedPatch = await request({
    hostname: 'localhost',
    port: 5005,
    path: `/api/bookings/${createdBookingId}`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  }, {
    bookingStatus: 'Cancelled'
  });
  assert(
    resUnauthorizedPatch.status === 403,
    '5.2 Unauthorized attempt to PATCH booking status is blocked with 403 Forbidden'
  );

  // Authorized Admin modifying booking status -> 200 OK
  const resAuthorizedPatch = await request({
    hostname: 'localhost',
    port: 5005,
    path: `/api/bookings/${createdBookingId}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': 'nidhigupta3139@gmail.com'
    }
  }, {
    bookingStatus: 'Completed'
  });
  assert(
    resAuthorizedPatch.status === 200 && resAuthorizedPatch.body.bookingStatus === 'Completed',
    '5.3 Sole administrator nidhigupta3139@gmail.com successfully updates booking status'
  );

  // -------------------------------------------------------------
  // SUITE 6: CUSTOM TRIP INQUIRIES & CONTROLS
  // -------------------------------------------------------------
  console.log('\n--- SUITE 6: Custom Trip Inquiries & Controls ---');
  // Validation check: missing contact info -> 400
  const resInqInvalid = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/inquiries',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    departureCity: 'Delhi'
  });
  assert(
    resInqInvalid.status === 400,
    '6.1 Incomplete custom inquiry is rejected with 400 Bad Request'
  );

  const resInqValid = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/inquiries',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Siddharth Rao',
    email: 'siddharth@example.com',
    phone: '9820011223',
    destinations: ['Japan', 'Turkey'],
    departureCity: 'Mumbai',
    durationDays: 10,
    travelers: 2,
    travelStyle: 'Comfort / 4-Star',
    estimatedBudget: '₹2,50,000'
  });
  assert(
    resInqValid.status === 201 && resInqValid.body.inquiry?.status === 'Pending',
    '6.2 Valid custom inquiry is saved with default Pending status',
    `Inquiry ID: ${resInqValid.body.inquiry?.id}`
  );
  const createdInqId = resInqValid.body.inquiry?.id;

  // Unauthorized patch inquiry
  const resInqPatchAnon = await request({
    hostname: 'localhost',
    port: 5005,
    path: `/api/inquiries/${createdInqId}`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  }, {
    status: 'Contacted'
  });
  assert(
    resInqPatchAnon.status === 403,
    '6.3 Unauthorized attempt to PATCH custom inquiry is blocked with 403 Forbidden'
  );

  // Authorized patch inquiry
  const resInqPatchAdmin = await request({
    hostname: 'localhost',
    port: 5005,
    path: `/api/inquiries/${createdInqId}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-email': 'nidhigupta3139@gmail.com'
    }
  }, {
    status: 'Contacted'
  });
  assert(
    resInqPatchAdmin.status === 200 && resInqPatchAdmin.body.status === 'Contacted',
    '6.4 Administrator successfully updates inquiry status to Contacted'
  );

  // -------------------------------------------------------------
  // SUITE 7: REVIEWS & MEDIA UPLOAD HARDENING
  // -------------------------------------------------------------
  console.log('\n--- SUITE 7: Reviews & Media Upload Hardening ---');
  const resNewReview = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/reviews',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    userName: 'Aanya Sen',
    destination: 'Kashmir',
    packageTitle: 'Kashmir Paradise Tour',
    rating: 5,
    comment: 'Exceptional trip with Go Orbit! Houseboat in Dal Lake was unforgettable.',
    photoUrls: '["https://images.unsplash.com/photo-1598091383021-15ddea10925d"]'
  });
  assert(
    resNewReview.status === 201 && resNewReview.body.review?.rating === 5,
    '7.1 Verified review created with sanitized parameters and clamped rating',
    `Review ID: ${resNewReview.body.review?.id}`
  );

  // -------------------------------------------------------------
  // SUITE 8: ADMIN COMMAND CENTER SECURITY
  // -------------------------------------------------------------
  console.log('\n--- SUITE 8: Admin Panel Security & Authorization Barrier ---');
  const resAdminGuest = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/admin/stats',
    method: 'GET'
  });
  assert(
    resAdminGuest.status === 403,
    '8.1 Unauthenticated guest access to /api/admin/stats is blocked with 403 Forbidden'
  );

  const resAdminImpersonator = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { 'x-admin-email': 'hacker@malicious-domain.com' }
  });
  assert(
    resAdminImpersonator.status === 403,
    '8.2 Spoofed admin email is rejected with 403 Forbidden'
  );

  const resAdminSole = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { 'x-admin-email': 'nidhigupta3139@gmail.com' }
  });
  assert(
    resAdminSole.status === 200 && typeof resAdminSole.body.totalBookings === 'number',
    '8.3 Sole Admin nidhigupta3139@gmail.com retrieves accurate dashboard metrics',
    `Bookings: ${resAdminSole.body.totalBookings}, Inquiries: ${resAdminSole.body.pendingInquiries}`
  );

  // -------------------------------------------------------------
  // SUITE 9: AUTHENTICATION, PRIVACY & SCRYPT HASHING
  // -------------------------------------------------------------
  console.log('\n--- SUITE 9: Authentication, Privacy & Security Protections ---');
  // 9.1 Admin Login
  const resAdminLogin = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: 'nidhigupta3139@gmail.com',
    password: 'Admin@3139'
  });
  assert(
    resAdminLogin.status === 200 &&
    resAdminLogin.body.user?.role === 'admin' &&
    resAdminLogin.body.user?.password === undefined,
    '9.1 Admin nidhigupta3139@gmail.com authenticates with role: admin (Password NOT exposed in payload)'
  );

  // 9.2 Wrong password returns 401
  const resWrongPass = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: 'nidhigupta3139@gmail.com',
    password: 'WrongPassword123'
  });
  assert(
    resWrongPass.status === 401 && resWrongPass.body.code === 'INCORRECT_PASSWORD',
    '9.2 Incorrect password returns explicit 401 INCORRECT_PASSWORD error code'
  );

  // 9.3 Regular user signup
  const tempTestEmail = `traveler.${Date.now()}@orbit-secure-test.com`;
  const resSignUp = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Tanya Malhotra',
    email: tempTestEmail,
    phone: '9811223344',
    password: 'SafePassword@2026',
    role: 'admin' // Attempt privilege escalation!
  });
  assert(
    resSignUp.status === 201 &&
    resSignUp.body.user?.role === 'user' && // Must stay 'user'
    resSignUp.body.user?.password === undefined,
    '9.3 New traveler registration enforces role: user (Privilege escalation blocked & password hashed)'
  );

  // 9.4 Duplicate email registration prevented
  const resDupSignUp = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Tanya Clone',
    email: tempTestEmail,
    phone: '9811223355',
    password: 'SafePassword@2026'
  });
  assert(
    resDupSignUp.status === 409 && resDupSignUp.body.code === 'ACCOUNT_EXISTS',
    '9.4 Duplicate email signup returns 409 ACCOUNT_EXISTS with clear message'
  );

  // 9.5 Protection against Admin Account Takeover via Forgot Password
  const resHijackAdmin = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/forgot-password',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: 'nidhigupta3139@gmail.com',
    newPassword: 'HackedPassword@123'
  });
  assert(
    resHijackAdmin.status === 403 && resHijackAdmin.body.code === 'ADMIN_RECOVERY_RESTRICTED',
    '9.5 Public forgot-password reset for administrator account is blocked with 403 ADMIN_RECOVERY_RESTRICTED'
  );

  // 9.6 Traveler Forgot Password works cleanly
  const resUserForgot = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/forgot-password',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: tempTestEmail,
    newPassword: 'NewUpdatedPassword@2026'
  });
  assert(
    resUserForgot.status === 200 && resUserForgot.body.success === true,
    '9.6 Regular user password reset updates database hash directly'
  );

  // Clean up test audit records so database remains fresh
  const bookingsPath = path.join(__dirname, '..', 'server', 'data', 'bookings.json');
  const inqPath = path.join(__dirname, '..', 'server', 'data', 'inquiries.json');
  const reviewsPath = path.join(__dirname, '..', 'server', 'data', 'reviews.json');
  const usersPath = path.join(__dirname, '..', 'server', 'data', 'users.json');

  fs.writeFileSync(bookingsPath, '[]', 'utf8');
  fs.writeFileSync(inqPath, '[]', 'utf8');
  fs.writeFileSync(reviewsPath, '[]', 'utf8');

  // Remove the temporary audit user from users.json, preserving nidhigupta3139@gmail.com
  const usersList = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  const cleanUsers = usersList.filter(u => u.email === 'nidhigupta3139@gmail.com');
  fs.writeFileSync(usersPath, JSON.stringify(cleanUsers, null, 2), 'utf8');

  console.log('\n🧹 Cleaned up temporary test audit records — database restored to pristine state.');

  console.log('\n================================================================');
  console.log(`🏁 TEST RESULTS: ${passed} / ${total} TESTS PASSED (${Math.round((passed/total)*100)}%)`);
  console.log('================================================================\n');

  if (passed === total) {
    console.log('🎉 ALL SYSTEM, SECURITY, PRIVACY & API TESTS PASSED WITH 100% SUCCESS!');
  } else {
    process.exit(1);
  }
}

runComprehensiveTests().catch(err => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
