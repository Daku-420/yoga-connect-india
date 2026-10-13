import { Course, CourseCategory, YogaStyle } from './index';

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'dropdown'
  | 'budget_range'
  | 'duration_selection'
  | 'experience_level'
  | 'date_selection'
  | 'short_text';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

export interface AnswerOption {
  id: string;
  label: string;
  description?: string;
  targetStyles?: YogaStyle[];
  targetCategories?: CourseCategory[];
  targetExperienceLevels?: ExperienceLevel[];
  targetGoals?: string[];
  targetMaxBudgetUSD?: number;
  targetMinDays?: number;
  targetMaxDays?: number;
  accommodationIncluded?: boolean;
  requiresMeditation?: boolean;
  requiresAyurveda?: boolean;
  pace?: 'gentle' | 'moderate' | 'challenging';
}

export interface MatchmakerQuestion {
  id: string;
  text: string;
  subtitle?: string;
  type: QuestionType;
  required: boolean;
  options: AnswerOption[];
  order: number;
  conditionalOnQuestionId?: string;
  conditionalOnOptionId?: string;
  attributeCategory?:
    | 'goal'
    | 'experience'
    | 'style'
    | 'format'
    | 'duration'
    | 'intensity'
    | 'holistic'
    | 'stay'
    | 'budget'
    | 'dates'
    | 'custom';
}

export interface CentreMatchmakerConfig {
  id: string;
  centreId: string;
  centreName: string;
  isEnabled: boolean;
  status: 'draft' | 'published' | 'deactivated';
  adminDisabled?: boolean;
  adminDisabledReason?: string;
  title: string;
  description: string;
  customWelcomeMessage?: string;
  questions: MatchmakerQuestion[];
  version: number;
  updatedAt: string;
}

export type MatchBadge =
  | 'Best Match'
  | 'Best for Beginners'
  | 'Best for Meditation'
  | 'Best Within Your Budget';

export interface CompatibilityBreakdown {
  styleMatch: boolean;
  levelMatch: boolean;
  goalMatch: boolean;
  budgetMatch: boolean;
  durationMatch: boolean;
  accommodationMatch: boolean;
}

export interface RecommendationScore {
  course: Course;
  score: number;
  matchReasons: string[];
  badges: MatchBadge[];
  compatibilityBreakdown: CompatibilityBreakdown;
  isAlternative?: boolean;
}

export interface MatchmakerLeadEnquiry {
  id: string;
  referenceCode: string;
  centreId: string;
  centreName: string;
  recommendedCourseId: string;
  recommendedCourseTitle: string;
  customerName: string;
  customerEmail: string;
  customerWhatsApp?: string;
  preferredDates?: string;
  participantsCount: number;
  message?: string;
  summaryPreferences: {
    goal?: string;
    experienceLevel?: string;
    preferredStyle?: string;
    budgetUSD?: number;
    durationDays?: number;
  };
  rawAnswers: Record<string, any>;
  createdAt: string;
  status: 'new' | 'contacted' | 'converted' | 'archived';
}

export interface MatchmakerAnalytics {
  centreId: string;
  startsCount: number;
  completionsCount: number;
  topGoals: { goal: string; count: number }[];
  popularStyles: { style: string; count: number }[];
  requestedExperienceLevels: { level: string; count: number }[];
  topRecommendedOfferings: { courseId: string; title: string; count: number }[];
  enquiriesCount: number;
}
