import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  Sparkles, 
  Heart, 
  Flame, 
  Moon, 
  Sun, 
  Leaf, 
  Volume2, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const QuickSearch: React.FC = () => {
  const { filters, setFilters, setActiveView } = useApp();

  const styles = [
    {
      id: 'all',
      title: 'All Experiences',
      category: 'all',
      icon: Compass,
      desc: 'Browse entire directory'
    },
    {
      id: '200h-ttc',
      title: '200h Yoga TTC',
      category: '200h-ttc',
      icon: BookOpen,
      desc: 'Yoga Alliance certification'
    },
    {
      id: 'ayurveda',
      title: 'Ayurveda & Panchakarma',
      category: 'ayurveda',
      icon: Leaf,
      desc: 'Doctor-supervised detox'
    },
    {
      id: 'meditation',
      title: 'Silent Meditation & Mauna',
      category: 'meditation',
      icon: Moon,
      desc: 'Deep Himalayan silence'
    },
    {
      id: 'breathwork',
      title: 'Pranayama & Kriya',
      category: 'breathwork',
      icon: Sun,
      desc: 'Classical breath science'
    },
    {
      id: 'sound-healing',
      title: 'Sound Healing & Nada',
      category: 'sound-healing',
      icon: Volume2,
      desc: 'Tibetan singing bowls'
    }
  ];

  const handleStyleSelect = (category: string) => {
    setFilters(f => ({ ...f, courseCategory: category }));
    setActiveView('retreats');
  };

  return (
    <section className="bg-[#F7F5EE] py-10 border-b border-[#E2E5DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E2E5DD] gap-2">
          <div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32]">
              Explore by Yoga Style & Immersion
            </h2>
            <p className="text-[#59665C] text-xs sm:text-sm mt-1">
              Filter verified Uttarakhand programs by your personal practice intention.
            </p>
          </div>

          <button
            onClick={() => setActiveView('retreats')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#536B50] hover:text-[#40563E] transition"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Style Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-6">
          {styles.map(s => {
            const Icon = s.icon;
            const isSelected = filters.courseCategory === s.category;

            return (
              <button
                key={s.id}
                onClick={() => handleStyleSelect(s.category)}
                className={`card-lift p-4 rounded-xl text-left border transition-all duration-300 flex flex-col justify-between group active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#536B50] shadow-md ring-2 ring-[#536B50]/30'
                    : 'bg-white border-[#E2E5DD] hover:border-[#C5A880]/70 hover:shadow-sm'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#E6EDE2] text-[#536B50] flex items-center justify-center mb-3 group-hover:bg-[#536B50] group-hover:text-white transition-all duration-300 shadow-2xs">
                  <Icon className="w-4 h-4 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-[#252C27] group-hover:text-[#263D32] transition-colors leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-[#59665C] mt-0.5 line-clamp-1">
                    {s.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
