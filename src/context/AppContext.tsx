import React, { createContext, useContext, useState } from 'react';
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
  MatchmakerAnalytics
} from '../types';
import { mockCentres } from '../data/mockCentres';
import { mockCourses } from '../data/mockCourses';
import { mockBookings } from '../data/mockBookings';
import { 
  INITIAL_CENTRE_MATCHMAKERS, 
  INITIAL_MATCHMAKER_LEADS, 
  INITIAL_MATCHMAKER_ANALYTICS 
} from '../data/mockMatchmakers';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rateVsUSD: 1.0, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rateVsUSD: 0.92, label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', rateVsUSD: 0.78, label: 'GBP (£)' },
  AUD: { code: 'AUD', symbol: 'A$', rateVsUSD: 1.52, label: 'AUD (A$)' },
  CAD: { code: 'CAD', symbol: 'C$', rateVsUSD: 1.36, label: 'CAD (C$)' },
  INR: { code: 'INR', symbol: '₹', rateVsUSD: 83.50, label: 'INR (₹)' },
};

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

  const createBookingRequest = (requestData: Omit<BookingRequest, 'id' | 'referenceCode' | 'createdAt' | 'status'>): BookingRequest => {
    const randomRef = 'YC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking: BookingRequest = {
      ...requestData,
      id: 'bk-' + Date.now(),
      referenceCode: randomRef,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending_admin',
      adminNotes: 'New traveler inquiry received. Contact details masked from centre until admin approval.'
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, newStatus: BookingRequest['status'], adminNotes?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
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
      setUnreadCount
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
