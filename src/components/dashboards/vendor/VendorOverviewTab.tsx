'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle,
  Filter,
  Eye,
  Building2,
  Sparkles
} from 'lucide-react';
import { BookingRequest, CentreEnquiry, FinancialLedgerEntry, PayoutRecord, YogaCentre } from '../../../types';

interface VendorOverviewTabProps {
  activeCentre: YogaCentre;
  bookings: BookingRequest[];
  enquiries: CentreEnquiry[];
  ledgerEntries: FinancialLedgerEntry[];
  payouts: PayoutRecord[];
  formatPrice: (amount: number) => string;
  onNavigateTab: (tab: any) => void;
  onSelectBookingDetail: (booking: BookingRequest) => void;
}

export const VendorOverviewTab: React.FC<VendorOverviewTabProps> = ({
  activeCentre,
  bookings,
  enquiries,
  ledgerEntries,
  payouts,
  formatPrice,
  onNavigateTab,
  onSelectBookingDetail
}) => {
  const [dateFilter, setDateFilter] = useState<'all' | '30days' | 'quarter' | 'year'>('all');

  // Filter bookings based on selected date range
  const filteredBookings = useMemo(() => {
    if (dateFilter === 'all') return bookings;
    const now = Date.now();
    const daysLimit = dateFilter === '30days' ? 30 : dateFilter === 'quarter' ? 90 : 365;
    const cutoff = now - daysLimit * 86400000;
    return bookings.filter(b => new Date(b.createdAt).getTime() >= cutoff);
  }, [bookings, dateFilter]);

  // Derived metrics from actual database records
  const metrics = useMemo(() => {
    const totalBookings = filteredBookings.length;
    const pendingBookings = filteredBookings.filter(b => b.status === 'pending_admin' || b.status === 'assigned_to_centre').length;
    const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed_paid').length;
    const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length;

    // Upcoming bookings (confirmed or assigned with start_date >= today)
    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingBookings = filteredBookings.filter(
      b => (b.status === 'confirmed_paid' || b.status === 'assigned_to_centre') && b.startDate >= todayStr
    ).length;

    // Total distinct customers
    const uniqueCustomerEmails = new Set(filteredBookings.map(b => b.customerEmail.toLowerCase().trim()));
    const totalCustomers = uniqueCustomerEmails.size;

    // Total enquiries
    const totalEnquiries = enquiries.length;

    // Revenue calculations (confirmed + completed)
    const activeBookings = filteredBookings.filter(b => b.status === 'confirmed_paid' || b.status === 'completed');
    const grossRevenue = activeBookings.reduce((sum, b) => sum + Number(b.totalUSD || 0), 0);
    
    // Platform commission (from contractual rate or ledger)
    const commRate = activeCentre.commissionRatePercent || 15;
    const platformCommission = activeBookings.reduce((sum, b) => {
      const fee = b.commissionFeeUSD !== undefined ? Number(b.commissionFeeUSD) : (Number(b.totalUSD) * commRate / 100);
      return sum + fee;
    }, 0);

    // Net payable to centre
    const netPayable = Math.max(0, grossRevenue - platformCommission);

    // Pending payments (bookings where payment_status is pending or unverified)
    const pendingPaymentsAmount = filteredBookings
      .filter(b => b.status !== 'cancelled' && (b.paymentStatus === 'pending' || b.paymentStatus === 'unverified'))
      .reduce((sum, b) => sum + Number(b.totalUSD || 0), 0);

    // Settled payouts from database
    const completedPayoutsTotal = payouts
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.netPayoutAmount || 0), 0);

    // Outstanding payable balance
    const outstandingBalance = Math.max(0, netPayable - completedPayoutsTotal);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      upcomingBookings,
      totalCustomers,
      totalEnquiries,
      grossRevenue,
      platformCommission,
      netPayable,
      pendingPaymentsAmount,
      completedPayoutsTotal,
      outstandingBalance
    };
  }, [filteredBookings, enquiries, payouts, activeCentre]);

  // Recent activity feed (latest bookings + enquiries)
  const recentActivities = useMemo(() => {
    const list: Array<{ id: string; type: 'booking' | 'enquiry'; title: string; subtitle: string; date: string; status: string; raw: any }> = [];

    bookings.slice(0, 5).forEach(b => {
      list.push({
        id: b.id,
        type: 'booking',
        title: `Booking: ${b.customerName} (${b.referenceCode})`,
        subtitle: `${b.courseTitle} • ${b.startDate}`,
        date: b.createdAt,
        status: b.status,
        raw: b
      });
    });

    enquiries.slice(0, 5).forEach(e => {
      list.push({
        id: e.id,
        type: 'enquiry',
        title: `Enquiry: ${e.customerName} (${e.referenceCode})`,
        subtitle: `${e.courseTitle || 'Retreat Inquiry'} • ${e.preferredDates || 'Flexible'}`,
        date: e.createdAt,
        status: e.status,
        raw: e
      });
    });

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
  }, [bookings, enquiries]);

  return (
    <div className="space-y-6">

      {/* Date Filter & Overview Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#263D32]">
            Dashboard Performance Overview
          </h2>
          <p className="text-xs text-[#59665C] mt-0.5">
            Verified analytics for <strong className="text-[#263D32]">{activeCentre.name}</strong> derived from live Supabase ledger & bookings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-[#536B50]" />
          <span className="text-xs font-bold text-[#59665C]">Range:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#263D32] focus:outline-none focus:border-[#536B50] cursor-pointer"
          >
            <option value="all">All Time Records</option>
            <option value="30days">Last 30 Days</option>
            <option value="quarter">Last Quarter (90 Days)</option>
            <option value="year">Current Year</option>
          </select>
        </div>
      </div>

      {/* Primary KPI Cards Grid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs hover:border-[#A5B89A] transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#59665C]">
              Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E6EDE2] text-[#286749] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#263D32]">
              {formatPrice(metrics.grossRevenue)}
            </div>
            <p className="text-[11px] text-[#59665C] mt-1">
              Confirmed & completed retreat volume
            </p>
          </div>
          <div className="pt-2 border-t border-[#E2E5DD]/60 flex items-center justify-between text-[11px]">
            <span className="text-[#59665C]">Net Entitlement:</span>
            <strong className="text-[#286749]">{formatPrice(metrics.netPayable)}</strong>
          </div>
        </div>

        {/* Card 2: Amount Payable to Centre */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs hover:border-[#A5B89A] transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#59665C]">
              Payable Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#286749]">
              {formatPrice(metrics.outstandingBalance)}
            </div>
            <p className="text-[11px] text-[#59665C] mt-1">
              Pending platform settlement payout
            </p>
          </div>
          <div className="pt-2 border-t border-[#E2E5DD]/60 flex items-center justify-between text-[11px]">
            <span className="text-[#59665C]">Paid to Date:</span>
            <strong className="text-[#263D32]">{formatPrice(metrics.completedPayoutsTotal)}</strong>
          </div>
        </div>

        {/* Card 3: Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs hover:border-[#A5B89A] transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#59665C]">
              Total Bookings
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E6EDE2] text-[#263D32] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#536B50]" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#263D32]">
              {metrics.totalBookings}
            </div>
            <p className="text-[11px] text-[#59665C] mt-1">
              {metrics.confirmedBookings} confirmed • {metrics.pendingBookings} pending
            </p>
          </div>
          <div className="pt-2 border-t border-[#E2E5DD]/60 flex items-center justify-between text-[11px]">
            <span className="text-[#59665C]">Upcoming Arrivals:</span>
            <strong className="text-[#536B50]">{metrics.upcomingBookings}</strong>
          </div>
        </div>

        {/* Card 4: Customers & Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs hover:border-[#A5B89A] transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#59665C]">
              Customers & Enquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#263D32]">
              {metrics.totalCustomers} <span className="text-xs font-sans font-normal text-[#59665C]">guests</span>
            </div>
            <p className="text-[11px] text-[#59665C] mt-1">
              {metrics.totalEnquiries} active retreat inquiries
            </p>
          </div>
          <div className="pt-2 border-t border-[#E2E5DD]/60 flex items-center justify-between text-[11px]">
            <span className="text-[#59665C]">Commission Rate:</span>
            <strong className="text-[#263D32]">{activeCentre.commissionRatePercent || 15}% Escrow</strong>
          </div>
        </div>

      </div>

      {/* Secondary Metrics Bar (Booking Status Distribution) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#263D32]">
            Booking Pipeline Breakdown
          </h3>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-bold text-[#536B50] hover:underline inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>Manage All Bookings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] text-center">
            <span className="text-[10px] font-bold text-[#59665C] uppercase block">New / Pending</span>
            <strong className="text-lg font-bold text-amber-700 block mt-0.5">{metrics.pendingBookings}</strong>
            <span className="text-[10px] text-[#8E9B91]">Awaiting admin or centre</span>
          </div>

          <div className="p-3 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] text-center">
            <span className="text-[10px] font-bold text-[#59665C] uppercase block">Confirmed & Escrow</span>
            <strong className="text-lg font-bold text-[#286749] block mt-0.5">{metrics.confirmedBookings}</strong>
            <span className="text-[10px] text-[#8E9B91]">Funded deposit</span>
          </div>

          <div className="p-3 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] text-center">
            <span className="text-[10px] font-bold text-[#59665C] uppercase block">Completed</span>
            <strong className="text-lg font-bold text-blue-700 block mt-0.5">{metrics.completedBookings}</strong>
            <span className="text-[10px] text-[#8E9B91]">Service finalized</span>
          </div>

          <div className="p-3 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] text-center">
            <span className="text-[10px] font-bold text-[#59665C] uppercase block">Upcoming</span>
            <strong className="text-lg font-bold text-[#536B50] block mt-0.5">{metrics.upcomingBookings}</strong>
            <span className="text-[10px] text-[#8E9B91]">Future arrival dates</span>
          </div>

          <div className="p-3 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] text-center">
            <span className="text-[10px] font-bold text-[#59665C] uppercase block">Cancelled</span>
            <strong className="text-lg font-bold text-gray-500 block mt-0.5">{metrics.cancelledBookings}</strong>
            <span className="text-[10px] text-[#8E9B91]">Refunded / voided</span>
          </div>
        </div>
      </div>

      {/* Financial Transparency Summary Card */}
      <div className="bg-[#263D32] text-[#F7F5EE] p-6 rounded-3xl border border-[#1E3228] shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#DCCDB5]" />
              <h3 className="font-serif font-bold text-base text-white">
                Transparent Escrow Accounting Statement
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#A5B89A] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              Contractual Rate: {activeCentre.commissionRatePercent || 15}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#A5B89A] block">Gross Booking Value:</span>
              <strong className="text-base text-white">{formatPrice(metrics.grossRevenue)}</strong>
            </div>

            <div>
              <span className="text-[#A5B89A] block">Platform Commission:</span>
              <strong className="text-base text-amber-300">-{formatPrice(metrics.platformCommission)}</strong>
            </div>

            <div>
              <span className="text-[#A5B89A] block">Settled Bank Transfers:</span>
              <strong className="text-base text-emerald-300">{formatPrice(metrics.completedPayoutsTotal)}</strong>
            </div>

            <div>
              <span className="text-[#A5B89A] block">Net Payable to Ashram:</span>
              <strong className="text-base text-[#F7F5EE] font-serif">{formatPrice(metrics.outstandingBalance)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Activity & Quick Center Profile Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Recent Activity Feed (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E5DD] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#263D32]">
              Recent Centre Activity & Communications
            </h3>
            <span className="text-[11px] text-[#59665C]">Live Database Feed</span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8E9B91]">
              No recent bookings or inquiries recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-[#E2E5DD]/60">
              {recentActivities.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs hover:bg-[#F7F5EE]/50 px-2 rounded-xl transition">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.type === 'booking' ? 'bg-[#E6EDE2] text-[#286749]' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {item.type === 'booking' ? <Calendar className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-[#263D32] truncate">{item.title}</p>
                      <p className="text-[11px] text-[#59665C] truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-[10px] text-[#8E9B91]">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    {item.type === 'booking' && (
                      <button
                        onClick={() => onSelectBookingDetail(item.raw)}
                        className="p-1 text-[#536B50] hover:text-[#263D32] hover:bg-[#E6EDE2] rounded-md transition cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Centre Identity & Facilities Card (1 Col) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#263D32] border-b border-[#E2E5DD] pb-3">
              Accredited Centre Profile
            </h3>

            <div className="flex items-center space-x-3">
              <img
                src={activeCentre.coverImage}
                alt={activeCentre.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#E2E5DD] shrink-0"
              />
              <div className="overflow-hidden">
                <h4 className="font-serif font-bold text-sm text-[#263D32] truncate">
                  {activeCentre.name}
                </h4>
                <p className="text-[11px] text-[#59665C] truncate">
                  {activeCentre.city}, {activeCentre.state}
                </p>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  ✓ Verified Ashram Partner
                </span>
              </div>
            </div>

            <div className="text-xs text-[#59665C] space-y-1.5 pt-2">
              <p><strong>Certification:</strong> {activeCentre.certification}</p>
              <p><strong>Facilities:</strong> {activeCentre.facilities.slice(0, 3).join(', ')}</p>
              <p><strong>Contact:</strong> {activeCentre.contactEmail || 'Managed via platform'}</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('profile')}
            className="w-full bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] border border-[#E2E5DD] font-semibold text-xs py-2.5 rounded-xl transition cursor-pointer text-center"
          >
            Edit Centre Profile & Facilities
          </button>
        </div>

      </div>

    </div>
  );
};
