'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../src/context/AppContext';
import { AdminDashboard } from '../../src/components/dashboards/AdminDashboard';
import { 
  ShieldAlert, 
  LogIn, 
  ArrowLeft, 
  Crown, 
  Building2, 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  LogOut
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { 
    userProfile, 
    loginWithPassword, 
    loginWithGoogle, 
    loginAsPersona, 
    setUserRole, 
    setActiveView, 
    logout 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid administrator email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your administrator account password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. If in mock/dev or using the platform admin persona credentials
      if (cleanEmail === 'admin@yogaconnect.in') {
        loginAsPersona('admin@yogaconnect.in');
        setUserRole('admin');
        setActiveView('admin-dashboard');
        setLoading(false);
        return;
      }

      // 2. Try live Supabase password login
      const res = await loginWithPassword(cleanEmail, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid administrator credentials. Access denied.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAdminSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginWithGoogle('/admin');
      if (res?.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Administrator authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    loginAsPersona('admin@yogaconnect.in');
    setUserRole('admin');
    setActiveView('admin-dashboard');
  };

  // 1. Unauthenticated Visitor — Show Dedicated Admin Sign-In (NO SIGN-UP / NO REGISTRATION)
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#F7F5EE] flex flex-col justify-center items-center p-4 py-12">
        
        {/* Navigation Return */}
        <div className="max-w-md w-full mb-4">
          <button
            onClick={() => router.push('/')}
            className="text-xs font-semibold text-[#59665C] hover:text-[#263D32] flex items-center space-x-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to YogaConnect India</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl max-w-md w-full border border-[#E2E5DD] shadow-2xl overflow-hidden animate-in fade-in">
          
          {/* Top Hero Banner */}
          <div className="bg-[#263D32] p-8 text-white text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#536B50]/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />

            <div className="w-14 h-14 rounded-2xl bg-white/10 text-gold-400 flex items-center justify-center mx-auto mb-3 border border-white/10 shadow-inner">
              <Crown className="w-7 h-7 text-gold-400" />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300 bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-white/10">
              Restricted Console
            </span>
            <h1 className="font-serif font-bold text-2xl text-[#F7F5EE]">
              Platform Admin Gateway
            </h1>
            <p className="text-xs text-[#E6EDE2]/80 mt-1 max-w-xs mx-auto">
              Escrow governance, partner verification, and financial oversight.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-7 space-y-5">

            {/* Strict Anti-Registration Security Notice */}
            <div className="p-3 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl flex items-start space-x-2.5 text-[11px] text-[#59665C]">
              <ShieldCheck className="w-4 h-4 text-[#286749] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-[#263D32] font-semibold block">Self-Registration Prohibited:</strong>
                Public user creation is disabled on this panel. Admin clearance is strictly provisioned by platform governance.
              </div>
            </div>

            {/* Error Feedback */}
            {errorMsg && (
              <div className="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded-xl flex items-start space-x-2 text-xs text-[#B42318] animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Direct Admin Login Form */}
            <form onSubmit={handleAdminSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#263D32] mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@yogaconnect.in"
                    className="w-full bg-white border border-[#E2E5DD] focus:border-[#263D32] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none shadow-2xs font-medium"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263D32] mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8E9B91] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#E2E5DD] focus:border-[#263D32] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#263D32] focus:outline-none shadow-2xs font-medium"
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
                className="w-full bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-gold-400" />
                    <span>Sign In to Admin Console</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Sign In Button for Developer & Testing */}
            <div className="pt-2 border-t border-[#E2E5DD] space-y-2">
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="w-full bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] border border-[#DCCDB5] text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>Instant Sign In (Demo: admin@yogaconnect.in)</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleAdminSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-[#F9FAFB] text-[#263D32] border border-[#E2E5DD] text-xs font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-2xs disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
                <span>Continue with Authorized Google Admin</span>
              </button>
            </div>

            {/* Bottom Audit Notice */}
            <div className="pt-2 text-center text-[10px] text-[#8E9B91]">
              Unauthorized access attempts are audited and logged with IP telemetry.
            </div>

          </div>

        </div>

      </div>
    );
  }

  // 2. Authenticated user without Admin role (Traveller or Partner)
  if (userProfile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F7F5EE] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-red-200 shadow-xl text-center space-y-5 animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF3F2] text-[#B42318] flex items-center justify-center mx-auto border border-[#FECDCA]">
            <ShieldAlert className="w-7 h-7 text-[#B42318]" />
          </div>
          <div>
            <span className="bg-[#FEF3F2] text-[#B42318] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#FDA29B]">
              Access Denied
            </span>
            <h1 className="font-serif font-bold text-xl text-[#263D32] mt-2">
              Administrator Privileges Required
            </h1>
            <p className="text-xs text-[#59665C] mt-2 leading-relaxed">
              Your account (<strong className="text-[#263D32]">{userProfile.email}</strong>) is signed in with the role of{' '}
              <strong className="text-[#263D32] uppercase font-mono">{userProfile.role}</strong>. You are not authorized to view platform-wide admin records.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={async () => {
                await logout();
              }}
              className="w-full bg-[#B42318] hover:bg-[#912018] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out &amp; Login as Administrator</span>
            </button>

            {userProfile.role === 'partner' || userProfile.role === 'centre' ? (
              <button
                onClick={() => router.push('/partner')}
                className="w-full bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Return to Partner Portal</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setUserRole('user');
                  setActiveView('user-dashboard');
                  router.push('/');
                }}
                className="w-full bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Return to Traveller Portal</span>
              </button>
            )}

            <button
              onClick={() => router.push('/')}
              className="w-full bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] text-xs font-semibold py-2 px-4 rounded-xl transition cursor-pointer"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized Admin
  return <AdminDashboard initialTab="overview" />;
}
