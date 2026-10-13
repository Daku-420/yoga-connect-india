import React, { useState } from 'react';
import { YogaAsana, AsanaCategory } from '../../types';
import { mockAsanas } from '../../data/mockAsanas';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Clock, 
  CheckCircle2, 
  SlidersHorizontal,
  Flame,
  Award
} from 'lucide-react';

interface AsanaDirectoryProps {
  onSelectAsana: (asana: YogaAsana) => void;
}

export const AsanaDirectory: React.FC<AsanaDirectoryProps> = ({ onSelectAsana }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Standing', value: 'Standing' },
    { label: 'Backbends', value: 'Backbends' },
    { label: 'Seated & Forward Bends', value: 'Seated & Forward Bends' },
    { label: 'Inversions & Arm Balances', value: 'Inversions & Arm Balances' },
    { label: 'Restorative & Gentle', value: 'Restorative & Gentle' }
  ];

  const difficulties = [
    { label: 'All Levels', value: 'all' },
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
  ];

  const filteredAsanas = mockAsanas.filter(asana => {
    const matchesCategory = selectedCategory === 'all' || asana.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || asana.difficulty === selectedDifficulty;
    
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      asana.sanskritName.toLowerCase().includes(query) ||
      asana.englishName.toLowerCase().includes(query) ||
      asana.shortDescription.toLowerCase().includes(query) ||
      asana.targetMuscles.some(m => m.toLowerCase().includes(query)) ||
      asana.chakra.toLowerCase().includes(query) ||
      asana.seoKeywords.some(kw => kw.toLowerCase().includes(query));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Banner */}
      <div className="bg-[#263D32] text-white rounded-3xl p-8 sm:p-10 border border-[#344C3F] shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1 rounded-full text-[#DCCDB5] text-xs font-semibold backdrop-blur-md border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#A5B89A]" />
            <span>Classical Himalayan Asana Compendium</span>
          </div>

          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white leading-tight">
            Yoga Asana Directory: Poses, Steps &amp; Benefits
          </h2>

          <p className="text-[#A5B89A] text-xs sm:text-sm font-light leading-relaxed">
            Discover authentic Hatha &amp; Ashtanga postures with bio-mechanical alignment steps, anatomical benefits, contraindications, and subtle chakra associations directly from traditional Himalayan lineages.
          </p>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none hidden md:block">
          <Award className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-5">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8E9B91] absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search poses by Sanskrit or English name (e.g. Tree Pose, Vrikshasana, Backbends, Hamstrings)..."
            className="w-full bg-[#FAF9F5] border border-[#E2E5DD] rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm text-[#252C27] placeholder:text-[#8E9B91] focus:outline-none focus:ring-2 focus:ring-[#536B50]/30 focus:border-[#536B50] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8E9B91] hover:text-[#252C27]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#59665C]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#536B50]" />
            <span>Posture Category:</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 active:scale-95 cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-[#263D32] text-white shadow-xs'
                    : 'bg-[#F7F5EE] text-[#59665C] hover:bg-[#E6EDE2] hover:text-[#263D32] border border-[#E2E5DD]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Level Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E2E5DD] text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#59665C]">Difficulty:</span>
            <div className="flex gap-1.5">
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => setSelectedDifficulty(diff.value)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                    selectedDifficulty === diff.value
                      ? 'bg-[#536B50] text-white shadow-xs'
                      : 'bg-white text-[#59665C] hover:bg-[#F7F5EE] border border-[#E2E5DD]'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          <span className="text-[#8E9B91] text-[11px]">
            Showing <strong>{filteredAsanas.length}</strong> of {mockAsanas.length} asanas
          </span>
        </div>

      </div>

      {/* Asana Cards Grid */}
      {filteredAsanas.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E2E5DD] text-center space-y-3">
          <Compass className="w-10 h-10 text-[#8E9B91] mx-auto" />
          <h3 className="font-serif font-bold text-xl text-[#263D32]">No matching yoga asanas found</h3>
          <p className="text-xs text-[#59665C]">Try adjusting your search terms or category filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="bg-[#536B50] text-white text-xs font-semibold px-4 py-2 rounded-lg mt-2 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAsanas.map((asana) => (
            <article
              key={asana.id}
              onClick={() => onSelectAsana(asana)}
              className="card-lift bg-white rounded-3xl overflow-hidden border border-[#E2E5DD] hover:border-[#C5A880]/60 shadow-sm flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Photo Canvas */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#E6EDE2] image-zoom-container">
                  <img 
                    src={asana.coverImage} 
                    alt={`${asana.sanskritName} - ${asana.englishName}`} 
                    className="w-full h-full object-cover image-zoom-target"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badges on top */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="bg-[#263D32]/90 backdrop-blur-md text-[#F7F5EE] text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-[#3D5E4C]/50">
                      {asana.category}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs ${
                      asana.difficulty === 'Beginner' 
                        ? 'bg-emerald-100 text-emerald-900' 
                        : asana.difficulty === 'Intermediate'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-purple-100 text-purple-900'
                    }`}>
                      {asana.difficulty}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white z-10 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#DCCDB5] font-medium">
                      Hold: {asana.recommendedHold}
                    </span>
                    <span className="text-[10px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-white/90">
                      {asana.steps.length} Steps
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif font-bold text-2xl text-[#263D32] group-hover:text-[#536B50] transition-colors leading-tight">
                        {asana.sanskritName}
                      </h3>
                      {asana.sanskritDevanagari && (
                        <span className="text-base text-[#536B50] font-serif font-medium">
                          {asana.sanskritDevanagari}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#59665C] mt-0.5">
                      {asana.englishName}
                    </p>
                  </div>

                  <p className="text-xs text-[#59665C] leading-relaxed line-clamp-2 font-light">
                    {asana.shortDescription}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E2E5DD]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#263D32] block">
                      Key Benefits:
                    </span>
                    {asana.anatomicalBenefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-[11px] text-[#59665C]">
                        <CheckCircle2 className="w-3 h-3 text-[#286749] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Target Muscles */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {asana.targetMuscles.slice(0, 3).map((muscle, idx) => (
                      <span key={idx} className="bg-[#FAF9F5] border border-[#E8E6DE] text-[#59665C] text-[10px] px-2 py-0.5 rounded">
                        {muscle}
                      </span>
                    ))}
                  </div>

                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-6 pt-0 border-t border-transparent">
                <div className="pt-3 border-t border-[#E2E5DD] flex items-center justify-between text-xs font-semibold text-[#536B50] group-hover:text-[#263D32] transition-colors">
                  <span>Explore Steps &amp; Precautions</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>

            </article>
          ))}
        </div>
      )}

      {/* SEO Topic Cloud Footer */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E5DD] space-y-3 text-xs">
        <span className="font-semibold text-[#263D32]">Popular Yoga Asana Queries:</span>
        <div className="flex flex-wrap gap-2 text-[11px] text-[#59665C]">
          <span className="bg-[#FAF9F5] border border-[#E2E5DD] px-2.5 py-1 rounded-md">#yoga asana poses and benefits</span>
          <span className="bg-[#FAF9F5] border border-[#E2E5DD] px-2.5 py-1 rounded-md">#hatha yoga postures steps</span>
          <span className="bg-[#FAF9F5] border border-[#E2E5DD] px-2.5 py-1 rounded-md">#beginner yoga asanas rishikesh</span>
          <span className="bg-[#FAF9F5] border border-[#E2E5DD] px-2.5 py-1 rounded-md">#sun salutation 12 poses</span>
          <span className="bg-[#FAF9F5] border border-[#E2E5DD] px-2.5 py-1 rounded-md">#asanas for back pain and flexibility</span>
          <span className="bg-[#FAF9F5] border border-[#E2E5DD] px-2.5 py-1 rounded-md">#king of asanas headstand</span>
        </div>
      </div>

    </div>
  );
};
