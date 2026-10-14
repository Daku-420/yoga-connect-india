'use client';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Building2, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Compass,
  ArrowLeft
} from 'lucide-react';

interface VendorLoginScreenProps {
  onSuccess?: () => void;
  restrictedReason?: string;
}

export const VendorLoginScreen: React.FC<VendorLoginScreenProps> = ({ 
  onSuccess,
  restrictedReason 
}) => {
  const { 
    loginWithPassword, 
    resetPassword, 
    userProfile, 
    logout,
    setActiveView 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(restrictedReason || '');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid ashram contact email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginWithPassword(email, password);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.error || 'Failed to authenticate vendor account. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during vendor sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter your registered vendor email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await resetPassword(email);
      if (res.success) {
        setSuccessMsg(res.message || 'Password reset instructions dispatched to your email.');
      } else {
        setErrorMsg(res.error || 'Unable to dispatch password reset email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">

        {/* Back Link */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.location.pathname !== '/') {
              window.location.href = '/';
            } else {
              setActiveView('home');
            }
          }}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#59665C] hover:text-[#263D32] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to YogaConnect India Homepage</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#E2E5DD] shadow-2xl overflow-hidden relative">
          
          {/* Header Banner */}
          <div className="text-center space-y-3 pb-6 border-b border-[#E2E5DD]">
            <div className="w-16 h-16 bg-[#263D32] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Building2 className="w-8 h-8 text-[#DCCDB5]" />
            </div>

            <div>
              <span className="bg-[#E6EDE2] text-[#286749] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#A5B89A]/50 inline-block mb-1">
                Yoga Centre Partner Portal
              </span>
              <h1 className="text-2xl font-serif font-bold text-[#263D32]">
                Vendor Sanctuary Sign In
              </h1>
              <p className="text-xs text-[#59665C] mt-1 max-w-xs mx-auto leading-relaxed">
                Secure access for accredited ashram coordinators and retreat managers across India.
              </p>
            </div>
          </div>

          {/* If user is logged in as standard traveler, inform them */}
          {userProfile && userProfile.role !== 'admin' && userProfile.role !== 'centre' && userProfile.role !== 'partner' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2 my-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Currently Logged in as Traveler</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Your active session (<strong>{userProfile.email}</strong>) is a Customer Sanctuary account. To access the Vendor Dashboard, sign in with your approved Yoga Centre credentials.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="w-full bg-white hover:bg-amber-100 text-amber-900 py-1.5 px-3 rounded-lg border border-amber-300 font-semibold text-[11px] transition cursor-pointer"
              >
                Sign Out of Traveler Account
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl flex items-start space-x-2 text-xs text-[#B42318] my-4 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-[#E6EDE2] border border-[#A5B89A]/50 rounded-xl flex items-start space-x-2 text-xs text-[#286749] my-4 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="flex-1">{successMsg}</span>
            </div>
          )}

          {/* Form */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-[#263D32] uppercase tracking-wider mb-1.5">
                  Ashram Contact Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@ashram-rishikesh.in"
                    required
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] focus:border-[#536B50] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-[#263D32] placeholder-[#8E9B91] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#263D32] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] text-[#536B50] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] focus:border-[#536B50] focus:bg-white rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium text-[#263D32] placeholder-[#8E9B91] focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#8E9B91] hover:text-[#263D32] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#263D32] hover:bg-[#1E3228] active:bg-[#14231B] text-[#F7F5EE] py-3 px-4 rounded-xl text-xs font-bold transition shadow flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Vendor Sanctuary</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-[#263D32] uppercase tracking-wider mb-1.5">
                  Registered Vendor Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@ashram-rishikesh.in"
                    required
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] focus:border-[#536B50] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-[#263D32] placeholder-[#8E9B91] focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#536B50] hover:bg-[#40563E] text-white py-3 px-4 rounded-xl text-xs font-bold transition shadow flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Send Password Reset Instructions</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="w-full text-center text-xs text-[#59665C] hover:text-[#263D32] font-semibold py-1 cursor-pointer"
              >
                ← Back to Vendor Sign In
              </button>
            </form>
          )}

          {/* Security Assurance */}
          <div className="mt-6 pt-5 border-t border-[#E2E5DD] flex items-center justify-center space-x-2 text-[11px] text-[#59665C]">
            <ShieldCheck className="w-4 h-4 text-[#286749]" />
            <span>256-Bit SSL Escrow Protected Vendor Access</span>
          </div>

        </div>

        {/* New Centre Registration Info */}
        <div className="bg-[#E6EDE2] rounded-2xl p-5 border border-[#A5B89A]/50 text-center space-y-2">
          <h2 className="text-xs font-bold text-[#263D32] uppercase tracking-wider">
            Not yet registered on YogaConnect India?
          </h2>
          <p className="text-xs text-[#59665C] leading-relaxed">
            New yoga centre and ashram partnerships require verification by our platform administrator. 
            To apply for accreditation and receive an invitation, email <strong className="text-[#263D32]">partners@yogaconnectindia.com</strong> with your ashram credentials.
          </p>
        </div>

      </div>
    </div>
  );
};
