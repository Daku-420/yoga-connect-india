import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Heart, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Calendar, 
  Utensils, 
  Home, 
  UserCheck, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  ArrowLeft,
  Lock,
  Mail,
  Compass
} from 'lucide-react';

export const CentreDetailPage: React.FC = () => {
  const { 
    selectedCentreId, 
    centres, 
    courses, 
    formatPrice, 
    setActiveView, 
    setSelectedCourseId,
    setIsCourseDrawerOpen,
    setIsBookingModalOpen,
    wishlist,
    toggleWishlist
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'stay' | 'teachers' | 'facilities' | 'reviews' | 'policies'>('overview');

  const centre = centres.find(c => c.id === selectedCentreId) || centres[0];

  if (!centre) {
    return (
      <div className="bg-[#F7F5EE] min-h-screen py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-4">
          <div className="text-4xl">🧘‍♂️</div>
          <h2 className="font-serif font-bold text-2xl text-[#263D32]">No Centre Selected</h2>
          <p className="text-xs text-[#59665C]">Please return to the retreat discovery directory.</p>
          <button 
            onClick={() => setActiveView('retreats')}
            className="bg-[#536B50] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#40563E] transition"
          >
            Explore Directory
          </button>
        </div>
      </div>
    );
  }

  const centreCourses = courses.filter(c => c.centreId === centre.id);
  const isWishlisted = wishlist.includes(centre.id);

  return (
    <div className="bg-[#F7F5EE] min-h-screen pb-20">
      
      {/* Top Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-[#E2E5DD] py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveView('retreats')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#59665C] hover:text-[#263D32] transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#536B50]" />
            <span>Back to All Uttarakhand Retreats</span>
          </button>

          <div className="flex items-center space-x-3 text-xs">
            <button 
              onClick={() => toggleWishlist(centre.id)}
              className="flex items-center space-x-1.5 text-[#59665C] hover:text-[#263D32] transition"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#B42318] text-[#B42318]' : ''}`} />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Photo Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[420px] rounded-2xl overflow-hidden shadow-sm border border-[#E2E5DD] relative bg-[#E6EDE2]">
          
          {/* Main Large Photo */}
          <div className="md:col-span-2 relative h-full">
            <img 
              src={centre.coverImage} 
              alt={centre.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 text-white">
              <span className="bg-[#263D32]/90 backdrop-blur-md text-[#F7F5EE] text-[10px] font-semibold px-2.5 py-1 rounded-md border border-[#3D5E4C]/50 inline-flex items-center space-x-1 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A5B89A]" />
                <span>100% Escrow Protected Sanctuary</span>
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                {centre.name}
              </h1>
            </div>
          </div>

          {/* Secondary Photo Tiles */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
            {centre.galleryImages.slice(0, 4).map((img, idx) => (
              <div key={idx} className="relative h-full overflow-hidden bg-[#263D32]/10">
                <img 
                  src={img} 
                  alt={`${centre.name} gallery ${idx + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Summary Header & Sticky Action Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E2E5DD] flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs text-[#59665C]">
              <MapPin className="w-4 h-4 text-[#536B50]" />
              <span>{centre.location}</span>
              <span>•</span>
              <div className="flex items-center text-[#263D32] font-semibold">
                <Star className="w-4 h-4 text-[#536B50] fill-current mr-1" />
                <span>{centre.rating} ({centre.reviewCount} Verified Reviews)</span>
              </div>
            </div>

            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32]">
              {centre.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="bg-[#E6EDE2] text-[#263D32] text-xs font-semibold px-3 py-1 rounded-md flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-[#536B50]" />
                <span>{centre.certification}</span>
              </span>
              <span className="bg-[#F7F5EE] text-[#59665C] text-xs font-medium px-3 py-1 rounded-md border border-[#E2E5DD]">
                Languages: {centre.languages.join(', ')}
              </span>
            </div>
          </div>

          {/* Pricing & Booking CTA */}
          <div className="flex items-center space-x-5 shrink-0 bg-[#F7F5EE] p-5 rounded-xl border border-[#E2E5DD]">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#59665C] block">Starting From</span>
              <span className="font-serif font-bold text-2xl text-[#263D32]">
                {formatPrice(centre.startingPriceUSD)}
              </span>
              <span className="text-[11px] text-[#59665C] block">/ package tuition & stay</span>
            </div>

            <button
              onClick={() => {
                setSelectedCourseId(centreCourses[0]?.id || null);
                setIsBookingModalOpen(true);
              }}
              className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium px-6 py-3.5 rounded-xl text-sm shadow-sm transition flex items-center space-x-2"
            >
              <span>Submit Enquiry</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Tabs Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border-b border-[#E2E5DD] flex overflow-x-auto space-x-6 text-sm font-medium text-[#59665C] no-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Heritage' },
            { id: 'courses', label: `Courses & Retreats (${centreCourses.length})` },
            { id: 'stay', label: 'Stay & Sattvic Dining' },
            { id: 'teachers', label: `Teachers (${centre.teachers.length})` },
            { id: 'facilities', label: 'Facilities' },
            { id: 'reviews', label: `Reviews (${centre.reviewCount})` },
            { id: 'policies', label: 'Policies & FAQs' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 transition border-b-2 font-medium whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'border-[#536B50] text-[#536B50] font-semibold'
                  : 'border-transparent text-[#59665C] hover:text-[#263D32]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Column + Right Booking Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Left Content (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="bg-white p-8 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#263D32] mb-3">About {centre.name}</h3>
                  <p className="text-[#252C27] text-sm leading-relaxed whitespace-pre-line font-sans">
                    {centre.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E2E5DD]">
                  <h4 className="font-serif font-bold text-lg text-[#263D32] mb-2">Lineage & Spiritual History</h4>
                  <p className="text-[#59665C] text-sm leading-relaxed font-sans">
                    {centre.history}
                  </p>
                </div>

                {/* Nearby Attractions */}
                <div className="pt-6 border-t border-[#E2E5DD]">
                  <h4 className="font-serif font-bold text-lg text-[#263D32] mb-3">Nearby Himalayan Sites</h4>
                  <div className="flex flex-wrap gap-2">
                    {centre.nearbyAttractions.map((site, i) => (
                      <span key={i} className="bg-[#F7F5EE] border border-[#E2E5DD] text-[#263D32] text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#536B50]" />
                        <span>{site}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Courses & Retreats */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <h3 className="font-serif font-bold text-2xl text-[#263D32]">Offered Retreats & Certifications</h3>
                {centreCourses.map(course => (
                  <div key={course.id} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <span className="bg-[#E6EDE2] text-[#263D32] text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-2 inline-block">
                          {course.certification}
                        </span>
                        <h4 className="font-serif font-bold text-xl text-[#263D32]">{course.title}</h4>
                        <p className="text-xs text-[#59665C] mt-1">{course.subtitle}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-2xl text-[#263D32]">
                          {formatPrice(course.priceUSD)}
                        </span>
                        <span className="text-xs text-[#59665C] block">{course.durationDays} Days Duration</span>
                      </div>
                    </div>

                    {/* Syllabus snippet */}
                    <div className="bg-[#F7F5EE] p-4 rounded-xl border border-[#E2E5DD] space-y-1.5">
                      <span className="text-xs font-semibold text-[#263D32] block">Course Modules:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#59665C]">
                        {course.syllabus.map((mod, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#536B50] shrink-0" />
                            <span className="truncate">{mod}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="text-xs text-[#59665C]">
                        Upcoming Batches: <strong className="text-[#252C27]">{course.upcomingDates.join(', ')}</strong>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCourseId(course.id);
                            setIsCourseDrawerOpen(true);
                          }}
                          className="bg-[#E6EDE2] hover:bg-[#D4E0CE] text-[#263D32] text-xs font-semibold px-3.5 py-2 rounded-lg transition"
                        >
                          View Daily Schedule
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCourseId(course.id);
                            setIsBookingModalOpen(true);
                          }}
                          className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-medium px-4 py-2 rounded-lg transition shadow-sm"
                        >
                          Enquire Program
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Stay & Food */}
            {activeTab === 'stay' && (
              <div className="bg-white p-8 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#263D32] mb-2 flex items-center space-x-2">
                    <Home className="w-5 h-5 text-[#536B50]" />
                    <span>Himalayan Accommodations</span>
                  </h3>
                  <p className="text-sm text-[#59665C]">Rooms designed for quietude, natural airflow, and mountain contemplation.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {centre.accommodationTypes.map((room, i) => (
                      <div key={i} className="p-4 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]">
                        <h4 className="font-serif font-bold text-base text-[#263D32]">{room}</h4>
                        <p className="text-xs text-[#59665C] mt-1">Clean linens, private or attached bath, warm blankets, natural Himalayan spring water.</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E2E5DD]">
                  <h3 className="font-serif font-bold text-2xl text-[#263D32] mb-2 flex items-center space-x-2">
                    <Utensils className="w-5 h-5 text-[#536B50]" />
                    <span>Sattvic Organic Dining</span>
                  </h3>
                  <p className="text-sm text-[#59665C] leading-relaxed">
                    Meals are prepared fresh three times daily following Ayurvedic and yogic nutritional principles. Pure vegetarian ingredients sourced from local organic Himalayan farmers, free from garlic, heavy oils, or processed preservatives to support deep meditative practice.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Teachers */}
            {activeTab === 'teachers' && (
              <div className="bg-white p-8 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-6">
                <h3 className="font-serif font-bold text-2xl text-[#263D32]">Master Teachers & Resident Acharyas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {centre.teachers.map(teacher => (
                    <div key={teacher.id} className="p-5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] flex items-start space-x-4">
                      <img 
                        src={teacher.photo} 
                        alt={teacher.name} 
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E2E5DD]"
                      />
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-base text-[#263D32]">{teacher.name}</h4>
                        <p className="text-xs text-[#536B50] font-medium">{teacher.title}</p>
                        <p className="text-[11px] text-[#59665C] leading-relaxed">{teacher.bio}</p>
                        <span className="text-[10px] text-[#59665C] font-semibold block pt-1">
                          {teacher.experienceYears}+ years experience
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Facilities */}
            {activeTab === 'facilities' && (
              <div className="bg-white p-8 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-6">
                <h3 className="font-serif font-bold text-2xl text-[#263D32]">Campus Amenities & Facilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {centre.facilities.map((fac, i) => (
                    <div key={i} className="flex items-center space-x-2.5 p-3.5 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] text-sm text-[#263D32]">
                      <CheckCircle2 className="w-4 h-4 text-[#536B50] shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="bg-white p-8 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-2xl text-[#263D32]">Verified Reviews</h3>
                  <div className="flex items-center space-x-1 text-[#536B50] font-bold text-base">
                    <Star className="w-5 h-5 fill-current" />
                    <span>{centre.rating} out of 5</span>
                  </div>
                </div>
                <p className="text-xs text-[#59665C]">Reviews are collected exclusively from practitioners who completed authenticated bookings through the escrow system.</p>

                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-[#263D32]">Sarah Jenkins (Australia)</strong>
                      <span className="text-[#59665C]">October 2026</span>
                    </div>
                    <div className="flex text-[#536B50]">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                    <p className="text-xs text-[#252C27] leading-relaxed">
                      "An extraordinary sanctuary. The teachers possess deep lineage wisdom and taught with genuine care. The admin escrow team organized my private pickup from Dehradun airport flawlessly."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Policies & FAQs */}
            {activeTab === 'policies' && (
              <div className="bg-white p-8 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-6">
                <h3 className="font-serif font-bold text-2xl text-[#263D32]">Ashram Policies & Guidance</h3>
                
                <div className="space-y-3">
                  <div className="p-4 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]">
                    <strong className="text-xs text-[#263D32] block mb-1">Cancellation & Escrow Refund Policy</strong>
                    <p className="text-xs text-[#59665C]">{centre.policies.cancellation}</p>
                  </div>
                  <div className="p-4 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]">
                    <strong className="text-xs text-[#263D32] block mb-1">Visa Guidelines for International Visitors</strong>
                    <p className="text-xs text-[#59665C]">{centre.policies.visa}</p>
                  </div>
                  <div className="p-4 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]">
                    <strong className="text-xs text-[#263D32] block mb-1">Dress Code & Ashram Etiquette</strong>
                    <p className="text-xs text-[#59665C]">{centre.policies.dressCode}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E5DD] space-y-3">
                  <h4 className="font-serif font-bold text-lg text-[#263D32]">Frequently Asked Questions</h4>
                  {centre.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] space-y-1">
                      <strong className="text-xs text-[#263D32] block">{faq.question}</strong>
                      <p className="text-xs text-[#59665C]">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sticky Enquiry & Escrow Explainer Panel */}
          <div className="space-y-6 sticky top-28">
            
            {/* Booking / Enquiry Action Box */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#536B50] uppercase tracking-wider block">
                  Reserve or Enquire
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#263D32]">
                  {centre.name}
                </h3>
              </div>

              <div className="p-4 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD] space-y-1">
                <span className="text-xs text-[#59665C] block">Package Rates from:</span>
                <span className="font-serif font-bold text-3xl text-[#263D32] block">
                  {formatPrice(centre.startingPriceUSD)}
                </span>
                <span className="text-[11px] text-[#59665C] block">Includes tuition, lodging & 3 daily sattvic meals</span>
              </div>

              <button
                onClick={() => {
                  setSelectedCourseId(centreCourses[0]?.id || null);
                  setIsBookingModalOpen(true);
                }}
                className="w-full bg-[#536B50] hover:bg-[#40563E] text-white font-medium py-3.5 px-4 rounded-xl text-sm shadow-sm transition flex items-center justify-center space-x-2"
              >
                <span>Submit Structured Enquiry</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Clear explanation of what happens after enquiry */}
              <div className="pt-4 border-t border-[#E2E5DD] space-y-2 text-xs text-[#59665C]">
                <div className="flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#286749] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#252C27]">What happens after enquiry:</strong> Our Platform Admin verifies current seat availability and confirms your dietary/airport transfer requests.
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <Lock className="w-4 h-4 text-[#536B50] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#252C27]">Zero Direct Spam:</strong> Ashrams never receive your direct email or phone until you approve the booking.
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Escrow Protection Badge Box */}
            <div className="bg-[#263D32] text-white p-6 rounded-2xl border border-[#3D5E4C]/50 space-y-3">
              <div className="flex items-center space-x-2 text-[#DCCDB5] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#A5B89A]" />
                <span>100% ADMIN ESCROW PROTECTION</span>
              </div>
              <h4 className="font-serif font-bold text-lg text-white">
                Booking Safety Guarantee
              </h4>
              <p className="text-[#A5B89A] text-xs leading-relaxed">
                Deposit funds are held in secure escrow and are only released to the yoga centre according to agreed ashram check-in policies.
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
