'use client';

import React, { useState, useMemo } from 'react';
import { 
  UserCheck, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Settings, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Award, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  Search, 
  Edit3, 
  Save, 
  CreditCard, 
  ArrowRight, 
  BookOpen,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { YogaInstructor, TeachingEnquiry } from '../../types';

export const InstructorDashboard: React.FC = () => {
  const { 
    userProfile, 
    activeInstructor, 
    teachingEnquiries, 
    updateInstructorProfile, 
    updateTeachingEnquiryStatus,
    updateTeachingEnquiryPayment,
    instructorDashboardTab, 
    setInstructorDashboardTab,
    logout,
    formatPrice
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(instructorDashboardTab || 'overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<TeachingEnquiry | null>(null);
  const [instructorNotesInput, setInstructorNotesInput] = useState('');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Profile Edit Form State
  const [editForm, setEditForm] = useState({
    fullName: activeInstructor?.fullName || userProfile?.fullName || 'Yoga Instructor',
    phone: activeInstructor?.phone || userProfile?.phone || '',
    city: activeInstructor?.city || 'Rishikesh',
    state: activeInstructor?.state || 'Uttarakhand',
    country: activeInstructor?.country || 'India',
    qualifications: activeInstructor?.qualifications || '',
    bio: activeInstructor?.bio || '',
    pricingRange: activeInstructor?.pricingRange || '$45 - $90 / session',
    onlineAvailability: activeInstructor?.onlineAvailability ?? true,
    inPersonAvailability: activeInstructor?.inPersonAvailability ?? true,
    teachingHours: activeInstructor?.teachingHours || 'Morning & Evening',
    specializations: (activeInstructor?.specializations || ['Pranayama', 'Asana Alignment']).join(', ')
  });

  // Strict isolation: only enquiries for THIS instructor
  const myEnquiries = useMemo(() => {
    if (!activeInstructor) {
      // Fallback matching by email
      return teachingEnquiries.filter(e => 
        (e.instructorId && userProfile?.instructorId && e.instructorId === userProfile.instructorId) ||
        (userProfile?.email && e.instructorName?.toLowerCase().includes((userProfile.fullName || '').toLowerCase()))
      );
    }
    return teachingEnquiries.filter(e => e.instructorId === activeInstructor.id);
  }, [teachingEnquiries, activeInstructor, userProfile]);

  // Financial and KPI calculations strictly from verified records
  const metrics = useMemo(() => {
    const totalEnquiries = myEnquiries.length;
    const newEnquiries = myEnquiries.filter(e => e.status === 'new').length;
    const upcomingSessions = myEnquiries.filter(e => e.status === 'scheduled').length;
    const completedSessions = myEnquiries.filter(e => e.status === 'completed').length;
    const cancelledSessions = myEnquiries.filter(e => e.status === 'cancelled').length;

    // Total gross session value of all booked/completed sessions
    const validSessions = myEnquiries.filter(e => e.status === 'scheduled' || e.status === 'completed');
    const totalSessionValue = validSessions.reduce((sum, e) => sum + (e.sessionFee || 0), 0);

    // Verified payments received in Escrow
    const verifiedPaid = myEnquiries.filter(e => e.paymentStatus === 'paid');
    const verifiedPaymentsReceived = verifiedPaid.reduce((sum, e) => sum + (e.sessionFee || 0), 0);

    // Pending payments from customers
    const pendingPaid = myEnquiries.filter(e => e.paymentStatus === 'unpaid' && e.status !== 'cancelled');
    const pendingPayments = pendingPaid.reduce((sum, e) => sum + (e.sessionFee || 0), 0);

    // Platform commission (e.g. 10%)
    const platformCommission = verifiedPaid.reduce((sum, e) => sum + (e.platformCommission || 0), 0);

    // Net earnings payable to instructor
    const netEarnings = verifiedPaid.reduce((sum, e) => sum + (e.instructorNet || 0), 0);

    return {
      totalEnquiries,
      newEnquiries,
      upcomingSessions,
      completedSessions,
      cancelledSessions,
      totalSessionValue,
      verifiedPaymentsReceived,
      pendingPayments,
      platformCommission,
      netEarnings,
      payoutStatus: verifiedPaymentsReceived > 0 ? 'Ready for Monthly Bank Payout' : 'No Settled Balances'
    };
  }, [myEnquiries]);

  // Filtered enquiries
  const filteredEnquiries = useMemo(() => {
    return myEnquiries.filter(e => {
      const matchesSearch = 
        (e.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.sessionType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.id || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [myEnquiries, searchQuery, statusFilter]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInstructor) return;
    await updateInstructorProfile(activeInstructor.id, {
      fullName: editForm.fullName,
      phone: editForm.phone,
      city: editForm.city,
      state: editForm.state,
      country: editForm.country,
      qualifications: editForm.qualifications,
      bio: editForm.bio,
      pricingRange: editForm.pricingRange,
      onlineAvailability: editForm.onlineAvailability,
      inPersonAvailability: editForm.inPersonAvailability,
      teachingHours: editForm.teachingHours,
      specializations: editForm.specializations.split(',').map(s => s.trim()).filter(Boolean)
    });
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleUpdateStatus = async (enquiryId: string, newStatus: TeachingEnquiry['status']) => {
    await updateTeachingEnquiryStatus(enquiryId, newStatus, instructorNotesInput);
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus, instructorNotes: instructorNotesInput } : null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Dashboard Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-[#536B50] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md shrink-0">
              {activeInstructor?.fullName?.charAt(0) || userProfile?.fullName?.charAt(0) || 'I'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-[#E6EDE2] text-[#286749] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Independent Yoga Instructor
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  activeInstructor?.status === 'approved' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {activeInstructor?.status === 'approved' ? 'Verified Public Profile' : 'Pending Verification'}
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32] mt-1">
                {activeInstructor?.fullName || userProfile?.fullName || 'Yogacharya'}
              </h1>
              <p className="text-xs text-[#59665C] flex items-center space-x-3 mt-1">
                <span>{activeInstructor?.email || userProfile?.email}</span>
                <span>•</span>
                <span>{activeInstructor?.city || 'Rishikesh'}, {activeInstructor?.state || 'Uttarakhand'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => logout()}
              className="bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#E2E5DD] overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'overview' ? 'bg-[#536B50] text-white shadow-xs' : 'text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'profile' ? 'bg-[#536B50] text-white shadow-xs' : 'text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Professional Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'enquiries' ? 'bg-[#536B50] text-white shadow-xs' : 'text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>My Enquiries</span>
            {metrics.newEnquiries > 0 && (
              <span className="bg-emerald-400 text-[#1E3228] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {metrics.newEnquiries}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'sessions' ? 'bg-[#536B50] text-white shadow-xs' : 'text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Teaching Sessions</span>
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'financials' ? 'bg-[#536B50] text-white shadow-xs' : 'text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financial Records &amp; Payouts</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'settings' ? 'bg-[#536B50] text-white shadow-xs' : 'text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW METRIC CARDS (PROMPT SECTION 6)           */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* 11 Overview KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs">
                <span className="text-[10px] font-bold tracking-wider text-[#8E9B91] uppercase">Total Teaching Enquiries</span>
                <div className="font-serif font-bold text-2xl text-[#263D32] mt-1">{metrics.totalEnquiries}</div>
                <span className="text-[11px] text-[#59665C]">Inquiries received to date</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs">
                <span className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase">New Enquiries</span>
                <div className="font-serif font-bold text-2xl text-emerald-700 mt-1">{metrics.newEnquiries}</div>
                <span className="text-[11px] text-[#59665C]">Awaiting initial reply</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs">
                <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase">Upcoming Sessions</span>
                <div className="font-serif font-bold text-2xl text-blue-700 mt-1">{metrics.upcomingSessions}</div>
                <span className="text-[11px] text-[#59665C]">Scheduled &amp; confirmed</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs">
                <span className="text-[10px] font-bold tracking-wider text-purple-700 uppercase">Completed Sessions</span>
                <div className="font-serif font-bold text-2xl text-purple-700 mt-1">{metrics.completedSessions}</div>
                <span className="text-[11px] text-[#59665C]">Taught engagements</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs">
                <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Cancelled Sessions</span>
                <div className="font-serif font-bold text-2xl text-gray-700 mt-1">{metrics.cancelledSessions}</div>
                <span className="text-[11px] text-[#59665C]">Student cancellations</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs">
                <span className="text-[10px] font-bold tracking-wider text-[#8E9B91] uppercase">Total Session Value</span>
                <div className="font-serif font-bold text-2xl text-[#263D32] mt-1">${metrics.totalSessionValue.toFixed(2)}</div>
                <span className="text-[11px] text-[#59665C]">Gross booking value</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs">
                <span className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase">Verified Payments Received</span>
                <div className="font-serif font-bold text-2xl text-emerald-700 mt-1">${metrics.verifiedPaymentsReceived.toFixed(2)}</div>
                <span className="text-[11px] text-[#59665C]">Verified in Escrow</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs">
                <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase">Pending Payments</span>
                <div className="font-serif font-bold text-2xl text-amber-700 mt-1">${metrics.pendingPayments.toFixed(2)}</div>
                <span className="text-[11px] text-[#59665C]">Unpaid customer balances</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs">
                <span className="text-[10px] font-bold tracking-wider text-[#8E9B91] uppercase">Platform Commission (10%)</span>
                <div className="font-serif font-bold text-2xl text-[#59665C] mt-1">${metrics.platformCommission.toFixed(2)}</div>
                <span className="text-[11px] text-[#59665C]">Escrow processing fee</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#286749] shadow-xs bg-gradient-to-br from-white to-[#F0F5EE]">
                <span className="text-[10px] font-bold tracking-wider text-[#286749] uppercase">Net Earnings</span>
                <div className="font-serif font-bold text-2xl text-[#286749] mt-1">${metrics.netEarnings.toFixed(2)}</div>
                <span className="text-[11px] text-[#59665C]">Directly payable to you</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs col-span-2">
                <span className="text-[10px] font-bold tracking-wider text-[#8E9B91] uppercase">Payout Status</span>
                <div className="font-serif font-bold text-base text-[#263D32] mt-1">{metrics.payoutStatus}</div>
                <span className="text-[11px] text-[#59665C]">Automatic direct NEFT / Wire transfer to your bank account</span>
              </div>
            </div>

            {/* Quick Actions & Recent Enquiries */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#263D32]">Recent Student Enquiries</h3>
                  <p className="text-xs text-[#59665C]">Latest teaching inquiries assigned to your personal profile</p>
                </div>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs text-[#536B50] font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All Enquiries</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {myEnquiries.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#59665C]">
                  No enquiries received yet. Your profile is ready to receive student requests.
                </div>
              ) : (
                <div className="divide-y divide-[#E2E5DD]/60">
                  {myEnquiries.slice(0, 3).map(enq => (
                    <div key={enq.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-[#263D32]">{enq.customerName}</div>
                        <div className="text-[11px] text-[#59665C]">{enq.sessionType} • {enq.requestedDates || 'Flexible'}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          enq.status === 'new' ? 'bg-emerald-50 text-emerald-700' :
                          enq.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                          enq.status === 'completed' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {enq.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setActiveTab('enquiries');
                          }}
                          className="text-xs font-semibold text-[#536B50] hover:underline cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INSTRUCTOR PROFILE MANAGEMENT                      */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E5DD] shadow-sm max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#263D32]">Professional Profile Management</h3>
                <p className="text-xs text-[#59665C] mt-1">
                  Keep your teaching biography, qualifications, session fees, and availability updated.
                </p>
              </div>
              {profileSaveSuccess && (
                <span className="bg-[#E6EDE2] text-[#286749] text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Profile Saved</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Mobile Contact</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">City &amp; State</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-2.5 py-2 text-xs"
                    />
                    <input
                      type="text"
                      value={editForm.state}
                      onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                      className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-2.5 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Session Pricing Range</label>
                  <input
                    type="text"
                    value={editForm.pricingRange}
                    onChange={e => setEditForm({ ...editForm, pricingRange: e.target.value })}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Qualifications &amp; Certifications</label>
                  <input
                    type="text"
                    value={editForm.qualifications}
                    onChange={e => setEditForm({ ...editForm, qualifications: e.target.value })}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Professional Biography</label>
                  <textarea
                    rows={4}
                    value={editForm.bio}
                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Specializations (Comma-separated)</label>
                  <input
                    type="text"
                    value={editForm.specializations}
                    onChange={e => setEditForm({ ...editForm, specializations: e.target.value })}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Available Teaching Hours</label>
                  <input
                    type="text"
                    value={editForm.teachingHours}
                    onChange={e => setEditForm({ ...editForm, teachingHours: e.target.value })}
                    className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263D32] mb-1">Session Delivery Modes</label>
                  <div className="flex items-center space-x-4 pt-2">
                    <label className="flex items-center space-x-1.5 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.onlineAvailability}
                        onChange={e => setEditForm({ ...editForm, onlineAvailability: e.target.checked })}
                        className="rounded text-[#536B50]"
                      />
                      <span>Online Sessions</span>
                    </label>
                    <label className="flex items-center space-x-1.5 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.inPersonAvailability}
                        onChange={e => setEditForm({ ...editForm, inPersonAvailability: e.target.checked })}
                        className="rounded text-[#536B50]"
                      />
                      <span>In-Person Sessions</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ENQUIRY & SESSION MANAGEMENT                       */}
        {/* ========================================================= */}
        {(activeTab === 'enquiries' || activeTab === 'sessions') && (
          <div className="space-y-6 animate-in fade-in">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E5DD] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8E9B91] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by student name, email, or session type..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#263D32]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-[#59665C]" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-2 text-xs text-[#263D32] focus:outline-none"
                >
                  <option value="all">All Enquiries ({myEnquiries.length})</option>
                  <option value="new">New ({myEnquiries.filter(e => e.status === 'new').length})</option>
                  <option value="scheduled">Scheduled ({myEnquiries.filter(e => e.status === 'scheduled').length})</option>
                  <option value="completed">Completed ({myEnquiries.filter(e => e.status === 'completed').length})</option>
                  <option value="cancelled">Cancelled ({myEnquiries.filter(e => e.status === 'cancelled').length})</option>
                </select>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-3xl border border-[#E2E5DD] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F7F5EE] text-[#59665C] border-b border-[#E2E5DD] uppercase text-[10px] font-bold tracking-wider">
                      <th className="py-3.5 px-4">Ref #</th>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Session Type</th>
                      <th className="py-3.5 px-4">Dates</th>
                      <th className="py-3.5 px-4">Fee (USD)</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5DD]/70">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-xs text-[#59665C]">
                          No teaching enquiries found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map(enq => (
                        <tr key={enq.id} className="hover:bg-[#F7F5EE]/60 transition">
                          <td className="py-3 px-4 font-mono font-medium text-[#263D32]">{enq.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#263D32]">{enq.customerName}</div>
                            <div className="text-[11px] text-[#59665C]">{enq.customerEmail}</div>
                          </td>
                          <td className="py-3 px-4 font-medium text-[#263D32]">{enq.sessionType}</td>
                          <td className="py-3 px-4 text-[#59665C]">{enq.requestedDates || 'Flexible'}</td>
                          <td className="py-3 px-4 font-semibold text-[#263D32]">${(enq.sessionFee || 0).toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              enq.status === 'new' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              enq.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              enq.status === 'completed' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {enq.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              enq.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {enq.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedEnquiry(enq);
                                setInstructorNotesInput(enq.instructorNotes || '');
                              }}
                              className="bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] font-semibold text-[11px] px-3 py-1.5 rounded-lg transition cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Enquiry Details & Action Modal */}
            {selectedEnquiry && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#E2E5DD] shadow-xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#536B50]">
                        Enquiry Ref #{selectedEnquiry.id}
                      </span>
                      <h3 className="font-serif font-bold text-xl text-[#263D32]">
                        {selectedEnquiry.sessionType}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 p-3 bg-[#F7F5EE] rounded-xl">
                      <div>
                        <span className="text-[10px] text-[#8E9B91] block">Student Name</span>
                        <span className="font-bold text-[#263D32]">{selectedEnquiry.customerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8E9B91] block">Contact Email</span>
                        <span className="font-semibold text-[#263D32]">{selectedEnquiry.customerEmail}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8E9B91] block">Requested Dates</span>
                        <span className="text-[#263D32]">{selectedEnquiry.requestedDates || 'Flexible'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8E9B91] block">Participants</span>
                        <span className="text-[#263D32]">{selectedEnquiry.participantsCount || 1} Person(s)</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#59665C] block mb-1">Student Message:</span>
                      <p className="p-3 bg-white border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] leading-relaxed">
                        "{selectedEnquiry.message}"
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                      <div>
                        <span className="text-[10px] text-emerald-800 block">Session Fee</span>
                        <span className="font-bold text-sm text-[#263D32]">${(selectedEnquiry.sessionFee || 0).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-800 block">Commission</span>
                        <span className="font-semibold text-xs text-[#59665C]">-${(selectedEnquiry.platformCommission || 0).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-800 block">Your Net</span>
                        <span className="font-bold text-sm text-[#286749]">${(selectedEnquiry.instructorNet || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#59665C] mb-1">Your Private Instructor Notes:</label>
                      <textarea
                        rows={2}
                        value={instructorNotesInput}
                        onChange={e => setInstructorNotesInput(e.target.value)}
                        placeholder="Add preparation cues, zoom link, or shala directions..."
                        className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl p-2.5 text-xs text-[#263D32]"
                      />
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-[#E2E5DD] space-y-2">
                    <span className="text-[10px] font-bold text-[#8E9B91] uppercase tracking-wider block">Update Status:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedEnquiry.id, 'scheduled')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition cursor-pointer"
                      >
                        Confirm &amp; Schedule
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedEnquiry.id, 'completed')}
                        className="px-3 py-1.5 bg-[#286749] hover:bg-[#1E4D37] text-white font-semibold text-xs rounded-lg transition cursor-pointer"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedEnquiry.id, 'cancelled')}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                      >
                        Cancel Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: FINANCIAL RECORDS & PAYOUTS                        */}
        {/* ========================================================= */}
        {activeTab === 'financials' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-sm space-y-4">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#263D32]">Instructor Financial Transparency</h3>
                <p className="text-xs text-[#59665C] mt-1">
                  Transparent breakdown of all completed sessions, verified student payments, and net earnings payable to you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD]">
                  <span className="text-[10px] text-[#8E9B91] uppercase font-bold">Total Verified Payments</span>
                  <div className="font-serif font-bold text-2xl text-[#263D32] mt-1">${metrics.verifiedPaymentsReceived.toFixed(2)}</div>
                  <span className="text-[11px] text-[#59665C]">From verified student bookings</span>
                </div>

                <div className="p-4 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD]">
                  <span className="text-[10px] text-[#8E9B91] uppercase font-bold">Platform Fee (10%)</span>
                  <div className="font-serif font-bold text-2xl text-[#59665C] mt-1">${metrics.platformCommission.toFixed(2)}</div>
                  <span className="text-[11px] text-[#59665C]">Payment gateway &amp; directory hosting</span>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold">Net Earnings Payable</span>
                  <div className="font-serif font-bold text-2xl text-[#286749] mt-1">${metrics.netEarnings.toFixed(2)}</div>
                  <span className="text-[11px] text-[#59665C]">Direct bank deposit schedule</span>
                </div>
              </div>

              {/* Verified Ledger Table */}
              <div className="pt-4">
                <h4 className="font-bold text-xs text-[#263D32] mb-2 uppercase tracking-wider">Session Ledger Entries</h4>
                <div className="border border-[#E2E5DD] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#F7F5EE] text-[#59665C] uppercase text-[10px] font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Session Ref</th>
                        <th className="py-2.5 px-3">Student</th>
                        <th className="py-2.5 px-3">Offering</th>
                        <th className="py-2.5 px-3">Gross Fee</th>
                        <th className="py-2.5 px-3">Commission</th>
                        <th className="py-2.5 px-3">Net Payable</th>
                        <th className="py-2.5 px-3">Payment State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E5DD]/60">
                      {myEnquiries.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-xs text-[#59665C]">
                            No financial transactions recorded yet.
                          </td>
                        </tr>
                      ) : (
                        myEnquiries.map(enq => (
                          <tr key={enq.id} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3 font-mono font-medium text-[#263D32]">{enq.id}</td>
                            <td className="py-2.5 px-3 font-medium text-[#263D32]">{enq.customerName}</td>
                            <td className="py-2.5 px-3 text-[#59665C]">{enq.sessionType}</td>
                            <td className="py-2.5 px-3 font-semibold text-[#263D32]">${(enq.sessionFee || 0).toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-[#59665C]">-${(enq.platformCommission || 0).toFixed(2)}</td>
                            <td className="py-2.5 px-3 font-bold text-[#286749]">${(enq.instructorNet || 0).toFixed(2)}</td>
                            <td className="py-2.5 px-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                enq.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {enq.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ACCOUNT SETTINGS                                  */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E5DD] shadow-sm max-w-2xl space-y-6">
            <div>
              <h3 className="font-serif font-bold text-2xl text-[#263D32]">Instructor Account Settings</h3>
              <p className="text-xs text-[#59665C] mt-1">Manage security, credentials, and notification preferences.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#263D32]">Account Role &amp; ID</div>
                  <div className="text-[11px] text-[#59665C]">Independent Yoga Instructor • {activeInstructor?.id || userProfile?.id}</div>
                </div>
                <span className="bg-[#E6EDE2] text-[#286749] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  Verified
                </span>
              </div>

              <div className="p-4 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#263D32]">Registered Email</div>
                  <div className="text-[11px] text-[#59665C]">{activeInstructor?.email || userProfile?.email}</div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered email.')}
                  className="bg-white border border-[#E2E5DD] hover:bg-[#E6EDE2] text-[#263D32] text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Reset Password
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => logout()}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer border border-red-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Instructor Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
