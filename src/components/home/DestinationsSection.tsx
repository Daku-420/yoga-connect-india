import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockDestinations } from '../../data/mockDestinations';
import { MapPin, ArrowRight, Sparkles, Plane } from 'lucide-react';

export const DestinationsSection: React.FC = () => {
  const { setSelectedDestinationSlug, setActiveView, setFilters } = useApp();

  return (
    <section className="py-20 bg-sand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-1.5 text-terracotta-600 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-terracotta-500" />
            <span>Sacred Wellness Destinations</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-5xl text-sage-950">
            Explore Popular Retreat Destinations in India
          </h2>
          <p className="text-sage-700 text-sm sm:text-base font-sans">
            From the high Himalayan foothills of Rishikesh to the tropical palms of Kerala and oceanfront shalas of Goa.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockDestinations.map((dest) => (
            <div 
              key={dest.id}
              onClick={() => {
                if (!dest.isUpcoming) {
                  setSelectedDestinationSlug(dest.slug);
                  setFilters(f => ({ ...f, searchLocation: dest.name }));
                  setActiveView('retreats');
                }
              }}
              className={`relative rounded-2xl overflow-hidden shadow-luxury border border-sand-300/80 group h-80 cursor-pointer transition-all duration-500 ${
                dest.isUpcoming ? 'opacity-85' : 'hover:-translate-y-1 hover:shadow-2xl'
              }`}
            >
              <img 
                src={dest.coverImage} 
                alt={dest.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-950 via-sage-950/40 to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                {dest.isUpcoming ? (
                  <span className="bg-gold-500/90 text-sage-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Future Expansion</span>
                  </span>
                ) : (
                  <span className="bg-sand-50/90 backdrop-blur-md text-sage-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                    {dest.retreatCount} Verified Ashrams
                  </span>
                )}
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                <div className="flex items-center space-x-1 text-xs text-gold-400 font-medium">
                  <Plane className="w-3 h-3" />
                  <span>{dest.nearbyAirport}</span>
                </div>

                <h3 className="font-serif font-bold text-2xl text-sand-50 group-hover:text-gold-300 transition">
                  {dest.name}
                </h3>

                <p className="text-xs text-sand-200 line-clamp-1 font-light">
                  {dest.subtitle}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-gold-400">
                  <span>{dest.isUpcoming ? 'Coming Soon' : 'Explore Courses'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
