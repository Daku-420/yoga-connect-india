export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'INR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateVsUSD: number; // 1 USD = X Currency
  label: string;
}

export type UserRole = 
  | 'visitor' 
  | 'user' 
  | 'traveller'
  | 'centre' 
  | 'partner' 
  | 'yoga_centre_owner' 
  | 'instructor' 
  | 'individual_yoga_instructor' 
  | 'admin';

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
  description?: string;
  location?: string;
  category: CourseCategory;
  durationDays: number;
  priceUSD: number;
  certification: string;
  syllabus: string[];
  features?: string[];
  dailySchedule: DailyScheduleItem[];
  mealsIncluded: string;
  accommodationOptions: string[];
  upcomingDates: string[];
  photos: string[];
  image?: string;
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
  image?: string;
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
  status?: 'pending_approval' | 'approved' | 'suspended' | 'rejected';
  address?: string;
  country?: string;
  styles?: string[];
  websiteUrl?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
  };
  operatingHours?: string;
  contactEmail?: string;
  contactPhone?: string;
  bankAccountDetails?: {
    accountHolderName?: string;
    accountHolder?: string;
    bankName?: string;
    accountNumberMasked?: string;
    accountNumber?: string;
    ifscOrSwift?: string;
    ifscCode?: string;
    swiftCode?: string;
    branch?: string;
    isVerified?: boolean;
  };
}

export type BookingStatus = 
  | 'pending_admin' 
  | 'approved_by_admin' 
  | 'assigned_to_centre' 
  | 'confirmed_paid' 
  | 'completed'
  | 'cancelled';

export interface BookingRequest {
  id: string;
  referenceCode: string;
  centreId: string;
  centreName: string;
  courseId: string;
  courseTitle: string;
  startDate: string;
  endDate?: string;
  durationDays: number;
  participantsCount: number;
  roomType: string;
  airportPickup: boolean;
  totalUSD: number;
  totalPriceUSD?: number;
  currencyPaid: CurrencyCode;
  
  // Customer Data (Authorized disclosure rules apply)
  customerName: string;
  guestName?: string;
  customerEmail: string;
  guestEmail?: string;
  customerPhone: string;
  guestPhone?: string;
  customerCountry: string;
  specialRequests?: string;
  specialRequirements?: string;
  vendorNotes?: string;
  paymentStatus?: 'unverified' | 'pending' | 'paid' | 'paid_full' | 'paid_deposit' | 'refunded' | 'disputed';
  
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
  adminNotes?: string;
  centrePayoutUSD?: number;
  commissionFeeUSD?: number;
}

export interface CentreEnquiry {
  id: string;
  referenceCode: string;
  centreId: string;
  centreName?: string;
  courseId?: string;
  courseTitle?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  preferredDates?: string;
  participantsCount: number;
  message: string;
  status: 'new' | 'in_progress' | 'contacted' | 'converted' | 'closed' | 'archived';
  internalNotes?: string;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VendorInvitation {
  id: string;
  centreId: string;
  centreName?: string;
  email: string;
  role: 'owner' | 'manager' | 'accountant';
  token: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  invitedBy?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommissionRule {
  id: string;
  centreId?: string | null;
  centreName?: string;
  courseCategory?: string | null;
  commissionPercent: number;
  fixedFeeUSD: number;
  isActive: boolean;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
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

export type AsanaBodyPosition = 
  | 'Standing' 
  | 'Seated' 
  | 'Forward Folds' 
  | 'Backbends' 
  | 'Twists' 
  | 'Side Bends' 
  | 'Balancing' 
  | 'Arm Balances' 
  | 'Inversions' 
  | 'Supine' 
  | 'Prone' 
  | 'Restorative' 
  | 'Meditation Postures';

// Retain legacy AsanaCategory alias for backward-compatibility
export type AsanaCategory = AsanaBodyPosition | 'Seated & Forward Bends' | 'Inversions & Arm Balances' | 'Core & Twists' | 'Restorative & Gentle';

export type AsanaDifficulty = 
  | 'Beginner' 
  | 'Intermediate' 
  | 'Advanced' 
  | 'Adaptive & Supported';

export type AsanaPracticeIntention = 
  | 'Mobility & Flexibility' 
  | 'Balance & Coordination' 
  | 'Strength & Stability' 
  | 'Relaxation' 
  | 'Meditation' 
  | 'Restorative Practice' 
  | 'Traditional Yoga Practice';

export type AsanaTradition = 
  | 'Hatha' 
  | 'Ashtanga' 
  | 'Iyengar' 
  | 'Vinyasa' 
  | 'Yin' 
  | 'Restorative' 
  | 'Classical Hatha';

export type EditorialStatus = 'draft' | 'under_review' | 'published';

export interface AsanaStep {
  stepNumber: number;
  title: string;
  instruction: string;
}

export interface AsanaMistakeCorrection {
  mistake: string;
  correction: string;
  whyItMatters: string;
}

export interface AsanaVariation {
  name: string;
  type: 'easier' | 'advanced' | 'supported';
  description: string;
  propsUsed?: string[];
}

export interface AsanaReviewer {
  name: string;
  qualification: string;
  traditionOrSchool: string;
  avatar?: string;
  lastReviewedDate: string;
}

export interface AsanaReference {
  title: string;
  sourceType: 'classical_text' | 'peer_reviewed' | 'standard_manual';
  citation: string;
}

export interface YogaAsana {
  id: string;
  sanskritName: string;
  sanskritDevanagari?: string;
  transliterationIast?: string;
  pronunciation: string;
  englishName: string;
  alternativeNames: string[];
  etymology: string;
  historicalContext?: string;
  slug: string;
  category: AsanaCategory;
  bodyPositions: AsanaBodyPosition[];
  difficulty: AsanaDifficulty;
  intentions: AsanaPracticeIntention[];
  traditions: AsanaTradition[];
  chakra: string;
  element: string;
  targetMuscles: string[];
  coverImage: string;
  shortDescription: string;
  equipmentAndPreparation: string[];
  steps: AsanaStep[];
  breathingCue: string;
  alignmentCues: string[];
  commonMistakes: AsanaMistakeCorrection[];
  variations: AsanaVariation[];
  anatomicalBenefits: string[];
  mentalBenefits: string[];
  contraindications: string[];
  safetyDisclaimer: string;
  drishti: string;
  recommendedHold: string;
  proTips: string[];
  faqs: { question: string; answer: string }[];
  relatedAsanaSlugs: string[];
  suggestedSequences: { sequenceName: string; level: string; description: string }[];
  reviewer: AsanaReviewer;
  references: AsanaReference[];
  relatedCentreIds: string[];
  seoKeywords: string[];
  seoTitle?: string;
  seoDescription?: string;
  editorialStatus: EditorialStatus;
  publishedDate?: string;
  lastUpdatedDate?: string;
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

export interface UserPreferences {
  yogaStyle?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  dietaryPreference?: 'sattvic' | 'vegan' | 'vegetarian' | 'regular';
  roomType?: 'private' | 'shared';
  preferredLocation?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  country?: string;
  role?: UserRole;
  assignedCentreId?: string;
  assignedCentreName?: string;
  instructorId?: string;
  membershipStatus?: 'active' | 'suspended' | 'inactive' | 'pending';
  status?: 'active' | 'suspended' | 'inactive' | 'pending' | 'pending_approval';
  preferences?: UserPreferences;
  createdAt?: string;
}

export interface YogaInstructor {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePhoto?: string;
  yogaStyles: string[];
  experienceYears: number;
  qualifications?: string;
  bio?: string;
  languages: string[];
  onlineAvailability: boolean;
  inPersonAvailability: boolean;
  preferredLocations: string[];
  sessionTypes: string[];
  pricingRange?: string;
  specializations?: string[];
  meditationExperience?: string;
  retreatExperience?: string;
  teachingHours?: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TeachingEnquiry {
  id: string;
  instructorId: string;
  instructorName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  sessionType: string;
  requestedDates?: string;
  participantsCount: number;
  message: string;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  sessionFee: number;
  platformCommission: number;
  instructorNet: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  instructorNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CentreMembership {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  centreId: string;
  centreName?: string;
  role: 'owner' | 'manager' | 'accountant';
  status: 'active' | 'suspended' | 'inactive';
  assignedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export type LedgerEntryType = 
  | 'booking_charge' 
  | 'platform_commission' 
  | 'refund' 
  | 'payout' 
  | 'adjustment' 
  | 'fee_reversal' 
  | 'tax_fee';

export type LedgerDirection = 'credit' | 'debit';

export interface FinancialLedgerEntry {
  id: string;
  entryNumber: number;
  centreId: string;
  bookingId?: string;
  payoutId?: string;
  entryType: LedgerEntryType;
  entryDirection: LedgerDirection;
  amount: number;
  amountUSD?: number;
  runningBalanceUSD?: number;
  currency: CurrencyCode;
  description: string;
  referenceCode?: string;
  status: 'posted' | 'pending' | 'reversed';
  actorId?: string;
  actorEmail?: string;
  createdAt: string;
}

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'reversed' | 'processed';

export interface PayoutRecord {
  id: string;
  referenceCode: string;
  centreId: string;
  centreName?: string;
  grossAmount: number;
  commissionDeducted: number;
  refundsDeducted: number;
  netPayoutAmount: number;
  amountUSD?: number;
  currency: CurrencyCode;
  status: PayoutStatus;
  settlementReference?: string;
  bankReference?: string;
  scheduledDate?: string;
  payoutMethod: string;
  periodStart?: string;
  periodEnd?: string;
  notes?: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentRecord {
  id: string;
  bookingId?: string;
  amount: number;
  currency: CurrencyCode;
  paymentMethod: string;
  provider: string;
  providerTransactionId?: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'disputed';
  idempotencyKey?: string;
  createdAt: string;
}

export interface FinancialQuery {
  id: string;
  centreId: string;
  centreName?: string;
  partnerId: string;
  partnerEmail?: string;
  subject: string;
  message: string;
  status: 'open' | 'in_review' | 'resolved';
  adminResponse?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId?: string;
  actorEmail?: string;
  action: string;
  targetEntity: string;
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export * from './matchmaker';



