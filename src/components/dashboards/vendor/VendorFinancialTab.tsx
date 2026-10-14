'use client';

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  CreditCard, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileSpreadsheet, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { BookingRequest, FinancialLedgerEntry, PayoutRecord, YogaCentre } from '../../../types';
import { exportLedgerToCSV, printCentreStatement } from '../../../utils/statementExport';

interface VendorFinancialTabProps {
  activeCentre: YogaCentre;
  bookings: BookingRequest[];
  ledgerEntries: FinancialLedgerEntry[];
  payouts: PayoutRecord[];
  formatPrice: (amount: number) => string;
  onRaiseQuery?: () => void;
}

export const VendorFinancialTab: React.FC<VendorFinancialTabProps> = ({
  activeCentre,
  bookings,
  ledgerEntries,
  payouts,
  formatPrice,
  onRaiseQuery
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');

  // Strict isolation: only entries for activeCentre
  const myLedger = useMemo(() => {
    return ledgerEntries.filter(entry => entry.centreId === activeCentre.id);
  }, [ledgerEntries, activeCentre.id]);

  const myPayouts = useMemo(() => {
    return payouts.filter(p => p.centreId === activeCentre.id);
  }, [payouts, activeCentre.id]);

  const myBookings = useMemo(() => {
    return bookings.filter(b => b.centreId === activeCentre.id);
  }, [bookings, activeCentre.id]);

  // Financial Computations from Real Records
  const financials = useMemo(() => {
    const totalBookingValue = myBookings.reduce((sum, b) => sum + (b.totalPriceUSD || b.totalUSD || 0), 0);
    
    // Confirmed bookings where payment was collected
    const confirmedBookings = myBookings.filter(b => b.status === 'confirmed_paid' || b.paymentStatus === 'paid' || b.paymentStatus === 'paid_full');
    const collectedRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPriceUSD || b.totalUSD || 0), 0);

    // Unverified / Pending collection
    const pendingCollection = myBookings
      .filter(b => b.status !== 'confirmed_paid' && b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.totalPriceUSD || b.totalUSD || 0), 0);

    // Ledger totals
    let grossEarnings = 0;
    let platformCommission = 0;
    let refundsDeductions = 0;

    myLedger.forEach(entry => {
      const amt = entry.amountUSD ?? entry.amount ?? 0;
      const type = entry.entryType as string;
      if (type === 'booking_charge' || type === 'booking_credit' || type === 'guest_payment') {
        grossEarnings += amt;
      } else if (type === 'platform_commission' || type === 'platform_fee' || type === 'commission_deduction') {
        platformCommission += Math.abs(amt);
      } else if (type === 'refund' || type === 'refund_deduction') {
        refundsDeductions += Math.abs(amt);
      }
    });

    // If ledger has not populated yet, compute standard 10% platform commission on collected revenue
    if (grossEarnings === 0 && collectedRevenue > 0) {
      grossEarnings = collectedRevenue;
      platformCommission = Math.round(collectedRevenue * 0.10);
    }

    const netPayable = Math.max(0, grossEarnings - platformCommission - refundsDeductions);

    // Completed payouts vs pending
    const totalDisbursed = myPayouts
      .filter(p => p.status === 'processed')
      .reduce((sum, p) => sum + (p.amountUSD ?? p.netPayoutAmount ?? 0), 0);

    const pendingSettlement = Math.max(0, netPayable - totalDisbursed);

    return {
      totalBookingValue,
      collectedRevenue,
      pendingCollection,
      grossEarnings,
      platformCommission,
      refundsDeductions,
      netPayable,
      totalDisbursed,
      pendingSettlement
    };
  }, [myBookings, myLedger, myPayouts]);

  // Filtered Ledger Table
  const filteredLedger = useMemo(() => {
    return myLedger.filter(entry => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        entry.id.toLowerCase().includes(q) ||
        (entry.description && entry.description.toLowerCase().includes(q)) ||
        (entry.bookingId && entry.bookingId.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (typeFilter !== 'all' && entry.entryType !== typeFilter) return false;

      return true;
    });
  }, [myLedger, searchQuery, typeFilter]);

  const handleExportCSV = () => {
    exportLedgerToCSV(activeCentre, filteredLedger);
  };

  const handlePrint = () => {
    const metrics = {
      grossBookingValue: financials.grossEarnings,
      platformCommission: financials.platformCommission,
      refunds: financials.refundsDeductions,
      netAmountPayable: financials.netPayable,
      totalPayoutsCompleted: financials.totalDisbursed,
      outstandingPayableBalance: financials.pendingSettlement
    };
    printCentreStatement(activeCentre, filteredLedger, myPayouts, metrics);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E6EDE2] text-[#263D32]">
              Audit Ledger &amp; Earnings
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-500">
              Immutable Financial Ledger
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#263D32] mt-1">
            Financial Dashboard
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Transparent revenue breakdown, platform commissions, escrow holdings, and net settlement ledger for {activeCentre.name}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 bg-[#F7F5EE] hover:bg-[#ECE8DD] text-[#263D32] rounded-xl text-xs font-bold border border-[#DCD6C8] transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Ledger CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-[#263D32] hover:bg-[#1E3228] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Statement
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E5DD] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium">Total Booking Value</span>
            <div className="w-7 h-7 rounded-lg bg-[#E6EDE2] flex items-center justify-center text-[#263D32]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-[#263D32]">
            {formatPrice(financials.totalBookingValue)}
          </div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center">
            <span>Collected: {formatPrice(financials.collectedRevenue)}</span>
          </div>
        </div>

        {/* Platform Commission */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E5DD] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium">Platform Fee (10%)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-amber-900">
            {formatPrice(financials.platformCommission)}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Marketing, verification &amp; escrow fee
          </div>
        </div>

        {/* Net Payable */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E5DD] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium">Net Payable to Centre</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-700">
            {formatPrice(financials.netPayable)}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Gross minus verified commissions
          </div>
        </div>

        {/* Pending Settlements */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E5DD] shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium">Pending Settlement</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-blue-900">
            {formatPrice(financials.pendingSettlement)}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Disbursed so far: {formatPrice(financials.totalDisbursed)}
          </div>
        </div>
      </div>

      {/* Escrow & Payment Protection Transparency Banner */}
      <div className="bg-gradient-to-r from-[#263D32] to-[#3B5446] rounded-2xl p-5 text-[#F7F5EE] shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <h4 className="font-serif font-bold text-sm text-[#F7F5EE]">
              Escrow Security &amp; Settlement Guarantee
            </h4>
          </div>
          <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
            All customer course deposits are held securely in the Yoga Connect India trust escrow account. Payouts are reconciled and transferred directly to your centre's registered bank account after course arrival verification.
          </p>
        </div>

        {onRaiseQuery && (
          <button
            onClick={onRaiseQuery}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#F7F5EE] border border-white/20 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
          >
            Raise Financial Inquiry
          </button>
        )}
      </div>

      {/* Detailed Ledger Transaction Table */}
      <div className="bg-white rounded-2xl border border-[#E2E5DD] shadow-sm overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-serif font-bold text-base text-[#263D32]">
            Double-Entry Accounting Ledger
          </h3>

          <div className="flex items-center space-x-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transaction or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="booking_charge">Booking Charge</option>
              <option value="platform_commission">Platform Commission</option>
              <option value="payout">Payout</option>
              <option value="refund">Refund</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </div>
        </div>

        {filteredLedger.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No financial entries matching the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EE] text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-[#E2E5DD]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Debit (-)</th>
                  <th className="py-2.5 px-3 text-right">Credit (+)</th>
                  <th className="py-2.5 px-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5DD]">
                {filteredLedger.map(entry => {
                  const amt = entry.amountUSD ?? entry.amount ?? 0;
                  const isCredit = entry.entryDirection === 'credit';
                  const isDebit = entry.entryDirection === 'debit';

                  return (
                    <tr key={entry.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-2.5 px-3 text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-gray-600">
                        {entry.id.slice(0, 10)}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-800">
                        {entry.description}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F7F5EE] text-gray-600 border border-[#E2E5DD]">
                          {entry.entryType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-rose-600">
                        {isDebit ? `-${formatPrice(Math.abs(amt))}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                        {isCredit ? `+${formatPrice(amt)}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#263D32]">
                        {formatPrice(entry.runningBalanceUSD ?? amt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
