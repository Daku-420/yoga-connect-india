import React, { useState } from 'react';
import { YogaAsana } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Eye, 
  Wind, 
  Compass, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen,
  Share2,
  Check
} from 'lucide-react';

interface AsanaDetailPageProps {
  asana: YogaAsana;
  onBack: () => void;
}

export const AsanaDetailPage: React.FC<AsanaDetailPageProps> = ({ asana, onBack }) => {
  const { setActiveView, setSelectedCentreId } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isCopied, setIsCopied] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Structured Data (JSON-LD) for Google SEO Rich Snippets (HowTo Schema)
  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to do ${asana.sanskritName} (${asana.englishName})`,
    description: asana.shortDescription,
    image: asana.coverImage,
    totalTime: `PT${asana.recommendedHold.replace(/[^0-9]/g, '') || '1'}M`,
    tool: [{ '@type': 'HowToTool', name: 'Yoga Mat' }],
    step: asana.steps.map(step => ({
      '@type': 'HowToStep',
      name: step.title,
      text: step.instruction,
      position: step.stepNumber
    }))
  };

  return (
    <article className="space-y-8 animate-fade-in">
      {/* Hidden JSON-LD for Search Engine Bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* Top Navigation & Share Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#536B50] hover:text-[#263D32] transition active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Asana Directory</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 text-xs font-medium bg-white px-3 py-1.5 rounded-full border border-[#E2E5DD] hover:border-[#A5B89A] text-[#59665C] hover:text-[#263D32] transition shadow-2xs active:scale-95 cursor-pointer"
          title="Share this pose guide"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#286749]" />
              <span className="text-[#286749] font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Guide</span>
            </>
          )}
        </button>
      </div>

      {/* Header Section */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-6">
        
        {/* Badges Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-[#E6EDE2] text-[#263D32] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#A5B89A]/40">
            {asana.category}
          </span>
          <span className={`font-semibold px-3 py-1 rounded-full text-xs ${
            asana.difficulty === 'Beginner' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : asana.difficulty === 'Intermediate'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-purple-50 text-purple-800 border border-purple-200'
          }`}>
            {asana.difficulty} Level
          </span>
          <span className="bg-[#FAF7F0] text-[#7A623A] border border-[#DCCDB5] font-medium px-3 py-1 rounded-full">
            Chakra: {asana.chakra}
          </span>
        </div>

        {/* Title & Phonetics */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#263D32]">
              {asana.sanskritName}
            </h1>
            {asana.sanskritDevanagari && (
              <span className="font-serif text-2xl sm:text-3xl text-[#536B50] font-medium">
                ({asana.sanskritDevanagari})
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-[#59665C]">
            <span className="font-semibold text-lg text-[#252C27]">{asana.englishName}</span>
            <span>•</span>
            <span className="italic bg-[#F7F5EE] px-2.5 py-0.5 rounded text-xs font-mono text-[#536B50]">
              /{asana.pronunciation}/
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#59665C] leading-relaxed font-light">
          {asana.shortDescription}
        </p>

        {/* Quick Specs Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E2E5DD] text-xs">
          <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
            <span className="text-[10px] text-[#59665C] uppercase font-semibold flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#536B50]" />
              <span>Recommended Hold</span>
            </span>
            <span className="font-bold text-[#263D32] mt-0.5 block">{asana.recommendedHold}</span>
          </div>

          <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
            <span className="text-[10px] text-[#59665C] uppercase font-semibold flex items-center space-x-1">
              <Eye className="w-3 h-3 text-[#536B50]" />
              <span>Drishti (Gaze Point)</span>
            </span>
            <span className="font-bold text-[#263D32] mt-0.5 block truncate">{asana.drishti}</span>
          </div>

          <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
            <span className="text-[10px] text-[#59665C] uppercase font-semibold flex items-center space-x-1">
              <Wind className="w-3 h-3 text-[#536B50]" />
              <span>Breathing Focus</span>
            </span>
            <span className="font-bold text-[#263D32] mt-0.5 block truncate">Diaphragmatic Flow</span>
          </div>

          <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
            <span className="text-[10px] text-[#59665C] uppercase font-semibold flex items-center space-x-1">
              <Compass className="w-3 h-3 text-[#536B50]" />
              <span>Primary Element</span>
            </span>
            <span className="font-bold text-[#263D32] mt-0.5 block">{asana.element}</span>
          </div>
        </div>

      </div>

      {/* High-Res Photo Canvas */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] max-h-[460px] border border-[#E2E5DD] shadow-sm bg-[#E6EDE2]">
        <img 
          src={asana.coverImage} 
          alt={`${asana.sanskritName} - ${asana.englishName}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-6 text-white text-xs">
          <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full font-medium">
            Classical Alignment in Uttarakhand Ashram
          </span>
        </div>
      </div>

      {/* Target Muscles Pill Cloud */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E5DD] shadow-xs flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-[#263D32] mr-2">Target Muscles & Anatomy:</span>
        {asana.targetMuscles.map((muscle, idx) => (
          <span key={idx} className="bg-[#E6EDE2] text-[#263D32] font-medium px-2.5 py-1 rounded-lg">
            {muscle}
          </span>
        ))}
      </div>

      {/* Step-by-Step Instructions */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-6">
        <div className="border-b border-[#E2E5DD] pb-4">
          <div className="inline-flex items-center space-x-1.5 text-[#536B50] text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Master The Alignment</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32]">
            Step-by-Step Instructions for {asana.sanskritName}
          </h2>
          <p className="text-xs sm:text-sm text-[#59665C] mt-1">
            Follow this authentic bio-mechanical progression practiced in Himalayan ashrams.
          </p>
        </div>

        <div className="space-y-4">
          {asana.steps.map((step) => (
            <div 
              key={step.stepNumber} 
              className="flex items-start space-x-4 p-4 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DE] hover:border-[#DCCDB5] transition"
            >
              <div className="w-8 h-8 rounded-full bg-[#263D32] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                {step.stepNumber}
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#263D32]">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#59665C] leading-relaxed">
                  {step.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Breathing Note Callout */}
        <div className="bg-[#E6EDE2] p-4 rounded-2xl border border-[#A5B89A]/40 flex items-start space-x-3 text-xs text-[#263D32]">
          <Wind className="w-5 h-5 text-[#536B50] shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Pranayama Breathing Cue:</strong>
            <p className="text-[#3E5244] mt-0.5 leading-relaxed">{asana.breathingCue}</p>
          </div>
        </div>
      </div>

      {/* Two Column Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Anatomical Benefits */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#286749]">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-serif font-bold text-xl text-[#263D32]">
              Physical & Anatomical Benefits
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#59665C]">
            {asana.anatomicalBenefits.map((b, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#286749] mt-2 shrink-0"></span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mental & Spiritual Benefits */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-[#536B50]">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-serif font-bold text-xl text-[#263D32]">
              Mental & Energetic Benefits
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#59665C]">
            {asana.mentalBenefits.map((b, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#536B50] mt-2 shrink-0"></span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contraindications & Safety Precautions */}
      <div className="bg-[#FFF8F7] p-6 sm:p-8 rounded-3xl border border-[#F2D6D3] shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-[#B42318]">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-serif font-bold text-xl text-[#912018]">
            Precautions & Contraindications
          </h3>
        </div>
        <p className="text-xs text-[#8A241C] leading-relaxed">
          Do not practice or modify with props if you experience any of the following:
        </p>
        <ul className="space-y-1.5 text-xs sm:text-sm text-[#731E17]">
          {asana.contraindications.map((c, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-[#B42318] font-bold">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pro Alignment Tips */}
      {asana.proTips.length > 0 && (
        <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#DCCDB5] space-y-3">
          <div className="flex items-center space-x-2 text-[#7A623A]">
            <Sparkles className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-serif font-bold text-xl text-[#3D311A]">
              Master Teacher Pro-Tips
            </h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-[#574627]">
            {asana.proTips.map((tip, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="font-bold text-[#C5A880]">✦</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* People Also Ask FAQ Accordion (SEO Featured Snippet Booster) */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-[#536B50] text-xs font-semibold uppercase tracking-wider mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#263D32]">
            Questions About {asana.sanskritName} ({asana.englishName})
          </h3>
        </div>

        <div className="space-y-3">
          {asana.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="border border-[#E2E5DD] rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-[#FAF9F5] hover:bg-[#F2EFE8] transition cursor-pointer"
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-[#263D32]">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#536B50] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#59665C] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-[#59665C] leading-relaxed border-t border-[#E2E5DD]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SEO Topic Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
        <span className="font-semibold text-[#59665C]">Search Topics:</span>
        {asana.seoKeywords.map((kw, i) => (
          <span key={i} className="bg-white text-[#59665C] border border-[#E2E5DD] text-[11px] font-medium px-2.5 py-1 rounded-md">
            #{kw}
          </span>
        ))}
      </div>

      {/* High-Intent Conversion CTA */}
      <div className="bg-[#263D32] text-white p-8 sm:p-10 rounded-3xl border border-[#344C3F] space-y-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <span className="text-[#DCCDB5] text-xs font-bold tracking-widest uppercase">
            LEARN FROM ACCREDITED LINEAGE MASTERS
          </span>
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            Master {asana.sanskritName} in Sacred Rishikesh
          </h3>
          <p className="text-xs sm:text-sm text-[#A5B89A] max-w-xl leading-relaxed">
            Experience traditional hands-on alignment, human bio-mechanics, and daily shala sadhana with 100% Escrow Protection.
          </p>
        </div>

        <button
          onClick={() => setActiveView('retreats')}
          className="bg-[#DCCDB5] hover:bg-white text-[#19261E] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition shadow-md whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
        >
          Explore Verified Retreats →
        </button>
      </div>

    </article>
  );
};
