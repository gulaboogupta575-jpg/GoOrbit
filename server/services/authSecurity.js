const crypto = require('crypto');

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

module.exports = {
  validatePassword,
  validateEmail,
  createSessionToken,
  verifySessionToken,
  parseCookies,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts
};
