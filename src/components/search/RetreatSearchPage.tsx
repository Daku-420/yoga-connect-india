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
  RefreshCw
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
    <div className="py-12 bg-sand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Banner & Search Controls */}
        <div className="bg-sage-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-sage-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-terracotta-700/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-sage-800/80 px-3 py-1 rounded-full text-gold-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Verified Indian Ashrams</span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-sand-50">
              Yoga Retreats & Teacher Training Courses
            </h1>

            <p className="text-sage-300 text-sm sm:text-base font-light">
              Compare certified schools, inspect course syllabi, and submit secure booking inquiries with 100% Admin Escrow protection.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-luxury border border-sand-300 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 text-xs font-semibold text-sage-800">
            <span>Showing <strong className="text-terracotta-600 text-sm font-serif">{filteredCentres.length}</strong> Verified Centres</span>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Programs' },
              { id: '200h-ttc', label: '200h TTC' },
              { id: '300h-ttc', label: '300h TTC' },
              { id: 'ayurveda', label: 'Ayurveda Detox' },
              { id: 'meditation', label: 'Silent Meditation' },
              { id: 'sound-healing', label: 'Sound Healing' },
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => setFilters(f => ({ ...f, courseCategory: chip.id }))}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                  filters.courseCategory === chip.id
                    ? 'bg-sage-900 text-white shadow'
                    : 'bg-sand-100 text-sage-800 hover:bg-sand-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Filter Modal Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-sand-100 hover:bg-sand-200 text-sage-900 text-xs font-semibold px-4 py-2 rounded-xl border border-sand-300 transition flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta-600" />
              <span>All Filters</span>
            </button>

            {(filters.searchLocation !== 'all' || filters.courseCategory !== 'all' || filters.mealsIncluded) && (
              <button
                onClick={resetFilters}
                className="text-xs text-terracotta-600 hover:text-terracotta-800 underline font-medium"
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
              const centreCoursesList = courses.filter(c => c.centreId === centre.id);

              return (
                <div 
                  key={centre.id}
                  className="bg-white rounded-2xl overflow-hidden border border-sand-300 shadow-luxury hover:shadow-2xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image Showcase */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={centre.coverImage} 
                      alt={centre.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      {centre.isVerified && (
                        <span className="bg-emerald-900/90 text-emerald-100 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center space-x-1 shadow backdrop-blur-md">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Admin Verified</span>
                        </span>
                      )}
                      <span className="bg-sage-900/80 text-sand-100 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
                        {centre.city}
                      </span>
                    </div>

                    <button 
                      onClick={() => toggleWishlist(centre.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-sage-800 hover:text-terracotta-600 transition shadow backdrop-blur-md"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                      <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-xs">
                        <Star className="w-3.5 h-3.5 text-gold-400 fill-current" />
                        <span className="font-bold">{centre.rating}</span>
                        <span className="text-sand-300 text-[10px]">({centre.reviewCount} reviews)</span>
                      </div>
                      <span className="text-xs text-sand-200 font-medium">Est. {centre.foundedYear}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1 text-xs text-sage-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                        <span>{centre.location}</span>
                      </div>

                      <h3 
                        onClick={() => {
                          setSelectedCentreId(centre.id);
                          setActiveView('centre-detail');
                        }}
                        className="font-serif font-bold text-xl text-sage-900 hover:text-terracotta-600 transition cursor-pointer leading-snug line-clamp-1"
                      >
                        {centre.name}
                      </h3>

                      <p className="text-xs text-sage-600 line-clamp-2 leading-relaxed">
                        {centre.tagline}
                      </p>
                    </div>

                    {/* Available Courses list pills */}
                    <div className="space-y-1.5 pt-2 border-t border-sand-200">
                      <span className="text-[10px] uppercase font-bold text-sage-500 tracking-wider">Available Courses ({centreCoursesList.length})</span>
                      <div className="flex flex-wrap gap-1">
                        {centreCoursesList.map(crs => (
                          <button
                            key={crs.id}
                            onClick={() => {
                              setSelectedCentreId(centre.id);
                              setSelectedCourseId(crs.id);
                              setIsCourseDrawerOpen(true);
                            }}
                            className="bg-sand-100 hover:bg-sand-200 text-sage-900 text-[11px] font-semibold px-2 py-0.5 rounded border border-sand-300 transition flex items-center space-x-1"
                          >
                            <BookOpen className="w-3 h-3 text-terracotta-500" />
                            <span className="truncate max-w-[150px]">{crs.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-sage-500 font-medium block">Starting From</span>
                        <div className="flex items-baseline space-x-1">
                          <span className="font-serif font-bold text-xl text-sage-950">
                            {formatPrice(centre.startingPriceUSD)}
                          </span>
                          <span className="text-xs text-sage-500">/ package</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCentreId(centre.id);
                            setActiveView('centre-detail');
                          }}
                          className="bg-sand-100 hover:bg-sand-200 text-sage-900 text-xs font-semibold px-3 py-2 rounded-lg transition"
                        >
                          Details
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCentreId(centre.id);
                            setIsBookingModalOpen(true);
                          }}
                          className="bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow transition"
                        >
                          Book Request
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-sand-300 shadow">
            <BookOpen className="w-12 h-12 text-sage-400 mx-auto" />
            <h3 className="font-serif font-bold text-2xl text-sage-900">No Centres Match Your Current Filters</h3>
            <p className="text-sage-600 text-sm max-w-md mx-auto">
              Try adjusting your max price limit or clearing specific location and course filters.
            </p>
            <button
              onClick={resetFilters}
              className="bg-sage-900 text-white font-medium px-6 py-2.5 rounded-xl text-xs inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
