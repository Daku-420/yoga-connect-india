import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Star,
  Award,
  RefreshCw
} from 'lucide-react';

export const AIRetreatQuizModal: React.FC = () => {
  const { 
    isAIQuizModalOpen, 
    setIsAIQuizModalOpen, 
    centres, 
    courses, 
    formatPrice, 
    setSelectedCentreId, 
    setActiveView,
    setIsBookingModalOpen
  } = useApp();

  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<'ttc' | 'spiritual' | 'ayurveda' | 'detox'>('ttc');
  const [environment, setEnvironment] = useState<'mountains' | 'river' | 'beach' | 'forest'>('mountains');
  const [duration, setDuration] = useState<'7' | '14' | '28'>('28');

  const [matches, setMatches] = useState<any[] | null>(null);

  if (!isAIQuizModalOpen) return null;

  const handleCalculateMatch = () => {
    const scored = centres.map(centre => {
      let score = 75; // base score

      if (intent === 'ttc' && centre.certification.includes('RYS')) score += 15;
      if (intent === 'ayurveda' && centre.name.toLowerCase().includes('ayurveda')) score += 20;
      if (environment === 'mountains' && (centre.city === 'Rishikesh' || centre.city === 'Uttarkashi')) score += 15;
      if (environment === 'river' && centre.city === 'Rishikesh') score += 15;

      const matchedCourse = courses.find(c => c.centreId === centre.id) || courses[0];

      return {
        centre,
        score: Math.min(score, 98),
        recommendedCourse: matchedCourse
      };
    }).sort((a, b) => b.score - a.score);

    setMatches(scored.slice(0, 3));
    setStep(4);
  };

  const handleResetQuiz = () => {
    setStep(1);
    setMatches(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F7F5EE] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#E2E5DD] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E2E5DD] bg-white sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#536B50] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#E6EDE2]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#263D32]">
                AI Retreat Matchmaker
              </h3>
              <span className="text-[10px] text-[#59665C] font-semibold uppercase tracking-wider block">
                Find Your Ideal Himalayan Sanctuary
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsAIQuizModalOpen(false)}
            className="p-1.5 text-[#59665C] hover:text-[#263D32] rounded-full hover:bg-[#E6EDE2] transition"
            aria-label="Close quiz modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 text-sm text-[#252C27]">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-semibold text-[#536B50] tracking-wider">Step 1 of 3</span>
                <h4 className="font-serif font-bold text-2xl text-[#263D32]">What is your primary travel goal?</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'ttc', title: 'Yoga Teacher Training (TTC)', desc: '200h / 300h Yoga Alliance worldwide accredited certification in Rishikesh' },
                  { id: 'ayurveda', title: 'Ayurvedic Panchakarma Detox', desc: 'Doctor-supervised herbal treatments, daily oil therapies and dosha rebalancing' },
                  { id: 'spiritual', title: 'Himalayan Spiritual & Sound Retreat', desc: 'Sacred Ganges sunrise meditation, sound baths and temple rituals' },
                  { id: 'detox', title: 'Restorative Meditation & Nature', desc: 'Quiet high mountain silence, walking meditation, and nervous system reset' },
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setIntent(opt.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      intent === opt.id 
                        ? 'border-[#536B50] bg-white shadow-sm ring-1 ring-[#536B50]' 
                        : 'border-[#E2E5DD] bg-white hover:bg-[#E6EDE2]/50'
                    }`}
                  >
                    <h5 className="font-serif font-bold text-base text-[#263D32] mb-1">{opt.title}</h5>
                    <p className="text-xs text-[#59665C] leading-relaxed">{opt.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#536B50] hover:bg-[#40563E] text-white font-medium py-3.5 rounded-xl text-sm shadow-sm transition flex items-center justify-center space-x-2"
              >
                <span>Next: Preferred Environment</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-semibold text-[#536B50] tracking-wider">Step 2 of 3</span>
                <h4 className="font-serif font-bold text-2xl text-[#263D32]">Where do you feel most peaceful?</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'mountains', label: 'High Himalayan Peaks (Uttarkashi)', icon: '🏔️' },
                  { id: 'river', label: 'Sacred Ganga Foothills (Rishikesh)', icon: '🌊' },
                  { id: 'forest', label: 'Pine Valleys & Sal Woods (Dehradun)', icon: '🌲' },
                  { id: 'beach', label: 'Lake Silence & High Ridges (Nainital)', icon: '⛰️' },
                ].map(env => (
                  <div
                    key={env.id}
                    onClick={() => setEnvironment(env.id as any)}
                    className={`p-5 rounded-xl border cursor-pointer text-center transition ${
                      environment === env.id 
                        ? 'border-[#536B50] bg-white shadow-sm ring-1 ring-[#536B50]' 
                        : 'border-[#E2E5DD] bg-white hover:bg-[#E6EDE2]/50'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{env.icon}</span>
                    <span className="font-serif font-bold text-sm text-[#263D32]">{env.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <button onClick={() => setStep(1)} className="bg-white border border-[#E2E5DD] text-[#263D32] px-5 py-3.5 rounded-xl font-medium text-sm">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-[#536B50] hover:bg-[#40563E] text-white font-medium py-3.5 rounded-xl text-sm shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <span>Next: Preferred Duration</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-semibold text-[#536B50] tracking-wider">Step 3 of 3</span>
                <h4 className="font-serif font-bold text-2xl text-[#263D32]">Select Preferred Duration</h4>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { id: '7', label: '7 Days Short Retreat' },
                  { id: '14', label: '14 Days Immersion' },
                  { id: '28', label: '24-28 Days Full TTC' },
                ].map(dur => (
                  <div
                    key={dur.id}
                    onClick={() => setDuration(dur.id as any)}
                    className={`p-5 rounded-xl border cursor-pointer transition ${
                      duration === dur.id 
                        ? 'border-[#536B50] bg-white shadow-sm ring-1 ring-[#536B50]' 
                        : 'border-[#E2E5DD] bg-white hover:bg-[#E6EDE2]/50'
                    }`}
                  >
                    <span className="font-serif font-bold text-sm text-[#263D32] block">{dur.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCalculateMatch}
                className="w-full bg-[#536B50] hover:bg-[#40563E] text-white font-serif font-bold py-4 rounded-xl text-base shadow-sm transition flex items-center justify-center space-x-2"
              >
                <Compass className="w-5 h-5 text-white animate-spin-slow" />
                <span>Calculate My Top Retreat Matches</span>
              </button>
            </div>
          )}

          {/* STEP 4: AI Recommendations Output */}
          {step === 4 && matches && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <span className="bg-[#E6EDE2] text-[#286749] text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Match Complete
                  </span>
                  <h4 className="font-serif font-bold text-2xl text-[#263D32] mt-1">Your Recommended Uttarakhand Sanctuaries</h4>
                </div>

                <button
                  onClick={handleResetQuiz}
                  className="text-xs text-[#536B50] hover:text-[#40563E] font-semibold flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
              </div>

              <div className="space-y-4">
                {matches.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-sm flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <img src={item.centre.coverImage} alt={item.centre.name} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#E2E5DD]" />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="bg-[#E6EDE2] text-[#286749] text-[10px] font-bold px-2 py-0.5 rounded">
                            {item.score}% Compatibility
                          </span>
                          <span className="text-xs text-[#59665C]">{item.centre.city}</span>
                        </div>
                        <h5 className="font-serif font-bold text-lg text-[#263D32] leading-tight">{item.centre.name}</h5>
                        <p className="text-xs text-[#59665C] line-clamp-1">{item.recommendedCourse?.title || 'Yoga Course'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                      <span className="font-serif font-bold text-lg text-[#263D32]">
                        {formatPrice(item.centre.startingPriceUSD)}
                      </span>

                      <button
                        onClick={() => {
                          setIsAIQuizModalOpen(false);
                          setSelectedCentreId(item.centre.id);
                          setIsBookingModalOpen(true);
                        }}
                        className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium px-4 py-2 rounded-lg text-xs shadow-sm transition"
                      >
                        Enquire Retreat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
