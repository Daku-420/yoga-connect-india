import React, { useState } from 'react';
import { useApp, CURRENCY_CONFIGS } from '../../context/AppContext';
import { CurrencyCode, UserRole } from '../../types';
import { 
  Sparkles, 
  Heart, 
  Globe, 
  ShieldCheck, 
  User, 
  Building2, 
  Crown, 
  Menu, 
  X,
  Search,
  BookOpen,
  Edit3
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    brandName, 
    setBrandName,
    currency, 
    setCurrency, 
    userRole, 
    setUserRole, 
    activeView, 
    setActiveView,
    wishlist,
    setIsAIQuizModalOpen,
    setIsSchemaModalOpen
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [tempBrand, setTempBrand] = useState(brandName);

  const roles: { role: UserRole; label: string; icon: any; color: string }[] = [
    { role: 'visitor', label: 'Traveler View', icon: Globe, color: 'bg-emerald-800 text-emerald-100' },
    { role: 'user', label: 'My Traveler Portal', icon: User, color: 'bg-amber-800 text-amber-100' },
    { role: 'centre', label: 'Centre Partner Portal', icon: Building2, color: 'bg-teal-800 text-teal-100' },
    { role: 'admin', label: 'Admin Control Panel', icon: Crown, color: 'bg-purple-900 text-purple-100' },
  ];

  const handleBrandSave = () => {
    if (tempBrand.trim()) {
      setBrandName(tempBrand.trim());
    }
    setIsEditingBrand(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-sand-50/90 backdrop-blur-md border-b border-sand-300/60 shadow-sm transition-all duration-300">
      {/* Top Banner - Role & Currency Switcher Bar */}
      <div className="bg-sage-900 text-sand-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Escrow Guarantee message */}
          <div className="flex items-center space-x-2 text-sage-200">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>
              <strong className="text-white">Admin-Protected Escrow Booking:</strong> Customer inquiries stay private with admin until booking confirmation.
            </span>
          </div>

          {/* Right: Currency Selector & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Currency Selector */}
            <div className="flex items-center space-x-1 bg-sage-800/80 rounded px-2 py-0.5 border border-sage-700">
              <Globe className="w-3.5 h-3.5 text-sage-300" />
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
              >
                {Object.values(CURRENCY_CONFIGS).map(c => (
                  <option key={c.code} value={c.code} className="bg-sage-900 text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Role Switcher Buttons */}
            <div className="hidden lg:flex items-center space-x-1">
              <span className="text-sage-400 mr-1">Switch Role:</span>
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
                    className={`flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded transition ${
                      isActive 
                        ? `${r.color} font-semibold shadow-sm ring-1 ring-gold-400/50` 
                        : 'text-sage-300 hover:text-white hover:bg-sage-800'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveView('home')} 
            className="flex items-center space-x-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-700 to-sage-900 text-gold-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              {isEditingBrand ? (
                <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={tempBrand}
                    onChange={e => setTempBrand(e.target.value)}
                    className="border border-sage-500 rounded px-1.5 py-0.5 text-sm font-serif font-bold text-sage-900 bg-white"
                  />
                  <button 
                    onClick={handleBrandSave}
                    className="text-xs bg-sage-700 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif font-bold text-xl sm:text-2xl text-sage-900 tracking-tight">
                    {brandName}
                  </span>
                  <button
                    title="Click to edit branding"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingBrand(true);
                    }}
                    className="text-sage-400 hover:text-sage-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <span className="text-[10px] uppercase tracking-widest text-terracotta-600 font-semibold block">
                India's Authentic Yoga Escrow Marketplace
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-sage-800">
          <button 
            onClick={() => setActiveView('home')}
            className={`transition hover:text-terracotta-600 ${activeView === 'home' ? 'text-terracotta-600 font-semibold border-b-2 border-terracotta-500 pb-1' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveView('retreats')}
            className={`transition hover:text-terracotta-600 ${activeView === 'retreats' ? 'text-terracotta-600 font-semibold border-b-2 border-terracotta-500 pb-1' : ''}`}
          >
            Explore Retreats & TTC
          </button>
          <button 
            onClick={() => setActiveView('destinations')}
            className={`transition hover:text-terracotta-600 ${activeView === 'destinations' ? 'text-terracotta-600 font-semibold border-b-2 border-terracotta-500 pb-1' : ''}`}
          >
            Destinations
          </button>
          <button 
            onClick={() => setActiveView('blog')}
            className={`transition hover:text-terracotta-600 ${activeView === 'blog' ? 'text-terracotta-600 font-semibold border-b-2 border-terracotta-500 pb-1' : ''}`}
          >
            Journal & Guides
          </button>
          <button 
            onClick={() => setActiveView('support')}
            className={`transition hover:text-terracotta-600 ${activeView === 'support' ? 'text-terracotta-600 font-semibold border-b-2 border-terracotta-500 pb-1' : ''}`}
          >
            💬 Chat Us & Support
          </button>

          {/* AI Matchmaker Trigger */}
          <button 
            onClick={() => setIsAIQuizModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/10 to-terracotta-500/10 text-terracotta-700 px-3 py-1.5 rounded-full border border-terracotta-300/60 font-semibold text-xs hover:from-amber-500/20 hover:to-terracotta-500/20 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>AI Retreat Matchmaker</span>
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Wishlist Icon */}
          <button 
            onClick={() => {
              setUserRole('user');
              setActiveView('user-dashboard');
            }}
            className="relative p-2 text-sage-700 hover:text-terracotta-600 hover:bg-sand-200/60 rounded-full transition"
            title="Saved Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-terracotta-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Role Portal Shortcut Button */}
          {userRole === 'visitor' ? (
            <button 
              onClick={() => setActiveView('retreats')}
              className="bg-sage-900 hover:bg-sage-800 text-sand-50 font-medium px-4 py-2 rounded-lg text-xs shadow-md transition transform active:scale-95"
            >
              Book Authentic Retreat
            </button>
          ) : userRole === 'user' ? (
            <button 
              onClick={() => setActiveView('user-dashboard')}
              className="bg-amber-700 hover:bg-amber-800 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-md transition flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Traveler Portal</span>
            </button>
          ) : userRole === 'centre' ? (
            <button 
              onClick={() => setActiveView('centre-dashboard')}
              className="bg-teal-700 hover:bg-teal-800 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-md transition flex items-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Centre Dashboard</span>
            </button>
          ) : (
            <button 
              onClick={() => setActiveView('admin-dashboard')}
              className="bg-purple-900 hover:bg-purple-950 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-md transition flex items-center space-x-1.5 ring-2 ring-gold-400"
            >
              <Crown className="w-3.5 h-3.5 text-gold-400" />
              <span>Admin Control Panel</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button 
            onClick={() => setIsAIQuizModalOpen(true)}
            className="p-1.5 text-terracotta-600 bg-terracotta-50 rounded-full"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-sage-800 hover:bg-sand-200 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-sand-50 border-b border-sand-300 p-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
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
                className={`p-2 rounded flex items-center space-x-1.5 font-medium ${
                  userRole === r.role ? r.color : 'bg-sand-100 text-sage-800'
                }`}
              >
                <r.icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-sand-200 pt-3 space-y-2 text-sm font-medium text-sage-900">
            <button 
              onClick={() => { setActiveView('home'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 border-b border-sand-200"
            >
              Home
            </button>
            <button 
              onClick={() => { setActiveView('retreats'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 border-b border-sand-200"
            >
              Explore Retreats & Teacher Training
            </button>
            <button 
              onClick={() => { setActiveView('destinations'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 border-b border-sand-200"
            >
              Destinations
            </button>
            <button 
              onClick={() => { setActiveView('blog'); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 border-b border-sand-200"
            >
              Journal & Guides
            </button>
            <button 
              onClick={() => { setIsAIQuizModalOpen(true); setIsMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-terracotta-600 font-semibold flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>AI Retreat Matchmaker Quiz</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
