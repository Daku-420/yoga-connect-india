export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'INR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateVsUSD: number; // 1 USD = X Currency
  label: string;
}

export type UserRole = 'visitor' | 'user' | 'centre' | 'admin';

export interface Teacher {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo: string;
  experienceYears: number;
  specialties: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type YogaStyle = 
  | 'Hatha'
  | 'Ashtanga'
  | 'Vinyasa'
  | 'Kundalini'
  | 'Yin'
  | 'Kriya'
  | 'Iyengar'
  | 'Ayurveda & Yoga'
  | 'Sound Healing';

export type CourseCategory = 
  | '200h-ttc'
  | '300h-ttc'
  | '500h-ttc'
  | 'meditation'
  | 'ayurveda'
  | 'sound-healing'
  | 'breathwork'
  | 'detox'
  | 'prenatal'
  | 'kids';

export interface DailyScheduleItem {
  time: string;
  activity: string;
}

export interface Course {
  id: string;
  centreId: string;
  centreName: string;
  title: string;
  subtitle: string;
  category: CourseCategory;
  durationDays: number;
  priceUSD: number;
  certification: string;
  syllabus: string[];
  dailySchedule: DailyScheduleItem[];
  mealsIncluded: string;
  accommodationOptions: string[];
  upcomingDates: string[];
  photos: string[];
  videoUrl?: string;
  requirements: string[];
}

export interface YogaCentre {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  location: string;
  city: string;
  state: string;
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string;
  rating: number;
  reviewCount: number;
  startingPriceUSD: number;
  foundedYear: number;
  certification: string; // e.g. "Yoga Alliance USA RYS 200/500"
  languages: string[];
  accommodationTypes: string[];
  mealsIncluded: boolean;
  airportPickup: boolean;
  description: string;
  history: string;
  teachers: Teacher[];
  facilities: string[];
  nearbyAttractions: string[];
  policies: {
    cancellation: string;
    visa: string;
    dressCode: string;
  };
  faqs: FAQItem[];
  mapCoords: {
    lat: number;
    lng: number;
  };
  isFeatured: boolean;
  isVerified: boolean;
  sponsoredRank?: number;
  commissionRatePercent: number;
}

export type BookingStatus = 
  | 'pending_admin' 
  | 'approved_by_admin' 
  | 'assigned_to_centre' 
  | 'confirmed_paid' 
  | 'cancelled';

export interface BookingRequest {
  id: string;
  referenceCode: string;
  centreId: string;
  centreName: string;
  courseId: string;
  courseTitle: string;
  startDate: string;
  durationDays: number;
  participantsCount: number;
  roomType: string;
  airportPickup: boolean;
  totalUSD: number;
  currencyPaid: CurrencyCode;
  
  // Sensitive Customer Data (ONLY visible to Platform Admin & User)
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  specialRequests?: string;
  
  status: BookingStatus;
  createdAt: string;
  adminNotes?: string;
  centrePayoutUSD?: number;
}

export interface Review {
  id: string;
  centreId: string;
  courseName: string;
  authorName: string;
  authorCountry: string;
  authorAvatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  teacherRating: number;
  foodRating: number;
  stayRating: number;
  photos?: string[];
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  coverImage: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  nearbyAirport: string;
  retreatCount: number;
  isUpcoming?: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  readTimeMinutes: number;
  publishedDate: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  relatedCentreIds: string[];
  seoKeywords: string[];
}

export type AsanaCategory = 
  | 'Standing' 
  | 'Seated & Forward Bends' 
  | 'Backbends' 
  | 'Inversions & Arm Balances' 
  | 'Core & Twists' 
  | 'Restorative & Gentle';

export interface YogaAsana {
  id: string;
  sanskritName: string;
  sanskritDevanagari?: string;
  englishName: string;
  pronunciation: string;
  slug: string;
  category: AsanaCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  chakra: string;
  element: string;
  targetMuscles: string[];
  coverImage: string;
  shortDescription: string;
  steps: { stepNumber: number; title: string; instruction: string }[];
  anatomicalBenefits: string[];
  mentalBenefits: string[];
  contraindications: string[];
  breathingCue: string;
  drishti: string;
  recommendedHold: string;
  proTips: string[];
  seoKeywords: string[];
  faqs: { question: string; answer: string }[];
}

export interface FilterState {
  searchLocation: string;
  courseCategory: string;
  minPriceUSD: number;
  maxPriceUSD: number;
  minDays: number;
  maxDays: number;
  style: string;
  skillLevel: string;
  certification: string;
  accommodationType: string;
  mealsIncluded: boolean;
  pickupIncluded: boolean;
  language: string;
}

export interface AIRetreatQuizState {
  intent: 'ttc' | 'spiritual' | 'ayurveda' | 'detox' | 'beginner';
  environment: 'mountains' | 'river' | 'beach' | 'forest';
  duration: '7days' | '14days' | '28days';
  budget: 'budget' | 'comfort' | 'luxury';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export * from './matchmaker';

