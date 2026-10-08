const http = require('http');

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
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== ADMIN AUTHORIZATION TESTS (STRICT ACCESS: nidhigupta3139@gmail.com) ===\n');
  let passed = 0;
  let total = 0;

  const assert = (condition, title) => {
    total++;
    if (condition) {
      console.log(`[PASS] ${title}`);
      passed++;
    } else {
      console.error(`[FAIL] ${title}`);
    }
  };

  // Test 1: Guest / No header on /api/admin/stats -> 403 Forbidden
  const resGuest = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/admin/stats',
    method: 'GET'
  });
  assert(resGuest.status === 403, `1. Unauthenticated guest access to /api/admin/stats returns 403 Forbidden (Got: ${resGuest.status})`);

  // Test 2: Standard user (rishi.kapoor@example.com) -> 403 Forbidden
  const resRishi = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { 'x-admin-email': 'rishi.kapoor@example.com' }
  });
  assert(resRishi.status === 403, `2. Standard user (rishi.kapoor@example.com) returns 403 Forbidden (Got: ${resRishi.status})`);

  // Test 3: Former admin (admin@go-orbit.travel) -> 403 Forbidden
  const resFormerAdmin = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { 'x-admin-email': 'admin@go-orbit.travel' }
  });
  assert(resFormerAdmin.status === 403, `3. Former staff (admin@go-orbit.travel) returns 403 Forbidden (Got: ${resFormerAdmin.status})`);

  // Test 4: Sole Admin (nidhigupta3139@gmail.com) -> 200 OK with valid stats
  const resNidhi = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { 'x-admin-email': 'nidhigupta3139@gmail.com' }
  });
  assert(
    resNidhi.status === 200 && typeof resNidhi.body.totalRevenue === 'number' && typeof resNidhi.body.totalBookings === 'number',
    `4. Sole Admin (nidhigupta3139@gmail.com) returns 200 OK with analytics data (Bookings: ${resNidhi.body?.totalBookings})`
  );

  // Test 5: Login as Sole Admin nidhigupta3139@gmail.com
  const loginNidhi = await request({
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
    loginNidhi.status === 200 && loginNidhi.body.user?.role === 'admin' && loginNidhi.body.user?.email === 'nidhigupta3139@gmail.com',
    `5. Sign in as Nidhi Gupta succeeds with role: 'admin' (User: ${loginNidhi.body.user?.name})`
  );

  // Test 6: Login as Rishi Kapoor
  const loginRishi = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: 'rishi.kapoor@example.com',
    password: 'Password123'
  });
  assert(
    loginRishi.status === 200 && loginRishi.body.user?.role === 'user',
    `6. Sign in as Rishi Kapoor succeeds with role: 'user' (User: ${loginRishi.body.user?.name})`
  );

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed}/${total} tests passed (${Math.round((passed/total)*100)}%)`);
  console.log(`========================================`);
}

runTests().catch(console.error);
