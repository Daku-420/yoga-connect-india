import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockBlogs } from '../../data/mockBlogs';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const BlogPreviewSection: React.FC = () => {
  const { setSelectedBlogSlug, setActiveView } = useApp();

  return (
    <section className="py-20 bg-sand-100 border-t border-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-terracotta-600 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-terracotta-500" />
              <span>Wellness & Travel Journal</span>
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-sage-950">
              India Yoga & Retreat Travel Guides
            </h2>
            <p className="text-sage-700 text-sm mt-2 max-w-xl">
              Expert advice on selecting 200h TTC schools, Indian e-visa preparation, Ayurvedic Panchakarma detox, and Himalayan spiritual packing lists.
            </p>
          </div>

          <button
            onClick={() => setActiveView('blog')}
            className="inline-flex items-center space-x-2 text-sage-900 font-semibold text-sm hover:text-terracotta-600 transition group"
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
              className="bg-white rounded-2xl overflow-hidden border border-sand-300 shadow-luxury hover:shadow-2xl transition duration-300 flex flex-col cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
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

                  <h3 className="font-serif font-bold text-lg text-sage-950 group-hover:text-terracotta-600 transition leading-snug line-clamp-2">
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
    </section>
  );
};
