'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  MapPin,
  Lock,
  Mail,
  Phone,
  Globe,
  Award,
  BookOpen,
  Calendar,
  X,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { YogaStyle } from '../../types';

interface PartnerPortalLandingProps {
  onSelectOption?: (option: 'centre' | 'instructor') => void;
  initialMode?: 'landing' | 'register-centre' | 'register-instructor' | 'login';
}

const AVAILABLE_STYLES: YogaStyle[] = [
  'Hatha',
  'Ashtanga',
  'Vinyasa',
  'Kundalini',
  'Yin',
  'Kriya',
  'Iyengar',
  'Ayurveda & Yoga',
  'Sound Healing'
];

export const PartnerPortalLanding: React.FC<PartnerPortalLandingProps> = ({ 
  initialMode = 'landing' 
}) => {
  const { 
    registerYogaCentre, 
    registerYogaInstructor, 
    loginWithPassword, 
    setIsAuthModalOpen,
    setActiveView,
    setUserRole,
    setVendorDashboardTab,
    setInstructorDashboardTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'landing' | 'register-centre' | 'register-instructor' | 'login'>(initialMode);
  const [partnerLoginType, setPartnerLoginType] = useState<'centre' | 'instructor'>('centre');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Centre registration form state
  const [centreForm, setCentreForm] = useState({
    centreName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    selectedStyles: ['Hatha', 'Ashtanga'] as string[],
    description: '',
    yearsOfOperation: 5,
    websiteUrl: '',
    agreedToTerms: false
  });
  const [centreFormError, setCentreFormError] = useState('');
  const [centreFormSuccess, setCentreFormSuccess] = useState(false);
  const [centreFormLoading, setCentreFormLoading] = useState(false);

  // Instructor registration form state
  const [instructorForm, setInstructorForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePhoto: '',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    selectedStyles: ['Hatha', 'Pranayama'] as string[],
    experienceYears: 7,
    qualifications: '500h E-RYT Yoga Alliance USA',
    bio: '',
    languages: ['English', 'Hindi'],
    onlineAvailability: true,
    inPersonAvailability: true,
    preferredLocations: 'Rishikesh, Tapovan, Dehradun',
    sessionTypes: 'Private 1-on-1, Asana Masterclass, Meditation Intensive',
    pricingRange: '$40 - $80 / session',
    specializations: 'Pranayama, Alignment, Himalayan Philosophy',
    meditationExperience: '8 years regular meditation practice',
    retreatExperience: 'Guest teacher at Himalayan ashrams',
    teachingHours: 'Morning 6:30 AM - 11:00 AM & Evening 4:30 PM - 7:30 PM',
    agreedToTerms: false
  });
  const [instructorFormError, setInstructorFormError] = useState('');
  const [instructorFormSuccess, setInstructorFormSuccess] = useState(false);
  const [instructorFormLoading, setInstructorFormLoading] = useState(false);

  // Handle Yoga Centre Registration Submit
  const handleCentreRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCentreFormError('');

    if (!centreForm.centreName.trim()) {
      setCentreFormError('Please enter your Yoga Centre name.');
      return;
    }
    if (!centreForm.ownerName.trim()) {
      setCentreFormError("Please enter the Owner's full name.");
      return;
    }
    if (!centreForm.email.trim() || !centreForm.email.includes('@')) {
      setCentreFormError('Please enter a valid official email address.');
      return;
    }
    if (!centreForm.phone.trim()) {
      setCentreFormError('Please enter a contact mobile number with country code.');
      return;
    }
    if (!centreForm.password || centreForm.password.length < 6) {
      setCentreFormError('Password must be at least 6 characters long.');
      return;
    }
    if (centreForm.password !== centreForm.confirmPassword) {
      setCentreFormError('Passwords do not match. Please verify.');
      return;
    }
    if (!centreForm.description.trim()) {
      setCentreFormError('Please write a short description of your yoga centre and lineage.');
      return;
    }
    if (!centreForm.agreedToTerms) {
      setCentreFormError('You must agree to the Yoga Connect India Partner Terms & Escrow Policy.');
      return;
    }

    setCentreFormLoading(true);
    try {
      const res = await registerYogaCentre({
        name: centreForm.centreName,
        ownerName: centreForm.ownerName,
        ownerEmail: centreForm.email,
        contactPhone: centreForm.phone,
        address: centreForm.address,
        city: centreForm.city,
        state: centreForm.state,
        country: centreForm.country,
        description: centreForm.description,
        styles: centreForm.selectedStyles,
        foundedYear: new Date().getFullYear() - (centreForm.yearsOfOperation || 1),
        websiteUrl: centreForm.websiteUrl,
        password: centreForm.password
      });

      if (!res.success) {
        setCentreFormError(res.error || 'Failed to complete registration.');
        setCentreFormLoading(false);
        return;
      }

      setCentreFormSuccess(true);
      setCentreFormLoading(false);
    } catch (err: any) {
      setCentreFormError(err.message || 'An unexpected error occurred.');
      setCentreFormLoading(false);
    }
  };

  // Handle Instructor Registration Submit
  const handleInstructorRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInstructorFormError('');

    if (!instructorForm.fullName.trim()) {
      setInstructorFormError('Please enter your full name.');
      return;
    }
    if (!instructorForm.email.trim() || !instructorForm.email.includes('@')) {
      setInstructorFormError('Please enter a valid email address.');
      return;
    }
    if (!instructorForm.phone.trim()) {
      setInstructorFormError('Please enter your contact mobile number.');
      return;
    }
    if (!instructorForm.password || instructorForm.password.length < 6) {
      setInstructorFormError('Password must be at least 6 characters long.');
      return;
    }
    if (instructorForm.password !== instructorForm.confirmPassword) {
      setInstructorFormError('Passwords do not match.');
      return;
    }
    if (!instructorForm.bio.trim()) {
      setInstructorFormError('Please provide a short professional biography.');
      return;
    }
    if (!instructorForm.agreedToTerms) {
      setInstructorFormError('You must agree to the Independent Instructor Terms & Policy.');
      return;
    }

    setInstructorFormLoading(true);
    try {
      const res = await registerYogaInstructor({
        fullName: instructorForm.fullName,
        email: instructorForm.email,
        phone: instructorForm.phone,
        password: instructorForm.password,
        city: instructorForm.city,
        state: instructorForm.state,
        country: instructorForm.country,
        profilePhoto: instructorForm.profilePhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        yogaStyles: instructorForm.selectedStyles,
        experienceYears: Number(instructorForm.experienceYears) || 1,
        qualifications: instructorForm.qualifications,
        bio: instructorForm.bio,
        languages: instructorForm.languages,
        onlineAvailability: instructorForm.onlineAvailability,
        inPersonAvailability: instructorForm.inPersonAvailability,
        preferredLocations: instructorForm.preferredLocations.split(',').map(s => s.trim()).filter(Boolean),
        sessionTypes: instructorForm.sessionTypes.split(',').map(s => s.trim()).filter(Boolean),
        pricingRange: instructorForm.pricingRange,
        specializations: instructorForm.specializations.split(',').map(s => s.trim()).filter(Boolean),
        meditationExperience: instructorForm.meditationExperience,
        retreatExperience: instructorForm.retreatExperience,
        teachingHours: instructorForm.teachingHours
      });

      if (!res.success) {
        setInstructorFormError(res.error || 'Failed to complete instructor registration.');
        setInstructorFormLoading(false);
        return;
      }

      setInstructorFormSuccess(true);
      setInstructorFormLoading(false);
    } catch (err: any) {
      setInstructorFormError(err.message || 'An unexpected error occurred.');
      setInstructorFormLoading(false);
    }
  };

  // Handle Partner Login Submit
  const handlePartnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both your registered email and password.');
      return;
    }

    setLoginLoading(true);
    const res = await loginWithPassword(loginEmail, loginPassword);
    setLoginLoading(false);

    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials. Please check your email and password.');
      return;
    }

    // Redirect to appropriate dashboard based on partner type
    if (partnerLoginType === 'centre') {
      setUserRole('partner');
      setVendorDashboardTab('overview');
      setActiveView('centre-dashboard');
    } else {
      setUserRole('instructor');
      setInstructorDashboardTab('overview');
      setActiveView('instructor-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header Breadcrumbs & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/80 border border-[#E2E5DD] px-3.5 py-1.5 rounded-full text-[11px] font-bold text-[#263D32] tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>Yoga Connect India Partner Sanctuary</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#263D32] tracking-tight">
            Partner Portal &amp; Directory
          </h1>
          <p className="text-sm sm:text-base text-[#59665C] max-w-2xl mx-auto leading-relaxed">
            Welcome to the dedicated onboarding sanctuary for verified Yoga Centres and certified Individual Yoga Instructors across India.
          </p>

          {/* Navigation Pill Bar */}
          <div className="inline-flex p-1 bg-white rounded-2xl border border-[#E2E5DD] shadow-xs mt-4">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'landing' ? 'bg-[#263D32] text-white shadow-xs' : 'text-[#59665C] hover:text-[#263D32]'
              }`}
            >
              Choose Partner Role
            </button>
            <button
              onClick={() => setActiveTab('register-centre')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'register-centre' ? 'bg-[#263D32] text-white shadow-xs' : 'text-[#59665C] hover:text-[#263D32]'
              }`}
            >
              Register Centre
            </button>
            <button
              onClick={() => setActiveTab('register-instructor')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'register-instructor' ? 'bg-[#263D32] text-white shadow-xs' : 'text-[#59665C] hover:text-[#263D32]'
              }`}
            >
              Register Instructor
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'login' ? 'bg-[#536B50] text-white shadow-xs' : 'text-[#59665C] hover:text-[#263D32]'
              }`}
            >
              Partner Login
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: LANDING WITH TWO CARDS (PROMPT SECTION 1)        */}
        {/* ========================================================= */}
        {activeTab === 'landing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">

            {/* CARD 1: REGISTER YOUR YOGA CENTRE */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E5DD] shadow-sm hover:shadow-xl hover:border-[#A5B89A] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6EDE2] rounded-bl-full -z-0 opacity-40 group-hover:scale-110 transition-transform" />
              
              <div className="relative z-10 space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#263D32] text-white flex items-center justify-center shadow-md">
                  <Building2 className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#536B50] uppercase block">
                    OPTION A • YOGA SANCTUARY
                  </span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32] mt-1">
                    Register Your Yoga Centre
                  </h2>
                </div>
                <p className="text-sm text-[#59665C] leading-relaxed">
                  "Manage your yoga centre, connect with travellers, receive bookings, and track your earnings through your personal dashboard."
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-2 text-xs text-[#263D32]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#286749] shrink-0" />
                    <span>Publish TTC, Retreats, &amp; Ashram Courses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#286749] shrink-0" />
                    <span>100% Escrow Protection on Client Payments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#286749] shrink-0" />
                    <span>Dedicated Centre Ledger &amp; Direct Bank Payouts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#286749] shrink-0" />
                    <span>Pending approval status ensures quality curation</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 pt-8 space-y-3">
                <button
                  onClick={() => setActiveTab('register-centre')}
                  className="w-full bg-[#263D32] hover:bg-[#1E3228] text-white font-semibold text-xs sm:text-sm py-3.5 px-5 rounded-2xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer group/btn"
                >
                  <span>Register as a Yoga Centre Owner</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    setPartnerLoginType('centre');
                    setActiveTab('login');
                  }}
                  className="w-full bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] font-semibold text-xs sm:text-sm py-3 px-5 rounded-2xl transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#536B50]" />
                  <span>Login to Centre Dashboard</span>
                </button>
              </div>
            </div>

            {/* CARD 2: REGISTER AS A YOGA INSTRUCTOR */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E5DD] shadow-sm hover:shadow-xl hover:border-[#C5A880] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBF7EE] rounded-bl-full -z-0 opacity-60 group-hover:scale-110 transition-transform" />

              <div className="relative z-10 space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#536B50] text-white flex items-center justify-center shadow-md">
                  <UserCheck className="w-7 h-7 text-gold-300" />
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A880] uppercase block">
                    OPTION B • CERTIFIED GURU
                  </span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32] mt-1">
                    Register as a Yoga Instructor
                  </h2>
                </div>
                <p className="text-sm text-[#59665C] leading-relaxed">
                  "Showcase your yoga teaching expertise, manage your professional profile, receive teaching enquiries, and track your earnings."
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-2 text-xs text-[#263D32]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span>Independent Professional Profile (No Centre Required)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span>Receive 1-on-1 &amp; Workshop Teaching Enquiries</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span>Set Custom Session Fees &amp; Teaching Locations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span>Dedicated Instructor Earnings &amp; Payout Dashboard</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 pt-8 space-y-3">
                <button
                  onClick={() => setActiveTab('register-instructor')}
                  className="w-full bg-[#536B50] hover:bg-[#40563E] text-white font-semibold text-xs sm:text-sm py-3.5 px-5 rounded-2xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer group/btn"
                >
                  <span>Register as an Individual Instructor</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    setPartnerLoginType('instructor');
                    setActiveTab('login');
                  }}
                  className="w-full bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] font-semibold text-xs sm:text-sm py-3 px-5 rounded-2xl transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#536B50]" />
                  <span>Login to Instructor Dashboard</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: YOGA CENTRE OWNER REGISTRATION (PROMPT SECTION 2) */}
        {/* ========================================================= */}
        {activeTab === 'register-centre' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E5DD] shadow-lg max-w-3xl mx-auto">
            {centreFormSuccess ? (
              <div className="text-center py-10 space-y-5 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[#E6EDE2] text-[#286749] flex items-center justify-center mx-auto border-4 border-white shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <span className="bg-[#FFFBEB] text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                    Pending Administrator Verification
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-[#263D32]">
                    Sanctuary Application Submitted!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#59665C] max-w-lg mx-auto leading-relaxed">
                    Welcome to the Yoga Connect India community. Your centre profile for <strong className="text-[#263D32]">{centreForm.centreName}</strong> has been created.
                    You can now access your Centre Dashboard to manage offerings while awaiting public approval.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setUserRole('partner');
                      setVendorDashboardTab('overview');
                      setActiveView('centre-dashboard');
                    }}
                    className="w-full sm:w-auto bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <span>Enter My Centre Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('landing')}
                    className="w-full sm:w-auto bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] text-xs font-semibold py-3 px-5 rounded-xl transition cursor-pointer"
                  >
                    Back to Partner Hub
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCentreRegisterSubmit} className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-[#536B50] uppercase tracking-wider">Option A Registration</span>
                  <h2 className="font-serif font-bold text-2xl text-[#263D32] mt-0.5">Yoga Centre Owner Registration</h2>
                  <p className="text-xs text-[#59665C] mt-1">
                    Fill out all required details to register your ashram or yoga retreat facility. Newly registered centres will have a <em>pending approval</em> status before appearing on public search.
                  </p>
                </div>

                {centreFormError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{centreFormError}</span>
                  </div>
                )}

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Centre Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Parmarth Niketan Sacred Ganges Ashram"
                      value={centreForm.centreName}
                      onChange={e => setCentreForm({ ...centreForm, centreName: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Owner's Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acharya Vishwajeet Shastri"
                      value={centreForm.ownerName}
                      onChange={e => setCentreForm({ ...centreForm, ownerName: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. partner.centre@domain.com"
                      value={centreForm.email}
                      onChange={e => setCentreForm({ ...centreForm, email: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Mobile Number with Country Code *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={centreForm.phone}
                      onChange={e => setCentreForm({ ...centreForm, phone: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={centreForm.password}
                      onChange={e => setCentreForm({ ...centreForm, password: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={centreForm.confirmPassword}
                      onChange={e => setCentreForm({ ...centreForm, confirmPassword: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Centre Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Swargashram Road, Near Ram Jhula"
                      value={centreForm.address}
                      onChange={e => setCentreForm({ ...centreForm, address: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={centreForm.city}
                      onChange={e => setCentreForm({ ...centreForm, city: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">State &amp; Country *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={centreForm.state}
                        onChange={e => setCentreForm({ ...centreForm, state: e.target.value })}
                        className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                      />
                      <input
                        type="text"
                        required
                        value={centreForm.country}
                        onChange={e => setCentreForm({ ...centreForm, country: e.target.value })}
                        className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Years of Operation</label>
                    <input
                      type="number"
                      min={0}
                      value={centreForm.yearsOfOperation}
                      onChange={e => setCentreForm({ ...centreForm, yearsOfOperation: Number(e.target.value) })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Website or Social Media Link (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://yourcentre.org"
                      value={centreForm.websiteUrl}
                      onChange={e => setCentreForm({ ...centreForm, websiteUrl: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#263D32] mb-1.5">Yoga Styles Offered</label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_STYLES.map(style => {
                        const isSelected = centreForm.selectedStyles.includes(style);
                        return (
                          <button
                            type="button"
                            key={style}
                            onClick={() => {
                              if (isSelected) {
                                setCentreForm({
                                  ...centreForm,
                                  selectedStyles: centreForm.selectedStyles.filter(s => s !== style)
                                });
                              } else {
                                setCentreForm({
                                  ...centreForm,
                                  selectedStyles: [...centreForm.selectedStyles, style]
                                });
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#263D32] text-white border-[#263D32]'
                                : 'bg-[#F7F5EE] text-[#59665C] border-[#E2E5DD] hover:border-[#263D32]'
                            }`}
                          >
                            {style}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Short Description of the Centre *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your ashram's spiritual heritage, location along the Ganges, teaching lineages, and accommodation..."
                      value={centreForm.description}
                      onChange={e => setCentreForm({ ...centreForm, description: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                    />
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={centreForm.agreedToTerms}
                      onChange={e => setCentreForm({ ...centreForm, agreedToTerms: e.target.checked })}
                      className="mt-0.5 rounded text-[#263D32] focus:ring-[#263D32]"
                    />
                    <span className="text-xs text-[#59665C] leading-normal">
                      I agree to the Yoga Connect India Partner Code of Ethics, Escrow Settlement Agreement, and acknowledge that my centre profile will undergo review before public listing.
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('landing')}
                    className="text-xs text-[#59665C] hover:text-[#263D32] font-semibold cursor-pointer"
                  >
                    ← Back to Options
                  </button>
                  <button
                    type="submit"
                    disabled={centreFormLoading}
                    className="bg-[#263D32] hover:bg-[#1E3228] disabled:opacity-50 text-white font-semibold text-xs py-3 px-6 rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <span>{centreFormLoading ? 'Registering Centre...' : 'Complete Centre Registration'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: INSTRUCTOR REGISTRATION (PROMPT SECTION 3)        */}
        {/* ========================================================= */}
        {activeTab === 'register-instructor' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E5DD] shadow-lg max-w-3xl mx-auto">
            {instructorFormSuccess ? (
              <div className="text-center py-10 space-y-5 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[#E6EDE2] text-[#286749] flex items-center justify-center mx-auto border-4 border-white shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <span className="bg-[#FFFBEB] text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                    Pending Verification
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-[#263D32]">
                    Instructor Profile Created!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#59665C] max-w-lg mx-auto leading-relaxed">
                    Namaste, <strong className="text-[#263D32]">{instructorForm.fullName}</strong>. Your independent yoga instructor profile has been submitted and registered.
                    You can now access your dedicated Instructor Dashboard to configure session fees, teaching hours, and review customer enquiries.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setUserRole('instructor');
                      setInstructorDashboardTab('overview');
                      setActiveView('instructor-dashboard');
                    }}
                    className="w-full sm:w-auto bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <span>Open My Instructor Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('landing')}
                    className="w-full sm:w-auto bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] text-xs font-semibold py-3 px-5 rounded-xl transition cursor-pointer"
                  >
                    Back to Partner Hub
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInstructorRegisterSubmit} className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider">Option B Registration</span>
                  <h2 className="font-serif font-bold text-2xl text-[#263D32] mt-0.5">Individual Yoga Instructor Registration</h2>
                  <p className="text-xs text-[#59665C] mt-1">
                    Create your independent instructor profile. You do not need to own a yoga centre. Manage private sessions, retreats, and teaching enquiries independently.
                  </p>
                </div>

                {instructorFormError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{instructorFormError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Yogacharya Aarav Joshi"
                      value={instructorForm.fullName}
                      onChange={e => setInstructorForm({ ...instructorForm, fullName: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aarav.yoga@example.in"
                      value={instructorForm.email}
                      onChange={e => setInstructorForm({ ...instructorForm, email: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Mobile Number with Country Code *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98112 33445"
                      value={instructorForm.phone}
                      onChange={e => setInstructorForm({ ...instructorForm, phone: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Profile Photograph URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={instructorForm.profilePhoto}
                      onChange={e => setInstructorForm({ ...instructorForm, profilePhoto: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={instructorForm.password}
                      onChange={e => setInstructorForm({ ...instructorForm, password: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={instructorForm.confirmPassword}
                      onChange={e => setInstructorForm({ ...instructorForm, confirmPassword: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">City, State, Country *</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <input
                        type="text"
                        placeholder="City"
                        value={instructorForm.city}
                        onChange={e => setInstructorForm({ ...instructorForm, city: e.target.value })}
                        className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-2.5 py-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={instructorForm.state}
                        onChange={e => setInstructorForm({ ...instructorForm, state: e.target.value })}
                        className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-2.5 py-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={instructorForm.country}
                        onChange={e => setInstructorForm({ ...instructorForm, country: e.target.value })}
                        className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-2.5 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Years of Teaching Experience *</label>
                    <input
                      type="number"
                      min={0}
                      value={instructorForm.experienceYears}
                      onChange={e => setInstructorForm({ ...instructorForm, experienceYears: Number(e.target.value) })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Qualifications &amp; Certifications (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 500h E-RYT Yoga Alliance USA, M.Sc. in Yogic Science (SVYASA)"
                      value={instructorForm.qualifications}
                      onChange={e => setInstructorForm({ ...instructorForm, qualifications: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Short Professional Biography *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your teaching lineage, pedagogical philosophy, and student alignment experience..."
                      value={instructorForm.bio}
                      onChange={e => setInstructorForm({ ...instructorForm, bio: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Expected Fee / Pricing Range</label>
                    <input
                      type="text"
                      placeholder="e.g. $45 - $90 / session"
                      value={instructorForm.pricingRange}
                      onChange={e => setInstructorForm({ ...instructorForm, pricingRange: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Teaching Availability Options</label>
                    <div className="flex items-center space-x-4 pt-2">
                      <label className="flex items-center space-x-1.5 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={instructorForm.onlineAvailability}
                          onChange={e => setInstructorForm({ ...instructorForm, onlineAvailability: e.target.checked })}
                          className="rounded text-[#536B50]"
                        />
                        <span>Online Sessions</span>
                      </label>
                      <label className="flex items-center space-x-1.5 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={instructorForm.inPersonAvailability}
                          onChange={e => setInstructorForm({ ...instructorForm, inPersonAvailability: e.target.checked })}
                          className="rounded text-[#536B50]"
                        />
                        <span>In-Person Sessions</span>
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Preferred Teaching Locations (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Rishikesh, Tapovan, Dehradun, Virtual"
                      value={instructorForm.preferredLocations}
                      onChange={e => setInstructorForm({ ...instructorForm, preferredLocations: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#263D32] mb-1">Session Types Offered</label>
                    <input
                      type="text"
                      placeholder="e.g. Private 1-on-1, Asana Masterclass, Meditation Intensive"
                      value={instructorForm.sessionTypes}
                      onChange={e => setInstructorForm({ ...instructorForm, sessionTypes: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3.5 py-2.5 text-xs text-[#263D32]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={instructorForm.agreedToTerms}
                      onChange={e => setInstructorForm({ ...instructorForm, agreedToTerms: e.target.checked })}
                      className="mt-0.5 rounded text-[#536B50]"
                    />
                    <span className="text-xs text-[#59665C]">
                      I agree to the Yoga Connect India Independent Instructor Agreement, Escrow Payout guidelines, and code of respectful pedagogical conduct.
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTab('landing')}
                    className="text-xs text-[#59665C] hover:text-[#263D32] font-semibold cursor-pointer"
                  >
                    ← Back to Options
                  </button>
                  <button
                    type="submit"
                    disabled={instructorFormLoading}
                    className="bg-[#536B50] hover:bg-[#40563E] disabled:opacity-50 text-white font-semibold text-xs py-3 px-6 rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <span>{instructorFormLoading ? 'Registering Instructor...' : 'Complete Instructor Registration'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: PARTNER LOGIN SCREEN (PROMPT SECTION 4)           */}
        {/* ========================================================= */}
        {activeTab === 'login' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E5DD] shadow-lg max-w-md mx-auto">
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#263D32] text-white flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#263D32]">Partner Sanctuary Sign In</h2>
              <p className="text-xs text-[#59665C]">
                Sign in to your authorized partner portal using your email and password.
              </p>
            </div>

            {/* Role selector tab for login */}
            <div className="grid grid-cols-2 p-1 bg-[#F7F5EE] rounded-xl mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPartnerLoginType('centre')}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  partnerLoginType === 'centre' ? 'bg-[#263D32] text-white shadow-xs' : 'text-[#59665C]'
                }`}
              >
                Yoga Centre Owner
              </button>
              <button
                type="button"
                onClick={() => setPartnerLoginType('instructor')}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  partnerLoginType === 'instructor' ? 'bg-[#536B50] text-white shadow-xs' : 'text-[#59665C]'
                }`}
              >
                Yoga Instructor
              </button>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 mb-4 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handlePartnerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#263D32] mb-1">Registered Partner Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8E9B91] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder={partnerLoginType === 'centre' ? 'partner.parmarth@yogaconnect.in' : 'instructor.aarav@yogaconnect.in'}
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#263D32]">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link dispatched to your registered email.')}
                    className="text-[11px] text-[#536B50] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8E9B91] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#263D32]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-[#263D32] hover:bg-[#1E3228] disabled:opacity-50 text-white font-semibold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm mt-2"
              >
                <span>{loginLoading ? 'Signing In...' : `Sign In to ${partnerLoginType === 'centre' ? 'Centre' : 'Instructor'} Dashboard`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Credentials Box */}
            <div className="mt-6 pt-5 border-t border-[#E2E5DD] text-center space-y-2">
              <span className="text-[11px] font-bold text-[#59665C] block">Or quickly test with demo partner accounts:</span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('partner.parmarth@yogaconnect.in');
                    setLoginPassword('password123');
                    setPartnerLoginType('centre');
                  }}
                  className="text-left p-2.5 bg-[#F7F5EE] hover:bg-[#E6EDE2] rounded-xl text-xs border border-[#E2E5DD] transition cursor-pointer"
                >
                  <div className="font-semibold text-[#263D32]">Parmarth Niketan Owner (Centre A)</div>
                  <div className="text-[10px] text-[#59665C]">partner.parmarth@yogaconnect.in</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('instructor.aarav@yogaconnect.in');
                    setLoginPassword('password123');
                    setPartnerLoginType('instructor');
                  }}
                  className="text-left p-2.5 bg-[#F7F5EE] hover:bg-[#E6EDE2] rounded-xl text-xs border border-[#E2E5DD] transition cursor-pointer"
                >
                  <div className="font-semibold text-[#263D32]">Yogacharya Aarav Joshi (Instructor)</div>
                  <div className="text-[10px] text-[#59665C]">instructor.aarav@yogaconnect.in</div>
                </button>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('landing')}
                className="text-xs text-[#59665C] hover:text-[#263D32] font-semibold cursor-pointer"
              >
                ← Back to Partner Hub
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
