import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Award, 
  HeartHandshake, 
  Globe2, 
  FileText,
  CreditCard
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    brandName, 
    setActiveView, 
    setIsSchemaModalOpen, 
    setSelectedDestinationSlug 
  } = useApp();

  return (
    <footer className="bg-sage-950 text-sand-200 pt-16 pb-12 border-t border-sage-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Feature Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-sage-800/80">
          <div className="flex items-start space-x-3 bg-sage-900/40 p-4 rounded-xl border border-sage-800/50">
            <div className="w-10 h-10 rounded-full bg-sage-800 flex items-center justify-center text-gold-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm font-serif">100% Admin Escrow</h4>
              <p className="text-sage-400 text-xs mt-1">
                Your contact details stay private with admin until booking confirmation. Zero direct spam.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-sage-900/40 p-4 rounded-xl border border-sage-800/50">
            <div className="w-10 h-10 rounded-full bg-sage-800 flex items-center justify-center text-gold-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm font-serif">Yoga Alliance Certified</h4>
              <p className="text-sage-400 text-xs mt-1">
                All listed TTC schools hold verified RYS 200, 300, or 500 accreditation.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-sage-900/40 p-4 rounded-xl border border-sage-800/50">
            <div className="w-10 h-10 rounded-full bg-sage-800 flex items-center justify-center text-gold-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm font-serif">Best Price Guarantee</h4>
              <p className="text-sage-400 text-xs mt-1">
                Direct ashram prices with zero hidden markup fees and transparent multi-currency billing.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-sage-900/40 p-4 rounded-xl border border-sage-800/50">
            <div className="w-10 h-10 rounded-full bg-sage-800 flex items-center justify-center text-gold-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm font-serif">24/7 Concierge Support</h4>
              <p className="text-sage-400 text-xs mt-1">
                Dedicated assistance with Indian e-visas, airport transfers, and dietary customization.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12 border-b border-sage-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage-700 to-sage-900 text-gold-400 flex items-center justify-center shadow">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-2xl text-white tracking-tight">
                {brandName}
              </span>
            </div>

            <p className="text-sage-300 text-xs leading-relaxed max-w-sm">
              The premium, high-converting marketplace for authentic yoga retreats, teacher training courses (TTC), meditation ashrams, and Ayurveda programs across India. Connecting international seekers with verified spiritual sanctuaries.
            </p>

            {/* Payment Systems Showcase */}
            <div className="pt-2">
              <span className="text-sage-400 text-[11px] font-semibold uppercase tracking-wider block mb-2">
                Supported International Payment Gateways
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {['Stripe', 'PayPal', 'Wise', 'Apple Pay', 'Google Pay', 'Visa / Mastercard'].map(pay => (
                  <span 
                    key={pay}
                    className="bg-sage-900 text-sage-300 text-[10px] font-medium px-2.5 py-1 rounded border border-sage-800 flex items-center space-x-1"
                  >
                    <CreditCard className="w-3 h-3 text-gold-400" />
                    <span>{pay}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Destinations Column */}
          <div>
            <h4 className="text-white font-serif font-semibold text-sm mb-4">Popular Destinations</h4>
            <ul className="space-y-2 text-xs text-sage-300">
              {['Rishikesh', 'Goa', 'Kerala', 'Dharamshala', 'Mysore', 'Haridwar', 'Dehradun', 'Pondicherry'].map(dest => (
                <li key={dest}>
                  <button 
                    onClick={() => {
                      setSelectedDestinationSlug(dest.toLowerCase());
                      setActiveView('destinations');
                    }}
                    className="hover:text-gold-400 transition"
                  >
                    {dest} Retreats
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Column */}
          <div>
            <h4 className="text-white font-serif font-semibold text-sm mb-4">Certifications & Programs</h4>
            <ul className="space-y-2 text-xs text-sage-300">
              <li><button onClick={() => setActiveView('retreats')} className="hover:text-gold-400">200 Hour Yoga TTC</button></li>
              <li><button onClick={() => setActiveView('retreats')} className="hover:text-gold-400">300 Hour Yoga TTC</button></li>
              <li><button onClick={() => setActiveView('retreats')} className="hover:text-gold-400">500 Hour Advanced TTC</button></li>
              <li><button onClick={() => setActiveView('retreats')} className="hover:text-gold-400">Panchakarma Ayurveda Detox</button></li>
              <li><button onClick={() => setActiveView('retreats')} className="hover:text-gold-400">Sound Healing Certification</button></li>
              <li><button onClick={() => setActiveView('retreats')} className="hover:text-gold-400">Silent Meditation Retreats</button></li>
              <li><button onClick={() => setActiveView('retreats')} className="hover:text-gold-400">Prenatal & Breathwork</button></li>
            </ul>
          </div>

          {/* Platform & Admin Tools */}
          <div>
            <h4 className="text-white font-serif font-semibold text-sm mb-4">Platform & SEO</h4>
            <ul className="space-y-2 text-xs text-sage-300">
              <li><button onClick={() => setActiveView('blog')} className="hover:text-gold-400">Wellness Journal & Blog</button></li>
              <li><button onClick={() => setActiveView('user-dashboard')} className="hover:text-gold-400">Traveler Dashboard</button></li>
              <li><button onClick={() => setActiveView('centre-dashboard')} className="hover:text-gold-400">Partner Ashram Portal</button></li>
              <li><button onClick={() => setActiveView('admin-dashboard')} className="hover:text-gold-400 text-gold-400 font-semibold">Admin Control Panel</button></li>
              <li className="pt-2">
                <button 
                  onClick={() => setIsSchemaModalOpen(true)}
                  className="flex items-center space-x-1.5 bg-sage-900 text-gold-400 px-2.5 py-1.5 rounded border border-sage-700 text-[11px] hover:bg-sage-800 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect SEO Schema & Sitemap</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sage-500 gap-4">
          <p>© 2026 {brandName}. All rights reserved. Operating in compliance with international privacy & escrow booking standards.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-sage-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-sage-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-sage-400 cursor-pointer">Yoga Alliance Partner Agreement</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
