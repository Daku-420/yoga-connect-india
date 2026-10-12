import React, { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';

export const CentreDashboard: React.FC = () => {
  const { 
    centres, 
    courses, 
    bookings, 
    addNewCourse, 
    formatPrice,
    currency
  } = useApp();

  const myCentre = centres[0]; // Ananda Himalayan Yoga Sanctuary
  const myCourses = courses.filter(c => c.centreId === myCentre.id);
  const myBookings = bookings.filter(b => b.centreId === myCentre.id);

  // New course modal form state
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'200h-ttc' | '300h-ttc' | 'meditation' | 'ayurveda'>('200h-ttc');
  const [newPriceUSD, setNewPriceUSD] = useState(1200);
  const [newDuration, setNewDuration] = useState(14);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    addNewCourse({
      id: 'course-new-' + Date.now(),
      centreId: myCentre.id,
      centreName: myCentre.name,
      title: newTitle || 'Custom Yoga Course',
      subtitle: 'Newly added ashram certification program',
      category: newCategory,
      durationDays: newDuration,
      priceUSD: newPriceUSD,
      certification: 'Yoga Alliance USA RYS 200/300',
      syllabus: ['Asana Alignment', 'Pranayama', 'Anatomy', 'Meditation'],
      dailySchedule: [
        { time: '06:00 AM', activity: 'Morning Practice' },
        { time: '09:00 AM', activity: 'Sattvic Breakfast' },
      ],
      mealsIncluded: '3 Organic Meals Daily',
      accommodationOptions: ['Deluxe Room', 'Shared Suite'],
      upcomingDates: ['Oct 1, 2026', 'Nov 1, 2026'],
      photos: [myCentre.coverImage],
      requirements: ['Open mind']
    });
    setIsAddingCourse(false);
    setNewTitle('');
  };

  return (
    <div className="py-10 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Ashram Manager Header */}
        <div className="bg-[#263D32] text-white rounded-2xl p-8 border border-[#344C3F] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img src={myCentre.coverImage} alt={myCentre.name} className="w-20 h-20 rounded-xl object-cover border-2 border-[#DCCDB5] shrink-0" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#A5B89A]/40">
                  Partner Ashram Portal
                </span>
                <span className="bg-white/10 text-[#DCCDB5] text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                  Verified Rank #{myCentre.sponsoredRank || 1}
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white mt-1">
                {myCentre.name}
              </h1>
              <span className="text-xs text-[#A5B89A]">{myCentre.location} • RYS Accredited</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddingCourse(true)}
              className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium px-4 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Course</span>
            </button>

            <button
              onClick={() => alert('Upgraded to Premium Placement Tier ($299/mo)')}
              className="bg-[#DCCDB5] hover:bg-[#DCCDB5]/90 text-[#263D32] font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition flex items-center space-x-1.5"
            >
              <Crown className="w-4 h-4 text-[#263D32]" />
              <span>Upgrade Placement</span>
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#59665C] block">Total Active Courses</span>
            <span className="font-serif font-bold text-2xl text-[#263D32]">{myCourses.length} Programs</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#59665C] block">Assigned Lead Inquiries</span>
            <span className="font-serif font-bold text-2xl text-[#536B50]">{myBookings.length} Leads</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#59665C] block">Platform Commission Rate</span>
            <span className="font-serif font-bold text-2xl text-[#263D32]">{myCentre.commissionRatePercent}% Per Booking</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-sm">
            <span className="text-[10px] uppercase font-bold text-[#59665C] block">Est. Net Ashram Payout</span>
            <span className="font-serif font-bold text-2xl text-[#286749]">{formatPrice(1062.50)}</span>
          </div>
        </div>

        {/* Lead Requests Section with MASKED Privacy Notice */}
        <div className="bg-white rounded-2xl p-8 border border-[#E2E5DD] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#263D32]">Assigned Customer Booking Requests</h2>
              <p className="text-xs text-[#59665C] mt-1">
                Leads assigned to your ashram by Platform Admin. Customer direct emails & phones are MASKED until admin approves the final deposit.
              </p>
            </div>

            <span className="bg-[#E6EDE2] text-[#263D32] text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 border border-[#A5B89A]/40">
              <Lock className="w-3.5 h-3.5 text-[#536B50]" />
              <span>Contact Info Masked</span>
            </span>
          </div>

          <div className="space-y-4">
            {myBookings.map((b) => (
              <div key={b.id} className="bg-[#F7F5EE]/60 p-6 rounded-xl border border-[#E2E5DD] flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs bg-[#E6EDE2] text-[#263D32] font-bold px-2 py-0.5 rounded border border-[#A5B89A]/40">
                      {b.referenceCode}
                    </span>
                    <span className="bg-[#E6EDE2] text-[#286749] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#286749]/20">
                      Status: {b.status}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#263D32]">{b.courseTitle}</h3>

                  {/* Masked Customer Data Notice */}
                  <div className="bg-white p-3 rounded-xl border border-[#E2E5DD] text-xs space-y-1">
                    <div className="flex items-center space-x-1 text-[#536B50] font-bold">
                      <ShieldAlert className="w-4 h-4 text-[#536B50]" />
                      <span>MASKED CUSTOMER PROFILE (Admin Protected)</span>
                    </div>
                    <div className="text-[#59665C] grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      <div>Name: {b.customerName.charAt(0)}***** (Hidden)</div>
                      <div>Country: {b.customerCountry}</div>
                      <div>Email: *********@example.com (Hidden)</div>
                      <div>Phone: +1 ***-***-**** (Hidden)</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-[#59665C] pt-1">
                    <span>Intake Date: <strong>{b.startDate}</strong></span>
                    <span>Room: <strong>{b.roomType}</strong></span>
                    <span>Airport Transfer: <strong>{b.airportPickup ? 'Requested' : 'No'}</strong></span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#59665C] font-semibold uppercase block">Ashram Net Payout</span>
                  <span className="font-serif font-bold text-2xl text-[#286749]">{formatPrice(b.centrePayoutUSD || 1000)}</span>
                  <span className="text-[10px] text-[#59665C] block">After 15% Platform Fee</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Add New Course */}
        {isAddingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263D32]/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#E2E5DD] shadow-2xl">
              <div className="flex justify-between items-center border-b border-[#E2E5DD] pb-3">
                <h3 className="font-serif font-bold text-xl text-[#263D32]">Add Course Listing</h3>
                <button onClick={() => setIsAddingCourse(false)} className="text-[#59665C] hover:text-[#252C27]"><Lock className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#252C27] block mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 200 Hour Hatha & Kundalini TTC"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border border-[#E2E5DD] p-2.5 rounded-lg text-sm focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#252C27] block mb-1">Price (USD)</label>
                    <input
                      type="number"
                      value={newPriceUSD}
                      onChange={(e) => setNewPriceUSD(Number(e.target.value))}
                      className="w-full border border-[#E2E5DD] p-2.5 rounded-lg text-sm focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#252C27] block mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      className="w-full border border-[#E2E5DD] p-2.5 rounded-lg text-sm focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#536B50] hover:bg-[#40563E] text-white font-bold py-3 rounded-xl transition">
                  Publish Course Listing
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
