import { Course } from '../types';
import { 
  CentreMatchmakerConfig, 
  RecommendationScore, 
  MatchmakerQuestion, 
  AnswerOption,
  MatchBadge 
} from '../types/matchmaker';

interface ParsedPreferences {
  goals: string[];
  styles: string[];
  experienceLevel: string;
  durationDays: number | null;
  minDuration: number | null;
  maxDuration: number | null;
  maxBudgetUSD: number | null;
  accommodationRequired: boolean | null;
  requiresMeditation: boolean;
  requiresAyurveda: boolean;
  pace: 'gentle' | 'moderate' | 'challenging' | null;
  userNotes?: string;
}

export function extractPreferences(
  config: CentreMatchmakerConfig,
  answers: Record<string, any>
): ParsedPreferences {
  const prefs: ParsedPreferences = {
    goals: [],
    styles: [],
    experienceLevel: 'all-levels',
    durationDays: null,
    minDuration: null,
    maxDuration: null,
    maxBudgetUSD: null,
    accommodationRequired: null,
    requiresMeditation: false,
    requiresAyurveda: false,
    pace: null,
    userNotes: ''
  };

  config.questions.forEach((q) => {
    const val = answers[q.id];
    if (val === undefined || val === null || val === '') return;

    if (q.type === 'short_text') {
      prefs.userNotes = String(val);
      return;
    }

    // Collect selected option IDs
    const selectedOptionIds = Array.isArray(val) ? val : [val];
    const matchingOptions: AnswerOption[] = q.options.filter(opt => selectedOptionIds.includes(opt.id));

    matchingOptions.forEach((opt) => {
      if (opt.targetGoals) {
        prefs.goals.push(...opt.targetGoals);
      }
      if (opt.targetStyles) {
        prefs.styles.push(...opt.targetStyles);
      }
      if (opt.targetExperienceLevels && opt.targetExperienceLevels.length > 0) {
        prefs.experienceLevel = opt.targetExperienceLevels[0];
      }
      if (opt.targetMinDays !== undefined && opt.targetMinDays !== null) {
        prefs.minDuration = opt.targetMinDays;
      }
      if (opt.targetMaxDays !== undefined && opt.targetMaxDays !== null) {
        prefs.maxDuration = opt.targetMaxDays;
        prefs.durationDays = opt.targetMaxDays;
      }
      if (opt.targetMaxBudgetUSD !== undefined && opt.targetMaxBudgetUSD !== null) {
        prefs.maxBudgetUSD = opt.targetMaxBudgetUSD;
      }
      if (opt.accommodationIncluded !== undefined) {
        prefs.accommodationRequired = opt.accommodationIncluded;
      }
      if (opt.requiresMeditation) {
        prefs.requiresMeditation = true;
      }
      if (opt.requiresAyurveda) {
        prefs.requiresAyurveda = true;
      }
      if (opt.pace) {
        prefs.pace = opt.pace;
      }
    });
  });

  return prefs;
}

export function generateCentreRecommendations(
  centreCourses: Course[],
  config: CentreMatchmakerConfig,
  answers: Record<string, any>
): {
  recommendations: RecommendationScore[];
  summaryMessage: string;
  hasExactMatch: boolean;
  needsContactCentre: boolean;
} {
  // If centre has no published courses
  if (!centreCourses || centreCourses.length === 0) {
    return {
      recommendations: [],
      summaryMessage: `No active classes or retreats currently published for ${config.centreName}. Please contact the ashram team directly for upcoming seasonal intakes.`,
      hasExactMatch: false,
      needsContactCentre: true
    };
  }

  const prefs = extractPreferences(config, answers);

  const scoredCourses: RecommendationScore[] = centreCourses.map((course) => {
    let score = 20; // baseline presence
    const matchReasons: string[] = [];
    const breakdown = {
      styleMatch: false,
      levelMatch: false,
      goalMatch: false,
      budgetMatch: false,
      durationMatch: false,
      accommodationMatch: false
    };

    const courseTitleLower = course.title.toLowerCase();
    const courseSubLower = course.subtitle.toLowerCase();
    const syllabusLower = course.syllabus.map(s => s.toLowerCase()).join(' ');

    // 1. Category & Goal Compatibility (up to 30 points)
    if (prefs.goals.includes('ttc') || prefs.goals.includes('certification')) {
      if (course.category === '200h-ttc' || course.category === '300h-ttc' || course.category === '500h-ttc') {
        score += 30;
        breakdown.goalMatch = true;
        matchReasons.push(`Accredited certification curriculum matching your teacher qualification goal (${course.certification}).`);
      }
    } else if (prefs.goals.includes('ayurveda') || prefs.requiresAyurveda || prefs.goals.includes('detox')) {
      if (course.category === 'ayurveda' || course.category === 'detox' || syllabusLower.includes('ayurved') || syllabusLower.includes('panchakarma')) {
        score += 30;
        breakdown.goalMatch = true;
        matchReasons.push('Doctor-supervised Ayurvedic treatments and detox regimen aligned with your holistic health goal.');
      }
    } else if (prefs.goals.includes('deep_meditation') || prefs.requiresMeditation || prefs.goals.includes('spiritual_growth') || prefs.goals.includes('silence')) {
      if (course.category === 'meditation' || course.category === 'breathwork' || syllabusLower.includes('meditation') || syllabusLower.includes('vipassana') || syllabusLower.includes('silence')) {
        score += 30;
        breakdown.goalMatch = true;
        matchReasons.push('Dedicated contemplative schedule with guided meditation and quietude.');
      }
    } else if (prefs.goals.includes('stress_relief') || prefs.goals.includes('foundations') || prefs.pace === 'gentle') {
      if (course.category === 'meditation' || course.category === 'sound-healing' || course.durationDays <= 14) {
        score += 25;
        breakdown.goalMatch = true;
        matchReasons.push('Gentle restorative pace designed for rejuvenation, stress reset, and body alignment.');
      }
    }

    // 2. Yoga Style Matching (up to 20 points)
    if (prefs.styles.length > 0) {
      const matchingStyle = prefs.styles.find(style => {
        const s = style.toLowerCase();
        return courseTitleLower.includes(s) || courseSubLower.includes(s) || syllabusLower.includes(s);
      });

      if (matchingStyle) {
        score += 20;
        breakdown.styleMatch = true;
        matchReasons.push(`Directly teaches your preferred tradition of ${matchingStyle}.`);
      } else {
        score += 5; // general yoga match
      }
    } else {
      score += 15;
      breakdown.styleMatch = true;
    }

    // 3. Duration Matching (up to 20 points)
    if (prefs.minDuration !== null && prefs.maxDuration !== null) {
      if (course.durationDays >= prefs.minDuration && course.durationDays <= prefs.maxDuration) {
        score += 20;
        breakdown.durationMatch = true;
        matchReasons.push(`Exact duration match: ${course.durationDays} days fits your planned stay window.`);
      } else {
        const diff = Math.min(
          Math.abs(course.durationDays - prefs.minDuration),
          Math.abs(course.durationDays - prefs.maxDuration)
        );
        if (diff <= 3) {
          score += 12;
          breakdown.durationMatch = true;
          matchReasons.push(`Near duration match: ${course.durationDays} days.`);
        } else {
          score += 3;
        }
      }
    } else {
      score += 15;
      breakdown.durationMatch = true;
    }

    // 4. Budget Compatibility (up to 15 points)
    if (prefs.maxBudgetUSD !== null) {
      if (course.priceUSD <= prefs.maxBudgetUSD) {
        score += 15;
        breakdown.budgetMatch = true;
        matchReasons.push(`Within your budget ($${course.priceUSD.toLocaleString()} vs limit of $${prefs.maxBudgetUSD.toLocaleString()}).`);
      } else if (course.priceUSD <= prefs.maxBudgetUSD * 1.15) {
        score += 8;
        matchReasons.push(`Close to your budget target ($${course.priceUSD.toLocaleString()}).`);
      }
    } else {
      score += 10;
      breakdown.budgetMatch = true;
    }

    // 5. Experience Level Match (up to 15 points)
    const reqsLower = course.requirements.map(r => r.toLowerCase()).join(' ');
    if (prefs.experienceLevel === 'beginner') {
      if (reqsLower.includes('all level') || reqsLower.includes('beginner') || reqsLower.includes('no prior') || course.category === 'meditation' || course.durationDays <= 7) {
        score += 15;
        breakdown.levelMatch = true;
        matchReasons.push('Welcoming to beginners with foundational alignment and patient guidance.');
      } else if (course.category === '200h-ttc') {
        score += 5; // TTCs often accept beginners
        matchReasons.push('Intensive curriculum suitable for motivated beginners ready for immersive study.');
      }
    } else if (prefs.experienceLevel === 'advanced') {
      if (course.category === '200h-ttc' || course.category === '300h-ttc' || course.category === 'breathwork' || reqsLower.includes('1 year') || reqsLower.includes('advanced')) {
        score += 15;
        breakdown.levelMatch = true;
        matchReasons.push('Advanced immersion providing deep energetic and teaching depth.');
      }
    } else {
      score += 10;
      breakdown.levelMatch = true;
    }

    // 6. Accommodation & Meals
    if (course.accommodationOptions && course.accommodationOptions.length > 0) {
      breakdown.accommodationMatch = true;
      if (prefs.accommodationRequired) {
        score += 5;
        matchReasons.push(`Includes ${course.accommodationOptions.join(' or ')} on ashram grounds.`);
      }
    }

    // Determine Valid Badges based solely on concrete criteria
    const badges: MatchBadge[] = [];
    if (score >= 70) {
      badges.push('Best Match');
    }
    if (prefs.experienceLevel === 'beginner' && breakdown.levelMatch) {
      badges.push('Best for Beginners');
    }
    if (
      (prefs.goals.includes('deep_meditation') || prefs.requiresMeditation || prefs.goals.includes('silence')) &&
      (course.category === 'meditation' || syllabusLower.includes('meditation'))
    ) {
      badges.push('Best for Meditation');
    }
    if (prefs.maxBudgetUSD && course.priceUSD <= prefs.maxBudgetUSD) {
      badges.push('Best Within Your Budget');
    }

    // Normalize final score out of 100
    const finalScore = Math.min(100, Math.max(30, score));

    return {
      course,
      score: finalScore,
      matchReasons: matchReasons.slice(0, 3), // concise reasons
      badges: badges.slice(0, 2), // up to 2 distinct badges
      compatibilityBreakdown: breakdown,
      isAlternative: finalScore < 60
    };
  });

  // Sort descending by score
  scoredCourses.sort((a, b) => b.score - a.score);

  const topMatch = scoredCourses[0];
  const hasExactMatch = topMatch && topMatch.score >= 60;

  let summaryMessage = '';
  if (hasExactMatch) {
    const preferencesList: string[] = [];
    if (prefs.goals.length > 0) preferencesList.push(prefs.goals[0].replace('_', ' '));
    if (prefs.experienceLevel && prefs.experienceLevel !== 'all-levels') preferencesList.push(`${prefs.experienceLevel}-friendly`);
    if (prefs.durationDays) preferencesList.push(`${prefs.durationDays}-day schedule`);

    summaryMessage = `Based on your preferences${preferencesList.length > 0 ? ` for ${preferencesList.join(', ')}` : ''}, these offerings from ${config.centreName} represent your closest alignment.`;
  } else {
    summaryMessage = `While no offering was an exact 100% match to every single criteria, these closest suitable alternatives from ${config.centreName} share the key elements of your practice goals.`;
  }

  return {
    recommendations: scoredCourses,
    summaryMessage,
    hasExactMatch,
    needsContactCentre: scoredCourses.length === 0
  };
}
