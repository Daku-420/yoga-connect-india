import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, Building2, Compass, ShieldCheck } from 'lucide-react';

export const AIRetreatBanner: React.FC = () => {
  const { setIsAIQuizModalOpen, setIsAddCentreOpen } = useApp();

  return (
    <section className="py-20 bg-[#F7F5EE] border-b border-[#E2E5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: AI Retreat Matchmaker */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E2E5DD] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 bg-[#E6EDE2] text-[#263D32] px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#536B50]" />
                <span>AI Retreat Matchmaker</span>
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32]">
                Unsure which retreat fits your practice goals?
              </h3>
              <p className="text-[#59665C] text-sm leading-relaxed">
                Answer 3 quick questions about your experience level, preferred Himalayan scenery (high mountain silence or sacred riverbanks), and desired certification. Our quiz instantly recommends your ideal ashram.
              </p>
            </div>

            <div>
              <button
                onClick={() => setIsAIQuizModalOpen(true)}
                className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-medium px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center space-x-2"
              >
                <Compass className="w-4 h-4" />
                <span>Take the 1-Minute Matchmaker Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Dedicated CTA Inviting Yoga Centres to Join Platform */}
          <div className="bg-[#263D32] text-white rounded-2xl p-8 sm:p-10 border border-[#3D5E4C]/50 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center space-x-2 bg-white/10 text-[#A5B89A] px-3 py-1 rounded-full text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5 text-[#DCCDB5]" />
                <span>For Centre Owners & Ashrams</span>
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#F7F5EE]">
                List Your Yoga Centre or Ashram on YogaConnect India
              </h3>
              <p className="text-[#A5B89A] text-sm leading-relaxed">
                Connect with dedicated Indian and international practitioners seeking authentic Himalayan yoga, RYS teacher training, and Ayurvedic healing retreats. Zero listing fees, verified listings, and secure escrow handling.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAddCentreOpen(true)}
                className="bg-white text-[#263D32] hover:bg-[#F7F5EE] text-xs font-semibold px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center space-x-2"
              >
                <span>Submit Your Centre for Verification</span>
                <ArrowRight className="w-4 h-4 text-[#536B50]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
