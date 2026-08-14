import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export const AIRetreatBanner: React.FC = () => {
  const { setIsAIQuizModalOpen } = useApp();

  return (
    <section className="py-16 bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-sage-900 text-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-gold-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-sage-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Copy */}
        <div className="space-y-3 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-gold-300 text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED MATCHMAKER ENGINE</span>
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-sand-50">
            Unsure Which Indian Yoga Retreat Fits Your Goals?
          </h2>

          <p className="text-sand-100 text-sm sm:text-base font-sans font-light leading-relaxed">
            Answer 3 quick questions about your travel intent, preferred scenery (mountains, ocean, rivers), duration, and budget. Our AI Matchmaker will instantly score and curate top retreats for you.
          </p>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0">
          <button
            onClick={() => setIsAIQuizModalOpen(true)}
            className="bg-white hover:bg-sand-50 text-sage-950 font-serif font-bold px-8 py-4 rounded-xl text-base shadow-2xl hover:shadow-gold-500/20 transition transform hover:-translate-y-0.5 flex items-center space-x-3 border border-gold-400/50"
          >
            <Compass className="w-5 h-5 text-terracotta-600 animate-spin-slow" />
            <span>Start AI Retreat Quiz</span>
            <ArrowRight className="w-5 h-5 text-sage-900" />
          </button>
        </div>

      </div>
    </section>
  );
};
