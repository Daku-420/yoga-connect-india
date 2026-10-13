import { mockCentres } from '../data/mockCentres';
import { mockCourses } from '../data/mockCourses';
import { 
  INITIAL_CENTRE_MATCHMAKERS, 
  INITIAL_MATCHMAKER_ANALYTICS, 
  INITIAL_MATCHMAKER_LEADS 
} from '../data/mockMatchmakers';
import { generateCentreRecommendations } from '../utils/matchmakerEngine';

console.log('--- STARTING CENTRE-SPECIFIC YOGA MATCHMAKER TESTS ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, failureDetails?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    if (failureDetails) console.error(`   Details: ${failureDetails}`);
    process.exitCode = 1;
  }
}

// TEST 1: Two different centres have distinct matchmaker configurations
const c1Config = INITIAL_CENTRE_MATCHMAKERS['centre-1'];
const c2Config = INITIAL_CENTRE_MATCHMAKERS['centre-2'];
assert(
  c1Config && c2Config && c1Config.centreId !== c2Config.centreId,
  'Centres have separate isolated matchmaker configurations'
);
assert(
  c1Config.title !== c2Config.title && c1Config.questions.length !== c2Config.questions.length,
  'Centres have customized centre-specific question counts and titles'
);

// TEST 2: Centre 1 (Parmarth Niketan) Case A - Beginner Gentle Hatha (7 days)
const c1Courses = mockCourses.filter(c => c.centreId === 'centre-1');
const c1AnswersA = {
  'c1-q1': 'c1-opt-beginner',
  'c1-q2': 'c1-exp-beginner',
  'c1-q3': 'c1-dur-7',
  'c1-q4': 'c1-room-private'
};
const result1A = generateCentreRecommendations(c1Courses, c1Config, c1AnswersA);

assert(
  result1A.recommendations.length > 0,
  'Centre 1 returns recommendations for beginner traveler'
);
assert(
  result1A.recommendations[0].course.id === 'course-1b',
  'Centre 1 accurately recommends 7-Day Beginner Hatha Immersion as Top Match',
  `Expected course-1b, got: ${result1A.recommendations[0]?.course.id} (${result1A.recommendations[0]?.course.title})`
);
assert(
  result1A.recommendations[0].badges.includes('Best Match') &&
  result1A.recommendations[0].badges.includes('Best for Beginners'),
  'Top match includes verified "Best Match" and "Best for Beginners" badges'
);

// TEST 3: Centre 1 (Parmarth Niketan) Case B - 200h TTC Aspirant (24 days)
const c1AnswersB = {
  'c1-q1': 'c1-opt-ttc',
  'c1-q2': 'c1-exp-practicing',
  'c1-q3': 'c1-dur-24',
  'c1-q4': 'c1-room-shared'
};
const result1B = generateCentreRecommendations(c1Courses, c1Config, c1AnswersB);

assert(
  result1B.recommendations[0].course.id === 'course-1',
  'Centre 1 accurately recommends 200 Hour Multi-Style TTC for certification seeker',
  `Expected course-1, got: ${result1B.recommendations[0]?.course.id}`
);
assert(
  result1B.recommendations[0].score >= 70,
  'High compatibility score (>= 70) for exact TTC match'
);

// TEST 4: Centre 1 (Parmarth Niketan) Case C - Kundalini & Pranayama Masterclass (14 days)
const c1AnswersC = {
  'c1-q1': 'c1-opt-kundalini',
  'c1-q2': 'c1-exp-practicing',
  'c1-q3': 'c1-dur-14',
  'c1-q4': 'c1-room-private'
};
const result1C = generateCentreRecommendations(c1Courses, c1Config, c1AnswersC);

assert(
  result1C.recommendations[0].course.id === 'course-1c',
  'Centre 1 recommends 14-Day Himalayan Kundalini Masterclass for breathwork inquiry',
  `Expected course-1c, got: ${result1C.recommendations[0]?.course.id}`
);

// TEST 5: Centre 2 (Veda5 Ayurveda) Case A - Doctor-Supervised Panchakarma (14 days)
const c2Courses = mockCourses.filter(c => c.centreId === 'centre-2');
const c2AnswersA = {
  'c2-q1': 'c2-opt-ayurveda',
  'c2-q2': 'c2-dur-14',
  'c2-q3': 'c2-med-yes'
};
const result2A = generateCentreRecommendations(c2Courses, c2Config, c2AnswersA);

assert(
  result2A.recommendations[0].course.id === 'course-2',
  'Centre 2 recommends 14-Day Ayurvedic Panchakarma for medical detox seeker',
  `Expected course-2, got: ${result2A.recommendations[0]?.course.id}`
);

// TEST 6: Centre 2 (Veda5 Ayurveda) Case B - Sound Healing & Dynamic Vinyasa (5 days)
const c2AnswersB = {
  'c2-q1': 'c2-opt-sound',
  'c2-q2': 'c2-dur-5',
  'c2-q3': 'c2-med-no'
};
const result2B = generateCentreRecommendations(c2Courses, c2Config, c2AnswersB);

assert(
  result2B.recommendations[0].course.id === 'course-2b',
  'Centre 2 recommends 5-Day Himalayan Vinyasa & Tibetan Sound Healing for short reset',
  `Expected course-2b, got: ${result2B.recommendations[0]?.course.id}`
);

// TEST 7: Centre Isolation Check (Never recommend another centre's offerings)
const c1RecommendedCentreIds = result1A.recommendations.map(r => r.course.centreId);
assert(
  c1RecommendedCentreIds.every(id => id === 'centre-1'),
  'Centre 1 recommendations strictly contain only Centre 1 courses'
);

const c2RecommendedCentreIds = result2A.recommendations.map(r => r.course.centreId);
assert(
  c2RecommendedCentreIds.every(id => id === 'centre-2'),
  'Centre 2 recommendations strictly contain only Centre 2 courses'
);

// TEST 8: Fallback Alternative Handling when no exact match exists
const emptyCoursesResult = generateCentreRecommendations([], c1Config, c1AnswersA);
assert(
  emptyCoursesResult.needsContactCentre === true && emptyCoursesResult.recommendations.length === 0,
  'Handles empty centre offerings gracefully with contact centre prompt'
);

// TEST 9: Analytics and Conversion Calculation
const c1Stats = INITIAL_MATCHMAKER_ANALYTICS['centre-1'];
const c1LeadsCount = INITIAL_MATCHMAKER_LEADS.filter(l => l.centreId === 'centre-1').length;
const c1CalculatedConvRate = Number(((c1LeadsCount / c1Stats.completionsCount) * 100).toFixed(1));
assert(
  c1CalculatedConvRate > 0 && c1CalculatedConvRate < 100,
  `Analytics conversion rate correctly computed: ${c1CalculatedConvRate}%`
);

console.log(`\n--- ALL TESTS FINISHED: ${passedTests}/${totalTests} PASSED ---`);
if (passedTests === totalTests) {
  console.log('🎉 ALL YOGA MATCHMAKER TESTS PASSED SUCCESSFULLY!');
}
