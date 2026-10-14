import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus, CentreMembership, PayoutRecord, FinancialLedgerEntry } from '../../types';
import {
  Crown,
  ShieldCheck,
  DollarSign,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  TrendingUp,
  FileText,
  Gift,
  Sparkles,
  Search,
  Bell,
  Sliders,
  PlusCircle,
  BookOpen,
  Plus,
  Calendar,
  Clock,
  MapPin,
  ShieldAlert,
  ArrowLeft,
  Award,
  Download,
  Printer,
  UserCheck,
  UserX,
  FileSpreadsheet,
  AlertTriangle,
  Send,
  MessageSquare,
  Key,
  RefreshCw,
  CreditCard,
  History,
  Check,
  Ban,
  ArrowRight
} from 'lucide-react';

import { PREDEFINED_QUESTION_TEMPLATES } from '../../data/mockMatchmakers';
import { AsanaManagerTab } from '../admin/AsanaManagerTab';
import { CentreMatchmakerBuilder } from './CentreMatchmakerBuilder';
import { exportLedgerToCSV, printCentreStatement } from '../../utils/statementExport';

interface AdminDashboardProps {
  initialTab?: 
    | 'overview'
    | 'centres'
    | 'travellers'
    | 'bookings'
    | 'financial-oversight'
    | 'payouts'
    | 'reports'
    | 'commissions'
    | 'partners'
    | 'invitations'
    | 'queries'
    | 'audit-logs'
    | 'matchmakers'
    | 'asanas'
    | 'coupons';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'overview' }) => {
  const {
    bookings,
    updateBookingStatus,
    centres,
    courses,
    addNewCourse,
    formatPrice,
    setIsSchemaModalOpen,
    setIsAddCentreOpen,
    matchmakerConfigs,
    setAdminMatchmakerDisabled,
    matchmakerAnalytics,
    matchmakerLeads,
    openCentreMatchmaker,
    setActiveView,
    userRole,
    userProfile,
    memberships,
    assignPartnerToCentre,
    updateMembershipStatus,
    removePartnerMembership,
    ledgerEntries,
    addLedgerAdjustment,
    getCentreLedgerEntries,
    getCentreFinancialMetrics,
    payouts,
    getCentrePayouts,
    createPayoutBatch,
    processPayoutSettlement,
    financialQueries,
    respondToFinancialQuery,
    auditLogs,
    loginAsPersona,
    setIsAuthModalOpen,
    vendorInvitations,
    createVendorInvitation,
    revokeVendorInvitation,
    commissionRules,
    addCommissionRule,
    updateCommissionRule,
    adminDashboardTab,
    setAdminDashboardTab,
    profiles,
    updateUserAccountStatus,
    instructors,
    teachingEnquiries,
    updateInstructorStatus
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'centres'
    | 'instructors'
    | 'travellers'
    | 'bookings'
    | 'financial-oversight'
    | 'payouts'
    | 'reports'
    | 'commissions'
    | 'partners'
    | 'invitations'
    | 'queries'
    | 'audit-logs'
    | 'matchmakers'
    | 'asanas'
    | 'coupons'
  >(initialTab);

  // Sync tab with context if navigated via Profile Menu
  React.useEffect(() => {
    if (adminDashboardTab) {
      setActiveTab(adminDashboardTab as any);
    }
  }, [adminDashboardTab]);

  // Travellers Tab Filter & Search State
  const [travellerSearch, setTravellerSearch] = useState('');
  const [travellerStatusFilter, setTravellerStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Reports Tab Filters
  const [reportCentreFilter, setReportCentreFilter] = useState<string>('all');
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('all');
  const [reportDateRange, setReportDateRange] = useState<string>('all');

  // Centre Drilldown Inspection Modal
  const [inspectingCentre, setInspectingCentre] = useState<any | null>(null);

  // Vendor Invitation Modal & Form State
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteCentreId, setInviteCentreId] = useState(centres[0]?.id || 'centre-1');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'manager' | 'accountant'>('owner');
  const [inviteFeedback, setInviteFeedback] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null);
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  // Commission Rule Form State
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [ruleScope, setRuleScope] = useState<'global' | 'centre'>('global');
  const [ruleCentreId, setRuleCentreId] = useState(centres[0]?.id || 'centre-1');
  const [ruleCategory, setRuleCategory] = useState('all');
  const [rulePercent, setRulePercent] = useState(10);
  const [ruleFixedFee, setRuleFixedFee] = useState(0);


  const [unmaskedBookingIds, setUnmaskedBookingIds] = useState<string[]>([]);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingCentreFilter, setBookingCentreFilter] = useState('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  // Partner Provisioning Modal State
  const [isProvisioningPartner, setIsProvisioningPartner] = useState(false);
  const [provCentreId, setProvCentreId] = useState(centres[0]?.id || 'centre-1');
  const [provEmail, setProvEmail] = useState('');
  const [provName, setProvName] = useState('');
  const [provRole, setProvRole] = useState<'owner' | 'manager' | 'accountant'>('owner');
  const [provFeedback, setProvFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Financial Adjustment Modal State
  const [isCreatingAdjustment, setIsCreatingAdjustment] = useState(false);
  const [adjCentreId, setAdjCentreId] = useState(centres[0]?.id || 'centre-1');
  const [adjAmount, setAdjAmount] = useState(100);
  const [adjDirection, setAdjDirection] = useState<'credit' | 'debit'>('credit');
  const [adjDescription, setAdjDescription] = useState('');
  const [adjRefCode, setAdjRefCode] = useState('');

  // Payout Settlement Modal State
  const [settlementModalPayout, setSettlementModalPayout] = useState<PayoutRecord | null>(null);
  const [settlementRefInput, setSettlementRefInput] = useState('');
  const [settlementError, setSettlementError] = useState('');

  // Create Payout Batch Modal State
  const [isCreatingPayoutBatch, setIsCreatingPayoutBatch] = useState(false);
  const [payoutCentreId, setPayoutCentreId] = useState(centres[0]?.id || 'centre-1');
  const [payoutAmount, setPayoutAmount] = useState(1000);
  const [payoutNotes, setPayoutNotes] = useState('');

  // Query Response State
  const [selectedQueryToAnswer, setSelectedQueryToAnswer] = useState<string | null>(null);
  const [queryResponseInput, setQueryResponseInput] = useState('');

  // Audit Logs Filter
  const [auditActionFilter, setAuditActionFilter] = useState('all');

  // Coupon State
  const [couponCode, setCouponCode] = useState('YOGA2026');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [couponList, setCouponList] = useState([
    { code: 'YOGA2026', discount: 10, usage: 48 },
    { code: 'NAMASTE15', discount: 15, usage: 19 }
  ]);

  // Security Check: Enforce Platform Administrator Access
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F7F5EE] py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center space-y-5 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Unauthorized
            </span>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mt-2">
              Platform Administrator Access Required
            </h2>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              You do not possess the required administrator privileges to view platform-wide bookings, manage partner credentials, or access audit logs.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                loginAsPersona('admin@yogaconnect.in');
              }}
              className="w-full bg-[#263D32] hover:bg-[#1E3228] text-white py-3 px-4 rounded-xl text-xs font-bold transition shadow flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-gold-400" />
              <span>Instant Test: Login as Platform Admin</span>
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-white hover:bg-[#F7F5EE] text-[#263D32] py-2.5 px-4 rounded-xl text-xs font-semibold border border-[#E2E5DD] transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-[#536B50]" />
              <span>Sign In with Passwordless OTP / Google</span>
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
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Bookings for Platform Oversight
  const filteredBookings = bookings.filter(b => {
    const matchesCentre = bookingCentreFilter === 'all' || b.centreId === bookingCentreFilter;
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    const matchesSearch = !bookingSearch ||
      b.referenceCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.centreName.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesCentre && matchesStatus && matchesSearch;
  });

  const toggleMask = (id: string) => {
    setUnmaskedBookingIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Platform-wide Metrics Calculation
  const platformTotals = useMemo(() => {
    const grossEscrow = ledgerEntries
      .filter(e => e.entryType === 'booking_charge' && e.entryDirection === 'credit')
      .reduce((sum, e) => sum + e.amount, 0);

    const commissions = ledgerEntries
      .filter(e => e.entryType === 'platform_commission' && e.entryDirection === 'debit')
      .reduce((sum, e) => sum + e.amount, 0);

    const refunds = ledgerEntries
      .filter(e => e.entryType === 'refund' && e.entryDirection === 'debit')
      .reduce((sum, e) => sum + e.amount, 0);

    const settledPayouts = payouts
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.netPayoutAmount, 0);

    const netPayable = Math.max(0, grossEscrow - commissions - refunds);
    const outstanding = Math.max(0, netPayable - settledPayouts);

    return {
      grossEscrow,
      commissions,
      refunds,
      settledPayouts,
      netPayable,
      outstanding
    };
  }, [ledgerEntries, payouts]);

  // Handle Provision Partner Account
  const handleProvisionPartner = (e: React.FormEvent) => {
    e.preventDefault();
    setProvFeedback(null);
    const res = assignPartnerToCentre(provEmail, provName, provCentreId, provRole);
    if (res.success) {
      setProvFeedback({ type: 'success', message: `Partner account for ${provEmail} created and mapped to ${res.membership?.centreName}. Secure credentials setup sent.` });
      setProvEmail('');
      setProvName('');
      setTimeout(() => setIsProvisioningPartner(false), 2500);
    } else {
      setProvFeedback({ type: 'error', message: res.error || 'Failed to create partner membership.' });
    }
  };

  // Handle Adjustment Submit
  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjDescription) return;
    addLedgerAdjustment(adjCentreId, adjAmount, adjDirection, adjDescription, adjRefCode);
    setIsCreatingAdjustment(false);
    setAdjDescription('');
    setAdjRefCode('');
  };

  // Handle Payout Settlement Execution
  const handleExecuteSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    setSettlementError('');
    if (!settlementModalPayout) return;
    const res = processPayoutSettlement(settlementModalPayout.id, settlementRefInput);
    if (!res.success) {
      setSettlementError(res.error || 'Failed to process settlement.');
      return;
    }
    setSettlementModalPayout(null);
    setSettlementRefInput('');
  };

  // Handle Create Payout Batch
  const handleCreatePayoutBatch = (e: React.FormEvent) => {
    e.preventDefault();
    createPayoutBatch(payoutCentreId, payoutAmount, payoutNotes);
    setIsCreatingPayoutBatch(false);
    setPayoutNotes('');
  };

  // Handle Query Answer
  const handleAnswerQuery = (queryId: string) => {
    if (!queryResponseInput.trim()) return;
    respondToFinancialQuery(queryId, queryResponseInput);
    setSelectedQueryToAnswer(null);
    setQueryResponseInput('');
  };

  return (
    <div className="py-8 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Master Admin Header */}
        <div className="bg-[#1E3228] text-white rounded-3xl p-6 sm:p-8 border border-[#344C3F] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center space-x-4 sm:space-x-5 z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-gold-400 flex items-center justify-center shrink-0">
              <Crown className="w-9 h-9 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-gold-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Master Platform Administrator
                </span>
                <span className="bg-white/10 text-[#DCCDB5] text-[10px] font-bold px-2 py-0.5 rounded">
                  Escrow Authority
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-1.5">
                YogaConnect India Master Control
              </h1>
              <span className="text-xs text-[#A5B89A]">
                Platform-wide oversight • Partner account provisioning • Double-entry ledger audit
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 z-10">
            <button
              onClick={() => setIsProvisioningPartner(true)}
              className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 cursor-pointer shadow"
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>Provision Centre Partner</span>
            </button>
            <button
              onClick={() => setIsAddCentreOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-[#F7F5EE] font-medium px-3.5 py-2.5 rounded-xl text-xs border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Centre</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs - Matching Prompt Section 1 & 2 */}
        <div className="border-b border-[#E2E5DD] flex space-x-2 sm:space-x-5 overflow-x-auto text-xs sm:text-sm font-semibold text-[#59665C]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <Crown className="w-4 h-4 text-gold-500" />
            <span>Admin Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('centres')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'centres'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Yoga Centres</span>
            <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {centres.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('instructors')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'instructors'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Manage Instructors</span>
            <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {instructors.length}
            </span>
            {instructors.filter(i => i.status === 'pending').length > 0 && (
              <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                {instructors.filter(i => i.status === 'pending').length} pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('travellers')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'travellers'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Travellers</span>
            <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {profiles.filter(p => p.role === 'user').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage Bookings</span>
            <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('financial-oversight')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'financial-oversight'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Financial Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'payouts'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payments &amp; Transactions</span>
            {payouts.filter(p => p.status === 'pending').length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {payouts.filter(p => p.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'reports'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Reports &amp; Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('commissions')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'commissions'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Platform Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'partners'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Partner Credentials</span>
            <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {memberships.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('invitations')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'invitations'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Invitations</span>
          </button>

          <button
            onClick={() => setActiveTab('queries')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'queries'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries</span>
          </button>

          <button
            onClick={() => setActiveTab('audit-logs')}
            className={`py-3 transition border-b-2 font-medium flex items-center space-x-1.5 shrink-0 cursor-pointer ${
              activeTab === 'audit-logs'
                ? 'border-[#536B50] text-[#536B50] font-bold'
                : 'border-transparent text-[#59665C] hover:text-[#263D32]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* TAB 0: ADMIN DASHBOARD OVERVIEW & SUMMARY CARDS (Prompt Section 2) */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* 10 Required Summary KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Registered Centres</span>
                <span className="font-serif font-bold text-2xl text-[#263D32] mt-1 block">{centres.length}</span>
                <span className="text-[10px] text-emerald-700 font-medium">100% verified ashrams</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Registered Travellers</span>
                <span className="font-serif font-bold text-2xl text-[#263D32] mt-1 block">
                  {profiles.filter(p => p.role === 'user').length}
                </span>
                <span className="text-[10px] text-blue-700 font-medium">Verified customer accounts</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Total Bookings</span>
                <span className="font-serif font-bold text-2xl text-[#263D32] mt-1 block">{bookings.length}</span>
                <span className="text-[10px] text-gray-500 font-medium">Platform-wide volume</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-2xs">
                <span className="text-[10px] font-bold text-amber-800 uppercase block tracking-wider">Pending Bookings</span>
                <span className="font-serif font-bold text-2xl text-amber-700 mt-1 block">
                  {bookings.filter(b => b.status === 'pending_admin' || b.status === 'assigned_to_centre').length}
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Awaiting seat assignment</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block tracking-wider">Confirmed Bookings</span>
                <span className="font-serif font-bold text-2xl text-emerald-700 mt-1 block">
                  {bookings.filter(b => b.status === 'confirmed_paid').length}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Escrow verified &amp; confirmed</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-red-200 bg-red-50/30 shadow-2xs">
                <span className="text-[10px] font-bold text-red-800 uppercase block tracking-wider">Cancelled Bookings</span>
                <span className="font-serif font-bold text-2xl text-red-700 mt-1 block">
                  {bookings.filter(b => b.status === 'cancelled').length}
                </span>
                <span className="text-[10px] text-red-600 font-medium">Reversals recorded</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Verified Payments</span>
                <span className="font-serif font-bold text-2xl text-[#263D32] mt-1 block">
                  {formatPrice(platformTotals.settledPayouts + platformTotals.outstanding)}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Received customer funds</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Pending Payouts</span>
                <span className="font-serif font-bold text-2xl text-amber-600 mt-1 block">
                  {formatPrice(payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netPayoutAmount, 0))}
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Queued for NEFT / wire</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Platform Commission</span>
                <span className="font-serif font-bold text-2xl text-gold-600 mt-1 block">
                  {formatPrice(platformTotals.commissions)}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Earned platform revenue</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-wider">Outstanding Payable</span>
                <span className="font-serif font-bold text-2xl text-[#263D32] mt-1 block">
                  {formatPrice(platformTotals.outstanding)}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Escrow safe balance</span>
              </div>
            </div>

            {/* Centre-wise Performance Table (Prompt Section 2) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#263D32]">Centre-Wise Performance &amp; Escrow Entitlement</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Real database records distinguishing gross booking value, received payments, refunds, and net payable balances.</p>
                </div>
                <button
                  onClick={() => setActiveTab('centres')}
                  className="text-xs font-semibold text-[#536B50] hover:underline flex items-center space-x-1"
                >
                  <span>Manage All Centres ({centres.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                      <th className="py-3 px-3 font-bold">Yoga Centre</th>
                      <th className="py-3 px-3 font-bold text-center">Offerings</th>
                      <th className="py-3 px-3 font-bold text-center">Bookings</th>
                      <th className="py-3 px-3 font-bold text-right">Gross Value</th>
                      <th className="py-3 px-3 font-bold text-right">Verified Payments</th>
                      <th className="py-3 px-3 font-bold text-right">Refunds</th>
                      <th className="py-3 px-3 font-bold text-right">Platform Fee</th>
                      <th className="py-3 px-3 font-bold text-right">Outstanding Payable</th>
                      <th className="py-3 px-3 font-bold text-center">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5DD]">
                    {centres.map((c) => {
                      const cBookings = bookings.filter(b => b.centreId === c.id);
                      const cCourses = courses.filter(co => co.centreId === c.id);
                      const grossVal = cBookings.reduce((sum, b) => sum + (b.totalUSD || 0), 0);
                      const verifiedPaid = cBookings.filter(b => b.status === 'confirmed_paid').reduce((sum, b) => sum + (b.totalUSD || 0), 0);
                      const cRefunds = ledgerEntries.filter(e => e.centreId === c.id && e.entryType === 'refund').reduce((sum, e) => sum + e.amount, 0);
                      const cComm = ledgerEntries.filter(e => e.centreId === c.id && e.entryType === 'platform_commission').reduce((sum, e) => sum + e.amount, 0);
                      const cSettled = payouts.filter(p => p.centreId === c.id && p.status === 'paid').reduce((sum, p) => sum + p.netPayoutAmount, 0);
                      const outstandingBal = Math.max(0, verifiedPaid - cComm - cRefunds - cSettled);

                      return (
                        <tr key={c.id} className="hover:bg-[#F7F5EE]/50 transition">
                          <td className="py-3 px-3">
                            <div className="font-serif font-bold text-sm text-[#263D32]">{c.name}</div>
                            <span className="text-[10px] text-gray-500">{c.city} • ID: {c.id}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-medium">{cCourses.length}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-[#263D32]">{cBookings.length}</span>
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-gray-600">{formatPrice(grossVal)}</td>
                          <td className="py-3 px-3 text-right font-bold text-emerald-700">{formatPrice(verifiedPaid)}</td>
                          <td className="py-3 px-3 text-right font-medium text-red-600">{cRefunds > 0 ? formatPrice(cRefunds) : '—'}</td>
                          <td className="py-3 px-3 text-right font-medium text-amber-700">{formatPrice(cComm)}</td>
                          <td className="py-3 px-3 text-right font-bold text-[#263D32]">{formatPrice(outstandingBal)}</td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => setInspectingCentre(c)}
                              className="px-2.5 py-1 bg-[#E6EDE2] hover:bg-[#D7E3D1] text-[#263D32] font-semibold rounded-lg text-[11px] transition cursor-pointer"
                              title="Inspect Centre Bookings, Offerings and Finances"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MANAGE INDIVIDUAL YOGA INSTRUCTORS (Prompt Section 7) */}
        {activeTab === 'instructors' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-[#E6EDE2] text-[#286749] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Partner Category B
                  </span>
                  <span className="text-xs text-gray-500">• {instructors.length} Certified Instructors</span>
                </div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32] mt-1">
                  Individual Yoga Instructors &amp; Accreditation Review
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Review registrations, approve public directory listings, inspect teaching qualifications, and manage account statuses.
                </p>
              </div>

              {/* Status KPI summary */}
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl">
                  Approved: {instructors.filter(i => i.status === 'approved').length}
                </span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-xl">
                  Pending Review: {instructors.filter(i => i.status === 'pending').length}
                </span>
              </div>
            </div>

            {/* Instructors Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-3 px-3 font-bold">Instructor</th>
                    <th className="py-3 px-3 font-bold">Location &amp; Experience</th>
                    <th className="py-3 px-3 font-bold">Yoga Styles</th>
                    <th className="py-3 px-3 font-bold">Pricing Range</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold text-center">Accreditation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {instructors.map((inst) => (
                    <tr key={inst.id} className="hover:bg-[#F7F5EE]/50 transition">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={inst.profilePhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'} 
                            alt={inst.fullName} 
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#E2E5DD]" 
                          />
                          <div>
                            <span className="font-bold text-gray-900 block">{inst.fullName}</span>
                            <span className="font-mono text-[10px] text-gray-500">{inst.email}</span>
                            <span className="text-[10px] text-emerald-700 block">{inst.qualifications || 'Certified Instructor'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-medium text-gray-900 block">{inst.city || 'Rishikesh'}, {inst.state || 'Uttarakhand'}</span>
                        <span className="text-[10px] text-gray-500">{inst.experienceYears} Years Experience</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {inst.yogaStyles.slice(0, 3).map(style => (
                            <span key={style} className="bg-[#E6EDE2] text-[#263D32] text-[9px] font-semibold px-2 py-0.5 rounded-full">
                              {style}
                            </span>
                          ))}
                          {inst.yogaStyles.length > 3 && (
                            <span className="text-[9px] text-gray-500 font-medium">+{inst.yogaStyles.length - 3}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-[#263D32]">
                        {inst.pricingRange || '$45 - $90 / session'}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          inst.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          inst.status === 'pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          inst.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {inst.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {inst.status !== 'approved' ? (
                            <button
                              onClick={() => updateInstructorStatus(inst.id, 'approved')}
                              className="bg-[#286749] hover:bg-[#1E4D37] text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg transition cursor-pointer shadow-2xs"
                              title="Approve public listing in directory"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => updateInstructorStatus(inst.id, 'suspended')}
                              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-semibold py-1.5 px-3 rounded-lg transition cursor-pointer"
                              title="Suspend account"
                            >
                              Suspend
                            </button>
                          )}
                          <button
                            onClick={() => alert(`Biography:\n${inst.bio || 'None'}\n\nQualifications: ${inst.qualifications || 'None'}\nPhone: ${inst.phone || 'None'}`)}
                            className="bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] text-[11px] font-semibold py-1.5 px-2.5 rounded-lg transition cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: MANAGE TRAVELLERS (Prompt Section 2) */}
        {activeTab === 'travellers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Registered Traveller Accounts &amp; Access Permissions
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Platform-wide directory of customer accounts, booking history, preferences, and account status controls.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search by traveller name or email..."
                  value={travellerSearch}
                  onChange={(e) => setTravellerSearch(e.target.value)}
                  className="p-2 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs w-60 focus:outline-none"
                />
                <select
                  value={travellerStatusFilter}
                  onChange={(e) => setTravellerStatusFilter(e.target.value as any)}
                  className="p-2 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs focus:outline-none font-semibold text-[#263D32]"
                >
                  <option value="all">All Accounts</option>
                  <option value="active">Active Accounts</option>
                  <option value="suspended">Suspended Accounts</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-3 px-3 font-bold">Traveller Account</th>
                    <th className="py-3 px-3 font-bold">Contact &amp; Country</th>
                    <th className="py-3 px-3 font-bold">Preferences</th>
                    <th className="py-3 px-3 font-bold text-center">Bookings</th>
                    <th className="py-3 px-3 font-bold">Account Status</th>
                    <th className="py-3 px-3 font-bold text-center">Access Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {profiles
                    .filter(p => p.role === 'user')
                    .filter(p => {
                      if (travellerStatusFilter !== 'all' && p.status !== travellerStatusFilter) return false;
                      if (!travellerSearch) return true;
                      const q = travellerSearch.toLowerCase();
                      return (p.fullName || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q);
                    })
                    .map((t) => {
                      const tBookings = bookings.filter(b => b.customerEmail?.toLowerCase() === t.email.toLowerCase());

                      return (
                        <tr key={t.id} className="hover:bg-[#F7F5EE]/50 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-2.5">
                              {t.avatarUrl ? (
                                <img src={t.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#263D32] text-white flex items-center justify-center font-bold text-[10px] uppercase">
                                  {t.fullName ? t.fullName.slice(0, 2) : 'TR'}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-gray-900 block">{t.fullName || 'Traveller'}</span>
                                <span className="font-mono text-[10px] text-gray-500">{t.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="block font-medium">{t.phone || 'Phone not set'}</span>
                            <span className="text-[10px] text-gray-500">{t.country || 'India'}</span>
                          </td>

                          <td className="py-3 px-3 text-[11px] text-[#59665C]">
                            {t.preferences?.yogaStyle ? (
                              <span>{t.preferences.yogaStyle} • {t.preferences.experienceLevel || 'Int.'} • {t.preferences.dietaryPreference || 'Sattvic'}</span>
                            ) : (
                              <span className="italic text-gray-400">Default preferences</span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => {
                                setBookingSearch(t.email);
                                setActiveTab('bookings');
                              }}
                              className="font-bold text-[#263D32] hover:underline"
                            >
                              {tBookings.length} Bookings
                            </button>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              t.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {t.status || 'active'}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            {t.status === 'suspended' ? (
                              <button
                                onClick={() => updateUserAccountStatus(t.id, 'active')}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px] border border-emerald-200 transition cursor-pointer"
                              >
                                Reactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => updateUserAccountStatus(t.id, 'suspended')}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-[10px] border border-red-200 transition cursor-pointer"
                              >
                                Suspend Account
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: REPORTS & ANALYTICS (Prompt Section 2) */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Booking &amp; Financial Revenue Reports
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Multi-dimensional reports filterable by yoga centre, booking status, and payment verification.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportLedgerToCSV({ name: 'YogaConnect Platform Consolidated', slug: 'yogaconnect-platform-ledger' }, ledgerEntries, 'All Records')}
                  className="bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-white border border-[#E2E5DD] hover:bg-[#F7F5EE] text-[#263D32] text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#F7F5EE] p-4 rounded-2xl border border-[#E2E5DD] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Filter by Yoga Centre</label>
                <select
                  value={reportCentreFilter}
                  onChange={(e) => setReportCentreFilter(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-[#E2E5DD] text-xs font-semibold text-[#263D32]"
                >
                  <option value="all">All Registered Centres ({centres.length})</option>
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Booking Status</label>
                <select
                  value={reportStatusFilter}
                  onChange={(e) => setReportStatusFilter(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-[#E2E5DD] text-xs font-semibold text-[#263D32]"
                >
                  <option value="all">All Booking Statuses</option>
                  <option value="confirmed_paid">Confirmed &amp; Paid</option>
                  <option value="assigned_to_centre">Assigned to Ashram</option>
                  <option value="pending_admin">Pending Review</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Time Period</label>
                <select
                  value={reportDateRange}
                  onChange={(e) => setReportDateRange(e.target.value)}
                  className="w-full p-2 bg-white rounded-xl border border-[#E2E5DD] text-xs font-semibold text-[#263D32]"
                >
                  <option value="all">All Historical Records</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="year">Current Financial Year (2026-27)</option>
                </select>
              </div>
            </div>

            {/* Filtered Breakdown Table */}
            {(() => {
              const repBookings = bookings.filter(b => {
                if (reportCentreFilter !== 'all' && b.centreId !== reportCentreFilter) return false;
                if (reportStatusFilter !== 'all' && b.status !== reportStatusFilter) return false;
                return true;
              });

              const repGross = repBookings.reduce((sum, b) => sum + (b.totalUSD || 0), 0);
              const repPaid = repBookings.filter(b => b.status === 'confirmed_paid').reduce((sum, b) => sum + (b.totalUSD || 0), 0);
              const repFee = Math.round(repPaid * 0.10);
              const repNet = Math.max(0, repPaid - repFee);

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#E6EDE2]/50 p-4 rounded-2xl border border-[#A5B89A]/40 text-xs">
                    <div>
                      <span className="text-[#59665C] block text-[10px] uppercase font-bold">Filtered Bookings</span>
                      <span className="font-serif font-bold text-xl text-[#263D32]">{repBookings.length}</span>
                    </div>
                    <div>
                      <span className="text-[#59665C] block text-[10px] uppercase font-bold">Gross Booking Value</span>
                      <span className="font-serif font-bold text-xl text-[#263D32]">{formatPrice(repGross)}</span>
                    </div>
                    <div>
                      <span className="text-[#59665C] block text-[10px] uppercase font-bold">Received Payments</span>
                      <span className="font-serif font-bold text-xl text-emerald-700">{formatPrice(repPaid)}</span>
                    </div>
                    <div>
                      <span className="text-[#59665C] block text-[10px] uppercase font-bold">Platform Fee Earned</span>
                      <span className="font-serif font-bold text-xl text-gold-600">{formatPrice(repFee)}</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                          <th className="py-2.5 px-3 font-bold">Booking Ref</th>
                          <th className="py-2.5 px-3 font-bold">Date</th>
                          <th className="py-2.5 px-3 font-bold">Customer</th>
                          <th className="py-2.5 px-3 font-bold">Centre</th>
                          <th className="py-2.5 px-3 font-bold">Offering</th>
                          <th className="py-2.5 px-3 font-bold text-right">Amount</th>
                          <th className="py-2.5 px-3 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E5DD]">
                        {repBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-[#F7F5EE]/40 transition">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#263D32]">{b.referenceCode}</td>
                            <td className="py-2.5 px-3 text-gray-600">{b.startDate}</td>
                            <td className="py-2.5 px-3">
                              <span className="font-semibold block">{b.customerName}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{b.customerEmail}</span>
                            </td>
                            <td className="py-2.5 px-3 font-serif font-bold text-[#263D32]">{b.centreName}</td>
                            <td className="py-2.5 px-3">{b.courseTitle}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-[#263D32]">{formatPrice(b.totalUSD)}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                b.status === 'confirmed_paid' ? 'bg-emerald-100 text-emerald-800' :
                                b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {b.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB: PARTNER ACCOUNT MANAGEMENT */}
        {activeTab === 'partners' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Yoga Centre Partner Account Provisioning &amp; Access Control
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Grant each registered yoga centre its dedicated login credentials. Assigned partners only access records belonging to their authorized centre.
                </p>
              </div>
              <button
                onClick={() => setIsProvisioningPartner(true)}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <UserCheck className="w-4 h-4" />
                <span>Provision New Partner Account</span>
              </button>
            </div>

            {/* Memberships Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-3 px-3 font-bold">Partner Account</th>
                    <th className="py-3 px-3 font-bold">Assigned Centre</th>
                    <th className="py-3 px-3 font-bold">Role</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold">Assigned Date</th>
                    <th className="py-3 px-3 font-bold text-center">Security Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {memberships.map((m) => (
                    <tr key={m.id} className="hover:bg-[#F7F5EE]/50 transition">
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-gray-900">{m.userName || 'Centre Partner'}</div>
                        <span className="font-mono text-[11px] text-gray-500">{m.userEmail}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-[#263D32]">{m.centreName || m.centreId}</span>
                        <span className="block text-[10px] text-gray-500 font-mono">ID: {m.centreId}</span>
                      </td>
                      <td className="py-3.5 px-3 uppercase text-[11px] font-bold text-gray-700">
                        {m.role}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          m.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          m.status === 'suspended' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-500">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {m.status === 'active' ? (
                            <button
                              onClick={() => updateMembershipStatus(m.id, 'suspended')}
                              className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-lg text-[10px] font-bold transition border border-red-200 cursor-pointer"
                              title="Immediately suspend access to protected data"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => updateMembershipStatus(m.id, 'active')}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-bold transition border border-emerald-200 cursor-pointer"
                              title="Reactivate partner access"
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Revoke partner membership for ${m.userEmail}?`)) {
                                removePartnerMembership(m.id);
                              }
                            }}
                            className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                            title="Unassign partner"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: VENDOR INVITATIONS */}
        {activeTab === 'invitations' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Vendor Account Invitations &amp; Onboarding
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Generate secure, time-expiring invitation links to onboard verified yoga centres without public self-registration.
                </p>
              </div>
              <button
                onClick={() => setIsSendingInvite(true)}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send Secure Invitation</span>
              </button>
            </div>

            {/* Invitations Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-3 px-3 font-bold">Assigned Centre</th>
                    <th className="py-3 px-3 font-bold">Recipient Email</th>
                    <th className="py-3 px-3 font-bold">Role</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold">Expires</th>
                    <th className="py-3 px-3 font-bold text-center">Invitation Link</th>
                    <th className="py-3 px-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {vendorInvitations && vendorInvitations.length > 0 ? (
                    vendorInvitations.map((inv) => {
                      const centre = centres.find(c => c.id === inv.centreId);
                      const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://yogaconnect.in'}/?view=centre_dashboard&invite=${inv.token}`;
                      return (
                        <tr key={inv.id} className="hover:bg-[#F7F5EE]/50 transition">
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-[#263D32]">{centre?.name || inv.centreId}</span>
                            <span className="block text-[10px] text-gray-500 font-mono">ID: {inv.centreId}</span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-gray-900">
                            {inv.email}
                          </td>
                          <td className="py-3.5 px-3 uppercase text-[10px] font-bold text-gray-700">
                            {inv.role}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              inv.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              inv.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-gray-500">
                            {new Date(inv.expiresAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(inviteUrl);
                                setCopiedInviteId(inv.id);
                                setTimeout(() => setCopiedInviteId(null), 2500);
                              }}
                              className="px-2.5 py-1 bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] rounded-lg text-[10px] font-bold border border-[#E2E5DD] transition"
                            >
                              {copiedInviteId === inv.id ? '✓ Link Copied!' : 'Copy Invite Link'}
                            </button>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            {inv.status === 'pending' && (
                              <button
                                onClick={async () => {
                                  if (confirm(`Revoke invitation for ${inv.email}?`)) {
                                    await revokeVendorInvitation(inv.id);
                                  }
                                }}
                                className="text-gray-400 hover:text-red-600 text-xs font-semibold"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No pending vendor invitations. Click "Send Secure Invitation" to onboard an ashram partner.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: COMMISSION RULES */}
        {activeTab === 'commissions' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Platform Commission &amp; Deductions Management
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Configure transparent commission percentages, payment gateway fees, and fixed service fees applied across bookings.
                </p>
              </div>
              <button
                onClick={() => setIsAddingRule(true)}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Commission Rule</span>
              </button>
            </div>

            {/* Standard Tier Card */}
            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E2E5DD] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Global Standard Rule
                </span>
                <h4 className="font-serif font-bold text-base text-[#263D32]">
                  Standard Platform Commission: 10.0%
                </h4>
                <p className="text-xs text-gray-600 max-w-xl">
                  Covers international credit card escrow handling, global SEO listing promotion, customer dispute mediation, and booking verification.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
                Active Across All Centres
              </span>
            </div>

            {/* Commission Rules Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-3 px-3 font-bold">Scope / Centre</th>
                    <th className="py-3 px-3 font-bold">Course Category</th>
                    <th className="py-3 px-3 font-bold">Commission %</th>
                    <th className="py-3 px-3 font-bold">Fixed Fee</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {commissionRules && commissionRules.length > 0 ? (
                    commissionRules.map((rule) => {
                      const centre = rule.centreId ? centres.find(c => c.id === rule.centreId) : null;
                      return (
                        <tr key={rule.id} className="hover:bg-[#F7F5EE]/50 transition">
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-[#263D32]">
                              {centre ? centre.name : 'Global (All Centres)'}
                            </span>
                            {rule.centreId && (
                              <span className="block text-[10px] text-gray-500 font-mono">ID: {rule.centreId}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 capitalize font-medium text-gray-800">
                            {rule.courseCategory === 'all' ? 'All Retreat Packages' : rule.courseCategory}
                          </td>
                          <td className="py-3.5 px-3 font-bold text-[#263D32]">
                            {rule.commissionPercent}%
                          </td>
                          <td className="py-3.5 px-3 font-mono text-gray-600">
                            ${rule.fixedFeeUSD || 0}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              rule.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {rule.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={async () => {
                                await updateCommissionRule(rule.id, { isActive: !rule.isActive });
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold border border-[#E2E5DD] transition"
                            >
                              {rule.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        Using global default 10% commission. Custom rules will appear here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PLATFORM BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Platform-Wide Escrow Bookings &amp; Inquiries
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Full administrative oversight. Customer contact information is unmasked for authorized platform admins to manage dispute resolution and arrival escrow releases.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search ref, guest, centre..."
                  className="px-3 py-2 bg-[#F7F5EE] rounded-xl text-xs border border-[#E2E5DD] focus:outline-none"
                />
                <select
                  value={bookingCentreFilter}
                  onChange={(e) => setBookingCentreFilter(e.target.value)}
                  className="bg-[#F7F5EE] text-[#263D32] font-semibold text-xs py-2 px-3 rounded-xl border border-[#E2E5DD] outline-none cursor-pointer"
                >
                  <option value="all">All Centres</option>
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="bg-[#F7F5EE] text-[#263D32] font-semibold text-xs py-2 px-3 rounded-xl border border-[#E2E5DD] outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed_paid">Confirmed (Paid)</option>
                  <option value="assigned_to_centre">Assigned to Centre</option>
                  <option value="pending_admin">Pending Admin Escrow</option>
                  <option value="cancelled">Cancelled (Refunded)</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-3 px-3 font-bold">Ref Code</th>
                    <th className="py-3 px-3 font-bold">Yoga Centre</th>
                    <th className="py-3 px-3 font-bold">Traveler (Admin View)</th>
                    <th className="py-3 px-3 font-bold">Retreat Package</th>
                    <th className="py-3 px-3 font-bold">Dates</th>
                    <th className="py-3 px-3 font-bold text-right">Gross Total</th>
                    <th className="py-3 px-3 font-bold text-right">Commission (15%)</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold text-center">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {filteredBookings.map((b) => {
                    const isUnmasked = unmaskedBookingIds.includes(b.id);
                    return (
                      <tr key={b.id} className="hover:bg-[#F7F5EE]/50 transition">
                        <td className="py-3.5 px-3 font-mono font-bold text-[#263D32]">
                          {b.referenceCode}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-gray-900">
                          {b.centreName}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-gray-900">{b.customerName}</div>
                          {isUnmasked ? (
                            <div className="text-[10px] text-gray-600 space-y-0.5 mt-0.5">
                              <div>Email: {b.customerEmail}</div>
                              <div>Phone: {b.customerPhone}</div>
                              <button
                                onClick={() => toggleMask(b.id)}
                                className="text-gray-400 hover:text-gray-600 underline text-[9px]"
                              >
                                Mask contact
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleMask(b.id)}
                              className="text-[10px] text-[#536B50] hover:underline font-semibold flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Unmask ({b.customerCountry})</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3.5 px-3 max-w-[160px] truncate" title={b.courseTitle}>
                          {b.courseTitle}
                        </td>
                        <td className="py-3.5 px-3 text-gray-600">
                          {b.startDate}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-gray-700">
                          ${b.totalUSD.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-red-600">
                          -${(b.totalUSD * 0.15).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'confirmed_paid' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            b.status === 'assigned_to_centre' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <select
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                            className="bg-white border border-[#E2E5DD] text-xs font-semibold rounded-lg px-2 py-1 outline-none cursor-pointer"
                          >
                            <option value="pending_admin">Pending Admin</option>
                            <option value="assigned_to_centre">Assign Centre</option>
                            <option value="confirmed_paid">Confirm Paid (Escrow)</option>
                            <option value="cancelled">Cancel &amp; Refund</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIAL OVERSIGHT */}
        {activeTab === 'financial-oversight' && (
          <div className="space-y-6 animate-fade-in">
            {/* Overview KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[11px] font-semibold uppercase text-gray-500 block">Total Gross Escrow</span>
                <div className="text-2xl font-bold text-[#263D32] mt-1">${platformTotals.grossEscrow.toFixed(2)}</div>
                <span className="text-[10px] text-gray-500">All customer bookings</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[11px] font-semibold uppercase text-gray-500 block">Platform Commissions</span>
                <div className="text-2xl font-bold text-emerald-700 mt-1">${platformTotals.commissions.toFixed(2)}</div>
                <span className="text-[10px] text-gray-500">15% platform earnings</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[11px] font-semibold uppercase text-gray-500 block">Refunds Reversed</span>
                <div className="text-2xl font-bold text-gray-700 mt-1">${platformTotals.refunds.toFixed(2)}</div>
                <span className="text-[10px] text-gray-500">Cancelled bookings</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[11px] font-semibold uppercase text-gray-500 block">Total Net Entitlement</span>
                <div className="text-2xl font-bold text-[#263D32] mt-1">${platformTotals.netPayable.toFixed(2)}</div>
                <span className="text-[10px] text-gray-500">Payable across centres</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E2E5DD] shadow-2xs">
                <span className="text-[11px] font-semibold uppercase text-gray-500 block">Total Settled Payouts</span>
                <div className="text-2xl font-bold text-emerald-700 mt-1">${platformTotals.settledPayouts.toFixed(2)}</div>
                <span className="text-[10px] text-gray-500">Verified bank wires</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-2xs">
                <span className="text-[11px] font-semibold uppercase text-emerald-800 block">Outstanding Balance</span>
                <div className="text-2xl font-bold text-emerald-900 mt-1">${platformTotals.outstanding.toFixed(2)}</div>
                <span className="text-[10px] text-emerald-700">Due for next batch</span>
              </div>
            </div>

            {/* Centre-wise Financial Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#263D32]">
                    Centre-wise Financial Breakdown &amp; Ledgers
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Compare gross bookings, commissions collected, settled payouts, and outstanding payable balances across every registered centre.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingAdjustment(true)}
                  className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Ledger Adjustment</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                      <th className="py-3 px-3 font-bold">Yoga Centre</th>
                      <th className="py-3 px-3 font-bold">Commission %</th>
                      <th className="py-3 px-3 font-bold text-right">Gross Escrow</th>
                      <th className="py-3 px-3 font-bold text-right">Platform Commission</th>
                      <th className="py-3 px-3 font-bold text-right">Net Entitlement</th>
                      <th className="py-3 px-3 font-bold text-right">Settled Payouts</th>
                      <th className="py-3 px-3 font-bold text-right">Outstanding Due</th>
                      <th className="py-3 px-3 font-bold text-center">Export</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5DD]">
                    {centres.map((c) => {
                      const m = getCentreFinancialMetrics(c.id);
                      const cLedger = getCentreLedgerEntries(c.id);
                      return (
                        <tr key={c.id} className="hover:bg-[#F7F5EE]/50 transition">
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-[#263D32] block">{c.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono">{c.id}</span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-gray-700">
                            {c.commissionRatePercent || 15}%
                          </td>
                          <td className="py-3.5 px-3 text-right font-medium">
                            ${m.grossBookingValue.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-700">
                            ${m.platformCommission.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-bold text-[#263D32]">
                            ${m.netAmountPayable.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono text-gray-700">
                            ${m.totalPayoutsCompleted.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-800">
                            ${m.outstandingPayableBalance.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={() => exportLedgerToCSV(c, cLedger)}
                                className="bg-[#E6EDE2] hover:bg-[#536B50] hover:text-white text-[#263D32] px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                                title="Export CSV"
                              >
                                CSV
                              </button>
                              <button
                                onClick={() => printCentreStatement(c, cLedger, payouts, m)}
                                className="bg-[#E6EDE2] hover:bg-[#536B50] hover:text-white text-[#263D32] px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                                title="Print PDF statement"
                              >
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Platform Full Ledger Stream */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#263D32]">
                Global Platform Immutable Ledger (All Centres)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                      <th className="py-2.5 px-3 font-bold">Entry #</th>
                      <th className="py-2.5 px-3 font-bold">Centre</th>
                      <th className="py-2.5 px-3 font-bold">Type</th>
                      <th className="py-2.5 px-3 font-bold">Reference</th>
                      <th className="py-2.5 px-3 font-bold">Description</th>
                      <th className="py-2.5 px-3 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5DD]">
                    {ledgerEntries.slice(0, 15).map((e) => (
                      <tr key={e.id} className="hover:bg-[#F7F5EE]/50 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-gray-700">#{e.entryNumber}</td>
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{e.centreId}</td>
                        <td className="py-2.5 px-3 capitalize">{e.entryType.replace(/_/g, ' ')}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-gray-600">{e.referenceCode || '-'}</td>
                        <td className="py-2.5 px-3 text-gray-700 truncate max-w-sm">{e.description}</td>
                        <td className={`py-2.5 px-3 text-right font-mono font-bold ${
                          e.entryDirection === 'credit' ? 'text-emerald-700' : 'text-red-700'
                        }`}>
                          {e.entryDirection === 'credit' ? '+' : '-'}${e.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PAYOUTS & SETTLEMENTS */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Payout Batches &amp; Bank Settlement Verification
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Only mark a payout as "PAID" after verified confirmation with real payment-provider or bank wire settlement reference.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingPayoutBatch(true)}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Payout Batch</span>
              </button>
            </div>

            {/* Payouts Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-3 px-3 font-bold">Payout Ref</th>
                    <th className="py-3 px-3 font-bold">Target Centre</th>
                    <th className="py-3 px-3 font-bold">Period</th>
                    <th className="py-3 px-3 font-bold text-right">Net Amount</th>
                    <th className="py-3 px-3 font-bold">Settlement Reference</th>
                    <th className="py-3 px-3 font-bold">Status</th>
                    <th className="py-3 px-3 font-bold text-center">Settlement Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F7F5EE]/50 transition">
                      <td className="py-3.5 px-3 font-mono font-bold text-[#263D32]">
                        {p.referenceCode}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-gray-900">
                        {p.centreName}
                      </td>
                      <td className="py-3.5 px-3 text-gray-600">
                        {p.periodStart} to {p.periodEnd}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-[#263D32]">
                        ${p.netPayoutAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-gray-700">
                        {p.settlementReference || <span className="text-gray-400 italic">None</span>}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {p.status !== 'paid' ? (
                          <button
                            onClick={() => {
                              setSettlementModalPayout(p);
                              setSettlementRefInput('');
                              setSettlementError('');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            Record Settlement
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[10px] flex items-center justify-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Settled</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CENTRE DIRECTORY */}
        {activeTab === 'centres' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Registered Yoga Centres Directory
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Canonical yoga centre records, active partner memberships, and verification tiers.
                </p>
              </div>
              <button
                onClick={() => setIsAddCentreOpen(true)}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Centre</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {centres.map((c) => {
                const assignedPartner = memberships.find(m => m.centreId === c.id);
                return (
                  <div key={c.id} className="bg-[#F7F5EE] rounded-2xl p-5 border border-[#E2E5DD] space-y-3">
                    <div className="flex items-center space-x-3">
                      <img src={c.coverImage} alt={c.name} className="w-14 h-14 rounded-xl object-cover shrink-0 border" />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-sm text-[#263D32] truncate block">{c.name}</span>
                        <span className="text-[11px] text-gray-500 block">{c.city}, {c.state}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-700 space-y-1 bg-white p-3 rounded-xl border border-[#E2E5DD]">
                      <div>Commission Rate: <strong>{c.commissionRatePercent || 15}%</strong></div>
                      <div>Partner Login: <strong>{assignedPartner?.userEmail || <span className="text-amber-600 italic">No partner assigned</span>}</strong></div>
                      <div>Partner Status: <strong>{assignedPartner?.status || 'N/A'}</strong></div>
                    </div>

                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        onClick={() => {
                          setProvCentreId(c.id);
                          setIsProvisioningPartner(true);
                        }}
                        className="text-xs text-[#536B50] font-semibold hover:underline cursor-pointer"
                      >
                        {assignedPartner ? 'Manage Partner' : '+ Assign Partner'}
                      </button>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setInspectingCentre(c)}
                          className="text-xs bg-[#536B50] hover:bg-[#40563E] text-white px-2.5 py-1 rounded-lg font-medium cursor-pointer transition shadow-2xs"
                        >
                          Inspect Dossier
                        </button>
                        <button
                          onClick={() => {
                            setActiveView('centre-dashboard');
                          }}
                          className="text-xs bg-[#263D32] hover:bg-[#1E3228] text-white px-2.5 py-1 rounded-lg font-medium cursor-pointer transition shadow-2xs"
                        >
                          Preview Portal
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: FINANCIAL INQUIRIES */}
        {activeTab === 'queries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                Partner Accounting Queries &amp; Dispute Tickets
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Review and resolve questions raised by yoga centre partners regarding commission percentages, airport transit fees, or settlement schedules.
              </p>
            </div>

            <div className="space-y-4">
              {financialQueries.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">No inquiries currently pending.</div>
              ) : (
                financialQueries.map((q) => (
                  <div key={q.id} className="p-5 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-[#263D32]">{q.subject}</span>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          From: <strong>{q.partnerEmail}</strong> • Centre: <strong>{q.centreName}</strong>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {q.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-800 bg-white p-3 rounded-xl border border-[#E2E5DD]/70">
                      {q.message}
                    </p>

                    {q.adminResponse ? (
                      <div className="bg-[#E6EDE2] p-3 rounded-xl border border-[#A5B89A]/40">
                        <span className="font-bold text-[#263D32] block">Recorded Administrator Response:</span>
                        <p className="text-gray-800">{q.adminResponse}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        {selectedQueryToAnswer === q.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={3}
                              placeholder="Type official response..."
                              value={queryResponseInput}
                              onChange={(e) => setQueryResponseInput(e.target.value)}
                              className="w-full p-2.5 bg-white border border-[#E2E5DD] rounded-xl text-xs"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAnswerQuery(q.id)}
                                className="bg-[#536B50] text-white px-4 py-1.5 rounded-lg font-bold"
                              >
                                Send Response
                              </button>
                              <button
                                onClick={() => setSelectedQueryToAnswer(null)}
                                className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedQueryToAnswer(q.id);
                              setQueryResponseInput('');
                            }}
                            className="bg-[#263D32] text-white px-3 py-1.5 rounded-lg font-semibold cursor-pointer"
                          >
                            Answer Query
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT LOGS */}
        {activeTab === 'audit-logs' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
                  Immutable System Security &amp; Audit Logs
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Append-only record of all security-sensitive administrative events: partner provisioning, role modifications, financial adjustments, and payout confirmations.
                </p>
              </div>
              <span className="bg-[#DCCDB5]/30 text-[#263D32] text-xs font-bold px-2.5 py-1 rounded">
                Tamper-Resistant
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EE] text-[#263D32] border-b border-[#E2E5DD]">
                    <th className="py-2.5 px-3 font-bold">Timestamp</th>
                    <th className="py-2.5 px-3 font-bold">Action</th>
                    <th className="py-2.5 px-3 font-bold">Actor</th>
                    <th className="py-2.5 px-3 font-bold">Target Entity</th>
                    <th className="py-2.5 px-3 font-bold">Details</th>
                    <th className="py-2.5 px-3 font-bold font-mono">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5DD]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F7F5EE]/50 transition">
                      <td className="py-2.5 px-3 text-gray-500 font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#263D32] font-mono text-[11px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 font-medium">
                        {log.actorEmail || 'system'}
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">
                        {log.targetEntity} {log.targetId ? `(${log.targetId})` : ''}
                      </td>
                      <td className="py-2.5 px-3 text-gray-600 max-w-xs truncate" title={JSON.stringify(log.details)}>
                        {JSON.stringify(log.details || {})}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: MATCHMAKERS (Preserved) */}
        {activeTab === 'matchmakers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
              AI Retreat Matchmaker Moderation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {centres.map(c => {
                const conf = matchmakerConfigs[c.id];
                return (
                  <div key={c.id} className="p-4 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#263D32]">{c.name}</span>
                      <span className="block text-[11px] text-gray-500">Status: {conf?.status || 'draft'}</span>
                    </div>
                    <button
                      onClick={() => openCentreMatchmaker(c.id)}
                      className="bg-[#536B50] text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      Configure Quiz
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 9: ASANAS (Preserved) */}
        {activeTab === 'asanas' && (
          <div className="animate-fade-in">
            <AsanaManagerTab />
          </div>
        )}

        {/* TAB 10: COUPONS (Preserved) */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E5DD] shadow-2xs space-y-6 animate-fade-in">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#263D32]">
              Promotional Escrow Coupons
            </h2>
            <div className="space-y-3 max-w-md">
              {couponList.map((cpn, idx) => (
                <div key={idx} className="p-3 bg-[#F7F5EE] rounded-xl flex items-center justify-between border border-[#E2E5DD]">
                  <span className="font-mono font-bold text-sm text-[#263D32]">{cpn.code}</span>
                  <span className="text-xs text-gray-600">{cpn.discount}% Discount • Used {cpn.usage} times</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: Provision Partner Account */}
      {isProvisioningPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E5DD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#263D32]">
                Provision Centre Partner Account
              </h3>
              <button onClick={() => setIsProvisioningPartner(false)} className="text-gray-400">✕</button>
            </div>

            {provFeedback && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                provFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {provFeedback.message}
              </div>
            )}

            <form onSubmit={handleProvisionPartner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#263D32] mb-1">Select Yoga Centre</label>
                <select
                  value={provCentreId}
                  onChange={(e) => setProvCentreId(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] font-semibold"
                >
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Partner Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. partner.ashram@yogaconnect.in"
                  value={provEmail}
                  onChange={(e) => setProvEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Partner Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acharya Vishwajeet"
                  value={provName}
                  onChange={(e) => setProvName(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Account Role</label>
                <select
                  value={provRole}
                  onChange={(e) => setProvRole(e.target.value as any)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                >
                  <option value="owner">Authorised Centre Owner</option>
                  <option value="manager">Operations Manager</option>
                  <option value="accountant">Financial Accountant</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProvisioningPartner(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#536B50] hover:bg-[#40563E] text-white rounded-xl font-bold"
                >
                  Create &amp; Assign Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Record Financial Adjustment */}
      {isCreatingAdjustment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E5DD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#263D32]">
                Record Financial Ledger Adjustment
              </h3>
              <button onClick={() => setIsCreatingAdjustment(false)} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleCreateAdjustment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#263D32] mb-1">Yoga Centre</label>
                <select
                  value={adjCentreId}
                  onChange={(e) => setAdjCentreId(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                >
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#263D32] mb-1">Direction</label>
                  <select
                    value={adjDirection}
                    onChange={(e) => setAdjDirection(e.target.value as any)}
                    className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                  >
                    <option value="credit">Credit (+) (Increases Entitlement)</option>
                    <option value="debit">Debit (-) (Deducts Entitlement)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#263D32] mb-1">Amount (USD)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={adjAmount}
                    onChange={(e) => setAdjAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Reason / Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Airport transfer transit adjustment credited to ashram account"
                  value={adjDescription}
                  onChange={(e) => setAdjDescription(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Reference Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ADJ-TRANSIT-4402"
                  value={adjRefCode}
                  onChange={(e) => setAdjRefCode(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingAdjustment(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#536B50] text-white rounded-xl font-bold"
                >
                  Post Immutable Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Settlement Verification */}
      {settlementModalPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E5DD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#263D32]">
                Verify Bank Settlement &amp; Disburse Payout
              </h3>
              <button onClick={() => setSettlementModalPayout(null)} className="text-gray-400">✕</button>
            </div>

            <div className="bg-[#F7F5EE] p-3 rounded-xl text-xs space-y-1">
              <div>Payout Ref: <strong>{settlementModalPayout.referenceCode}</strong></div>
              <div>Centre: <strong>{settlementModalPayout.centreName}</strong></div>
              <div>Net Payable Amount: <strong className="text-emerald-700 text-sm">${settlementModalPayout.netPayoutAmount.toFixed(2)} USD</strong></div>
            </div>

            {settlementError && (
              <div className="p-2.5 bg-red-50 text-red-800 text-xs font-semibold rounded-xl border border-red-200">
                {settlementError}
              </div>
            )}

            <form onSubmit={handleExecuteSettlement} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#263D32] mb-1">
                  Bank Settlement / NEFT / Wire Reference ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC-NEFT-9284192410 or STRIPE-PO-1092"
                  value={settlementRefInput}
                  onChange={(e) => setSettlementRefInput(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] font-mono"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Mandatory proof of wire settlement. A corresponding debit entry will be permanently posted to the centre's ledger.
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSettlementModalPayout(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Settlement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Create Payout Batch */}
      {isCreatingPayoutBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E5DD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#263D32]">Create Payout Batch</h3>
              <button onClick={() => setIsCreatingPayoutBatch(false)} className="text-gray-400">✕</button>
            </div>

            <form onSubmit={handleCreatePayoutBatch} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#263D32] mb-1">Target Yoga Centre</label>
                <select
                  value={payoutCentreId}
                  onChange={(e) => setPayoutCentreId(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                >
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Net Disbursement Amount (USD)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Accounting Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Scheduled mid-month escrow release for confirmed retreats"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPayoutBatch(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#536B50] text-white rounded-xl font-bold"
                >
                  Create Batch (Pending)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Send Secure Vendor Invitation */}
      {isSendingInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E5DD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#263D32]">
                Send Secure Vendor Invitation
              </h3>
              <button 
                onClick={() => {
                  setIsSendingInvite(false);
                  setInviteFeedback(null);
                }} 
                className="text-gray-400"
              >
                ✕
              </button>
            </div>

            {inviteFeedback && (
              <div className={`p-3 rounded-xl text-xs space-y-2 border ${
                inviteFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                <p className="font-medium">{inviteFeedback.message}</p>
                {inviteFeedback.link && (
                  <div className="bg-white p-2 rounded-lg border border-emerald-300 font-mono text-[10px] break-all select-all flex items-center justify-between gap-2">
                    <span className="truncate">{inviteFeedback.link}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inviteFeedback.link!);
                        alert('Invitation link copied to clipboard!');
                      }}
                      className="px-2 py-1 bg-emerald-600 text-white rounded font-bold shrink-0 text-[10px]"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setInviteFeedback(null);
                try {
                  const res = await createVendorInvitation(inviteCentreId, inviteEmail, inviteRole);
                  if (res.success && res.invitation) {
                    const url = `${window.location.origin}/?view=centre_dashboard&invite=${res.invitation.token}`;
                    setInviteFeedback({
                      type: 'success',
                      message: `Invitation generated for ${inviteEmail}. Share the secure link below:`,
                      link: url
                    });
                    setInviteEmail('');
                  } else {
                    setInviteFeedback({ type: 'error', message: res.error || 'Failed to generate invitation.' });
                  }
                } catch (err: any) {
                  setInviteFeedback({ type: 'error', message: err.message || 'Error creating invitation.' });
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-[#263D32] mb-1">Target Yoga Centre</label>
                <select
                  value={inviteCentreId}
                  onChange={(e) => setInviteCentreId(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] font-semibold"
                >
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Centre Owner / Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ashram.contact@domain.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Authorized Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                >
                  <option value="owner">Authorised Centre Owner</option>
                  <option value="manager">Operations Manager</option>
                  <option value="accountant">Financial Accountant</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSendingInvite(false);
                    setInviteFeedback(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#536B50] hover:bg-[#40563E] text-white rounded-xl font-bold shadow-sm transition"
                >
                  Generate Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: Add Commission Rule */}
      {isAddingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2E5DD] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#263D32]">
                Configure Commission Rule
              </h3>
              <button onClick={() => setIsAddingRule(false)} className="text-gray-400">✕</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await addCommissionRule({
                  centreId: ruleScope === 'global' ? undefined : ruleCentreId,
                  courseCategory: ruleCategory,
                  commissionPercent: rulePercent,
                  fixedFeeUSD: ruleFixedFee,
                  isActive: true
                });
                setIsAddingRule(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-[#263D32] mb-1">Scope</label>
                <select
                  value={ruleScope}
                  onChange={(e) => setRuleScope(e.target.value as any)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                >
                  <option value="global">Global (Applies to all yoga centres)</option>
                  <option value="centre">Centre Specific (Tailored ashram partner agreement)</option>
                </select>
              </div>

              {ruleScope === 'centre' && (
                <div>
                  <label className="block font-bold text-[#263D32] mb-1">Select Yoga Centre</label>
                  <select
                    value={ruleCentreId}
                    onChange={(e) => setRuleCentreId(e.target.value)}
                    className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                  >
                    {centres.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#263D32] mb-1">Course / Retreat Category</label>
                <select
                  value={ruleCategory}
                  onChange={(e) => setRuleCategory(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                >
                  <option value="all">All Course &amp; Retreat Packages</option>
                  <option value="200h-ttc">200-Hour TTC</option>
                  <option value="300h-ttc">300-Hour TTC</option>
                  <option value="meditation">Meditation Retreats</option>
                  <option value="ayurveda">Ayurvedic Immersion</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#263D32] mb-1">Commission %</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    required
                    value={rulePercent}
                    onChange={(e) => setRulePercent(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#263D32] mb-1">Fixed Fee (USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={ruleFixedFee}
                    onChange={(e) => setRuleFixedFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRule(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#536B50] hover:bg-[#40563E] text-white rounded-xl font-bold shadow-sm"
                >
                  Save Commission Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: Comprehensive Centre Inspection Dossier */}
      {inspectingCentre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#DCD6C8] shadow-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="bg-[#263D32] text-white p-6 relative">
              <button
                onClick={() => setInspectingCentre(null)}
                className="absolute top-5 right-5 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                ✕
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={inspectingCentre.coverImage || inspectingCentre.image}
                  alt={inspectingCentre.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-white/20 shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-xl text-[#F7F5EE]">
                      {inspectingCentre.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active Centre
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">
                    ID: <span className="font-mono">{inspectingCentre.id}</span> • {inspectingCentre.city || inspectingCentre.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Financial Metrics */}
              {(() => {
                const cBookings = bookings.filter(b => b.centreId === inspectingCentre.id);
                const cLedger = getCentreLedgerEntries(inspectingCentre.id);
                const cPayouts = getCentrePayouts(inspectingCentre.id);

                const totalBookingValue = cBookings.reduce((sum, b) => sum + (b.totalUSD || b.totalPriceUSD || 0), 0);
                const collectedRevenue = cBookings
                  .filter(b => b.status === 'confirmed_paid' || b.paymentStatus === 'paid' || (b.paymentStatus as any) === 'paid_full')
                  .reduce((sum, b) => sum + (b.totalUSD || b.totalPriceUSD || 0), 0);
                const platformFee = Math.round(collectedRevenue * 0.10);
                const netPayable = Math.max(0, collectedRevenue - platformFee);
                const settledAmount = cPayouts
                  .filter(p => p.status === 'processed' || p.status === 'paid')
                  .reduce((sum, p) => sum + (p.netPayoutAmount || p.amountUSD || 0), 0);
                const pendingSettlement = Math.max(0, netPayable - settledAmount);

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Total Bookings</span>
                        <div className="text-lg font-bold text-[#263D32]">{cBookings.length}</div>
                        <span className="text-[10px] text-gray-500">Gross: {formatPrice(totalBookingValue)}</span>
                      </div>

                      <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Escrow Collected</span>
                        <div className="text-lg font-bold text-emerald-800">{formatPrice(collectedRevenue)}</div>
                        <span className="text-[10px] text-gray-500">10% Fee: {formatPrice(platformFee)}</span>
                      </div>

                      <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Net Due to Centre</span>
                        <div className="text-lg font-bold text-[#263D32]">{formatPrice(netPayable)}</div>
                        <span className="text-[10px] text-gray-500">After deductions</span>
                      </div>

                      <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Outstanding Payout</span>
                        <div className="text-lg font-bold text-blue-900">{formatPrice(pendingSettlement)}</div>
                        <span className="text-[10px] text-gray-500">Disbursed: {formatPrice(settledAmount)}</span>
                      </div>
                    </div>

                    {/* Centre Coordinates & Banking Details */}
                    <div className="bg-white rounded-2xl p-4 border border-[#E2E5DD] shadow-sm space-y-2">
                      <h4 className="font-bold text-[#263D32] flex items-center">
                        <Building2 className="w-4 h-4 mr-1.5 text-[#536B50]" /> Registered Coordinates &amp; Bank KYC
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Physical Address</span>
                          <span className="text-gray-800">{inspectingCentre.address || inspectingCentre.location || 'Rishikesh, Uttarakhand'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Contact Details</span>
                          <span className="text-gray-800">{inspectingCentre.contactEmail || 'contact@ashram.org'} • {inspectingCentre.contactPhone || '+91 9876543210'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Bank Name</span>
                          <span className="font-semibold text-gray-800">{inspectingCentre.bankAccountDetails?.bankName || 'State Bank of India'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Account / IFSC</span>
                          <span className="font-mono text-gray-800">{inspectingCentre.bankAccountDetails?.accountNumber || '•••••••• 4092'} (IFSC: {inspectingCentre.bankAccountDetails?.ifscCode || 'SBIN0001234'})</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Bookings for this centre */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#263D32]">Recent Reservations for this Centre</h4>
                      {cBookings.length === 0 ? (
                        <p className="text-gray-500 italic p-3 bg-[#F7F5EE] rounded-xl">No reservations recorded yet for this centre.</p>
                      ) : (
                        <div className="overflow-x-auto border border-[#E2E5DD] rounded-xl">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#F7F5EE] text-gray-600 font-bold uppercase text-[10px]">
                              <tr>
                                <th className="py-2 px-3">Booking ID</th>
                                <th className="py-2 px-3">Guest</th>
                                <th className="py-2 px-3">Dates</th>
                                <th className="py-2 px-3">Amount</th>
                                <th className="py-2 px-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E5DD]">
                              {cBookings.slice(0, 5).map(b => (
                                <tr key={b.id} className="hover:bg-[#FAF9F5]">
                                  <td className="py-2 px-3 font-mono">{b.id.slice(0, 10)}</td>
                                  <td className="py-2 px-3 font-semibold text-gray-800">{b.guestName || b.customerName}</td>
                                  <td className="py-2 px-3 text-gray-600">{b.startDate ? new Date(b.startDate).toLocaleDateString() : 'Flexible'}</td>
                                  <td className="py-2 px-3 font-bold text-[#263D32]">{formatPrice(b.totalUSD || b.totalPriceUSD || 0)}</td>
                                  <td className="py-2 px-3 capitalize">{b.status.replace('_', ' ')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="bg-[#F7F5EE] px-6 py-4 border-t border-[#E2E5DD] flex items-center justify-between">
              <button
                onClick={() => {
                  setInspectingCentre(null);
                  setActiveView('centre-dashboard');
                }}
                className="px-4 py-2 bg-[#263D32] hover:bg-[#1E3228] text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Open Centre Vendor Portal View
              </button>
              <button
                onClick={() => setInspectingCentre(null)}
                className="px-5 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-bold border border-[#DCD6C8]"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

