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
    // Smart AI match score algorithm simulation
    const scored = centres.map(centre => {
      let score = 75; // base score

      if (intent === 'ttc' && centre.certification.includes('RYS')) score += 15;
      if (intent === 'ayurveda' && centre.name.toLowerCase().includes('ayurveda')) score += 20;
      if (environment === 'mountains' && (centre.city === 'Rishikesh' || centre.city === 'Dharamshala')) score += 10;
      if (environment === 'beach' && centre.city === 'Goa') score += 15;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-sand-50 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-sand-300 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-sand-300 bg-sand-50/95 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta-500 to-sage-900 text-gold-400 flex items-center justify-center shadow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-sage-950">
                AI Retreat Matchmaker ("AI Guru")
              </h3>
              <span className="text-[10px] text-sage-600 font-semibold uppercase tracking-wider block">
                Find Your Ideal Indian Wellness Sanctuary
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsAIQuizModalOpen(false)}
            className="p-1.5 text-sage-500 hover:text-sage-900 rounded-full hover:bg-sand-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 text-sm text-sage-900">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-terracotta-600 tracking-wider">Step 1 of 3</span>
                <h4 className="font-serif font-bold text-2xl text-sage-950">What is your primary travel goal?</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'ttc', title: 'Yoga Teacher Certification (TTC)', desc: '200h / 300h Yoga Alliance worldwide accredited certification' },
                  { id: 'ayurveda', title: 'Ayurvedic Panchakarma Detox', desc: 'Medical doctor supervised oil therapies and dosha body balance' },
                  { id: 'spiritual', title: 'Himalayan Spiritual & Sound Retreat', desc: 'Ganges sunrise meditation, sound baths & chanting' },
                  { id: 'detox', title: 'Oceanfront Beach Vinyasa & Yin', desc: 'Tropical ocean waves, relaxing yin yoga & superfood nutrition' },
                ].map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => setIntent(opt.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      intent === opt.id 
                        ? 'border-terracotta-600 bg-white shadow-md ring-2 ring-terracotta-500/20' 
                        : 'border-sand-300 bg-sand-100 hover:bg-white'
                    }`}
                  >
                    <h5 className="font-serif font-bold text-base text-sage-950 mb-1">{opt.title}</h5>
                    <p className="text-xs text-sage-600 leading-relaxed">{opt.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-sage-900 text-white font-medium py-3 rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2"
              >
                <span>Next: Preferred Environment</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-terracotta-600 tracking-wider">Step 2 of 3</span>
                <h4 className="font-serif font-bold text-2xl text-sage-950">Where do you feel most peaceful?</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'mountains', label: 'Himalayan Mountains (Dharamshala)', icon: '🏔️' },
                  { id: 'river', label: 'Sacred Ganga River (Rishikesh)', icon: '🌊' },
                  { id: 'beach', label: 'Tropical Ocean Beach (Goa)', icon: '🏖️' },
                  { id: 'forest', label: 'Kerala Backwaters & Palms', icon: '🌴' },
                ].map(env => (
                  <div
                    key={env.id}
                    onClick={() => setEnvironment(env.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer text-center transition ${
                      environment === env.id 
                        ? 'border-terracotta-600 bg-white shadow-md ring-2 ring-terracotta-500/20' 
                        : 'border-sand-300 bg-sand-100 hover:bg-white'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{env.icon}</span>
                    <span className="font-serif font-bold text-sm text-sage-950">{env.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <button onClick={() => setStep(1)} className="bg-sand-200 text-sage-800 p-3 rounded-xl">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-sage-900 text-white font-medium py-3 rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2"
                >
                  <span>Next: Duration & Calculate Match</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-terracotta-600 tracking-wider">Step 3 of 3</span>
                <h4 className="font-serif font-bold text-2xl text-sage-950">Select Preferred Duration</h4>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { id: '7', label: '7 Days Renewal' },
                  { id: '14', label: '14 Days Immersion' },
                  { id: '28', label: '28 Days Full TTC' },
                ].map(dur => (
                  <div
                    key={dur.id}
                    onClick={() => setDuration(dur.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      duration === dur.id 
                        ? 'border-terracotta-600 bg-white shadow-md ring-2 ring-terracotta-500/20' 
                        : 'border-sand-300 bg-sand-100 hover:bg-white'
                    }`}
                  >
                    <span className="font-serif font-bold text-base text-sage-950 block">{dur.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCalculateMatch}
                className="w-full bg-gradient-to-r from-terracotta-600 to-sage-900 text-white font-serif font-bold py-4 rounded-xl text-base shadow-xl transition flex items-center justify-center space-x-2"
              >
                <Compass className="w-5 h-5 text-gold-400 animate-spin-slow" />
                <span>Calculate AI Retreat Matches</span>
              </button>
            </div>
          )}

          {/* STEP 4: AI Recommendations Output */}
          {step === 4 && matches && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <span className="bg-gold-500/20 text-gold-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Match Completed
                  </span>
                  <h4 className="font-serif font-bold text-2xl text-sage-950 mt-1">Your Top AI Matched Retreats</h4>
                </div>

                <button
                  onClick={handleResetQuiz}
                  className="text-xs text-terracotta-600 font-semibold flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
              </div>

              <div className="space-y-4">
                {matches.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-2xl border border-sand-300 p-6 space-y-2">
                    <p className="text-xs text-sage-600 font-medium">No yoga centres are currently registered for matching.</p>
                  </div>
                ) : (
                  matches.map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-sand-300 shadow-luxury flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <img src={item.centre.coverImage} alt={item.centre.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              {item.score}% Match Score
                            </span>
                            <span className="text-xs text-sage-500">{item.centre.city}</span>
                          </div>
                          <h5 className="font-serif font-bold text-lg text-sage-950 leading-tight">{item.centre.name}</h5>
                          <p className="text-xs text-sage-600 line-clamp-1">{item.recommendedCourse?.title || 'Yoga Course'}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                        <span className="font-serif font-bold text-lg text-terracotta-600">
                          {formatPrice(item.centre.startingPriceUSD)}
                        </span>

                        <button
                          onClick={() => {
                            setIsAIQuizModalOpen(false);
                            setSelectedCentreId(item.centre.id);
                            setIsBookingModalOpen(true);
                          }}
                          className="bg-sage-900 text-white font-medium px-4 py-2 rounded-lg text-xs shadow hover:bg-sage-800 transition"
                        >
                          Request Booking
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
