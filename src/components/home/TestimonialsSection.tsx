import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Emma Watson-Smith',
      country: 'USA (Los Angeles)',
      flag: '🇺🇸',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      course: '200 Hour Multi-Style TTC in Rishikesh',
      centre: 'Ananda Himalayan Yoga Sanctuary',
      rating: 5,
      text: 'Booking through YogaConnect India gave me complete peace of mind. As a solo female traveler from LA, having the Platform Admin handle my request and escrow payment was incredible. The Himalayan ashram exceeded every expectation!'
    },
    {
      name: 'Lucas Weber',
      country: 'Germany (Berlin)',
      flag: '🇩🇪',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      course: '14-Day Oceanfront Vinyasa & Sound Healing',
      centre: 'Oceanic Lotus Beachside Retreat Goa',
      rating: 5,
      text: 'The multi-currency price transparency made it effortless. I paid in EUR via Stripe with zero conversion fees. The beachside shala in Mandrem and daily sound baths rejuvenated me completely after two intense years of software burnout.'
    },
    {
      name: 'Charlotte Davies',
      country: 'United Kingdom (London)',
      flag: '🇬🇧',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      course: '14-Day Authentic Panchakarma Detox',
      centre: 'Somatheeram Ayurveda Village Kerala',
      rating: 5,
      text: 'The Ayurvedic doctors and 2-hour daily oil massages restored my energy levels. Highly recommend using YogaConnect India for international e-visa assistance and seamless airport transfer booking.'
    }
  ];

  return (
    <section className="py-20 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-1.5 text-terracotta-600 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified International Reviews</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-5xl text-sage-950">
            Trusted by Travelers Worldwide
          </h2>
          <p className="text-sage-700 text-sm sm:text-base font-sans">
            Hear from yoga practitioners and teacher training graduates who booked their Indian wellness journey with us.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div 
              key={i}
              className="bg-white p-8 rounded-2xl border border-sand-300 shadow-luxury flex flex-col justify-between relative group hover:shadow-2xl transition duration-300"
            >
              <Quote className="w-10 h-10 text-sand-300 absolute top-6 right-6" />

              <div className="space-y-4 relative z-10">
                {/* Rating stars */}
                <div className="flex items-center space-x-1 text-gold-400">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sage-800 text-sm leading-relaxed font-sans italic">
                  "{t.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-sand-200 flex items-center space-x-3">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold-400"
                />
                <div>
                  <h4 className="font-serif font-bold text-base text-sage-950 flex items-center space-x-1.5">
                    <span>{t.name}</span>
                    <span title={t.country}>{t.flag}</span>
                  </h4>
                  <span className="text-xs text-sage-600 block line-clamp-1">
                    {t.course}
                  </span>
                  <span className="text-[11px] text-terracotta-600 font-medium block">
                    {t.centre}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
