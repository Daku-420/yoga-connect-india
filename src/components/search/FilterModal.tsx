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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F7F5EE] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E2E5DD] shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E2E5DD] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-2.5">
            <SlidersHorizontal className="w-5 h-5 text-[#536B50]" />
            <h3 className="font-serif font-bold text-xl text-[#263D32]">
              Filter Uttarakhand Retreats
            </h3>
          </div>

          <button 
            onClick={() => setIsFilterModalOpen(false)}
            className="p-1.5 text-[#59665C] hover:text-[#263D32] rounded-full hover:bg-[#E6EDE2] transition"
            aria-label="Close filter modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1 text-sm text-[#252C27]">
          
          {/* Location */}
          <div className="space-y-2">
            <label className="font-semibold text-[#263D32] text-xs uppercase tracking-wider block">
              Destination Geography
            </label>
            <select
              value={filters.searchLocation}
              onChange={(e) => setFilters(f => ({ ...f, searchLocation: e.target.value }))}
              className="w-full bg-white border border-[#E2E5DD] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
            >
              <option value="all">All Locations (Uttarakhand & Partner Hubs)</option>
              <option value="Rishikesh">Rishikesh (Ganges Foothills)</option>
              <option value="Uttarkashi">Uttarkashi (High Himalayas)</option>
              <option value="Dehradun">Dehradun & Mussoorie</option>
              <option value="Haridwar">Haridwar (Ancient Ghats)</option>
              <option value="Nainital">Nainital & Almora (Kumaon)</option>
              <option value="Goa">Goa (Beachfront Partner)</option>
              <option value="Kerala">Kerala (Ayurveda Partner)</option>
            </select>
          </div>

          {/* Program Category */}
          <div className="space-y-2">
            <label className="font-semibold text-[#263D32] text-xs uppercase tracking-wider block">
              Course / Retreat Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Courses' },
                { id: '200h-ttc', label: '200h Yoga TTC' },
                { id: '300h-ttc', label: '300h Advanced TTC' },
                { id: 'ayurveda', label: 'Ayurveda Detox' },
                { id: 'meditation', label: 'Silent Meditation' },
                { id: 'breathwork', label: 'Breathwork & Kriya' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilters(f => ({ ...f, courseCategory: cat.id }))}
                  className={`p-3 rounded-xl border text-xs font-medium transition ${
                    filters.courseCategory === cat.id
                      ? 'bg-[#536B50] text-white border-[#536B50] shadow-sm'
                      : 'bg-white text-[#252C27] border-[#E2E5DD] hover:bg-[#E6EDE2]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2 bg-white p-5 rounded-xl border border-[#E2E5DD]">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#263D32] uppercase tracking-wider">Maximum Package Budget</span>
              <span className="text-[#536B50] font-bold text-sm">
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
              className="w-full accent-[#536B50] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#59665C]">
              <span>{formatPrice(500)}</span>
              <span>{formatPrice(1750)}</span>
              <span>{formatPrice(3000)}</span>
            </div>
          </div>

          {/* Checkboxes: Perks */}
          <div className="space-y-3 pt-2">
            <label className="font-semibold text-[#263D32] text-xs uppercase tracking-wider block">
              Inclusions & Amenities
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center space-x-2.5 cursor-pointer bg-white p-3.5 rounded-xl border border-[#E2E5DD] flex-1">
                <input
                  type="checkbox"
                  checked={filters.mealsIncluded}
                  onChange={(e) => setFilters(f => ({ ...f, mealsIncluded: e.target.checked }))}
                  className="rounded text-[#536B50] focus:ring-[#536B50] w-4 h-4"
                />
                <span className="text-xs font-medium text-[#252C27]">Sattvic Organic Meals Included</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer bg-white p-3.5 rounded-xl border border-[#E2E5DD] flex-1">
                <input
                  type="checkbox"
                  checked={filters.pickupIncluded}
                  onChange={(e) => setFilters(f => ({ ...f, pickupIncluded: e.target.checked }))}
                  className="rounded text-[#536B50] focus:ring-[#536B50] w-4 h-4"
                />
                <span className="text-xs font-medium text-[#252C27]">Airport Private Transfer Included</span>
              </label>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#E2E5DD] bg-white flex items-center justify-between sticky bottom-0 z-10">
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center space-x-1.5 text-xs text-[#59665C] hover:text-[#263D32] font-semibold"
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
            className="bg-[#536B50] hover:bg-[#40563E] text-white font-medium px-6 py-2.5 rounded-xl text-sm shadow-sm transition flex items-center space-x-2"
          >
            <Check className="w-4 h-4 text-white" />
            <span>Apply Filters & View</span>
          </button>
        </div>

      </div>
    </div>
  );
};
