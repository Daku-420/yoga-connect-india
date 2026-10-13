import React, { useState, useRef, useEffect } from 'react';
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
  MapPin,
  ChevronDown,
  BookOpen,
  Sparkles,
  HelpCircle,
  Calendar,
  CheckCircle2
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
    bookings,
    filters,
    setFilters
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string, filterCategory?: string) => {
    if (filterCategory) {
      setFilters(f => ({ ...f, courseCategory: filterCategory }));
    } else if (view === 'retreats') {
      setFilters(f => ({ ...f, courseCategory: 'all' }));
    }
    setActiveView(view as any);
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
      window.location.href = '/';
    }
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setUserRole('admin');
    setActiveView('admin-dashboard');
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
      window.location.href = '/admin';
    }
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

          {/* Right Controls: Admin Portal Shortcut */}
          <div className="flex items-center space-x-2 text-xs">
            <a
              href="/admin"
              onClick={handleAdminClick}
              className="flex items-center space-x-1.5 bg-[#1E3228] hover:bg-[#2F4738] text-[#DCCDB5] hover:text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#3D5E4C]/60 transition"
              title="Master Admin Escrow & Centre Portal"
            >
              <Crown className="w-3.5 h-3.5 text-gold-400" />
              <span>Admin Portal</span>
            </a>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between">
        
        {/* Brand Logo - Standalone Official Logo */}
        <div className="flex items-center">
          <button 
            onClick={() => handleNavClick('home')} 
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

          {/* Journal Dropdown */}
          <div className="relative group">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`transition-colors py-1.5 hover:text-[#536B50] flex items-center space-x-1 cursor-default ${
                activeView === 'blog' || activeView === 'blog-detail' || activeView === 'asanas' 
                  ? 'text-[#536B50] font-semibold border-b-2 border-[#536B50]' 
                  : ''
              }`}
            >
              <span>Journal</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8E9B91] group-hover:text-[#263D32] transition-transform duration-200 group-hover:rotate-180" />
            </button>

            {/* Dropdown Menu with Seamless Hover Bridge */}
            <div className="absolute top-full left-0 pt-2 w-64 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-[#E2E5DD] p-2 space-y-1">
                <button
                  onClick={() => handleNavClick('blog')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F5EE] transition flex items-center space-x-2.5 group/item cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-[#E6EDE2] text-[#263D32] shrink-0 group-hover/item:bg-[#263D32] group-hover/item:text-white transition-colors">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-xs font-semibold text-[#252C27] group-hover/item:text-[#263D32]">
                      Journal &amp; Travel Guides
                    </span>
                    <span className="text-[10px] text-[#8E9B91] block">
                      Retreat guides, TTC &amp; ashrams
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('asanas')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F5EE] transition flex items-center space-x-2.5 group/item cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-[#E6EDE2] text-[#263D32] shrink-0 group-hover/item:bg-[#263D32] group-hover/item:text-white transition-colors">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-xs font-semibold text-[#252C27] group-hover/item:text-[#263D32]">
                      Yoga Asana Directory
                    </span>
                    <span className="text-[10px] text-[#8E9B91] block">
                      Poses, steps, benefits &amp; cues
                    </span>
                  </div>
                </button>

                <div className="border-t border-[#E2E5DD] my-1" />

                <button
                  onClick={() => handleNavClick('support')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F5EE] transition flex items-center space-x-2.5 group/item cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-[#E6EDE2] text-[#263D32] shrink-0 group-hover/item:bg-[#263D32] group-hover/item:text-white transition-colors">
                    <HelpCircle className="w-3.5 h-3.5 text-[#536B50]" />
                  </div>
                  <div className="flex-1">
                    <span className="block text-xs font-semibold text-[#252C27] group-hover/item:text-[#263D32]">
                      FAQs
                    </span>
                    <span className="text-[10px] text-[#8E9B91] block">
                      11 Essential yoga questions answered
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Right Header Actions */}
        <div className="hidden md:flex items-center space-x-2.5 xl:space-x-3">
          
          {/* Saved Wishlist */}
          <button 
            onClick={() => {
              setUserRole('user');
              handleNavClick('user-dashboard');
            }}
            className="relative p-2 text-[#59665C] hover:text-[#263D32] hover:bg-[#E6EDE2] rounded-full transition cursor-pointer"
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

          {/* Primary Action Button: Explore Retreats */}
          <button 
            onClick={() => handleNavClick('retreats', 'all')}
            className="bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm inline-flex items-center space-x-1.5 shrink-0"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Retreats</span>
          </button>

          {/* Currency Selector (Located to the right of Explore Retreats) */}
          <div className="flex items-center space-x-1.5 bg-white hover:bg-[#F7F5EE] rounded-xl px-2.5 py-1.5 border border-[#E2E5DD] shadow-2xs transition">
            <Globe className="w-3.5 h-3.5 text-[#536B50] shrink-0" />
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-[#263D32] font-semibold text-xs focus:outline-none cursor-pointer"
              aria-label="Select currency"
            >
              {Object.values(CURRENCY_CONFIGS).map(c => (
                <option key={c.code} value={c.code} className="bg-white text-[#263D32]">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Icon with My Bookings Dropdown (To the right of Currency) */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`p-2 rounded-full border transition flex items-center justify-center relative cursor-pointer ${
                isProfileOpen 
                  ? 'bg-[#E6EDE2] text-[#263D32] border-[#536B50]' 
                  : 'bg-white hover:bg-[#E6EDE2] text-[#59665C] hover:text-[#263D32] border-[#E2E5DD]'
              }`}
              title="Profile & My Bookings"
              aria-label="Open profile menu"
              aria-expanded={isProfileOpen}
            >
              <User className="w-5 h-5" />
              {bookings.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#286749] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-white shadow">
                  {bookings.length}
                </span>
              )}
            </button>

            {/* Dropdown Menu inside Profile Icon */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E2E5DD] p-2 z-50 animate-fade-in space-y-1">
                {/* Profile Header */}
                <div className="px-3 py-2.5 bg-[#F7F5EE] rounded-xl flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E6EDE2] text-[#263D32] flex items-center justify-center shrink-0 border border-[#A5B89A]/40">
                    <User className="w-4 h-4 text-[#536B50]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-[#263D32] truncate">Traveler Profile</span>
                    <span className="block text-[10px] text-[#8E9B91] truncate">Escrow Protected Inquiries</span>
                  </div>
                </div>

                {/* My Bookings item inside Profile */}
                <button
                  onClick={() => {
                    setUserRole('user');
                    handleNavClick('user-dashboard');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F5EE] transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-[#E6EDE2] text-[#263D32] group-hover:bg-[#263D32] group-hover:text-white transition-colors">
                      <BookOpen className="w-4 h-4 text-[#536B50] group-hover:text-white" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-[#252C27] group-hover:text-[#263D32]">
                        My Bookings
                      </span>
                      <span className="text-[10px] text-[#8E9B91] block">
                        View retreat inquiries &amp; escrow status
                      </span>
                    </div>
                  </div>
                  {bookings.length > 0 && (
                    <span className="bg-[#E6EDE2] text-[#286749] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#286749]/30">
                      {bookings.length}
                    </span>
                  )}
                </button>

                {/* Saved Wishlist in Profile */}
                <button
                  onClick={() => {
                    setUserRole('user');
                    handleNavClick('user-dashboard');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F5EE] transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-[#F7F5EE] text-[#536B50]">
                      <Heart className="w-3.5 h-3.5 text-[#536B50]" />
                    </div>
                    <span className="text-xs font-medium text-[#252C27]">
                      Saved Retreats
                    </span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="text-[10px] font-semibold text-[#8E9B91]">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <div className="border-t border-[#E2E5DD] my-1" />

                {/* Admin Portal Shortcut in Profile */}
                <a
                  href="/admin"
                  onClick={(e) => {
                    handleAdminClick(e);
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F5EE] transition flex items-center space-x-2.5 text-[#59665C] hover:text-[#263D32] block"
                >
                  <Crown className="w-3.5 h-3.5 text-gold-400" />
                  <span className="text-xs font-medium">Admin &amp; Centre Portal</span>
                </a>
              </div>
            )}
          </div>

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
            {/* Journal Submenu in Mobile Drawer */}
            <div className="py-1 border-b border-[#E2E5DD]/60 space-y-1">
              <span className="block px-3 pt-1 text-[10px] font-bold text-[#8E9B91] uppercase tracking-wider">
                Journal
              </span>
              <button 
                onClick={() => handleNavClick('blog')}
                className="w-full text-left py-1.5 px-3 rounded-lg hover:bg-white flex items-center space-x-2 text-xs font-medium text-[#252C27]"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#536B50]" />
                <span>Journal &amp; Travel Guides</span>
              </button>
              <button 
                onClick={() => handleNavClick('asanas')}
                className="w-full text-left py-1.5 px-3 rounded-lg hover:bg-white flex items-center space-x-2 text-xs font-medium text-[#252C27]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Yoga Asana Directory</span>
              </button>
              <button 
                onClick={() => handleNavClick('support')}
                className="w-full text-left py-1.5 px-3 rounded-lg hover:bg-white flex items-center space-x-2 text-xs font-medium text-[#252C27]"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#536B50]" />
                <span>FAQs</span>
              </button>
            </div>
            
            {/* Action buttons inside drawer */}
            <div className="pt-2 space-y-2">
              <button 
                onClick={() => { setActiveView('retreats'); setIsMobileMenuOpen(false); }}
                className="w-full text-center py-2.5 px-3 rounded-lg bg-[#536B50] hover:bg-[#40563E] text-white font-medium text-xs transition flex items-center justify-center space-x-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Retreats & Centres</span>
              </button>

              {/* Mobile Currency Selector */}
              <div className="flex items-center justify-between py-2 px-1 border-t border-[#E2E5DD]/60 text-xs">
                <span className="text-[#59665C] font-medium flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#536B50]" />
                  <span>Currency:</span>
                </span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="bg-white border border-[#E2E5DD] rounded-lg px-2.5 py-1 text-xs text-[#263D32] font-semibold"
                >
                  {Object.values(CURRENCY_CONFIGS).map(c => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-[#E2E5DD]/60 flex items-center justify-between text-xs">
                <button 
                  onClick={() => handleNavClick('user-dashboard')}
                  className="flex items-center space-x-1.5 text-[#536B50] font-semibold py-1.5 px-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Bookings</span>
                </button>

                <a 
                  href="/admin"
                  onClick={handleAdminClick}
                  className="flex items-center space-x-1.5 bg-[#263D32] text-white px-3 py-1.5 rounded-lg font-semibold text-xs"
                >
                  <Crown className="w-3.5 h-3.5 text-gold-400" />
                  <span>Admin Portal</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      )}

    </header>
  );
};
