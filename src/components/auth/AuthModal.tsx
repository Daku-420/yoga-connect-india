import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Lock,
  Compass,
  User,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  UserPlus
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginWithGoogle, 
    sendOtp, 
    verifyOtp,
    loginWithPassword,
    signUpWithPassword,
    resetPassword,
    loginAsPersona,
    setUserRole,
    setActiveView
  } = useApp();

  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('password');
  const [passwordMode, setPasswordMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset modal state on open/close
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('email');
      setAuthMethod('password');
      setPasswordMode('signin');
      setPassword('');
      setFullName('');
      setShowPassword(false);
      setErrorMsg('');
      setSuccessMsg('');
      setOtpDigits(['', '', '', '', '', '']);
      setResendTimer(30);
    }
  }, [isAuthModalOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isAuthModalOpen) return null;

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginWithGoogle();
      if (res?.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await sendOtp(email);
      if (res.success) {
        setStep('otp');
        setResendTimer(30);
        setSuccessMsg(`We sent a 6-digit verification code to ${email}`);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      } else {
        setErrorMsg(res.error || 'Failed to send OTP code. Please check your email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to request OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      submitVerifyOtp(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtpDigits(digits);
      submitVerifyOtp(pasteData);
    }
  };

  // Submit OTP Verification
  const submitVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await verifyOtp(email, code);
      if (res.success) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMsg(res.error || 'Invalid or expired OTP code. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Sign In
  const handlePasswordSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await loginWithPassword(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Sign Up
  const handlePasswordSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await signUpWithPassword(email, password, fullName);
      if (res.success) {
        if (res.requiresVerification) {
          setSuccessMsg(res.message || 'Account created! Please check your email to confirm.');
        } else {
          setSuccessMsg('Welcome to YogaConnect! Account created.');
        }
      } else {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Reset
  const handleForgotPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await resetPassword(email);
      if (res.success) {
        setSuccessMsg(res.message || 'Password reset instructions have been sent to your email.');
      } else {
        setErrorMsg(res.error || 'Unable to send password reset email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#F7F5EE] rounded-3xl max-w-md w-full border border-[#E2E5DD] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        
        {/* Top Decorative Header */}
        <div className="bg-[#263D32] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#536B50]/30 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#A5B89A]/20 rounded-full blur-2xl" />
          
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-[#A5B89A] hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto mb-3 bg-[#E6EDE2] text-[#263D32] rounded-2xl flex items-center justify-center shadow-inner">
            <Compass className="w-6 h-6 text-[#536B50]" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A5B89A] bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-white/10">
            Traveler Sanctuary Pass
          </span>
          <h2 id="auth-modal-title" className="font-serif font-bold text-2xl text-[#F7F5EE]">
            Sign in to YogaConnect
          </h2>
          <p className="text-xs text-[#E6EDE2]/80 mt-1 max-w-xs mx-auto">
            Manage your retreat inquiries, access escrow payment receipts, and sync saved ashrams.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl flex flex-col space-y-2 text-xs text-[#B42318] animate-in fade-in">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="flex-1">{errorMsg}</span>
              </div>
              {authMethod === 'otp' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('password');
                    setErrorMsg('');
                  }}
                  className="self-start text-[11px] font-bold text-[#263D32] bg-white px-2.5 py-1 rounded-md border border-[#FECDCA] hover:bg-[#F7F5EE] transition cursor-pointer"
                >
                  👉 Switch to Password Login
                </button>
              )}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-[#E6EDE2] border border-[#A5B89A]/50 rounded-xl flex items-start space-x-2 text-xs text-[#286749] animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Google (Gmail) One-Click Login */}
          <div className="space-y-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              aria-label="Continue with Google"
              className="w-full bg-white hover:bg-[#F9FAFB] active:bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#536B50] focus:ring-offset-2 text-[#263D32] border border-[#E2E5DD] hover:border-[#CBD5E1] font-semibold text-sm py-3 px-4 rounded-xl shadow-xs transition flex items-center justify-center space-x-3 cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#536B50]/30 border-t-[#536B50] rounded-full animate-spin" />
              ) : (
                /* Google Colored "G" SVG with standard official colors */
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>
            <p className="text-[11px] text-center text-[#8E9B91]">
              Secure authentication via official Google OAuth
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E2E5DD] w-full" />
            <span className="bg-[#F7F5EE] px-3 text-[10px] font-bold text-[#8E9B91] uppercase tracking-wider shrink-0">
              Or with Email
            </span>
            <div className="border-t border-[#E2E5DD] w-full" />
          </div>

          {/* Dual Mode Switcher Tabs */}
          <div className="flex p-1 bg-[#E2E5DD]/70 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                authMethod === 'otp'
                  ? 'bg-white text-[#263D32] shadow-xs'
                  : 'text-[#59665C] hover:text-[#263D32]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email OTP</span>
              <span className="text-[9px] bg-[#E6EDE2] text-[#286749] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Fast</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                authMethod === 'password'
                  ? 'bg-white text-[#263D32] shadow-xs'
                  : 'text-[#59665C] hover:text-[#263D32]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password</span>
            </button>
          </div>

          {/* 2A. Email OTP Flow */}
          {authMethod === 'otp' && (
            step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. traveler@gmail.com"
                      className="w-full bg-white border border-[#E2E5DD] focus:border-[#536B50] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none shadow-2xs font-medium"
                      autoFocus
                    />
                  </div>
                  <span className="text-[10px] text-[#8E9B91] block mt-1">
                    We'll email a secure 6-digit one-time code to sign in instantly.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#263D32]">Enter 6-Digit Code</span>
                    <span className="text-[11px] text-[#59665C]">Sent to <strong className="text-[#263D32]">{email}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-[11px] text-[#536B50] font-semibold hover:underline cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex justify-between items-center gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      className="w-11 h-12 text-center text-lg font-bold font-mono bg-white border border-[#E2E5DD] focus:border-[#536B50] focus:ring-2 focus:ring-[#536B50]/20 rounded-xl text-[#263D32] shadow-2xs focus:outline-none transition"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => submitVerifyOtp()}
                  disabled={loading || otpDigits.join('').length < 6}
                  className="w-full bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify &amp; Sign In</span>
                    </>
                  )}
                </button>

                {/* Resend Link */}
                <div className="text-center pt-1">
                  {resendTimer > 0 ? (
                    <span className="text-[11px] text-[#8E9B91]">
                      Resend code in <strong className="text-[#59665C]">{resendTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      className="text-[11px] text-[#536B50] font-bold hover:underline inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Resend OTP Code</span>
                    </button>
                  )}
                </div>
              </div>
            )
          )}

          {/* 2B. Email + Password Flow */}
          {authMethod === 'password' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Sign In Mode */}
              {passwordMode === 'signin' && (
                <form onSubmit={handlePasswordSignIn} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. traveler@gmail.com"
                        className="w-full bg-white border border-[#E2E5DD] focus:border-[#536B50] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none shadow-2xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#263D32]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPasswordMode('forgot');
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="text-[11px] text-[#536B50] font-semibold hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-[#E2E5DD] focus:border-[#536B50] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#263D32] focus:outline-none shadow-2xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-[#8E9B91] hover:text-[#263D32] cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1 text-[11px] text-[#59665C]">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordMode('signup');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[#536B50] font-bold hover:underline cursor-pointer"
                    >
                      Create account
                    </button>
                  </div>
                </form>
              )}

              {/* Sign Up Mode */}
              {passwordMode === 'signup' && (
                <form onSubmit={handlePasswordSignUp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-white border border-[#E2E5DD] focus:border-[#536B50] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none shadow-2xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. traveler@gmail.com"
                        className="w-full bg-white border border-[#E2E5DD] focus:border-[#536B50] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none shadow-2xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">
                      Create Password (min. 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-[#E2E5DD] focus:border-[#536B50] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#263D32] focus:outline-none shadow-2xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-[#8E9B91] hover:text-[#263D32] cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1 text-[11px] text-[#59665C]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordMode('signin');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[#536B50] font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* Forgot Password Mode */}
              {passwordMode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-3.5">
                  <div className="text-xs text-[#59665C]">
                    Enter your registered email and we'll send you a password reset link.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. traveler@gmail.com"
                        className="w-full bg-white border border-[#E2E5DD] focus:border-[#536B50] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none shadow-2xs font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Send Reset Instructions</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordMode('signin');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[#536B50] font-bold hover:underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Trust Footer */}
          <div className="pt-3 border-t border-[#E2E5DD] flex items-center justify-center space-x-4 text-[10px] text-[#8E9B91]">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#286749]" />
              <span>Escrow Protected</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-[#536B50]" />
              <span>256-bit Encrypted</span>
            </span>
            <span>•</span>
            <span>Zero Spam Policy</span>
          </div>

        </div>

      </div>
    </div>
  );
};
