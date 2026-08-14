import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ShieldCheck, Award, ArrowRight, Play, Star, MapPin } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveView, setIsAIQuizModalOpen, setFilters } = useApp();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-sage-950 text-white">
      {/* Video / Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=2000&q=80" 
          alt="Himalayan Yoga Retreat Sunrise" 
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-75 transition-transform duration-10000 animate-pulse"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sage-950 via-sage-950/60 to-transparent" />
        <div className="absolute inset-0 bg-sage-900/30 backdrop-blur-[1px]" />
      </div>

      {/* Hero Content Box */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
        
        {/* Verified Badge Header */}
        <div className="inline-flex items-center space-x-2 bg-sand-50/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-sand-50/30 text-sand-100 text-xs sm:text-sm font-medium shadow-lg animate-fade-in">
          <Award className="w-4 h-4 text-gold-400" />
          <span>Yoga Alliance USA Certified Retreats & 100% Escrow Protection</span>
        </div>

        {/* Headlines */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-serif font-bold text-4xl sm:text-6xl lg:text-7xl text-sand-50 leading-[1.1] tracking-tight">
            Discover India's Best <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sand-100 via-gold-400 to-terracotta-400 bg-clip-text text-transparent">
              Yoga Retreats & Teacher Training
            </span>
          </h1>
          <p className="text-sand-200 text-base sm:text-xl font-sans max-w-2xl mx-auto font-light leading-relaxed">
            Compare certified yoga centres, explore authentic ashrams, and book your perfect wellness journey through our secure platform.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button 
            onClick={() => setActiveView('retreats')}
            className="w-full sm:w-auto bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-500 hover:to-terracotta-600 text-white font-medium px-8 py-4 rounded-xl text-base shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 border border-terracotta-400/40"
          >
            <span>Explore Retreats & TTC</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button 
            onClick={() => {
              setFilters(f => ({ ...f, courseCategory: '200h-ttc' }));
              setActiveView('retreats');
            }}
            className="w-full sm:w-auto bg-sand-50/15 hover:bg-sand-50/25 text-white font-medium px-7 py-4 rounded-xl text-base backdrop-blur-md border border-white/20 transition flex items-center justify-center space-x-2"
          >
            <span>Find Teacher Training</span>
          </button>

          <button 
            onClick={() => setIsAIQuizModalOpen(true)}
            className="w-full sm:w-auto bg-sage-800/80 hover:bg-sage-700/90 text-gold-400 font-medium px-6 py-4 rounded-xl text-base backdrop-blur-md border border-gold-400/40 transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span>AI Retreat Matchmaker</span>
          </button>
        </div>

        {/* Social Proof & Trust Stats */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="bg-sand-50/10 backdrop-blur-sm p-3 rounded-lg border border-white/10">
            <div className="flex items-center space-x-1 text-gold-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
              <span className="text-white text-xs font-bold ml-1">4.95 / 5</span>
            </div>
            <p className="text-sand-300 text-xs mt-1">15,000+ Verified International Reviews</p>
          </div>

          <div className="bg-sand-50/10 backdrop-blur-sm p-3 rounded-lg border border-white/10">
            <div className="text-gold-400 font-serif font-bold text-lg">100%</div>
            <p className="text-sand-300 text-xs mt-1">Escrow Admin Lead Protection</p>
          </div>

          <div className="bg-sand-50/10 backdrop-blur-sm p-3 rounded-lg border border-white/10">
            <div className="text-gold-400 font-serif font-bold text-lg">RYS 200/500</div>
            <p className="text-sand-300 text-xs mt-1">Yoga Alliance USA Accredited</p>
          </div>

          <div className="bg-sand-50/10 backdrop-blur-sm p-3 rounded-lg border border-white/10">
            <div className="flex items-center space-x-1 text-gold-400">
              <MapPin className="w-4 h-4 text-terracotta-400" />
              <span className="text-white text-xs font-bold">8 Destinations</span>
            </div>
            <p className="text-sand-300 text-xs mt-1">Rishikesh, Goa, Kerala & More</p>
          </div>
        </div>

      </div>
    </section>
  );
};
