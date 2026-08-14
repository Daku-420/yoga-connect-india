import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, BookOpen, Clock, SlidersHorizontal } from 'lucide-react';

export const QuickSearch: React.FC = () => {
  const { filters, setFilters, setActiveView, setIsFilterModalOpen } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('retreats');
  };

  return (
    <div className="relative z-20 max-w-6xl mx-auto -mt-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-luxury border border-sand-300/70 p-4 sm:p-6 backdrop-blur-lg">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          
          {/* Filter 1: Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-sage-700 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Location</span>
            </label>
            <select
              value={filters.searchLocation}
              onChange={(e) => setFilters(f => ({ ...f, searchLocation: e.target.value }))}
              className="w-full bg-sand-50 border border-sand-300 rounded-lg py-2.5 px-3 text-sm text-sage-900 focus:ring-2 focus:ring-sage-500 focus:outline-none cursor-pointer"
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

          {/* Filter 2: Course Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-sage-700 flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Course / Program</span>
            </label>
            <select
              value={filters.courseCategory}
              onChange={(e) => setFilters(f => ({ ...f, courseCategory: e.target.value }))}
              className="w-full bg-sand-50 border border-sand-300 rounded-lg py-2.5 px-3 text-sm text-sage-900 focus:ring-2 focus:ring-sage-500 focus:outline-none cursor-pointer"
            >
              <option value="all">All Courses & Retreats</option>
              <option value="200h-ttc">200 Hour Yoga TTC</option>
              <option value="300h-ttc">300 Hour Yoga TTC</option>
              <option value="500h-ttc">500 Hour Yoga TTC</option>
              <option value="ayurveda">Panchakarma Ayurveda</option>
              <option value="meditation">Silent Meditation</option>
              <option value="sound-healing">Sound Healing</option>
              <option value="breathwork">Breathwork & Kriya</option>
            </select>
          </div>

          {/* Filter 3: Duration */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-sage-700 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Duration</span>
            </label>
            <select
              value={filters.minDays === 0 ? 'all' : filters.minDays <= 7 ? '7' : '14'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '7') setFilters(f => ({ ...f, minDays: 3, maxDays: 7 }));
                else if (val === '14') setFilters(f => ({ ...f, minDays: 8, maxDays: 14 }));
                else if (val === '28') setFilters(f => ({ ...f, minDays: 15, maxDays: 30 }));
                else setFilters(f => ({ ...f, minDays: 0, maxDays: 30 }));
              }}
              className="w-full bg-sand-50 border border-sand-300 rounded-lg py-2.5 px-3 text-sm text-sage-900 focus:ring-2 focus:ring-sage-500 focus:outline-none cursor-pointer"
            >
              <option value="all">Any Duration</option>
              <option value="7">3 - 7 Days Retreat</option>
              <option value="14">8 - 14 Days Immersion</option>
              <option value="28">15 - 28 Days Full TTC</option>
            </select>
          </div>

          {/* More Filters Trigger */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="w-full bg-sand-100 hover:bg-sand-200 text-sage-800 border border-sand-300 font-medium py-2.5 px-3 rounded-lg text-sm transition flex items-center justify-center space-x-1.5"
            >
              <SlidersHorizontal className="w-4 h-4 text-terracotta-600" />
              <span>Advanced Filters</span>
            </button>
          </div>

          {/* Search Action Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-sage-900 hover:bg-sage-800 text-white font-medium py-2.5 px-4 rounded-lg text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Find Retreats</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
