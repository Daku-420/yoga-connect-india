import React, { useState } from 'react';
import { useApp, CURRENCY_CONFIGS } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Home, 
  Plane, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    selectedCentreId, 
    selectedCourseId, 
    centres, 
    courses, 
    currency, 
    formatPrice,
    createBookingRequest,
    setActiveView,
    setUserRole,
    userProfile,
    setIsAuthModalOpen
  } = useApp();

  const [step, setStep] = useState(1);

  const centre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const centreCourses = courses.filter(c => c.centreId === centre.id);
  const initialCourse = courses.find(c => c.id === selectedCourseId) || centreCourses[0] || courses[0];

  const [selectedCourse, setSelectedCourse] = useState(initialCourse);
  const [startDate, setStartDate] = useState(initialCourse?.upcomingDates[0] || 'Oct 1, 2026');
  const [participantsCount, setParticipantsCount] = useState(1);
  const [roomType, setRoomType] = useState(centre?.accommodationTypes?.[0] || 'Private Deluxe Ashram Room');
  const [airportPickup, setAirportPickup] = useState(true);

  // Customer Contact Details (Pre-populated if user is logged in)
  const [customerName, setCustomerName] = useState(userProfile?.fullName || '');
  const [customerEmail, setCustomerEmail] = useState(userProfile?.email || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [customerCountry, setCustomerCountry] = useState(userProfile?.country || 'United States');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'wise' | 'applepay' | 'card'>('stripe');

  const [createdRef, setCreatedRef] = useState<string | null>(null);

  // Sync when user logs in
  React.useEffect(() => {
    if (userProfile) {
      if (userProfile.fullName && !customerName) setCustomerName(userProfile.fullName);
      if (userProfile.email && !customerEmail) setCustomerEmail(userProfile.email);
    }
  }, [userProfile]);

  if (!isBookingModalOpen) return null;

  const totalPackageUSD = (selectedCourse ? selectedCourse.priceUSD : 1250) * participantsCount;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const newReq = createBookingRequest({
      centreId: centre.id,
      centreName: centre.name,
      courseId: selectedCourse ? selectedCourse.id : 'course-1',
      courseTitle: selectedCourse ? selectedCourse.title : 'Himalayan Retreat',
      startDate,
      durationDays: selectedCourse ? selectedCourse.durationDays : 14,
      participantsCount,
      roomType,
      airportPickup,
      totalUSD: totalPackageUSD,
      currencyPaid: currency,
      customerName: customerName || 'Traveler Name',
      customerEmail: customerEmail || 'traveler@example.com',
      customerPhone: customerPhone || '+1 555-0192',
      customerCountry: customerCountry || 'United States',
      specialRequests
    });

    setCreatedRef(newReq.referenceCode);
    setStep(5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F7F5EE] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#E2E5DD] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E2E5DD] bg-white sticky top-0 z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-[#286749] font-semibold mb-0.5">
              <ShieldCheck className="w-4 h-4 text-[#286749]" />
              <span>100% Escrow Admin Protection Active</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-[#263D32]">
              Submit Enquiry Request — {centre.name}
            </h3>
          </div>

          <button 
            onClick={() => setIsBookingModalOpen(false)}
            className="p-1.5 text-[#59665C] hover:text-[#263D32] rounded-full hover:bg-[#E6EDE2] transition"
            aria-label="Close enquiry modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Steps 1 to 4) */}
        {step < 5 && (
          <div className="bg-[#E6EDE2] px-6 py-2.5 border-b border-[#E2E5DD] flex items-center justify-between text-xs font-semibold text-[#263D32]">
            <span>Step {step} of 4: {
              step === 1 ? 'Program & Batch Dates' :
              step === 2 ? 'Room & Airport Transfer' :
              step === 3 ? 'Traveler Contact Info' : 'Deposit & Payment Method'
            }</span>
            <div className="flex space-x-1.5">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`w-6 h-1.5 rounded-full transition-colors ${step >= s ? 'bg-[#536B50]' : 'bg-[#D4E0CE]'}`} />
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Program & Batch Selection */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 text-sm text-[#252C27]">
            <div className="space-y-3">
              <label className="font-semibold text-[#263D32] text-xs uppercase tracking-wider block">
                Select Retreat or Teacher Training
              </label>
              <div className="space-y-2">
                {centreCourses.map(course => (
                  <div 
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setStartDate(course.upcomingDates[0] || 'Oct 1, 2026');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      selectedCourse?.id === course.id
                        ? 'bg-white border-[#536B50] ring-1 ring-[#536B50] shadow-sm'
                        : 'bg-white border-[#E2E5DD] hover:bg-[#F7F5EE]'
                    }`}
                  >
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#263D32]">{course.title}</h4>
                      <p className="text-xs text-[#59665C]">{course.durationDays} Days • {course.certification}</p>
                    </div>
                    <span className="font-serif font-bold text-lg text-[#263D32]">
                      {formatPrice(course.priceUSD)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Dates */}
            <div className="space-y-2">
              <label className="font-semibold text-[#263D32] text-xs uppercase tracking-wider block">
                Select Starting Batch Date
              </label>
              <select
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-[#E2E5DD] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
              >
                {selectedCourse?.upcomingDates.map((date, i) => (
                  <option key={i} value={date}>{date}</option>
                ))}
              </select>
            </div>

            {/* Participants */}
            <div className="space-y-2">
              <label className="font-semibold text-[#263D32] text-xs uppercase tracking-wider block">
                Number of Travelers / Students
              </label>
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setParticipantsCount(n)}
                    className={`w-12 h-10 rounded-xl border text-sm font-semibold transition ${
                      participantsCount === n
                        ? 'bg-[#536B50] text-white border-[#536B50]'
                        : 'bg-white text-[#252C27] border-[#E2E5DD] hover:bg-[#E6EDE2]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Room & Transfer */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 text-sm text-[#252C27]">
            <div className="space-y-3">
              <label className="font-semibold text-[#263D32] text-xs uppercase tracking-wider block">
                Himalayan Accommodation Type
              </label>
              <div className="space-y-2">
                {centre.accommodationTypes.map((type, i) => (
                  <div 
                    key={i}
                    onClick={() => setRoomType(type)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      roomType === type
                        ? 'bg-white border-[#536B50] ring-1 ring-[#536B50] shadow-sm'
                        : 'bg-white border-[#E2E5DD] hover:bg-[#F7F5EE]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Home className="w-5 h-5 text-[#536B50]" />
                      <span className="font-medium text-sm text-[#252C27]">{type}</span>
                    </div>
                    <span className="text-xs text-[#59665C]">Included in tuition</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Airport Pickup Option */}
            <div className="p-5 bg-white rounded-xl border border-[#E2E5DD] space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={airportPickup}
                  onChange={(e) => setAirportPickup(e.target.checked)}
                  className="rounded text-[#536B50] focus:ring-[#536B50] w-4 h-4 mt-0.5"
                />
                <div>
                  <span className="font-semibold text-sm text-[#263D32] block">
                    Include Airport Private Transfer (Dehradun DED)
                  </span>
                  <p className="text-xs text-[#59665C] mt-0.5">
                    Our verified ashram driver meets you with a nameboard at Dehradun Jolly Grant Airport or Haridwar railway terminal.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Traveler Contact Information */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-4 flex-1 text-sm text-[#252C27]">
            <div className="p-4 bg-[#E6EDE2] rounded-xl border border-[#D4E0CE] text-xs text-[#263D32] flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#286749] shrink-0 mt-0.5" />
              <span>
                <strong>Confidential Lead Protection:</strong> Your contact details are stored securely and reviewed exclusively by the Platform Admin. Yoga ashrams do not receive your email/phone directly.
              </span>
            </div>

            {!userProfile && (
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E2E5DD] text-xs">
                <span className="text-[#59665C]">Already have an account?</span>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[#536B50] font-bold hover:underline cursor-pointer"
                >
                  Sign In with Gmail / OTP to auto-fill →
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#263D32] block">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Eleanor Vance" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-[#E2E5DD] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#263D32] block">Email Address *</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. eleanor@example.com" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-white border border-[#E2E5DD] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#263D32] block">WhatsApp / Phone *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+1 (555) 0192" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-[#E2E5DD] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#263D32] block">Country of Residence *</label>
                <select
                  value={customerCountry}
                  onChange={(e) => setCustomerCountry(e.target.value)}
                  className="w-full bg-white border border-[#E2E5DD] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="India">India</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#263D32] block">Special Dietary or Practice Requests (Optional)</label>
              <textarea 
                rows={3}
                placeholder="Mention any food allergies, injuries, or Indian visa questions..." 
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full bg-white border border-[#E2E5DD] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Payment Method Choice */}
        {step === 4 && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 text-sm text-[#252C27]">
            <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] space-y-2">
              <div className="flex justify-between items-baseline text-xs text-[#59665C]">
                <span>Total Package Tuition & Stay ({participantsCount} Guest{participantsCount > 1 ? 's' : ''})</span>
                <span className="font-serif font-bold text-2xl text-[#263D32]">
                  {formatPrice(totalPackageUSD)}
                </span>
              </div>
              <p className="text-[11px] text-[#59665C]">
                Payment will be processed via secure Admin Escrow upon availability confirmation.
              </p>
            </div>

            <div className="space-y-3">
              <label className="font-semibold text-[#263D32] text-xs uppercase tracking-wider block">
                Preferred Secure Payment Method
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'stripe', label: 'Credit / Debit Card (Stripe)', desc: 'Visa, Mastercard, Amex' },
                  { id: 'paypal', label: 'PayPal Global', desc: 'Instant buyer protection' },
                  { id: 'wise', label: 'Wise Bank Transfer', desc: 'Zero conversion fee transfer' },
                  { id: 'applepay', label: 'Apple Pay / Google Pay', desc: 'One-touch biometric checkout' },
                ].map(p => (
                  <div
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === p.id
                        ? 'bg-white border-[#536B50] ring-1 ring-[#536B50]'
                        : 'bg-white border-[#E2E5DD] hover:bg-[#F7F5EE]'
                    }`}
                  >
                    <span className="font-semibold text-xs text-[#263D32] block">{p.label}</span>
                    <span className="text-[11px] text-[#59665C] block mt-0.5">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#E6EDE2] rounded-xl border border-[#D4E0CE] text-xs text-[#263D32] space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#286749]" />
                <span>Notice Regarding Confirmation:</span>
              </div>
              <p className="text-[11px] text-[#59665C] leading-relaxed">
                Submitting this request does not charge your card immediately. It creates a verified escrow reservation request that is confirmed after ashram seat verification within 24 hours.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation Success Screen */}
        {step === 5 && (
          <div className="p-8 sm:p-12 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-full bg-[#E6EDE2] text-[#286749] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32]">
                Enquiry Request Received
              </h3>
              <p className="text-xs text-[#59665C] leading-relaxed">
                Your reservation reference code is <strong className="text-[#263D32] font-mono">{createdRef}</strong>. Our Platform Admin team has received your details and is validating seat availability with the ashram admissions coordinator.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] max-w-md w-full text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#59665C]">Centre:</span>
                <span className="font-semibold text-[#263D32]">{centre.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#59665C]">Start Date:</span>
                <span className="font-semibold text-[#263D32]">{startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#59665C]">Estimated Total:</span>
                <span className="font-semibold text-[#263D32]">{formatPrice(totalPackageUSD)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#59665C]">Escrow Protection:</span>
                <span className="font-semibold text-[#286749]">Active</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setUserRole('user');
                  setActiveView('user-dashboard');
                  setIsBookingModalOpen(false);
                }}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-sm transition"
              >
                View in Traveler Portal
              </button>

              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="bg-white hover:bg-[#E6EDE2] text-[#263D32] border border-[#E2E5DD] text-xs font-semibold px-6 py-3 rounded-xl transition"
              >
                Close & Return Home
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="p-6 border-t border-[#E2E5DD] bg-white sticky bottom-0 z-10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="text-xs font-semibold text-[#59665C] hover:text-[#263D32] flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-6 py-3 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitBooking}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-7 py-3 rounded-xl transition flex items-center space-x-1.5 shadow-sm"
              >
                <span>Submit Protected Enquiry</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
