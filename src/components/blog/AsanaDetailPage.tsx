import React, { useState } from 'react';
import { YogaAsana } from '../../types';
import { useApp } from '../../context/AppContext';
import { mockAsanas } from '../../data/mockAsanas';
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
  Check,
  ShieldCheck,
  Award,
  Layers,
  Heart,
  ExternalLink,
  Flame,
  Feather,
  Info
} from 'lucide-react';

interface AsanaDetailPageProps {
  asana: YogaAsana;
  onBack: () => void;
  onSelectAsana?: (asana: YogaAsana) => void;
}

export const AsanaDetailPage: React.FC<AsanaDetailPageProps> = ({ 
  asana, 
  onBack,
  onSelectAsana 
}) => {
  const { setActiveView, setSelectedCentreId, centres } = useApp();
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

  // Find related asana objects based on slugs
  const relatedAsanaObjects = mockAsanas.filter(a => 
    asana.relatedAsanaSlugs && asana.relatedAsanaSlugs.includes(a.slug)
  );

  // Find related centres in Uttarakhand
  const relatedCentres = centres.filter(c => 
    asana.relatedCentreIds && asana.relatedCentreIds.includes(c.id)
  );

  // Structured Data (JSON-LD) for Search Engines (HowTo + Article + BreadcrumbList)
  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://yogaconnectindia.com/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Journal',
            item: 'https://yogaconnectindia.com/journal'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Yoga Asanas',
            item: 'https://yogaconnectindia.com/journal/asanas'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: asana.englishName,
            item: `https://yogaconnectindia.com/journal/asanas/${asana.slug}`
          }
        ]
      },
      {
        '@type': 'HowTo',
        name: `How to do ${asana.sanskritName} (${asana.englishName})`,
        description: asana.shortDescription,
        image: asana.coverImage,
        totalTime: `PT${asana.recommendedHold.replace(/[^0-9]/g, '') || '1'}M`,
        tool: asana.equipmentAndPreparation.map(tool => ({
          '@type': 'HowToTool',
          name: tool
        })),
        step: asana.steps.map(step => ({
          '@type': 'HowToStep',
          name: step.title,
          text: step.instruction,
          position: step.stepNumber
        }))
      },
      {
        '@type': 'Article',
        headline: `${asana.sanskritName} (${asana.englishName}): Complete Alignment Guide & Sanskrit Etymology`,
        description: asana.shortDescription,
        image: asana.coverImage,
        author: {
          '@type': 'Person',
          name: asana.reviewer.name,
          jobTitle: asana.reviewer.qualification
        },
        publisher: {
          '@type': 'Organization',
          name: 'YogaConnect India',
          url: 'https://yogaconnectindia.com'
        },
        datePublished: asana.publishedDate || '2026-08-01',
        dateModified: asana.lastUpdatedDate || '2026-10-01'
      }
    ]
  };

  return (
    <article className="space-y-8 animate-fade-in max-w-4xl mx-auto">
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#E6EDE2] text-[#263D32] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#A5B89A]/40">
            {asana.category}
          </span>

          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
            asana.difficulty === 'Beginner' 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/40' 
              : asana.difficulty === 'Intermediate'
              ? 'bg-amber-100 text-amber-800 border border-amber-300/40'
              : 'bg-rose-100 text-rose-800 border border-rose-300/40'
          }`}>
            {asana.difficulty} Level
          </span>

          {asana.traditions && asana.traditions.slice(0, 2).map((trad, i) => (
            <span key={i} className="bg-[#FAF9F5] text-[#59665C] border border-[#E2E5DD] text-xs font-medium px-2.5 py-1 rounded-full">
              {trad}
            </span>
          ))}

          <span className="text-xs text-[#8E9B91] ml-auto">
            Reviewed: {asana.reviewer.lastReviewedDate}
          </span>
        </div>

        {/* Titles: Sanskrit, Devanagari, English */}
        <div className="space-y-2 border-b border-[#E2E5DD] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <span className="text-sm font-semibold text-[#536B50] tracking-widest uppercase">
                {asana.transliterationIast || asana.sanskritName}
              </span>
              <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#263D32] leading-tight">
                {asana.englishName}
              </h1>
            </div>

            {asana.sanskritDevanagari && (
              <div className="text-3xl sm:text-4xl font-serif text-[#C5A880] select-none font-bold">
                {asana.sanskritDevanagari}
              </div>
            )}
          </div>

          {/* Pronunciation & Alternative Names */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs text-[#59665C]">
            <div className="flex items-center space-x-1.5 bg-[#F7F5EE] px-2.5 py-1 rounded-md">
              <span className="font-semibold text-[#252C27]">Pronunciation:</span>
              <span className="italic font-serif text-[#536B50]">{asana.pronunciation}</span>
            </div>

            {asana.alternativeNames && asana.alternativeNames.length > 0 && (
              <div className="flex items-center space-x-1.5">
                <span className="font-semibold text-[#252C27]">Also known as:</span>
                <span>{asana.alternativeNames.join(', ')}</span>
              </div>
            )}
          </div>

          <p className="text-sm sm:text-base text-[#59665C] font-light leading-relaxed pt-2">
            {asana.shortDescription}
          </p>
        </div>

        {/* Hero Cover Image */}
        <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-[#E6EDE2] border border-[#E2E5DD] relative shadow-inner">
          <img 
            src={asana.coverImage} 
            alt={`${asana.sanskritName} (${asana.englishName}) step-by-step alignment`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Sanskrit Meaning & Lineage Etymology Box */}
        <div className="bg-[#FAF9F5] p-5 sm:p-6 rounded-2xl border border-[#E2E5DD] space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#263D32] uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#536B50]" />
            <span>Sanskrit Etymology &amp; Historical Lineage</span>
          </div>
          <p className="text-xs sm:text-sm text-[#252C27] leading-relaxed">
            {asana.etymology}
          </p>
          {asana.historicalContext && (
            <p className="text-xs text-[#59665C] leading-relaxed italic border-t border-[#E2E5DD] pt-2">
              <strong>Historical Context:</strong> {asana.historicalContext}
            </p>
          )}
        </div>

        {/* Anatomical Key Parameters Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#FAF9F5] rounded-2xl border border-[#E2E5DD] text-xs">
          <div>
            <span className="text-[#8E9B91] block font-medium">Chakra Center</span>
            <span className="font-semibold text-[#252C27] mt-0.5 block">{asana.chakra}</span>
          </div>

          <div>
            <span className="text-[#8E9B91] block font-medium">Primary Element</span>
            <span className="font-semibold text-[#252C27] mt-0.5 block">{asana.element}</span>
          </div>

          <div>
            <span className="text-[#8E9B91] block font-medium">Drishti (Gaze)</span>
            <span className="font-semibold text-[#252C27] mt-0.5 block">{asana.drishti}</span>
          </div>

          <div>
            <span className="text-[#8E9B91] block font-medium">Hold Duration</span>
            <span className="font-semibold text-[#252C27] mt-0.5 block">{asana.recommendedHold}</span>
          </div>
        </div>

      </div>

      {/* Equipment, Preparation & Props */}
      {asana.equipmentAndPreparation && asana.equipmentAndPreparation.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 font-serif font-bold text-xl text-[#263D32]">
            <Layers className="w-5 h-5 text-[#536B50]" />
            <h2>Equipment, Props &amp; Preparation</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#59665C]">
            {asana.equipmentAndPreparation.map((prop, i) => (
              <li key={i} className="flex items-center space-x-2 bg-[#FAF9F5] p-3 rounded-xl border border-[#E2E5DD]">
                <CheckCircle2 className="w-4 h-4 text-[#536B50] shrink-0" />
                <span className="font-medium text-[#252C27]">{prop}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step-by-Step Instructions */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-8">
        <div>
          <div className="flex items-center space-x-2 text-[#536B50] font-semibold text-xs tracking-wider uppercase mb-1">
            <Compass className="w-4 h-4" />
            <span>AUTHENTIC ASANA EXECUTION</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32]">
            Step-by-Step Instructions
          </h2>
        </div>

        <div className="space-y-6">
          {asana.steps.map((step) => (
            <div key={step.stepNumber} className="flex space-x-4 items-start group">
              <div className="w-8 h-8 rounded-full bg-[#E6EDE2] text-[#263D32] border border-[#A5B89A]/50 font-bold text-sm flex items-center justify-center shrink-0 group-hover:bg-[#263D32] group-hover:text-white transition-colors">
                {step.stepNumber}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-[#263D32] text-sm sm:text-base">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#59665C] leading-relaxed font-light">
                  {step.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Breathing & Alignment Cues Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E2E5DD]">
          <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E2E5DD] space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#263D32]">
              <Wind className="w-4 h-4 text-[#536B50]" />
              <span>Pranayama &amp; Breathing Rhythm</span>
            </div>
            <p className="text-xs text-[#59665C] leading-relaxed font-light">
              {asana.breathingCue}
            </p>
          </div>

          <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E2E5DD] space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#263D32]">
              <Eye className="w-4 h-4 text-[#536B50]" />
              <span>Key Alignment Checkpoints</span>
            </div>
            <ul className="text-xs text-[#59665C] space-y-1 font-light">
              {asana.alignmentCues.map((cue, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-[#536B50] font-bold">•</span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Common Mistakes & Practical Corrections */}
      {asana.commonMistakes && asana.commonMistakes.length > 0 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-rose-700 font-semibold text-xs tracking-wider uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>BIOMECHANICAL SAFETY</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32]">
              Common Mistakes &amp; How to Correct Them
            </h2>
          </div>

          <div className="space-y-4">
            {asana.commonMistakes.map((item, i) => (
              <div key={i} className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E2E5DD] space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded shrink-0 uppercase">
                    Common Error
                  </span>
                  <p className="text-xs font-semibold text-rose-950">
                    {item.mistake}
                  </p>
                </div>

                <div className="flex items-start space-x-2 pl-4 border-l-2 border-emerald-500">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded shrink-0 uppercase">
                    Correction
                  </span>
                  <p className="text-xs text-emerald-950">
                    {item.correction}
                  </p>
                </div>

                <p className="text-[11px] text-[#8E9B91] italic pt-1 pl-4">
                  <strong>Why it matters:</strong> {item.whyItMatters}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Easier Modifications & Advanced Variations */}
      {asana.variations && asana.variations.length > 0 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#536B50] font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              <span>ADAPTIVE &amp; PROGRESSIVE PRACTICE</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32]">
              Modifications, Props &amp; Variations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {asana.variations.map((v, i) => (
              <div key={i} className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E2E5DD] space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      v.type === 'easier'
                        ? 'bg-blue-100 text-blue-800'
                        : v.type === 'supported'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {v.type}
                    </span>
                    {v.propsUsed && v.propsUsed.length > 0 && (
                      <span className="text-[10px] text-[#8E9B91]">
                        {v.propsUsed.join(', ')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#263D32] text-sm">
                    {v.name}
                  </h3>
                  <p className="text-xs text-[#59665C] leading-relaxed font-light">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anatomical Benefits & Contraindications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Anatomical & Mental Benefits */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-emerald-700 font-semibold text-xs tracking-wider uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>DOCUMENTED BENEFITS</span>
          </div>

          <h3 className="font-serif font-bold text-xl text-[#263D32]">
            Anatomical &amp; Subtle Benefits
          </h3>

          <ul className="space-y-2.5 text-xs text-[#59665C]">
            {asana.anatomicalBenefits.map((b, i) => (
              <li key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
            {asana.mentalBenefits.map((mb, i) => (
              <li key={`m-${i}`} className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{mb}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contraindications & Safety Warnings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-rose-700 font-semibold text-xs tracking-wider uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>CONTRAINDICATIONS</span>
          </div>

          <h3 className="font-serif font-bold text-xl text-[#263D32]">
            Precautions &amp; Reasons to Stop
          </h3>

          <ul className="space-y-2.5 text-xs text-[#59665C]">
            {asana.contraindications.map((c, i) => (
              <li key={i} className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>

          {/* Educational Medical Disclaimer */}
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200/60 text-[11px] text-rose-900 leading-relaxed font-light">
            <span className="font-semibold block text-rose-950 mb-0.5">Medical Safety Disclaimer:</span>
            {asana.safetyDisclaimer}
          </div>
        </div>

      </div>

      {/* Suggested Sequences */}
      {asana.suggestedSequences && asana.suggestedSequences.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#263D32] flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#536B50]" />
            <span>Suggested Practice Sequences</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {asana.suggestedSequences.map((seq, i) => (
              <div key={i} className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E2E5DD] space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#263D32]">{seq.sequenceName}</h4>
                  <span className="text-[10px] bg-[#E6EDE2] text-[#263D32] px-2 py-0.5 rounded font-semibold">{seq.level}</span>
                </div>
                <p className="text-xs text-[#59665C] font-light leading-relaxed">{seq.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Asanas Links */}
      {relatedAsanaObjects.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#263D32]">
            Related Asanas &amp; Counter-Poses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedAsanaObjects.map(rel => (
              <div
                key={rel.id}
                onClick={() => onSelectAsana && onSelectAsana(rel)}
                className="bg-[#FAF9F5] hover:bg-[#E6EDE2] p-4 rounded-2xl border border-[#E2E5DD] cursor-pointer transition space-y-1 group"
              >
                <span className="text-[10px] text-[#536B50] font-semibold uppercase">{rel.category}</span>
                <h4 className="font-serif font-bold text-sm text-[#263D32] group-hover:text-[#536B50]">{rel.englishName}</h4>
                <span className="text-xs text-[#8E9B91] italic">{rel.sanskritName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#536B50] font-semibold text-xs tracking-wider uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>EXPERT Q&amp;A</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-[#E2E5DD]">
          {asana.faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between text-left text-sm sm:text-base font-bold text-[#263D32] hover:text-[#536B50] transition cursor-pointer"
              >
                <span>{faq.question}</span>
                {openFaqIndex === index ? (
                  <ChevronUp className="w-4 h-4 text-[#536B50] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8E9B91] shrink-0" />
                )}
              </button>

              {openFaqIndex === index && (
                <p className="mt-3 text-xs sm:text-sm text-[#59665C] leading-relaxed font-light animate-fade-in">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reviewer Stamp & Classical References Box */}
      <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-3xl border border-[#E2E5DD] space-y-6">
        
        {/* Reviewer Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E5DD] pb-5">
          <div className="flex items-center space-x-3">
            {asana.reviewer.avatar && (
              <img 
                src={asana.reviewer.avatar} 
                alt={asana.reviewer.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#DCCDB5]"
              />
            )}
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm text-[#252C27]">{asana.reviewer.name}</span>
                <ShieldCheck className="w-4 h-4 text-[#536B50]" />
              </div>
              <span className="text-xs text-[#59665C] block">{asana.reviewer.qualification}</span>
              <span className="text-[11px] text-[#8E9B91]">{asana.reviewer.traditionOrSchool}</span>
            </div>
          </div>

          <div className="text-xs text-[#8E9B91] sm:text-right">
            <span>Last Editorial Audit:</span>
            <strong className="block text-[#263D32]">{asana.reviewer.lastReviewedDate}</strong>
          </div>
        </div>

        {/* References Citations */}
        {asana.references && asana.references.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#263D32] uppercase tracking-wider block">
              Literature &amp; Textual References
            </span>
            <ul className="space-y-1.5 text-xs text-[#59665C]">
              {asana.references.map((ref, i) => (
                <li key={i} className="flex items-baseline space-x-2">
                  <span className="text-[#536B50] font-bold">[{i + 1}]</span>
                  <span><strong>{ref.title}:</strong> {ref.citation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Contextual Link to Verified Uttarakhand Retreats / Centres */}
      {relatedCentres.length > 0 && (
        <div className="bg-[#263D32] text-white p-8 rounded-3xl border border-[#344C3F] space-y-6 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#DCCDB5] font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-[#A5B89A]" />
              <span>LEARN AUTHENTIC HIMALAYAN ALIGNMENT</span>
            </div>
            <h3 className="font-serif font-bold text-2xl text-white">
              Study with Verified Yoga Teachers in Uttarakhand
            </h3>
            <p className="text-xs text-[#A5B89A] max-w-xl font-light">
              Deepen your asana technique with master yogis in Rishikesh and traditional mountain ashrams with 100% Admin Escrow protected booking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedCentres.map((centre) => (
              <div key={centre.id} className="bg-[#1C2E25] p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-serif font-bold text-base text-white">{centre.name}</h4>
                  <span className="text-xs text-[#A5B89A] block mt-0.5">{centre.location}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xs font-semibold text-[#DCCDB5]">
                    From ${centre.startingPriceUSD} USD
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCentreId(centre.id);
                      setActiveView('centre-detail');
                    }}
                    className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    View Centre
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </article>
  );
};
