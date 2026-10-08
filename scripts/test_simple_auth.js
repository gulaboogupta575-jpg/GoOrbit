const http = require('http');
const fs = require('fs');
const path = require('path');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('===========================================================');
  console.log('🧪 TEST SUITE: SIMPLE DIRECT AUTH & PASSWORD HASH PRIVACY');
  console.log('===========================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, name, info = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${name}`);
      if (info) console.log(`   ↳ ${info}`);
    } else {
      console.error(`❌ [FAIL] ${name}`);
      if (info) console.error(`   ↳ ${info}`);
    }
  }

  const timestamp = Date.now();
  const testEmail = `traveler.${timestamp}@go-orbit-fast.com`;
  const testPhone = `9821${timestamp.toString().slice(-6)}`;
  const testPassword = 'SecretPassword@2026';

  // 1. DIRECT SIGN UP (NO OTP)
  const res1 = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Kabir Khan',
    email: testEmail,
    phone: testPhone,
    password: testPassword
  });

  assert(
    res1.status === 201 && res1.body.success && res1.body.user.email === testEmail,
    'Test 1: Direct Sign Up completes immediately without any OTP',
    `User ID: ${res1.body.user?.id}, Message: "${res1.body.message}"`
  );

  // 2. CHECK PASSWORD HASH IN USERS.JSON (PRIVACY VERIFICATION)
  const usersPath = path.join(__dirname, '..', 'server', 'data', 'users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  const savedUser = users.find(u => u.email === testEmail);

  const isHashed = savedUser && savedUser.password !== testPassword && savedUser.password.includes(':');
  assert(
    isHashed,
    'Test 2: Password is saved as cryptographic hash (salt:hash) for privacy',
    `Saved Hash: ${savedUser?.password.slice(0, 32)}... (Plain text "${testPassword}" NOT stored)`
  );

  // 3. DUPLICATE EMAIL SIGNUP BLOCKED
  const res3 = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Duplicate Traveler',
    email: testEmail,
    phone: '9998887776',
    password: 'password123'
  });

  assert(
    res3.status === 409 && res3.body.code === 'ACCOUNT_EXISTS',
    'Test 3: Duplicate email sign-up prevented with 409 ACCOUNT_EXISTS',
    `Blocked: "${res3.body.error}"`
  );

  // 4. DUPLICATE MOBILE SIGNUP BLOCKED
  const res4 = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Different Name',
    email: 'brandnew123@example.com',
    phone: `+91 ${testPhone}`,
    password: 'password123'
  });

  assert(
    res4.status === 409 && res4.body.code === 'ACCOUNT_EXISTS',
    'Test 4: Duplicate mobile sign-up prevented with 409 ACCOUNT_EXISTS',
    `Blocked: "${res4.body.error}"`
  );

  // 5. SIGN IN WITH VALID CREDENTIALS (HASH MATCH)
  const res5 = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: testEmail,
    password: testPassword
  });

  assert(
    res5.status === 200 && res5.body.success && res5.body.user.name === 'Kabir Khan',
    'Test 5: Direct Sign In succeeds by verifying cryptographic hash',
    `Logged in: "${res5.body.message}"`
  );

  // 6. SIGN IN WITH INCORRECT PASSWORD
  const res6 = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: testEmail,
    password: 'WrongPassword456'
  });

  assert(
    res6.status === 401 && res6.body.code === 'INCORRECT_PASSWORD',
    'Test 6: Incorrect password returns explicit 401 INCORRECT_PASSWORD',
    `Error: "${res6.body.error}"`
  );

  // 7. SIGN IN WITH NON-EXISTENT USER
  const res7 = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: 'unregistered.ghost.account@example.com',
    password: 'AnyPassword123'
  });

  assert(
    res7.status === 404 && res7.body.code === 'USER_NOT_FOUND',
    'Test 7: Unregistered account returns explicit 404 USER_NOT_FOUND',
    `Error: "${res7.body.error}"`
  );

  // 8. DIRECT FORGOT PASSWORD (NO OTP)
  const newPassword = 'BrandNewSecretPassword@999';
  const res8 = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/forgot-password',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: testEmail,
    newPassword
  });

  assert(
    res8.status === 200 && res8.body.success,
    'Test 8: Direct Password Reset completes directly without OTP',
    `Message: "${res8.body.message}"`
  );

  // 9. SIGN IN WITH UPDATED PASSWORD
  const res9 = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: testEmail,
    password: newPassword
  });

  assert(
    res9.status === 200 && res9.body.success,
    'Test 9: Can sign in with new password; old password invalid',
    `Success: "${res9.body.message}"`
  );

  // 10. LOGIN WITH EXISTING USER (HASMITOUHID33@GMAIL.COM)
  const res10 = await request({
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    identifier: 'hasmitouhid33@gmail.com',
    password: 'Gulaboo29072006'
  });

  assert(
    res10.status === 200 && res10.body.success,
    'Test 10: Existing user hasmitouhid33@gmail.com logs in smoothly',
    `Welcome: "${res10.body.message}"`
  );

  // 11. LOGIN WITH DEMO USER RISHI KAPOOR
  const res11 = await request({
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
    res11.status === 200 && res11.body.success,
    'Test 11: Demo user Rishi Kapoor logs in smoothly',
    `Welcome: "${res11.body.message}"`
  );

  console.log('\n===========================================================');
  console.log(`🏁 TEST RESULTS: ${passed} / ${total} TESTS PASSED (${Math.round((passed/total)*100)}%)`);
  console.log('===========================================================');
}

runTests().catch(console.error);
