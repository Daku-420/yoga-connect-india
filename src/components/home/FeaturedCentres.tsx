import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const FeaturedCentres: React.FC = () => {
  const { 
    centres, 
    formatPrice, 
    setSelectedCentreId, 
    setActiveView, 
    wishlist, 
    toggleWishlist,
    setIsBookingModalOpen,
    setSelectedCourseId
  } = useApp();

  const featuredList = centres.filter(c => c.isFeatured);

  return (
    <section className="py-20 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-terracotta-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>Handpicked Sanctuaries</span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-sage-950">
              Featured Yoga Centres & Ashrams
            </h2>
            <p className="text-sage-700 text-sm mt-2 max-w-xl">
              100% Admin Verified traditional ashrams and luxury beach sanctuaries with direct platform booking protection.
            </p>
          </div>

          <button
            onClick={() => setActiveView('retreats')}
            className="inline-flex items-center space-x-2 text-sage-900 font-semibold text-sm hover:text-terracotta-600 transition group"
          >
            <span>View All {centres.length} Verified Centres</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Centre Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredList.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-sand-300 p-8 space-y-4 shadow-luxury">
              <div className="text-5xl mb-2">🧘‍♂️</div>
              <h3 className="font-serif font-bold text-2xl text-sage-950">No Registered Yoga Centres</h3>
              <p className="text-sage-600 text-xs max-w-md mx-auto">
                There are currently no registered yoga centres listed on the platform.
              </p>
            </div>
          ) : (
            featuredList.map(centre => {
            const isWishlisted = wishlist.includes(centre.id);

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

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    {centre.isVerified && (
                      <span className="bg-emerald-900/90 backdrop-blur-md text-emerald-100 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center space-x-1 shadow">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Admin Verified</span>
                      </span>
                    )}
                    <span className="bg-sage-900/80 backdrop-blur-md text-sand-100 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
                      {centre.city}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button 
                    onClick={() => toggleWishlist(centre.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-sage-800 hover:text-terracotta-600 transition shadow"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
                  </button>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-xs">
                        <Star className="w-3.5 h-3.5 text-gold-400 fill-current" />
                        <span className="font-bold">{centre.rating}</span>
                        <span className="text-sand-300 text-[10px]">({centre.reviewCount} reviews)</span>
                      </div>
                      <span className="text-xs text-sand-200 font-medium">Est. {centre.foundedYear}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
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

                  {/* Certification & Perks */}
                  <div className="pt-2 border-t border-sand-200/80 space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-sage-800 font-semibold">
                      <Award className="w-4 h-4 text-gold-600 shrink-0" />
                      <span className="truncate">{centre.certification}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-sage-600">
                      {centre.mealsIncluded && (
                        <span className="flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Sattvic Meals</span>
                        </span>
                      )}
                      {centre.airportPickup && (
                        <span className="flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Airport Transfer</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-sage-500 font-medium block">Starting From</span>
                      <div className="flex items-baseline space-x-1">
                        <span className="font-serif font-bold text-xl text-sage-950">
                          {formatPrice(centre.startingPriceUSD)}
                        </span>
                        <span className="text-xs text-sage-500 font-normal">/ package</span>
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
                        Explore
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
          }))}
        </div>

      </div>
    </section>
  );
};
