import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, SlidersHorizontal, RefreshCw, Check } from 'lucide-react';

export const FilterModal: React.FC = () => {
  const { 
    isFilterModalOpen, 
    setIsFilterModalOpen, 
    filters, 
    setFilters, 
    resetFilters,
    formatPrice,
    setActiveView
  } = useApp();

  if (!isFilterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-sand-50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-sand-300 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-sand-300 flex items-center justify-between sticky top-0 bg-sand-50/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-terracotta-600" />
            <h3 className="font-serif font-bold text-xl text-sage-950">
              Advanced Filter Search
            </h3>
          </div>

          <button 
            onClick={() => setIsFilterModalOpen(false)}
            className="p-1.5 text-sage-500 hover:text-sage-900 rounded-full hover:bg-sand-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1 text-sm text-sage-900">
          
          {/* Location */}
          <div className="space-y-2">
            <label className="font-semibold text-sage-800 text-xs uppercase tracking-wider block">
              Destination Location
            </label>
            <select
              value={filters.searchLocation}
              onChange={(e) => setFilters(f => ({ ...f, searchLocation: e.target.value }))}
              className="w-full bg-white border border-sand-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sage-500 focus:outline-none"
            >
              <option value="all">All Locations (India)</option>
              <option value="Rishikesh">Rishikesh (Himalayas)</option>
              <option value="Goa">Goa (Beachfront)</option>
              <option value="Kerala">Kerala (Ayurveda)</option>
              <option value="Dharamshala">Dharamshala (Dhauladhar)</option>
              <option value="Mysore">Mysore (Ashtanga)</option>
              <option value="Haridwar">Haridwar (Ganga)</option>
              <option value="Dehradun">Dehradun</option>
              <option value="Pondicherry">Pondicherry</option>
            </select>
          </div>

          {/* Program Category */}
          <div className="space-y-2">
            <label className="font-semibold text-sage-800 text-xs uppercase tracking-wider block">
              Course / Retreat Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Courses' },
                { id: '200h-ttc', label: '200h Yoga TTC' },
                { id: '300h-ttc', label: '300h Advanced TTC' },
                { id: '500h-ttc', label: '500h Master TTC' },
                { id: 'ayurveda', label: 'Ayurveda Detox' },
                { id: 'meditation', label: 'Silent Meditation' },
                { id: 'sound-healing', label: 'Sound Healing' },
                { id: 'breathwork', label: 'Breathwork & Kriya' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, courseCategory: cat.id }))}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition ${
                    filters.courseCategory === cat.id
                      ? 'bg-sage-900 text-white border-sage-900 shadow'
                      : 'bg-white text-sage-800 border-sand-300 hover:bg-sand-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2 bg-white p-4 rounded-xl border border-sand-300">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-sage-800 uppercase tracking-wider">Maximum Budget</span>
              <span className="text-terracotta-600 font-bold text-sm">
                Up to {formatPrice(filters.maxPriceUSD)}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="3000"
              step="50"
              value={filters.maxPriceUSD}
              onChange={(e) => setFilters(f => ({ ...f, maxPriceUSD: Number(e.target.value) }))}
              className="w-full accent-terracotta-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-sage-500 font-medium">
              <span>{formatPrice(500)}</span>
              <span>{formatPrice(1750)}</span>
              <span>{formatPrice(3000)}</span>
            </div>
          </div>

          {/* Certification Filter */}
          <div className="space-y-2">
            <label className="font-semibold text-sage-800 text-xs uppercase tracking-wider block">
              Yoga Alliance Accreditation
            </label>
            <select
              value={filters.certification}
              onChange={(e) => setFilters(f => ({ ...f, certification: e.target.value }))}
              className="w-full bg-white border border-sand-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sage-500 focus:outline-none"
            >
              <option value="all">Any Accreditation</option>
              <option value="RYS 200">Yoga Alliance RYS 200 Certified</option>
              <option value="RYS 300">Yoga Alliance RYS 300 Certified</option>
              <option value="RYS 500">Yoga Alliance RYS 500 Certified</option>
              <option value="AYUSH">Government of Kerala NABH Ayurveda</option>
            </select>
          </div>

          {/* Checkboxes: Perks */}
          <div className="space-y-3 pt-2">
            <label className="font-semibold text-sage-800 text-xs uppercase tracking-wider block">
              Included Amenities & Services
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center space-x-2 cursor-pointer bg-white p-3 rounded-lg border border-sand-300 flex-1">
                <input
                  type="checkbox"
                  checked={filters.mealsIncluded}
                  onChange={(e) => setFilters(f => ({ ...f, mealsIncluded: e.target.checked }))}
                  className="rounded text-terracotta-600 focus:ring-terracotta-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-sage-900">3 Sattvic Organic Meals Included</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer bg-white p-3 rounded-lg border border-sand-300 flex-1">
                <input
                  type="checkbox"
                  checked={filters.pickupIncluded}
                  onChange={(e) => setFilters(f => ({ ...f, pickupIncluded: e.target.checked }))}
                  className="rounded text-terracotta-600 focus:ring-terracotta-500 w-4 h-4"
                />
                <span className="text-xs font-medium text-sage-900">Airport Private Pickup Included</span>
              </label>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-sand-300 bg-sand-100 flex items-center justify-between sticky bottom-0 z-10">
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center space-x-1.5 text-xs text-sage-700 hover:text-sage-950 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsFilterModalOpen(false);
              setActiveView('retreats');
            }}
            className="bg-sage-900 hover:bg-sage-800 text-white font-medium px-6 py-2.5 rounded-xl text-sm shadow-md transition flex items-center space-x-2"
          >
            <Check className="w-4 h-4 text-gold-400" />
            <span>Apply Filters & View Results</span>
          </button>
        </div>

      </div>
    </div>
  );
};
