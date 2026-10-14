'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { YogaInstructor } from '../../types';
import { 
  X, 
  Calendar, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  Mail, 
  Phone, 
  User, 
  ShieldCheck, 
  Clock, 
  ArrowRight 
} from 'lucide-react';

interface InstructorEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructor: YogaInstructor | null;
}

export const InstructorEnquiryModal: React.FC<InstructorEnquiryModalProps> = ({
  isOpen,
  onClose,
  instructor
}) => {
  const { 
    currentUser, 
    userProfile, 
    submitTeachingEnquiry, 
    formatPrice 
  } = useApp();

  const [customerName, setCustomerName] = useState(userProfile?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(userProfile?.email || currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [sessionType, setSessionType] = useState('1-on-1 Private Yoga');
  const [requestedDates, setRequestedDates] = useState('');
  const [participantsCount, setParticipantsCount] = useState(1);
  const [message, setMessage] = useState('');
  const [sessionFee, setSessionFee] = useState(instructor?.hourlyRateUSD || 45);

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !instructor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await submitTeachingEnquiry({
        instructorId: instructor.id,
        instructorName: instructor.fullName,
        customerName: customerName || 'Practitioner',
        customerEmail: customerEmail || 'practitioner@example.com',
        customerPhone,
        sessionType,
        requestedDates: requestedDates || 'Flexible dates',
        participantsCount,
        message: message || `Enquiry for ${sessionType} session with ${instructor.fullName}.`,
        sessionFee: Number(sessionFee) || instructor.hourlyRateUSD || 45
      });

      if (res.success && res.enquiryId) {
        setSubmittedRef(res.enquiryId);
      } else {
        setError(res.error || 'Failed to submit teaching enquiry.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error transmitting enquiry.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedRef(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-[#E2E5DD] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-[#263D32] text-white flex items-center justify-between border-b border-[#1E3228] sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-gold-300" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">Book Teaching Session</h2>
              <p className="text-xs text-[#A5B89A]">with {instructor.fullName}</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {submittedRef ? (
            <div className="text-center py-6 space-y-5 animate-in fade-in">
              <div className="w-16 h-16 bg-[#E6EDE2] text-[#286749] rounded-full flex items-center justify-center mx-auto border border-[#286749]/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] bg-[#E6EDE2] text-[#286749] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#286749]/30">
                  Enquiry Dispatched
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#263D32]">Teaching Enquiry Sent</h3>
                <p className="text-xs text-[#59665C] max-w-sm mx-auto leading-relaxed">
                  Your session request has been transmitted directly to <strong>{instructor.fullName}</strong>. Reference ID: <span className="font-mono font-bold text-[#263D32]">{submittedRef}</span>.
                </p>
              </div>

              <div className="bg-[#F7F5EE] p-4 rounded-2xl border border-[#E2E5DD] text-left text-xs space-y-2">
                <div className="flex justify-between text-[#59665C]">
                  <span>Instructor:</span>
                  <span className="font-semibold text-[#263D32]">{instructor.fullName}</span>
                </div>
                <div className="flex justify-between text-[#59665C]">
                  <span>Session Type:</span>
                  <span className="font-semibold text-[#263D32]">{sessionType}</span>
                </div>
                <div className="flex justify-between text-[#59665C]">
                  <span>Estimated Fee:</span>
                  <span className="font-semibold text-[#286749]">{formatPrice(sessionFee)}</span>
                </div>
                <div className="flex justify-between text-[#59665C]">
                  <span>Status:</span>
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Awaiting Instructor Review</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-3 px-4 rounded-xl transition cursor-pointer shadow-sm"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Instructor Snapshot */}
              <div className="p-3.5 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#263D32] text-sm">{instructor.fullName}</h4>
                  <p className="text-[11px] text-[#59665C]">{instructor.city}, {instructor.state} • {instructor.yearsOfExperience} Yrs Exp</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#59665C] uppercase block font-semibold">Standard Rate</span>
                  <span className="font-serif font-bold text-[#263D32] text-base">{formatPrice(instructor.hourlyRateUSD || 45)}/session</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                  {error}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[#263D32] font-semibold mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8E9B91] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full pl-9 pr-3 py-2 border border-[#E2E5DD] rounded-xl focus:outline-hidden focus:border-[#536B50] bg-white text-[#263D32]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#263D32] font-semibold mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8E9B91] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-9 pr-3 py-2 border border-[#E2E5DD] rounded-xl focus:outline-hidden focus:border-[#536B50] bg-white text-[#263D32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#263D32] font-semibold mb-1">Phone Number (with Code)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8E9B91] absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 border border-[#E2E5DD] rounded-xl focus:outline-hidden focus:border-[#536B50] bg-white text-[#263D32]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#263D32] font-semibold mb-1">Session Type *</label>
                    <select
                      value={sessionType}
                      onChange={e => setSessionType(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E2E5DD] rounded-xl focus:outline-hidden focus:border-[#536B50] bg-white text-[#263D32]"
                    >
                      <option value="1-on-1 Private Yoga">1-on-1 Private Yoga</option>
                      <option value="Small Group Session">Small Group Session</option>
                      <option value="Online Video Class">Online Video Class</option>
                      <option value="Retreat Masterclass">Retreat Masterclass</option>
                      <option value="Pranayama & Meditation">Pranayama &amp; Meditation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#263D32] font-semibold mb-1">Participants</label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-[#8E9B91] absolute left-3 top-2.5" />
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={participantsCount}
                        onChange={e => setParticipantsCount(Number(e.target.value) || 1)}
                        className="w-full pl-9 pr-3 py-2 border border-[#E2E5DD] rounded-xl focus:outline-hidden focus:border-[#536B50] bg-white text-[#263D32]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#263D32] font-semibold mb-1">Preferred Date(s)</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#8E9B91] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={requestedDates}
                        onChange={e => setRequestedDates(e.target.value)}
                        placeholder="e.g. Oct 20-22, 2026 or Weekends"
                        className="w-full pl-9 pr-3 py-2 border border-[#E2E5DD] rounded-xl focus:outline-hidden focus:border-[#536B50] bg-white text-[#263D32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#263D32] font-semibold mb-1">Session Fee (USD)</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-[#8E9B91] absolute left-3 top-2.5" />
                      <input
                        type="number"
                        min="10"
                        value={sessionFee}
                        onChange={e => setSessionFee(Number(e.target.value) || 0)}
                        className="w-full pl-9 pr-3 py-2 border border-[#E2E5DD] rounded-xl focus:outline-hidden focus:border-[#536B50] bg-white text-[#263D32]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#263D32] font-semibold mb-1">Message or Specific Goals</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your yoga background, injuries, or what you hope to achieve in this session..."
                    className="w-full px-3 py-2 border border-[#E2E5DD] rounded-xl focus:outline-hidden focus:border-[#536B50] bg-white text-[#263D32] resize-none"
                  />
                </div>
              </div>

              {/* Direct Booking Notice */}
              <div className="p-3 bg-[#E6EDE2]/50 border border-[#A5B89A]/30 rounded-xl flex items-start space-x-2 text-[11px] text-[#263D32]">
                <ShieldCheck className="w-4 h-4 text-[#536B50] shrink-0 mt-0.5" />
                <p>
                  Your enquiry will be sent directly to <strong>{instructor.fullName}</strong>. The instructor will contact you to confirm timing, venue/link, and payment details.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <span>{loading ? 'Submitting Enquiry...' : 'Submit Teaching Enquiry'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
