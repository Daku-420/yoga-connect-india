import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Award, 
  HeartHandshake, 
  Compass, 
  MapPin,
  PlusCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    setActiveView, 
    setIsAddCentreOpen,
    setSelectedDestinationSlug,
    setFilters
  } = useApp();

  const handleDestinationClick = (city: string) => {
    setFilters(f => ({ ...f, searchLocation: city }));
    setActiveView('retreats');
  };

  const handleCategoryClick = (category: string) => {
    setFilters(f => ({ ...f, courseCategory: category }));
    setActiveView('retreats');
  };

  return (
    <footer className="bg-[#263D32] text-[#F7F5EE] pt-16 pb-12 border-t border-[#1E3228]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Trust Feature Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#3D5E4C]/40">
          
          <div className="flex items-start space-x-3.5 bg-[#1E3228] p-4 rounded-xl border border-[#3D5E4C]/30">
            <div className="w-10 h-10 rounded-lg bg-[#536B50] flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#E6EDE2]" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm font-serif">100% Admin Escrow</h4>
              <p className="text-[#A5B89A] text-xs mt-1">
                Your contact details stay private with admin until booking confirmation. Zero direct spam.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 bg-[#1E3228] p-4 rounded-xl border border-[#3D5E4C]/30">
            <div className="w-10 h-10 rounded-lg bg-[#536B50] flex items-center justify-center text-white shrink-0">
              <Award className="w-5 h-5 text-[#E6EDE2]" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm font-serif">Yoga Alliance Certified</h4>
              <p className="text-[#A5B89A] text-xs mt-1">
                Listed Himalayan TTC schools hold verified RYS 200, 300, or 500 accreditation.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 bg-[#1E3228] p-4 rounded-xl border border-[#3D5E4C]/30">
            <div className="w-10 h-10 rounded-lg bg-[#536B50] flex items-center justify-center text-white shrink-0">
              <Lock className="w-5 h-5 text-[#E6EDE2]" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm font-serif">Direct Ashram Rates</h4>
              <p className="text-[#A5B89A] text-xs mt-1">
                Transparent multi-currency pricing in USD, EUR, GBP, AUD, CAD, and INR with zero markup.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 bg-[#1E3228] p-4 rounded-xl border border-[#3D5E4C]/30">
            <div className="w-10 h-10 rounded-lg bg-[#536B50] flex items-center justify-center text-white shrink-0">
              <HeartHandshake className="w-5 h-5 text-[#E6EDE2]" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm font-serif">Pre-Arrival Concierge</h4>
              <p className="text-[#A5B89A] text-xs mt-1">
                Assistance with Indian e-visas, airport transfers from Dehradun (DED), and dietary plans.
              </p>
            </div>
          </div>

        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-4 border-b border-[#3D5E4C]/40 text-xs">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="bg-[#F7F5EE] p-2.5 rounded-2xl shadow-sm border border-white/10 inline-block">
                <img 
                  src="/pictures/yogaconnect_india_logo.svg" 
                  alt="YogaConnect India" 
                  className="h-20 w-auto object-contain" 
                />
              </div>
            </div>
            <p className="text-[#A5B89A] leading-relaxed max-w-sm">
              The curated discovery marketplace connecting Indian and international practitioners with verified yoga ashrams, master teachers, and transformative retreats across Uttarakhand.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsAddCentreOpen(true)}
                className="inline-flex items-center space-x-2 border border-[#A5B89A] hover:bg-[#536B50] hover:border-[#536B50] text-[#F7F5EE] px-4 py-2 rounded-lg transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your Centre on Platform</span>
              </button>
            </div>
          </div>

          {/* Destinations */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Uttarakhand
            </h5>
            <ul className="space-y-2 text-[#A5B89A]">
              <li>
                <button onClick={() => handleDestinationClick('Rishikesh')} className="hover:text-white transition">
                  Rishikesh (Ganges Foothills)
                </button>
              </li>
              <li>
                <button onClick={() => handleDestinationClick('Uttarkashi')} className="hover:text-white transition">
                  Uttarkashi (High Himalayas)
                </button>
              </li>
              <li>
                <button onClick={() => handleDestinationClick('Dehradun')} className="hover:text-white transition">
                  Dehradun & Mussoorie
                </button>
              </li>
              <li>
                <button onClick={() => handleDestinationClick('Haridwar')} className="hover:text-white transition">
                  Haridwar (Ancient Ghats)
                </button>
              </li>
              <li>
                <button onClick={() => handleDestinationClick('Nainital')} className="hover:text-white transition">
                  Nainital & Almora (Kumaon)
                </button>
              </li>
            </ul>
          </div>

          {/* Programs & Styles */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Retreat Programs
            </h5>
            <ul className="space-y-2 text-[#A5B89A]">
              <li>
                <button onClick={() => handleCategoryClick('200h-ttc')} className="hover:text-white transition">
                  200-Hour Yoga TTC
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('300h-ttc')} className="hover:text-white transition">
                  300-Hour Advanced TTC
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('ayurveda')} className="hover:text-white transition">
                  Ayurvedic Panchakarma
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('meditation')} className="hover:text-white transition">
                  Silent Meditation (Mauna)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('breathwork')} className="hover:text-white transition">
                  Himalayan Breathwork & Kriya
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Traveler Trust
            </h5>
            <ul className="space-y-2 text-[#A5B89A]">
              <li>
                <button onClick={() => setActiveView('support')} className="hover:text-white transition">
                  24/7 Concierge & Chat
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('blog')} className="hover:text-white transition">
                  Journal & Visa Guides
                </button>
              </li>
              <li>
                <span className="text-[#A5B89A]">100% Escrow Protection</span>
              </li>
              <li>
                <span className="text-[#A5B89A]">Yoga Alliance USA RYS</span>
              </li>
              <li>
                <span className="text-[#A5B89A]">Strict Zero-Spam Policy</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#A5B89A] gap-4">
          <p>© {new Date().getFullYear()} YogaConnect India. All rights reserved.</p>
          <p className="flex items-center space-x-2">
            <span>Dehradun • Rishikesh • Uttarkashi • Nainital</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
