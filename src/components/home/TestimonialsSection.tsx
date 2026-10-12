import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Emma Watson-Smith',
      country: 'USA (Los Angeles)',
      flag: '🇺🇸',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      course: '200-Hour TTC in Sacred Rishikesh',
      centre: 'Parmarth Niketan Ganges Ashram',
      rating: 5,
      text: 'Booking my Rishikesh TTC through YogaConnect India gave me total peace of mind. As a solo female traveler, having platform escrow protection and verified airport pickup from Dehradun Jolly Grant was seamless.'
    },
    {
      name: 'Lucas Weber',
      country: 'Germany (Berlin)',
      flag: '🇩🇪',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      course: '10-Day Silent Meditation & Kriya',
      centre: 'Uttarkashi Himalayan Hermitage',
      rating: 5,
      text: 'The mountain silence along the Bhagirathi river in Uttarkashi was genuinely transformative. The direct ashram pricing in EUR without hidden commissions made the entire journey trustworthy.'
    },
    {
      name: 'Charlotte Davies',
      country: 'United Kingdom (London)',
      flag: '🇬🇧',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      course: '14-Day Himalayan Panchakarma Detox',
      centre: 'Veda5 Himalayan Sanctuary Rishikesh',
      rating: 5,
      text: 'The doctor-led Ayurvedic pulse diagnosis, fresh sattvic meals, and open-air ridge shala exceeded all expectations. The admin escrow team clarified every visa and dietary question prior to arrival.'
    }
  ];

  return (
    <section className="py-20 bg-[#F7F5EE] border-b border-[#E2E5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-1.5 text-[#536B50] text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#286749]" />
            <span>Verified International Traveler Reviews</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#263D32]">
            Trusted by Practitioners Worldwide
          </h2>
          <p className="text-[#59665C] text-sm sm:text-base font-sans">
            Read authentic experiences from graduates and seekers who booked their Uttarakhand wellness journeys with us.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div 
              key={i}
              className="bg-white p-8 rounded-2xl border border-[#E2E5DD] shadow-sm flex flex-col justify-between relative group hover:shadow-md transition duration-300"
            >
              <Quote className="w-8 h-8 text-[#E2E5DD] absolute top-6 right-6" />

              <div className="space-y-4 relative z-10">
                {/* Rating stars */}
                <div className="flex items-center space-x-1 text-[#536B50]">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-[#252C27] text-sm leading-relaxed font-sans italic">
                  "{t.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-[#E2E5DD] flex items-center space-x-3.5">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-11 h-11 rounded-full object-cover border border-[#E2E5DD]"
                />
                <div>
                  <h4 className="font-serif font-bold text-base text-[#263D32] flex items-center space-x-1.5">
                    <span>{t.name}</span>
                    <span title={t.country} className="text-sm">{t.flag}</span>
                  </h4>
                  <span className="text-xs text-[#59665C] block line-clamp-1">
                    {t.course}
                  </span>
                  <span className="text-[11px] text-[#536B50] font-medium block">
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
