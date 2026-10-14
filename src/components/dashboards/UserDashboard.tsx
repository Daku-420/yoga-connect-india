'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Heart, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Download,
  LogIn,
  LogOut,
  Sparkles,
  Compass,
  Calendar,
  MessageSquare,
  Settings,
  AlertCircle,
  XCircle,
  Building2,
  DollarSign,
  Printer,
  ChevronRight,
  Phone,
  Globe,
  Sliders,
  BookOpen,
  Star
} from 'lucide-react';
import { UserPreferences, BookingRequest } from '../../types';

export const UserDashboard: React.FC = () => {
  const { 
    bookings, 
    centres, 
    wishlist, 
    toggleWishlist, 
    formatPrice, 
    setSelectedCentreId, 
    setActiveView,
    currency,
    currentUser,
    userProfile,
    setIsAuthModalOpen,
    logout,
    userDashboardTab,
    setUserDashboardTab,
    updateUserProfile,
    updateUserPreferences,
    requestBookingCancellation,
    enquiries,
    submitReview
  } = useApp();

  // Active tab state
  const activeTab = userDashboardTab || 'profile';
  const setActiveTab = setUserDashboardTab;

  // Filter centres in wishlist
  const wishlistedCentres = centres.filter(c => wishlist.includes(c.id));

  // Strict customer privacy: only show bookings belonging to the authenticated customer
  const myBookings = userProfile?.email 
    ? bookings.filter(b => b.customerEmail?.toLowerCase() === userProfile.email.toLowerCase())
    : [];

  // Enquiries submitted by this customer
  const myEnquiries = userProfile?.email
    ? enquiries.filter(e => e.customerEmail?.toLowerCase() === userProfile.email.toLowerCase())
    : [];

  // Cancellation modal state
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string>('');

  // Review submission modal state
  const [reviewBooking, setReviewBooking] = useState<BookingRequest | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string>('');

  // Preference form state
  const [prefForm, setPrefForm] = useState<UserPreferences>({
    yogaStyle: userProfile?.preferences?.yogaStyle || 'Hatha',
    experienceLevel: userProfile?.preferences?.experienceLevel || 'intermediate',
    dietaryPreference: userProfile?.preferences?.dietaryPreference || 'sattvic',
    roomType: userProfile?.preferences?.roomType || 'private',
    preferredLocation: userProfile?.preferences?.preferredLocation || 'Rishikesh (Ganges Valley)'
  });
  const [prefSavedMsg, setPrefSavedMsg] = useState<string>('');

  // Profile edit form state
  const [profileForm, setProfileForm] = useState({
    fullName: userProfile?.fullName || '',
    phone: userProfile?.phone || '',
    country: userProfile?.country || 'India'
  });
  const [profileSavedMsg, setProfileSavedMsg] = useState<string>('');

  // Selected Booking for detail receipt modal
  const [receiptBooking, setReceiptBooking] = useState<any | null>(null);

  // Status filter for bookings tab
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

  const filteredBookings = myBookings.filter(b => {
    if (bookingStatusFilter === 'all') return true;
    return b.status === bookingStatusFilter;
  });

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserPreferences(prefForm);
    setPrefSavedMsg('Your yoga and travel preferences have been saved securely!');
    setTimeout(() => setPrefSavedMsg(''), 4000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      fullName: profileForm.fullName,
      phone: profileForm.phone,
      country: profileForm.country
    });
    setProfileSavedMsg('Profile details updated successfully!');
    setTimeout(() => setProfileSavedMsg(''), 4000);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBookingId) return;
    await requestBookingCancellation(cancellingBookingId, cancelReason || 'Customer requested cancellation via portal');
    setCancellingBookingId(null);
    setCancelReason('');
    setCancelSuccessMsg('Your cancellation request has been recorded and platform ledger updated.');
    setTimeout(() => setCancelSuccessMsg(''), 5000);
  };

  return (
    <div className="py-10 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Guest Notification Banner if not logged in */}
        {!userProfile && (
          <div className="bg-gradient-to-r from-[#263D32] to-[#3A5345] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                <Sparkles className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F7F5EE]">
                  Sign In to Access Your Traveller Portal
                </h3>
                <p className="text-xs text-[#E6EDE2]/80 mt-0.5">
                  Sign in with your email or Google account to access your booking status, confirmed ashram vouchers, enquiry history, and preferences.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-[#E6EDE2] hover:bg-white text-[#263D32] font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#536B50]" />
              <span>Sign In with Gmail / OTP</span>
            </button>
          </div>
        )}

        {/* Global Feedback Notifications */}
        {cancelSuccessMsg && (
          <div className="bg-[#E6EDE2] border border-[#286749]/30 text-[#286749] p-4 rounded-xl text-xs flex items-center space-x-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#286749] shrink-0" />
            <span>{cancelSuccessMsg}</span>
          </div>
        )}

        {/* User Profile Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E5DD] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {userProfile?.avatarUrl ? (
              <img 
                src={userProfile.avatarUrl} 
                alt="Avatar" 
                className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-[#536B50]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#263D32] text-[#F7F5EE] flex items-center justify-center font-serif font-bold text-2xl shadow-sm uppercase">
                {userProfile?.fullName ? userProfile.fullName.slice(0, 2) : 'TR'}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#A5B89A]/40">
                  {userProfile ? 'Verified Traveller Member' : 'Guest Traveller Mode'}
                </span>
                {userProfile && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    userProfile.status === 'suspended' ? 'bg-[#FEF3F2] text-[#B42318]' : 'bg-[#286749]/10 text-[#286749]'
                  }`}>
                    {userProfile.status === 'suspended' ? 'Suspended' : 'Active Account'}
                  </span>
                )}
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32] mt-1">
                {userProfile?.fullName || 'Welcome, Traveller'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#59665C] mt-1">
                <span>{userProfile?.email || 'Not logged in'}</span>
                {userProfile?.phone && (
                  <>
                    <span>•</span>
                    <span>{userProfile.phone}</span>
                  </>
                )}
                {userProfile && (
                  <>
                    <span>•</span>
                    <button 
                      onClick={() => logout()}
                      className="text-[#B42318] font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD] text-xs">
            <div className="px-2">
              <span className="text-[#59665C] font-medium block text-[10px] uppercase">My Bookings</span>
              <span className="font-serif font-bold text-lg text-[#263D32]">{myBookings.length}</span>
            </div>
            <div className="border-l border-[#E2E5DD] pl-3 pr-2">
              <span className="text-[#59665C] font-medium block text-[10px] uppercase">Saved Sanctuaries</span>
              <span className="font-serif font-bold text-lg text-[#536B50]">{wishlist.length}</span>
            </div>
            <div className="border-l border-[#E2E5DD] pl-3 pr-2">
              <span className="text-[#59665C] font-medium block text-[10px] uppercase">Enquiries</span>
              <span className="font-serif font-bold text-lg text-[#263D32]">{myEnquiries.length}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar matching Prompt Section 1 */}
        <div className="flex overflow-x-auto border-b border-[#E2E5DD] bg-white rounded-xl p-1.5 shadow-2xs space-x-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#263D32] text-white shadow-xs'
                : 'text-[#59665C] hover:text-[#263D32] hover:bg-[#F7F5EE]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveView('retreats')}
            className="px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 text-[#59665C] hover:text-[#263D32] hover:bg-[#F7F5EE] cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Yoga Centres</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#263D32] text-white shadow-xs'
                : 'text-[#59665C] hover:text-[#263D32] hover:bg-[#F7F5EE]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Bookings</span>
            {myBookings.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === 'bookings' ? 'bg-white/20 text-white' : 'bg-[#E6EDE2] text-[#263D32]'
              }`}>
                {myBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-[#263D32] text-white shadow-xs'
                : 'text-[#59665C] hover:text-[#263D32] hover:bg-[#F7F5EE]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Yoga Centres</span>
            {wishlist.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-[#E6EDE2] text-[#263D32]'
              }`}>
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'enquiries'
                ? 'bg-[#263D32] text-white shadow-xs'
                : 'text-[#59665C] hover:text-[#263D32] hover:bg-[#F7F5EE]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>My Enquiries</span>
            {myEnquiries.length > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === 'enquiries' ? 'bg-white/20 text-white' : 'bg-[#E6EDE2] text-[#263D32]'
              }`}>
                {myEnquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'preferences'
                ? 'bg-[#263D32] text-white shadow-xs'
                : 'text-[#59665C] hover:text-[#263D32] hover:bg-[#F7F5EE]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Travel &amp; Yoga Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#263D32] text-white shadow-xs'
                : 'text-[#59665C] hover:text-[#263D32] hover:bg-[#F7F5EE]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* TAB 1: PROFILE OVERVIEW */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm space-y-3">
                <div className="flex items-center space-x-2.5 text-[#536B50]">
                  <ShieldCheck className="w-5 h-5 text-[#286749]" />
                  <h3 className="font-serif font-bold text-base text-[#263D32]">Escrow Safeguards</h3>
                </div>
                <p className="text-xs text-[#59665C] leading-relaxed">
                  All retreat bookings on Yoga Connect India are protected in escrow until your ashram stay is verified and confirmed.
                </p>
                <div className="pt-2 border-t border-[#E2E5DD]/70">
                  <span className="text-[11px] font-bold text-[#286749] bg-[#E6EDE2] px-2.5 py-1 rounded-md">
                    100% Verified Ashrams &amp; TTCs
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm space-y-3">
                <div className="flex items-center space-x-2.5 text-[#536B50]">
                  <Sparkles className="w-5 h-5 text-[#C5A880]" />
                  <h3 className="font-serif font-bold text-base text-[#263D32]">Active Preferences</h3>
                </div>
                <div className="text-xs text-[#59665C] space-y-1">
                  <div>Style: <strong className="text-[#263D32]">{userProfile?.preferences?.yogaStyle || 'Hatha'}</strong></div>
                  <div>Experience: <strong className="text-[#263D32]">{userProfile?.preferences?.experienceLevel || 'Intermediate'}</strong></div>
                  <div>Diet: <strong className="text-[#263D32]">{userProfile?.preferences?.dietaryPreference || 'Sattvic Vegetarian'}</strong></div>
                  <div>Location: <strong className="text-[#263D32]">{userProfile?.preferences?.preferredLocation || 'Rishikesh (Ganges Valley)'}</strong></div>
                </div>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className="text-xs font-semibold text-[#536B50] hover:underline pt-1 block"
                >
                  Edit Preferences &rarr;
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm space-y-3">
                <div className="flex items-center space-x-2.5 text-[#536B50]">
                  <Compass className="w-5 h-5 text-[#536B50]" />
                  <h3 className="font-serif font-bold text-base text-[#263D32]">Explore Retreats</h3>
                </div>
                <p className="text-xs text-[#59665C] leading-relaxed">
                  Discover traditional Himalayan ashrams, certified Yoga Alliance TTC 200h courses, and silent meditation retreats in Rishikesh.
                </p>
                <button
                  onClick={() => setActiveView('retreats')}
                  className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2 rounded-lg transition inline-flex items-center space-x-1"
                >
                  <span>Browse 15+ Sanctuaries</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Quick Actions & Recent Bookings preview */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E5DD] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-xl text-[#263D32]">Recent Bookings &amp; Inquiries</h2>
                  <p className="text-xs text-[#59665C] mt-0.5">Your official reservations across accredited ashrams.</p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-[#536B50] hover:underline flex items-center space-x-1"
                >
                  <span>View All Bookings ({myBookings.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {myBookings.length > 0 ? (
                <div className="divide-y divide-[#E2E5DD]/70">
                  {myBookings.slice(0, 3).map((b) => (
                    <div key={b.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs bg-[#E6EDE2] text-[#263D32] font-bold px-2 py-0.5 rounded">
                            {b.referenceCode}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === 'confirmed_paid' ? 'bg-[#E6EDE2] text-[#286749]' :
                            b.status === 'assigned_to_centre' ? 'bg-[#E6EDE2] text-[#263D32]' :
                            b.status === 'cancelled' ? 'bg-[#FEF3F2] text-[#B42318]' :
                            'bg-[#DCCDB5]/40 text-[#252C27]'
                          }`}>
                            {b.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#263D32]">{b.courseTitle}</h4>
                        <span className="text-xs text-[#536B50] font-semibold">{b.centreName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-bold text-lg text-[#263D32] block">{formatPrice(b.totalUSD)}</span>
                        <span className="text-[10px] text-[#59665C]">{b.startDate} • {b.durationDays} Days</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#59665C] italic py-4">No reservations yet. Browse yoga centres to book your retreat.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E5DD] shadow-sm space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#263D32]">My Booking History</h2>
                <p className="text-xs text-[#59665C] mt-1">
                  Official booking requests and confirmed retreat vouchers with escrow verification.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-[#59665C]">Status:</span>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="bg-[#F7F5EE] border border-[#E2E5DD] text-xs font-semibold text-[#263D32] rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="all">All Statuses ({myBookings.length})</option>
                  <option value="confirmed_paid">Confirmed &amp; Paid</option>
                  <option value="assigned_to_centre">Assigned to Ashram</option>
                  <option value="pending_admin">Pending Review</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="bg-[#F7F5EE]/60 p-6 rounded-xl border border-[#E2E5DD] flex flex-col lg:flex-row items-start justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs bg-[#E6EDE2] text-[#263D32] font-bold px-2.5 py-0.5 rounded border border-[#A5B89A]/40">
                          REF #{b.referenceCode}
                        </span>

                        {b.status === 'pending_admin' && (
                          <span className="bg-[#FFFBEB] text-[#B54708] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#FEDF89]">
                            <Clock className="w-3 h-3 text-[#B54708]" />
                            <span>Booking: Pending Verification</span>
                          </span>
                        )}

                        {b.status === 'assigned_to_centre' && (
                          <span className="bg-[#E6EDE2] text-[#263D32] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#A5B89A]/40">
                            <CheckCircle2 className="w-3 h-3 text-[#536B50]" />
                            <span>Booking: Assigned to Ashram</span>
                          </span>
                        )}

                        {b.status === 'confirmed_paid' && (
                          <span className="bg-[#E6EDE2] text-[#286749] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#286749]/30">
                            <CheckCircle2 className="w-3 h-3 text-[#286749]" />
                            <span>Booking: Confirmed</span>
                          </span>
                        )}

                        {b.status === 'completed' && (
                          <span className="bg-[#E6EDE2] text-[#286749] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#286749]/30">
                            <CheckCircle2 className="w-3 h-3 text-[#286749]" />
                            <span>Booking: Completed Journey</span>
                          </span>
                        )}

                        {b.status === 'cancelled' && (
                          <span className="bg-[#FEF3F2] text-[#B42318] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#FDA29B]">
                            <XCircle className="w-3 h-3 text-[#B42318]" />
                            <span>Booking: Cancelled</span>
                          </span>
                        )}

                        {/* Payment Status Badge */}
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          b.paymentStatus === 'paid' || b.paymentStatus === 'paid_full'
                            ? 'bg-[#E6EDE2] text-[#286749] border-[#286749]/30'
                            : b.paymentStatus === 'refunded'
                            ? 'bg-[#FEF3F2] text-[#B42318] border-[#FDA29B]'
                            : 'bg-[#FFFBEB] text-amber-700 border-amber-200'
                        }`}>
                          Payment: {b.paymentStatus === 'paid' || b.paymentStatus === 'paid_full' ? 'Verified Escrow' : b.paymentStatus === 'refunded' ? 'Refunded' : 'Pending Verification'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-xl text-[#263D32]">{b.courseTitle}</h3>
                      <div className="flex items-center space-x-2 text-xs text-[#536B50] font-semibold">
                        <Building2 className="w-3.5 h-3.5 text-[#536B50]" />
                        <span>{b.centreName}</span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-[#59665C] pt-1">
                        <span>Check-in: <strong>{b.startDate}</strong></span>
                        <span>Duration: <strong>{b.durationDays} Days</strong></span>
                        <span>Room Option: <strong>{b.roomType}</strong></span>
                        <span>Guests: <strong>{b.participantsCount} Person</strong></span>
                        {b.adminNotes && (
                          <div className="w-full text-[11px] text-[#536B50] italic bg-white p-2 rounded border border-[#E2E5DD]/70">
                            Note from Sanctuary: {b.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between self-stretch shrink-0 space-y-3">
                      <div className="text-right">
                        <span className="text-[10px] text-[#59665C] font-semibold uppercase block">Total Package Amount</span>
                        <span className="font-serif font-bold text-2xl text-[#263D32]">{formatPrice(b.totalUSD)}</span>
                        <span className="text-[10px] text-[#286749] font-medium block">Verified Settlement</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setReceiptBooking(b)}
                          className="bg-white hover:bg-[#E6EDE2] text-[#263D32] border border-[#E2E5DD] text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center space-x-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#536B50]" />
                          <span>View Voucher</span>
                        </button>

                        {(b.status === 'completed' || b.status === 'confirmed_paid') && (
                          <button
                            onClick={() => {
                              setReviewBooking(b);
                              setReviewRating(5);
                              setReviewTitle('');
                              setReviewComment('');
                              setReviewSuccessMsg('');
                            }}
                            className="bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center space-x-1 cursor-pointer shadow-xs"
                          >
                            <Star className="w-3.5 h-3.5 text-gold-300 fill-current" />
                            <span>Write Review</span>
                          </button>
                        )}

                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                          <button
                            onClick={() => {
                              setCancellingBookingId(b.id);
                              setCancelReason('');
                            }}
                            className="text-[#B42318] hover:bg-[#FEF3F2] border border-transparent hover:border-[#FECDCA] text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#F7F5EE]/40 rounded-xl border border-dashed border-[#E2E5DD]">
                <BookOpen className="w-10 h-10 text-[#536B50]/40 mx-auto mb-2" />
                <p className="text-sm text-[#59665C] font-serif font-bold">No booking requests found</p>
                <p className="text-xs text-[#8E9B91] mt-1">Browse all public yoga centres and retreats to book your Himalayan experience.</p>
                <button
                  onClick={() => setActiveView('retreats')}
                  className="mt-4 bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Explore Retreats
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED YOGA CENTRES */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E5DD] shadow-sm space-y-6 animate-in fade-in">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#263D32]">Saved Yoga Sanctuaries ({wishlistedCentres.length})</h2>
              <p className="text-xs text-[#59665C] mt-1">Your bookmarked ashrams and retreat centres in Uttarakhand.</p>
            </div>

            {wishlistedCentres.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlistedCentres.map((centre) => (
                  <div key={centre.id} className="bg-[#F7F5EE]/60 p-4 rounded-xl border border-[#E2E5DD] flex items-center space-x-4">
                    <img src={centre.coverImage} alt={centre.name} className="w-24 h-24 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 space-y-1 text-xs">
                      <h4 className="font-serif font-bold text-base text-[#263D32]">{centre.name}</h4>
                      <span className="text-[#59665C] block">{centre.city}</span>
                      <span className="font-serif font-bold text-sm text-[#536B50] block">
                        From {formatPrice(centre.startingPriceUSD)}
                      </span>
                      <div className="pt-1 flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setSelectedCentreId(centre.id);
                            setActiveView('centre-detail');
                          }}
                          className="text-[#263D32] underline font-semibold hover:text-[#536B50] cursor-pointer"
                        >
                          View Centre &rarr;
                        </button>
                        <button
                          onClick={() => toggleWishlist(centre.id)}
                          className="text-[#B42318] hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#F7F5EE]/40 rounded-xl border border-dashed border-[#E2E5DD]">
                <Heart className="w-10 h-10 text-[#536B50]/40 mx-auto mb-2" />
                <p className="text-sm text-[#59665C] font-serif font-bold">Your wishlist is empty</p>
                <p className="text-xs text-[#8E9B91] mt-1">Tap the heart icon on any yoga centre to save it for your Himalayan journey.</p>
                <button
                  onClick={() => setActiveView('retreats')}
                  className="mt-4 bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                >
                  Browse Sanctuaries
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E5DD] shadow-sm space-y-6 animate-in fade-in">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#263D32]">My Submitted Enquiries ({myEnquiries.length})</h2>
              <p className="text-xs text-[#59665C] mt-1">Direct questions and messages submitted to yoga centres.</p>
            </div>

            {myEnquiries.length > 0 ? (
              <div className="space-y-4">
                {myEnquiries.map((enq) => (
                  <div key={enq.id} className="bg-[#F7F5EE]/60 p-5 rounded-xl border border-[#E2E5DD] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs bg-[#E6EDE2] text-[#263D32] font-bold px-2 py-0.5 rounded">
                          {enq.referenceCode}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#263D32]">{enq.centreName || 'Yoga Centre'}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase self-start sm:self-auto ${
                        enq.status === 'converted' ? 'bg-[#E6EDE2] text-[#286749]' :
                        enq.status === 'contacted' ? 'bg-[#E6EDE2] text-[#263D32]' :
                        'bg-[#DCCDB5]/50 text-[#252C27]'
                      }`}>
                        {enq.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-[#252C27] bg-white p-3 rounded-lg border border-[#E2E5DD]/70">
                      &ldquo;{enq.message}&rdquo;
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-[#59665C] pt-1">
                      <span>Preferred Dates: <strong>{enq.preferredDates || 'Flexible'}</strong></span>
                      <span>Guests: <strong>{enq.participantsCount}</strong></span>
                      <span>Submitted: <strong>{new Date(enq.createdAt).toLocaleDateString()}</strong></span>
                    </div>

                    {enq.internalNotes && (
                      <div className="text-xs bg-[#E6EDE2]/50 text-[#263D32] p-2.5 rounded-lg border border-[#A5B89A]/30">
                        <strong>Response from Centre:</strong> {enq.internalNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#F7F5EE]/40 rounded-xl border border-dashed border-[#E2E5DD]">
                <MessageSquare className="w-10 h-10 text-[#536B50]/40 mx-auto mb-2" />
                <p className="text-sm text-[#59665C] font-serif font-bold">No enquiries submitted yet</p>
                <p className="text-xs text-[#8E9B91] mt-1">Have questions about a retreat? Enquire directly from any yoga centre page.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TRAVEL & YOGA PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E5DD] shadow-sm space-y-6 animate-in fade-in max-w-3xl">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#263D32]">Travel and Yoga Preferences</h2>
              <p className="text-xs text-[#59665C] mt-1">
                Customize your yoga practice style and dietary preferences so ashrams can personalize your stay.
              </p>
            </div>

            {prefSavedMsg && (
              <div className="bg-[#E6EDE2] border border-[#286749]/30 text-[#286749] p-3 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#286749] shrink-0" />
                <span>{prefSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#263D32] mb-1">Preferred Yoga Style</label>
                <select
                  value={prefForm.yogaStyle}
                  onChange={(e) => setPrefForm(prev => ({ ...prev, yogaStyle: e.target.value }))}
                  className="w-full bg-[#F7F5EE] border border-[#E2E5DD] text-xs font-semibold text-[#263D32] rounded-xl p-3 focus:outline-none"
                >
                  <option value="Hatha">Traditional Classical Hatha Yoga</option>
                  <option value="Ashtanga">Ashtanga Vinyasa Primary Series</option>
                  <option value="Vinyasa">Vinyasa Flow</option>
                  <option value="Kundalini">Kundalini &amp; Tantra Kriya</option>
                  <option value="Ayurveda & Yoga">Ayurvedic Rejuvenation &amp; Yoga</option>
                  <option value="Iyengar">Iyengar Yoga (Alignment &amp; Props)</option>
                  <option value="Yin">Yin Yoga &amp; Sound Healing</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Experience Level</label>
                  <select
                    value={prefForm.experienceLevel}
                    onChange={(e) => setPrefForm(prev => ({ ...prev, experienceLevel: e.target.value as any }))}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] text-xs font-semibold text-[#263D32] rounded-xl p-3 focus:outline-none"
                  >
                    <option value="beginner">Beginner (New to Yoga / 0-1 yr)</option>
                    <option value="intermediate">Intermediate (Regular Practice / 1-3 yrs)</option>
                    <option value="advanced">Advanced (Experienced / TTC graduate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Dietary Preference</label>
                  <select
                    value={prefForm.dietaryPreference}
                    onChange={(e) => setPrefForm(prev => ({ ...prev, dietaryPreference: e.target.value as any }))}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] text-xs font-semibold text-[#263D32] rounded-xl p-3 focus:outline-none"
                  >
                    <option value="sattvic">Pure Sattvic (No onion, no garlic)</option>
                    <option value="vegetarian">Vegetarian (Lacto-vegetarian)</option>
                    <option value="vegan">100% Plant-Based Vegan</option>
                    <option value="regular">Regular Healthy Organic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Accommodation Room Preference</label>
                  <select
                    value={prefForm.roomType}
                    onChange={(e) => setPrefForm(prev => ({ ...prev, roomType: e.target.value as any }))}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] text-xs font-semibold text-[#263D32] rounded-xl p-3 focus:outline-none"
                  >
                    <option value="private">Private Room with Attached Bath</option>
                    <option value="shared">Shared Ashram Dormitory (Budget)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Preferred Himalayan Destination</label>
                  <input
                    type="text"
                    value={prefForm.preferredLocation || ''}
                    onChange={(e) => setPrefForm(prev => ({ ...prev, preferredLocation: e.target.value }))}
                    placeholder="e.g. Rishikesh (Swarg Ashram / Tapovan), Uttarkashi"
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] text-xs font-semibold text-[#263D32] rounded-xl p-3 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold px-6 py-3 rounded-xl transition shadow-sm cursor-pointer"
              >
                Save Preferences
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: ACCOUNT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E5DD] shadow-sm space-y-6 animate-in fade-in max-w-3xl">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#263D32]">Account Settings</h2>
              <p className="text-xs text-[#59665C] mt-1">Manage your personal traveller profile and contact details.</p>
            </div>

            {profileSavedMsg && (
              <div className="bg-[#E6EDE2] border border-[#286749]/30 text-[#286749] p-3 rounded-xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#286749] shrink-0" />
                <span>{profileSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#263D32] mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-[#F7F5EE] border border-[#E2E5DD] text-xs font-semibold text-[#263D32] rounded-xl p-3 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263D32] mb-1">Registered Email (Read-Only)</label>
                <input
                  type="email"
                  value={userProfile?.email || ''}
                  disabled
                  className="w-full bg-[#F7F5EE]/60 border border-[#E2E5DD] text-xs font-semibold text-[#8E9B91] rounded-xl p-3 cursor-not-allowed"
                />
                <span className="text-[10px] text-[#8E9B91] mt-1 block">Account authentication is bound to your verified email.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] text-xs font-semibold text-[#263D32] rounded-xl p-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Country of Residence</label>
                  <input
                    type="text"
                    value={profileForm.country}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] text-xs font-semibold text-[#263D32] rounded-xl p-3 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold px-6 py-3 rounded-xl transition shadow-sm cursor-pointer"
              >
                Update Account Information
              </button>
            </form>

            <div className="pt-6 border-t border-[#E2E5DD] space-y-3">
              <h3 className="font-serif font-bold text-base text-[#263D32]">Security &amp; Session</h3>
              <p className="text-xs text-[#59665C]">
                Your account is authenticated via Supabase JWT with Row Level Security (RLS) policies protecting your private retreat bookings.
              </p>
              <button
                onClick={() => logout()}
                className="bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#B42318] text-xs font-semibold px-4 py-2.5 rounded-xl transition border border-[#FECDCA] inline-flex items-center space-x-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#B42318]" />
                <span>Log Out of Session</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* CANCELLATION REQUEST MODAL */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E5DD] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 text-[#B42318]">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif font-bold text-lg text-[#263D32]">Request Cancellation</h3>
            </div>
            <p className="text-xs text-[#59665C]">
              Are you sure you wish to cancel this booking? Cancellations follow the sanctuary policy. A cancellation notice will be recorded in the platform ledger.
            </p>
            <div>
              <label className="block text-xs font-bold text-[#263D32] mb-1">Reason for Cancellation (Optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule change, flight delay, personal emergency..."
                className="w-full bg-[#F7F5EE] border border-[#E2E5DD] text-xs rounded-xl p-3 focus:outline-none min-h-[80px]"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#59665C] hover:bg-[#F7F5EE] transition"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#B42318] text-white hover:bg-[#912018] transition shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT / VOUCHER MODAL */}
      {receiptBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E5DD] space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E5DD]">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#536B50]" />
                <h3 className="font-serif font-bold text-xl text-[#263D32]">Retreat Voucher &amp; Receipt</h3>
              </div>
              <button
                onClick={() => setReceiptBooking(null)}
                className="text-[#8E9B91] hover:text-[#263D32] text-xs font-bold p-1 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                <div>
                  <span className="text-[#8E9B91] block text-[10px] uppercase font-bold">Booking Reference</span>
                  <span className="font-mono font-bold text-[#263D32] text-sm">{receiptBooking.referenceCode}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#8E9B91] block text-[10px] uppercase font-bold">Verification Status</span>
                  <span className="font-bold text-[#286749] bg-[#E6EDE2] px-2 py-0.5 rounded">
                    {receiptBooking.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F7F5EE]/50 rounded-xl">
                  <span className="text-[#8E9B91] block text-[10px]">Centre &amp; Ashram</span>
                  <span className="font-bold text-[#263D32]">{receiptBooking.centreName}</span>
                </div>
                <div className="p-3 bg-[#F7F5EE]/50 rounded-xl">
                  <span className="text-[#8E9B91] block text-[10px]">Offering / Course</span>
                  <span className="font-bold text-[#263D32]">{receiptBooking.courseTitle}</span>
                </div>
                <div className="p-3 bg-[#F7F5EE]/50 rounded-xl">
                  <span className="text-[#8E9B91] block text-[10px]">Start Date</span>
                  <span className="font-bold text-[#263D32]">{receiptBooking.startDate} ({receiptBooking.durationDays} Days)</span>
                </div>
                <div className="p-3 bg-[#F7F5EE]/50 rounded-xl">
                  <span className="text-[#8E9B91] block text-[10px]">Guests &amp; Room</span>
                  <span className="font-bold text-[#263D32]">{receiptBooking.participantsCount} Person • {receiptBooking.roomType}</span>
                </div>
              </div>

              <div className="p-4 bg-[#E6EDE2]/40 rounded-xl border border-[#A5B89A]/30 flex items-center justify-between">
                <div>
                  <span className="text-[#263D32] font-serif font-bold text-sm block">Total Package Amount</span>
                  <span className="text-[10px] text-[#59665C]">Verified Payment in Escrow</span>
                </div>
                <span className="font-serif font-bold text-2xl text-[#263D32]">
                  {formatPrice(receiptBooking.totalUSD)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E5DD] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-gold-400 fill-current" />
                <h3 className="font-serif font-bold text-lg text-[#263D32]">Write Verified Review</h3>
              </div>
              <button
                onClick={() => setReviewBooking(null)}
                className="text-[#8E9B91] hover:text-[#263D32] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {reviewSuccessMsg ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E6EDE2] text-[#286749] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[#263D32]">Review Submitted Successfully</h4>
                <p className="text-xs text-[#59665C]">
                  Thank you! Your verified practitioner review has been published with an authenticity badge.
                </p>
                <button
                  onClick={() => setReviewBooking(null)}
                  className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitReview({
                    centreId: reviewBooking.centreId,
                    courseName: reviewBooking.courseTitle,
                    authorName: userProfile?.fullName || reviewBooking.customerName,
                    authorCountry: userProfile?.country || reviewBooking.customerCountry || 'India',
                    authorAvatar: userProfile?.avatarUrl || '',
                    authorEmail: userProfile?.email || reviewBooking.customerEmail,
                    rating: reviewRating,
                    title: reviewTitle,
                    comment: reviewComment,
                    teacherRating: reviewRating,
                    foodRating: reviewRating,
                    stayRating: reviewRating,
                    isVerifiedBooking: true,
                    bookingRef: reviewBooking.referenceCode
                  });
                  setReviewSuccessMsg('Your verified practitioner review has been submitted.');
                }}
                className="space-y-4 text-xs"
              >
                <div className="p-3 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]">
                  <span className="font-bold text-[#263D32] block">{reviewBooking.courseTitle}</span>
                  <span className="text-[11px] text-[#59665C]">{reviewBooking.centreName} • Ref #{reviewBooking.referenceCode}</span>
                </div>

                <div>
                  <label className="block text-[#263D32] font-semibold mb-1">Overall Rating</label>
                  <div className="flex items-center space-x-1.5 text-gold-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="cursor-pointer hover:scale-110 transition"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-current text-gold-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#263D32] ml-2">{reviewRating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[#263D32] font-semibold mb-1">Headline / Title *</label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Life-changing Himalayan immersion"
                    className="w-full px-3 py-2 border border-[#E2E5DD] rounded-xl text-[#263D32] focus:outline-hidden focus:border-[#536B50]"
                  />
                </div>

                <div>
                  <label className="block text-[#263D32] font-semibold mb-1">Detailed Review *</label>
                  <textarea
                    rows={4}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience regarding ashram discipline, lineage masters, sattvic meals, and accommodation..."
                    className="w-full px-3 py-2 border border-[#E2E5DD] rounded-xl text-[#263D32] focus:outline-hidden focus:border-[#536B50] resize-none"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewBooking(null)}
                    className="w-1/2 bg-gray-100 hover:bg-gray-200 text-[#263D32] font-semibold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#536B50] hover:bg-[#40563E] text-white font-semibold py-2.5 rounded-xl transition cursor-pointer shadow-sm"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
