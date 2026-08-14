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
  Sparkles
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
    setUserRole
  } = useApp();

  const [step, setStep] = useState(1);

  const centre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const centreCourses = courses.filter(c => c.centreId === centre.id);
  const initialCourse = courses.find(c => c.id === selectedCourseId) || centreCourses[0] || courses[0];

  const [selectedCourse, setSelectedCourse] = useState(initialCourse);
  const [startDate, setStartDate] = useState(initialCourse?.upcomingDates[0] || 'Oct 1, 2026');
  const [participantsCount, setParticipantsCount] = useState(1);
  const [roomType, setRoomType] = useState(centre?.accommodationTypes?.[0] || 'Private Room');
  const [airportPickup, setAirportPickup] = useState(true);

  // Sensitive Customer Contact Data
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCountry, setCustomerCountry] = useState('United States');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'wise' | 'applepay' | 'card'>('stripe');

  const [createdRef, setCreatedRef] = useState<string | null>(null);

  if (!isBookingModalOpen) return null;

  const totalPackageUSD = (selectedCourse ? selectedCourse.priceUSD : 1250) * participantsCount;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const newReq = createBookingRequest({
      centreId: centre.id,
      centreName: centre.name,
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      startDate,
      durationDays: selectedCourse.durationDays,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-sand-50 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-sand-300 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-sand-300 bg-sand-50/95 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1 text-xs text-emerald-700 font-semibold mb-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Escrow Admin Protection Active</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-sage-950">
              Submit Booking Request — {centre.name}
            </h3>
          </div>

          <button 
            onClick={() => setIsBookingModalOpen(false)}
            className="p-1.5 text-sage-500 hover:text-sage-900 rounded-full hover:bg-sand-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="bg-sand-200 px-6 py-2 border-b border-sand-300 flex items-center justify-between text-xs font-semibold text-sage-700">
            <span>Step {step} of 4: {
              step === 1 ? 'Select Program & Batch' :
              step === 2 ? 'Room & Transfer Addons' :
              step === 3 ? 'Traveler Contact Info' : 'Payment Choice'
            }</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`w-6 h-1.5 rounded-full ${step >= s ? 'bg-terracotta-600' : 'bg-sand-300'}`} />
              ))}
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 flex-1 text-sm text-sage-900">
          
          {/* STEP 1: Select Course & Date */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-semibold text-sage-800 text-xs uppercase tracking-wider block">
                  Select Course / Program
                </label>
                <div className="space-y-3">
                  {centreCourses.map(c => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCourse(c)}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        selectedCourse.id === c.id 
                          ? 'border-terracotta-600 bg-white shadow-md ring-2 ring-terracotta-500/20' 
                          : 'border-sand-300 bg-sand-100 hover:bg-white'
                      }`}
                    >
                      <div>
                        <h4 className="font-serif font-bold text-base text-sage-950">{c.title}</h4>
                        <span className="text-xs text-sage-600">{c.durationDays} Days • {c.certification}</span>
                      </div>
                      <span className="font-serif font-bold text-lg text-terracotta-600">
                        {formatPrice(c.priceUSD)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sage-800 text-xs uppercase tracking-wider block">
                  Select Preferred Start Date Intake
                </label>
                <select
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-sand-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-sage-500"
                >
                  {selectedCourse.upcomingDates.map((d, idx) => (
                    <option key={idx} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-sage-900 hover:bg-sage-800 text-white font-medium py-3 rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2"
              >
                <span>Continue to Room & Participants</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Room & Participants */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-semibold text-sage-800 text-xs uppercase tracking-wider block">
                  Number of Travelers / Participants
                </label>
                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-sand-300">
                  <Users className="w-5 h-5 text-terracotta-600" />
                  <select
                    value={participantsCount}
                    onChange={(e) => setParticipantsCount(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                  >
                    <option value={1}>1 Solo Traveler</option>
                    <option value={2}>2 Travelers (Shared / Couple)</option>
                    <option value={3}>3 Travelers Group</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sage-800 text-xs uppercase tracking-wider block">
                  Accommodation Preference
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-white border border-sand-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-sage-500"
                >
                  {centre.accommodationTypes.map((room, idx) => (
                    <option key={idx} value={room}>{room}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-4 rounded-xl border border-sand-300 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Plane className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-bold text-sage-950 text-xs block">Private Airport Transfer Chauffeur</span>
                    <span className="text-[11px] text-sage-600">Pick up from nearest airport directly to ashram</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={airportPickup}
                  onChange={(e) => setAirportPickup(e.target.checked)}
                  className="w-5 h-5 text-terracotta-600 rounded"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="bg-sand-200 hover:bg-sand-300 text-sage-800 font-medium px-4 py-3 rounded-xl text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-sage-900 hover:bg-sage-800 text-white font-medium py-3 rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2"
                >
                  <span>Continue to Contact Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Traveler Contact Info */}
          {step === 3 && (
            <div className="space-y-6">
              
              {/* Privacy Warning Box */}
              <div className="bg-emerald-950 text-emerald-100 p-4 rounded-xl text-xs space-y-1 border border-emerald-800">
                <div className="flex items-center space-x-1.5 text-gold-400 font-bold">
                  <Lock className="w-4 h-4" />
                  <span>PRIVACY GUARANTEE: ADMIN ESCROW</span>
                </div>
                <p className="text-emerald-200 leading-relaxed">
                  Your full name, email, and phone number are sent **ONLY to Platform Admin**. The yoga centre will not receive your contact details until you approve the booking!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-800">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Emma Watson-Smith"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-sand-300 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-800">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="emma@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white border border-sand-300 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-800">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2831"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-sand-300 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-800">Country of Origin *</label>
                  <select
                    value={customerCountry}
                    onChange={(e) => setCustomerCountry(e.target.value)}
                    className="w-full bg-white border border-sand-300 rounded-lg p-2.5 text-sm"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                    <option value="France">France</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Other">Other International Country</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-800">Special Dietary or Medical Requests (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Vegan sattvic meal preference, gluten allergy, ground floor room..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-white border border-sand-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setStep(2)}
                  className="bg-sand-200 hover:bg-sand-300 text-sage-800 font-medium px-4 py-3 rounded-xl text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="w-full bg-sage-900 hover:bg-sage-800 text-white font-medium py-3 rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Payment Overview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Breakdown & Gateways */}
          {step === 4 && (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              
              {/* Order Summary */}
              <div className="bg-white p-4 rounded-xl border border-sand-300 space-y-2">
                <h4 className="font-serif font-bold text-base text-sage-950">Booking Summary</h4>
                <div className="text-xs space-y-1 text-sage-700">
                  <div className="flex justify-between"><span>Course:</span><span className="font-bold text-sage-900">{selectedCourse.title}</span></div>
                  <div className="flex justify-between"><span>Intake Start Date:</span><span className="font-bold text-sage-900">{startDate}</span></div>
                  <div className="flex justify-between"><span>Duration:</span><span>{selectedCourse.durationDays} Days</span></div>
                  <div className="flex justify-between"><span>Room:</span><span>{roomType}</span></div>
                  <div className="flex justify-between"><span>Travelers:</span><span>{participantsCount} Person</span></div>
                  <div className="flex justify-between pt-2 border-t text-sm font-bold text-sage-950">
                    <span>Total Package Amount ({currency}):</span>
                    <span className="text-terracotta-600 font-serif text-xl">{formatPrice(totalPackageUSD)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="font-semibold text-sage-800 text-xs uppercase tracking-wider block">
                  Select International Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'stripe', name: 'Stripe Credit Card' },
                    { id: 'paypal', name: 'PayPal' },
                    { id: 'wise', name: 'Wise Bank Transfer' },
                    { id: 'applepay', name: 'Apple Pay' },
                    { id: 'card', name: 'Debit Card' },
                  ].map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                        paymentMethod === pm.id 
                          ? 'border-terracotta-600 bg-white text-terracotta-600 shadow ring-2 ring-terracotta-500/20' 
                          : 'border-sand-300 bg-sand-100 text-sage-800 hover:bg-white'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{pm.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-sand-200 hover:bg-sand-300 text-sage-800 font-medium px-4 py-3 rounded-xl text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-500 hover:to-terracotta-600 text-white font-serif font-bold py-3.5 rounded-xl text-base shadow-xl transition flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Submit Request ({formatPrice(totalPackageUSD)})</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Success Confirmation */}
          {step === 5 && (
            <div className="text-center py-8 space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Booking Request Received by Admin
                </span>
                <h3 className="font-serif font-bold text-3xl text-sage-950">
                  Request Confirmed!
                </h3>
                <p className="text-sage-700 text-sm max-w-md mx-auto">
                  Your reference ID is <strong className="font-mono text-terracotta-600 bg-sand-200 px-2 py-0.5 rounded text-base">{createdRef}</strong>.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-sand-300 text-left text-xs space-y-2 max-w-md mx-auto shadow-sm">
                <h4 className="font-serif font-bold text-sm text-sage-950">Next Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sage-700">
                  <li>Our Platform Concierge will review seat availability with {centre.name}.</li>
                  <li>Your contact details remain masked from the ashram until you approve final seat assignment.</li>
                  <li>You will receive an email notification to complete deposit payment.</li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setIsBookingModalOpen(false);
                    setUserRole('user');
                    setActiveView('user-dashboard');
                  }}
                  className="bg-sage-900 text-white font-medium px-6 py-3 rounded-xl text-xs shadow"
                >
                  Track in Traveler Dashboard
                </button>

                <button
                  onClick={() => {
                    setIsBookingModalOpen(false);
                    setUserRole('admin');
                    setActiveView('admin-dashboard');
                  }}
                  className="bg-purple-900 text-gold-400 font-medium px-6 py-3 rounded-xl text-xs shadow flex items-center justify-center space-x-1.5 ring-2 ring-gold-400/50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect in Admin Control Panel</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
