import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Sparkles,
  Calendar
} from 'lucide-react';

export const FeaturedCentres: React.FC = () => {
  const { 
    centres, 
    courses,
    formatPrice, 
    setSelectedCentreId, 
    setSelectedCourseId,
    setActiveView, 
    wishlist, 
    toggleWishlist,
    setIsBookingModalOpen,
    setIsCourseDrawerOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'centres' | 'retreats'>('centres');

  const featuredCentres = centres.filter(c => c.isFeatured);

  return (
    <section className="py-20 bg-[#F7F5EE]" id="featured-centres">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[#536B50] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-[#A5B89A]" />
              <span>Curated Himalayan Sanctuaries</span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#263D32]">
              Featured Yoga Centres & Retreats
            </h2>
            <p className="text-[#59665C] text-sm mt-2 max-w-xl">
              Authentic ashrams and nature retreats in Uttarakhand with verified lineage masters and full escrow protection.
            </p>
          </div>

          {/* Toggle between Centres and Retreat Courses */}
          <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-[#E2E5DD] shadow-sm">
            <button
              onClick={() => setActiveTab('centres')}
              className={`text-xs font-medium px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'centres'
                  ? 'bg-[#536B50] text-white shadow-sm'
                  : 'text-[#59665C] hover:text-[#263D32]'
              }`}
            >
              Yoga Centres ({featuredCentres.length})
            </button>
            <button
              onClick={() => setActiveTab('retreats')}
              className={`text-xs font-medium px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'retreats'
                  ? 'bg-[#536B50] text-white shadow-sm'
                  : 'text-[#59665C] hover:text-[#263D32]'
              }`}
            >
              Retreat Programs ({courses.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Featured Yoga Centres */}
        {activeTab === 'centres' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCentres.map(centre => {
              const isWishlisted = wishlist.includes(centre.id);

              return (
                <article 
                  key={centre.id}
                  className="card-lift bg-white rounded-2xl overflow-hidden border border-[#E2E5DD] hover:border-[#C5A880]/60 shadow-sm flex flex-col group cursor-pointer"
                >
                  {/* Image Container with Consistent Aspect Ratio */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#E6EDE2] image-zoom-container">
                    <img 
                      src={centre.coverImage} 
                      alt={centre.name}
                      className="w-full h-full object-cover image-zoom-target"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      {centre.isVerified && (
                        <span className="bg-[#263D32]/90 backdrop-blur-md text-[#F7F5EE] text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#3D5E4C]/50 flex items-center space-x-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3 text-[#A5B89A]" />
                          <span>Admin Verified</span>
                        </span>
                      )}
                      <span className="bg-white/95 backdrop-blur-md text-[#263D32] text-[11px] font-medium px-2.5 py-1 rounded-md shadow-xs">
                        {centre.city}
                      </span>
                    </div>

                    {/* Wishlist Button with Micro-Bounce */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(centre.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-[#59665C] hover:text-[#B42318] active:scale-80 hover:scale-110 transition-all duration-200 shadow-sm cursor-pointer z-10"
                      aria-label={isWishlisted ? "Remove from saved" : "Save centre"}
                    >
                      <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-[#B42318] text-[#B42318]' : ''}`} />
                    </button>

                    {/* Rating Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
                      <div className="flex items-center space-x-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-xs">
                        <Star className="w-3.5 h-3.5 text-[#DCCDB5] fill-current" />
                        <span className="font-semibold text-white">{centre.rating}</span>
                        <span className="text-white/80 text-[10px]">({centre.reviewCount})</span>
                      </div>
                      <span className="text-white/90 text-[11px] font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">Est. {centre.foundedYear}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs text-[#59665C]">
                        <MapPin className="w-3.5 h-3.5 text-[#536B50] shrink-0" />
                        <span className="truncate">{centre.location}</span>
                      </div>

                      <h3 
                        onClick={() => {
                          setSelectedCentreId(centre.id);
                          setActiveView('centre-detail');
                        }}
                        className="font-serif font-bold text-xl text-[#263D32] group-hover:text-[#536B50] transition-colors cursor-pointer leading-snug line-clamp-1"
                      >
                        {centre.name}
                      </h3>

                      <p className="text-xs text-[#59665C] line-clamp-2 leading-relaxed">
                        {centre.tagline}
                      </p>
                    </div>

                    {/* Certification and Inclusions */}
                    <div className="pt-3 border-t border-[#E2E5DD] space-y-2 text-xs">
                      <div className="flex items-center space-x-1.5 text-[#252C27] font-medium">
                        <Award className="w-4 h-4 text-[#536B50] shrink-0" />
                        <span className="truncate">{centre.certification}</span>
                      </div>

                      <div className="flex items-center space-x-3 text-[11px] text-[#59665C]">
                        {centre.mealsIncluded && (
                          <span className="flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-[#286749]" />
                            <span>Sattvic Meals</span>
                          </span>
                        )}
                        {centre.airportPickup && (
                          <span className="flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-[#286749]" />
                            <span>Airport Transfer</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-4 border-t border-[#E2E5DD] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#59665C] font-semibold block">
                          From
                        </span>
                        <div className="flex items-baseline space-x-1">
                          <span className="font-serif font-bold text-xl text-[#263D32]">
                            {formatPrice(centre.startingPriceUSD)}
                          </span>
                          <span className="text-xs text-[#59665C]">/ package</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCentreId(centre.id);
                            setActiveView('centre-detail');
                          }}
                          className="bg-[#E6EDE2] hover:bg-[#D4E0CE] active:scale-95 text-[#263D32] text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-200"
                        >
                          View Details
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCentreId(centre.id);
                            setIsBookingModalOpen(true);
                          }}
                          className="bg-[#536B50] hover:bg-[#40563E] active:scale-95 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-all duration-200 shadow-xs hover:shadow-sm"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Tab 2: Retreat Programs Showcase */}
        {activeTab === 'retreats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {courses.map(course => (
              <article 
                key={course.id}
                className="card-lift bg-white rounded-2xl overflow-hidden border border-[#E2E5DD] hover:border-[#C5A880]/60 shadow-sm p-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block bg-[#E6EDE2] text-[#263D32] text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-2">
                        {course.certification}
                      </span>
                      <h3 
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setSelectedCentreId(course.centreId);
                          setIsCourseDrawerOpen(true);
                        }}
                        className="font-serif font-bold text-xl text-[#263D32] group-hover:text-[#536B50] transition-colors cursor-pointer leading-snug"
                      >
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#536B50] font-medium mt-1">
                        {course.centreName}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase text-[#59665C] block">Duration</span>
                      <span className="font-semibold text-sm text-[#263D32] flex items-center space-x-1 justify-end">
                        <Clock className="w-3.5 h-3.5 text-[#536B50]" />
                        <span>{course.durationDays} Days</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#59665C] line-clamp-2 leading-relaxed">
                    {course.subtitle}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1 bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD] group-hover:border-[#C5A880]/40 transition-colors">
                    <span className="text-[11px] font-semibold text-[#263D32] block">Curriculum Focus:</span>
                    <ul className="text-[11px] text-[#59665C] space-y-0.5 list-disc list-inside">
                      {course.syllabus.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="truncate">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Upcoming Dates Preview */}
                  <div className="flex items-center space-x-2 text-xs text-[#59665C]">
                    <Calendar className="w-3.5 h-3.5 text-[#536B50]" />
                    <span>Upcoming Batches: <strong className="text-[#252C27]">{course.upcomingDates.slice(0, 2).join(', ')}</strong></span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2E5DD] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-[#59665C] block">Total Tuition & Stay</span>
                    <span className="font-serif font-bold text-2xl text-[#263D32]">
                      {formatPrice(course.priceUSD)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setSelectedCentreId(course.centreId);
                        setIsCourseDrawerOpen(true);
                      }}
                      className="bg-[#E6EDE2] hover:bg-[#D4E0CE] active:scale-95 text-[#263D32] text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-all duration-200"
                    >
                      View Syllabus
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setSelectedCentreId(course.centreId);
                        setIsBookingModalOpen(true);
                      }}
                      className="bg-[#536B50] hover:bg-[#40563E] active:scale-95 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-xs hover:shadow-sm"
                    >
                      Enquire Program
                    </button>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
