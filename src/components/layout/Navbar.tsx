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
  CheckCircle2,
  LogIn,
  LogOut,
  FileText,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  Shield
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
    setFilters,
    currentUser,
    userProfile,
    partnerCentre,
    partnerMembership,
    loginAsPersona,
    setIsAuthModalOpen,
    logout
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isPartnerProfile = userProfile?.role === 'partner' || userProfile?.role === 'centre';

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
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
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

  const handlePartnerClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setUserRole('partner');
    setActiveView('centre-dashboard');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
      window.location.href = '/';
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

          {/* Right Controls: Role Portal Shortcuts */}
          <div className="flex items-center space-x-2 text-xs">
            {isPartnerProfile ? (
              <button
                onClick={handlePartnerClick}
                className="flex items-center space-x-1.5 bg-[#1E3228] hover:bg-[#2F4738] text-[#DCCDB5] hover:text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#3D5E4C]/60 transition cursor-pointer"
                title={`Authorized Partner Portal: ${partnerCentre?.name || 'Assigned Ashram'}`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#A5B89A]" />
                <span className="max-w-[200px] truncate">{partnerCentre?.name || 'Partner Portal'}</span>
              </button>
            ) : userProfile?.role === 'admin' ? (
              <a
                href="/admin"
                onClick={handleAdminClick}
                className="flex items-center space-x-1.5 bg-[#1E3228] hover:bg-[#2F4738] text-[#DCCDB5] hover:text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#3D5E4C]/60 transition"
                title="Master Admin Escrow & Centre Portal"
              >
                <Crown className="w-3.5 h-3.5 text-gold-400" />
                <span>Admin Portal</span>
              </a>
            ) : (
              <div className="flex items-center space-x-1.5">
                <a
                  href="/partner"
                  onClick={handlePartnerClick}
                  className="flex items-center space-x-1 bg-[#1E3228] hover:bg-[#2F4738] text-[#DCCDB5] hover:text-white text-[11px] font-medium px-2 py-0.5 rounded border border-[#3D5E4C]/40 transition"
                  title="Ashram Partner Portal"
                >
                  <Building2 className="w-3 h-3 text-[#A5B89A]" />
                  <span>Partner Portal</span>
                </a>
                <a
                  href="/admin"
                  onClick={handleAdminClick}
                  className="flex items-center space-x-1 bg-[#1E3228] hover:bg-[#2F4738] text-[#DCCDB5] hover:text-white text-[11px] font-medium px-2 py-0.5 rounded border border-[#3D5E4C]/40 transition"
                  title="Platform Administrator Portal"
                >
                  <Crown className="w-3 h-3 text-gold-400" />
                  <span>Admin</span>
                </a>
              </div>
            )}
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

          {/* Profile Icon with Role-Aware Account Menu */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`p-1.5 sm:p-2 rounded-full border transition flex items-center justify-center relative cursor-pointer ${
                isProfileOpen 
                  ? 'bg-[#E6EDE2] text-[#263D32] border-[#536B50]' 
                  : userProfile?.role === 'admin'
                  ? 'bg-[#F7F5EE] text-[#263D32] border-[#DCCDB5] ring-2 ring-[#DCCDB5]/50'
                  : isPartnerProfile
                  ? 'bg-[#E6EDE2] text-[#263D32] border-[#536B50] ring-2 ring-[#536B50]/30'
                  : 'bg-white hover:bg-[#E6EDE2] text-[#59665C] hover:text-[#263D32] border-[#E2E5DD]'
              }`}
              title={
                userProfile?.role === 'admin' 
                  ? `Platform Administrator (${userProfile.email})`
                  : isPartnerProfile
                  ? `Yoga Centre Partner: ${partnerCentre?.name || 'Assigned Centre'}`
                  : userProfile 
                  ? `${userProfile.fullName || userProfile.email} (Customer Account)`
                  : "Sign In & My Account"
              }
              aria-label="Open account menu"
              aria-expanded={isProfileOpen}
            >
              {userProfile?.avatarUrl ? (
                <img 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.fullName || 'User Avatar'} 
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : userProfile?.role === 'admin' ? (
                <Crown className="w-5 h-5 text-[#263D32]" />
              ) : isPartnerProfile ? (
                <Building2 className="w-5 h-5 text-[#286749]" />
              ) : userProfile?.fullName ? (
                <div className="w-5 h-5 rounded-full bg-[#263D32] text-white text-[9px] font-bold flex items-center justify-center uppercase">
                  {userProfile.fullName.slice(0, 2)}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}

              {/* Role indicator badge */}
              {userProfile?.role === 'admin' ? (
                <span className="absolute -top-1 -right-1 bg-[#263D32] text-gold-400 text-[8px] font-bold px-1 py-0.2 rounded-full border border-gold-400/50 shadow">
                  ADM
                </span>
              ) : isPartnerProfile ? (
                <span className={`absolute -top-1 -right-1 text-white text-[8px] font-bold px-1 py-0.2 rounded-full border shadow ${
                  partnerMembership?.status === 'suspended' ? 'bg-[#B42318] border-[#FDA29B]' : 'bg-[#286749] border-[#A5B89A]'
                }`}>
                  {partnerMembership?.status === 'suspended' ? 'SUSP' : 'PTR'}
                </span>
              ) : bookings.length > 0 && userProfile?.role === 'user' ? (
                <span className="absolute -top-0.5 -right-0.5 bg-[#286749] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-white shadow">
                  {bookings.filter(b => b.customerEmail?.toLowerCase() === userProfile?.email?.toLowerCase()).length}
                </span>
              ) : null}
            </button>

            {/* Dropdown Menu inside Profile Icon */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#E2E5DD] p-3 z-50 animate-fade-in space-y-2">
                
                {/* ROLE-AWARE HEADER */}
                {userProfile ? (
                  <div className="p-3 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]/80 space-y-2">
                    <div className="flex items-center space-x-2.5">
                      {userProfile.role === 'admin' ? (
                        <div className="w-9 h-9 rounded-full bg-[#263D32] text-gold-400 flex items-center justify-center font-bold text-xs shrink-0 border border-[#DCCDB5]">
                          <Crown className="w-4 h-4 text-gold-400" />
                        </div>
                      ) : isPartnerProfile ? (
                        <div className="w-9 h-9 rounded-full bg-[#E6EDE2] text-[#286749] flex items-center justify-center font-bold text-xs shrink-0 border border-[#A5B89A]">
                          <Building2 className="w-4 h-4 text-[#286749]" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#263D32] text-white flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                          {userProfile.fullName?.slice(0, 2) || 'TR'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="block text-xs font-bold text-[#263D32] truncate">
                            {userProfile.fullName || userProfile.email}
                          </span>
                        </div>
                        <span className="block text-[10px] text-[#8E9B91] truncate">
                          {userProfile.email}
                        </span>
                      </div>
                    </div>

                    {/* Role Pill & Details */}
                    {userProfile.role === 'admin' && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#E2E5DD]/60 text-[10px]">
                        <span className="bg-[#263D32] text-gold-400 font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                          <Crown className="w-3 h-3 text-gold-400" />
                          <span>Platform Administrator</span>
                        </span>
                        <span className="text-[#59665C] font-semibold">Full Oversight</span>
                      </div>
                    )}

                    {isPartnerProfile && (
                      <div className="space-y-1.5 pt-1.5 border-t border-[#E2E5DD]/60">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#8E9B91] font-semibold">Authorised Centre:</span>
                          <span className={`font-bold px-1.5 py-0.2 rounded text-[9px] uppercase ${
                            partnerMembership?.status === 'suspended'
                              ? 'bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]'
                              : 'bg-[#E6EDE2] text-[#286749] border border-[#A5B89A]/50'
                          }`}>
                            {partnerMembership?.status === 'suspended' ? 'Suspended' : 'Active Partner'}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-[#E2E5DD] flex items-center space-x-2">
                          <Building2 className="w-3.5 h-3.5 text-[#536B50] shrink-0" />
                          <span className="text-xs font-serif font-bold text-[#263D32] truncate">
                            {partnerCentre?.name || partnerMembership?.centreName || 'Assigned Yoga Centre'}
                          </span>
                        </div>
                      </div>
                    )}

                    {userProfile.role === 'user' && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#E2E5DD]/60 text-[10px]">
                        <span className="bg-[#E6EDE2] text-[#286749] font-bold px-2 py-0.5 rounded">
                          Traveler Member
                        </span>
                        <span className="text-[#59665C]">Verified Account</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-[#F7F5EE] rounded-xl border border-[#E2E5DD]/70 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-[#E6EDE2] text-[#263D32] flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-[#536B50]" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#263D32]">Account Login</span>
                        <span className="block text-[10px] text-[#8E9B91]">Customer, Partner, or Administrator</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full bg-[#536B50] hover:bg-[#40563E] text-white text-xs font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In with Gmail / OTP</span>
                    </button>
                  </div>
                )}

                {/* ROLE SPECIFIC ACTIONS */}
                
                {/* 1. YOGA CENTRE PARTNER MENU */}
                {isPartnerProfile && (
                  <div className="space-y-1 pt-1">
                    <button
                      onClick={() => {
                        setUserRole('partner');
                        setActiveView('centre-dashboard');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-[#E6EDE2]/50 hover:bg-[#E6EDE2] text-[#263D32] transition flex items-center space-x-2.5 group cursor-pointer border border-[#A5B89A]/30"
                    >
                      <div className="p-1.5 rounded-lg bg-[#263D32] text-[#DCCDB5] shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-[#263D32]">
                          Partner Centre Dashboard
                        </span>
                        <span className="text-[10px] text-[#59665C] block truncate">
                          Bookings, guest list & profile
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#536B50] shrink-0" />
                    </button>

                    <button
                      onClick={() => {
                        setUserRole('partner');
                        setActiveView('centre-dashboard');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F5EE] transition flex items-center space-x-2.5 text-[#252C27] cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-[#F7F5EE] text-[#536B50] shrink-0">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold">Financial Ledger & Settlements</span>
                        <span className="text-[10px] text-[#8E9B91]">Escrow debits, payouts & net entitlement</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setUserRole('partner');
                        setActiveView('centre-dashboard');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F5EE] transition flex items-center space-x-2.5 text-[#252C27] cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-[#F7F5EE] text-[#536B50] shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold">Download Statements</span>
                        <span className="text-[10px] text-[#8E9B91]">CSV & printable tax PDF statements</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* 2. PLATFORM ADMINISTRATOR MENU */}
                {userProfile?.role === 'admin' && (
                  <div className="space-y-1 pt-1">
                    <button
                      onClick={(e) => {
                        handleAdminClick(e);
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-[#263D32] hover:bg-[#1E3228] text-white transition flex items-center space-x-2.5 group cursor-pointer shadow-sm"
                    >
                      <div className="p-1.5 rounded-lg bg-white/10 text-gold-400 shrink-0">
                        <Crown className="w-4 h-4 text-gold-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-white">
                          Admin Control Center
                        </span>
                        <span className="text-[10px] text-[#A5B89A] block truncate">
                          Platform-wide escrow & centres
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    </button>

                    <button
                      onClick={(e) => {
                        handleAdminClick(e);
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F5EE] transition flex items-center space-x-2.5 text-[#252C27] cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-[#F7F5EE] text-[#536B50] shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold">Centre Directory & Partner Accounts</span>
                        <span className="text-[10px] text-[#8E9B91]">Provision logins & assign ashrams</span>
                      </div>
                    </button>

                    <button
                      onClick={(e) => {
                        handleAdminClick(e);
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F5EE] transition flex items-center space-x-2.5 text-[#252C27] cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-[#F7F5EE] text-[#536B50] shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold">Audit Logs & Security</span>
                        <span className="text-[10px] text-[#8E9B91]">Track adjustments, payouts & changes</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* 3. REGULAR CUSTOMER MENU (OR GUEST) */}
                {(!userProfile || userProfile.role === 'user') && (
                  <div className="space-y-1 pt-1">
                    <button
                      onClick={() => {
                        setUserRole('user');
                        handleNavClick('user-dashboard');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F7F5EE] transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-[#E6EDE2] text-[#263D32] group-hover:bg-[#263D32] group-hover:text-white transition-colors">
                          <BookOpen className="w-4 h-4 text-[#536B50] group-hover:text-white" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[#252C27] group-hover:text-[#263D32]">
                            My Retreat Bookings
                          </span>
                          <span className="text-[10px] text-[#8E9B91] block">
                            Inquiries & escrow receipts
                          </span>
                        </div>
                      </div>
                      {userProfile && (
                        <span className="bg-[#E6EDE2] text-[#286749] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#286749]/30">
                          {bookings.filter(b => b.customerEmail?.toLowerCase() === userProfile?.email?.toLowerCase()).length}
                        </span>
                      )}
                    </button>

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
                          Saved Sanctuaries
                        </span>
                      </div>
                      {wishlist.length > 0 && (
                        <span className="text-[10px] font-semibold text-[#8E9B91]">
                          {wishlist.length}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* DEMO / TEST PERSONAS COLLAPSIBLE */}
                <div className="pt-2 border-t border-[#E2E5DD]">
                  <button
                    onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-semibold text-[#59665C] hover:text-[#263D32] rounded-lg hover:bg-[#F7F5EE] transition cursor-pointer"
                  >
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                      <span>Switch Demo Role (Auth Test)</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRoleSwitcher ? 'rotate-180' : ''}`} />
                  </button>

                  {showRoleSwitcher && (
                    <div className="mt-1 p-2 bg-[#F7F5EE] rounded-xl space-y-1 text-[11px] border border-[#E2E5DD]/70">
                      <button
                        onClick={() => {
                          loginAsPersona('admin@yogaconnect.in');
                          setUserRole('admin');
                          setActiveView('admin-dashboard');
                          setIsProfileOpen(false);
                        }}
                        className={`w-full text-left p-1.5 rounded-lg flex items-center space-x-2 transition cursor-pointer ${
                          userProfile?.role === 'admin' ? 'bg-[#263D32] text-white font-bold' : 'hover:bg-white text-[#252C27]'
                        }`}
                      >
                        <Crown className="w-3 h-3 text-gold-400 shrink-0" />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="block font-semibold">1. Platform Admin</span>
                          <span className="text-[9px] opacity-75 block">admin@yogaconnect.in</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          loginAsPersona('partner.parmarth@yogaconnect.in');
                          setUserRole('partner');
                          setActiveView('centre-dashboard');
                          setIsProfileOpen(false);
                        }}
                        className={`w-full text-left p-1.5 rounded-lg flex items-center space-x-2 transition cursor-pointer ${
                          userProfile?.email === 'partner.parmarth@yogaconnect.in' ? 'bg-[#536B50] text-white font-bold' : 'hover:bg-white text-[#252C27]'
                        }`}
                      >
                        <Building2 className="w-3 h-3 shrink-0" />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="block font-semibold">2. Partner A: Parmarth Niketan</span>
                          <span className="text-[9px] opacity-75 block">Rishikesh • Active</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          loginAsPersona('partner.phoolchatti@yogaconnect.in');
                          setUserRole('partner');
                          setActiveView('centre-dashboard');
                          setIsProfileOpen(false);
                        }}
                        className={`w-full text-left p-1.5 rounded-lg flex items-center space-x-2 transition cursor-pointer ${
                          userProfile?.email === 'partner.phoolchatti@yogaconnect.in' ? 'bg-[#536B50] text-white font-bold' : 'hover:bg-white text-[#252C27]'
                        }`}
                      >
                        <Building2 className="w-3 h-3 shrink-0" />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="block font-semibold">3. Partner B: Phool Chatti</span>
                          <span className="text-[9px] opacity-75 block">Rishikesh • Active</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          loginAsPersona('partner.suspended@yogaconnect.in');
                          setUserRole('partner');
                          setActiveView('centre-dashboard');
                          setIsProfileOpen(false);
                        }}
                        className={`w-full text-left p-1.5 rounded-lg flex items-center space-x-2 transition cursor-pointer ${
                          userProfile?.email === 'partner.suspended@yogaconnect.in' ? 'bg-[#B42318] text-white font-bold' : 'hover:bg-white text-[#B42318]'
                        }`}
                      >
                        <ShieldAlert className="w-3 h-3 shrink-0" />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="block font-semibold">4. Partner (Suspended): Sivananda</span>
                          <span className="text-[9px] opacity-75 block">Access Blocked Test</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          loginAsPersona('sarah.jenkins@example.com');
                          setUserRole('user');
                          setActiveView('user-dashboard');
                          setIsProfileOpen(false);
                        }}
                        className={`w-full text-left p-1.5 rounded-lg flex items-center space-x-2 transition cursor-pointer ${
                          userProfile?.email === 'sarah.jenkins@example.com' ? 'bg-[#536B50] text-white font-bold' : 'hover:bg-white text-[#252C27]'
                        }`}
                      >
                        <User className="w-3 h-3 shrink-0" />
                        <div className="min-w-0 flex-1 truncate">
                          <span className="block font-semibold">5. Regular Customer: Sarah J.</span>
                          <span className="text-[9px] opacity-75 block">Traveler • My Bookings</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Sign Out Option if logged in */}
                {userProfile && (
                  <div className="pt-2 border-t border-[#E2E5DD]">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#FEF3F2] transition flex items-center space-x-2 text-[#B42318] text-xs font-semibold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#B42318]" />
                      <span>Sign Out ({userProfile.email})</span>
                    </button>
                  </div>
                )}

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

              <div className="pt-2 border-t border-[#E2E5DD]/60 flex flex-col space-y-2 text-xs">
                {userProfile ? (
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#E2E5DD]">
                    <div className="flex items-center space-x-2 min-w-0">
                      {userProfile.role === 'admin' ? (
                        <Crown className="w-4 h-4 text-gold-500 shrink-0" />
                      ) : isPartnerProfile ? (
                        <Building2 className="w-4 h-4 text-[#286749] shrink-0" />
                      ) : (
                        <User className="w-4 h-4 text-[#536B50] shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="block font-bold text-[#263D32] text-xs truncate">
                          {userProfile.fullName || userProfile.email}
                        </span>
                        <span className="block text-[10px] text-[#8E9B91]">
                          {userProfile.role === 'admin' ? 'Administrator' : isPartnerProfile ? 'Centre Partner' : 'Traveler'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => logout()}
                      className="text-[#B42318] text-[11px] font-semibold hover:underline shrink-0 ml-2"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 bg-[#536B50] text-white py-2.5 px-3 rounded-lg font-semibold text-xs cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In (Gmail &amp; OTP)</span>
                  </button>
                )}

                {/* Role Specific Quick Jump */}
                {isPartnerProfile ? (
                  <button
                    onClick={handlePartnerClick}
                    className="w-full flex items-center justify-center space-x-1.5 bg-[#263D32] text-white py-2.5 px-3 rounded-lg font-semibold text-xs cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#A5B89A]" />
                    <span>Partner Dashboard: {partnerCentre?.name || 'My Centre'}</span>
                  </button>
                ) : userProfile?.role === 'admin' ? (
                  <a 
                    href="/admin"
                    onClick={handleAdminClick}
                    className="w-full flex items-center justify-center space-x-1.5 bg-[#263D32] text-white py-2.5 px-3 rounded-lg font-semibold text-xs"
                  >
                    <Crown className="w-3.5 h-3.5 text-gold-400" />
                    <span>Admin Control Center</span>
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      setUserRole('user');
                      handleNavClick('user-dashboard');
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 bg-white text-[#263D32] border border-[#E2E5DD] py-2 px-3 rounded-lg font-semibold text-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#536B50]" />
                    <span>My Bookings &amp; Inquiries</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

    </header>
  );
};
