import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus } from '../../types';
import {
  Crown,
  ShieldCheck,
  DollarSign,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  TrendingUp,
  FileText,
  Gift,
  Sparkles,
  Search,
  Bell,
  Sliders,
  PlusCircle,
  BookOpen,
  Plus,
  Calendar,
  Clock,
  MapPin,
  ShieldAlert,
  ArrowLeft,
  Award
} from 'lucide-react';

import { PREDEFINED_QUESTION_TEMPLATES } from '../../data/mockMatchmakers';
import { AsanaManagerTab } from '../admin/AsanaManagerTab';
import { CentreMatchmakerBuilder } from './CentreMatchmakerBuilder';

interface AdminDashboardProps {
  initialTab?: 'bookings' | 'centre-portal' | 'matchmakers' | 'centres' | 'asanas' | 'revenue' | 'coupons';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'bookings' }) => {
  const {
    bookings,
    updateBookingStatus,
    centres,
    courses,
    addNewCourse,
    formatPrice,
    setIsSchemaModalOpen,
    setIsAddCentreOpen,
    matchmakerConfigs,
    setAdminMatchmakerDisabled,
    matchmakerAnalytics,
    matchmakerLeads,
    openCentreMatchmaker,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'centre-portal' | 'matchmakers' | 'centres' | 'asanas' | 'revenue' | 'coupons'>(initialTab);
  const [unmaskedBookingIds, setUnmaskedBookingIds] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('YOGA2026');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [couponList, setCouponList] = useState([
    { code: 'YOGA2026', discount: 10, usage: 48 },
    { code: 'NAMASTE15', discount: 15, usage: 19 }
  ]);

  // Centre Portal Sub-states (Merged from CentreDashboard)
  const [managedCentreId, setManagedCentreId] = useState<string>(centres[0]?.id || 'centre-1');
  const [centrePortalSubTab, setCentrePortalSubTab] = useState<'courses' | 'matchmaker' | 'leads'>('courses');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'200h-ttc' | '300h-ttc' | 'meditation' | 'ayurveda'>('200h-ttc');
  const [newPriceUSD, setNewPriceUSD] = useState(1200);
  const [newDuration, setNewDuration] = useState(14);

  const myCentre = centres.find(c => c.id === managedCentreId) || centres[0];
  const myCourses = courses.filter(c => c.centreId === myCentre?.id);
  const myCentreBookings = bookings.filter(b => b.centreId === myCentre?.id);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myCentre) return;
    addNewCourse({
      id: 'course-new-' + Date.now(),
      centreId: myCentre.id,
      centreName: myCentre.name,
      title: newTitle || 'Custom Yoga Course',
      subtitle: 'Newly added ashram certification program',
      category: newCategory,
      durationDays: newDuration,
      priceUSD: newPriceUSD,
      certification: 'Yoga Alliance USA RYS 200/300',
      syllabus: ['Asana Alignment', 'Pranayama', 'Anatomy', 'Meditation'],
      dailySchedule: [
        { time: '06:00 AM', activity: 'Morning Practice' },
        { time: '09:00 AM', activity: 'Sattvic Breakfast' },
      ],
      mealsIncluded: '3 Organic Meals Daily',
      accommodationOptions: ['Deluxe Room', 'Shared Suite'],
      upcomingDates: ['Nov 1, 2026', 'Dec 1, 2026'],
      photos: [myCentre.coverImage],
      requirements: ['Open mind & willingness to learn']
    });
    setIsAddingCourse(false);
    setNewTitle('');
  };

  const totalPlatformStarts = Object.values(matchmakerAnalytics).reduce((sum, s) => sum + s.startsCount, 0);
  const totalPlatformCompletions = Object.values(matchmakerAnalytics).reduce((sum, s) => sum + s.completionsCount, 0);
  const platformAvgConversion = totalPlatformCompletions > 0
    ? ((matchmakerLeads.length / totalPlatformCompletions) * 100).toFixed(1)
    : '0.0';

  const toggleMask = (id: string) => {
    setUnmaskedBookingIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalGMV = bookings.reduce((sum, b) => sum + b.totalUSD, 0);
  const totalCommissionRevenue = totalGMV * 0.15; // 15% marketplace commission

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode) {
      setCouponList(prev => [...prev, { code: couponCode.toUpperCase(), discount: discountPercent, usage: 0 }]);
      setCouponCode('');
    }
  };

  const handleBackToSite = () => {
    setActiveView('home');
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
      window.location.href = '/';
    }
  };

  return (
    <div className="py-10 bg-sage-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Back Link to Public Site */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToSite}
            className="flex items-center space-x-1.5 text-xs text-sage-300 hover:text-gold-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Return to Traveler Site</span>
          </button>

          <span className="text-[11px] font-mono text-sage-400">
            Route: /admin • Unified Command Center
          </span>
        </div>

        {/* Admin Header Banner */}
        <div className="bg-gradient-to-r from-purple-950 via-sage-900 to-purple-950 rounded-3xl p-8 border border-purple-800/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 text-sage-950 flex items-center justify-center font-bold shadow-xl shrink-0">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-gold-400 text-sage-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Platform Admin &amp; Centre Portal
                </span>
                <span className="bg-purple-800 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  Full Escrow &amp; Catalog Control
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-sand-50 mt-1">
                YogaConnect India Master Administration
              </h1>
              <span className="text-xs text-sage-300">
                Unified Management: Escrow Leads, Partner Centre Courses, Matchmaker Quizzes, Asanas &amp; Revenue
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddCentreOpen(true)}
              className="bg-gold-500 hover:bg-gold-400 text-sage-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Upload Centre</span>
            </button>
            <button
              onClick={() => setIsSchemaModalOpen(true)}
              className="bg-sage-900 hover:bg-sage-800 text-gold-400 border border-gold-400/40 font-medium px-4 py-2.5 rounded-xl text-xs shadow transition flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Inspect SEO Schema</span>
            </button>
          </div>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-sage-900/60 p-5 rounded-2xl border border-sage-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sage-400 block">Total Booking Inquiries GMV</span>
            <span className="font-serif font-bold text-2xl text-gold-400">{formatPrice(totalGMV)}</span>
          </div>

          <div className="bg-sage-900/60 p-5 rounded-2xl border border-sage-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sage-400 block">Net Platform Commission (15%)</span>
            <span className="font-serif font-bold text-2xl text-emerald-400">{formatPrice(totalCommissionRevenue)}</span>
          </div>

          <div className="bg-sage-900/60 p-5 rounded-2xl border border-sage-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sage-400 block">Verified Ashrams Partnered</span>
            <span className="font-serif font-bold text-2xl text-white">{centres.length} Centres</span>
          </div>

          <div className="bg-sage-900/60 p-5 rounded-2xl border border-sage-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sage-400 block">Escrow Lead Pipeline</span>
            <span className="font-serif font-bold text-2xl text-[#A5B89A]">{bookings.length} Active Leads</span>
          </div>
        </div>

        {/* Tab Header Navigation */}
        <div className="border-b border-sage-800 flex space-x-6 text-sm font-semibold text-sage-300 overflow-x-auto scrollbar-none">
          {[
            { id: 'bookings', label: `Lead Pipeline & Escrow (${bookings.length})` },
            { id: 'centre-portal', label: `Partner Centre Portal (${centres.length})` },
            { id: 'matchmakers', label: `Centre Matchmaker Moderation (${centres.length})` },
            { id: 'centres', label: `Centre Approvals (${centres.length})` },
            { id: 'asanas', label: 'Asana Encyclopedia CMS' },
            { id: 'revenue', label: 'Revenue & Commissions' },
            { id: 'coupons', label: 'Coupon & Discount CMS' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 transition border-b-2 whitespace-nowrap ${activeTab === tab.id
                  ? 'border-gold-400 text-gold-400 font-bold'
                  : 'border-transparent text-sage-400 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Booking Lead Management & Escrow */}
        {activeTab === 'bookings' && (
          <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-sand-50">Master Customer Lead Pipeline</h2>
                <p className="text-xs text-sage-300 mt-1">
                  You hold complete control of customer contact details. Unmask customer data when ready to assign or invoice.
                </p>
              </div>

              <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-800 flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Confidential Privilege</span>
              </span>
            </div>

            <div className="space-y-4">
              {bookings.map((b) => {
                const isUnmasked = unmaskedBookingIds.includes(b.id);

                return (
                  <div key={b.id} className="bg-sage-950 p-6 rounded-2xl border border-sage-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sage-800 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs bg-sage-800 text-gold-400 font-bold px-2.5 py-1 rounded">
                          {b.referenceCode}
                        </span>
                        <span className="text-xs font-serif font-bold text-white">{b.courseTitle}</span>
                        <span className="text-xs text-[#A5B89A]">({b.centreName})</span>
                      </div>

                      {/* Action Status Controls */}
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-sage-400 mr-1">Status:</span>
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                          className="bg-sage-800 text-white font-semibold text-xs rounded px-2.5 py-1 border border-sage-700 focus:outline-none cursor-pointer"
                        >
                          <option value="pending_admin">1. Pending Admin Review</option>
                          <option value="assigned_to_centre">2. Assigned to Ashram</option>
                          <option value="confirmed_paid">3. Confirmed &amp; Paid</option>
                          <option value="cancelled">4. Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Sensitive Traveler Contact Box */}
                    <div className="bg-sage-900/80 p-4 rounded-xl border border-sage-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-gold-400">TRAVELER PRIVACY DATA:</span>
                          <button
                            onClick={() => toggleMask(b.id)}
                            className="bg-sage-800 hover:bg-sage-700 text-sage-200 text-[11px] px-2.5 py-0.5 rounded flex items-center space-x-1"
                          >
                            {isUnmasked ? <EyeOff className="w-3 h-3 text-[#DCCDB5]" /> : <Eye className="w-3 h-3 text-gold-400" />}
                            <span>{isUnmasked ? 'Mask Details' : 'Reveal Contact Info'}</span>
                          </button>
                        </div>

                        {isUnmasked ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-2 text-emerald-300">
                            <div>Name: <strong>{b.customerName}</strong></div>
                            <div>Email: <strong>{b.customerEmail}</strong></div>
                            <div>Phone: <strong>{b.customerPhone}</strong></div>
                            <div>Country: <strong>{b.customerCountry}</strong></div>
                          </div>
                        ) : (
                          <div className="text-xs text-sage-400 italic pt-1">
                            Contact details are masked from yoga centre. Click &apos;Reveal Contact Info&apos; to unmask.
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-sage-400 font-semibold uppercase block">Package Value</span>
                        <span className="font-serif font-bold text-xl text-gold-400">{formatPrice(b.totalUSD)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MERGED CENTRE PORTAL & CATALOG */}
        {activeTab === 'centre-portal' && myCentre && (
          <div className="space-y-8">
            
            {/* Ashram Selector & Banner */}
            <div className="bg-sage-900/80 rounded-3xl p-6 sm:p-8 border border-sage-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={myCentre.coverImage} 
                  alt={myCentre.name} 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-gold-400/60 shrink-0" 
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-gold-400/20 text-gold-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gold-400/30">
                      Partner Ashram
                    </span>
                    <span className="bg-emerald-900/60 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-700/40">
                      Verified Rank #{myCentre.sponsoredRank || 1}
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-2xl text-white">
                    {myCentre.name}
                  </h2>
                  <p className="text-xs text-sage-300">
                    {myCentre.location} • {myCentre.commissionRatePercent}% Commission Agreement
                  </p>
                </div>
              </div>

              {/* Centre Controls: Ashram Dropdown & Quick Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-sage-950 p-1.5 rounded-xl border border-sage-700">
                  <label htmlFor="ashram-selector" className="text-[10px] text-sage-400 block px-2 font-semibold">Switch Managed Ashram:</label>
                  <select
                    id="ashram-selector"
                    value={managedCentreId}
                    onChange={(e) => setManagedCentreId(e.target.value)}
                    className="bg-transparent text-gold-300 font-semibold text-xs px-2 py-1 outline-none cursor-pointer"
                  >
                    {centres.map(c => (
                      <option key={c.id} value={c.id} className="bg-sage-900 text-white">
                        {c.name} ({c.location.split(',')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setIsAddingCourse(true)}
                  className="bg-gold-500 hover:bg-gold-400 text-sage-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow transition flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Course Listing</span>
                </button>

                <button
                  onClick={() => openCentreMatchmaker(myCentre.id)}
                  className="bg-sage-800 hover:bg-sage-700 text-white font-medium px-4 py-2.5 rounded-xl text-xs border border-sage-700 transition flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Preview Quiz</span>
                </button>
              </div>
            </div>

            {/* Centre Portal Sub-tab Navigation */}
            <div className="flex space-x-4 border-b border-sage-800 text-xs font-semibold">
              <button
                onClick={() => setCentrePortalSubTab('courses')}
                className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
                  centrePortalSubTab === 'courses'
                    ? 'border-gold-400 text-gold-400 font-bold'
                    : 'border-transparent text-sage-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Course &amp; Certification Catalog ({myCourses.length})</span>
              </button>

              <button
                onClick={() => setCentrePortalSubTab('matchmaker')}
                className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
                  centrePortalSubTab === 'matchmaker'
                    ? 'border-gold-400 text-gold-400 font-bold'
                    : 'border-transparent text-sage-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Ashram Matchmaker Quiz Builder</span>
              </button>

              <button
                onClick={() => setCentrePortalSubTab('leads')}
                className={`pb-3 border-b-2 flex items-center space-x-2 transition ${
                  centrePortalSubTab === 'leads'
                    ? 'border-gold-400 text-gold-400 font-bold'
                    : 'border-transparent text-sage-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Assigned Ashram Leads ({myCentreBookings.length})</span>
              </button>
            </div>

            {/* Sub-view 1: Courses */}
            {centrePortalSubTab === 'courses' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-sage-900/50 p-4 rounded-xl border border-sage-800">
                    <span className="text-[10px] uppercase font-bold text-sage-400 block">Active Courses</span>
                    <span className="font-serif font-bold text-2xl text-white">{myCourses.length} Listings</span>
                  </div>
                  <div className="bg-sage-900/50 p-4 rounded-xl border border-sage-800">
                    <span className="text-[10px] uppercase font-bold text-sage-400 block">Ashram Commission Rate</span>
                    <span className="font-serif font-bold text-2xl text-gold-400">{myCentre.commissionRatePercent}%</span>
                  </div>
                  <div className="bg-sage-900/50 p-4 rounded-xl border border-sage-800">
                    <span className="text-[10px] uppercase font-bold text-sage-400 block">Total Ashram Leads</span>
                    <span className="font-serif font-bold text-2xl text-emerald-400">{myCentreBookings.length}</span>
                  </div>
                  <div className="bg-sage-900/50 p-4 rounded-xl border border-sage-800">
                    <span className="text-[10px] uppercase font-bold text-sage-400 block">Escrow Status</span>
                    <span className="font-serif font-bold text-lg text-[#A5B89A]">Verified Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.map(course => (
                    <div key={course.id} className="bg-sage-950 rounded-2xl border border-sage-800 overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="h-44 w-full relative">
                          <img 
                            src={course.photos[0] || myCentre.coverImage} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 bg-sage-900/90 text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-gold-400/30 uppercase">
                            {course.category}
                          </span>
                        </div>
                        <div className="p-5 space-y-3">
                          <h3 className="font-serif font-bold text-lg text-white leading-snug">
                            {course.title}
                          </h3>
                          <p className="text-xs text-sage-300 line-clamp-2">
                            {course.subtitle}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-sage-400 pt-1">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-gold-400" />
                              <span>{course.durationDays} Days</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-gold-400" />
                              <span>{course.upcomingDates[0] || 'Ongoing'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 border-t border-sage-800/80 bg-sage-900/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-sage-400 block uppercase font-semibold">Tuition</span>
                          <span className="font-serif font-bold text-xl text-gold-400">
                            {formatPrice(course.priceUSD)}
                          </span>
                        </div>
                        <span className="text-xs text-emerald-400 font-semibold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                          Active Listing
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-view 2: Matchmaker Quiz Funnel */}
            {centrePortalSubTab === 'matchmaker' && (
              <div className="bg-sage-950 p-6 sm:p-8 rounded-3xl border border-sage-800">
                <CentreMatchmakerBuilder centre={myCentre} />
              </div>
            )}

            {/* Sub-view 3: Assigned Leads */}
            {centrePortalSubTab === 'leads' && (
              <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white">
                      Assigned Inquiries for {myCentre.name}
                    </h3>
                    <p className="text-xs text-sage-300 mt-1">
                      Traveler direct details are protected by Admin Escrow until booking confirmation.
                    </p>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-800 flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Escrow Protected</span>
                  </span>
                </div>

                {myCentreBookings.length === 0 ? (
                  <div className="p-8 text-center bg-sage-950 rounded-2xl border border-sage-800 text-sage-400 text-xs">
                    No active booking inquiries currently mapped to {myCentre.name}.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myCentreBookings.map(b => (
                      <div key={b.id} className="bg-sage-950 p-6 rounded-2xl border border-sage-800 flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs bg-sage-800 text-gold-400 font-bold px-2 py-0.5 rounded">
                              {b.referenceCode}
                            </span>
                            <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-800">
                              Status: {b.status}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-lg text-white">{b.courseTitle}</h4>
                          <div className="text-xs text-sage-300">
                            Intake: <strong>{b.startDate}</strong> • Room: <strong>{b.roomType}</strong> • Airport Transfer: <strong>{b.airportPickup ? 'Yes' : 'No'}</strong>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-sage-400 uppercase font-semibold block">Ashram Net Payout</span>
                          <span className="font-serif font-bold text-xl text-emerald-400">{formatPrice(b.centrePayoutUSD || 1000)}</span>
                          <span className="text-[10px] text-sage-500 block">After 15% Platform Commission</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Modal: Add New Course */}
            {isAddingCourse && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/80 backdrop-blur-md">
                <div className="bg-sage-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-sage-700 shadow-2xl">
                  <div className="flex justify-between items-center border-b border-sage-800 pb-3">
                    <h3 className="font-serif font-bold text-xl text-white">Add Course for {myCentre.name}</h3>
                    <button onClick={() => setIsAddingCourse(false)} className="text-sage-400 hover:text-white">✕</button>
                  </div>

                  <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-sand-50 block mb-1">Course Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 200 Hour Hatha &amp; Kundalini TTC"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-sage-950 border border-sage-700 p-2.5 rounded-xl text-sm text-white focus:border-gold-400 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-sand-50 block mb-1">Category</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as any)}
                          className="w-full bg-sage-950 border border-sage-700 p-2.5 rounded-xl text-sm text-white focus:border-gold-400 outline-none"
                        >
                          <option value="200h-ttc">200-Hour TTC</option>
                          <option value="300h-ttc">300-Hour TTC</option>
                          <option value="meditation">Meditation Retreat</option>
                          <option value="ayurveda">Ayurveda &amp; Detox</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-sand-50 block mb-1">Price (USD)</label>
                        <input
                          type="number"
                          value={newPriceUSD}
                          onChange={(e) => setNewPriceUSD(Number(e.target.value))}
                          className="w-full bg-sage-950 border border-sage-700 p-2.5 rounded-xl text-sm text-white focus:border-gold-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-sand-50 block mb-1">Duration (Days)</label>
                      <input
                        type="number"
                        value={newDuration}
                        onChange={(e) => setNewDuration(Number(e.target.value))}
                        className="w-full bg-sage-950 border border-sage-700 p-2.5 rounded-xl text-sm text-white focus:border-gold-400 outline-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit" 
                        className="w-full bg-gold-500 hover:bg-gold-400 text-sage-950 font-bold py-3 rounded-xl transition text-xs shadow-md"
                      >
                        Publish Course Listing to {myCentre.name}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: Centre Matchmaker Moderation */}
        {activeTab === 'matchmakers' && (
          <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-sand-50">Partner Centre Matchmaker Moderation</h2>
                <p className="text-xs text-sage-300 mt-1">
                  Manage interactive AI recommendation quizzes deployed by partner ashrams.
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs font-mono bg-sage-950 px-4 py-2 rounded-xl border border-sage-800">
                <span>Total Starts: <strong className="text-gold-400">{totalPlatformStarts}</strong></span>
                <span>Completions: <strong className="text-emerald-400">{totalPlatformCompletions}</strong></span>
                <span>Avg Conversion: <strong className="text-gold-400">{platformAvgConversion}%</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {centres.map(centre => {
                const config = matchmakerConfigs[centre.id];
                const stats = matchmakerAnalytics[centre.id];
                const isDisabled = config?.adminDisabled;

                return (
                  <div key={centre.id} className="bg-sage-950 p-6 rounded-2xl border border-sage-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={centre.coverImage} alt={centre.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-serif font-bold text-base text-white">{centre.name}</h4>
                          <span className="text-[11px] text-sage-400">{centre.location}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isDisabled ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {isDisabled ? 'Suspended by Admin' : 'Active Funnel'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center bg-sage-900/60 p-3 rounded-xl border border-sage-800/80">
                      <div>
                        <span className="text-[10px] text-sage-400 block">Starts</span>
                        <span className="font-bold text-sm text-white">{stats?.startsCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-sage-400 block">Finished</span>
                        <span className="font-bold text-sm text-emerald-400">{stats?.completionsCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-sage-400 block">Leads</span>
                        <span className="font-bold text-sm text-gold-400">{stats?.enquiriesCount || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-sage-800">
                      <button
                        onClick={() => openCentreMatchmaker(centre.id)}
                        className="text-xs text-gold-400 hover:underline flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Live Quiz</span>
                      </button>

                      <button
                        onClick={() => setAdminMatchmakerDisabled(centre.id, !isDisabled)}
                        className={`text-xs px-3 py-1 rounded font-semibold transition ${
                          isDisabled 
                            ? 'bg-emerald-900 hover:bg-emerald-800 text-white' 
                            : 'bg-red-900/60 hover:bg-red-900 text-red-200'
                        }`}
                      >
                        {isDisabled ? 'Re-enable Quiz' : 'Suspend Quiz'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Centre Approvals & Verification */}
        {activeTab === 'centres' && (
          <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-sand-50">Yoga Centre &amp; Course Approvals</h2>
                <p className="text-xs text-sage-300">Upload centres on behalf of partner ashrams and manage active listings.</p>
              </div>
              <button
                onClick={() => setIsAddCentreOpen(true)}
                className="bg-gold-500 hover:bg-gold-400 text-sage-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Upload Centre On Behalf of Ashram</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {centres.map((centre) => (
                <div key={centre.id} className="bg-sage-950 p-6 rounded-2xl border border-sage-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif font-bold text-lg text-white">{centre.name}</h3>
                    <span className="bg-emerald-900 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      Verified Active
                    </span>
                  </div>
                  <p className="text-xs text-sage-300">{centre.location}</p>
                  <div className="text-xs text-gold-400 font-semibold">
                    Commission Rate: {centre.commissionRatePercent}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Yoga Asana Encyclopedia CMS */}
        {activeTab === 'asanas' && (
          <AsanaManagerTab />
        )}

        {/* TAB 6: Revenue & Commission Tracker */}
        {activeTab === 'revenue' && (
          <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-6">
            <h2 className="font-serif font-bold text-2xl text-sand-50">Revenue &amp; Commission Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-sage-950 p-6 rounded-2xl border border-sage-800 space-y-2">
                <span className="text-xs text-sage-400 font-semibold">Gross Booking Value (GMV)</span>
                <span className="font-serif font-bold text-3xl text-gold-400 block">{formatPrice(totalGMV)}</span>
                <p className="text-xs text-sage-300">Total volume of traveler bookings across all centres.</p>
              </div>

              <div className="bg-sage-950 p-6 rounded-2xl border border-sage-800 space-y-2">
                <span className="text-xs text-sage-400 font-semibold">Net Platform Revenue (15% Avg Fee)</span>
                <span className="font-serif font-bold text-3xl text-emerald-400 block">{formatPrice(totalCommissionRevenue)}</span>
                <p className="text-xs text-sage-300">Platform earnings retained from booking commissions.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Coupon Code CMS */}
        {activeTab === 'coupons' && (
          <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-6">
            <h2 className="font-serif font-bold text-2xl text-sand-50">Promo Coupon Code Management</h2>

            <form onSubmit={handleAddCoupon} className="flex flex-col sm:flex-row gap-3 bg-sage-950 p-4 rounded-xl border border-sage-800">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. EARLYBIRD15)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-sage-900 border border-sage-700 text-white text-xs p-3 rounded-lg flex-1"
              />
              <input
                type="number"
                placeholder="Discount %"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="bg-sage-900 border border-sage-700 text-white text-xs p-3 rounded-lg w-28"
              />
              <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-sage-950 font-bold px-6 py-3 rounded-lg text-xs">
                Create Promo Code
              </button>
            </form>

            <div className="space-y-2">
              {couponList.map((c, i) => (
                <div key={i} className="bg-sage-950 p-4 rounded-xl border border-sage-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-gold-400 text-sm">{c.code}</span>
                    <span className="text-sage-400 ml-3">{c.discount}% Discount</span>
                  </div>
                  <span className="text-sage-400">{c.usage} Times Used</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
