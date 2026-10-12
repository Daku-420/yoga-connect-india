import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockBlogs } from '../../data/mockBlogs';
import { 
  BookOpen, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  ArrowRight,
  FileText
} from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { 
    selectedBlogSlug, 
    setSelectedBlogSlug, 
    activeView, 
    setActiveView, 
    setSelectedCentreId, 
    centres,
    setIsSchemaModalOpen
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');

  const selectedArticle = mockBlogs.find(b => b.slug === selectedBlogSlug);

  const filteredBlogs = activeCategory === 'all' 
    ? mockBlogs 
    : mockBlogs.filter(b => b.category.toLowerCase() === activeCategory.toLowerCase());

  // If viewing specific article detail
  if (activeView === 'blog-detail' && selectedArticle) {
    const relatedCentres = centres.filter(c => selectedArticle.relatedCentreIds.includes(c.id));

    return (
      <div className="py-12 bg-[#F7F5EE] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <button
            onClick={() => setActiveView('blog')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#536B50] hover:text-[#263D32] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal Articles</span>
          </button>

          {/* Article Header */}
          <div className="space-y-4">
            <span className="bg-[#E6EDE2] text-[#263D32] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#A5B89A]/40">
              {selectedArticle.category}
            </span>

            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#263D32] leading-tight">
              {selectedArticle.title}
            </h1>

            <div className="flex items-center justify-between border-y border-[#E2E5DD] py-4 text-xs text-[#59665C]">
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedArticle.authorAvatar} 
                  alt={selectedArticle.authorName} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#DCCDB5]"
                />
                <div>
                  <span className="font-bold text-[#252C27] block">{selectedArticle.authorName}</span>
                  <span>{selectedArticle.authorRole}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#536B50]" />
                  <span>{selectedArticle.readTimeMinutes} min read</span>
                </span>
                <span>•</span>
                <span>{selectedArticle.publishedDate}</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="h-96 rounded-2xl overflow-hidden shadow-sm border border-[#E2E5DD]">
            <img src={selectedArticle.coverImage} alt={selectedArticle.title} className="w-full h-full object-cover" />
          </div>

          {/* Main Article Body */}
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E2E5DD] shadow-sm space-y-6 text-[#252C27] leading-relaxed font-sans font-light text-base">
            <p className="text-lg font-serif italic text-[#263D32] border-l-4 border-[#536B50] pl-4 py-2 bg-[#E6EDE2]/50 rounded-r-xl">
              "{selectedArticle.excerpt}"
            </p>

            <div className="prose max-w-none text-sm space-y-4 whitespace-pre-line text-[#252C27]/90 leading-relaxed">
              {selectedArticle.content}
            </div>

            {/* SEO Keywords tags */}
            <div className="pt-6 border-t border-[#E2E5DD] flex flex-wrap gap-2 text-xs">
              <span className="font-semibold text-[#59665C]">Topics:</span>
              {selectedArticle.seoKeywords.map((kw, i) => (
                <span key={i} className="bg-[#F7F5EE] text-[#59665C] border border-[#E2E5DD] text-[11px] font-medium px-2.5 py-1 rounded-md">
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Related Retreats Recommendation Widget */}
          {relatedCentres.length > 0 && (
            <div className="bg-[#263D32] text-white p-8 rounded-2xl border border-[#344C3F] space-y-4 shadow-md">
              <div className="flex items-center space-x-2 text-[#DCCDB5] font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-[#A5B89A]" />
                <span>RECOMMENDED RETREATS FOR THIS ARTICLE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedCentres.map((centre) => (
                  <div key={centre.id} className="bg-[#1C2E25] p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-white">{centre.name}</h4>
                      <span className="text-xs text-[#A5B89A] block">{centre.city}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCentreId(centre.id);
                        setActiveView('centre-detail');
                      }}
                      className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium text-xs px-3.5 py-2 rounded-lg transition"
                    >
                      View Centre
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Blog Hub Grid View
  return (
    <div className="py-12 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-[#263D32] text-white rounded-2xl p-8 sm:p-10 shadow-lg space-y-4 border border-[#344C3F]">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-[#DCCDB5] text-xs font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#A5B89A]" />
            <span>Uttarakhand Wellness & Travel Journal</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white">
            Authentic Himalayan Yoga & Travel Guides
          </h1>

          <p className="text-[#A5B89A] text-sm sm:text-base max-w-2xl font-light">
            In-depth guides on accredited TTC schools in Rishikesh, Ayurvedic Panchakarma preparation, high-altitude ashram etiquette, and travel logistics across Uttarakhand.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 border-b border-[#E2E5DD] pb-4 overflow-x-auto text-xs font-semibold">
          {['all', 'Teacher Training', 'Ayurveda', 'Retreat Guides', 'Yoga Philosophy'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#263D32] text-white shadow-sm'
                  : 'bg-white border border-[#E2E5DD] text-[#59665C] hover:bg-[#E6EDE2] hover:text-[#263D32]'
              }`}
            >
              {cat === 'all' ? 'All Articles' : cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredBlogs.map((article) => (
            <div 
              key={article.id}
              onClick={() => {
                setSelectedBlogSlug(article.slug);
                setActiveView('blog-detail');
              }}
              className="bg-white rounded-2xl overflow-hidden border border-[#E2E5DD] shadow-sm hover:shadow-md hover:border-[#A5B89A] transition duration-300 flex flex-col cursor-pointer group"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={article.coverImage} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#263D32]/90 text-[#DCCDB5] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  {article.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-[#59665C]">
                    <span>{article.publishedDate}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#536B50]" />
                      <span>{article.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#263D32] group-hover:text-[#536B50] transition leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#59665C] line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E5DD] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={article.authorAvatar} 
                      alt={article.authorName} 
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs text-[#252C27] font-medium">{article.authorName}</span>
                  </div>

                  <span className="text-xs font-semibold text-[#536B50] group-hover:text-[#40563E] group-hover:translate-x-0.5 transition-transform">
                    Read Article →
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
