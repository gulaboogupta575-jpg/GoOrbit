const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Secret for HMAC session token signing
const SESSION_SECRET = process.env.SESSION_SECRET || 'go_orbit_super_secure_session_secret_2026_xyz';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Validates password complexity:
 * Minimum 8 characters, at least 1 digit, at least 1 special character
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required.' };
  }
  const clean = password.trim();
  if (clean.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!/\d/.test(clean)) {
    return { valid: false, error: 'Password must include at least one number (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(clean)) {
    return { valid: false, error: 'Password must include at least one special character (e.g. !@#$%^&*).' };
  }
  return { valid: true, password: clean };
}

/**
 * Validates email format according to standard email RFC
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  // Standard RFC 5322 simplified regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(clean);
}

/**
 * Creates cryptographically signed session token:
 * payload_base64url.signature_hex
 */
function createSessionToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role || 'user',
    tier: user.tier || 'regular',
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');
  return `${payloadStr}.${signature}`;
}

/**
 * Verifies signed session token and returns decoded payload if valid and not expired
 */
function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadStr, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');

  // Timing safe equal comparison
  const sigBuffer = Buffer.from(signature, 'hex');
  const expBuffer = Buffer.from(expectedSignature, 'hex');
  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Parses cookies from HTTP request header
 */
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      cookies[name] = decodeURIComponent(val);
    }
  });
  return cookies;
}

/**
 * In-memory rate limiting against brute force password attacks
 * Max 5 failed attempts per IP or identifier within 15 minutes window
 */
const failedAttemptsMap = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 mins

function checkRateLimit(key) {
  if (!key) return { allowed: true };
  const record = failedAttemptsMap.get(key);
  if (!record) return { allowed: true };

  if (Date.now() > record.resetTime) {
    failedAttemptsMap.delete(key);
    return { allowed: true };
  }

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    const remainingSec = Math.ceil((record.resetTime - Date.now()) / 1000);
    return {
      allowed: false,
      remainingSec,
      error: `Too many failed login attempts. For security, please try again in ${Math.ceil(remainingSec / 60)} minutes.`
    };
  }

  return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS - record.count };
}

function recordFailedAttempt(key) {
  if (!key) return;
  const now = Date.now();
  const record = failedAttemptsMap.get(key) || { count: 0, resetTime: now + LOCKOUT_DURATION_MS };
  record.count += 1;
  record.resetTime = now + LOCKOUT_DURATION_MS;
  failedAttemptsMap.set(key, record);
}

function clearFailedAttempts(key) {
  if (!key) return;
  failedAttemptsMap.delete(key);
}

/**
 * In-memory storage for OTP verification challenges and reset tickets
 */
const otpStore = new Map();
const resetTicketStore = new Map();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const TICKET_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Generates a cryptographically random 6-digit OTP
 */
function generateOTP(email) {
  const cleanEmail = email.toLowerCase().trim();
  // Generate random 6-digit number
  const otp = Math.floor(100000 + crypto.randomInt(900000)).toString();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  otpStore.set(cleanEmail, {
    otp,
    expiresAt,
    attempts: 0
  });

  // Cross-process test support (local testing only)
  try {
    const testOtpPath = path.join(__dirname, '..', 'data', '.test_otp.json');
    let testData = {};
    if (fs.existsSync(testOtpPath)) {
      try { testData = JSON.parse(fs.readFileSync(testOtpPath, 'utf8')); } catch (e) {}
    }
    testData[cleanEmail] = otp;
    fs.writeFileSync(testOtpPath, JSON.stringify(testData), 'utf8');
  } catch (e) {}

  return { otp, expiresAt };
}

/**
 * Verifies the submitted OTP against stored challenge
 */
function verifyOTP(email, submittedOtp) {
  const cleanEmail = email.toLowerCase().trim();
  const record = otpStore.get(cleanEmail);

  if (!record) {
    return { valid: false, error: 'No verification code was requested or the code has expired. Please request a new code.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return { valid: false, error: 'Verification code has expired. Please request a new code.' };
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    otpStore.delete(cleanEmail);
    return { valid: false, error: 'Too many incorrect attempts. Please request a new verification code.' };
  }

  if (record.otp !== submittedOtp.toString().trim()) {
    return { valid: false, error: 'Incorrect verification code. Please check and try again.' };
  }

  // OTP verified! Invalidate OTP to prevent replay
  otpStore.delete(cleanEmail);

  // Issue a one-time cryptographic reset ticket
  const resetTicket = crypto.randomBytes(32).toString('hex');
  resetTicketStore.set(resetTicket, {
    email: cleanEmail,
    expiresAt: Date.now() + TICKET_EXPIRY_MS
  });

  return { valid: true, resetTicket };
}

/**
 * Checks whether a reset ticket is valid without consuming it yet
 */
function isValidResetTicket(resetTicket, email) {
  if (!resetTicket || typeof resetTicket !== 'string') return false;
  const cleanEmail = (email || '').toLowerCase().trim();
  const record = resetTicketStore.get(resetTicket);

  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    resetTicketStore.delete(resetTicket);
    return false;
  }
  return record.email === cleanEmail;
}

/**
 * Validates and consumes the one-time reset ticket
 */
function consumeResetTicket(resetTicket, email) {
  if (!resetTicket || typeof resetTicket !== 'string') return false;
  const cleanEmail = (email || '').toLowerCase().trim();
  const record = resetTicketStore.get(resetTicket);

  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    resetTicketStore.delete(resetTicket);
    return false;
  }
  if (record.email !== cleanEmail) return false;

  // Consume ticket immediately (one-time use)
  resetTicketStore.delete(resetTicket);
  return true;
}

/**
 * Inspection helper for test assertions (never exposed via HTTP APIs)
 */
function getActiveOTPForTesting(email) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const record = otpStore.get(cleanEmail);
  if (record) return record.otp;
  try {
    const testOtpPath = path.join(__dirname, '..', 'data', '.test_otp.json');
    if (fs.existsSync(testOtpPath)) {
      const testData = JSON.parse(fs.readFileSync(testOtpPath, 'utf8'));
      return testData[cleanEmail] || null;
    }
  } catch (e) {}
  return null;
}

module.exports = {
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
  consumeResetTicket,
  getActiveOTPForTesting
};
