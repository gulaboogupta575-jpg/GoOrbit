// Verification script for hardened Forgot Password authentication flow
const API_BASE = 'http://localhost:5005';

async function runTests() {
  console.log('--- STARTING FORGOT PASSWORD SECURITY SUITE ---');

  // Test 1: Direct reset attempt without resetTicket (attacker attempt)
  console.log('\n[TEST 1] Attack Attempt: Direct reset without ticket/OTP');
  const res1 = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nidhigupta3139@gmail.com',
      newPassword: 'HackedPassword123!'
    })
  });
  const data1 = await res1.json();
  console.log('Status:', res1.status, 'Body:', data1);
  if (res1.status === 403 && data1.code === 'UNAUTHORIZED_RESET') {
    console.log('PASS: Unauthorized reset without ticket correctly rejected with HTTP 403');
  } else {
    throw new Error('FAIL: Unauthorized reset was not blocked!');
  }

  // Test 2: Request OTP challenge for registered user
  console.log('\n[TEST 2] Step 1: Request OTP for registered account');
  const res2 = await fetch(`${API_BASE}/api/auth/forgot-init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'nidhigupta3139@gmail.com' })
  });
  const data2 = await res2.json();
  console.log('Status:', res2.status, 'Body:', data2);
  if (res2.status === 200 && data2.success && data2.previewOtp) {
    console.log('PASS: Step 1 generated OTP challenge successfully. Preview code:', data2.previewOtp);
  } else {
    throw new Error('FAIL: Step 1 failed to issue OTP challenge');
  }

  const generatedOtp = data2.previewOtp;

  // Test 3: Attack Attempt: Invalid OTP code
  console.log('\n[TEST 3] Attack Attempt: Submitting invalid OTP code (999999)');
  const res3 = await fetch(`${API_BASE}/api/auth/forgot-verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nidhigupta3139@gmail.com',
      otp: '999999'
    })
  });
  const data3 = await res3.json();
  console.log('Status:', res3.status, 'Body:', data3);
  if (res3.status === 401 && data3.code === 'INVALID_OTP') {
    console.log('PASS: Invalid OTP code correctly rejected with HTTP 401');
  } else {
    throw new Error('FAIL: Invalid OTP was not blocked!');
  }

  // Test 4: Step 2: Valid OTP verification
  console.log('\n[TEST 4] Step 2: Submitting valid OTP code');
  const res4 = await fetch(`${API_BASE}/api/auth/forgot-verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nidhigupta3139@gmail.com',
      otp: generatedOtp
    })
  });
  const data4 = await res4.json();
  console.log('Status:', res4.status, 'Body:', data4);
  if (res4.status === 200 && data4.success && data4.resetTicket) {
    console.log('PASS: Step 2 succeeded and issued one-time reset ticket:', data4.resetTicket);
  } else {
    throw new Error('FAIL: Valid OTP failed to issue ticket');
  }

  const validTicket = data4.resetTicket;

  // Test 5: Step 3: Attempt weak password
  console.log('\n[TEST 5] Security Check: Reject weak password');
  const res5 = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nidhigupta3139@gmail.com',
      newPassword: 'short',
      resetTicket: validTicket
    })
  });
  const data5 = await res5.json();
  console.log('Status:', res5.status, 'Body:', data5);
  if (res5.status === 400 && data5.code === 'WEAK_PASSWORD') {
    console.log('PASS: Weak password correctly rejected');
  } else {
    throw new Error('FAIL: Weak password was not rejected!');
  }

  // Test 6: Step 3: Valid reset with ticket
  const NEW_PASSWORD = 'OrbitStrongPassword2026!';
  console.log('\n[TEST 6] Step 3: Reset password with ticket and valid complex password');
  const res6 = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nidhigupta3139@gmail.com',
      newPassword: NEW_PASSWORD,
      resetTicket: validTicket
    })
  });
  const data6 = await res6.json();
  console.log('Status:', res6.status, 'Body:', data6);
  if (res6.status === 200 && data6.success && data6.user) {
    console.log('PASS: Password reset succeeded and session returned!');
  } else {
    throw new Error('FAIL: Password reset failed');
  }

  // Test 7: Replay Attack: Reusing the same reset ticket
  console.log('\n[TEST 7] Attack Attempt: Reusing consumed reset ticket');
  const res7 = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nidhigupta3139@gmail.com',
      newPassword: 'AnotherPassword2026!',
      resetTicket: validTicket
    })
  });
  const data7 = await res7.json();
  console.log('Status:', res7.status, 'Body:', data7);
  if (res7.status === 403 && data7.code === 'UNAUTHORIZED_RESET') {
    console.log('PASS: Ticket replay attack blocked with HTTP 403!');
  } else {
    throw new Error('FAIL: Replay attack was not blocked!');
  }

  // Test 8: Login verification with the new password
  console.log('\n[TEST 8] Login with the new password');
  const res8 = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: 'nidhigupta3139@gmail.com',
      password: NEW_PASSWORD
    })
  });
  const data8 = await res8.json();
  console.log('Status:', res8.status, 'Body:', data8);
  if (res8.status === 200 && data8.success && data8.user.email === 'nidhigupta3139@gmail.com') {
    console.log('PASS: Successfully logged in using the newly reset password!');
  } else {
    throw new Error('FAIL: Login with new password failed!');
  }

  console.log('\nALL 8 FORGOT PASSWORD SECURITY TESTS PASSED WITH 100% SUCCESS!');
}

runTests().catch(err => {
  console.error('TEST ERROR:', err);
  process.exit(1);
});
