import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Sparkles, 
  KeyRound, 
  LogOut,
  ChevronLeft,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  setLoyaltyTier
}) {
  // Navigation mode: 'signin' | 'signup' | 'forgot' | 'profile'
  const [mode, setMode] = useState('signin');

  // --- Sign In States ---
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // --- Sign Up States ---
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupShowPassword, setSignupShowPassword] = useState(false);

  // --- Forgot Password States (2-Step Flow) ---
  const [forgotStep, setForgotStep] = useState(1); // 1: Find Account, 2: Set New Password
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotAccountInfo, setForgotAccountInfo] = useState(null);
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotShowPassword, setForgotShowPassword] = useState(false);

  // --- Feedback States ---
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset or initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setMode('profile');
      } else {
        setMode('signin');
      }
      setErrorMsg('');
      setErrorCode('');
      setSuccessMsg('');
      setLoading(false);
    }
  }, [isOpen, currentUser]);

  // Clear errors when mode changes
  const switchMode = (newMode) => {
    setErrorMsg('');
    setErrorCode('');
    setSuccessMsg('');
    setMode(newMode);
    if (newMode === 'forgot') {
      setForgotStep(1);
      setForgotPassword('');
      setForgotConfirmPassword('');
      if (loginIdentifier && !forgotIdentifier) {
        setForgotIdentifier(loginIdentifier.trim());
      }
    }
  };

  if (!isOpen) return null;

  // ==============================================================
  // 1. SIGN IN SUBMISSION
  // ==============================================================
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setErrorCode('');
    setSuccessMsg('');

    const id = loginIdentifier.trim();
    const pass = loginPassword.trim();

    if (!id || !pass) {
      setErrorMsg('Please enter both your email/phone and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: id, password: pass })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorCode(data.code || '');
        setErrorMsg(data.error || 'Failed to sign in. Please verify your credentials.');
        setLoading(false);
        return;
      }

      // Successful sign in
      onLogin(data.user);
      if (setLoyaltyTier && data.user.tier) {
        setLoyaltyTier(data.user.tier);
      }
      setSuccessMsg(`Welcome back, ${data.user.name}!`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg('Unable to reach server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  // 2. SIGN UP SUBMISSION
  // ==============================================================
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setErrorCode('');
    setSuccessMsg('');

    const name = signupName.trim();
    const email = signupEmail.trim();
    const phone = signupPhone.trim();
    const pass = signupPassword.trim();
    const confirm = signupConfirmPassword.trim();

    if (!name || !email || !phone || !pass) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (pass.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (pass !== confirm) {
      setErrorMsg('Passwords do not match. Please verify and re-type.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password: pass
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorCode(data.code || '');
        setErrorMsg(data.error || 'Registration failed. Email or phone may already exist.');
        setLoading(false);
        return;
      }

      // Automatically sign in the newly registered account
      onLogin(data.user);
      if (setLoyaltyTier && data.user.tier) {
        setLoyaltyTier(data.user.tier);
      }
      setSuccessMsg(`Account created! Welcome to Go Orbit, ${data.user.name}.`);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setErrorMsg('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  // 3. FORGOT PASSWORD - STEP 1: VERIFY ACCOUNT
  // ==============================================================
  const handleVerifyAccount = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setErrorCode('');
    setSuccessMsg('');

    const identifier = forgotIdentifier.trim();
    if (!identifier) {
      setErrorMsg('Please enter your registered email address or mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorCode(data.code || '');
        setErrorMsg(data.error || 'No registered account found with this email or mobile.');
        setLoading(false);
        return;
      }

      // Account verified! Move to step 2
      setForgotAccountInfo({
        name: data.userName,
        email: data.userEmail,
        phone: data.userPhone
      });
      setForgotStep(2);
      setSuccessMsg(`Account found for ${data.userName}! Enter your new password below.`);
    } catch (err) {
      setErrorMsg('Network error. Unable to verify account.');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================
  // 4. FORGOT PASSWORD - STEP 2: SET NEW PASSWORD
  // ==============================================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setErrorCode('');
    setSuccessMsg('');

    const identifier = forgotIdentifier.trim();
    const pass = forgotPassword.trim();
    const confirm = forgotConfirmPassword.trim();

    if (!pass || !confirm) {
      setErrorMsg('Please enter and confirm your new password.');
      return;
    }

    if (pass.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (pass !== confirm) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          newPassword: pass
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorCode(data.code || '');
        setErrorMsg(data.error || 'Failed to update password. Please try again.');
        setLoading(false);
        return;
      }

      // Automatically sign in the user with their newly updated password
      if (data.user) {
        onLogin(data.user);
        if (setLoyaltyTier && data.user.tier) {
          setLoyaltyTier(data.user.tier);
        }
      }
      setSuccessMsg('Password updated successfully! Welcome back.');
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setErrorMsg('Network error. Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-up">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Back button when in forgot mode */}
          {mode === 'forgot' && (
            <button
              onClick={() => {
                if (forgotStep === 2) {
                  setForgotStep(1);
                  setErrorMsg('');
                  setSuccessMsg('');
                } else {
                  switchMode('signin');
                }
              }}
              className="flex items-center space-x-1 text-xs text-blue-200 hover:text-white mb-2 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{forgotStep === 2 ? 'Back to Account Lookup' : 'Back to Sign In'}</span>
            </button>
          )}

          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2.5 shadow-xs">
            {mode === 'profile' ? (
              <User className="w-6 h-6 text-amber-300" />
            ) : mode === 'forgot' ? (
              <KeyRound className="w-6 h-6 text-amber-300" />
            ) : (
              <Sparkles className="w-6 h-6 text-amber-300" />
            )}
          </div>

          <h3 className="text-xl font-extrabold font-heading text-white">
            {mode === 'profile' && 'Your Travel Passport'}
            {mode === 'signin' && 'Sign In to Go Orbit'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && (forgotStep === 1 ? 'Find Your Account' : 'Set New Password')}
          </h3>

          <p className="text-xs text-blue-100 mt-1">
            {mode === 'profile' && 'Manage your member tier & exclusive discounts'}
            {mode === 'signin' && 'Enter your registered credentials to access your account'}
            {mode === 'signup' && 'Join Go Orbit for instant 5% explorer member discount'}
            {mode === 'forgot' && (forgotStep === 1 
              ? 'Enter your registered email or mobile to verify your account' 
              : 'Choose a strong new password to regain access')}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Specialized Alert: Account Already Exists */}
          {errorMsg && errorCode === 'ACCOUNT_EXISTS' && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2.5 animate-shake shadow-xs">
              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 bg-amber-200/80 rounded-xl text-amber-800 shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                </div>
                <div className="flex-1">
                  <h5 className="font-extrabold text-xs text-amber-950 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>Account Already Exists</span>
                    <span className="bg-amber-200 text-amber-900 text-[9px] px-1.5 py-0.2 rounded font-black">Registered</span>
                  </h5>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed font-semibold">
                    {errorMsg}
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier(signupEmail || signupPhone || '');
                    setLoginPassword('');
                    switchMode('signin');
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Sign In with This Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Specialized Alert: Incorrect Password */}
          {errorMsg && errorCode === 'INCORRECT_PASSWORD' && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2.5 animate-shake shadow-xs">
              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 bg-rose-200/80 rounded-xl text-rose-800 shrink-0 mt-0.5">
                  <Lock className="w-5 h-5 text-rose-700" />
                </div>
                <div className="flex-1">
                  <h5 className="font-extrabold text-xs text-rose-950 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>Incorrect Password</span>
                    <span className="bg-rose-200 text-rose-900 text-[9px] px-1.5 py-0.2 rounded font-black">Mismatch</span>
                  </h5>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed font-semibold">
                    {errorMsg}
                  </p>
                </div>
              </div>
              <div className="pt-1 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setForgotIdentifier(loginIdentifier);
                    switchMode('forgot');
                  }}
                  className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Forgot Password? Reset Here</span>
                </button>
              </div>
            </div>
          )}

          {/* Specialized Alert: User Not Found */}
          {errorMsg && errorCode === 'USER_NOT_FOUND' && (
            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-300 text-sky-950 space-y-2.5 animate-shake shadow-xs">
              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 bg-sky-200/80 rounded-xl text-sky-800 shrink-0 mt-0.5">
                  <User className="w-5 h-5 text-sky-700" />
                </div>
                <div className="flex-1">
                  <h5 className="font-extrabold text-xs text-sky-950 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>Account Not Found</span>
                    <span className="bg-sky-200 text-sky-900 text-[9px] px-1.5 py-0.2 rounded font-black">Unregistered</span>
                  </h5>
                  <p className="text-xs text-sky-800 mt-1 leading-relaxed font-semibold">
                    {errorMsg}
                  </p>
                </div>
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSignupEmail(mode === 'signin' ? loginIdentifier : forgotIdentifier);
                    switchMode('signup');
                  }}
                  className="w-full py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Sign Up for a New Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Generic Error Alert */}
          {errorMsg && !['ACCOUNT_EXISTS', 'INCORRECT_PASSWORD', 'USER_NOT_FOUND'].includes(errorCode) && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start space-x-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="font-bold text-xs leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Success Notification */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="font-semibold text-xs leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 1: SIGN IN                                                */}
          {/* ============================================================== */}
          {mode === 'signin' && (
            <div className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Address or Mobile Number
                  </label>
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. you@example.com or mobile number"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotIdentifier(loginIdentifier);
                        switchMode('forgot');
                      }}
                      className="text-blue-600 hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type={loginShowPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                    />
                    <button
                      type="button"
                      onClick={() => setLoginShowPassword(!loginShowPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                      tabIndex={-1}
                    >
                      {loginShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-600 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <span>Remember me on this browser</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'Signing In...' : 'Sign In to Go Orbit'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Sign up toggle */}
              <div className="text-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">Don't have an account yet? </span>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 2: SIGN UP (SAVED WITH CRYPTOGRAPHIC HASH)                */}
          {/* ============================================================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hasmi Touhid"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Create Password</label>
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
                    <input
                      type={signupShowPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 chars"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirm Password</label>
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
                    <input
                      type={signupShowPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-type password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                    />
                    <button
                      type="button"
                      onClick={() => setSignupShowPassword(!signupShowPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                      tabIndex={-1}
                    >
                      {signupShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Match Indicator */}
              {signupConfirmPassword && (
                <div className="flex items-center space-x-1.5 text-[11px] font-semibold">
                  {signupPassword === signupConfirmPassword ? (
                    <span className="text-emerald-600 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Passwords match</span>
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Passwords do not match yet</span>
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Your password is encrypted with cryptographic scrypt hashing for privacy.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 border-t border-slate-100">
                <span className="text-slate-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* MODE 3: FORGOT PASSWORD (2-STEP VERIFIED FLOW)                  */}
          {/* ============================================================== */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {/* Step 1: Look up and verify account */}
              {forgotStep === 1 && (
                <form onSubmit={handleVerifyAccount} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Registered Email Address or Mobile Number
                    </label>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. name@example.com or 9876543210"
                        value={forgotIdentifier}
                        onChange={(e) => {
                          setForgotIdentifier(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Enter the email address or phone number you used when creating your Go Orbit account.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{loading ? 'Finding Account...' : 'Find & Verify Account'}</span>
                  </button>

                  <div className="text-center pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Remember your password? Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Set New Password */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  {/* Verified Account Badge */}
                  {forgotAccountInfo && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <div className="font-extrabold text-blue-950 text-xs">
                            {forgotAccountInfo.name}
                          </div>
                          <div className="text-[11px] text-blue-700">
                            {forgotAccountInfo.email}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForgotStep(1)}
                        className="text-[11px] text-blue-600 hover:underline font-bold"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">New Password</label>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type={forgotShowPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 6 characters"
                        value={forgotPassword}
                        onChange={(e) => {
                          setForgotPassword(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                      />
                      <button
                        type="button"
                        onClick={() => setForgotShowPassword(!forgotShowPassword)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-hidden cursor-pointer"
                        tabIndex={-1}
                      >
                        {forgotShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white transition-all">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type={forgotShowPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-type new password"
                        value={forgotConfirmPassword}
                        onChange={(e) => {
                          setForgotConfirmPassword(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-hidden border-none p-0"
                      />
                    </div>
                  </div>

                  {/* Password Match Indicator */}
                  {forgotConfirmPassword && (
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold">
                      {forgotPassword === forgotConfirmPassword ? (
                        <span className="text-emerald-600 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Passwords match</span>
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Passwords do not match yet</span>
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{loading ? 'Saving Password...' : 'Save Password & Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Cancel & Return to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* MODE 4: PROFILE (WHEN LOGGED IN)                               */}
          {/* ============================================================== */}
          {mode === 'profile' && currentUser && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto text-2xl font-black shadow-md border-2 border-blue-200">
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900 font-heading">
                  {currentUser.name}
                </h4>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
                {currentUser.phone && (
                  <p className="text-[11px] text-slate-400">{currentUser.phone}</p>
                )}
              </div>

              {/* Loyalty Tier card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Membership Status
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    currentUser.tier === 'vip' 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}>
                    {currentUser.tier === 'vip' ? '★ VIP Gold Pioneer' : '✓ Regular Explorer'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-600">Exclusive Tour Discount:</span>
                  <span className="font-extrabold text-emerald-600 text-sm">
                    {currentUser.tier === 'vip' ? '10% Auto Discount' : '5% Auto Discount'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200/60 pt-2">
                  All package and flight quotes automatically apply your member discount at checkout!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onLogout();
                  if (setLoyaltyTier) setLoyaltyTier('standard');
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 mt-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
