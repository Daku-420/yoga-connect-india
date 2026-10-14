import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  Lock, 
  TrendingUp, 
  Award, 
  DollarSign,
  Crown,
  Eye,
  ShieldAlert,
  Sparkles,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Clock,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Send,
  MessageSquare,
  FileSpreadsheet,
  FileText,
  CreditCard,
  ChevronRight,
  Check,
  RefreshCw,
  LogIn
} from 'lucide-react';
import { CentreMatchmakerBuilder } from './CentreMatchmakerBuilder';
import { BookingRequest, FinancialLedgerEntry, PayoutRecord, FinancialQuery } from '../../types';
import { exportLedgerToCSV, printCentreStatement } from '../../utils/statementExport';

export const CentreDashboard: React.FC = () => {
  const { 
    centres, 
    courses, 
    bookings, 
    addNewCourse, 
    formatPrice, 
    currency, 
    userProfile, 
    userRole, 
    partnerCentre, 
    partnerMembership, 
    getCentreLedgerEntries, 
    getCentreFinancialMetrics, 
    getCentrePayouts, 
    financialQueries, 
    createFinancialQuery, 
    updateCentreProfile, 
    setActiveView,
    setIsAuthModalOpen,
    loginAsPersona
  } = useApp();

  // Determine active centre: If partner, strictly lock to partner's assigned centre.
  // If admin is previewing, allow inspecting selected centre.
  const activeCentre = useMemo(() => {
    if (userRole === 'admin') {
      return partnerCentre || centres[0];
    }
    return partnerCentre || (userProfile?.assignedCentreId ? centres.find(c => c.id === userProfile.assignedCentreId) : null) || centres[0];
  }, [userRole, partnerCentre, centres, userProfile]);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'bookings' | 'ledger' | 'payouts' | 'statements' | 'profile' | 'queries' | 'matchmaker'
  >('overview');

  // Booking Filters & Search
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<BookingRequest | null>(null);

  // Ledger Filter
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<string>('all');
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Financial Query Modal State
  const [isRaisingQuery, setIsRaisingQuery] = useState(false);
  const [querySubject, setQuerySubject] = useState('');
  const [queryMessage, setQueryMessage] = useState('');
  const [queryFeedback, setQueryFeedback] = useState('');

  // Centre Profile Edit State
  const [profileLocation, setProfileLocation] = useState(activeCentre?.location || '');
  const [profileTagline, setProfileTagline] = useState(activeCentre?.tagline || '');
  const [profileDescription, setProfileDescription] = useState(activeCentre?.description || '');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // New Course Modal State
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'200h-ttc' | '300h-ttc' | 'meditation' | 'ayurveda'>('200h-ttc');
  const [newPriceUSD, setNewPriceUSD] = useState(1200);
  const [newDuration, setNewDuration] = useState(14);

  // Security Verification: If account is suspended, strictly block access to protected records
  const isSuspended = userProfile?.membershipStatus === 'suspended' || partnerMembership?.status === 'suspended';

  // Strict isolation: Only load records belonging to active centre
  const myCentresBookings = useMemo(() => {
    if (!activeCentre) return [];
    return bookings.filter(b => b.centreId === activeCentre.id);
  }, [bookings, activeCentre]);

  const filteredBookings = useMemo(() => {
    return myCentresBookings.filter(b => {
      const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
      const matchesSearch = !bookingSearch || 
        b.referenceCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.courseTitle.toLowerCase().includes(bookingSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [myCentresBookings, bookingStatusFilter, bookingSearch]);

  const myLedgerEntries = useMemo(() => {
    if (!activeCentre) return [];
    return getCentreLedgerEntries(activeCentre.id);
  }, [getCentreLedgerEntries, activeCentre]);

  const filteredLedgerEntries = useMemo(() => {
    return myLedgerEntries.filter(e => {
      const matchesType = ledgerTypeFilter === 'all' || e.entryType === ledgerTypeFilter;
      const matchesSearch = !ledgerSearch || 
        e.description.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        (e.referenceCode || '').toLowerCase().includes(ledgerSearch.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [myLedgerEntries, ledgerTypeFilter, ledgerSearch]);

  const myPayouts = useMemo(() => {
    if (!activeCentre) return [];
    return getCentrePayouts(activeCentre.id);
  }, [getCentrePayouts, activeCentre]);

  const myQueries = useMemo(() => {
    if (!activeCentre) return [];
    return financialQueries.filter(q => q.centreId === activeCentre.id);
  }, [financialQueries, activeCentre]);

  const metrics = useMemo(() => {
    if (!activeCentre) {
      return {
        totalBookings: 0,
        confirmedBookings: 0,
        upcomingBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        grossBookingValue: 0,
        platformCommission: 0,
        refunds: 0,
        netAmountPayable: 0,
        totalPayoutsCompleted: 0,
        outstandingPayableBalance: 0
      };
    }
    return getCentreFinancialMetrics(activeCentre.id);
  }, [getCentreFinancialMetrics, activeCentre]);

  // Handle Query Submission
  const handleRaiseQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCentre || !querySubject || !queryMessage) return;
    createFinancialQuery(activeCentre.id, querySubject, queryMessage);
    setIsRaisingQuery(false);
    setQuerySubject('');
    setQueryMessage('');
    setQueryFeedback('Your financial ticket was submitted directly to platform administration.');
    setTimeout(() => setQueryFeedback(''), 5000);
  };

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCentre) return;
    updateCentreProfile(activeCentre.id, {
      location: profileLocation,
      tagline: profileTagline,
      description: profileDescription
    });
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 4000);
  };

  // Handle Create Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCentre) return;
    addNewCourse({
      id: 'course-new-' + Date.now(),
      centreId: activeCentre.id,
      centreName: activeCentre.name,
      title: newTitle || 'Classical Yoga Immersion',
      subtitle: 'Accredited Yoga Alliance certification program',
      category: newCategory,
      durationDays: newDuration,
      priceUSD: newPriceUSD,
      certification: 'Yoga Alliance USA RYS',
      syllabus: ['Classical Asana Alignment', 'Pranayama & Kriyas', 'Vedic Philosophy', 'Meditation'],
      dailySchedule: [
        { time: '06:00 AM', activity: 'Morning Sadhana & Chanting' },
        { time: '09:00 AM', activity: 'Sattvic Breakfast' },
        { time: '04:30 PM', activity: 'Asana Lab & Anatomy' }
      ],
      mealsIncluded: '3 Sattvic Ayurvedic Meals Daily',
      accommodationOptions: ['Deluxe Single Room', 'Shared Twin Cottage'],
      upcomingDates: ['Nov 15, 2026', 'Dec 15, 2026'],
      photos: [activeCentre.coverImage],
      requirements: ['Open mind & commitment to daily yogic practice']
    });
    setIsAddingCourse(false);
    setNewTitle('');
  };

  // 1. Guard: Check if visitor/regular user is attempting to access Partner Portal
  const isAuthorizedPartner = 
    userRole === 'admin' || 
    userRole === 'partner' || 
    userRole === 'centre' || 
    userProfile?.role === 'partner' || 
    userProfile?.role === 'centre' || 
    Boolean(partnerMembership);

  if (!isAuthorizedPartner) {
    return (
      <div className="min-h-screen bg-[#F7F5EE] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E2E5DD] shadow-xl text-center space-y-5 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-[#E6EDE2] text-[#286749] rounded-2xl flex items-center justify-center mx-auto border border-[#A5B89A]/40 shadow-xs">
            <Building2 className="w-8 h-8 text-[#536B50]" />
          </div>
          <div>
            <span className="bg-[#E6EDE2] text-[#286749] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#A5B89A]/40">
              Partner Authentication Required
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#263D32] mt-2">
              Ashram Partner Portal
            </h1>
            <p className="text-xs text-[#59665C] mt-2 leading-relaxed">
              This portal is restricted to accredited Uttarakhand yoga centres and ashram coordinators to manage retreat inquiries, view escrow ledgers, and download settlement statements.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-[#536B50] hover:bg-[#40563E] text-white py-3 px-4 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Partner Account</span>
            </button>

            <button
              onClick={() => {
                loginAsPersona('partner.parmarth@yogaconnect.in');
              }}
              className="w-full bg-white hover:bg-[#F7F5EE] text-[#263D32] py-2.5 px-4 rounded-xl text-xs font-semibold border border-[#E2E5DD] transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Instant Test: Login as Parmarth Niketan</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                  window.location.href = '/';
                } else {
                  setActiveView('home');
                }
              }}
              className="w-full text-xs text-[#8E9B91] hover:text-[#263D32] py-2 transition cursor-pointer"
            >
              Back to Public Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Guard: Suspended Partner Account
  if (isSuspended) {
    return (
      <div className="min-h-screen bg-[#F7F5EE] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-red-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Access Suspended
            </span>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mt-3">
              Partner Account Access Suspended
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              The partner login for <strong>{activeCentre?.name || 'this yoga centre'}</strong> has been deactivated or suspended by the platform administrator pending compliance review.
            </p>
          </div>
          <div className="bg-[#F7F5EE] rounded-2xl p-4 text-xs text-gray-700 text-left space-y-1.5 border border-[#E2E5DD]">
            <p><strong>Security Policy:</strong> In accordance with our security requirements, suspended partner accounts cannot view guest contact records, financial ledgers, or initiate settlement payouts.</p>
            <p><strong>To Restore Access:</strong> Please contact the YogaConnect India Compliance Desk at <a href="mailto:admin@yogaconnect.in" className="text-[#536B50] font-semibold underline">admin@yogaconnect.in</a>.</p>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                window.location.href = '/';
              } else {
                setActiveView('home');
              }
            }}
            className="w-full bg-[#263D32] hover:bg-[#1E3228] text-white font-medium py-3 rounded-xl text-sm transition cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // 3. Guard: Missing Centre
  if (!activeCentre) {
    return (
      <div className="min-h-screen bg-[#F7F5EE] py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-[#E2E5DD] shadow">
          <Building2 className="w-12 h-12 text-[#536B50] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#263D32]">No Assigned Yoga Centre Found</h2>
          <p className="text-xs text-gray-600 mt-2">
            Your login does not appear to be linked to an active yoga centre partner account.
          </p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                window.location.href = '/';
              } else {
                setActiveView('home');
              }
            }}
            className="mt-6 bg-[#536B50] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header Card */}
        <div className="bg-[#263D32] text-white rounded-3xl p-6 sm:p-8 border border-[#344C3F] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center space-x-4 sm:space-x-5 z-10">
            <img 
              src={activeCentre.coverImage} 
              alt={activeCentre.name} 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#DCCDB5] shadow-md shrink-0" 
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#A5B89A]/40">
                  Authorised Partner Portal
                </span>
                <span className="bg-white/10 text-[#DCCDB5] text-[10px] font-bold px-2 py-0.5 rounded border border-white/15">
                  15% Escrow Agreement
                </span>
                {userRole === 'admin' && (
                  <span className="bg-amber-400 text-[#263D32] text-[10px] font-black px-2 py-0.5 rounded">
                    Admin Preview Mode
                  </span>
                )}
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-1.5 leading-tight">
                {activeCentre.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#A5B89A] mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {activeCentre.location}
                </span>
                <span>•</span>
                <span>Contract ID: <strong>{activeCentre.id}</strong></span>
                <span>•</span>
                <span>Partner: <strong>{userProfile?.fullName || 'Verified Ashram Partner'}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 z-10">
            <button
              onClick={() => exportLedgerToCSV(activeCentre, myLedgerEntries)}
              className="bg-white/10 hover:bg-white/20 text-[#F7F5EE] font-medium px-3.5 py-2 rounded-xl text-xs border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
              title="Download full CSV statement"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
            <button
              onClick={() => printCentreStatement(activeCentre, myLedgerEntries, myPayouts, metrics)}
              className="bg-white/10 hover:bg-white/20 text-[#F7F5EE] font-medium px-3.5 py-2 rounded-xl text-xs border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
              title="Print official PDF statement"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
            <button
              onClick={() => setIsAddingCourse(true)}
              className="bg-[#536B50] hover:bg-[#40563E] text-white font-semibold px-4 py-2 rounded-xl text-xs shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Package</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert if query submitted */}
        {queryFeedback && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{queryFeedback}</span>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="border-b border-[#E2E5DD] flex space-x-2 sm:space-x-6 overflow-x-auto text-xs sm:text-sm font-semibold text-[#59665C]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Bookings &amp; Guests</span>
            {myCentresBookings.length > 0 && (
              <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-2 py-0.2 rounded-full">
                {myCentresBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'ledger'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Financial Ledger</span>
            <span className="bg-[#DCCDB5]/30 text-[#263D32] text-[10px] font-bold px-1.5 py-0.2 rounded">
              Immutable
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'payouts'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payouts &amp; Settlements</span>
          </button>

          <button
            onClick={() => setActiveTab('statements')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'statements'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Statements</span>
          </button>

          <button
            onClick={() => setActiveTab('queries')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'queries'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Financial Tickets</span>
            {myQueries.filter(q => q.status === 'open').length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {myQueries.filter(q => q.status === 'open').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Centre Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('matchmaker')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'matchmaker'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Matchmaker</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">

            {/* Reconciliation Note Banner */}
            <div className="bg-[#E6EDE2] border border-[#A5B89A]/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#263D32]">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-[#286749] shrink-0" />
                <span>
                  <strong>Escrow Accounting Policy:</strong> Financial metrics represent actual stored escrow charges and verified settlements in USD. Platform commission rate: <strong>{activeCentre.commissionRatePercent || 15}%</strong>.
                </span>
              </div>
              <div className="text-[11px] text-[#59665C] shrink-0 font-medium">
                Last reconciled: Today • Status: Fully Balanced
              </div>
            </div>

            {/* KPI Summary Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              
              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Total Bookings</span>
                  <BookOpen className="w-4 h-4 text-[#536B50]" />
                </div>
                <div className="text-2xl font-bold text-[#263D32]">{metrics.totalBookings}</div>
                <span className="text-[10px] text-gray-500">All registered inquiries</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Confirmed</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-700">{metrics.confirmedBookings}</div>
                <span className="text-[10px] text-gray-500">Escrow funds secured</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Upcoming</span>
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-700">{metrics.upcomingBookings}</div>
                <span className="text-[10px] text-gray-500">Future retreat arrivals</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Cancelled</span>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-amber-700">{metrics.cancelledBookings}</div>
                <span className="text-[10px] text-gray-500">Refunded via escrow</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs col-span-2">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Gross Booking Value</span>
                  <DollarSign className="w-4 h-4 text-[#536B50]" />
                </div>
                <div className="text-2xl font-bold text-[#263D32]">${metrics.grossBookingValue.toFixed(2)}</div>
                <span className="text-[10px] text-gray-500">Gross traveler payments collected in escrow</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs col-span-2">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Platform Commission (15%)</span>
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-red-600">-${metrics.platformCommission.toFixed(2)}</div>
                <span className="text-[10px] text-gray-500">Contractual platform facilitation fee</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs col-span-2">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Refunds Reversed</span>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-gray-700">-${metrics.refunds.toFixed(2)}</div>
                <span className="text-[10px] text-gray-500">Cancellations refunded to travelers</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs col-span-2">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Net Amount Payable</span>
                  <TrendingUp className="w-4 h-4 text-[#536B50]" />
                </div>
                <div className="text-2xl font-bold text-[#263D32]">${metrics.netAmountPayable.toFixed(2)}</div>
                <span className="text-[10px] text-gray-500">Centre contractual entitlement (Gross - Comm - Refunds)</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs col-span-2">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Settled Payouts</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-700">${metrics.totalPayoutsCompleted.toFixed(2)}</div>
                <span className="text-[10px] text-gray-500">Disbursed via verified bank wire</span>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-2xs col-span-2 sm:col-span-4 lg:col-span-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Outstanding Payable Balance
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Eligible for Next Payout Batch
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-emerald-900">
                  ${metrics.outstandingPayableBalance.toFixed(2)}
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Net entitlement remaining to be disbursed. Payout batches are generated bi-monthly upon retreat arrival confirmation.
                </p>
              </div>

            </div>

            {/* Quick Overview Tables (Recent Bookings + Recent Ledger) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Bookings preview */}
              <div className="bg-white rounded-3xl p-6 border border-[#E2E5DD] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-[#263D32]">Recent Bookings</h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-[#536B50] font-semibold hover:underline flex items-center space-x-1"
                  >
                    <span>View all {myCentresBookings.length}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {myCentresBookings.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">No bookings registered yet for this centre.</p>
                ) : (
                  <div className="space-y-2.5">
                    {myCentresBookings.slice(0, 4).map(b => (
                      <div key={b.id} className="p-3 bg-[#F7F5EE] rounded-xl flex items-center justify-between border border-[#E2E5DD]/70 text-xs">
                        <div>
                          <div className="font-bold text-[#263D32] flex items-center space-x-2">
                            <span>{b.customerName}</span>
                            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded border text-gray-600">{b.referenceCode}</span>
                          </div>
                          <span className="text-[11px] text-gray-500">{b.courseTitle} • Arriving {b.startDate}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#263D32]">${(b.centrePayoutUSD || b.totalUSD * 0.85).toFixed(2)}</div>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            b.status === 'confirmed_paid' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Ledger preview */}
              <div className="bg-white rounded-3xl p-6 border border-[#E2E5DD] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-[#263D32]">Immutable Ledger Entries</h3>
                  <button
                    onClick={() => setActiveTab('ledger')}
                    className="text-xs text-[#536B50] font-semibold hover:underline flex items-center space-x-1"
                  >
                    <span>Full Ledger</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {myLedgerEntries.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center">No ledger entries recorded yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {myLedgerEntries.slice(0, 4).map(e => (
                      <div key={e.id} className="p-3 bg-[#F7F5EE] rounded-xl flex items-center justify-between border border-[#E2E5DD]/70 text-xs">
                        <div className="min-w-0 pr-3">
                          <div className="font-semibold text-[#263D32] truncate">{e.description}</div>
                          <span className="text-[10px] text-gray-500">#{e.entryNumber} • {new Date(e.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className={`font-bold shrink-0 ${e.entryDirection === 'credit' ? 'text-emerald-700' : 'text-red-700'}`}>
                          {e.entryDirection === 'credit' ? '+' : '-'}${e.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Assigned Centre Bookings &amp; Guests
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Private retreat bookings restricted strictly to {activeCentre.name}. Customer contact details provided solely for guest fulfillment.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search ref, guest name..."
                    className="w-full pl-9 pr-3 py-2 bg-[#F7F5EE] rounded-xl text-xs border border-[#E2E5DD] focus:outline-none focus:ring-1 focus:ring-[#536B50]"
                  />
                </div>

                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="bg-[#F7F5EE] text-[#263D32] font-semibold text-xs py-2 px-3 rounded-xl border border-[#E2E5DD] outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed_paid">Confirmed (Paid)</option>
                  <option value="assigned_to_centre">Assigned to Centre</option>
                  <option value="pending_admin">Pending Escrow</option>
                  <option value="cancelled">Cancelled (Refunded)</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-3 px-3 font-bold">Booking Ref</th>
                    <th className="py-3 px-3 font-bold">Guest Name</th>
                    <th className="py-3 px-3 font-bold">Retreat Package</th>
                    <th className="py-3 px-3 font-bold">Dates &amp; Duration</th>
                    <th className="py-3 px-3 font-bold">Guests</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold text-right">Gross Total</th>
                    <th className="py-3 px-3 font-bold text-right">Net Entitlement</th>
                    <th className="py-3 px-3 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-500">
                        No bookings match your current search and filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#F7F5EE]/50 transition">
                        <td className="py-3.5 px-3 font-mono font-bold text-[#263D32]">
                          {b.referenceCode}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-gray-900">{b.customerName}</div>
                          <span className="text-[10px] text-gray-500">{b.customerCountry}</span>
                        </td>
                        <td className="py-3.5 px-3 max-w-[200px] truncate" title={b.courseTitle}>
                          <span className="font-medium text-[#263D32]">{b.courseTitle}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div>{b.startDate}</div>
                          <span className="text-[10px] text-gray-500">{b.durationDays} Days</span>
                        </td>
                        <td className="py-3.5 px-3">{b.participantsCount}</td>
                        <td className="py-3.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'confirmed_paid' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            b.status === 'assigned_to_centre' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-gray-600">
                          ${b.totalUSD.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-[#263D32]">
                          ${(b.centrePayoutUSD || (b.totalUSD * 0.85)).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => setSelectedBookingDetail(b)}
                            className="bg-[#E6EDE2] hover:bg-[#536B50] hover:text-white text-[#263D32] px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIAL LEDGER */}
        {activeTab === 'ledger' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                    Immutable Financial Ledger
                  </h2>
                  <span className="bg-[#DCCDB5]/30 text-[#263D32] text-xs font-bold px-2 py-0.5 rounded">
                    Double-Entry Audited
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Every booking credit, platform commission debit, refund reversal, and payout settlement is permanently recorded in this tamper-proof append-only ledger.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="text"
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  placeholder="Search description / ref..."
                  className="pl-3 pr-3 py-1.5 bg-[#F7F5EE] rounded-xl text-xs border border-[#E2E5DD] focus:outline-none"
                />
                <select
                  value={ledgerTypeFilter}
                  onChange={(e) => setLedgerTypeFilter(e.target.value)}
                  className="bg-[#F7F5EE] text-[#263D32] font-semibold text-xs py-1.5 px-3 rounded-xl border border-[#E2E5DD] outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="booking_charge">Booking Escrow Charges</option>
                  <option value="platform_commission">Platform Commission</option>
                  <option value="refund">Refunds</option>
                  <option value="payout">Settlement Payouts</option>
                  <option value="adjustment">Adjustments</option>
                </select>
                <button
                  onClick={() => exportLedgerToCSV(activeCentre, filteredLedgerEntries)}
                  className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-3 px-3 font-bold">Entry #</th>
                    <th className="py-3 px-3 font-bold">Date &amp; Time</th>
                    <th className="py-3 px-3 font-bold">Entry Type</th>
                    <th className="py-3 px-3 font-bold">Reference</th>
                    <th className="py-3 px-3 font-bold">Description</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold text-right">Debit / Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {filteredLedgerEntries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No ledger entries match your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLedgerEntries.map((e) => (
                      <tr key={e.id} className="hover:bg-[#F7F5EE]/50 transition">
                        <td className="py-3 px-3 font-mono font-bold text-gray-700">
                          #{e.entryNumber}
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {new Date(e.createdAt).toLocaleDateString()} {new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-gray-900 capitalize">
                            {e.entryType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-gray-600">
                          {e.referenceCode || '-'}
                        </td>
                        <td className="py-3 px-3 text-gray-700 max-w-sm truncate" title={e.description}>
                          {e.description}
                        </td>
                        <td className="py-3 px-3">
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                            {e.status}
                          </span>
                        </td>
                        <td className={`py-3 px-3 text-right font-bold font-mono ${
                          e.entryDirection === 'credit' ? 'text-emerald-700' : 'text-red-700'
                        }`}>
                          {e.entryDirection === 'credit' ? '+' : '-'}${e.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-[#F7F5EE] p-4 rounded-2xl border border-[#E2E5DD] flex items-center justify-between text-xs font-semibold text-[#263D32]">
              <span>Immutable Ledger Balance (Entitlement - Disbursed):</span>
              <span className="text-base font-bold font-mono text-[#263D32]">
                ${metrics.outstandingPayableBalance.toFixed(2)} USD
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: PAYOUTS & SETTLEMENTS */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Bank Payouts &amp; Settlements
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Verified bank disbursements released from platform escrow into {activeCentre.name}'s designated bank account.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Total Completed Payouts</span>
                <span className="text-xl font-bold text-emerald-700">${metrics.totalPayoutsCompleted.toFixed(2)}</span>
              </div>
            </div>

            {/* Payouts Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-3 px-3 font-bold">Payout Ref</th>
                    <th className="py-3 px-3 font-bold">Accounting Period</th>
                    <th className="py-3 px-3 font-bold">Method</th>
                    <th className="py-3 px-3 font-bold">Settlement Reference</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold text-right">Net Amount</th>
                    <th className="py-3 px-3 font-bold text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {myPayouts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No payout disbursements recorded yet.
                      </td>
                    </tr>
                  ) : (
                    myPayouts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F7F5EE]/50 transition">
                        <td className="py-3 px-3 font-mono font-bold text-[#263D32]">
                          {p.referenceCode}
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {p.periodStart} to {p.periodEnd}
                        </td>
                        <td className="py-3 px-3 font-medium text-gray-800">
                          {p.payoutMethod}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-gray-700">
                          {p.settlementReference || <span className="text-gray-400 italic">Pending settlement</span>}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                            p.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#263D32] font-mono">
                          ${p.netPayoutAmount.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => printCentreStatement(activeCentre, myLedgerEntries, myPayouts, metrics)}
                            className="bg-[#E6EDE2] hover:bg-[#536B50] hover:text-white text-[#263D32] px-2.5 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer"
                          >
                            Statement
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: STATEMENTS & EXPORT */}
        {activeTab === 'statements' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                Official Accounting Statements &amp; Exports
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Download verified financial statements in CSV or printable PDF format for internal bookkeeping and tax filing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CSV Statement Card */}
              <div className="bg-[#F7F5EE] p-6 rounded-2xl border border-[#E2E5DD] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#536B50] border border-[#E2E5DD]">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#263D32]">Full Ledger CSV Statement</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Contains all immutable ledger entries, debit/credit breakdown, transaction references, and opening/closing balances compatible with Excel and accounting software.
                  </p>
                </div>
                <button
                  onClick={() => exportLedgerToCSV(activeCentre, myLedgerEntries)}
                  className="w-full bg-[#263D32] hover:bg-[#1E3228] text-white py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .CSV Spreadsheet</span>
                </button>
              </div>

              {/* Printable PDF Statement Card */}
              <div className="bg-[#F7F5EE] p-6 rounded-2xl border border-[#E2E5DD] space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#536B50] border border-[#E2E5DD]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#263D32]">Official Printable PDF Statement</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Formatted formal statement with YogaConnect India official header, escrow reconciliation metrics, contractual terms, and signed ledger log.
                  </p>
                </div>
                <button
                  onClick={() => printCentreStatement(activeCentre, myLedgerEntries, myPayouts, metrics)}
                  className="w-full bg-[#536B50] hover:bg-[#40563E] text-white py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Generate &amp; Print PDF</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: FINANCIAL QUERIES (TICKETS) */}
        {activeTab === 'queries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Accounting Queries &amp; Support Tickets
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Direct communication with the YogaConnect India finance team regarding commission terms, transit adjustments, or settlement dates.
                </p>
              </div>
              <button
                onClick={() => setIsRaisingQuery(true)}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Raise New Inquiry</span>
              </button>
            </div>

            {/* Queries List */}
            <div className="space-y-4">
              {myQueries.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No financial queries raised yet. Click "Raise New Inquiry" if you need clarification on any ledger entry.
                </div>
              ) : (
                myQueries.map((q) => (
                  <div key={q.id} className="p-5 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#263D32]">{q.subject}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                        q.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {q.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 bg-white p-3 rounded-xl border border-[#E2E5DD]/60">
                      {q.message}
                    </p>
                    {q.adminResponse ? (
                      <div className="bg-[#E6EDE2] p-3 rounded-xl border border-[#A5B89A]/40 space-y-1">
                        <span className="font-bold text-[#263D32] block">Platform Administrator Response:</span>
                        <p className="text-gray-800">{q.adminResponse}</p>
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-500 italic">
                        In review by the finance administration team. Typical response time: &lt; 24 business hours.
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 7: CENTRE PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                Centre Business Profile &amp; Contact Information
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Update public ashram contact details and descriptions. Financial contract terms and bank payout destinations require administrator verification.
              </p>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Centre profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-[#263D32] mb-1">Centre Name (Verified)</label>
                <input
                  type="text"
                  value={activeCentre.name}
                  disabled
                  className="w-full p-2.5 bg-gray-100 text-gray-500 rounded-xl text-xs border border-gray-200 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263D32] mb-1">Location &amp; Address</label>
                <input
                  type="text"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] text-[#263D32] rounded-xl text-xs border border-[#E2E5DD] focus:outline-none focus:ring-1 focus:ring-[#536B50]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263D32] mb-1">Tagline</label>
                <input
                  type="text"
                  value={profileTagline}
                  onChange={(e) => setProfileTagline(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] text-[#263D32] rounded-xl text-xs border border-[#E2E5DD] focus:outline-none focus:ring-1 focus:ring-[#536B50]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263D32] mb-1">Ashram Description</label>
                <textarea
                  rows={4}
                  value={profileDescription}
                  onChange={(e) => setProfileDescription(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] text-[#263D32] rounded-xl text-xs border border-[#E2E5DD] focus:outline-none focus:ring-1 focus:ring-[#536B50]"
                />
              </div>

              {/* Locked Financial Fields Notice */}
              <div className="p-4 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD] space-y-2">
                <span className="text-xs font-bold text-[#263D32] flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#536B50]" />
                  <span>Protected Financial Settings</span>
                </span>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
                  <div>Contractual Commission: <strong>{activeCentre.commissionRatePercent || 15}%</strong></div>
                  <div>Settlement Currency: <strong>USD ($)</strong></div>
                  <div>Escrow Protection: <strong>Active (100% Guaranteed)</strong></div>
                  <div>Account Verification: <strong>Verified Partner</strong></div>
                </div>
                <p className="text-[11px] text-gray-500 pt-1">
                  To request updates to your commission terms or bank wire details, please raise a ticket under the Financial Tickets tab.
                </p>
              </div>

              <button
                type="submit"
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* TAB 8: AI MATCHMAKER BUILDER (Existing working functionality preserved) */}
        {activeTab === 'matchmaker' && (
          <div className="animate-fade-in">
            <CentreMatchmakerBuilder centre={activeCentre} />
          </div>
        )}

      </div>

      {/* MODAL 1: Booking Detail Modal */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#E2E5DD] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#536B50]">
                  Booking Reference
                </span>
                <h3 className="font-mono font-bold text-lg text-[#263D32]">
                  {selectedBookingDetail.referenceCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                <div className="font-bold text-[#263D32] text-sm">{selectedBookingDetail.courseTitle}</div>
                <div className="text-gray-600 mt-0.5">Start Date: <strong>{selectedBookingDetail.startDate}</strong> ({selectedBookingDetail.durationDays} Days)</div>
                <div className="text-gray-600">Guests: <strong>{selectedBookingDetail.participantsCount}</strong> • Room: <strong>{selectedBookingDetail.roomType}</strong></div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-[#263D32] block">Guest Contact (For Fulfillment Only):</span>
                <div>Name: <strong>{selectedBookingDetail.customerName}</strong></div>
                <div>Country: <strong>{selectedBookingDetail.customerCountry}</strong></div>
                <div>Email: <strong>{selectedBookingDetail.customerEmail}</strong></div>
                <div>Phone: <strong>{selectedBookingDetail.customerPhone || 'Not provided'}</strong></div>
                {selectedBookingDetail.specialRequests && (
                  <div>Special Requests: <em>"{selectedBookingDetail.specialRequests}"</em></div>
                )}
              </div>

              <div className="border-t border-[#E2E5DD] pt-3 flex items-center justify-between font-semibold">
                <span>Centre Net Entitlement:</span>
                <span className="font-mono text-base font-bold text-emerald-700">
                  ${(selectedBookingDetail.centrePayoutUSD || selectedBookingDetail.totalUSD * 0.85).toFixed(2)} USD
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBookingDetail(null)}
              className="w-full bg-[#263D32] text-white py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Raise Financial Query Modal */}
      {isRaisingQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E5DD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
              <h3 className="font-serif font-bold text-base text-[#263D32]">
                Raise Financial Inquiry to Administrator
              </h3>
              <button onClick={() => setIsRaisingQuery(false)} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleRaiseQuery} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#263D32] mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commission query on booking YC-2026-8192"
                  value={querySubject}
                  onChange={(e) => setQuerySubject(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Message Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry, affected entry numbers, or settlement questions..."
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRaisingQuery(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#536B50] hover:bg-[#40563E] text-white rounded-xl font-bold flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Course Modal */}
      {isAddingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E5DD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
              <h3 className="font-serif font-bold text-base text-[#263D32]">Add New Course / Retreat</h3>
              <button onClick={() => setIsAddingCourse(false)} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#263D32] mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 200h Ashtanga & Vinyasa TTC"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] focus:outline-none"
                >
                  <option value="200h-ttc">200-Hour Teacher Training (TTC)</option>
                  <option value="300h-ttc">300-Hour Advanced TTC</option>
                  <option value="meditation">Meditation &amp; Pranayama Immersion</option>
                  <option value="ayurveda">Ayurveda &amp; Panchakarma Retreat</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#263D32] mb-1">Price (USD)</label>
                  <input
                    type="number"
                    value={newPriceUSD}
                    onChange={(e) => setNewPriceUSD(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#263D32] mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCourse(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#536B50] text-white rounded-xl font-bold"
                >
                  Publish Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
