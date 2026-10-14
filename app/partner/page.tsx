'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../src/context/AppContext';
import { PartnerPortalLanding } from '../../src/components/dashboards/PartnerPortalLanding';
import { InstructorDashboard } from '../../src/components/dashboards/InstructorDashboard';
import { CentreDashboard } from '../../src/components/dashboards/CentreDashboard';
import { AlertOctagon, ShieldAlert, User } from 'lucide-react';

export default function PartnerPage() {
  const router = useRouter();
  const { userProfile, setIsAuthModalOpen, setActiveView, setUserRole, partnerCentre } = useApp();

  // 1. Unauthenticated Visitor -> Render full Partner Portal with Option A & Option B
  if (!userProfile) {
    return <PartnerPortalLanding />;
  }

  // 2. Suspended Account Check
  if (userProfile.status === 'suspended') {
    return (
      <div className="min-h-screen bg-[#F7F5EE] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-amber-200 shadow-xl text-center space-y-5 animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertOctagon className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <span className="bg-[#FFFBEB] text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-300">
              Account Suspended
            </span>
            <h1 className="font-serif font-bold text-xl text-[#263D32] mt-2">
              Partner Portal Access Suspended
            </h1>
            <p className="text-xs text-[#59665C] mt-2 leading-relaxed">
              Your partner account (<strong className="text-[#263D32]">{userProfile.email}</strong>) has been temporarily placed on administrative hold. Please contact the Yoga Connect India team at <span className="font-mono text-[#263D32]">partners@yogaconnectindia.com</span>.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] text-xs font-semibold py-2.5 px-4 rounded-xl transition cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Traveller Attempting Partner Portal
  if (userProfile.role === 'user') {
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
              Yoga Centre Partner Account Required
            </h1>
            <p className="text-xs text-[#59665C] mt-2 leading-relaxed">
              You are signed in as a Traveller (<strong className="text-[#263D32]">{userProfile.email}</strong>). The Partner Dashboard is restricted to registered Yoga Centre partners.
            </p>
          </div>
          <div className="pt-2 space-y-2">
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
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] text-xs font-semibold py-2.5 px-4 rounded-xl transition cursor-pointer"
            >
              Switch to Centre Partner Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Yoga Instructor
  if (userProfile.role === 'instructor' || userProfile.role === 'individual_yoga_instructor') {
    return <InstructorDashboard />;
  }

  // 5. Authorized Yoga Centre Owner or Admin
  return <CentreDashboard />;
}

