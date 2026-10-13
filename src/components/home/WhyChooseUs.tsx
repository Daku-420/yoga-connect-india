import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Award, 
  Headphones, 
  CheckCircle2, 
  CreditCard,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover & Compare Lineages',
      description: 'Explore verified Himalayan ashrams and retreats in Rishikesh, Uttarkashi, and Dehradun with authentic syllabi and transparent pricing.'
    },
    {
      num: '02',
      title: 'Submit Structured Enquiry',
      description: 'Your contact details stay strictly private with our Platform Admin. Ashrams never receive your direct email or phone until booking approval.'
    },
    {
      num: '03',
      title: '100% Escrow Lead Protection',
      description: 'Our admin validates course seat availability, clarifies dietary and airport transfer needs, and safeguards your deposit in secure escrow.'
    }
  ];

  const trustPoints = [
    {
      icon: ShieldCheck,
      title: 'Admin Escrow Lead Protection',
      description: 'Zero spam. Inquiries are handled with complete confidentiality until you choose to finalize your stay.'
    },
    {
      icon: Award,
      title: 'Yoga Alliance USA RYS Verification',
      description: 'Every listed teacher training academy holds verified RYS 200, 300, or 500 accreditation.'
    },
    {
      icon: Lock,
      title: 'Transparent Multi-Currency Rates',
      description: 'Direct ashram rates converted transparently in USD, EUR, GBP, AUD, CAD, and INR with zero hidden fees.'
    },
    {
      icon: Building2,
      title: 'Physical Shala & Kitchen Inspections',
      description: 'Our Uttarakhand team personally verifies accommodation cleanliness, sattvic diet purity, and shala acoustics.'
    }
  ];

  return (
    <section className="py-20 bg-[#263D32] text-[#F7F5EE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#E6EDE2]/10 px-3.5 py-1 rounded-full text-[#A5B89A] text-xs font-semibold border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#DCCDB5]" />
            <span>How Discovery & Enquiries Work</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-5xl text-[#F7F5EE]">
            A Trustworthy Bridge to Authentic Indian Yoga
          </h2>
          <p className="text-[#A5B89A] text-sm sm:text-base leading-relaxed font-sans">
            We provide international and Indian travelers with clarity, verified safety, and complete escrow booking security.
          </p>
        </div>

        {/* 3-Step Process Column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="card-lift bg-[#1E3228] p-7 rounded-2xl border border-[#3D5E4C]/40 hover:border-[#DCCDB5]/50 space-y-3 relative group"
            >
              <span className="font-serif font-bold text-3xl text-[#A5B89A]/40 group-hover:text-[#DCCDB5]/70 transition-colors block">
                {step.num}
              </span>
              <h3 className="font-serif font-bold text-xl text-white group-hover:text-[#F7F5EE] transition-colors">
                {step.title}
              </h3>
              <p className="text-[#A5B89A] text-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {trustPoints.map((item, i) => {
            const Icon = item.icon;
            return (
              <div 
                key={i}
                className="card-lift bg-[#1E3228]/60 p-6 rounded-xl border border-[#3D5E4C]/30 hover:border-[#A5B89A]/50 space-y-2.5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#536B50] group-hover:bg-[#DCCDB5] text-white group-hover:text-[#1E3228] flex items-center justify-center transition-all duration-300">
                  <Icon className="w-5 h-5 text-[#E6EDE2] group-hover:text-[#1E3228] transition-colors" />
                </div>
                <h4 className="font-serif font-bold text-base text-white group-hover:text-[#F7F5EE] transition-colors">
                  {item.title}
                </h4>
                <p className="text-[#A5B89A] text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Escrow Guarantee Highlight Callout */}
        <div className="bg-[#1E3228] p-8 rounded-2xl border border-[#A5B89A]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="flex items-center space-x-2 text-[#DCCDB5] text-xs font-semibold">
              <ShieldCheck className="w-5 h-5 text-[#A5B89A]" />
              <span>THE UTTARAKHAND ESCROW PROMISE</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-white">
              No Unsolicited Marketing Calls or Emails
            </h3>
            <p className="text-[#A5B89A] text-xs leading-relaxed">
              When you submit an enquiry through our marketplace, only our certified wellness coordinators review your requirements. We coordinate directly with ashram admissions so you never experience spam.
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-block bg-[#536B50] text-white font-medium px-6 py-3 rounded-xl text-xs shadow-md">
              100% Escrow Lead Security
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
