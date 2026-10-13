import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  ArrowUpRight, 
  ArrowRight,
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { 
    setActiveView, 
    setFilters 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();

    setFilters(f => {
      let location = f.searchLocation || 'all';
      let category = 'all';

      // Smart keyword parsing
      if (query.includes('rishikesh')) location = 'Rishikesh';
      else if (query.includes('uttarkashi')) location = 'Uttarkashi';
      else if (query.includes('dehradun')) location = 'Dehradun';
      else if (query.includes('haridwar')) location = 'Haridwar';
      else if (query.includes('nainital')) location = 'Nainital';

      if (query.includes('ttc') || query.includes('200h') || query.includes('teacher') || query.includes('300h')) {
        category = '200h-ttc';
      } else if (query.includes('ayurveda') || query.includes('detox') || query.includes('panchakarma')) {
        category = 'ayurveda';
      } else if (query.includes('meditation') || query.includes('silent') || query.includes('mauna') || query.includes('vipassana')) {
        category = 'meditation';
      } else if (query.includes('breath') || query.includes('pranayama') || query.includes('kriya') || query.includes('kundalini')) {
        category = 'breathwork';
      } else if (query.includes('sound') || query.includes('nada')) {
        category = 'sound-healing';
      }

      return {
        ...f,
        searchLocation: location,
        courseCategory: category
      };
    });

    setActiveView('retreats');
  };

  const handleQuickTag = (location?: string, category?: string) => {
    setFilters(f => ({
      ...f,
      searchLocation: location || 'all',
      courseCategory: category || 'all'
    }));
    setActiveView('retreats');
  };

  const popularStyles = [
    { label: 'VINYASA', category: 'all' },
    { label: 'HATHA', category: 'all' },
    { label: 'YIN', category: 'meditation' },
    { label: 'ASHTANGA', category: '200h-ttc' },
    { label: 'KUNDALINI', category: 'breathwork' },
    { label: 'AYURVEDA', category: 'ayurveda' }
  ];

  return (
    <section className="bg-[#FAF8F5] pt-4 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Main Curved Hero Canvas Card */}
        <div className="relative rounded-[2.25rem] sm:rounded-[3rem] overflow-hidden border border-[#E8E5DD] shadow-sm min-h-[580px] lg:min-h-[640px] flex flex-col justify-center items-center text-center p-6 sm:p-12 lg:p-16">
          
          {/* Background Photography with Warm Ethereal Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=85" 
              alt="Himalayan Yoga Practice at Golden Hour" 
              className="w-full h-full object-cover object-center filter contrast-[1.03] brightness-[1.02]"
            />
            {/* Soft, luminous gradient overlay matching reference aesthetics */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5EE]/80 via-[#F7F5EE]/65 to-[#F7F5EE]/85 backdrop-blur-[1px]" />
          </div>

          {/* Hero Foreground Content */}
          <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-black/5 text-[#263D32] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase shadow-xs">
              <span>HIMALAYAN YOGA DIRECTORY</span>
            </div>

            {/* Giant Bold Headline */}
            <div className="space-y-3">
              <h1 className="font-sans font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#1A261D] uppercase leading-none">
                YOGA CONNECT
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#3E4F42] max-w-xl mx-auto font-medium leading-relaxed">
                Ask for anything — an authentic ashram, a revered master, a 200h TTC, or mindful retreats in Uttarakhand.
              </p>
            </div>

            {/* Floating Pill Search Bar */}
            <div className="w-full max-w-2xl mx-auto pt-2">
              <form 
                onSubmit={handleSearch}
                className="bg-white/95 backdrop-blur-md rounded-full p-2 pl-5 sm:pl-6 shadow-xl border border-black/10 flex items-center transition-all focus-within:ring-2 focus-within:ring-[#263D32] group"
              >
                <Search className="w-5 h-5 text-[#6B786E] mr-3 shrink-0" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Ask anything — "beginner yoga in Rishikesh" or "200h TTC"'
                  className="flex-1 bg-transparent text-xs sm:text-sm text-[#252C27] placeholder:text-[#8E9B91] focus:outline-none"
                />
                <button 
                  type="submit"
                  className="bg-[#1C2820] hover:bg-[#2C3E32] text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-md transition-all shrink-0 cursor-pointer"
                >
                  Ask
                </button>
              </form>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-2xl mx-auto text-xs">
              <button 
                type="button"
                onClick={() => handleQuickTag('Rishikesh', 'all')}
                className="bg-white/80 hover:bg-white text-[#2C3E32] px-3.5 py-1.5 rounded-full font-medium border border-black/5 shadow-xs transition hover:shadow-sm"
              >
                Beginner retreat in Rishikesh
              </button>
              <button 
                type="button"
                onClick={() => handleQuickTag(undefined, 'ayurveda')}
                className="bg-white/80 hover:bg-white text-[#2C3E32] px-3.5 py-1.5 rounded-full font-medium border border-black/5 shadow-xs transition hover:shadow-sm"
              >
                Yoga for back pain &amp; detox
              </button>
              <button 
                type="button"
                onClick={() => handleQuickTag(undefined, '200h-ttc')}
                className="bg-white/80 hover:bg-white text-[#2C3E32] px-3.5 py-1.5 rounded-full font-medium border border-black/5 shadow-xs transition hover:shadow-sm"
              >
                Find 200h TTC master
              </button>
              <button 
                type="button"
                onClick={() => handleQuickTag('Rishikesh', 'all')}
                className="bg-white/80 hover:bg-white text-[#2C3E32] px-3.5 py-1.5 rounded-full font-medium border border-black/5 shadow-xs transition hover:shadow-sm"
              >
                Best ashrams near Ganges
              </button>
            </div>

            {/* Subtle Guidance Line */}
            <p className="text-xs text-[#5D6D61] pt-1">
              Our platform curates verified Himalayan sanctuaries, master teachers, and retreats for you.
            </p>

            {/* Popular Styles Row */}
            <div className="w-full max-w-lg mx-auto pt-5 border-t border-black/10">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6B786E] block mb-2.5">
                POPULAR STYLES
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {popularStyles.map((style) => (
                  <button
                    key={style.label}
                    type="button"
                    onClick={() => handleQuickTag(undefined, style.category)}
                    className="bg-white/85 hover:bg-white text-[#2C3E32] text-[11px] font-bold px-4 py-1.5 rounded-full border border-black/5 shadow-xs transition hover:scale-105"
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* 3 Aesthetic Reference Feature Cards directly below Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Dark Luxury Marketplace Card */}
          <div 
            onClick={() => setActiveView('retreats')}
            className="bg-[#19221C] text-[#F7F5EE] rounded-[2.25rem] p-7 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group cursor-pointer border border-[#2D3B31] min-h-[380px] transition-transform hover:-translate-y-1"
          >
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A5B89A] block">
                MARKETPLACE &amp; DIRECTORY
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                Curated Ashrams
              </h3>
              <p className="text-xs text-[#A5B89A] leading-relaxed max-w-xs">
                Traditional Vedic Lineages, Organic Satvik Meals &amp; Yoga Alliance RYS 200h Certification.
              </p>
            </div>

            {/* Nested Preview Card */}
            <div className="relative z-10 pt-4">
              <div className="bg-[#243027] rounded-2xl p-3 border border-white/10 shadow-lg flex items-center space-x-3.5 transform group-hover:scale-[1.02] transition-transform">
                <img 
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=300&q=80" 
                  alt="Himalayan Ashram Preview" 
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <span className="bg-white/10 text-[#DCCDB5] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                    Verified Sanctuary
                  </span>
                  <div className="font-medium text-xs text-white">Parmarth &amp; Sivananda Roots</div>
                  <div className="text-[11px] text-[#A5B89A]">Starting from $35 / day</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-semibold text-[#DCCDB5] group-hover:text-white">
              <span>Explore All Verified Centres</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Bright Architectural Space Card */}
          <div 
            onClick={() => setActiveView('destinations')}
            className="relative rounded-[2.25rem] overflow-hidden min-h-[380px] group cursor-pointer shadow-sm border border-[#E8E5DD] transition-transform hover:-translate-y-1"
          >
            <img 
              src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80" 
              alt="Sunlit Himalayan Yoga Shala" 
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Top Right Floating Circle Arrow */}
            <div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1E2922] shadow-md group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-5 h-5" />
            </div>

            {/* Bottom Gradient Caption */}
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 bg-gradient-to-t from-black/80 via-black/35 to-transparent text-white">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#DCCDB5] block mb-1">
                Sacred Spaces
              </span>
              <h4 className="font-serif font-bold text-xl sm:text-2xl text-white">
                Ganges Shalas &amp; Mountain Sanctuaries
              </h4>
              <p className="text-xs text-[#E6EDE2]/90 mt-1">
                Explore peaceful ashram architecture in Rishikesh and high Uttarkashi valleys.
              </p>
            </div>
          </div>

          {/* Card 3: Next Up Practice Card */}
          <div 
            onClick={() => handleQuickTag(undefined, '200h-ttc')}
            className="relative rounded-[2.25rem] overflow-hidden min-h-[380px] group cursor-pointer shadow-sm border border-[#E8E5DD] transition-transform hover:-translate-y-1"
          >
            <img 
              src="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80" 
              alt="Yoga TTC Practitioners in Shala" 
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Top Left Next Up Badge with Pulse Dot */}
            <div className="absolute top-5 left-5 inline-flex items-center space-x-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>NEXT UP</span>
            </div>

            {/* Bottom Gradient Caption */}
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#DCCDB5] block mb-1">
                Teacher Training
              </span>
              <h4 className="font-serif font-bold text-xl sm:text-2xl text-white">
                200-Hour Multi-Style TTC
              </h4>
              <p className="text-xs text-[#E6EDE2]/90 mt-1">
                Yoga Alliance USA RYS • Enrolling next Himalayan batch with 100% Escrow Protection.
              </p>
            </div>
          </div>

        </div>

        {/* Minimal Trust Strip */}
        <div className="pt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#59665C]">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#E8E5DD] shadow-xs flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6EDE2] text-[#263D32] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#536B50]" />
            </div>
            <div>
              <div className="font-bold text-[#263D32]">100% Escrow Protection</div>
              <div className="text-[11px] text-[#59665C]">Admin oversight on all bookings</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#E8E5DD] shadow-xs flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6EDE2] text-[#263D32] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#536B50]" />
            </div>
            <div>
              <div className="font-bold text-[#263D32]">Vetted Yoga Ashrams</div>
              <div className="text-[11px] text-[#59665C]">Physical lineage &amp; shala verification</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#E8E5DD] shadow-xs flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6EDE2] text-[#263D32] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#536B50]" />
            </div>
            <div>
              <div className="font-bold text-[#263D32]">Yoga Alliance RYS</div>
              <div className="text-[11px] text-[#59665C]">Official 200h &amp; 300h certification</div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#E8E5DD] shadow-xs flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6EDE2] text-[#263D32] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#536B50]" />
            </div>
            <div>
              <div className="font-bold text-[#263D32]">Direct Ashram Rates</div>
              <div className="text-[11px] text-[#59665C]">Multi-currency transparent pricing</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
