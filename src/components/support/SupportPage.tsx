import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, PhoneCall, Mail, ShieldCheck, HelpCircle } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { setIsChatOpen } = useApp();

  const faqs = [
    {
      q: 'How does the Admin Escrow Payment system protect my package booking?',
      a: 'When you request a package booking on YogaConnect India, your funds are safely deposited into our platform Admin Escrow account. Your personal contact details are withheld from yoga centres until your reservation dates and package details are 100% validated. If a centre cancels, you receive a guaranteed 100% full refund.'
    },
    {
      q: 'Can I customize a package for my specific travel dates?',
      a: 'Yes! Our customer support concierge team works directly with Yoga Alliance USA certified ashrams across Rishikesh, Goa, Kerala, Dharamshala, and Mysore. Open our Live Chat or message us on WhatsApp to tailor accommodation, extra Ayurveda treatments, or airport transfers.'
    },
    {
      q: 'Are sattvic meals and airport transfers included in the packages?',
      a: 'Most of our featured 200-Hour TTC and Ayurvedic Panchakarma packages include 3 fresh sattvic vegetarian/vegan meals daily plus airport pickup from Dehradun (DED), Goa (GOI), or Trivandrum (TRV) airports.'
    },
    {
      q: 'How can a yoga centre register its packages on YogaConnect India?',
      a: 'Ashram owners and yoga school directors can easily click the "Add Yoga Centre" button in the navigation header to submit their sanctuary for verification.'
    }
  ];

  return (
    <div className="py-12 bg-sand-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        
        {/* Header Banner */}
        <div className="bg-sage-950 text-white p-8 md:p-12 rounded-3xl border border-sage-800 shadow-luxury flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="bg-gold-500/20 text-gold-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              24/7 Global Traveler Support & Package Concierge
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-sand-50">
              Chat With Us & Customer Support
            </h1>
            <p className="text-sand-200 text-sm font-light leading-relaxed">
              Have questions about Yoga Alliance certifications, Ayurvedic packages, airport pickups, or escrow booking safety? Our dedicated support specialists are online 24/7 to assist you.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-gold-500 hover:bg-gold-600 text-sage-950 font-bold px-6 py-3.5 rounded-xl shadow-xl flex items-center space-x-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Live Chat Now</span>
            </button>
          </div>
        </div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            onClick={() => setIsChatOpen(true)}
            className="bg-white p-6 rounded-2xl border border-sand-300 shadow-sm hover:shadow-md transition cursor-pointer space-y-3 text-center group"
          >
            <div className="w-14 h-14 bg-terracotta-100 text-terracotta-600 rounded-2xl flex items-center justify-center mx-auto text-2xl group-hover:scale-110 transition">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-sage-950">Live Web Chat</h3>
            <p className="text-xs text-sage-600">Chat live with Priya & our retreat specialists instantly.</p>
            <span className="text-xs font-bold text-terracotta-600 block">Open Widget →</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sand-300 shadow-sm space-y-3 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-sage-950">WhatsApp Concierge</h3>
            <p className="text-xs text-sage-600">Direct instant messaging for international travelers.</p>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-700 block hover:underline">
              +91 98765 43210
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sand-300 shadow-sm space-y-3 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-sage-950">Email Support</h3>
            <p className="text-xs text-sage-600">Send package inquiries & custom itinerary requests.</p>
            <a href="mailto:support@yogaconnect.in" className="text-xs font-bold text-amber-800 block hover:underline">
              support@yogaconnect.in
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sand-300 shadow-sm space-y-3 text-center">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-sage-950">Escrow Guarantee</h3>
            <p className="text-xs text-sage-600">100% money back protection for all verified bookings.</p>
            <span className="text-xs font-bold text-purple-900 block">Verified Escrow</span>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-sand-300 space-y-6">
          <div>
            <span className="text-xs text-terracotta-600 font-bold uppercase tracking-wider block">Frequently Asked Questions</span>
            <h2 className="font-serif font-bold text-3xl text-sage-950 mt-1">Package & Customer Support FAQs</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-sand-50 p-6 rounded-2xl border border-sand-300 space-y-2">
                <h3 className="font-serif font-bold text-lg text-sage-950 flex items-center space-x-2">
                  <span className="text-terracotta-600">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-sage-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
