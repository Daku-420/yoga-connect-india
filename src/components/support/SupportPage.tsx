import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { mockYogaFaqs, YogaFAQ } from '../../data/mockFaqs';
import { 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  ShieldCheck, 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { setIsChatOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true
  });

  const categories = [
    'All',
    'Timing & Nutrition',
    'Beginners & Flexibility',
    'Health & Pregnancy',
    'Routine & Frequency',
    'Props & Gear',
    'Safety & Teachers',
    'Language & Culture',
    'Fitness & Transformation'
  ];

  const filteredFaqs = useMemo(() => {
    return mockYogaFaqs.filter(faq => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        faq.question.toLowerCase().includes(q) || 
        faq.answer.toLowerCase().includes(q) ||
        faq.tags.some(tag => tag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleAccordion = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    filteredFaqs.forEach(f => { all[f.id] = true; });
    setOpenIds(all);
  };

  const collapseAll = () => {
    setOpenIds({});
  };

  // Structured Data Schema for FAQ SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": mockYogaFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="py-12 bg-[#F7F5EE] min-h-screen">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Banner */}
        <div className="bg-[#263D32] text-white p-8 md:p-12 rounded-3xl border border-[#1E3228] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="bg-white/10 text-[#A5B89A] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A5B89A]" />
              Yoga Wisdom & Practitioner FAQs
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#F7F5EE]">
              Frequently Asked Yoga Questions
            </h1>
            <p className="text-[#A5B89A] text-sm font-normal leading-relaxed">
              Curated practical answers to the 11 most essential questions beginners and seasoned practitioners ask about timing, flexibility, equipment, health precautions, and authentic Himalayan practice.
            </p>
          </div>

          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium px-6 py-3.5 rounded-xl shadow-sm flex items-center justify-center space-x-2 text-sm transition"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Ask Our Concierge</span>
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
            <p className="text-xs text-[#59665C]">Ask any questions live with our yoga &amp; ashram specialists.</p>
            <span className="text-xs font-semibold text-[#536B50] block">Open Chat →</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 bg-[#E6EDE2] text-[#286749] rounded-xl flex items-center justify-center mx-auto text-xl">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#263D32]">WhatsApp Support</h3>
            <p className="text-xs text-[#59665C]">Direct guidance for international travellers &amp; students.</p>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#286749] block hover:underline">
              +91 98765 43210
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 bg-[#E6EDE2] text-[#536B50] rounded-xl flex items-center justify-center mx-auto text-xl">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#263D32]">Email Concierge</h3>
            <p className="text-xs text-[#59665C]">Send custom questions, TTC inquiries, or retreat planning.</p>
            <a href="mailto:support@yogaconnect.in" className="text-xs font-semibold text-[#536B50] block hover:underline">
              support@yogaconnect.in
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 bg-[#E6EDE2] text-[#263D32] rounded-xl flex items-center justify-center mx-auto text-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#263D32]">Escrow Guarantee</h3>
            <p className="text-xs text-[#59665C]">Verified retreat payments and direct admin support.</p>
            <span className="text-xs font-semibold text-[#263D32] block">Verified Authentic</span>
          </div>
        </div>

        {/* FAQs Hub Container */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-8">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E2E5DD]">
            <div>
              <span className="text-xs text-[#536B50] font-semibold uppercase tracking-wider block">
                Authentic Yoga Practice Knowledge
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32] mt-1">
                11 Essential Yoga Questions &amp; Answers
              </h2>
              <p className="text-xs sm:text-sm text-[#59665C] mt-1">
                Clear, grounded guidance for beginners, daily practitioners, and retreat seekers.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9B91]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions or keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs sm:text-sm text-[#263D32] placeholder-[#8E9B91] focus:outline-none focus:border-[#536B50] focus:ring-1 focus:ring-[#536B50] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8E9B91] hover:text-[#263D32]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#263D32] text-white shadow-xs'
                      : 'bg-[#F7F5EE] text-[#59665C] hover:bg-[#EAE7DC] hover:text-[#263D32]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs text-[#536B50]">
              <button 
                onClick={expandAll}
                className="hover:underline font-medium hover:text-[#263D32]"
              >
                Expand All
              </button>
              <span>•</span>
              <button 
                onClick={collapseAll}
                className="hover:underline font-medium hover:text-[#263D32]"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Questions Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center bg-[#F7F5EE] rounded-2xl border border-dashed border-[#E2E5DD] space-y-3">
              <HelpCircle className="w-10 h-10 text-[#8E9B91] mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#263D32]">No matching questions found</h3>
              <p className="text-xs text-[#59665C] max-w-sm mx-auto">
                Try searching for different terms like &ldquo;eating&rdquo;, &ldquo;flexibility&rdquo;, &ldquo;pregnancy&rdquo;, or reset the category filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="text-xs font-semibold text-[#536B50] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredFaqs.map((faq) => {
                const isOpen = !!openIds[faq.id];
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen 
                        ? 'border-[#536B50]/40 bg-[#F7F5EE]/70 shadow-xs' 
                        : 'border-[#E2E5DD] bg-white hover:border-[#CBD3C8]'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E6EDE2] text-[#263D32] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {String(faq.number).padStart(2, '0')}
                        </span>
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-[#536B50] uppercase tracking-wider block">
                            {faq.category}
                          </span>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#263D32] leading-snug">
                            {faq.question}
                          </h3>
                        </div>
                      </div>

                      <div className="shrink-0 p-1.5 rounded-lg bg-[#F7F5EE] text-[#536B50] mt-1">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#445147] leading-relaxed border-t border-[#E2E5DD]/60">
                        <div className="pl-10 sm:pl-12 space-y-3">
                          <p className="text-xs sm:text-sm text-[#4A574E] leading-relaxed font-normal">
                            {faq.answer}
                          </p>

                          {faq.tags && faq.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-2">
                              <span className="text-[10px] text-[#8E9B91] font-medium mr-1">Related:</span>
                              {faq.tags.map(tag => (
                                <span 
                                  key={tag}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery(tag);
                                  }}
                                  className="text-[10px] bg-[#EAE7DC] text-[#4A574E] px-2 py-0.5 rounded-md hover:bg-[#536B50] hover:text-white transition cursor-pointer"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Helpful Info Box */}
          <div className="bg-[#E6EDE2]/50 border border-[#CBD3C8] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-base text-[#263D32] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#536B50]" />
                Have a specific question about Himalayan retreats or courses?
              </h4>
              <p className="text-xs text-[#59665C]">
                Our certified teachers and local concierge in Rishikesh are ready to help guide your path.
              </p>
            </div>
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-[#263D32] hover:bg-[#1E3228] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shrink-0"
            >
              Chat With Concierge
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
