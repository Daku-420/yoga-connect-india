import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Award, 
  Headphones, 
  CheckCircle2, 
  CreditCard,
  Building2,
  Sparkles
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: '100% Admin Escrow Booking Control',
      description: 'Your inquiry and contact details go strictly to our Platform Admin. Yoga centres never receive customer emails or numbers directly until the booking is confirmed.'
    },
    {
      icon: Award,
      title: 'Yoga Alliance USA Certified Ashrams',
      description: 'Every listed school holds verified RYS 200, 300, or 500 accreditation with traditional lineage masters.'
    },
    {
      icon: Lock,
      title: 'Best Price & Transparent Guarantee',
      description: 'Zero hidden booking fees. Direct ashram prices rendered instantly in your local currency (USD, EUR, GBP, AUD, CAD, INR).'
    },
    {
      icon: Headphones,
      title: '24/7 International Traveler Support',
      description: 'Dedicated assistance with Indian e-visas, airport private transfers from Dehradun/Goa/Trivandrum, and custom dietary needs.'
    },
    {
      icon: CreditCard,
      title: 'Multiple Global Payment Methods',
      description: 'Full support for Stripe, PayPal, Wise transfers, Apple Pay, Google Pay, and international credit cards.'
    },
    {
      icon: Building2,
      title: 'Verified Physical Facility Inspection',
      description: 'Our team personally inspects accommodation hygiene, organic sattvic kitchen standards, and yoga shala acoustics.'
    }
  ];

  return (
    <section className="py-20 bg-sage-950 text-white relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage-800/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-terracotta-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-sage-900/80 px-3 py-1 rounded-full border border-sage-700 text-gold-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Book Through YogaConnect India</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-5xl text-sand-50">
            The World-Class Standard for Indian Yoga Travel
          </h2>
          <p className="text-sage-300 text-sm sm:text-base leading-relaxed font-sans">
            We bridge the gap between traditional Indian yoga ashrams and international travelers, providing a secure, transparent, and luxury booking experience.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div 
                key={i}
                className="bg-sage-900/50 backdrop-blur-md p-8 rounded-2xl border border-sage-800 hover:border-gold-500/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-sage-800 group-hover:bg-terracotta-600 text-gold-400 group-hover:text-white flex items-center justify-center mb-6 transition-colors shadow">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-white mb-3 group-hover:text-gold-300 transition">
                  {b.title}
                </h3>
                <p className="text-sage-300 text-xs leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Escrow Banner Highlight */}
        <div className="mt-16 bg-gradient-to-r from-sage-900 via-sage-800 to-sage-900 p-8 rounded-2xl border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-gold-400 font-semibold text-xs">
              <ShieldCheck className="w-5 h-5" />
              <span>PLATFORM ESCROW & PRIVACY STANDARD</span>
            </div>
            <h4 className="font-serif font-bold text-2xl text-white">
              Zero Direct Customer Spam — You Are Fully Protected
            </h4>
            <p className="text-sage-300 text-xs leading-relaxed">
              When you submit a request, our Platform Admin reviews your goals, validates ashram seat availability, and manages payment escrow. Yoga centres never receive your direct email or phone until you approve the booking!
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-block bg-terracotta-600 text-white font-semibold px-6 py-3 rounded-xl text-xs shadow-lg">
              100% Escrow Protected Booking
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
