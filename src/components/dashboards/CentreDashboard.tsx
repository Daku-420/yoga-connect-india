'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  AlertCircle, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Bell,
  RefreshCw,
  Sparkles,
  Crown
} from 'lucide-react';
import { VendorTabKey, VendorSidebar } from './vendor/VendorSidebar';
import { VendorOverviewTab } from './vendor/VendorOverviewTab';
import { VendorBookingsTab } from './vendor/VendorBookingsTab';
import { VendorCustomersTab } from './vendor/VendorCustomersTab';
import { VendorEnquiriesTab } from './vendor/VendorEnquiriesTab';
import { VendorCoursesTab } from './vendor/VendorCoursesTab';
import { VendorFinancialTab } from './vendor/VendorFinancialTab';
import { VendorSettlementsTab } from './vendor/VendorSettlementsTab';
import { VendorProfileTab } from './vendor/VendorProfileTab';
import { VendorSettingsTab } from './vendor/VendorSettingsTab';
import { VendorLoginScreen } from './vendor/VendorLoginScreen';
import { BookingRequest, BookingStatus, Course, CourseCategory, YogaCentre } from '../../types';

export const CentreDashboard: React.FC = () => {
  const { 
    centres, 
    courses, 
    bookings, 
    enquiries,
    addNewCourse, 
    formatPrice, 
    currency, 
    currentUser,
    userProfile, 
    userRole, 
    partnerCentre, 
    partnerMembership, 
    getCentreLedgerEntries, 
    getCentrePayouts, 
    financialQueries, 
    createFinancialQuery, 
    updateCentreProfile, 
    updateBookingStatus,
    updateEnquiry,
    setActiveView,
    logout
  } = useApp();

  // Active Tab State (default: 'overview')
  const [activeTab, setActiveTab] = useState<VendorTabKey>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Selected Booking for Quick Inspection
  const [activeBookingDetail, setActiveBookingDetail] = useState<BookingRequest | null>(null);

  // Check if authenticated as a vendor or admin
  const isAuthorizedVendor = useMemo(() => {
    if (!currentUser) return false;
    if (userRole === 'admin') return true;
    if ((userRole === 'centre' || userRole === 'partner' || userRole === 'yoga_centre_owner') && (partnerCentre || userProfile?.assignedCentreId)) return true;
    return false;
  }, [currentUser, userRole, partnerCentre, userProfile]);

  // Determine active centre:
  // If admin, allows inspecting selected centre (or default centre-1).
  // If vendor, strictly lock to partner's assigned centre.
  const activeCentre = useMemo<YogaCentre | null>(() => {
    if (!currentUser) return null;
    if (userRole === 'admin') {
      return partnerCentre || centres[0] || null;
    }
    if (partnerCentre) return partnerCentre;
    if (userProfile?.assignedCentreId) {
      return centres.find(c => c.id === userProfile.assignedCentreId) || null;
    }
    return centres[0] || null;
  }, [currentUser, userRole, partnerCentre, centres, userProfile]);

  // Check suspension status
  const isSuspended = userProfile?.membershipStatus === 'suspended' || partnerMembership?.status === 'suspended';

  // Strict Isolation: Bookings, Enquiries, Ledger, and Payouts for this centre only
  const myCentresBookings = useMemo(() => {
    if (!activeCentre) return [];
    return bookings.filter(b => b.centreId === activeCentre.id);
  }, [bookings, activeCentre]);

  const myCentresEnquiries = useMemo(() => {
    if (!activeCentre) return [];
    return enquiries.filter(e => e.centreId === activeCentre.id);
  }, [enquiries, activeCentre]);

  const myLedgerEntries = useMemo(() => {
    if (!activeCentre) return [];
    return getCentreLedgerEntries(activeCentre.id);
  }, [getCentreLedgerEntries, activeCentre]);

  const myPayouts = useMemo(() => {
    if (!activeCentre) return [];
    return getCentrePayouts(activeCentre.id);
  }, [getCentrePayouts, activeCentre]);

  // Sidebar badge counters
  const sidebarCounts = useMemo(() => {
    const pendingBookings = myCentresBookings.filter(
      b => b.status === 'pending_admin' || b.status === 'assigned_to_centre'
    ).length;

    const newEnquiries = myCentresEnquiries.filter(
      e => e.status === 'new'
    ).length;

    const uniqueEmails = new Set(
      myCentresBookings
        .map(b => (b.guestEmail || b.customerEmail || '').toLowerCase().trim())
        .filter(Boolean)
    );

    return {
      pendingBookings,
      newEnquiries,
      totalCustomers: uniqueEmails.size
    };
  }, [myCentresBookings, myCentresEnquiries]);

  // Handlers
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: BookingStatus, vendorNotes?: string) => {
    await updateBookingStatus(bookingId, newStatus, vendorNotes);
  };

  const handleUpdateEnquiry = async (enquiryId: string, status: string, internalNotes?: string) => {
    await updateEnquiry(enquiryId, status, internalNotes);
  };

  const handleUpdateCentreProfile = async (centreId: string, updates: Partial<YogaCentre>) => {
    await updateCentreProfile(centreId, updates);
  };

  const handleAddNewCourse = async (courseData: Partial<Course>) => {
    const fullCourse: Course = {
      id: courseData.id || `course-${Date.now()}`,
      centreId: courseData.centreId || activeCentre?.id || '',
      centreName: courseData.centreName || activeCentre?.name || 'Yoga Ashram',
      title: courseData.title || 'Untitled Course',
      subtitle: courseData.subtitle || 'Transformational Yoga & Meditation Journey',
      category: (courseData.category as CourseCategory) || '200h-ttc',
      durationDays: courseData.durationDays || 7,
      priceUSD: courseData.priceUSD || 1000,
      certification: courseData.certification || 'Certificate of Completion',
      syllabus: courseData.syllabus || ['Traditional Asana', 'Pranayama & Kriyas', 'Vedic Philosophy', 'Meditation Practices'],
      dailySchedule: courseData.dailySchedule || [
        { time: '06:00 AM', activity: 'Morning Pranayama & Mantra Chanting' },
        { time: '07:30 AM', activity: 'Classical Hatha Asana Practice' },
        { time: '09:30 AM', activity: 'Sattvic Organic Breakfast' },
        { time: '11:00 AM', activity: 'Yoga Philosophy & Anatomy Lecture' },
        { time: '01:00 PM', activity: 'Ayurvedic Lunch & Rest' },
        { time: '04:30 PM', activity: 'Ashtanga / Vinyasa Alignment Workshop' },
        { time: '06:30 PM', activity: 'Ganga Aarti / Evening Meditation' },
        { time: '08:00 PM', activity: 'Wholesome Vegetarian Dinner' }
      ],
      mealsIncluded: courseData.mealsIncluded || 'Three Sattvic vegetarian meals daily + herbal teas',
      accommodationOptions: courseData.accommodationOptions || ['Private Room with En-suite Bathroom', 'Shared Twin Room'],
      upcomingDates: courseData.upcomingDates || ['2026-11-01', '2026-12-01', '2027-01-10'],
      photos: courseData.photos || (activeCentre?.coverImage || activeCentre?.image ? [activeCentre.coverImage || activeCentre.image!] : ['https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80']),
      videoUrl: courseData.videoUrl,
      requirements: courseData.requirements || ['Open mind and readiness to immerse in ashram discipline']
    };
    addNewCourse(fullCourse);
  };

  const handleRaiseQuery = async (subject: string, message: string) => {
    if (!activeCentre) return;
    await createFinancialQuery(activeCentre.id, subject, message);
  };

  // If not authenticated or not a vendor, display the Vendor Login Screen
  if (!isAuthorizedVendor || !activeCentre) {
    return (
      <div className="min-h-screen bg-[#F7F5EE] py-12 px-4 sm:px-6 lg:px-8">
        <VendorLoginScreen />
      </div>
    );
  }

  // If suspended, display strict compliance lockdown
  if (isSuspended) {
    return (
      <div className="min-h-screen bg-[#F7F5EE] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-rose-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Account Temporarily Suspended
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your ashram portal access for <span className="font-bold text-gray-900">{activeCentre.name}</span> has been restricted pending compliance or verification review by the platform administrator.
          </p>
          <div className="p-4 bg-rose-50 rounded-2xl text-xs text-rose-800 text-left border border-rose-100">
            To restore full vendor dashboard privileges, please reach out directly to the verification desk at <span className="font-semibold underline">support@yogaconnectindia.com</span>.
          </div>
          <div className="pt-2">
            <button
              onClick={() => logout()}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EE] flex overflow-x-hidden">
      {/* Collapsible Vendor Sidebar */}
      <VendorSidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeCentre={activeCentre}
        counts={sidebarCounts}
        onLogout={() => {
          if (confirm('Are you sure you want to sign out of the vendor dashboard?')) {
            logout();
          }
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#E2E5DD] sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-lg text-[#263D32] truncate">
                {activeCentre.name}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> Approved Centre
              </span>
            </div>

            {userRole === 'admin' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                <Crown className="w-3 h-3 mr-1 text-purple-600" /> Admin Preview Mode
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveView('centres')}
              className="hidden sm:inline-flex items-center px-3 py-1.5 bg-[#F7F5EE] hover:bg-[#ECE8DD] text-[#263D32] rounded-xl text-xs font-semibold border border-[#DCD6C8] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" /> Public Directory
            </button>

            <button
              onClick={() => {
                if (confirm('Sign out of your ashram vendor session?')) {
                  logout();
                }
              }}
              title="Sign Out"
              className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tab Content Canvas */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && (
            <VendorOverviewTab
              activeCentre={activeCentre}
              bookings={myCentresBookings}
              enquiries={myCentresEnquiries}
              ledgerEntries={myLedgerEntries}
              payouts={myPayouts}
              formatPrice={formatPrice}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectBookingDetail={(b) => {
                setActiveBookingDetail(b);
                setActiveTab('bookings');
              }}
            />
          )}

          {activeTab === 'bookings' && (
            <VendorBookingsTab
              activeCentre={activeCentre}
              bookings={myCentresBookings}
              courses={courses}
              formatPrice={formatPrice}
              onUpdateBookingStatus={handleUpdateBookingStatus}
            />
          )}

          {activeTab === 'customers' && (
            <VendorCustomersTab
              activeCentre={activeCentre}
              bookings={myCentresBookings}
              courses={courses}
              formatPrice={formatPrice}
              onSelectBookingDetail={(b) => {
                setActiveBookingDetail(b);
                setActiveTab('bookings');
              }}
            />
          )}

          {activeTab === 'enquiries' && (
            <VendorEnquiriesTab
              activeCentre={activeCentre}
              enquiries={myCentresEnquiries}
              courses={courses}
              onUpdateEnquiry={handleUpdateEnquiry}
            />
          )}

          {activeTab === 'courses' && (
            <VendorCoursesTab
              activeCentre={activeCentre}
              courses={courses}
              bookings={myCentresBookings}
              formatPrice={formatPrice}
              onAddNewCourse={handleAddNewCourse}
            />
          )}

          {activeTab === 'ledger' && (
            <VendorFinancialTab
              activeCentre={activeCentre}
              bookings={myCentresBookings}
              ledgerEntries={myLedgerEntries}
              payouts={myPayouts}
              formatPrice={formatPrice}
              onRaiseQuery={() => setActiveTab('settlements')}
            />
          )}

          {activeTab === 'settlements' && (
            <VendorSettlementsTab
              activeCentre={activeCentre}
              payouts={myPayouts}
              formatPrice={formatPrice}
              onRaiseQuery={handleRaiseQuery}
            />
          )}

          {activeTab === 'profile' && (
            <VendorProfileTab
              activeCentre={activeCentre}
              onUpdateCentreProfile={handleUpdateCentreProfile}
            />
          )}

          {activeTab === 'settings' && (
            <VendorSettingsTab
              activeCentre={activeCentre}
              userEmail={currentUser?.email}
              onUpdateCentreProfile={handleUpdateCentreProfile}
              onLogout={() => {
                if (confirm('Are you sure you want to sign out of the vendor dashboard?')) {
                  logout();
                }
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};
