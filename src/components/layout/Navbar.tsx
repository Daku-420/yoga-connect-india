import React, { useState } from 'react';
import { useApp, CURRENCY_CONFIGS } from '../../context/AppContext';
import { CurrencyCode, UserRole } from '../../types';
import { 
  Heart, 
  Globe, 
  ShieldCheck, 
  User, 
  Building2, 
  Crown, 
  Menu, 
  X,
  Compass, 
  MapPin
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    brandName, 
    currency, 
    setCurrency, 
    userRole, 
    setUserRole, 
    activeView, 
    setActiveView,
    wishlist,
    filters,
    setFilters
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roles: { role: UserRole; label: string; icon: any; color: string }[] = [
    { role: 'visitor', label: 'Traveler View', icon: Globe, color: 'bg-[#536B50] text-white' },
    { role: 'user', label: 'My Bookings', icon: User, color: 'bg-[#40563E] text-white' },
    { role: 'centre', label: 'Centre Portal', icon: Building2, color: 'bg-[#263D32] text-white' },
    { role: 'admin', label: 'Admin Escrow', icon: Crown, color: 'bg-[#1E3228] text-white' },
  ];

  const handleNavClick = (view: string, filterCategory?: string) => {
    if (filterCategory) {
      setFilters(f => ({ ...f, courseCategory: filterCategory }));
    } else if (view === 'retreats') {
      setFilters(f => ({ ...f, courseCategory: 'all' }));
    }
    setActiveView(view as any);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5EE]/95 backdrop-blur-md border-b border-[#E2E5DD] transition-all duration-300">
      
      {/* Top Utility Bar - Forest Green with Warm Ivory Text */}
      <div className="bg-[#263D32] text-[#F7F5EE] text-xs py-2 px-4 border-b border-[#1E3228]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          {/* Escrow Guarantee Statement */}
          <div className="flex items-center space-x-2 text-[#A5B89A]">
            <ShieldCheck className="w-4 h-4 text-[#DCCDB5] shrink-0" />
            <span>
              <strong className="text-white font-medium">100% Escrow Protected:</strong> Traveler inquiries stay strictly private with admin until booking confirmation.
            </span>
          </div>

          {/* Right Controls: Currency Selector & Role Switcher */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Currency Selector */}
            <div className="flex items-center space-x-1.5 bg-[#1E3228] rounded-md px-2.5 py-1 border border-[#3D5E4C]/50">
              <Globe className="w-3.5 h-3.5 text-[#A5B89A]" />
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
                aria-label="Select currency"
              >
                {Object.values(CURRENCY_CONFIGS).map(c => (
                  <option key={c.code} value={c.code} className="bg-[#263D32] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Role Switcher */}
            <div className="hidden lg:flex items-center space-x-1">
              <span className="text-[#A5B89A] mr-1 text-[11px]">Role:</span>
              {roles.map(r => {
                const Icon = r.icon;
                const isActive = userRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => {
                      setUserRole(r.role);
                      if (r.role === 'user') setActiveView('user-dashboard');
                      else if (r.role === 'centre') setActiveView('centre-dashboard');
                      else if (r.role === 'admin') setActiveView('admin-dashboard');
                      else setActiveView('home');
                    }}
                    className={`flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-md transition ${
                      isActive 
                        ? `${r.color} font-medium shadow-sm ring-1 ring-[#A5B89A]` 
                        : 'text-[#A5B89A] hover:text-white hover:bg-[#1E3228]'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between">
        
        {/* Brand Logo - Standalone Official Logo */}
        <div className="flex items-center">
          <button 
            onClick={() => setActiveView('home')} 
            className="flex items-center text-left group focus-visible:outline-none shrink-0"
            aria-label="YogaConnect India Home"
          >
            <img 
              src="/pictures/yogaconnect_india_logo.png" 
              alt="YogaConnect India" 
              className="h-16 sm:h-20 lg:h-[84px] xl:h-[88px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium text-[#252C27]" aria-label="Main Navigation">
          <button 
            onClick={() => handleNavClick('retreats', 'all')}
            className={`transition-colors py-1.5 hover:text-[#536B50] ${activeView === 'retreats' && filters.courseCategory === 'all' ? 'text-[#536B50] font-semibold border-b-2 border-[#536B50]' : ''}`}
          >
            Yoga Centres
          </button>
          
          <button 
            onClick={() => handleNavClick('retreats', 'meditation')}
            className={`transition-colors py-1.5 hover:text-[#536B50] ${activeView === 'retreats' && filters.courseCategory === 'meditation' ? 'text-[#536B50] font-semibold border-b-2 border-[#536B50]' : ''}`}
          >
            Yoga Retreats
          </button>

          <button 
            onClick={() => handleNavClick('retreats', '200h-ttc')}
            className={`transition-colors py-1.5 hover:text-[#536B50] ${activeView === 'retreats' && (filters.courseCategory === '200h-ttc' || filters.courseCategory === '300h-ttc') ? 'text-[#536B50] font-semibold border-b-2 border-[#536B50]' : ''}`}
          >
            Teacher Training (TTC)
          </button>

          <button 
            onClick={() => handleNavClick('destinations')}
            className={`transition-colors py-1.5 hover:text-[#536B50] ${activeView === 'destinations' ? 'text-[#536B50] font-semibold border-b-2 border-[#536B50]' : ''}`}
          >
            Destinations
          </button>

          <button 
            onClick={() => handleNavClick('asanas')}
            className={`transition-colors py-1.5 hover:text-[#536B50] flex items-center space-x-1.5 ${activeView === 'asanas' ? 'text-[#536B50] font-semibold border-b-2 border-[#536B50]' : ''}`}
          >
            <span>Yoga Asanas</span>
            <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              New
            </span>
          </button>

          <button 
            onClick={() => handleNavClick('blog')}
            className={`transition-colors py-1.5 hover:text-[#536B50] ${activeView === 'blog' || activeView === 'blog-detail' ? 'text-[#536B50] font-semibold border-b-2 border-[#536B50]' : ''}`}
          >
            Journal
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="hidden md:flex items-center space-x-3 xl:space-x-4">
          
          {/* Saved Wishlist */}
          <button 
            onClick={() => {
              setUserRole('user');
              setActiveView('user-dashboard');
            }}
            className="relative p-2.5 text-[#59665C] hover:text-[#263D32] hover:bg-[#E6EDE2] rounded-full transition"
            title="Saved Centres"
            aria-label="View saved centres"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#536B50] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Primary Action Button */}
          <button 
            onClick={() => handleNavClick('retreats', 'all')}
            className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm inline-flex items-center space-x-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Retreats</span>
          </button>

        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#263D32] hover:bg-[#E6EDE2] rounded-lg transition"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#F7F5EE] border-b border-[#E2E5DD] p-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          
          {/* Mobile Drawer Header with Standalone Official Logo */}
          <div className="flex items-center justify-start pb-3 border-b border-[#E2E5DD]">
            <img 
              src="/pictures/yogaconnect_india_logo.png" 
              alt="YogaConnect India" 
              className="h-16 w-auto object-contain" 
            />
          </div>
          
          {/* Role Switcher Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {roles.map(r => (
              <button
                key={r.role}
                onClick={() => {
                  setUserRole(r.role);
                  setIsMobileMenuOpen(false);
                  if (r.role === 'user') setActiveView('user-dashboard');
                  else if (r.role === 'centre') setActiveView('centre-dashboard');
                  else if (r.role === 'admin') setActiveView('admin-dashboard');
                  else setActiveView('home');
                }}
                className={`p-2 rounded-lg flex items-center space-x-1.5 font-medium transition ${
                  userRole === r.role ? r.color : 'bg-white border border-[#E2E5DD] text-[#252C27]'
                }`}
              >
                <r.icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          {/* Navigation Links */}
          <div className="border-t border-[#E2E5DD] pt-3 space-y-1 text-sm font-medium text-[#252C27]">
            <button 
              onClick={() => handleNavClick('home')}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white border-b border-[#E2E5DD]/60"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('retreats', 'all')}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white border-b border-[#E2E5DD]/60"
            >
              Yoga Centres &amp; Ashrams
            </button>
            <button 
              onClick={() => handleNavClick('retreats', 'meditation')}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white border-b border-[#E2E5DD]/60"
            >
              Yoga Retreats &amp; Ayurveda
            </button>
            <button 
              onClick={() => handleNavClick('retreats', '200h-ttc')}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white border-b border-[#E2E5DD]/60"
            >
              Teacher Training (TTC 200h/300h)
            </button>
            <button 
              onClick={() => handleNavClick('destinations')}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white border-b border-[#E2E5DD]/60"
            >
              Uttarakhand Destinations
            </button>
            <button 
              onClick={() => handleNavClick('asanas')}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white border-b border-[#E2E5DD]/60 flex items-center justify-between"
            >
              <span>Yoga Asanas (Poses, Steps &amp; Benefits)</span>
              <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-2 py-0.5 rounded-full">
                New
              </span>
            </button>
            <button 
              onClick={() => handleNavClick('blog')}
              className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-white border-b border-[#E2E5DD]/60"
            >
              Journal &amp; Guides
            </button>
            
            {/* Action buttons inside drawer */}
            <div className="pt-2">
              <button 
                onClick={() => { setActiveView('retreats'); setIsMobileMenuOpen(false); }}
                className="w-full text-center py-2.5 px-3 rounded-lg bg-[#536B50] hover:bg-[#40563E] text-white font-medium text-xs transition flex items-center justify-center space-x-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Retreats & Centres</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </header>
  );
};
