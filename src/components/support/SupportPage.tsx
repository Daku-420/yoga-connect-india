import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, PhoneCall, Mail, ShieldCheck, HelpCircle } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { setIsChatOpen } = useApp();

  const faqs = [
    {
      q: 'How does the Admin Escrow Lead Protection protect my package inquiry?',
      a: 'When you submit an inquiry on YogaConnect India, your details are received directly by our certified Platform Admin team. Your contact details are never given directly to yoga centres until your reservation dates and package availability are fully validated. If a centre cannot accommodate you, zero spam is generated and any payment is 100% refunded.'
    },
    {
      q: 'Can I customize a package for specific arrival dates in Rishikesh or Uttarkashi?',
      a: 'Yes! Our support concierge team works directly with certified ashrams across Rishikesh, Uttarkashi, and Dehradun. Open our Live Chat or message our concierge to coordinate custom check-in dates, bespoke Ayurvedic doctor treatments, or private Dehradun airport transfers.'
    },
    {
      q: 'Are sattvic meals and airport transfers included in the tuition rates?',
      a: 'Most featured 200-Hour TTC and Ayurvedic Panchakarma retreat packages include three nutritious organic sattvic meals daily cooked according to yogic dietary principles, plus optional private airport pickup from Dehradun Jolly Grant Airport (DED).'
    },
    {
      q: 'How can a yoga centre register its retreats on the platform?',
      a: 'Ashram directors and retreat founders can click "List Your Centre" in the main navigation or on the homepage to submit their sanctuary for lineage verification and listing.'
    }
  ];

  return (
    <div className="py-12 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Banner */}
        <div className="bg-[#263D32] text-white p-8 md:p-12 rounded-3xl border border-[#1E3228] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="bg-white/10 text-[#A5B89A] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Himalayan Traveler Concierge & Support
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#F7F5EE]">
              Chat With Us & Support
            </h1>
            <p className="text-[#A5B89A] text-sm font-normal leading-relaxed">
              Have questions regarding Yoga Alliance accreditation, Ayurvedic Panchakarma, airport pickup from Dehradun (DED), or escrow booking protection? Our concierge team is available to assist you.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium px-6 py-3.5 rounded-xl shadow-sm flex items-center space-x-2 text-sm transition"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Start Live Chat</span>
            </button>
          </div>
        </div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            onClick={() => setIsChatOpen(true)}
            className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm hover:shadow-md transition cursor-pointer space-y-3 text-center group"
          >
            <div className="w-12 h-12 bg-[#E6EDE2] text-[#536B50] rounded-xl flex items-center justify-center mx-auto text-xl group-hover:scale-105 transition">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#263D32]">Live Web Concierge</h3>
            <p className="text-xs text-[#59665C]">Chat live with our retreat specialists for instant advice.</p>
            <span className="text-xs font-semibold text-[#536B50] block">Open Chat →</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 bg-[#E6EDE2] text-[#286749] rounded-xl flex items-center justify-center mx-auto text-xl">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#263D32]">WhatsApp Support</h3>
            <p className="text-xs text-[#59665C]">Direct messaging assistance for international travelers.</p>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#286749] block hover:underline">
              +91 98765 43210
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 bg-[#E6EDE2] text-[#536B50] rounded-xl flex items-center justify-center mx-auto text-xl">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#263D32]">Email Concierge</h3>
            <p className="text-xs text-[#59665C]">Send retreat inquiries & bespoke itinerary requests.</p>
            <a href="mailto:support@yogaconnect.in" className="text-xs font-semibold text-[#536B50] block hover:underline">
              support@yogaconnect.in
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 bg-[#E6EDE2] text-[#263D32] rounded-xl flex items-center justify-center mx-auto text-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#263D32]">Escrow Guarantee</h3>
            <p className="text-xs text-[#59665C]">Complete fund security and refund protection.</p>
            <span className="text-xs font-semibold text-[#263D32] block">Verified Escrow</span>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-6">
          <div>
            <span className="text-xs text-[#536B50] font-semibold uppercase tracking-wider block">Frequently Asked Questions</span>
            <h2 className="font-serif font-bold text-3xl text-[#263D32] mt-1">Traveler & Ashram Support FAQs</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#F7F5EE] p-6 rounded-xl border border-[#E2E5DD] space-y-2">
                <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center space-x-2">
                  <span className="text-[#536B50] font-bold">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-[#59665C] leading-relaxed pl-5">
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
