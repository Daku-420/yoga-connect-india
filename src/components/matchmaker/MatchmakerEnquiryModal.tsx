import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { YogaCentre, Course } from '../../types';
import { 
  X, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  Users, 
  Mail, 
  User, 
  Phone, 
  MessageSquare, 
  Sparkles,
  Building2
} from 'lucide-react';

interface MatchmakerEnquiryModalProps {
  centre: YogaCentre;
  recommendedCourse: Course;
  userAnswers: Record<string, any>;
  onClose: () => void;
}

export const MatchmakerEnquiryModal: React.FC<MatchmakerEnquiryModalProps> = ({
  centre,
  recommendedCourse,
  userAnswers,
  onClose
}) => {
  const { submitMatchmakerEnquiry, formatPrice } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState('');
  const [preferredDates, setPreferredDates] = useState(recommendedCourse.upcomingDates[0] || 'Upcoming Intake 2026-2027');
  const [participantsCount, setParticipantsCount] = useState(1);
  const [message, setMessage] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [honeypot, setHoneypot] = useState(''); // spam protection

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedRefCode, setGeneratedRefCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Spam check
    if (honeypot) {
      return;
    }

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMessage('Please provide your name and email address.');
      return;
    }

    if (!customerEmail.includes('@') || !customerEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!consentAgreed) {
      setErrorMessage('Please confirm your consent for the centre to contact you.');
      return;
    }

    // Submit lead
    const newLead = submitMatchmakerEnquiry({
      centreId: centre.id,
      centreName: centre.name,
      recommendedCourseId: recommendedCourse.id,
      recommendedCourseTitle: recommendedCourse.title,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerWhatsApp: customerWhatsApp.trim() || undefined,
      preferredDates,
      participantsCount,
      message: message.trim() || undefined,
      summaryPreferences: {
        preferredStyle: recommendedCourse.category,
        budgetUSD: recommendedCourse.priceUSD,
        durationDays: recommendedCourse.durationDays
      },
      rawAnswers: userAnswers
    });

    setGeneratedRefCode(newLead.referenceCode);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263D32]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E2E5DD] shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#59665C] hover:text-[#252C27] bg-[#F7F5EE] p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="space-y-2">
              <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block border border-[#A5B89A]/40">
                Direct Centre Inquiry
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#263D32]">
                Contact {centre.name}
              </h2>
              <p className="text-xs text-[#59665C]">
                Your personalized questionnaire answers will be attached so the admissions teachers understand your background and goals.
              </p>
            </div>

            {/* Recommended Offering Context Summary */}
            <div className="p-4 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#536B50]">
                <span>Selected Offering:</span>
                <span className="text-[#263D32] font-serif font-bold">{formatPrice(recommendedCourse.priceUSD)}</span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#263D32]">
                {recommendedCourse.title}
              </h3>
              <div className="flex flex-wrap gap-3 text-[11px] text-[#59665C]">
                <span>Duration: <strong>{recommendedCourse.durationDays} Days</strong></span>
                <span>•</span>
                <span>Certification: <strong>{recommendedCourse.certification}</strong></span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Anti-spam honeypot (hidden from human users) */}
              <input
                type="text"
                name="user_organization_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#252C27] block mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#59665C] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-[#E2E5DD] rounded-xl text-xs focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#252C27] block mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#59665C] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="maya@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-[#E2E5DD] rounded-xl text-xs focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#252C27] block mb-1">
                    WhatsApp Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#59665C] absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={customerWhatsApp}
                      onChange={(e) => setCustomerWhatsApp(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-[#E2E5DD] rounded-xl text-xs focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#252C27] block mb-1">
                    Number of Participants
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-[#59665C] absolute left-3 top-3" />
                    <select
                      value={participantsCount}
                      onChange={(e) => setParticipantsCount(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 border border-[#E2E5DD] rounded-xl text-xs focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none bg-white cursor-pointer"
                    >
                      <option value={1}>1 Person (Solo Traveler)</option>
                      <option value={2}>2 Persons (Couple / Friends)</option>
                      <option value={3}>3 Persons (Small Group)</option>
                      <option value={4}>4+ Persons (Group Inquiry)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#252C27] block mb-1">
                  Preferred Intake Dates / Month
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#59665C] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={preferredDates}
                    onChange={(e) => setPreferredDates(e.target.value)}
                    placeholder="e.g. October 15 – November 5, 2026"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#E2E5DD] rounded-xl text-xs focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#252C27] block mb-1">
                  Questions for the Ashram / Specific Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Traveling from Australia, inquiring about airport taxi pickup from Dehradun and vegan meal options."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-[#E2E5DD] rounded-xl text-xs focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none"
                />
              </div>

              {/* Privacy Consent */}
              <div className="p-3 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] space-y-2">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-[#E2E5DD] text-[#536B50] focus:ring-[#536B50]"
                  />
                  <span className="text-[11px] text-[#59665C] leading-snug">
                    I agree to share my inquiry details and questionnaire answers with <strong>{centre.name}</strong>. YogaConnect India guarantees zero commercial spam.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#536B50] hover:bg-[#40563E] text-white font-medium py-3.5 rounded-xl text-xs shadow-sm transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Structured Enquiry to {centre.name.split(' ')[0]}</span>
              </button>

              <p className="text-[10px] text-center text-[#59665C]">
                Submitting this inquiry does not require immediate payment. Final seat confirmation and deposit will be coordinated via the secure platform escrow system.
              </p>
            </form>

          </div>
        ) : (
          /* Confirmation State */
          <div className="py-6 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#E6EDE2] border-2 border-[#536B50] flex items-center justify-center mx-auto text-[#286749]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="bg-[#E6EDE2] text-[#286749] text-[10px] font-bold px-3 py-1 rounded-full border border-[#286749]/20 uppercase">
                Enquiry Successfully Transmitted
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#263D32]">
                Thank You, {customerName}!
              </h3>
              <p className="text-xs text-[#59665C] max-w-md mx-auto leading-relaxed">
                Your questionnaire responses and direct enquiry have been securely routed to the senior admissions desk at <strong>{centre.name}</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#F7F5EE] rounded-2xl border border-[#E2E5DD] max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-[#E2E5DD] pb-2">
                <span className="text-[#59665C]">Inquiry Reference:</span>
                <span className="font-mono font-bold text-[#263D32]">{generatedRefCode}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#E2E5DD] pb-2">
                <span className="text-[#59665C]">Centre:</span>
                <span className="font-semibold text-[#263D32] truncate max-w-[180px]">{centre.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#59665C]">Recommended Program:</span>
                <span className="font-semibold text-[#263D32] truncate max-w-[180px]">{recommendedCourse.title}</span>
              </div>
            </div>

            <div className="p-3 bg-[#E6EDE2]/60 rounded-xl border border-[#A5B89A]/30 text-[11px] text-[#263D32] max-w-md mx-auto">
              <ShieldCheck className="w-4 h-4 text-[#286749] inline-block mr-1 -mt-0.5" />
              <span>
                <strong>Next Step:</strong> The ashram coordinator will review seat availability for your dates and reach out to <strong>{customerEmail}</strong> within 24 business hours.
              </span>
            </div>

            <button
              onClick={onClose}
              className="bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold px-8 py-3 rounded-xl shadow-sm transition"
            >
              Done & Return to Profile
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
