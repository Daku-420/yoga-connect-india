import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Heart, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Calendar, 
  Utensils, 
  Home, 
  UserCheck, 
  HelpCircle, 
  FileText, 
  Video, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export const CentreDetailPage: React.FC = () => {
  const { 
    selectedCentreId, 
    centres, 
    courses, 
    formatPrice, 
    setActiveView, 
    setSelectedCourseId,
    setIsCourseDrawerOpen,
    setIsBookingModalOpen,
    wishlist,
    toggleWishlist
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'stay' | 'teachers' | 'facilities' | 'reviews' | 'policies'>('overview');

  const centre = centres.find(c => c.id === selectedCentreId) || centres[0];

  if (!centre) {
    return (
      <div className="bg-sand-50 min-h-screen py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-sand-300 shadow-luxury space-y-4">
          <div className="text-4xl">🧘‍♂️</div>
          <h2 className="font-serif font-bold text-2xl text-sage-950">No Registered Yoga Centre Selected</h2>
          <p className="text-xs text-sage-600">There are currently no registered yoga centres available to view.</p>
          <button 
            onClick={() => setActiveView('home')}
            className="bg-sage-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const centreCourses = courses.filter(c => c.centreId === centre.id);
  const isWishlisted = wishlist.includes(centre.id);

  return (
    <div className="bg-sand-50 min-h-screen pb-20">
      
      {/* Top Back Navigation Bar */}
      <div className="bg-sand-100 border-b border-sand-300 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveView('retreats')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-sage-800 hover:text-terracotta-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Retreats</span>
          </button>

          <div className="flex items-center space-x-3 text-xs">
            <button 
              onClick={() => toggleWishlist(centre.id)}
              className="flex items-center space-x-1 text-sage-700 hover:text-terracotta-600"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
              <span>{isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[450px] rounded-3xl overflow-hidden shadow-luxury border border-sand-300 relative">
          
          {/* Main Large Cover */}
          <div className="md:col-span-2 relative h-full">
            <img 
              src={centre.coverImage} 
              alt={centre.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="bg-emerald-800/90 text-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/40 inline-flex items-center space-x-1 mb-2">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Admin Escrow Verified Sanctuary</span>
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                {centre.name}
              </h1>
            </div>
          </div>

          {/* Secondary Photo Grid */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
            {centre.galleryImages.slice(0, 4).map((img, idx) => (
              <div key={idx} className="relative h-full overflow-hidden">
                <img 
                  src={img} 
                  alt="Gallery" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Title & Sticky Quick Book Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl p-6 shadow-luxury border border-sand-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-sage-600 font-medium">
              <MapPin className="w-4 h-4 text-terracotta-500" />
              <span>{centre.location}</span>
              <span>•</span>
              <div className="flex items-center text-gold-500 font-bold">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span>{centre.rating} ({centre.reviewCount} Reviews)</span>
              </div>
            </div>

            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-sage-950">
              {centre.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="bg-sage-100 text-sage-800 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-gold-600" />
                <span>{centre.certification}</span>
              </span>
              <span className="bg-sand-100 text-sage-700 text-xs font-medium px-2.5 py-1 rounded-md">
                Languages: {centre.languages.join(', ')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 shrink-0 bg-sand-50 p-4 rounded-xl border border-sand-200">
            <div>
              <span className="text-[10px] uppercase font-semibold text-sage-500 block">Starting From</span>
              <span className="font-serif font-bold text-2xl text-sage-950">{formatPrice(centre.startingPriceUSD)}</span>
            </div>

            <button
              onClick={() => {
                setSelectedCourseId(centreCourses[0]?.id || null);
                setIsBookingModalOpen(true);
              }}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium px-6 py-3 rounded-xl text-sm shadow-md transition flex items-center space-x-2"
            >
              <span>Submit Booking Request</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border-b border-sand-300 flex overflow-x-auto space-x-6 text-sm font-medium text-sage-700 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview & Story' },
            { id: 'courses', label: `Courses (${centreCourses.length})` },
            { id: 'stay', label: 'Accommodation & Food' },
            { id: 'teachers', label: `Teachers (${centre.teachers.length})` },
            { id: 'facilities', label: 'Facilities & Location' },
            { id: 'reviews', label: `Reviews (${centre.reviewCount})` },
            { id: 'policies', label: 'Policies & FAQs' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 transition border-b-2 font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-terracotta-600 text-terracotta-600'
                  : 'border-transparent text-sage-700 hover:text-sage-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 bg-white p-8 rounded-2xl border border-sand-300 shadow-sm">
              <h3 className="font-serif font-bold text-2xl text-sage-950">About {centre.name}</h3>
              <p className="text-sage-800 text-sm leading-relaxed whitespace-pre-line font-sans">
                {centre.description}
              </p>

              <div className="pt-4 border-t border-sand-200">
                <h4 className="font-serif font-bold text-lg text-sage-950 mb-2">Heritage & Lineage</h4>
                <p className="text-sage-700 text-sm leading-relaxed font-sans">
                  {centre.history}
                </p>
              </div>
            </div>

            {/* Right Quick Summary Card */}
            <div className="space-y-6">
              <div className="bg-sage-900 text-white p-6 rounded-2xl border border-sage-800 space-y-4 shadow-xl">
                <h4 className="font-serif font-bold text-lg text-gold-400">Ashram Highlights</h4>
                <ul className="space-y-2 text-xs text-sage-200">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    <span>Yoga Alliance USA RYS Registered School</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    <span>Daily Organic Sattvic Vegetarian Dining</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    <span>Private Airport Chauffeur Transfers</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    <span>100% Escrow Lead Customer Protection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Courses Offered */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-2xl text-sage-950">Available Courses & Intakes</h3>
              <span className="text-xs text-sage-600">Select any course to view daily timetable & syllabus</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {centreCourses.map(crs => (
                <div key={crs.id} className="bg-white rounded-2xl border border-sand-300 p-6 shadow-luxury flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="bg-sand-100 text-terracotta-600 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                        {crs.category}
                      </span>
                      <span className="font-serif font-bold text-xl text-sage-950">{formatPrice(crs.priceUSD)}</span>
                    </div>

                    <h4 className="font-serif font-bold text-xl text-sage-950 leading-snug">{crs.title}</h4>
                    <p className="text-xs text-sage-600 line-clamp-2">{crs.subtitle}</p>

                    <div className="pt-2 flex items-center space-x-4 text-xs text-sage-700 font-medium">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-terracotta-500" />
                        <span>{crs.durationDays} Days</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-gold-600" />
                        <span>{crs.certification}</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-sand-200 flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedCourseId(crs.id);
                        setIsCourseDrawerOpen(true);
                      }}
                      className="bg-sand-100 hover:bg-sand-200 text-sage-900 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex-1"
                    >
                      View Syllabus & Schedule
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCourseId(crs.id);
                        setIsBookingModalOpen(true);
                      }}
                      className="bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition flex-1"
                    >
                      Request Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Accommodation & Food */}
        {activeTab === 'stay' && (
          <div className="space-y-8 bg-white p-8 rounded-2xl border border-sand-300 shadow-sm">
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-2xl text-sage-950 flex items-center space-x-2">
                <Home className="w-5 h-5 text-terracotta-600" />
                <span>Accommodation Types</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {centre.accommodationTypes.map((room, i) => (
                  <div key={i} className="bg-sand-50 p-4 rounded-xl border border-sand-300 text-xs space-y-1">
                    <span className="font-bold text-sage-950 text-sm block">{room}</span>
                    <p className="text-sage-600">Air conditioning/heating, private attached bathroom, high-speed Wi-Fi, mountain/garden view balconies.</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-sand-200">
              <h3 className="font-serif font-bold text-2xl text-sage-950 flex items-center space-x-2">
                <Utensils className="w-5 h-5 text-emerald-600" />
                <span>Sattvic Dining & Nutrition</span>
              </h3>
              <p className="text-xs text-sage-700 leading-relaxed max-w-3xl font-sans">
                Our kitchen serves 3 organic vegetarian and vegan meals daily, prepared according to Ayurvedic nutritional principles. All dishes are non-spicy, easily digestible, and customized for dietary allergies (gluten-free, nut-free, dairy-free).
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Teachers */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-2xl text-sage-950">Guru & Faculty Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {centre.teachers.map((t) => (
                <div key={t.id} className="bg-white p-6 rounded-2xl border border-sand-300 shadow-sm flex items-start space-x-4">
                  <img src={t.photo} alt={t.name} className="w-20 h-20 rounded-full object-cover border-2 border-gold-400 shrink-0" />
                  <div className="space-y-1 text-xs">
                    <h4 className="font-serif font-bold text-lg text-sage-950">{t.name}</h4>
                    <span className="text-terracotta-600 font-semibold block">{t.title} ({t.experienceYears} Years Exp)</span>
                    <p className="text-sage-600">{t.bio}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {t.specialties.map((s, idx) => (
                        <span key={idx} className="bg-sand-100 text-sage-800 text-[10px] font-medium px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Facilities & Map */}
        {activeTab === 'facilities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-sand-300 space-y-4">
              <h3 className="font-serif font-bold text-xl text-sage-950">Ashram Facilities & Amenities</h3>
              <ul className="grid grid-cols-2 gap-2 text-xs text-sage-800">
                {centre.facilities.map((fac, i) => (
                  <li key={i} className="flex items-center space-x-2 bg-sand-50 p-2.5 rounded-lg border border-sand-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-sand-300 space-y-4">
              <h3 className="font-serif font-bold text-xl text-sage-950">Location & Nearby Attractions</h3>
              <p className="text-xs text-sage-600">{centre.location}</p>
              <div className="bg-sage-900 text-white h-48 rounded-xl flex flex-col items-center justify-center space-y-2 p-4 text-center">
                <MapPin className="w-8 h-8 text-gold-400" />
                <span className="font-serif font-bold text-base">Interactive Map Coordinates</span>
                <span className="text-xs text-sage-300 font-mono">Lat: {centre.mapCoords.lat}, Lng: {centre.mapCoords.lng}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 bg-white p-8 rounded-2xl border border-sand-300">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-2xl text-sage-950">Verified Student Reviews</h3>
              <div className="flex items-center space-x-1 text-gold-500 font-bold text-base">
                <Star className="w-5 h-5 fill-current" />
                <span>{centre.rating} out of 5.0</span>
              </div>
            </div>

            <div className="divide-y divide-sand-200">
              <div className="py-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sage-950">Emma Watson-Smith 🇺🇸</span>
                  <span className="text-sage-500">Verified Graduate • July 2026</span>
                </div>
                <div className="flex items-center space-x-1 text-gold-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-sage-700 italic">"Transformed my entire understanding of yoga anatomy and philosophy. The teachers are incredible!"</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Policies */}
        {activeTab === 'policies' && (
          <div className="space-y-6 bg-white p-8 rounded-2xl border border-sand-300">
            <h3 className="font-serif font-bold text-2xl text-sage-950">Ashram Rules, Visas & Cancellation Policy</h3>
            <div className="space-y-4 text-xs text-sage-800">
              <div className="bg-sand-50 p-4 rounded-xl border border-sand-300">
                <h4 className="font-bold text-sm text-sage-950 mb-1">Cancellation Policy</h4>
                <p>{centre.policies.cancellation}</p>
              </div>

              <div className="bg-sand-50 p-4 rounded-xl border border-sand-300">
                <h4 className="font-bold text-sm text-sage-950 mb-1">Indian e-Visa Support</h4>
                <p>{centre.policies.visa}</p>
              </div>

              <div className="bg-sand-50 p-4 rounded-xl border border-sand-300">
                <h4 className="font-bold text-sm text-sage-950 mb-1">Ashram Dress Code & Behavior</h4>
                <p>{centre.policies.dressCode}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
