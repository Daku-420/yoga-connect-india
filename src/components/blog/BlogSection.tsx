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
      <div className="py-12 bg-sand-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <button
            onClick={() => setActiveView('blog')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-sage-800 hover:text-terracotta-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal Articles</span>
          </button>

          {/* Article Header */}
          <div className="space-y-4">
            <span className="bg-terracotta-100 text-terracotta-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {selectedArticle.category}
            </span>

            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-sage-950 leading-tight">
              {selectedArticle.title}
            </h1>

            <div className="flex items-center justify-between border-y border-sand-300 py-4 text-xs text-sage-600">
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedArticle.authorAvatar} 
                  alt={selectedArticle.authorName} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-gold-400"
                />
                <div>
                  <span className="font-bold text-sage-950 block">{selectedArticle.authorName}</span>
                  <span>{selectedArticle.authorRole}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                  <span>{selectedArticle.readTimeMinutes} min read</span>
                </span>
                <span>•</span>
                <span>{selectedArticle.publishedDate}</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="h-96 rounded-3xl overflow-hidden shadow-luxury border border-sand-300">
            <img src={selectedArticle.coverImage} alt={selectedArticle.title} className="w-full h-full object-cover" />
          </div>

          {/* Main Article Body */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-sand-300 shadow-luxury space-y-6 text-sage-900 leading-relaxed font-sans font-light text-base">
            <p className="text-lg font-serif italic text-sage-800 border-l-4 border-terracotta-500 pl-4 py-1 bg-sand-50 rounded-r-xl">
              "{selectedArticle.excerpt}"
            </p>

            <div className="prose max-w-none text-sm space-y-4 whitespace-pre-line">
              {selectedArticle.content}
            </div>

            {/* SEO Keywords tags */}
            <div className="pt-6 border-t border-sand-200 flex flex-wrap gap-2 text-xs">
              <span className="font-semibold text-sage-500">Topics:</span>
              {selectedArticle.seoKeywords.map((kw, i) => (
                <span key={i} className="bg-sand-100 text-sage-800 text-[11px] font-medium px-2.5 py-1 rounded-md">
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Related Retreats Recommendation Widget */}
          {relatedCentres.length > 0 && (
            <div className="bg-sage-900 text-white p-8 rounded-3xl border border-sage-800 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-gold-400 font-semibold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>RECOMMENDED RETREATS FOR THIS ARTICLE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedCentres.map((centre) => (
                  <div key={centre.id} className="bg-sage-950 p-4 rounded-2xl border border-sage-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-white">{centre.name}</h4>
                      <span className="text-xs text-sage-300 block">{centre.city}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCentreId(centre.id);
                        setActiveView('centre-detail');
                      }}
                      className="bg-terracotta-600 text-white font-medium text-xs px-3 py-2 rounded-lg"
                    >
                      View Ashram
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
    <div className="py-12 bg-sand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-sage-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-4 border border-sage-800">
          <div className="inline-flex items-center space-x-2 bg-sage-800/80 px-3 py-1 rounded-full text-gold-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Wellness & Travel Journal</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-sand-50">
            Authentic Indian Yoga & Travel Guides
          </h1>

          <p className="text-sage-300 text-sm sm:text-base max-w-2xl font-light">
            In-depth advice on 200h TTC school accreditation, Ayurvedic Panchakarma detox preparation, Himalayan packing lists, and e-visas.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 border-b border-sand-300 pb-4 overflow-x-auto text-xs font-semibold">
          {['all', 'Teacher Training', 'Ayurveda', 'Retreat Guides', 'Yoga Philosophy'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-sage-900 text-white shadow'
                  : 'bg-sand-200 text-sage-800 hover:bg-sand-300'
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
              className="bg-white rounded-2xl overflow-hidden border border-sand-300 shadow-luxury hover:shadow-2xl transition duration-300 flex flex-col cursor-pointer group"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={article.coverImage} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-sage-900/90 text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  {article.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs text-sage-500">
                    <span>{article.publishedDate}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-terracotta-500" />
                      <span>{article.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-sage-950 group-hover:text-terracotta-600 transition leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-sage-600 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={article.authorAvatar} 
                      alt={article.authorName} 
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs text-sage-800 font-medium">{article.authorName}</span>
                  </div>

                  <span className="text-xs font-semibold text-terracotta-600 group-hover:translate-x-0.5 transition-transform">
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
