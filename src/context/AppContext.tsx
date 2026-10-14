import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  CurrencyCode, 
  CurrencyConfig, 
  UserRole, 
  YogaCentre, 
  Course, 
  BookingRequest, 
  FilterState, 
  AIRetreatQuizState,
  CentreMatchmakerConfig,
  MatchmakerLeadEnquiry,
  MatchmakerAnalytics,
  UserProfile,
  CentreMembership,
  FinancialLedgerEntry,
  PayoutRecord,
  FinancialQuery,
  AuditLogEntry,
  CentreEnquiry,
  VendorInvitation,
  CommissionRule,
  UserPreferences,
  YogaInstructor,
  TeachingEnquiry,
  Review
} from '../types';
import { 
  supabase, 
  isSupabaseConfigured, 
  signInWithGoogle, 
  sendEmailOtp, 
  verifyEmailOtp, 
  signInWithEmailPassword,
  signUpWithEmailPassword,
  sendPasswordReset,
  signOutUser,
  fetchUserAuthorisation,
  fetchLiveCentres,
  fetchLiveCourses,
  fetchLiveBookings,
  fetchLiveEnquiries,
  fetchLiveLedger,
  fetchLivePayouts,
  fetchLiveCommissionRules,
  fetchLiveVendorInvitations,
  fetchLiveProfiles,
  fetchLiveInstructors,
  registerInstructorInDb,
  updateInstructorInDb,
  fetchTeachingEnquiries,
  createTeachingEnquiryInDb,
  updateTeachingEnquiryInDb,
  updateProfileInDb,
  updateBookingInDb,
  updateEnquiryInDb,
  saveCentreProfileInDb,
  createVendorInvitationInDb,
  revokeVendorInvitationInDb,
  recordAuditLogInDb
} from '../lib/supabase';
import { mockCentres } from '../data/mockCentres';
import { mockCourses } from '../data/mockCourses';
import { mockBookings } from '../data/mockBookings';
import { 
  INITIAL_CENTRE_MATCHMAKERS, 
  INITIAL_MATCHMAKER_LEADS, 
  INITIAL_MATCHMAKER_ANALYTICS 
} from '../data/mockMatchmakers';
import {
  INITIAL_MEMBERSHIPS,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_PAYOUTS,
  INITIAL_FINANCIAL_QUERIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_ENQUIRIES,
  INITIAL_COMMISSION_RULES,
  INITIAL_INVITATIONS,
  INITIAL_PROFILES
} from '../data/mockAccounting';
import { INITIAL_INSTRUCTORS, INITIAL_TEACHING_ENQUIRIES } from '../data/mockInstructors';
import { INITIAL_REVIEWS } from '../data/mockReviews';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rateVsUSD: 1.0, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rateVsUSD: 0.92, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rateVsUSD: 0.78, label: 'GBP (£)' },
  AUD: { code: 'AUD', symbol: 'A$', rateVsUSD: 1.52, label: 'AUD (A$)' },
  CAD: { code: 'CAD', symbol: 'C$', rateVsUSD: 1.36, label: 'CAD (C$)' },
  INR: { code: 'INR', symbol: '₹', rateVsUSD: 83.50, label: 'INR (₹)' },
};

export interface CentreFinancialMetrics {
  totalBookings: number;
  confirmedBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  grossBookingValue: number;
  platformCommission: number;
  refunds: number;
  netAmountPayable: number;
  totalPayoutsCompleted: number;
  outstandingPayableBalance: number;
}

interface AppContextType {
  // Branding
  brandName: string;
  setBrandName: (name: string) => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceInUSD: number) => string;

  // Role Switcher
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Navigation View
  activeView: string; // 'home' | 'retreats' | 'centre-detail' | 'destinations' | 'blog' | 'blog-detail' | 'user-dashboard' | 'centre-dashboard' | 'admin-dashboard'
  setActiveView: (view: string) => void;

  // Selected Items for Details
  selectedCentreId: string | null;
  setSelectedCentreId: (id: string | null) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedDestinationSlug: string | null;
  setSelectedDestinationSlug: (slug: string | null) => void;
  selectedBlogSlug: string | null;
  setSelectedBlogSlug: (slug: string | null) => void;

  // Data
  centres: YogaCentre[];
  courses: Course[];
  bookings: BookingRequest[];
  wishlist: string[]; // array of centre IDs
  toggleWishlist: (centreId: string) => void;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Actions
  createBookingRequest: (request: Omit<BookingRequest, 'id' | 'referenceCode' | 'createdAt' | 'status'>) => BookingRequest;
  updateBookingStatus: (bookingId: string, newStatus: BookingRequest['status'], adminNotes?: string) => void;
  addNewCourse: (course: Course) => void;
  addNewCentre: (centre: YogaCentre) => void;
  updateCentreProfile: (centreId: string, updates: Partial<YogaCentre>) => void;

  // Modals
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isCourseDrawerOpen: boolean;
  setIsCourseDrawerOpen: (open: boolean) => void;
  isAIQuizModalOpen: boolean;
  setIsAIQuizModalOpen: (open: boolean) => void;
  isSchemaModalOpen: boolean;
  setIsSchemaModalOpen: (open: boolean) => void;
  isAddCentreOpen: boolean;
  setIsAddCentreOpen: (open: boolean) => void;

  // Centre Matchmaker System
  matchmakerConfigs: Record<string, CentreMatchmakerConfig>;
  matchmakerLeads: MatchmakerLeadEnquiry[];
  matchmakerAnalytics: Record<string, MatchmakerAnalytics>;
  isMatchmakerModalOpen: boolean;
  matchmakerCentreId: string | null;
  openCentreMatchmaker: (centreId: string) => void;
  closeCentreMatchmaker: () => void;
  saveCentreMatchmakerConfig: (config: CentreMatchmakerConfig) => void;
  toggleCentreMatchmakerEnabled: (centreId: string, enabled: boolean) => void;
  setCentreMatchmakerStatus: (centreId: string, status: 'draft' | 'published' | 'deactivated') => void;
  setAdminMatchmakerDisabled: (centreId: string, disabled: boolean, reason?: string) => void;
  submitMatchmakerEnquiry: (leadData: Omit<MatchmakerLeadEnquiry, 'id' | 'referenceCode' | 'createdAt' | 'status'>) => MatchmakerLeadEnquiry;
  recordMatchmakerStart: (centreId: string) => void;
  recordMatchmakerCompletion: (centreId: string, answers: Record<string, any>, recommendedCourseId?: string) => void;

  // Live Chat Widget
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatMessages: any[];
  setChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
  unreadCount: number;
  setUnreadCount: (count: number) => void;

  // User Authentication (Google / Gmail & OTP)
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: (returnPath?: string) => Promise<{ success?: boolean; error?: string }>;
  sendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithPassword: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean; message?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  loginAsPersona: (email: string) => void;

  // Partner Centre & Memberships
  memberships: CentreMembership[];
  partnerCentre: YogaCentre | null;
  partnerMembership: CentreMembership | null;
  assignPartnerToCentre: (userEmail: string, userName: string, centreId: string, role?: 'owner' | 'manager' | 'accountant') => { success: boolean; membership?: CentreMembership; error?: string };
  updateMembershipStatus: (membershipId: string, status: 'active' | 'suspended' | 'inactive') => void;
  removePartnerMembership: (membershipId: string) => void;

  // Financial Ledger & Accounting
  ledgerEntries: FinancialLedgerEntry[];
  addLedgerAdjustment: (centreId: string, amount: number, direction: 'credit' | 'debit', description: string, referenceCode?: string) => FinancialLedgerEntry;
  getCentreLedgerEntries: (centreId: string) => FinancialLedgerEntry[];
  getCentreFinancialMetrics: (centreId: string, dateRange?: { from?: string; to?: string }) => CentreFinancialMetrics;

  // Payouts & Settlements
  payouts: PayoutRecord[];
  createPayoutBatch: (centreId: string, netAmount: number, notes?: string, periodStart?: string, periodEnd?: string) => PayoutRecord;
  processPayoutSettlement: (payoutId: string, settlementReference: string) => { success: boolean; error?: string };
  getCentrePayouts: (centreId: string) => PayoutRecord[];

  // Financial Queries
  financialQueries: FinancialQuery[];
  createFinancialQuery: (centreId: string, subject: string, message: string) => FinancialQuery;
  respondToFinancialQuery: (queryId: string, response: string) => void;

  // Enquiries Management
  enquiries: CentreEnquiry[];
  updateEnquiryStatus: (enquiryId: string, status: CentreEnquiry['status'], internalNotes?: string) => Promise<{ success: boolean; error?: string }>;
  updateEnquiry: (enquiryId: string, status: any, internalNotes?: string) => Promise<any>;
  submitCustomerEnquiry: (enquiryData: Omit<CentreEnquiry, 'id' | 'referenceCode' | 'createdAt' | 'status'>) => Promise<CentreEnquiry>;

  // Commission Rules
  commissionRules: CommissionRule[];
  addCommissionRule: (rule: Omit<CommissionRule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  updateCommissionRule: (id: string, updates: Partial<CommissionRule>) => Promise<{ success: boolean; error?: string }>;

  // Vendor Invitations (Admin only)
  vendorInvitations: VendorInvitation[];
  createVendorInvitation: (centreId: string, email: string, role?: 'owner' | 'manager' | 'accountant') => Promise<{ success: boolean; error?: string; invitation?: any }>;
  revokeVendorInvitation: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Database State Refresh
  refreshDatabaseState: () => Promise<void>;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  recordAuditLog: (action: string, targetEntity: string, targetId?: string, details?: Record<string, any>) => void;

  // Role Portal Tab State for Deep Navigation
  adminDashboardTab: string;
  setAdminDashboardTab: (tab: string) => void;
  vendorDashboardTab: string;
  setVendorDashboardTab: (tab: string) => void;
  instructorDashboardTab: string;
  setInstructorDashboardTab: (tab: string) => void;
  userDashboardTab: string;
  setUserDashboardTab: (tab: string) => void;

  // Yoga Instructors & Teaching Enquiries
  instructors: YogaInstructor[];
  teachingEnquiries: TeachingEnquiry[];
  activeInstructor: YogaInstructor | null;
  registerYogaCentre: (centreData: Partial<YogaCentre> & { ownerName: string; ownerEmail: string; password?: string }) => Promise<{ success: boolean; centreId?: string; error?: string }>;
  registerYogaInstructor: (instructorData: Omit<YogaInstructor, 'id' | 'createdAt' | 'status'> & { password?: string }) => Promise<{ success: boolean; instructorId?: string; error?: string }>;
  updateInstructorProfile: (instructorId: string, updates: Partial<YogaInstructor>) => Promise<{ success: boolean; error?: string }>;
  updateInstructorStatus: (instructorId: string, status: YogaInstructor['status']) => Promise<{ success: boolean; error?: string }>;
  submitTeachingEnquiry: (enquiryData: Omit<TeachingEnquiry, 'id' | 'createdAt' | 'status' | 'platformCommission' | 'instructorNet' | 'paymentStatus'>) => Promise<{ success: boolean; enquiryId?: string; error?: string }>;
  updateTeachingEnquiryStatus: (enquiryId: string, status: TeachingEnquiry['status'], notes?: string) => Promise<{ success: boolean; error?: string }>;
  updateTeachingEnquiryPayment: (enquiryId: string, paymentStatus: TeachingEnquiry['paymentStatus']) => Promise<{ success: boolean; error?: string }>;

  // Reviews & Verified Ratings
  reviews: Review[];
  submitReview: (reviewData: Omit<Review, 'id' | 'date'>) => { success: boolean; review?: Review; error?: string };
  getCentreReviews: (centreId: string) => Review[];

  // Platform User Accounts & Profile Management
  profiles: UserProfile[];
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  updateUserPreferences: (preferences: UserPreferences) => Promise<{ success: boolean; error?: string }>;
  updateUserAccountStatus: (userId: string, status: 'active' | 'suspended') => Promise<{ success: boolean; error?: string }>;
  requestBookingCancellation: (bookingId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
}


const defaultFilters: FilterState = {
  searchLocation: 'all',
  courseCategory: 'all',
  minPriceUSD: 0,
  maxPriceUSD: 3000,
  minDays: 0,
  maxDays: 30,
  style: 'all',
  skillLevel: 'all',
  certification: 'all',
  accommodationType: 'all',
  mealsIncluded: false,
  pickupIncluded: false,
  language: 'all'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandName, setBrandName] = useState<string>('YogaConnect India');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [userRole, setUserRole] = useState<UserRole>('visitor');
  const [activeView, setActiveView] = useState<string>('home');

  const [selectedCentreId, setSelectedCentreId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedDestinationSlug, setSelectedDestinationSlug] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

  const [centres, setCentres] = useState<YogaCentre[]>(mockCentres);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [bookings, setBookings] = useState<BookingRequest[]>(mockBookings);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Modal Visibility
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = useState(false);
  const [isAIQuizModalOpen, setIsAIQuizModalOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isAddCentreOpen, setIsAddCentreOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Centre Memberships, Financial Ledger, Payouts, Audit Logs
  const [memberships, setMemberships] = useState<CentreMembership[]>(INITIAL_MEMBERSHIPS);
  const [ledgerEntries, setLedgerEntries] = useState<FinancialLedgerEntry[]>(INITIAL_LEDGER_ENTRIES);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);
  const [financialQueries, setFinancialQueries] = useState<FinancialQuery[]>(INITIAL_FINANCIAL_QUERIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [enquiries, setEnquiries] = useState<CentreEnquiry[]>(INITIAL_ENQUIRIES);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(INITIAL_COMMISSION_RULES);
  const [vendorInvitations, setVendorInvitations] = useState<VendorInvitation[]>(INITIAL_INVITATIONS);

  // Role Portal Tab State for Deep Navigation
  const [adminDashboardTab, setAdminDashboardTab] = useState<string>('overview');
  const [vendorDashboardTab, setVendorDashboardTab] = useState<string>('overview');
  const [instructorDashboardTab, setInstructorDashboardTab] = useState<string>('overview');
  const [userDashboardTab, setUserDashboardTab] = useState<string>('profile');
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);

  // Yoga Instructors and Teaching Enquiries State
  const [instructors, setInstructors] = useState<YogaInstructor[]>(INITIAL_INSTRUCTORS);
  const [teachingEnquiries, setTeachingEnquiries] = useState<TeachingEnquiry[]>(INITIAL_TEACHING_ENQUIRIES);

  // Reviews & Verified Ratings State
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Active Instructor (derived from authenticated profile)
  const activeInstructor = instructors.find(
    inst => (inst.email || '').toLowerCase() === (userProfile?.email || '').toLowerCase() ||
            (inst.userId && inst.userId === userProfile?.id) ||
            (userProfile?.instructorId && inst.id === userProfile.instructorId)
  ) || null;

  // Active Partner Membership and Centre (derived from authenticated profile)
  const partnerMembership = memberships.find(
    m => (m.userEmail || '').toLowerCase() === (userProfile?.email || '').toLowerCase()
  ) || (userProfile?.assignedCentreId ? memberships.find(m => m.centreId === userProfile.assignedCentreId) : null) || null;

  const partnerCentre = centres.find(
    c => c.id === (userProfile?.assignedCentreId || partnerMembership?.centreId)
  ) || null;

  // Initialize and listen to Supabase Auth state
  useEffect(() => {
    // 1. Check local storage for persistent profile in fallback mode
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('yogaconnect_user_profile');
        if (saved) {
          const parsed: UserProfile = JSON.parse(saved);
          if (parsed.role === 'centre') parsed.role = 'partner';
          setUserProfile(parsed);
          setUserRole(parsed.role as UserRole || 'user');
        }
      } catch (e) {
        // ignore
      }
    }

    if (!isSupabaseConfigured) return;

    // 2. Fetch active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        syncUserProfile(session.user);
      }
    });

    // 3. Listen to Auth changes (OAuth redirect back, OTP sign-in, sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setCurrentUser(null);
        setUserProfile(null);
        setUserRole('visitor');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('yogaconnect_user_profile');
        }
      } else if (session?.user) {
        setCurrentUser(session.user);
        syncUserProfile(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const syncUserProfile = async (user: User) => {
    // 1. Query live database authorization if Supabase is connected
    const authData = await fetchUserAuthorisation(user.id, user.email || '');
    if (authData && authData.membership) {
      const mem = authData.membership;
      const centre = centres.find(c => c.id === mem.centre_id);
      const profile: UserProfile = {
        id: user.id,
        email: user.email || '',
        fullName: authData.profile?.full_name || user.user_metadata?.full_name || 'Centre Partner',
        avatarUrl: authData.profile?.avatar_url || user.user_metadata?.avatar_url || '',
        role: 'partner',
        assignedCentreId: mem.centre_id,
        assignedCentreName: centre?.name || (mem.centres as any)?.name || 'Authorized Centre',
        membershipStatus: mem.status as any,
        createdAt: user.created_at,
      };
      setUserProfile(profile);
      setUserRole(mem.status === 'active' ? 'partner' : 'visitor');
      if (typeof window !== 'undefined') {
        localStorage.setItem('yogaconnect_user_profile', JSON.stringify(profile));
      }
      return;
    }

    if (authData?.role === 'admin') {
      const profile: UserProfile = {
        id: user.id,
        email: user.email || '',
        fullName: authData.profile?.full_name || 'Chief Administrator',
        role: 'admin',
        createdAt: user.created_at,
      };
      setUserProfile(profile);
      setUserRole('admin');
      if (typeof window !== 'undefined') {
        localStorage.setItem('yogaconnect_user_profile', JSON.stringify(profile));
      }
      return;
    }

    // 2. Check local configured memberships
    const userEmail = (user.email || '').toLowerCase().trim();
    const existingMembership = memberships.find(m => (m.userEmail || '').toLowerCase() === userEmail);
    if (existingMembership) {
      const centre = centres.find(c => c.id === existingMembership.centreId);
      const profile: UserProfile = {
        id: user.id,
        email: userEmail,
        fullName: existingMembership.userName || user.user_metadata?.full_name || 'Centre Partner',
        role: 'partner',
        assignedCentreId: existingMembership.centreId,
        assignedCentreName: centre?.name || existingMembership.centreName,
        membershipStatus: existingMembership.status,
        createdAt: user.created_at,
      };
      setUserProfile(profile);
      setUserRole(existingMembership.status === 'active' ? 'partner' : 'visitor');
      if (typeof window !== 'undefined') {
        localStorage.setItem('yogaconnect_user_profile', JSON.stringify(profile));
      }
      return;
    }

    if (userEmail === 'admin@yogaconnect.in') {
      const profile: UserProfile = {
        id: user.id,
        email: userEmail,
        fullName: 'Chief Administrator',
        role: 'admin',
        createdAt: user.created_at,
      };
      setUserProfile(profile);
      setUserRole('admin');
      if (typeof window !== 'undefined') {
        localStorage.setItem('yogaconnect_user_profile', JSON.stringify(profile));
      }
      return;
    }

    // Default regular customer
    const profile: UserProfile = {
      id: user.id,
      email: user.email || '',
      fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler',
      avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      role: 'user',
      createdAt: user.created_at,
    };
    setUserProfile(profile);
    setUserRole('user');
    if (typeof window !== 'undefined') {
      localStorage.setItem('yogaconnect_user_profile', JSON.stringify(profile));
    }
  };

  const loginAsPersona = (email: string) => {
    const trimmed = email.trim().toLowerCase();

    // Check in registered platform profiles first
    const foundProfile = profiles.find(p => p.email.toLowerCase() === trimmed);
    if (foundProfile) {
      setUserProfile(foundProfile);
      if (foundProfile.role === 'admin') {
        setUserRole('admin');
        setActiveView('admin-dashboard');
      } else if (foundProfile.role === 'partner' || foundProfile.role === 'centre' || foundProfile.role === 'yoga_centre_owner') {
        const isSuspended = foundProfile.status === 'suspended' || foundProfile.membershipStatus === 'suspended';
        setUserRole(isSuspended ? 'visitor' : 'partner');
        setActiveView('centre-dashboard');
      } else if (foundProfile.role === 'instructor' || foundProfile.role === 'individual_yoga_instructor') {
        const isSuspended = foundProfile.status === 'suspended';
        setUserRole(isSuspended ? 'visitor' : 'instructor');
        setActiveView('instructor-dashboard');
      } else {
        const isSuspended = foundProfile.status === 'suspended';
        setUserRole(isSuspended ? 'visitor' : 'user');
        setActiveView('user-dashboard');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('yogaconnect_user_profile', JSON.stringify(foundProfile));
      }
      setIsAuthModalOpen(false);
      return;
    }

    if (trimmed === 'admin@yogaconnect.in') {
      const profile: UserProfile = {
        id: 'admin-1',
        email: 'admin@yogaconnect.in',
        fullName: 'Chief Administrator',
        avatarUrl: '',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      setUserProfile(profile);
      setUserRole('admin');
      setActiveView('admin-dashboard');
      if (typeof window !== 'undefined') {
        localStorage.setItem('yogaconnect_user_profile', JSON.stringify(profile));
      }
      setIsAuthModalOpen(false);
      return;
    }

    const membership = memberships.find(m => (m.userEmail || '').toLowerCase() === trimmed);
    if (membership) {
      const centre = centres.find(c => c.id === membership.centreId);
      const profile: UserProfile = {
        id: membership.userId,
        email: membership.userEmail || trimmed,
        fullName: membership.userName || 'Centre Partner',
        avatarUrl: '',
        role: 'partner',
        status: membership.status,
        assignedCentreId: membership.centreId,
        assignedCentreName: centre?.name || membership.centreName,
        membershipStatus: membership.status,
        createdAt: membership.createdAt
      };
      setUserProfile(profile);
      setUserRole(membership.status === 'active' ? 'partner' : 'visitor');
      setActiveView('centre-dashboard');
      if (typeof window !== 'undefined') {
        localStorage.setItem('yogaconnect_user_profile', JSON.stringify(profile));
      }
      setIsAuthModalOpen(false);
      return;
    }

    // Regular customer
    const profile: UserProfile = {
      id: 'customer-' + Date.now(),
      email: trimmed,
      fullName: trimmed.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Sarah Jenkins',
      avatarUrl: '',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setUserProfile(profile);
    setUserRole('user');
    setActiveView('user-dashboard');
    if (typeof window !== 'undefined') {
      localStorage.setItem('yogaconnect_user_profile', JSON.stringify(profile));
    }
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async (returnPath?: string) => {
    const { error } = await signInWithGoogle(returnPath);
    if (error) {
      return { error: error.message };
    }
    return { success: true };
  };

  const sendOtp = async (emailToVerify: string) => {
    const trimmed = emailToVerify.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const { error } = await sendEmailOtp(trimmed);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const verifyOtp = async (emailToVerify: string, token: string) => {
    const trimmedEmail = emailToVerify.trim().toLowerCase();
    const trimmedToken = token.trim();

    const { data, error } = await verifyEmailOtp(trimmedEmail, trimmedToken);
    if (error) {
      return { success: false, error: error.message };
    }
    if (data?.user) {
      setCurrentUser(data.user);
      syncUserProfile(data.user);
    }
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const loginWithPassword = async (emailToVerify: string, password: string) => {
    const trimmedEmail = emailToVerify.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    const { data, error } = await signInWithEmailPassword(trimmedEmail, password);
    if (error) {
      return { success: false, error: error.message };
    }
    if (data?.user) {
      setCurrentUser(data.user);
      syncUserProfile(data.user);
    }
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const signUpWithPassword = async (emailToVerify: string, password: string, fullName?: string) => {
    const trimmedEmail = emailToVerify.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const { data, error } = await signUpWithEmailPassword(trimmedEmail, password, fullName);
    if (error) {
      return { success: false, error: error.message };
    }
    if (data?.session && data?.user) {
      setCurrentUser(data.user);
      syncUserProfile(data.user);
      setIsAuthModalOpen(false);
      return { success: true };
    } else {
      return { 
        success: true, 
        requiresVerification: true,
        message: 'Account registered! Please check your email inbox to confirm your account.' 
      };
    }
  };

  const resetPassword = async (emailToVerify: string) => {
    const trimmedEmail = emailToVerify.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    const { error } = await sendPasswordReset(trimmedEmail);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, message: 'Password reset link has been dispatched to your email.' };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await signOutUser();
    }
    setCurrentUser(null);
    setUserProfile(null);
    setUserRole('visitor');
    setActiveView('home');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('yogaconnect_user_profile');
    }
  };


  // Centre Matchmaker System State
  const [matchmakerConfigs, setMatchmakerConfigs] = useState<Record<string, CentreMatchmakerConfig>>(INITIAL_CENTRE_MATCHMAKERS);
  const [matchmakerLeads, setMatchmakerLeads] = useState<MatchmakerLeadEnquiry[]>(INITIAL_MATCHMAKER_LEADS);
  const [matchmakerAnalytics, setMatchmakerAnalytics] = useState<Record<string, MatchmakerAnalytics>>(INITIAL_MATCHMAKER_ANALYTICS);
  const [isMatchmakerModalOpen, setIsMatchmakerModalOpen] = useState(false);
  const [matchmakerCentreId, setMatchmakerCentreId] = useState<string | null>(null);

  const openCentreMatchmaker = (centreId: string) => {
    setMatchmakerCentreId(centreId);
    setIsMatchmakerModalOpen(true);
    recordMatchmakerStart(centreId);
  };

  const closeCentreMatchmaker = () => {
    setIsMatchmakerModalOpen(false);
  };

  const saveCentreMatchmakerConfig = (config: CentreMatchmakerConfig) => {
    setMatchmakerConfigs(prev => ({
      ...prev,
      [config.centreId]: {
        ...config,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      }
    }));
  };

  const toggleCentreMatchmakerEnabled = (centreId: string, enabled: boolean) => {
    setMatchmakerConfigs(prev => {
      const existing = prev[centreId];
      if (!existing) return prev;
      return {
        ...prev,
        [centreId]: {
          ...existing,
          isEnabled: enabled,
          status: enabled ? 'published' : 'deactivated',
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      };
    });
  };

  const setCentreMatchmakerStatus = (centreId: string, status: 'draft' | 'published' | 'deactivated') => {
    setMatchmakerConfigs(prev => {
      const existing = prev[centreId];
      if (!existing) return prev;
      return {
        ...prev,
        [centreId]: {
          ...existing,
          status,
          isEnabled: status === 'published',
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      };
    });
  };

  const setAdminMatchmakerDisabled = (centreId: string, disabled: boolean, reason?: string) => {
    setMatchmakerConfigs(prev => {
      const existing = prev[centreId];
      if (!existing) return prev;
      return {
        ...prev,
        [centreId]: {
          ...existing,
          adminDisabled: disabled,
          adminDisabledReason: reason || (disabled ? 'Deactivated by platform administrator pending compliance review' : undefined),
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      };
    });
  };

  const recordMatchmakerStart = (centreId: string) => {
    setMatchmakerAnalytics(prev => {
      const current = prev[centreId] || {
        centreId,
        startsCount: 0,
        completionsCount: 0,
        topGoals: [],
        popularStyles: [],
        requestedExperienceLevels: [],
        topRecommendedOfferings: [],
        enquiriesCount: 0
      };
      return {
        ...prev,
        [centreId]: {
          ...current,
          startsCount: current.startsCount + 1
        }
      };
    });
  };

  const recordMatchmakerCompletion = (centreId: string, answers: Record<string, any>, recommendedCourseId?: string) => {
    setMatchmakerAnalytics(prev => {
      const current = prev[centreId] || {
        centreId,
        startsCount: 1,
        completionsCount: 0,
        topGoals: [],
        popularStyles: [],
        requestedExperienceLevels: [],
        topRecommendedOfferings: [],
        enquiriesCount: 0
      };

      const newCompletions = current.completionsCount + 1;
      const updatedOfferings = [...current.topRecommendedOfferings];
      if (recommendedCourseId) {
        const existingOffering = updatedOfferings.find(o => o.courseId === recommendedCourseId);
        if (existingOffering) {
          existingOffering.count += 1;
        } else {
          const course = courses.find(c => c.id === recommendedCourseId);
          if (course) {
            updatedOfferings.push({ courseId: course.id, title: course.title, count: 1 });
          }
        }
      }

      return {
        ...prev,
        [centreId]: {
          ...current,
          completionsCount: newCompletions,
          topRecommendedOfferings: updatedOfferings
        }
      };
    });
  };

  const submitMatchmakerEnquiry = (leadData: Omit<MatchmakerLeadEnquiry, 'id' | 'referenceCode' | 'createdAt' | 'status'>): MatchmakerLeadEnquiry => {
    const randomRef = 'MM-YC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newLead: MatchmakerLeadEnquiry = {
      ...leadData,
      id: 'mm-lead-' + Date.now(),
      referenceCode: randomRef,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'new'
    };

    setMatchmakerLeads(prev => [newLead, ...prev]);

    setMatchmakerAnalytics(prev => {
      const current = prev[leadData.centreId];
      if (!current) return prev;
      return {
        ...prev,
        [leadData.centreId]: {
          ...current,
          enquiriesCount: current.enquiriesCount + 1
        }
      };
    });

    return newLead;
  };

  // Live Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      senderName: 'Priya (Yoga & Retreat Specialist)',
      senderAvatar: '🧘‍♀️',
      text: 'Namaste! 🙏 Welcome to YogaConnect India. How can I assist you with retreat packages or escrow booking details today?',
      time: 'Just now',
      quickActions: [
        '200h TTC Packages 🧘‍♀️',
        'Ayurveda & Panchakarma 🌿',
        'How Escrow Booking Works 🛡️',
        'Talk to Human Support 💬'
      ]
    }
  ]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const formatPrice = (priceInUSD: number): string => {
    const config = CURRENCY_CONFIGS[currency];
    const converted = Math.round(priceInUSD * config.rateVsUSD);
    return `${config.symbol}${converted.toLocaleString()}`;
  };

  const toggleWishlist = (centreId: string) => {
    setWishlist(prev => 
      prev.includes(centreId) ? prev.filter(id => id !== centreId) : [...prev, centreId]
    );
  };

  const recordAuditLog = (
    action: string, 
    targetEntity: string, 
    targetId?: string, 
    details?: Record<string, any>
  ) => {
    const entry: AuditLogEntry = {
      id: 'audit-' + Date.now(),
      actorId: userProfile?.id || 'admin-1',
      actorEmail: userProfile?.email || 'admin@yogaconnect.in',
      action,
      targetEntity,
      targetId,
      details,
      ipAddress: '103.21.244.2',
      createdAt: new Date().toISOString()
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  const assignPartnerToCentre = (
    userEmail: string, 
    userName: string, 
    centreId: string, 
    role: 'owner' | 'manager' | 'accountant' = 'owner'
  ) => {
    const trimmedEmail = userEmail.trim().toLowerCase();
    const centre = centres.find(c => c.id === centreId);
    if (!centre) {
      return { success: false, error: 'Specified yoga centre does not exist.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Valid email address is required.' };
    }

    const existing = memberships.find(m => m.userEmail?.toLowerCase() === trimmedEmail && m.centreId === centreId);
    if (existing) {
      return { success: false, error: 'A membership for this email and centre already exists.' };
    }

    const newMembership: CentreMembership = {
      id: 'mem-' + Date.now(),
      userId: 'user-' + Date.now(),
      userEmail: trimmedEmail,
      userName: userName || trimmedEmail.split('@')[0],
      centreId,
      centreName: centre.name,
      role,
      status: 'active',
      assignedBy: userProfile?.id || 'admin-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMemberships(prev => [newMembership, ...prev]);

    recordAuditLog(
      'partner_account_assigned',
      'centre_memberships',
      newMembership.id,
      {
        partnerEmail: trimmedEmail,
        centreId,
        centreName: centre.name,
        role
      }
    );

    return { success: true, membership: newMembership };
  };

  const updateMembershipStatus = (membershipId: string, status: 'active' | 'suspended' | 'inactive') => {
    setMemberships(prev => prev.map(m => {
      if (m.id === membershipId) {
        return {
          ...m,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    }));

    const membership = memberships.find(m => m.id === membershipId);
    if (membership) {
      if (userProfile && (userProfile.email.toLowerCase() === membership.userEmail?.toLowerCase() || userProfile.assignedCentreId === membership.centreId)) {
        setUserProfile(prev => prev ? { ...prev, membershipStatus: status } : null);
        if (status !== 'active') {
          setUserRole('visitor');
        } else {
          setUserRole('partner');
        }
      }

      recordAuditLog(
        status === 'suspended' ? 'partner_account_suspended' : status === 'inactive' ? 'partner_account_deactivated' : 'partner_account_activated',
        'centre_memberships',
        membershipId,
        {
          partnerEmail: membership.userEmail,
          centreId: membership.centreId,
          centreName: membership.centreName,
          newStatus: status
        }
      );
    }
  };

  const removePartnerMembership = (membershipId: string) => {
    const mem = memberships.find(m => m.id === membershipId);
    setMemberships(prev => prev.filter(m => m.id !== membershipId));
    if (mem) {
      if (userProfile && userProfile.email.toLowerCase() === mem.userEmail?.toLowerCase()) {
        setUserProfile(prev => prev ? { ...prev, assignedCentreId: undefined, assignedCentreName: undefined, role: 'user' } : null);
        setUserRole('user');
      }
      recordAuditLog('partner_account_removed', 'centre_memberships', membershipId, {
        partnerEmail: mem.userEmail,
        centreId: mem.centreId
      });
    }
  };

  const addLedgerAdjustment = (
    centreId: string, 
    amount: number, 
    direction: 'credit' | 'debit', 
    description: string, 
    referenceCode?: string
  ): FinancialLedgerEntry => {
    const newEntry: FinancialLedgerEntry = {
      id: 'led-' + Date.now(),
      entryNumber: ledgerEntries.length + 101,
      centreId,
      entryType: 'adjustment',
      entryDirection: direction,
      amount: Math.abs(amount),
      currency: 'USD',
      description,
      referenceCode: referenceCode || 'ADJ-' + Date.now().toString().slice(-6),
      status: 'posted',
      actorEmail: userProfile?.email || 'admin@yogaconnect.in',
      createdAt: new Date().toISOString()
    };

    setLedgerEntries(prev => [newEntry, ...prev]);

    recordAuditLog('ledger_adjustment_created', 'financial_ledger', newEntry.id, {
      centreId,
      amount,
      direction,
      description,
      referenceCode: newEntry.referenceCode
    });

    return newEntry;
  };

  const getCentreLedgerEntries = (centreId: string): FinancialLedgerEntry[] => {
    return ledgerEntries
      .filter(e => e.centreId === centreId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getCentreFinancialMetrics = (centreId: string, dateRange?: { from?: string; to?: string }): CentreFinancialMetrics => {
    const centreBookings = bookings.filter(b => b.centreId === centreId);
    const centreLedger = ledgerEntries.filter(e => e.centreId === centreId);
    const centrePayoutsList = payouts.filter(p => p.centreId === centreId && p.status === 'paid');

    const totalBookings = centreBookings.length;
    const confirmedBookings = centreBookings.filter(b => b.status === 'confirmed_paid').length;
    const upcomingBookings = centreBookings.filter(b => b.status === 'confirmed_paid' || b.status === 'assigned_to_centre').length;
    const completedBookings = centreBookings.filter(b => b.status === 'confirmed_paid' && new Date(b.startDate) < new Date()).length;
    const cancelledBookings = centreBookings.filter(b => b.status === 'cancelled').length;

    const grossBookingValue = centreLedger
      .filter(e => e.entryType === 'booking_charge' && e.entryDirection === 'credit')
      .reduce((sum, e) => sum + e.amount, 0);

    const platformCommission = centreLedger
      .filter(e => e.entryType === 'platform_commission' && e.entryDirection === 'debit')
      .reduce((sum, e) => sum + e.amount, 0);

    const refunds = centreLedger
      .filter(e => e.entryType === 'refund' && e.entryDirection === 'debit')
      .reduce((sum, e) => sum + e.amount, 0);

    const creditAdjustments = centreLedger
      .filter(e => e.entryType === 'adjustment' && e.entryDirection === 'credit')
      .reduce((sum, e) => sum + e.amount, 0);

    const debitAdjustments = centreLedger
      .filter(e => e.entryType === 'adjustment' && e.entryDirection === 'debit')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalPayoutsCompleted = centrePayoutsList.reduce((sum, p) => sum + p.netPayoutAmount, 0);

    const netAmountPayable = Math.max(0, grossBookingValue - platformCommission - refunds + creditAdjustments - debitAdjustments);
    const outstandingPayableBalance = Math.max(0, netAmountPayable - totalPayoutsCompleted);

    return {
      totalBookings,
      confirmedBookings,
      upcomingBookings,
      completedBookings,
      cancelledBookings,
      grossBookingValue,
      platformCommission,
      refunds,
      netAmountPayable,
      totalPayoutsCompleted,
      outstandingPayableBalance
    };
  };

  const createPayoutBatch = (
    centreId: string, 
    netAmount: number, 
    notes?: string, 
    periodStart?: string, 
    periodEnd?: string
  ): PayoutRecord => {
    const centre = centres.find(c => c.id === centreId);
    const commRate = centre?.commissionRatePercent || 15;
    const grossAmount = Math.round((netAmount / (1 - commRate / 100)) * 100) / 100;
    const commissionDeducted = Math.round((grossAmount - netAmount) * 100) / 100;

    const newPayout: PayoutRecord = {
      id: 'pay-' + Date.now(),
      referenceCode: 'PO-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      centreId,
      centreName: centre?.name || 'Yoga Centre',
      grossAmount,
      commissionDeducted,
      refundsDeducted: 0,
      netPayoutAmount: netAmount,
      currency: 'USD',
      status: 'pending',
      settlementReference: '',
      payoutMethod: 'NEFT Bank Transfer',
      periodStart: periodStart || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
      periodEnd: periodEnd || new Date().toISOString().split('T')[0],
      notes: notes || 'Scheduled escrow payout settlement batch',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPayouts(prev => [newPayout, ...prev]);

    recordAuditLog('payout_batch_created', 'payouts', newPayout.id, {
      centreId,
      referenceCode: newPayout.referenceCode,
      netPayoutAmount: netAmount
    });

    return newPayout;
  };

  const processPayoutSettlement = (payoutId: string, settlementReference: string) => {
    const trimmedRef = settlementReference.trim();
    if (!trimmedRef) {
      return { success: false, error: 'A verified payment/settlement reference (e.g. Bank NEFT / Wire Tx ID) is mandatory.' };
    }

    const payout = payouts.find(p => p.id === payoutId);
    if (!payout) {
      return { success: false, error: 'Payout record not found.' };
    }

    if (payout.status === 'paid') {
      return { success: false, error: 'This payout is already settled and paid.' };
    }

    const updatedPayout: PayoutRecord = {
      ...payout,
      status: 'paid',
      settlementReference: trimmedRef,
      processedBy: userProfile?.id || 'admin-1',
      processedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPayouts(prev => prev.map(p => p.id === payoutId ? updatedPayout : p));

    const ledgerEntry: FinancialLedgerEntry = {
      id: 'led-' + Date.now(),
      entryNumber: ledgerEntries.length + 101,
      centreId: payout.centreId,
      payoutId: payout.id,
      entryType: 'payout',
      entryDirection: 'debit',
      amount: payout.netPayoutAmount,
      currency: payout.currency,
      description: `Settled bank transfer payout (Ref: ${payout.referenceCode}, Settlement Tx: ${trimmedRef})`,
      referenceCode: payout.referenceCode,
      status: 'posted',
      actorEmail: userProfile?.email || 'admin@yogaconnect.in',
      createdAt: new Date().toISOString()
    };

    setLedgerEntries(prev => [ledgerEntry, ...prev]);

    recordAuditLog('payout_settlement_verified', 'payouts', payout.id, {
      centreId: payout.centreId,
      referenceCode: payout.referenceCode,
      netPayoutAmount: payout.netPayoutAmount,
      settlementReference: trimmedRef
    });

    return { success: true };
  };

  const getCentrePayouts = (centreId: string): PayoutRecord[] => {
    return payouts
      .filter(p => p.centreId === centreId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const createFinancialQuery = (centreId: string, subject: string, message: string): FinancialQuery => {
    const centre = centres.find(c => c.id === centreId);
    const newQuery: FinancialQuery = {
      id: 'fq-' + Date.now(),
      centreId,
      centreName: centre?.name || 'Yoga Centre',
      partnerId: userProfile?.id || 'partner-1',
      partnerEmail: userProfile?.email || 'partner@yogaconnect.in',
      subject,
      message,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    setFinancialQueries(prev => [newQuery, ...prev]);

    recordAuditLog('financial_query_raised', 'financial_queries', newQuery.id, {
      centreId,
      subject
    });

    return newQuery;
  };

  const respondToFinancialQuery = (queryId: string, response: string) => {
    setFinancialQueries(prev => prev.map(q => {
      if (q.id === queryId) {
        return {
          ...q,
          status: 'resolved',
          adminResponse: response,
          resolvedAt: new Date().toISOString()
        };
      }
      return q;
    }));

    recordAuditLog('financial_query_resolved', 'financial_queries', queryId, { response });
  };

  const updateCentreProfile = (centreId: string, updates: Partial<YogaCentre>) => {
    // Sanitize updates: partners can update contact, description, photos, facilities, faqs, teachers.
    // Sensitive financial terms (commissionRatePercent, sponsoredRank) require administrative authorization.
    setCentres(prev => prev.map(c => {
      if (c.id === centreId) {
        const safeUpdates = { ...updates };
        if (userRole !== 'admin') {
          delete safeUpdates.commissionRatePercent;
          delete safeUpdates.sponsoredRank;
          delete safeUpdates.isVerified;
        }
        return { ...c, ...safeUpdates };
      }
      return c;
    }));

    recordAuditLog('centre_profile_updated', 'centres', centreId, {
      updatedFields: Object.keys(updates)
    });
  };

  const createBookingRequest = (requestData: Omit<BookingRequest, 'id' | 'referenceCode' | 'createdAt' | 'status'>): BookingRequest => {
    const randomRef = 'YC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const centre = centres.find(c => c.id === requestData.centreId);
    const commRate = centre?.commissionRatePercent || 15;
    const commFee = Math.round((requestData.totalUSD * commRate / 100) * 100) / 100;
    const payout = Math.round((requestData.totalUSD - commFee) * 100) / 100;

    const newBooking: BookingRequest = {
      ...requestData,
      id: 'bk-' + Date.now(),
      referenceCode: randomRef,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending_admin',
      centrePayoutUSD: payout,
      commissionFeeUSD: commFee,
      adminNotes: `New inquiry received. 100% Escrow deposit pending. Centre contractual entitlement: $${payout.toFixed(2)} (${100 - commRate}%).`
    } as any;

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, newStatus: BookingRequest['status'], adminNotes?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        // If status changes to confirmed_paid and no ledger entry yet exists
        if (newStatus === 'confirmed_paid' && b.status !== 'confirmed_paid') {
          const centre = centres.find(c => c.id === b.centreId);
          const commRate = centre?.commissionRatePercent || 15;
          const commAmount = Math.round((b.totalUSD * commRate / 100) * 100) / 100;

          const creditEntry: FinancialLedgerEntry = {
            id: 'led-' + Date.now() + '-1',
            entryNumber: ledgerEntries.length + 101,
            centreId: b.centreId,
            bookingId: b.id,
            entryType: 'booking_charge',
            entryDirection: 'credit',
            amount: b.totalUSD,
            currency: 'USD',
            description: `Gross booking escrow collected for ${b.customerName} (Ref: ${b.referenceCode})`,
            referenceCode: b.referenceCode,
            status: 'posted',
            actorEmail: userProfile?.email || 'admin@yogaconnect.in',
            createdAt: new Date().toISOString()
          };

          const debitEntry: FinancialLedgerEntry = {
            id: 'led-' + Date.now() + '-2',
            entryNumber: ledgerEntries.length + 102,
            centreId: b.centreId,
            bookingId: b.id,
            entryType: 'platform_commission',
            entryDirection: 'debit',
            amount: commAmount,
            currency: 'USD',
            description: `Platform commission (${commRate}%) on Booking ${b.referenceCode}`,
            referenceCode: 'COMM-' + b.referenceCode,
            status: 'posted',
            actorEmail: userProfile?.email || 'admin@yogaconnect.in',
            createdAt: new Date().toISOString()
          };

          setLedgerEntries(l => [creditEntry, debitEntry, ...l]);

          recordAuditLog('booking_escrow_confirmed', 'bookings', b.id, {
            referenceCode: b.referenceCode,
            grossAmount: b.totalUSD,
            commissionAmount: commAmount
          });
        }

        // If status cancelled and was previously confirmed
        if (newStatus === 'cancelled' && b.status === 'confirmed_paid') {
          const netEntitlement = b.centrePayoutUSD || (b.totalUSD * 0.85);
          const refundEntry: FinancialLedgerEntry = {
            id: 'led-' + Date.now() + '-ref',
            entryNumber: ledgerEntries.length + 101,
            centreId: b.centreId,
            bookingId: b.id,
            entryType: 'refund',
            entryDirection: 'debit',
            amount: netEntitlement,
            currency: 'USD',
            description: `Entitlement reversed due to booking cancellation (Ref: ${b.referenceCode})`,
            referenceCode: 'REF-' + b.referenceCode,
            status: 'posted',
            actorEmail: userProfile?.email || 'admin@yogaconnect.in',
            createdAt: new Date().toISOString()
          };
          setLedgerEntries(l => [refundEntry, ...l]);

          recordAuditLog('booking_refund_reversed', 'bookings', b.id, {
            referenceCode: b.referenceCode,
            refundEntitlement: netEntitlement
          });
        }

        return {
          ...b,
          status: newStatus,
          adminNotes: adminNotes ?? b.adminNotes
        };
      }
      return b;
    }));
  };

  const addNewCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const addNewCentre = (centre: YogaCentre) => {
    setCentres(prev => [...prev, centre]);
  };

  const updateEnquiryStatus = async (enquiryId: string, status: CentreEnquiry['status'], internalNotes?: string) => {
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? { 
      ...e, 
      status, 
      internalNotes: internalNotes ?? e.internalNotes, 
      lastContactedAt: new Date().toISOString() 
    } : e));
    await updateEnquiryInDb(enquiryId, {
      status,
      ...(internalNotes !== undefined ? { internal_notes: internalNotes } : {}),
      last_contacted_at: new Date().toISOString()
    });
    return { success: true };
  };

  const submitCustomerEnquiry = async (enquiryData: Omit<CentreEnquiry, 'id' | 'referenceCode' | 'createdAt' | 'status'>) => {
    const newEnq: CentreEnquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      referenceCode: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setEnquiries(prev => [newEnq, ...prev]);
    return newEnq;
  };

  const addCommissionRule = async (ruleData: Omit<CommissionRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRule: CommissionRule = {
      ...ruleData,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCommissionRules(prev => [...prev, newRule]);
    return { success: true };
  };

  const updateCommissionRule = async (id: string, updates: Partial<CommissionRule>) => {
    setCommissionRules(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));
    return { success: true };
  };

  const createVendorInvitation = async (centreId: string, email: string, role: 'owner' | 'manager' | 'accountant' = 'owner') => {
    const token = `inv_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
    const newInv: VendorInvitation = {
      id: `inv-${Date.now()}`,
      centreId,
      email,
      role,
      token,
      status: 'pending',
      expiresAt,
      createdAt: new Date().toISOString()
    };
    setVendorInvitations(prev => [newInv, ...prev]);
    await createVendorInvitationInDb(centreId, email, role, token, expiresAt);
    return { success: true, invitation: newInv };
  };

  const revokeVendorInvitation = async (id: string) => {
    setVendorInvitations(prev => prev.map(i => i.id === id ? { ...i, status: 'revoked' } : i));
    await revokeVendorInvitationInDb(id);
    return { success: true };
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return { success: false, error: 'Not authenticated' };
    const updated: UserProfile = { ...userProfile, ...updates };
    setUserProfile(updated);
    setProfiles(prev => prev.map(p => p.id === updated.id || p.email === updated.email ? { ...p, ...updates } : p));
    if (typeof window !== 'undefined') {
      localStorage.setItem('yogaconnect_user_profile', JSON.stringify(updated));
    }
    await updateProfileInDb(userProfile.id, {
      full_name: updated.fullName,
      avatar_url: updated.avatarUrl,
      phone: updated.phone,
      country: updated.country,
      preferences: updated.preferences
    });
    recordAuditLog('profile_updated', 'profile', userProfile.id, updates);
    return { success: true };
  };

  const updateUserPreferences = async (preferences: UserPreferences) => {
    if (!userProfile) return { success: false, error: 'Not authenticated' };
    const updated: UserProfile = { ...userProfile, preferences };
    setUserProfile(updated);
    setProfiles(prev => prev.map(p => p.id === updated.id || p.email === updated.email ? { ...p, preferences } : p));
    if (typeof window !== 'undefined') {
      localStorage.setItem('yogaconnect_user_profile', JSON.stringify(updated));
    }
    await updateProfileInDb(userProfile.id, { preferences });
    recordAuditLog('preferences_updated', 'user_preferences', userProfile.id, preferences);
    return { success: true };
  };

  const updateUserAccountStatus = async (userId: string, status: 'active' | 'suspended') => {
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, status } : p));
    if (userProfile && userProfile.id === userId) {
      const updated: UserProfile = { ...userProfile, status };
      setUserProfile(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('yogaconnect_user_profile', JSON.stringify(updated));
      }
    }
    await updateProfileInDb(userId, { status });
    recordAuditLog('account_status_changed', 'profile', userId, { newStatus: status });
    return { success: true };
  };

  const requestBookingCancellation = async (bookingId: string, reason?: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return { success: false, error: 'Booking not found' };

    // Update booking in local state and Supabase
    updateBookingStatus(bookingId, 'cancelled', reason || 'Cancellation requested by customer');

    // Add ledger reversal / note if it was previously confirmed
    if (target.centreId) {
      addLedgerAdjustment(
        target.centreId,
        target.totalUSD,
        'debit',
        `Booking cancellation adjustment - Ref #${target.referenceCode}: ${reason || 'Customer requested cancellation'}`,
        target.referenceCode
      );
    }

    recordAuditLog('booking_cancelled', 'booking', bookingId, {
      referenceCode: target.referenceCode,
      reason
    });

    return { success: true };
  };

  // 1. REGISTER YOGA CENTRE (Option A)
  const registerYogaCentre = async (centreData: Partial<YogaCentre> & { ownerName: string; ownerEmail: string; password?: string }) => {
    try {
      const centreId = `centre-${Date.now()}`;
      const slug = (centreData.name || 'yoga-centre').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newCentre: YogaCentre = {
        id: centreId,
        name: centreData.name || 'New Himalayan Yoga Sanctuary',
        slug,
        tagline: centreData.tagline || 'Authentic Yoga, Meditation & Retreats in India',
        location: `${centreData.city || 'Rishikesh'}, ${centreData.state || 'Uttarakhand'}, ${centreData.country || 'India'}`,
        city: centreData.city || 'Rishikesh',
        state: centreData.state || 'Uttarakhand',
        country: centreData.country || 'India',
        description: centreData.description || 'Dedicated authentic yoga sanctuary.',
        coverImage: centreData.coverImage || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
        galleryImages: centreData.galleryImages || ['https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80'],
        rating: 5.0,
        reviewCount: 0,
        startingPriceUSD: centreData.startingPriceUSD || 500,
        foundedYear: centreData.foundedYear || new Date().getFullYear(),
        certification: centreData.certification || 'Yoga Alliance Registered',
        languages: centreData.languages || ['English', 'Hindi'],
        accommodationTypes: centreData.accommodationTypes || ['Standard Ashram Room', 'Private Cottage'],
        mealsIncluded: centreData.mealsIncluded ?? true,
        airportPickup: centreData.airportPickup ?? false,
        teachers: centreData.teachers || [],
        facilities: centreData.facilities || ['Yoga Shala', 'Sattvic Dining', 'Meditation Garden'],
        nearbyAttractions: centreData.nearbyAttractions || ['Sacred River', 'Himalayan Foothills'],
        policies: {
          cancellation: '100% full refund up to 14 days before start date via Escrow.',
          visa: 'Tourist or Yoga/Medical Visa valid for India.',
          dressCode: 'Modest comfortable white or natural fiber yoga clothing.'
        },
        faqs: centreData.faqs || [
          { question: 'Are daily meals provided?', answer: 'Yes, wholesome fresh sattvic meals are prepared daily.' }
        ],
        history: centreData.history || 'Founded with a dedication to preserving authentic Himalayan lineage practices.',
        mapCoords: centreData.mapCoords || { lat: 30.0869, lng: 78.2676 },
        isVerified: false, // PENDING ADMIN APPROVAL (Requirement 2)
        isFeatured: false,
        commissionRatePercent: 12
      };

      // Add to local state
      setCentres(prev => [newCentre, ...prev]);

      // Create owner membership
      const newMembership: CentreMembership = {
        id: `mem-${Date.now()}`,
        userId: `user-${Date.now()}`,
        userEmail: centreData.ownerEmail,
        userName: centreData.ownerName,
        centreId: centreId,
        centreName: newCentre.name,
        role: 'owner',
        status: 'active',
        assignedBy: 'self_registration',
        createdAt: new Date().toISOString()
      };
      setMemberships(prev => [newMembership, ...prev]);

      // Create UserProfile
      const newProfile: UserProfile = {
        id: newMembership.userId,
        email: centreData.ownerEmail,
        fullName: centreData.ownerName,
        role: 'yoga_centre_owner',
        status: 'active',
        assignedCentreId: centreId,
        assignedCentreName: newCentre.name,
        membershipStatus: 'active',
        createdAt: new Date().toISOString()
      };
      setProfiles(prev => [newProfile, ...prev]);
      setUserProfile(newProfile);
      setUserRole('partner');

      // Persist to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('yogaconnect_user_profile', JSON.stringify(newProfile));
      }

      // Sync to live Supabase DB if connected
      await saveCentreProfileInDb(centreId, {
        name: newCentre.name,
        slug: newCentre.slug,
        location: newCentre.location,
        description: newCentre.description,
        contact_email: centreData.ownerEmail,
        contact_phone: centreData.contactPhone,
        address: centreData.address,
        styles: centreData.styles,
        status: 'pending' // Pending admin approval
      });

      recordAuditLog('centre_registered', 'centre', centreId, {
        centreName: newCentre.name,
        ownerEmail: centreData.ownerEmail
      });

      return { success: true, centreId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to register centre' };
    }
  };

  // 2. REGISTER INDIVIDUAL YOGA INSTRUCTOR (Option B)
  const registerYogaInstructor = async (instructorData: Omit<YogaInstructor, 'id' | 'createdAt' | 'status'> & { password?: string }) => {
    try {
      const instructorId = `inst-${Date.now()}`;
      const newInstructor: YogaInstructor = {
        ...instructorData,
        id: instructorId,
        status: 'pending', // PENDING ADMIN APPROVAL (Requirement 3)
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setInstructors(prev => [newInstructor, ...prev]);

      // Create instructor user profile
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        email: instructorData.email,
        fullName: instructorData.fullName,
        role: 'individual_yoga_instructor',
        instructorId,
        status: 'active',
        phone: instructorData.phone,
        country: instructorData.country || 'India',
        createdAt: new Date().toISOString()
      };

      setProfiles(prev => [newProfile, ...prev]);
      setUserProfile(newProfile);
      setUserRole('instructor');

      if (typeof window !== 'undefined') {
        localStorage.setItem('yogaconnect_user_profile', JSON.stringify(newProfile));
      }

      // Sync to Supabase instructors table
      await registerInstructorInDb({
        id: instructorId,
        full_name: instructorData.fullName,
        email: instructorData.email,
        phone: instructorData.phone,
        city: instructorData.city,
        state: instructorData.state,
        country: instructorData.country || 'India',
        profile_photo: instructorData.profilePhoto,
        yoga_styles: instructorData.yogaStyles,
        experience_years: instructorData.experienceYears,
        qualifications: instructorData.qualifications,
        bio: instructorData.bio,
        languages: instructorData.languages,
        online_availability: instructorData.onlineAvailability,
        in_person_availability: instructorData.inPersonAvailability,
        preferred_locations: instructorData.preferredLocations,
        session_types: instructorData.sessionTypes,
        pricing_range: instructorData.pricingRange,
        specializations: instructorData.specializations,
        meditation_experience: instructorData.meditationExperience,
        retreat_experience: instructorData.retreatExperience,
        teaching_hours: instructorData.teachingHours,
        status: 'pending'
      });

      recordAuditLog('instructor_registered', 'instructor', instructorId, {
        name: instructorData.fullName,
        email: instructorData.email
      });

      return { success: true, instructorId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to register instructor' };
    }
  };

  const updateInstructorProfile = async (instructorId: string, updates: Partial<YogaInstructor>) => {
    setInstructors(prev => prev.map(inst => inst.id === instructorId ? { ...inst, ...updates, updatedAt: new Date().toISOString() } : inst));
    await updateInstructorInDb(instructorId, updates);
    recordAuditLog('instructor_updated', 'instructor', instructorId, updates);
    return { success: true };
  };

  const updateInstructorStatus = async (instructorId: string, status: YogaInstructor['status']) => {
    setInstructors(prev => prev.map(inst => inst.id === instructorId ? { 
      ...inst, 
      status, 
      approvedAt: status === 'approved' ? new Date().toISOString() : inst.approvedAt,
      updatedAt: new Date().toISOString() 
    } : inst));
    await updateInstructorInDb(instructorId, { 
      status, 
      approved_at: status === 'approved' ? new Date().toISOString() : null 
    });
    recordAuditLog('instructor_status_changed', 'instructor', instructorId, { newStatus: status });
    return { success: true };
  };

  const submitTeachingEnquiry = async (enquiryData: Omit<TeachingEnquiry, 'id' | 'createdAt' | 'status' | 'platformCommission' | 'instructorNet' | 'paymentStatus'>) => {
    try {
      const enquiryId = `tenq-${Date.now()}`;
      const sessionFee = enquiryData.sessionFee || 50;
      const platformCommission = Math.round(sessionFee * 0.10 * 100) / 100;
      const instructorNet = Math.round((sessionFee - platformCommission) * 100) / 100;

      const newEnquiry: TeachingEnquiry = {
        ...enquiryData,
        id: enquiryId,
        status: 'new',
        sessionFee,
        platformCommission,
        instructorNet,
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTeachingEnquiries(prev => [newEnquiry, ...prev]);

      await createTeachingEnquiryInDb({
        id: enquiryId,
        instructor_id: enquiryData.instructorId,
        customer_name: enquiryData.customerName,
        customer_email: enquiryData.customerEmail,
        customer_phone: enquiryData.customerPhone,
        session_type: enquiryData.sessionType,
        requested_dates: enquiryData.requestedDates,
        participants_count: enquiryData.participantsCount,
        message: enquiryData.message,
        status: 'new',
        session_fee: sessionFee,
        platform_commission: platformCommission,
        instructor_net: instructorNet,
        payment_status: 'unpaid'
      });

      recordAuditLog('teaching_enquiry_submitted', 'teaching_enquiry', enquiryId, {
        instructorId: enquiryData.instructorId,
        customer: enquiryData.customerEmail
      });

      return { success: true, enquiryId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to submit enquiry' };
    }
  };

  const updateTeachingEnquiryStatus = async (enquiryId: string, status: TeachingEnquiry['status'], notes?: string) => {
    setTeachingEnquiries(prev => prev.map(e => e.id === enquiryId ? { 
      ...e, 
      status, 
      instructorNotes: notes !== undefined ? notes : e.instructorNotes,
      updatedAt: new Date().toISOString() 
    } : e));
    await updateTeachingEnquiryInDb(enquiryId, { status, instructor_notes: notes });
    return { success: true };
  };

  const updateTeachingEnquiryPayment = async (enquiryId: string, paymentStatus: TeachingEnquiry['paymentStatus']) => {
    setTeachingEnquiries(prev => prev.map(e => e.id === enquiryId ? { 
      ...e, 
      paymentStatus, 
      updatedAt: new Date().toISOString() 
    } : e));
    await updateTeachingEnquiryInDb(enquiryId, { payment_status: paymentStatus });
    return { success: true };
  };

  // 3. REVIEWS & VERIFIED PRACTITIONER RATINGS
  const submitReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    // Check if the submitter has an authenticated completed booking
    const matchingBooking = bookings.find(
      b => b.centreId === reviewData.centreId && 
           (b.referenceCode === reviewData.bookingRef || 
            (reviewData.authorEmail && b.customerEmail.toLowerCase() === reviewData.authorEmail.toLowerCase())) &&
           b.status === 'completed'
    );

    const isVerified = Boolean(matchingBooking || reviewData.isVerifiedBooking);

    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      isVerifiedBooking: isVerified,
      bookingRef: matchingBooking ? matchingBooking.referenceCode : reviewData.bookingRef
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate centre rating and review count
    setCentres(prevCentres => prevCentres.map(c => {
      if (c.id === reviewData.centreId) {
        const centreReviews = [...reviews.filter(r => r.centreId === c.id), newReview];
        const newAvg = Number((centreReviews.reduce((sum, r) => sum + r.rating, 0) / centreReviews.length).toFixed(1));
        return {
          ...c,
          reviewCount: centreReviews.length,
          rating: newAvg
        };
      }
      return c;
    }));

    recordAuditLog('review_submitted', 'centre', reviewData.centreId, {
      author: reviewData.authorName,
      isVerified,
      rating: reviewData.rating
    });

    return { success: true, review: newReview };
  };

  const getCentreReviews = (centreId: string) => {
    return reviews.filter(r => r.centreId === centreId);
  };

  const refreshDatabaseState = async () => {
    try {
      const [liveCentres, liveCourses, liveBookings, liveEnquiries, liveLedger, livePayouts, liveRules, liveInvites, liveProfiles] = await Promise.all([
        fetchLiveCentres(),
        fetchLiveCourses(),
        fetchLiveBookings(),
        fetchLiveEnquiries(),
        fetchLiveLedger(),
        fetchLivePayouts(),
        fetchLiveCommissionRules(),
        fetchLiveVendorInvitations(),
        fetchLiveProfiles()
      ]);
      if (liveCentres.length > 0) setCentres(liveCentres);
      if (liveCourses.length > 0) setCourses(liveCourses);
      if (liveBookings.length > 0) setBookings(liveBookings);
      if (liveEnquiries.length > 0) setEnquiries(liveEnquiries);
      if (liveLedger.length > 0) setLedgerEntries(liveLedger);
      if (livePayouts.length > 0) setPayouts(livePayouts);
      if (liveRules.length > 0) setCommissionRules(liveRules);
      if (liveInvites.length > 0) setVendorInvitations(liveInvites);
      if (liveProfiles.length > 0) {
        setProfiles(prev => {
          const map = new Map(prev.map(p => [p.id, p]));
          for (const lp of liveProfiles) {
            map.set(lp.id, {
              id: lp.id,
              email: lp.email || '',
              fullName: lp.full_name || '',
              avatarUrl: lp.avatar_url || '',
              phone: lp.phone || '',
              role: lp.role || 'user',
              status: lp.status || 'active',
              preferences: lp.preferences || {},
              createdAt: lp.created_at
            });
          }
          return Array.from(map.values());
        });
      }
    } catch (e) {
      console.warn('Live database state sync fallback:', e);
    }
  };

  return (
    <AppContext.Provider value={{
      brandName,
      setBrandName,
      currency,
      setCurrency,
      formatPrice,
      userRole,
      setUserRole,
      activeView,
      setActiveView,
      selectedCentreId,
      setSelectedCentreId,
      selectedCourseId,
      setSelectedCourseId,
      selectedDestinationSlug,
      setSelectedDestinationSlug,
      selectedBlogSlug,
      setSelectedBlogSlug,
      centres,
      courses,
      bookings,
      wishlist,
      toggleWishlist,
      filters,
      setFilters,
      resetFilters,
      createBookingRequest,
      updateBookingStatus,
      addNewCourse,
      addNewCentre,
      updateCentreProfile,
      isFilterModalOpen,
      setIsFilterModalOpen,
      isBookingModalOpen,
      setIsBookingModalOpen,
      isCourseDrawerOpen,
      setIsCourseDrawerOpen,
      isAIQuizModalOpen,
      setIsAIQuizModalOpen,
      isSchemaModalOpen,
      setIsSchemaModalOpen,
      isAddCentreOpen,
      setIsAddCentreOpen,
      matchmakerConfigs,
      matchmakerLeads,
      matchmakerAnalytics,
      isMatchmakerModalOpen,
      matchmakerCentreId,
      openCentreMatchmaker,
      closeCentreMatchmaker,
      saveCentreMatchmakerConfig,
      toggleCentreMatchmakerEnabled,
      setCentreMatchmakerStatus,
      setAdminMatchmakerDisabled,
      submitMatchmakerEnquiry,
      recordMatchmakerStart,
      recordMatchmakerCompletion,
      isChatOpen,
      setIsChatOpen,
      chatMessages,
      setChatMessages,
      unreadCount,
      setUnreadCount,
      currentUser,
      userProfile,
      isAuthModalOpen,
      setIsAuthModalOpen,
      loginWithGoogle,
      sendOtp,
      verifyOtp,
      loginWithPassword,
      signUpWithPassword,
      resetPassword,
      logout,
      loginAsPersona,
      memberships,
      partnerCentre,
      partnerMembership,
      assignPartnerToCentre,
      updateMembershipStatus,
      removePartnerMembership,
      ledgerEntries,
      addLedgerAdjustment,
      getCentreLedgerEntries,
      getCentreFinancialMetrics,
      payouts,
      createPayoutBatch,
      processPayoutSettlement,
      getCentrePayouts,
      financialQueries,
      createFinancialQuery,
      respondToFinancialQuery,
      auditLogs,
      recordAuditLog,
      enquiries,
      updateEnquiryStatus,
      updateEnquiry: updateEnquiryStatus,
      submitCustomerEnquiry,
      commissionRules,
      addCommissionRule,
      updateCommissionRule,
      vendorInvitations,
      createVendorInvitation,
      revokeVendorInvitation,
      refreshDatabaseState,
      adminDashboardTab,
      setAdminDashboardTab,
      vendorDashboardTab,
      setVendorDashboardTab,
      instructorDashboardTab,
      setInstructorDashboardTab,
      userDashboardTab,
      setUserDashboardTab,
      instructors,
      teachingEnquiries,
      activeInstructor,
      registerYogaCentre,
      registerYogaInstructor,
      updateInstructorProfile,
      updateInstructorStatus,
      submitTeachingEnquiry,
      updateTeachingEnquiryStatus,
      updateTeachingEnquiryPayment,
      profiles,
      updateUserProfile,
      updateUserPreferences,
      updateUserAccountStatus,
      requestBookingCancellation,
      reviews,
      submitReview,
      getCentreReviews
    }}>
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
