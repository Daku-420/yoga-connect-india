import React, { useState, useMemo } from 'react';
import { 
  YogaAsana, 
  AsanaBodyPosition, 
  AsanaDifficulty, 
  AsanaPracticeIntention, 
  AsanaTradition 
} from '../../types';
import { mockAsanas } from '../../data/mockAsanas';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  SlidersHorizontal,
  Flame,
  Award,
  BookOpen,
  Filter,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Heart,
  Feather
} from 'lucide-react';

interface AsanaDirectoryProps {
  onSelectAsana: (asana: YogaAsana) => void;
  initialFilter?: {
    category?: string;
    level?: string;
  };
}

export const AsanaDirectory: React.FC<AsanaDirectoryProps> = ({ 
  onSelectAsana,
  initialFilter 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPosition, setSelectedBodyPosition] = useState<string>(initialFilter?.category || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(initialFilter?.level || 'all');
  const [selectedIntention, setSelectedIntention] = useState<string>('all');
  const [selectedTradition, setSelectedTradition] = useState<string>('all');
  const [activeTabPreset, setActiveTabPreset] = useState<'all' | 'beginner' | 'restorative' | 'meditation' | 'advanced'>('all');

  const bodyPositions: { label: string; value: string }[] = [
    { label: 'All Postures', value: 'all' },
    { label: 'Standing', value: 'Standing' },
    { label: 'Seated', value: 'Seated' },
    { label: 'Forward Folds', value: 'Forward Folds' },
    { label: 'Backbends', value: 'Backbends' },
    { label: 'Twists', value: 'Twists' },
    { label: 'Side Bends', value: 'Side Bends' },
    { label: 'Balancing', value: 'Balancing' },
    { label: 'Arm Balances', value: 'Arm Balances' },
    { label: 'Inversions', value: 'Inversions' },
    { label: 'Supine', value: 'Supine' },
    { label: 'Prone', value: 'Prone' },
    { label: 'Restorative', value: 'Restorative' },
    { label: 'Meditation Postures', value: 'Meditation Postures' }
  ];

  const difficulties: { label: string; value: string }[] = [
    { label: 'All Levels', value: 'all' },
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
    { label: 'Adaptive & Supported', value: 'Adaptive & Supported' }
  ];

  const intentions: { label: string; value: string }[] = [
    { label: 'All Intentions', value: 'all' },
    { label: 'Mobility & Flexibility', value: 'Mobility & Flexibility' },
    { label: 'Balance & Coordination', value: 'Balance & Coordination' },
    { label: 'Strength & Stability', value: 'Strength & Stability' },
    { label: 'Relaxation', value: 'Relaxation' },
    { label: 'Meditation', value: 'Meditation' },
    { label: 'Restorative Practice', value: 'Restorative Practice' },
    { label: 'Traditional Yoga Practice', value: 'Traditional Yoga Practice' }
  ];

  const traditions: { label: string; value: string }[] = [
    { label: 'All Traditions', value: 'all' },
    { label: 'Hatha', value: 'Hatha' },
    { label: 'Ashtanga', value: 'Ashtanga' },
    { label: 'Iyengar', value: 'Iyengar' },
    { label: 'Vinyasa', value: 'Vinyasa' },
    { label: 'Yin', value: 'Yin' },
    { label: 'Restorative', value: 'Restorative' },
    { label: 'Classical Hatha', value: 'Classical Hatha' }
  ];

  // Preset filter helper
  const handlePresetClick = (preset: 'all' | 'beginner' | 'restorative' | 'meditation' | 'advanced') => {
    setActiveTabPreset(preset);
    if (preset === 'all') {
      setSelectedBodyPosition('all');
      setSelectedDifficulty('all');
      setSelectedIntention('all');
    } else if (preset === 'beginner') {
      setSelectedBodyPosition('all');
      setSelectedDifficulty('Beginner');
      setSelectedIntention('all');
    } else if (preset === 'restorative') {
      setSelectedBodyPosition('Restorative');
      setSelectedDifficulty('all');
      setSelectedIntention('all');
    } else if (preset === 'meditation') {
      setSelectedBodyPosition('Meditation Postures');
      setSelectedDifficulty('all');
      setSelectedIntention('Meditation');
    } else if (preset === 'advanced') {
      setSelectedBodyPosition('all');
      setSelectedDifficulty('Advanced');
      setSelectedIntention('all');
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedBodyPosition('all');
    setSelectedDifficulty('all');
    setSelectedIntention('all');
    setSelectedTradition('all');
    setActiveTabPreset('all');
  };

  const filteredAsanas = useMemo(() => {
    return mockAsanas.filter(asana => {
      // Body Position match (checks category or bodyPositions array)
      const matchesPosition = selectedBodyPosition === 'all' || 
        asana.category === selectedBodyPosition ||
        (asana.bodyPositions && asana.bodyPositions.includes(selectedBodyPosition as AsanaBodyPosition));

      // Difficulty match
      const matchesDifficulty = selectedDifficulty === 'all' || 
        asana.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      // Intention match
      const matchesIntention = selectedIntention === 'all' ||
        (asana.intentions && asana.intentions.includes(selectedIntention as AsanaPracticeIntention));

      // Tradition match
      const matchesTradition = selectedTradition === 'all' ||
        (asana.traditions && asana.traditions.includes(selectedTradition as AsanaTradition));

      // Search match across English, Sanskrit, Alternative Names, etymology, target muscles, keywords
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        asana.sanskritName.toLowerCase().includes(query) ||
        (asana.sanskritDevanagari && asana.sanskritDevanagari.includes(query)) ||
        (asana.transliterationIast && asana.transliterationIast.toLowerCase().includes(query)) ||
        asana.englishName.toLowerCase().includes(query) ||
        (asana.alternativeNames && asana.alternativeNames.some(alt => alt.toLowerCase().includes(query))) ||
        asana.shortDescription.toLowerCase().includes(query) ||
        asana.etymology.toLowerCase().includes(query) ||
        asana.targetMuscles.some(m => m.toLowerCase().includes(query)) ||
        asana.chakra.toLowerCase().includes(query) ||
        asana.seoKeywords.some(kw => kw.toLowerCase().includes(query));

      return matchesPosition && matchesDifficulty && matchesIntention && matchesTradition && matchesSearch;
    });
  }, [searchQuery, selectedBodyPosition, selectedDifficulty, selectedIntention, selectedTradition]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Hero Banner */}
      <div className="bg-[#263D32] text-white rounded-3xl p-8 sm:p-12 border border-[#344C3F] shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1 rounded-full text-[#DCCDB5] text-xs font-semibold backdrop-blur-md border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#A5B89A]" />
            <span>Living Himalayan Yoga Encyclopedia</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white leading-tight">
            Comprehensive Yoga Asana Library
          </h1>

          <p className="text-[#A5B89A] text-xs sm:text-base font-light leading-relaxed">
            An authentic, peer-reviewed directory of classical and modern yoga postures. Grounded in sacred Sanskrit origins from Hatha &amp; Ashtanga lineages, with certified biomechanical alignment, common error corrections, prop modifications, and verified ashram retreats in Uttarakhand.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#DCCDB5]">
            <span className="flex items-center space-x-1.5 bg-[#1C2E25] px-3 py-1.5 rounded-lg border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A5B89A]" />
              <span>Evidence-based anatomical safety</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-[#1C2E25] px-3 py-1.5 rounded-lg border border-white/5">
              <BookOpen className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Classical text references (Hatha Yoga Pradipika &amp; Gheranda Samhita)</span>
            </span>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-6 -bottom-8 opacity-10 pointer-events-none hidden lg:block">
          <Award className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Quick Curated Presets Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
        {[
          { id: 'all', label: 'All Postures' },
          { id: 'beginner', label: 'Beginner Foundations' },
          { id: 'restorative', label: 'Restorative & Gentle' },
          { id: 'meditation', label: 'Meditation Postures' },
          { id: 'advanced', label: 'Advanced & Inversions' }
        ].map(preset => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset.id as any)}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              activeTabPreset === preset.id
                ? 'bg-[#263D32] text-white shadow-xs'
                : 'bg-white border border-[#E2E5DD] text-[#59665C] hover:bg-[#E6EDE2] hover:text-[#263D32]'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Search & Multi-Axis Filter Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E5DD] shadow-sm space-y-6">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8E9B91] absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Sanskrit name, English name, alternative names (e.g., Tree Pose, Vrikshasana, Samasthiti, Backbends, Hamstrings)..."
            className="w-full bg-[#FAF9F5] border border-[#E2E5DD] rounded-2xl py-3 pl-11 pr-16 text-xs sm:text-sm text-[#252C27] placeholder:text-[#8E9B91] focus:outline-none focus:ring-2 focus:ring-[#536B50]/30 focus:border-[#536B50] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8E9B91] hover:text-[#252C27] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Multi-Dimensional Filter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* 1. Body Position / Category */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#252C27] flex items-center space-x-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#536B50]" />
              <span>Body Position &amp; Movement</span>
            </label>
            <select
              value={selectedBodyPosition}
              onChange={(e) => setSelectedBodyPosition(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E2E5DD] rounded-xl px-3 py-2.5 text-xs text-[#252C27] focus:outline-none focus:border-[#536B50] cursor-pointer"
            >
              {bodyPositions.map(bp => (
                <option key={bp.value} value={bp.value}>{bp.label}</option>
              ))}
            </select>
          </div>

          {/* 2. Experience Level */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#252C27] flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Experience Level</span>
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E2E5DD] rounded-xl px-3 py-2.5 text-xs text-[#252C27] focus:outline-none focus:border-[#536B50] cursor-pointer"
            >
              {difficulties.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* 3. Practice Intention */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#252C27] flex items-center space-x-1.5">
              <Heart className="w-3.5 h-3.5 text-[#8E9B91]" />
              <span>Practice Intention</span>
            </label>
            <select
              value={selectedIntention}
              onChange={(e) => setSelectedIntention(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E2E5DD] rounded-xl px-3 py-2.5 text-xs text-[#252C27] focus:outline-none focus:border-[#536B50] cursor-pointer"
            >
              {intentions.map(i => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </select>
          </div>

          {/* 4. Yoga Style / Tradition */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#252C27] flex items-center space-x-1.5">
              <Feather className="w-3.5 h-3.5 text-[#536B50]" />
              <span>Tradition / Style</span>
            </label>
            <select
              value={selectedTradition}
              onChange={(e) => setSelectedTradition(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E2E5DD] rounded-xl px-3 py-2.5 text-xs text-[#252C27] focus:outline-none focus:border-[#536B50] cursor-pointer"
            >
              {traditions.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Filter Summary & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E2E5DD] text-xs">
          <div className="flex items-center space-x-2 text-[#59665C]">
            <span>Showing <strong className="text-[#263D32]">{filteredAsanas.length}</strong> of {mockAsanas.length} poses</span>
            {(selectedBodyPosition !== 'all' || selectedDifficulty !== 'all' || selectedIntention !== 'all' || selectedTradition !== 'all' || searchQuery) && (
              <span className="bg-[#E6EDE2] text-[#263D32] font-semibold px-2 py-0.5 rounded text-[10px]">
                Filtered
              </span>
            )}
          </div>

          {(selectedBodyPosition !== 'all' || selectedDifficulty !== 'all' || selectedIntention !== 'all' || selectedTradition !== 'all' || searchQuery) && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center space-x-1 text-xs text-[#536B50] hover:text-[#263D32] font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

      </div>

      {/* Asana Directory Cards Grid */}
      {filteredAsanas.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E2E5DD] text-center space-y-4">
          <Compass className="w-12 h-12 text-[#8E9B91] mx-auto opacity-70" />
          <h3 className="font-serif font-bold text-xl text-[#263D32]">No matching yoga asanas found</h3>
          <p className="text-xs text-[#59665C] max-w-md mx-auto">
            We couldn't find any postures matching your exact filter criteria. Try adjusting the difficulty, body position, or search query.
          </p>
          <button
            onClick={resetAllFilters}
            className="bg-[#536B50] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#40563E] transition cursor-pointer"
          >
            Show All Postures
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAsanas.map((asana) => (
            <div 
              key={asana.id}
              onClick={() => onSelectAsana(asana)}
              className="card-lift bg-white rounded-3xl overflow-hidden border border-[#E2E5DD] hover:border-[#C5A880]/60 shadow-sm transition-all duration-300 flex flex-col cursor-pointer group"
            >
              {/* Asana Cover Image with Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#E6EDE2] image-zoom-container">
                <img 
                  src={asana.coverImage} 
                  alt={`${asana.sanskritName} - ${asana.englishName}`}
                  className="w-full h-full object-cover image-zoom-target"
                />
                
                {/* Category Pill */}
                <div className="absolute top-3 left-3 bg-[#263D32]/90 text-[#F7F5EE] text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md shadow-xs z-10">
                  {asana.category}
                </div>

                {/* Difficulty Pill */}
                <div className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs z-10 ${
                  asana.difficulty === 'Beginner' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/40' 
                    : asana.difficulty === 'Intermediate'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300/40'
                    : 'bg-rose-100 text-rose-800 border border-rose-300/40'
                }`}>
                  {asana.difficulty}
                </div>

                {/* Devanagari Script Watermark on Card */}
                {asana.sanskritDevanagari && (
                  <div className="absolute bottom-2 right-3 text-white/80 font-serif text-lg font-bold drop-shadow-md z-10 pointer-events-none">
                    {asana.sanskritDevanagari}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  
                  {/* Sanskrit & Pronunciation Guidance */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-[#536B50] tracking-wider uppercase block">
                      {asana.transliterationIast || asana.sanskritName}
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-[#263D32] group-hover:text-[#536B50] transition-colors leading-snug">
                      {asana.englishName}
                    </h3>
                  </div>

                  {/* Alternative Names subtitle */}
                  {asana.alternativeNames && asana.alternativeNames.length > 0 && (
                    <div className="text-[11px] text-[#8E9B91] italic">
                      Also known as: {asana.alternativeNames.slice(0, 2).join(', ')}
                    </div>
                  )}

                  {/* Short Description */}
                  <p className="text-xs text-[#59665C] line-clamp-2 leading-relaxed font-light">
                    {asana.shortDescription}
                  </p>

                  {/* Key Target Muscles Chips */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {asana.targetMuscles.slice(0, 3).map((muscle, i) => (
                      <span key={i} className="bg-[#FAF9F5] text-[#59665C] text-[10px] px-2 py-0.5 rounded border border-[#E2E5DD]">
                        {muscle}
                      </span>
                    ))}
                    {asana.targetMuscles.length > 3 && (
                      <span className="text-[10px] text-[#8E9B91] self-center">
                        +{asana.targetMuscles.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Chakra & Action Link */}
                <div className="pt-4 border-t border-[#E2E5DD] flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[11px] text-[#59665C]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span className="font-medium truncate max-w-[130px]">{asana.chakra.split('(')[0]}</span>
                  </div>

                  <span className="text-xs font-semibold text-[#536B50] group-hover:text-[#263D32] group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center space-x-1">
                    <span>View Pose Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety & Educational Notice Strip */}
      <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#E2E5DD] text-xs text-[#59665C] space-y-2">
        <div className="flex items-center space-x-2 font-bold text-[#263D32]">
          <ShieldCheck className="w-4 h-4 text-[#536B50]" />
          <span>Yoga Asana Editorial Safety &amp; Lineage Safeguards</span>
        </div>
        <p className="leading-relaxed font-light">
          Educational content provided on YogaConnect India is compiled from classical Hatha and Ashtanga texts, biomechanical literature, and certified Himalayan yoga teachers. This guide is not personalized medical advice. If you have preexisting spinal, cardiovascular, or joint conditions, always practice under the supervision of a certified yoga instructor.
        </p>
      </div>

    </div>
  );
};
