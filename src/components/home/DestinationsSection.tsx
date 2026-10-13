import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockDestinations } from '../../data/mockDestinations';
import { MapPin, ArrowRight, Plane, Sparkles } from 'lucide-react';

export const DestinationsSection: React.FC = () => {
  const { setSelectedDestinationSlug, setActiveView, setFilters } = useApp();

  // Highlight Uttarakhand destinations
  const uttarakhandDests = mockDestinations.filter(d => 
    ['rishikesh', 'uttarkashi', 'dehradun', 'haridwar', 'nainital'].includes(d.slug)
  );

  return (
    <section className="py-20 bg-white border-t border-b border-[#E2E5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[#536B50] text-xs font-semibold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-[#536B50]" />
              <span>Sacred Himalayan Geography</span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#263D32]">
              Popular Uttarakhand Destinations
            </h2>
            <p className="text-[#59665C] text-sm mt-2 max-w-xl">
              From the Ganges foothills of Rishikesh to the high mountain silence of Uttarkashi and pine valleys of Dehradun.
            </p>
          </div>

          <button
            onClick={() => {
              setFilters(f => ({ ...f, searchLocation: 'all' }));
              setActiveView('destinations');
            }}
            className="inline-flex items-center space-x-2 text-[#263D32] font-semibold text-sm hover:text-[#536B50] transition group"
          >
            <span>Explore All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uttarakhandDests.map((dest) => (
            <div 
              key={dest.id}
              onClick={() => {
                setSelectedDestinationSlug(dest.slug);
                setFilters(f => ({ ...f, searchLocation: dest.name.split(' ')[0] }));
                setActiveView('retreats');
              }}
              className="card-lift bg-[#F7F5EE] rounded-2xl overflow-hidden border border-[#E2E5DD] hover:border-[#C5A880]/60 shadow-sm group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#E6EDE2] image-zoom-container">
                <img 
                  src={dest.coverImage} 
                  alt={dest.name} 
                  className="w-full h-full object-cover image-zoom-target"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-white/95 backdrop-blur-md text-[#263D32] text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                    {dest.retreatCount} Verified Retreats
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                  <span className="text-[11px] text-[#DCCDB5] flex items-center space-x-1 font-medium">
                    <Plane className="w-3 h-3 text-[#DCCDB5]" />
                    <span>{dest.nearbyAirport}</span>
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-white group-hover:text-[#F7F5EE] transition-colors leading-tight">
                    {dest.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-[#59665C] leading-relaxed line-clamp-2">
                  {dest.description}
                </p>

                <div className="pt-2 border-t border-[#E2E5DD] flex items-center justify-between text-xs font-semibold text-[#536B50]">
                  <span>Explore Centres in {dest.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
