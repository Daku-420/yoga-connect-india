'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Key, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  LogOut, 
  Save, 
  Lock, 
  Mail, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { YogaCentre } from '../../../types';
import { supabase } from '../../../lib/supabase';

interface VendorSettingsTabProps {
  activeCentre: YogaCentre;
  userEmail?: string;
  onUpdateCentreProfile: (centreId: string, updates: Partial<YogaCentre>) => Promise<void>;
  onLogout: () => void;
}

export const VendorSettingsTab: React.FC<VendorSettingsTabProps> = ({
  activeCentre,
  userEmail,
  onUpdateCentreProfile,
  onLogout
}) => {
  // Bank Account State
  const [bankName, setBankName] = useState(activeCentre.bankAccountDetails?.bankName || '');
  const [accountHolder, setAccountHolder] = useState(activeCentre.bankAccountDetails?.accountHolder || activeCentre.bankAccountDetails?.accountHolderName || activeCentre.name);
  const [accountNumber, setAccountNumber] = useState(activeCentre.bankAccountDetails?.accountNumber || activeCentre.bankAccountDetails?.accountNumberMasked || '');
  const [ifscCode, setIfscCode] = useState(activeCentre.bankAccountDetails?.ifscCode || activeCentre.bankAccountDetails?.ifscOrSwift || '');
  const [swiftCode, setSwiftCode] = useState(activeCentre.bankAccountDetails?.swiftCode || '');
  const [branch, setBranch] = useState(activeCentre.bankAccountDetails?.branch || '');

  const [isSavingBank, setIsSavingBank] = useState(false);
  const [bankSaveSuccess, setBankSaveSuccess] = useState(false);

  // Password reset request state
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBank(true);
    setBankSaveSuccess(false);

    try {
      await onUpdateCentreProfile(activeCentre.id, {
        bankAccountDetails: {
          bankName,
          accountHolder,
          accountNumber,
          ifscCode,
          swiftCode,
          branch
        }
      });

      setBankSaveSuccess(true);
      setTimeout(() => setBankSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(`Failed to save bank details: ${err.message || 'Error occurred'}`);
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleRequestPasswordReset = async () => {
    if (!userEmail) return;
    setIsSendingReset(true);
    setResetMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/?view=centre_dashboard&mode=reset_password`
      });

      if (error) throw error;
      setResetMessage(`Password reset link sent to ${userEmail}. Please check your inbox.`);
    } catch (err: any) {
      setResetMessage(`Error sending reset email: ${err.message}`);
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E6EDE2] text-[#263D32]">
              Security &amp; Settlements
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-500">
              Centre ID: {activeCentre.id}
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#263D32] mt-1">
            Account &amp; Security Settings
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Manage your verified banking details for payout disbursements, session access, and password recovery.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out of Centre
        </button>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm space-y-4 text-xs">
        <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center">
          <Building2 className="w-4 h-4 mr-2 text-[#536B50]" /> Active Vendor Account
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F7F5EE] p-4 rounded-xl border border-[#E2E5DD]">
          <div>
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Assigned Yoga Centre</span>
            <span className="font-bold text-[#263D32] text-sm mt-0.5 block">{activeCentre.name}</span>
          </div>

          <div>
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Authenticated Email</span>
            <span className="font-medium text-gray-700 flex items-center mt-0.5">
              <Mail className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {userEmail || 'Active Vendor Session'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Account Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mt-0.5">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> Verified Partner
            </span>
          </div>
        </div>
      </div>

      {/* Bank Settlement Settings */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-[#536B50]" /> Bank Remittance Coordinates
          </h3>
          {bankSaveSuccess && (
            <span className="text-emerald-700 font-bold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Banking Details Updated
            </span>
          )}
        </div>
        <p className="text-gray-500 text-xs">
          Earnings from completed bookings will be disbursed directly to this domestic or international bank account.
        </p>

        <form onSubmit={handleSaveBankDetails} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#263D32] block mb-1">Account Holder Legal Name</label>
              <input
                type="text"
                required
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Full Legal Name on Passbook"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">Bank Name</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. State Bank of India, HDFC Bank"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">Account Number</label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter Full Account Number"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50] font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">IFSC Code (for Indian Banks)</label>
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                placeholder="e.g. SBIN0001234"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50] font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">SWIFT / BIC Code (for International Wire)</label>
              <input
                type="text"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value.toUpperCase())}
                placeholder="e.g. SBININBBXXX"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50] font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">Branch City / Name</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Tapovan Main Branch, Rishikesh"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingBank}
              className="px-5 py-2.5 bg-[#536B50] hover:bg-[#263D32] text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-1.5" />
              {isSavingBank ? 'Saving...' : 'Update Settlement Coordinates'}
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Reset */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm space-y-4 text-xs">
        <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center">
          <Key className="w-4 h-4 mr-2 text-[#536B50]" /> Password &amp; Session Security
        </h3>

        {resetMessage && (
          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-blue-600" />
            <span>{resetMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]">
          <div>
            <h4 className="font-bold text-[#263D32]">Reset Vendor Password</h4>
            <p className="text-gray-500 text-xs mt-0.5">
              Send a secure password recovery link to your registered account email ({userEmail || 'your email'}).
            </p>
          </div>
          <button
            onClick={handleRequestPasswordReset}
            disabled={isSendingReset}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-[#263D32] rounded-xl font-bold text-xs border border-[#DCD6C8] transition-colors shadow-sm whitespace-nowrap"
          >
            {isSendingReset ? 'Dispatching Link...' : 'Email Reset Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
