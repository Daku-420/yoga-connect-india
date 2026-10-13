import { 
  CentreMatchmakerConfig, 
  MatchmakerQuestion, 
  MatchmakerAnalytics, 
  MatchmakerLeadEnquiry 
} from '../types/matchmaker';

export const PREDEFINED_QUESTION_TEMPLATES: Omit<MatchmakerQuestion, 'id' | 'order'>[] = [
  {
    text: 'What is your primary intention or goal for this journey?',
    subtitle: 'Select the primary aspiration driving your visit.',
    type: 'single_choice',
    required: true,
    attributeCategory: 'goal',
    options: [
      {
        id: 'goal-foundations',
        label: 'Build Strong Foundations & Physical Alignment',
        description: 'Focus on correct posture, gentle flexibility, and bodily vitality.',
        targetGoals: ['flexibility', 'foundations', 'alignment'],
        targetCategories: ['meditation', '200h-ttc'],
        targetExperienceLevels: ['beginner', 'intermediate'],
        pace: 'gentle'
      },
      {
        id: 'goal-ttc',
        label: 'Earn an Accredited Yoga Alliance Certification (TTC)',
        description: 'Comprehensive study of anatomy, philosophy, and teaching methodologies.',
        targetGoals: ['certification', 'teaching', 'ttc'],
        targetCategories: ['200h-ttc', '300h-ttc'],
        targetExperienceLevels: ['intermediate', 'advanced', 'all-levels'],
        pace: 'challenging'
      },
      {
        id: 'goal-detox',
        label: 'Ayurvedic Healing & Deep Body Detox',
        description: 'Panchakarma cleansing, dosha rebalancing, and doctor-prescribed nutrition.',
        targetGoals: ['detox', 'healing', 'ayurveda'],
        targetCategories: ['ayurveda', 'detox'],
        requiresAyurveda: true,
        pace: 'gentle'
      },
      {
        id: 'goal-silence',
        label: 'Silent Meditation & Deep Spiritual Stillness',
        description: 'Noble silence (Mauna), Himalayan Kriya, and contemplative retreat.',
        targetGoals: ['spiritual_growth', 'deep_meditation', 'silence'],
        targetCategories: ['meditation', 'breathwork'],
        requiresMeditation: true,
        pace: 'gentle'
      },
      {
        id: 'goal-stress',
        label: 'Stress Relief & Mental Nervous System Reset',
        description: 'Sound therapy, Yoga Nidra, breathwork, and peaceful restorative sessions.',
        targetGoals: ['stress_relief', 'rejuvenation', 'restorative'],
        targetCategories: ['meditation', 'sound-healing', 'breathwork'],
        pace: 'gentle'
      }
    ]
  },
  {
    text: 'What is your current yoga experience level?',
    subtitle: 'This ensures you are matched with the right intensity and prerequisites.',
    type: 'experience_level',
    required: true,
    attributeCategory: 'experience',
    options: [
      {
        id: 'exp-beginner',
        label: 'Complete Beginner / Occasional Practice',
        description: 'Brand new to yoga or looking for a gentle, supportive re-entry.',
        targetExperienceLevels: ['beginner'],
        pace: 'gentle'
      },
      {
        id: 'exp-intermediate',
        label: 'Regular Practitioner (1–3 years)',
        description: 'Familiar with common asanas, breath awareness, and regular flow.',
        targetExperienceLevels: ['intermediate'],
        pace: 'moderate'
      },
      {
        id: 'exp-advanced',
        label: 'Dedicated Sadhaka / Yoga Teacher',
        description: 'Consistent daily practice, seeking advanced breathwork, alignment, or TTC.',
        targetExperienceLevels: ['advanced'],
        pace: 'challenging'
      }
    ]
  },
  {
    text: 'Which yoga styles interest you most?',
    subtitle: 'You can choose more than one style.',
    type: 'multiple_choice',
    required: false,
    attributeCategory: 'style',
    options: [
      {
        id: 'style-hatha',
        label: 'Classical Traditional Hatha',
        description: 'Static holds, alignment precision, and classical breath control.',
        targetStyles: ['Hatha']
      },
      {
        id: 'style-vinyasa',
        label: 'Dynamic Vinyasa Flow',
        description: 'Breath-synchronized fluid transitions and creative movement.',
        targetStyles: ['Vinyasa']
      },
      {
        id: 'style-ashtanga',
        label: 'Ashtanga Yoga Primary Series',
        description: 'Disciplined, structured sequence building physical heat and endurance.',
        targetStyles: ['Ashtanga']
      },
      {
        id: 'style-kundalini',
        label: 'Kundalini & Himalayan Kriya',
        description: 'Energetic chakra awakening, dynamic pranayama, and mantra science.',
        targetStyles: ['Kundalini', 'Kriya']
      },
      {
        id: 'style-ayurveda',
        label: 'Ayurvedic & Restorative Yoga',
        description: 'Gentle, therapeutic practice coordinated with constitutional wellness.',
        targetStyles: ['Ayurveda & Yoga', 'Yin']
      },
      {
        id: 'style-sound',
        label: 'Nada Yoga & Sacred Sound Healing',
        description: 'Vibrational Tibetan singing bowls, gong baths, and chanting.',
        targetStyles: ['Sound Healing']
      }
    ]
  },
  {
    text: 'How long would you like to immerse yourself?',
    subtitle: 'Select your preferred duration of stay.',
    type: 'duration_selection',
    required: true,
    attributeCategory: 'duration',
    options: [
      {
        id: 'dur-short',
        label: 'Short Getaway (3–7 Days)',
        description: 'Ideal for weekend resets, short introductory retreats, and restorative holidays.',
        targetMinDays: 3,
        targetMaxDays: 7
      },
      {
        id: 'dur-medium',
        label: 'Comprehensive Retreat (10–14 Days)',
        description: 'Optimal for thorough Ayurvedic Panchakarma, meditation, or deep sadhana.',
        targetMinDays: 10,
        targetMaxDays: 14
      },
      {
        id: 'dur-long',
        label: 'Full Certification Immersion (21–28 Days)',
        description: 'Required for 200h/300h Yoga Alliance teacher certification programs.',
        targetMinDays: 20,
        targetMaxDays: 30
      }
    ]
  },
  {
    text: 'What is your preferred accommodation arrangement?',
    subtitle: 'Our residential ashrams offer distinct room tiers.',
    type: 'single_choice',
    required: false,
    attributeCategory: 'stay',
    options: [
      {
        id: 'stay-private',
        label: 'Private Deluxe Room with Ensuite Bath',
        description: 'Quiet sanctuary with personal space and dedicated bathroom.',
        accommodationIncluded: true
      },
      {
        id: 'stay-shared',
        label: 'Shared Twin Room (Cost-Effective & Social)',
        description: 'Room with twin beds sharing with another respectful international student.',
        accommodationIncluded: true
      },
      {
        id: 'stay-chalet',
        label: 'Eco Chalet / Panoramic Mountain Suite',
        description: 'Premium valley view, private terrace, and organic amenities.',
        accommodationIncluded: true
      }
    ]
  },
  {
    text: 'What is your approximate budget for the complete package?',
    subtitle: 'Includes tuition, accommodations, and 3 daily sattvic meals.',
    type: 'budget_range',
    required: false,
    attributeCategory: 'budget',
    options: [
      {
        id: 'budget-economy',
        label: 'Under $700 USD',
        description: 'Simple, authentic ashram immersions and short retreats.',
        targetMaxBudgetUSD: 700
      },
      {
        id: 'budget-mid',
        label: '$700 – $1,500 USD',
        description: 'Comprehensive 14-day detox retreats and standard 200h TTCs.',
        targetMaxBudgetUSD: 1500
      },
      {
        id: 'budget-luxury',
        label: '$1,500 – $3,000+ USD',
        description: 'Luxury heritage retreats, private vaidyas, and deluxe suites.',
        targetMaxBudgetUSD: 3500
      }
    ]
  },
  {
    text: 'When are you planning your pilgrimage or retreat?',
    subtitle: 'Let the centre know your estimated arrival window.',
    type: 'dropdown',
    required: false,
    attributeCategory: 'dates',
    options: [
      { id: 'date-next-month', label: 'Within the next 30 days' },
      { id: 'date-autumn-spring', label: 'Peak Season (October – March)' },
      { id: 'date-monsoon-summer', label: 'Quiet Season (April – August)' },
      { id: 'date-flexible', label: 'Flexible / Inquiring about best intake dates' }
    ]
  },
  {
    text: 'Any dietary needs, health considerations, or personal notes?',
    subtitle: 'Optional short note for the ashram acharyas.',
    type: 'short_text',
    required: false,
    attributeCategory: 'custom',
    options: []
  }
];

export const INITIAL_CENTRE_MATCHMAKERS: Record<string, CentreMatchmakerConfig> = {
  'centre-1': {
    id: 'mm-centre-1',
    centreId: 'centre-1',
    centreName: 'Parmarth Niketan Sacred Ganges Ashram',
    isEnabled: true,
    status: 'published',
    title: 'Find Your Perfect Sacred Ganges Journey',
    description: 'Answer 4 quick questions to discover whether our 7-Day Gentle Beginner Immersion, 14-Day Himalayan Kundalini Sadhana, or 200h Yoga Alliance TTC best matches your path.',
    customWelcomeMessage: 'Namaste from the holy banks of the sacred Ganges in Rishikesh. Let us guide you to the authentic practice your soul seeks.',
    version: 2,
    updatedAt: '2026-10-10 14:30',
    questions: [
      {
        id: 'c1-q1',
        text: 'What is your primary spiritual or training goal at Parmarth Niketan?',
        subtitle: 'Our ashram offers distinct lineages from beginner immersion to full RYS certification.',
        type: 'single_choice',
        required: true,
        order: 1,
        attributeCategory: 'goal',
        options: [
          {
            id: 'c1-opt-beginner',
            label: 'Gentle Classical Hatha, River Meditation & Stress Relief',
            description: 'Learn foundational postures, breathwork, and participate in evening Ganga Aarti.',
            targetGoals: ['stress_relief', 'foundations'],
            targetCategories: ['meditation'],
            targetExperienceLevels: ['beginner', 'all-levels'],
            targetMinDays: 7,
            targetMaxDays: 7,
            pace: 'gentle'
          },
          {
            id: 'c1-opt-ttc',
            label: '200 Hour Yoga Alliance Certified Teacher Training',
            description: 'Intensive residential multi-style certification with Patanjali philosophy and anatomy.',
            targetGoals: ['certification', 'ttc'],
            targetCategories: ['200h-ttc'],
            targetExperienceLevels: ['intermediate', 'advanced', 'all-levels'],
            targetMinDays: 20,
            targetMaxDays: 30,
            pace: 'challenging'
          },
          {
            id: 'c1-opt-kundalini',
            label: 'Deep Pranayama Masterclass & Himalayan Kundalini Sadhana',
            description: 'Advanced breath control, shatkriyas, mudras, and Brahma Muhurta river meditation.',
            targetGoals: ['spiritual_growth', 'breathwork'],
            targetCategories: ['breathwork'],
            targetExperienceLevels: ['intermediate', 'advanced'],
            targetMinDays: 14,
            targetMaxDays: 14,
            pace: 'moderate'
          }
        ]
      },
      {
        id: 'c1-q2',
        text: 'What is your experience level with yoga?',
        subtitle: 'We welcome sincere practitioners at all stages.',
        type: 'experience_level',
        required: true,
        order: 2,
        attributeCategory: 'experience',
        options: [
          {
            id: 'c1-exp-beginner',
            label: 'Beginner / Gentle Practitioner',
            description: 'Looking for accessible teaching and calm spiritual guidance.',
            targetExperienceLevels: ['beginner'],
            pace: 'gentle'
          },
          {
            id: 'c1-exp-practicing',
            label: 'Practicing Yogi (1+ Years)',
            description: 'Comfortable with daily asana flows and eager to deepen breathwork and philosophy.',
            targetExperienceLevels: ['intermediate', 'advanced'],
            pace: 'moderate'
          }
        ]
      },
      {
        id: 'c1-q3',
        text: 'How much time do you have available for your stay?',
        subtitle: 'Our programs have structured residential schedules.',
        type: 'duration_selection',
        required: true,
        order: 3,
        attributeCategory: 'duration',
        options: [
          {
            id: 'c1-dur-7',
            label: '1 Week (7 Days)',
            description: 'Matches our 7-Day Classical Hatha Beginner Immersion ($480).',
            targetMinDays: 7,
            targetMaxDays: 7,
            targetMaxBudgetUSD: 500
          },
          {
            id: 'c1-dur-14',
            label: '2 Weeks (14 Days)',
            description: 'Matches our 14-Day Himalayan Kundalini & Pranayama Masterclass ($850).',
            targetMinDays: 14,
            targetMaxDays: 14,
            targetMaxBudgetUSD: 900
          },
          {
            id: 'c1-dur-24',
            label: '3–4 Weeks (24 Days)',
            description: 'Matches our comprehensive 200h Yoga Alliance TTC ($1,250).',
            targetMinDays: 20,
            targetMaxDays: 30,
            targetMaxBudgetUSD: 1400
          }
        ]
      },
      {
        id: 'c1-q4',
        text: 'Which room type do you prefer in the ashram?',
        subtitle: 'All stays include 3 daily organic vegetarian meals and Ganges access.',
        type: 'single_choice',
        required: false,
        order: 4,
        attributeCategory: 'stay',
        options: [
          {
            id: 'c1-room-private',
            label: 'Private Deluxe Ashram Room',
            description: 'Quiet room with attached ensuite Western bathroom and river breeze.',
            accommodationIncluded: true
          },
          {
            id: 'c1-room-shared',
            label: 'Shared Twin Cottage',
            description: 'Twin beds sharing with an international student of the same gender.',
            accommodationIncluded: true
          }
        ]
      }
    ]
  },
  'centre-2': {
    id: 'mm-centre-2',
    centreId: 'centre-2',
    centreName: 'Veda5 Himalayan Ayurveda & Yoga Sanctuary',
    isEnabled: true,
    status: 'published',
    title: 'Discover Your Himalayan Wellness & Healing Retreat',
    description: 'Find out whether our 14-Day Doctor-Supervised Panchakarma Immersion or 5-Day Weekend Sound Healing Retreat aligns best with your health priorities.',
    customWelcomeMessage: 'Welcome to Veda5. Our Chief Ayurvedic Vaidya and Yoga Masters look forward to curating your rejuvenation.',
    version: 1,
    updatedAt: '2026-10-11 09:15',
    questions: [
      {
        id: 'c2-q1',
        text: 'What is your primary wellness goal?',
        subtitle: 'Tell us how you would like to nourish your mind and body.',
        type: 'single_choice',
        required: true,
        order: 1,
        attributeCategory: 'goal',
        options: [
          {
            id: 'c2-opt-ayurveda',
            label: 'Deep Ayurvedic Panchakarma & Medical Detox',
            description: 'Daily Shirodhara, Abhyanga, pulse diagnosis, and dosha-tailored cuisine.',
            targetGoals: ['detox', 'healing', 'ayurveda'],
            targetCategories: ['ayurveda'],
            requiresAyurveda: true,
            targetMinDays: 14,
            targetMaxDays: 14,
            pace: 'gentle'
          },
          {
            id: 'c2-opt-sound',
            label: 'Dynamic Vinyasa Flow & Tibetan Sound Healing',
            description: 'Energizing morning flows, singing bowl therapy, and waterfall nature walks.',
            targetGoals: ['stress_relief', 'rejuvenation'],
            targetCategories: ['sound-healing'],
            targetMinDays: 5,
            targetMaxDays: 7,
            pace: 'moderate'
          }
        ]
      },
      {
        id: 'c2-q2',
        text: 'How long can you dedicate to this retreat?',
        subtitle: 'Panchakarma requires minimum 14 days for systemic detoxification.',
        type: 'duration_selection',
        required: true,
        order: 2,
        attributeCategory: 'duration',
        options: [
          {
            id: 'c2-dur-5',
            label: '5 Days (Short Weekend Reset)',
            description: 'Perfect for our 5-Day Sound Healing & Vinyasa retreat ($620).',
            targetMinDays: 5,
            targetMaxDays: 5
          },
          {
            id: 'c2-dur-14',
            label: '14 Days (Doctor-Supervised Panchakarma)',
            description: 'Complete constitutional cleansing and restorative yoga ($1,480).',
            targetMinDays: 14,
            targetMaxDays: 14
          }
        ]
      },
      {
        id: 'c2-q3',
        text: 'Do you require an in-depth physician consultation?',
        subtitle: 'Our NABH-certified wing includes BAMS Ayurvedic doctors.',
        type: 'single_choice',
        required: false,
        order: 3,
        attributeCategory: 'holistic',
        options: [
          {
            id: 'c2-med-yes',
            label: 'Yes, full pulse reading & customized herbal plan',
            description: 'Included in our 14-Day Panchakarma immersion.',
            requiresAyurveda: true
          },
          {
            id: 'c2-med-no',
            label: 'Just general holistic wellness and sound baths',
            description: 'Included in our 5-Day retreat.'
          }
        ]
      }
    ]
  },
  'centre-3': {
    id: 'mm-centre-3',
    centreId: 'centre-3',
    centreName: 'Uttarkashi Himalayan Hermitage & Tapasya Ashram',
    isEnabled: true,
    status: 'published',
    title: 'Find Your High Himalayan Sadhana',
    description: 'Explore whether our 10-Day Silent Meditation & Kundalini Retreat or 5-Day River Sadhana best suits your calling for deep mountain solitude.',
    version: 1,
    updatedAt: '2026-10-09 11:20',
    questions: [
      {
        id: 'c3-q1',
        text: 'Are you ready for Noble Silence (Mauna)?',
        subtitle: 'Our 10-day retreat observes silence for contemplative awakening.',
        type: 'single_choice',
        required: true,
        order: 1,
        attributeCategory: 'goal',
        options: [
          {
            id: 'c3-opt-silence',
            label: 'Yes, I seek deep silent meditation and Vipassana',
            description: 'Matches our 10-Day Silent Kundalini Retreat ($980).',
            targetCategories: ['meditation'],
            targetMinDays: 10,
            targetMaxDays: 10
          },
          {
            id: 'c3-opt-pranayama',
            label: 'Prefer gentle river breathwork without strict silence',
            description: 'Matches our 5-Day High-Altitude River Sadhana ($420).',
            targetCategories: ['breathwork'],
            targetMinDays: 5,
            targetMaxDays: 5
          }
        ]
      }
    ]
  },
  'centre-4': {
    id: 'mm-centre-4',
    centreId: 'centre-4',
    centreName: 'Ananda in the Himalayas Retreat Estate',
    isEnabled: true,
    status: 'published',
    title: 'Curate Your Bespoke Luxury Himalayan Experience',
    description: 'Match with personalized one-on-one yoga, Ayurvedic hydrotherapy, and Vedantic mind management.',
    version: 1,
    updatedAt: '2026-10-08 17:00',
    questions: [
      {
        id: 'c4-q1',
        text: 'What is your primary wellness focus?',
        subtitle: 'Each guest receives a bespoke private itinerary.',
        type: 'single_choice',
        required: true,
        order: 1,
        attributeCategory: 'goal',
        options: [
          {
            id: 'c4-opt-stress',
            label: 'Stress Management, Adrenal Reset & Spa Hydrotherapy',
            description: '7-Day luxury retreat with private Bihar School Hatha and counseling ($2,400).',
            targetGoals: ['stress_relief', 'rejuvenation'],
            targetCategories: ['meditation'],
            targetMinDays: 7,
            targetMaxDays: 7
          }
        ]
      }
    ]
  }
};

export const INITIAL_MATCHMAKER_ANALYTICS: Record<string, MatchmakerAnalytics> = {
  'centre-1': {
    centreId: 'centre-1',
    startsCount: 42,
    completionsCount: 35,
    topGoals: [
      { goal: 'Foundational Classical Hatha', count: 18 },
      { goal: '200h Yoga Alliance TTC', count: 11 },
      { goal: 'Pranayama & Kundalini Sadhana', count: 6 }
    ],
    popularStyles: [
      { style: 'Classical Hatha', count: 24 },
      { style: 'Pranayama Breathwork', count: 19 },
      { style: 'Ashtanga', count: 10 }
    ],
    requestedExperienceLevels: [
      { level: 'Beginner', count: 20 },
      { level: 'Intermediate', count: 12 },
      { level: 'Advanced / Teacher', count: 3 }
    ],
    topRecommendedOfferings: [
      { courseId: 'course-1b', title: '7-Day Classical Hatha & Sacred Ganges Beginner Immersion', count: 19 },
      { courseId: 'course-1', title: '200 Hour Multi-Style Yoga Teacher Training (TTC)', count: 10 },
      { courseId: 'course-1c', title: '14-Day Himalayan Kundalini Sadhana & Pranayama Masterclass', count: 6 }
    ],
    enquiriesCount: 9
  },
  'centre-2': {
    centreId: 'centre-2',
    startsCount: 28,
    completionsCount: 24,
    topGoals: [
      { goal: 'Ayurvedic Panchakarma & Detox', count: 15 },
      { goal: 'Sound Healing & Vinyasa', count: 9 }
    ],
    popularStyles: [
      { style: 'Ayurveda & Yoga', count: 18 },
      { style: 'Sound Healing', count: 14 },
      { style: 'Vinyasa', count: 11 }
    ],
    requestedExperienceLevels: [
      { level: 'Beginner / Restorative', count: 16 },
      { level: 'Intermediate', count: 8 }
    ],
    topRecommendedOfferings: [
      { courseId: 'course-2', title: '14-Day Ayurvedic Panchakarma & Restorative Yoga Immersion', count: 15 },
      { courseId: 'course-2b', title: '5-Day Himalayan Vinyasa Flow & Tibetan Sound Healing Retreat', count: 9 }
    ],
    enquiriesCount: 6
  },
  'centre-3': {
    centreId: 'centre-3',
    startsCount: 16,
    completionsCount: 14,
    topGoals: [
      { goal: 'Silent Meditation & Vipassana', count: 9 },
      { goal: 'High-Altitude River Sadhana', count: 5 }
    ],
    popularStyles: [
      { style: 'Meditation & Mauna', count: 10 },
      { style: 'Himalayan Kriya', count: 7 }
    ],
    requestedExperienceLevels: [
      { level: 'Intermediate', count: 9 },
      { level: 'Beginner', count: 5 }
    ],
    topRecommendedOfferings: [
      { courseId: 'course-3', title: '10-Day Silent Meditation & Himalayan Kundalini Retreat', count: 9 },
      { courseId: 'course-3b', title: '5-Day High-Altitude River Sadhana & Pranayama Immersion', count: 5 }
    ],
    enquiriesCount: 3
  },
  'centre-4': {
    centreId: 'centre-4',
    startsCount: 19,
    completionsCount: 17,
    topGoals: [
      { goal: 'Luxury Stress Management & Spa Hydrotherapy', count: 17 }
    ],
    popularStyles: [
      { style: 'Bihar School Hatha', count: 15 },
      { style: 'Yoga Nidra', count: 14 }
    ],
    requestedExperienceLevels: [
      { level: 'All Levels', count: 17 }
    ],
    topRecommendedOfferings: [
      { courseId: 'course-4', title: '7-Day Luxury Himalayan Yoga & Stress Management Retreat', count: 17 }
    ],
    enquiriesCount: 4
  }
};

export const INITIAL_MATCHMAKER_LEADS: MatchmakerLeadEnquiry[] = [
  {
    id: 'lead-1',
    referenceCode: 'MM-YC-2026-8812',
    centreId: 'centre-1',
    centreName: 'Parmarth Niketan Sacred Ganges Ashram',
    recommendedCourseId: 'course-1b',
    recommendedCourseTitle: '7-Day Classical Hatha & Sacred Ganges Beginner Immersion',
    customerName: 'Emma Watson-Reid',
    customerEmail: 'emma.reid.travel@gmail.com',
    customerWhatsApp: '+44 7911 123456',
    preferredDates: 'Nov 15 – Nov 22, 2026',
    participantsCount: 1,
    message: 'I am traveling alone from London for my first time in India. Seeking calm river meditation and gentle posture alignment.',
    summaryPreferences: {
      goal: 'Gentle Classical Hatha, River Meditation & Stress Relief',
      experienceLevel: 'Beginner',
      preferredStyle: 'Hatha & Meditation',
      budgetUSD: 500,
      durationDays: 7
    },
    rawAnswers: {
      'c1-q1': 'c1-opt-beginner',
      'c1-q2': 'c1-exp-beginner',
      'c1-q3': 'c1-dur-7',
      'c1-q4': 'c1-room-private'
    },
    createdAt: '2026-10-12 11:42',
    status: 'new'
  },
  {
    id: 'lead-2',
    referenceCode: 'MM-YC-2026-8813',
    centreId: 'centre-1',
    centreName: 'Parmarth Niketan Sacred Ganges Ashram',
    recommendedCourseId: 'course-1',
    recommendedCourseTitle: '200 Hour Multi-Style Yoga Teacher Training (TTC)',
    customerName: 'Marcus Lindqvist',
    customerEmail: 'm.lindqvist@nordicyoga.se',
    customerWhatsApp: '+46 70 174 0600',
    preferredDates: 'Jan 5 – Jan 29, 2027',
    participantsCount: 1,
    message: 'Registered yoga student with 3 years practice in Stockholm. Eager for Yoga Alliance USA certification along the holy Ganges.',
    summaryPreferences: {
      goal: '200 Hour Yoga Alliance Certified Teacher Training',
      experienceLevel: 'Practicing Yogi (1+ Years)',
      preferredStyle: 'Ashtanga & Classical Hatha',
      budgetUSD: 1300,
      durationDays: 24
    },
    rawAnswers: {
      'c1-q1': 'c1-opt-ttc',
      'c1-q2': 'c1-exp-practicing',
      'c1-q3': 'c1-dur-24',
      'c1-q4': 'c1-room-shared'
    },
    createdAt: '2026-10-11 16:20',
    status: 'contacted'
  },
  {
    id: 'lead-3',
    referenceCode: 'MM-YC-2026-8814',
    centreId: 'centre-2',
    centreName: 'Veda5 Himalayan Ayurveda & Yoga Sanctuary',
    recommendedCourseId: 'course-2',
    recommendedCourseTitle: '14-Day Ayurvedic Panchakarma & Restorative Yoga Immersion',
    customerName: 'Clara Schmitt',
    customerEmail: 'clara.schmitt@munich-wellness.de',
    customerWhatsApp: '+49 171 9876543',
    preferredDates: 'Dec 5 – Dec 19, 2026',
    participantsCount: 2,
    message: 'Coming with my partner for deep Ayurvedic constitutional detox and stress reset.',
    summaryPreferences: {
      goal: 'Deep Ayurvedic Panchakarma & Medical Detox',
      experienceLevel: 'Beginner / Restorative',
      preferredStyle: 'Ayurveda & Gentle Yoga',
      budgetUSD: 1600,
      durationDays: 14
    },
    rawAnswers: {
      'c2-q1': 'c2-opt-ayurveda',
      'c2-q2': 'c2-dur-14',
      'c2-q3': 'c2-med-yes'
    },
    createdAt: '2026-10-12 18:05',
    status: 'new'
  }
];
