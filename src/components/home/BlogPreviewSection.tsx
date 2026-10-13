import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockBlogs } from '../../data/mockBlogs';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const BlogPreviewSection: React.FC = () => {
  const { setSelectedBlogSlug, setActiveView } = useApp();

  return (
    <section className="py-20 bg-[#F7F5EE] border-b border-[#E2E5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[#536B50] text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-[#536B50]" />
              <span>Himalayan Wellness & Travel Journal</span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#263D32]">
              Uttarakhand Yoga & Travel Guides
            </h2>
            <p className="text-[#59665C] text-sm mt-2 max-w-xl">
              Practical guides on selecting 200h TTC schools in Rishikesh, Indian e-visa preparation, and Himalayan spiritual packing lists.
            </p>
          </div>

          <button
            onClick={() => setActiveView('blog')}
            className="inline-flex items-center space-x-2 text-[#263D32] font-semibold text-sm hover:text-[#536B50] transition group"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockBlogs.map((article) => (
            <div 
              key={article.id}
              onClick={() => {
                setSelectedBlogSlug(article.slug);
                setActiveView('blog-detail');
              }}
              className="card-lift bg-white rounded-2xl overflow-hidden border border-[#E2E5DD] hover:border-[#C5A880]/60 shadow-sm flex flex-col cursor-pointer group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#E6EDE2] image-zoom-container">
                <img 
                  src={article.coverImage} 
                  alt={article.title}
                  className="w-full h-full object-cover image-zoom-target"
                />
                <div className="absolute top-3 left-3 bg-[#263D32]/90 text-[#F7F5EE] text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md shadow-xs z-10">
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

                  <h3 className="font-serif font-bold text-lg text-[#263D32] group-hover:text-[#536B50] transition-colors leading-snug line-clamp-2">
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
                      className="w-7 h-7 rounded-full object-cover border border-[#E2E5DD]"
                    />
                    <span className="text-xs text-[#252C27] font-medium">{article.authorName}</span>
                  </div>

                  <span className="text-xs font-semibold text-[#536B50] group-hover:translate-x-1 transition-transform duration-300">
                    Read Article →
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
