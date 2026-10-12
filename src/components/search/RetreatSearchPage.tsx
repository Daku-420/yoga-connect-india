import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Heart, 
  SlidersHorizontal, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRight
} from 'lucide-react';

export const RetreatSearchPage: React.FC = () => {
  const { 
    centres, 
    courses,
    filters, 
    setFilters, 
    resetFilters,
    formatPrice, 
    setSelectedCentreId, 
    setSelectedCourseId,
    setActiveView, 
    wishlist, 
    toggleWishlist,
    setIsBookingModalOpen,
    setIsCourseDrawerOpen,
    setIsFilterModalOpen
  } = useApp();

  // Apply Filters
  const filteredCentres = centres.filter(centre => {
    // Location Filter
    if (filters.searchLocation !== 'all' && centre.city.toLowerCase() !== filters.searchLocation.toLowerCase() && !centre.location.toLowerCase().includes(filters.searchLocation.toLowerCase())) {
      return false;
    }

    // Price Filter
    if (centre.startingPriceUSD > filters.maxPriceUSD) {
      return false;
    }

    // Perks Filters
    if (filters.mealsIncluded && !centre.mealsIncluded) return false;
    if (filters.pickupIncluded && !centre.airportPickup) return false;

    // Course Category Filter
    if (filters.courseCategory !== 'all') {
      const centreCourses = courses.filter(c => c.centreId === centre.id);
      const hasCategory = centreCourses.some(c => c.category === filters.courseCategory);
      if (!hasCategory) return false;
    }

    return true;
  });

  return (
    <div className="py-12 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Banner & Search Controls */}
        <div className="bg-[#263D32] text-[#F7F5EE] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden border border-[#1E3228]">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-[#A5B89A] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#DCCDB5]" />
              <span>Explore Verified Himalayan Ashrams & TTC</span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#F7F5EE]">
              Uttarakhand Yoga Retreats & Teacher Training
            </h1>

            <p className="text-[#A5B89A] text-sm sm:text-base font-normal max-w-2xl leading-relaxed">
              Compare certified schools, explore authentic ashram lineages, and submit secure booking inquiries with 100% Admin Escrow protection.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#E2E5DD] flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#59665C]">
            <span>Showing <strong className="text-[#263D32] text-sm font-serif">{filteredCentres.length}</strong> Verified Centres</span>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Programs' },
              { id: '200h-ttc', label: '200h TTC' },
              { id: '300h-ttc', label: '300h TTC' },
              { id: 'ayurveda', label: 'Ayurveda Detox' },
              { id: 'meditation', label: 'Silent Meditation' },
              { id: 'breathwork', label: 'Breathwork & Kriya' },
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => setFilters(f => ({ ...f, courseCategory: chip.id }))}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition ${
                  filters.courseCategory === chip.id
                    ? 'bg-[#536B50] text-white shadow-sm'
                    : 'bg-[#F7F5EE] text-[#59665C] hover:bg-[#E6EDE2] hover:text-[#263D32]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Filter Modal Button & Reset */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] text-xs font-semibold px-4 py-2.5 rounded-xl border border-[#E2E5DD] transition flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#536B50]" />
              <span>More Filters</span>
            </button>

            {(filters.searchLocation !== 'all' || filters.courseCategory !== 'all' || filters.mealsIncluded) && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#536B50] hover:text-[#263D32] underline font-medium ml-2"
              >
                Clear Filters
              </button>
            )}
          </div>

        </div>

        {/* Results Grid */}
        {filteredCentres.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCentres.map(centre => {
              const isWishlisted = wishlist.includes(centre.id);

              return (
                <article 
                  key={centre.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E2E5DD] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  {/* Image showcase */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#E6EDE2]">
                    <img 
                      src={centre.coverImage} 
                      alt={centre.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      {centre.isVerified && (
                        <span className="bg-[#263D32]/90 backdrop-blur-md text-[#F7F5EE] text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#3D5E4C]/50 flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3 text-[#A5B89A]" />
                          <span>Admin Verified</span>
                        </span>
                      )}
                      <span className="bg-white/90 backdrop-blur-md text-[#263D32] text-[11px] font-medium px-2.5 py-1 rounded-md shadow-sm">
                        {centre.city}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button 
                      onClick={() => toggleWishlist(centre.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-[#59665C] hover:text-[#B42318] transition shadow-sm"
                      aria-label="Save centre"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#B42318] text-[#B42318]' : ''}`} />
                    </button>

                    {/* Rating Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 text-[#DCCDB5] fill-current" />
                        <span className="font-semibold">{centre.rating}</span>
                        <span className="text-white/80 text-[10px]">({centre.reviewCount} reviews)</span>
                      </div>
                      <span className="text-white/90 text-xs">Est. {centre.foundedYear}</span>
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
                        className="font-serif font-bold text-xl text-[#263D32] hover:text-[#536B50] transition cursor-pointer leading-snug line-clamp-1"
                      >
                        {centre.name}
                      </h3>

                      <p className="text-xs text-[#59665C] line-clamp-2 leading-relaxed">
                        {centre.tagline}
                      </p>
                    </div>

                    {/* Accreditation and Inclusions */}
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
                        <span className="text-[10px] uppercase tracking-wider text-[#59665C] font-semibold block">From</span>
                        <div className="flex items-baseline space-x-1">
                          <span className="font-serif font-bold text-xl text-[#263D32]">
                            {formatPrice(centre.startingPriceUSD)}
                          </span>
                          <span className="text-xs text-[#59665C]">/ package</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCentreId(centre.id);
                            setActiveView('centre-detail');
                          }}
                          className="bg-[#E6EDE2] hover:bg-[#D4E0CE] text-[#263D32] text-xs font-semibold px-3 py-2 rounded-lg transition"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCentreId(centre.id);
                            setIsBookingModalOpen(true);
                          }}
                          className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-medium px-3.5 py-2 rounded-lg transition shadow-sm"
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
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E5DD] p-8 space-y-4 shadow-sm">
            <div className="text-4xl mb-2">🏔️</div>
            <h3 className="font-serif font-bold text-2xl text-[#263D32]">No Matching Retreats Found</h3>
            <p className="text-[#59665C] text-xs max-w-md mx-auto">
              We couldn't find any yoga centres matching your current filter criteria. Try expanding your search location or clearing filters.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
