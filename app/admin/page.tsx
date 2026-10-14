'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../src/context/AppContext';
import { AdminDashboard } from '../../src/components/dashboards/AdminDashboard';
import { ShieldAlert, LogIn, ArrowLeft, Crown, Building2, User } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { userProfile, setIsAuthModalOpen, setActiveView, setUserRole } = useApp();

  // 1. Unauthenticated Visitor
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#F7F5EE] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-[#E2E5DD] shadow-xl text-center space-y-5 animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-[#263D32] text-gold-400 flex items-center justify-center mx-auto shadow-sm">
            <Crown className="w-7 h-7 text-gold-400" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-[#263D32]">Admin Portal Login</h1>
            <p className="text-xs text-[#59665C] mt-1.5 leading-relaxed">
              Platform administration and escrow oversight is restricted to authorized platform owners.
            </p>
          </div>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              <LogIn className="w-4 h-4 text-gold-400" />
              <span>Sign In with Admin Credentials</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] text-xs font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
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
              Your account (<strong className="text-[#263D32]">{userProfile.email}</strong>) is currently signed in with the role of{' '}
              <strong className="text-[#263D32] uppercase font-mono">{userProfile.role}</strong>. You are not authorized to view platform-wide admin records.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            {userProfile.role === 'partner' || userProfile.role === 'centre' ? (
              <button
                onClick={() => router.push('/partner')}
                className="w-full bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Go to My Centre Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setUserRole('user');
                  setActiveView('user-dashboard');
                  router.push('/');
                }}
                className="w-full bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Go to My Traveller Portal</span>
              </button>
            )}

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] text-xs font-semibold py-2.5 px-4 rounded-xl transition cursor-pointer"
            >
              Switch Account / Sign In as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized Admin
  return <AdminDashboard initialTab="overview" />;
}
