import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  MapPin, 
  Search, 
  BookOpen, 
  Clock, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { 
    setActiveView, 
    filters, 
    setFilters 
  } = useApp();

  const [localLocation, setLocalLocation] = useState(filters.searchLocation || 'all');
  const [localCategory, setLocalCategory] = useState(filters.courseCategory || 'all');
  const [localDuration, setLocalDuration] = useState('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(f => {
      let minD = 0;
      let maxD = 30;
      if (localDuration === '7') { minD = 3; maxD = 7; }
      else if (localDuration === '14') { minD = 8; maxD = 14; }
      else if (localDuration === '28') { minD = 15; maxD = 30; }

      return {
        ...f,
        searchLocation: localLocation,
        courseCategory: localCategory,
        minDays: minD,
        maxDays: maxD
      };
    });
    setActiveView('retreats');
  };

  return (
    <section className="relative bg-[#263D32] text-[#F7F5EE] overflow-hidden pt-16 pb-24 lg:pt-20 lg:pb-32">
      
      {/* Background Himalayan Photography with Subtle Nature Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=2200&q=85" 
          alt="Himalayan Valley Sunrise along Ganges in Uttarakhand" 
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.05]"
        />
        {/* Soft gradient darkening for accessibility contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#263D32]/85 via-[#263D32]/75 to-[#263D32]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        
        {/* Editorial Subtitle Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#E6EDE2]/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E6EDE2]/25 text-[#A5B89A] text-xs sm:text-sm font-medium tracking-wide">
          <Award className="w-4 h-4 text-[#DCCDB5] shrink-0" />
          <span>Curated Himalayan Ashrams • Verified Yoga Alliance USA Accreditation</span>
        </div>

        {/* Headings */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-[#F7F5EE] leading-[1.1] tracking-tight">
            Find your balance. <br className="hidden sm:inline" />
            <span className="text-[#DCCDB5] italic font-normal">Find your place.</span>
          </h1>
          <p className="text-[#F7F5EE]/90 text-base sm:text-xl font-sans max-w-2xl mx-auto font-normal leading-relaxed">
            Discover authentic yoga centres, mindful experiences and transformative retreats in Uttarakhand.
          </p>
        </div>

        {/* Prominent Search Interface (Airbnb-inspired, legible, responsive) */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-5 border border-[#E2E5DD] text-left">
          <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
            
            {/* Filter 1: Destination */}
            <div className="space-y-1.5">
              <label htmlFor="hero-dest" className="text-xs font-semibold uppercase tracking-wider text-[#59665C] flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#536B50]" />
                <span>Destination</span>
              </label>
              <select
                id="hero-dest"
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl py-3 px-3.5 text-sm text-[#252C27] font-medium focus:ring-2 focus:ring-[#536B50] focus:outline-none cursor-pointer"
              >
                <option value="all">All Uttarakhand</option>
                <option value="Rishikesh">Rishikesh (Ganges Foothills)</option>
                <option value="Uttarkashi">Uttarkashi (High Himalayas)</option>
                <option value="Dehradun">Dehradun & Mussoorie</option>
                <option value="Haridwar">Haridwar (Ancient Ghats)</option>
                <option value="Nainital">Nainital & Almora (Kumaon)</option>
              </select>
            </div>

            {/* Filter 2: Yoga Style / Program */}
            <div className="space-y-1.5">
              <label htmlFor="hero-prog" className="text-xs font-semibold uppercase tracking-wider text-[#59665C] flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#536B50]" />
                <span>Experience / Style</span>
              </label>
              <select
                id="hero-prog"
                value={localCategory}
                onChange={(e) => setLocalCategory(e.target.value)}
                className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl py-3 px-3.5 text-sm text-[#252C27] font-medium focus:ring-2 focus:ring-[#536B50] focus:outline-none cursor-pointer"
              >
                <option value="all">All Styles & Retreats</option>
                <option value="200h-ttc">200-Hour Teacher Training (TTC)</option>
                <option value="300h-ttc">300-Hour Advanced TTC</option>
                <option value="meditation">Silent Meditation & Vipassana</option>
                <option value="ayurveda">Ayurvedic Panchakarma</option>
                <option value="breathwork">Himalayan Breathwork & Kriya</option>
                <option value="sound-healing">Nada & Sound Meditation</option>
              </select>
            </div>

            {/* Filter 3: Duration */}
            <div className="space-y-1.5">
              <label htmlFor="hero-dur" className="text-xs font-semibold uppercase tracking-wider text-[#59665C] flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#536B50]" />
                <span>Duration</span>
              </label>
              <select
                id="hero-dur"
                value={localDuration}
                onChange={(e) => setLocalDuration(e.target.value)}
                className="w-full bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl py-3 px-3.5 text-sm text-[#252C27] font-medium focus:ring-2 focus:ring-[#536B50] focus:outline-none cursor-pointer"
              >
                <option value="all">Any Duration</option>
                <option value="7">3 to 7 Days (Short Retreat)</option>
                <option value="14">8 to 14 Days (Immersion)</option>
                <option value="28">15 to 28 Days (Full TTC)</option>
              </select>
            </div>

            {/* Primary Search CTA Action */}
            <div>
              <button
                type="submit"
                className="w-full bg-[#536B50] hover:bg-[#40563E] text-white font-medium py-3 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center space-x-2 h-[46px]"
              >
                <Search className="w-4 h-4 text-white" />
                <span>Search Retreats</span>
              </button>
            </div>

          </form>

          {/* Quick Filter Tags & AI Assistant helper */}
          <div className="mt-4 pt-3.5 border-t border-[#E2E5DD] flex flex-wrap items-center justify-between text-xs text-[#59665C] gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-[#252C27]">Popular:</span>
              <button 
                type="button" 
                onClick={() => { setLocalLocation('Rishikesh'); setLocalCategory('200h-ttc'); }}
                className="bg-[#E6EDE2] hover:bg-[#D4E0CE] text-[#263D32] px-2.5 py-1 rounded-full transition"
              >
                Rishikesh 200h TTC
              </button>
              <button 
                type="button" 
                onClick={() => { setLocalLocation('Uttarkashi'); setLocalCategory('meditation'); }}
                className="bg-[#E6EDE2] hover:bg-[#D4E0CE] text-[#263D32] px-2.5 py-1 rounded-full transition"
              >
                Uttarkashi Meditation
              </button>
              <button 
                type="button" 
                onClick={() => { setLocalLocation('Rishikesh'); setLocalCategory('ayurveda'); }}
                className="bg-[#E6EDE2] hover:bg-[#D4E0CE] text-[#263D32] px-2.5 py-1 rounded-full transition"
              >
                Himalayan Ayurveda
              </button>
            </div>
          </div>

        </div>

        {/* Trust Badges */}
        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          
          <div className="bg-[#E6EDE2]/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center space-x-1.5 text-[#DCCDB5] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#A5B89A]" />
              <span>100% Escrow Protection</span>
            </div>
            <p className="text-[#A5B89A] text-xs mt-1">Admin oversight before any funds release</p>
          </div>

          <div className="bg-[#E6EDE2]/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center space-x-1.5 text-[#DCCDB5] text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#A5B89A]" />
              <span>Vetted Yoga Ashrams</span>
            </div>
            <p className="text-[#A5B89A] text-xs mt-1">Physical facility & lineage verified</p>
          </div>

          <div className="bg-[#E6EDE2]/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center space-x-1.5 text-[#DCCDB5] text-xs font-semibold">
              <Award className="w-4 h-4 text-[#A5B89A]" />
              <span>Yoga Alliance RYS</span>
            </div>
            <p className="text-[#A5B89A] text-xs mt-1">Official 200h, 300h & 500h standards</p>
          </div>

          <div className="bg-[#E6EDE2]/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center space-x-1.5 text-[#DCCDB5] text-xs font-semibold">
              <Clock className="w-4 h-4 text-[#A5B89A]" />
              <span>Direct Ashram Rates</span>
            </div>
            <p className="text-[#A5B89A] text-xs mt-1">Transparent multi-currency pricing</p>
          </div>

        </div>

      </div>

    </section>
  );
};
