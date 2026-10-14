'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Printer, 
  HelpCircle, 
  ShieldCheck, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  X,
  Send
} from 'lucide-react';
import { PayoutRecord, YogaCentre, FinancialQuery } from '../../../types';

interface VendorSettlementsTabProps {
  activeCentre: YogaCentre;
  payouts: PayoutRecord[];
  formatPrice: (amount: number) => string;
  onRaiseQuery: (subject: string, message: string) => Promise<void>;
}

export const VendorSettlementsTab: React.FC<VendorSettlementsTabProps> = ({
  activeCentre,
  payouts,
  formatPrice,
  onRaiseQuery
}) => {
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [querySubject, setQuerySubject] = useState('');
  const [queryMessage, setQueryMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [querySuccess, setQuerySuccess] = useState('');

  // Strict isolation: only payouts for activeCentre
  const myPayouts = payouts.filter(p => p.centreId === activeCentre.id);

  const totalDisbursed = myPayouts
    .filter(p => p.status === 'processed')
    .reduce((sum, p) => sum + (p.amountUSD ?? p.netPayoutAmount ?? 0), 0);

  const totalPending = myPayouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (p.amountUSD ?? p.netPayoutAmount ?? 0), 0);

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!querySubject.trim() || !queryMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await onRaiseQuery(querySubject, queryMessage);
      setQuerySuccess('Your settlement inquiry has been logged with the finance desk.');
      setTimeout(() => {
        setQuerySuccess('');
        setIsQueryModalOpen(false);
        setQuerySubject('');
        setQueryMessage('');
      }, 2500);
    } catch (err: any) {
      alert(`Failed to send inquiry: ${err.message || 'Error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E6EDE2] text-[#263D32]">
              Bank Remittances
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-500">
              Direct Account Settlement
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#263D32] mt-1">
            Settlement Batches &amp; Payouts
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Verified payouts transferred to {activeCentre.name}'s designated bank account with official banking reference codes.
          </p>
        </div>

        <button
          onClick={() => setIsQueryModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-[#F7F5EE] hover:bg-[#ECE8DD] text-[#263D32] rounded-xl text-xs font-bold border border-[#DCD6C8] transition-colors shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5 mr-1.5" /> Raise Settlement Inquiry
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E2E5DD] shadow-sm">
          <span className="text-xs font-medium text-gray-500 block mb-1">Total Remitted (Lifetime)</span>
          <div className="text-2xl font-serif font-bold text-[#263D32]">
            {formatPrice(totalDisbursed)}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {myPayouts.filter(p => p.status === 'processed').length} completed wire transfers
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E2E5DD] shadow-sm">
          <span className="text-xs font-medium text-gray-500 block mb-1">In Next Payout Cycle</span>
          <div className="text-2xl font-serif font-bold text-blue-900">
            {formatPrice(totalPending)}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Processed bi-weekly on the 1st &amp; 15th
          </p>
        </div>

        <div className="bg-[#FAF9F5] rounded-2xl p-5 border border-[#E2E5DD] shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#263D32] flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-1 text-[#536B50]" /> Registered Remittance Account
            </span>
            <p className="text-xs text-gray-600 mt-1">
              Bank: <span className="font-semibold text-gray-800">{activeCentre.bankAccountDetails?.bankName || 'State Bank of India'}</span>
            </p>
            <p className="text-[11px] text-gray-500">
              A/C: <span className="font-mono">{activeCentre.bankAccountDetails?.accountNumber || '•••••••• 4092'}</span> (IFSC: {activeCentre.bankAccountDetails?.ifscCode || 'SBIN0001234'})
            </p>
          </div>
          <div className="text-[10px] text-emerald-700 font-bold flex items-center mt-2">
            <CheckCircle2 className="w-3 h-3 mr-1" /> KYC &amp; Bank Verified
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-2xl border border-[#E2E5DD] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E2E5DD]">
          <h3 className="font-serif font-bold text-base text-[#263D32]">
            Remittance History &amp; Bank References
          </h3>
        </div>

        {myPayouts.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No bank settlements recorded yet. Once bookings conclude and the bi-weekly cycle closes, settlement slips will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EE] text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-[#E2E5DD]">
                <tr>
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Bank Ref / UTR</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Advice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5DD]">
                {myPayouts.map(payout => (
                  <tr key={payout.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-gray-600">
                      {payout.id.slice(0, 12)}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {new Date(payout.scheduledDate || payout.processedAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {payout.bankReference ? (
                        <span className="font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {payout.bankReference}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Pending Bank UTR</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#263D32]">
                      {formatPrice(payout.amountUSD ?? payout.netPayoutAmount ?? 0)}
                    </td>
                    <td className="py-3 px-4">
                      {payout.status === 'processed' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Settled
                        </span>
                      ) : payout.status === 'pending' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                          <Clock className="w-3 h-3 mr-1 text-blue-600" /> Scheduled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <AlertCircle className="w-3 h-3 mr-1 text-amber-600" /> Under Audit
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => window.print()}
                        className="px-2.5 py-1 bg-white hover:bg-gray-50 text-[#536B50] rounded border border-[#A5B89A]/50 text-xs font-semibold shadow-sm inline-flex items-center"
                      >
                        <Printer className="w-3 h-3 mr-1" /> Advice Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Raise Inquiry Modal */}
      {isQueryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#DCD6C8] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#263D32] text-white p-6 relative">
              <button
                onClick={() => setIsQueryModalOpen(false)}
                className="absolute top-5 right-5 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-serif font-bold text-[#F7F5EE]">
                Raise Settlement Query
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Direct inquiry to Yoga Connect India financial settlement team.
              </p>
            </div>

            <form onSubmit={handleSendQuery} className="p-6 space-y-4 text-xs">
              {querySuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                  <span className="font-medium">{querySuccess}</span>
                </div>
              )}

              <div>
                <label className="font-bold text-[#263D32] block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTR tracking inquiry for October Batch #4"
                  value={querySubject}
                  onChange={(e) => setQuerySubject(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                />
              </div>

              <div>
                <label className="font-bold text-[#263D32] block mb-1">Detailed Explanation</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify the reservation ID, expected remittance amount, or bank details update requested..."
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsQueryModalOpen(false)}
                  className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-medium border border-[#DCD6C8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#536B50] hover:bg-[#263D32] text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
