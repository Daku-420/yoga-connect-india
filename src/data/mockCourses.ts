import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    centreId: 'centre-1',
    centreName: 'Parmarth Niketan Sacred Ganges Ashram',
    title: '200 Hour Multi-Style Yoga Teacher Training (TTC)',
    subtitle: 'Yoga Alliance USA Certified Residential Certification in Sacred Rishikesh',
    category: '200h-ttc',
    durationDays: 24,
    priceUSD: 1250,
    certification: 'Yoga Alliance USA RYS 200',
    syllabus: [
      'Classical Hatha & Ashtanga Primary Series Asanas',
      'Pranayama, Shatkriyas & Himalayan Breath Control',
      'Patanjali Yoga Sutras & Bhagavad Gita Philosophy',
      'Functional Yogic Anatomy, Biomechanics & Adjustments',
      'Sequencing, Cueing & Practical Teaching Practicum'
    ],
    dailySchedule: [
      { time: '05:30 AM', activity: 'Morning Bell & Herbal Detox Tea' },
      { time: '06:00 AM', activity: 'Pranayama, Mantra Chanting & Meditation' },
      { time: '07:30 AM', activity: 'Traditional Hatha Yoga Asana Practice' },
      { time: '09:30 AM', activity: 'Nutritious Sattvic Organic Breakfast' },
      { time: '11:00 AM', activity: 'Yoga Philosophy & Sutra Discourses' },
      { time: '01:00 PM', activity: 'Ayurvedic Lunch & Rest' },
      { time: '03:30 PM', activity: 'Functional Anatomy & Alignment Lab' },
      { time: '05:00 PM', activity: 'Ashtanga Vinyasa Flow & Teaching Practicum' },
      { time: '07:00 PM', activity: 'Sacred Parmarth Ganga Aarti by the River' },
      { time: '08:00 PM', activity: 'Light Sattvic Dinner & Silent Reflection' }
    ],
    mealsIncluded: '3 Fresh Sattvic Organic Vegetarian Meals Daily',
    accommodationOptions: ['Private Deluxe Ashram Room', 'Shared Twin Cottage'],
    upcomingDates: ['Oct 1, 2026', 'Nov 1, 2026', 'Dec 1, 2026', 'Jan 5, 2027'],
    photos: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'
    ],
    requirements: [
      'Open to all levels from dedicated beginners to seasoned practitioners',
      'Commitment to abstaining from alcohol, smoking, and non-vegetarian food on ashram premises'
    ]
  },
  {
    id: 'course-2',
    centreId: 'centre-2',
    centreName: 'Veda5 Himalayan Ayurveda & Yoga Sanctuary',
    title: '14-Day Ayurvedic Panchakarma & Restorative Yoga Immersion',
    subtitle: 'Doctor-Supervised Himalayan Detox, Dosha Rebalancing & Daily Sunset Yoga',
    category: 'ayurveda',
    durationDays: 14,
    priceUSD: 1480,
    certification: 'NABH Hospital & Yoga Alliance Continuing Education (YACEP)',
    syllabus: [
      'Comprehensive Pulse Diagnosis & Prakriti/Vikriti Assessment',
      'Daily Abhyanga, Shirodhara, and Swedana Body Purification',
      'Gentle Restorative Hatha & Therapeutic Yin Yoga',
      'Pranayama for Nervous System Down-Regulation',
      'Personalized Herbal Formulations & Sattvic Dietary Plan'
    ],
    dailySchedule: [
      { time: '06:30 AM', activity: 'Gentle Himalayan Sunrise Asana & Pranayama' },
      { time: '08:30 AM', activity: 'Bespoke Dosha-Tailored Breakfast' },
      { time: '10:00 AM', activity: 'Doctor Consultation & Panchakarma Therapies' },
      { time: '01:00 PM', activity: 'Organic Farm-to-Table Lunch' },
      { time: '04:00 PM', activity: 'Yoga Nidra & Guided Sound Meditation' },
      { time: '06:00 PM', activity: 'Ayurvedic Cooking & Wellness Workshop' },
      { time: '07:30 PM', activity: 'Nourishing Warm Herbal Dinner' }
    ],
    mealsIncluded: '3 Doctor-Prescribed Organic Meals Tailored to Your Dosha',
    accommodationOptions: ['Mountain View Balcony Suite', 'Single Eco Chalet'],
    upcomingDates: ['Oct 15, 2026', 'Nov 10, 2026', 'Dec 5, 2026'],
    photos: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'
    ],
    requirements: ['No prior yoga experience needed. All age groups welcomed.']
  },
  {
    id: 'course-3',
    centreId: 'centre-3',
    centreName: 'Uttarkashi Himalayan Hermitage & Tapasya Ashram',
    title: '10-Day Silent Meditation & Himalayan Kundalini Retreat',
    subtitle: 'Deep Contemplative Silence, River Sadhana & Kriya Breathwork along the Bhagirathi',
    category: 'meditation',
    durationDays: 10,
    priceUSD: 980,
    certification: 'Traditional Himalayan Hermitage Sadhana Certificate',
    syllabus: [
      'Vipassana Awareness & Noble Silence (Mauna)',
      'Himalayan Kriya Yoga & Chakra Activation Techniques',
      'Bhagirathi River Walking Meditation & Breathwork',
      'Sanskrit Mantra Science & Japa Practice',
      'Vedantic Contemplation on Self-Inquiry (Atma Vichara)'
    ],
    dailySchedule: [
      { time: '05:00 AM', activity: 'Wake Up Bell & Morning Japa' },
      { time: '05:30 AM', activity: 'Silent Sitting Meditation in Cave Pavilion' },
      { time: '07:00 AM', activity: 'Himalayan Kriya & Classical Hatha' },
      { time: '08:45 AM', activity: 'Mindful Silent Breakfast' },
      { time: '11:00 AM', activity: 'Vedic Philosophy Discourse & Q&A' },
      { time: '01:00 PM', activity: 'Hermitage Lunch & Rest' },
      { time: '04:30 PM', activity: 'Pranayama & Riverfront Breath Meditation' },
      { time: '06:30 PM', activity: 'Sunset Kirtan & Sacred Fire Chanting' },
      { time: '07:30 PM', activity: 'Simple Ashram Soup & Herbal Tea' }
    ],
    mealsIncluded: '3 Simple Himalayan Organic Farm Meals Daily',
    accommodationOptions: ['River View Stone Cottage', 'Quiet Hermitage Cell'],
    upcomingDates: ['Oct 20, 2026', 'Nov 15, 2026', 'Dec 10, 2026'],
    photos: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
    requirements: ['Commitment to practicing Noble Silence during designated days.']
  },
  {
    id: 'course-4',
    centreId: 'centre-4',
    centreName: 'Ananda in the Himalayas Retreat Estate',
    title: '7-Day Luxury Himalayan Yoga & Stress Management Retreat',
    subtitle: 'Bespoke Private Yoga Sessions, Vedantic Counseling & Hydrotherapy Spa Immersion',
    category: 'meditation',
    durationDays: 7,
    priceUSD: 2400,
    certification: 'Ananda Holistic Wellness Certification',
    syllabus: [
      'One-on-One Bihar School Hatha Posture & Alignment Training',
      'Personalized Pranayama for Stress & Adrenal Reset',
      'Guided Yoga Nidra & Chakra Sound Healing',
      'Ancient Vedanta Mind-Management Sessions with Resident Acharyas',
      'Hydrotherapy, Aromatherapy & Ayurvedic Body Massages'
    ],
    dailySchedule: [
      { time: '07:00 AM', activity: 'Sunrise Asana in Himalayan Ridge Pavilion' },
      { time: '08:30 AM', activity: 'Organic Gourmet Spa Breakfast' },
      { time: '10:30 AM', activity: 'Private Hydrotherapy & Massage Treatment' },
      { time: '01:00 PM', activity: 'Wellness Cuisine Lunch' },
      { time: '03:30 PM', activity: 'Vedanta Interactive Lecture' },
      { time: '05:30 PM', activity: 'Yoga Nidra Deep Relaxation' },
      { time: '07:30 PM', activity: 'Chef\'s 4-Course Light Ayurvedic Dinner' }
    ],
    mealsIncluded: 'Gourmet Organic Wellness Breakfast, Lunch & Dinner Daily',
    accommodationOptions: ['Palace View Deluxe Room', 'Private Valley Villa'],
    upcomingDates: ['Weekly arrivals every Sunday throughout 2026-2027'],
    photos: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    requirements: ['Suitable for all fitness and practice levels.']
  },
  {
    id: 'course-1b',
    centreId: 'centre-1',
    centreName: 'Parmarth Niketan Sacred Ganges Ashram',
    title: '7-Day Classical Hatha & Sacred Ganges Beginner Immersion',
    subtitle: 'Gentle Alignment, Daily River Meditation & Ashram Living for Beginners',
    category: 'meditation',
    durationDays: 7,
    priceUSD: 480,
    certification: 'Ashram Completion Certificate',
    syllabus: [
      'Fundamental Classical Hatha Postures (Asanas) with props and gentle alignment',
      'Gentle Breath Awareness & Anulom Vilom Pranayama',
      'Daily Sunset Ganga Aarti participation and river contemplation',
      'Introduction to Yoga Philosophy & Mindful Ashram Living',
      'Evening Kirtan & Guided Sound Healing'
    ],
    dailySchedule: [
      { time: '06:00 AM', activity: 'Morning Herbal Tea & Temple Bells' },
      { time: '06:30 AM', activity: 'Gentle Morning Hatha & Breath Practice' },
      { time: '08:30 AM', activity: 'Fresh Sattvic Organic Breakfast' },
      { time: '11:00 AM', activity: 'Spiritual Lecture & Ashram Walking Tour' },
      { time: '01:00 PM', activity: 'Organic Vegetarian Lunch' },
      { time: '04:30 PM', activity: 'Restorative Yoga & Guided Relaxation' },
      { time: '06:30 PM', activity: 'Sacred Parmarth Ganga Aarti by the Water' },
      { time: '08:00 PM', activity: 'Warm Ashram Dinner' }
    ],
    mealsIncluded: '3 Fresh Sattvic Organic Vegetarian Meals Daily',
    accommodationOptions: ['Private Deluxe Ashram Room', 'Shared Twin Cottage'],
    upcomingDates: ['Every Sunday arrival throughout 2026-2027'],
    photos: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80'
    ],
    requirements: ['Ideal for beginners and those seeking mental reset and gentle practice.']
  },
  {
    id: 'course-1c',
    centreId: 'centre-1',
    centreName: 'Parmarth Niketan Sacred Ganges Ashram',
    title: '14-Day Himalayan Kundalini Sadhana & Pranayama Masterclass',
    subtitle: 'Advanced Chakra Energetics, Kriya Breathwork & Patanjali Sutra Immersion',
    category: 'breathwork',
    durationDays: 14,
    priceUSD: 850,
    certification: 'Yoga Alliance Continuing Education (YACEP 100h)',
    syllabus: [
      'Advanced Shatkriyas (Jala Neti, Nauli, Kapalabhati)',
      'Bandhas, Mudras & Kundalini Energy Awakening Techniques',
      'Pranayama Master Sequences for Vital Prana Expansion',
      'In-depth study of the Hatha Yoga Pradipika',
      'Silent Ganga Meditations at Brahma Muhurta'
    ],
    dailySchedule: [
      { time: '05:00 AM', activity: 'Brahma Muhurta Kriya & Pranayama' },
      { time: '07:00 AM', activity: 'Dynamic Hatha Sadhana' },
      { time: '09:00 AM', activity: 'Sattvic Breakfast' },
      { time: '11:30 AM', activity: 'Kundalini Tantra Philosophy' },
      { time: '01:00 PM', activity: 'Ayurvedic Lunch' },
      { time: '05:00 PM', activity: 'Chakra Activation & Sound Meditation' },
      { time: '07:30 PM', activity: 'Light Evening Meals' }
    ],
    mealsIncluded: '3 Organic Meals Daily',
    accommodationOptions: ['Private Deluxe Ashram Room'],
    upcomingDates: ['Oct 10, 2026', 'Nov 12, 2026', 'Jan 15, 2027'],
    photos: [
      'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&w=1200&q=80'
    ],
    requirements: ['At least 1 year of consistent yoga practice recommended.']
  },
  {
    id: 'course-2b',
    centreId: 'centre-2',
    centreName: 'Veda5 Himalayan Ayurveda & Yoga Sanctuary',
    title: '5-Day Himalayan Vinyasa Flow & Tibetan Sound Healing Retreat',
    subtitle: 'Energizing Morning Flows, Singing Bowl Therapy & Mountain Forest Rejuvenation',
    category: 'sound-healing',
    durationDays: 5,
    priceUSD: 620,
    certification: 'Veda5 Sound & Flow Immersion Certificate',
    syllabus: [
      'Dynamic Creative Vinyasa sequencing with breath synchronization',
      'Full Tibetan Singing Bowl & Gong Sound Bath immersion',
      'Mountain Nature walks & Forest Shinrin-yoku (forest bathing)',
      'Evening Restorative Yin with live acoustic instruments',
      'Ayurvedic Herbal teas and farm-to-table cuisine'
    ],
    dailySchedule: [
      { time: '07:00 AM', activity: 'Sunrise Dynamic Vinyasa in Mountain Shala' },
      { time: '09:00 AM', activity: 'Fresh Organic Himalayan Breakfast' },
      { time: '11:00 AM', activity: 'Guided Forest Walk to Waterfall' },
      { time: '01:00 PM', activity: 'Nutritious Wellness Lunch' },
      { time: '04:30 PM', activity: 'Tibetan Sound Healing & Chakra Balancing' },
      { time: '07:00 PM', activity: 'Al Fresco Candlelit Dinner' }
    ],
    mealsIncluded: '3 Gourmet Farm-to-Table Organic Meals Daily',
    accommodationOptions: ['Mountain View Balcony Suite', 'Single Eco Chalet'],
    upcomingDates: ['Every Thursday to Monday throughout 2026'],
    photos: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80'
    ],
    requirements: ['Suitable for all practitioners with moderate physical ability.']
  },
  {
    id: 'course-3b',
    centreId: 'centre-3',
    centreName: 'Uttarkashi Himalayan Hermitage & Tapasya Ashram',
    title: '5-Day High-Altitude River Sadhana & Pranayama Immersion',
    subtitle: 'Quiet Hermitage Living, Pure Mountain Air & Bhagirathi Water Blessing',
    category: 'breathwork',
    durationDays: 5,
    priceUSD: 420,
    certification: 'Hermitage Sadhana Certificate',
    syllabus: [
      'Traditional Himalayan Pranayama lineages along the high river',
      'Mindful Silent Walking by the glacial Bhagirathi waters',
      'Ancient Kriya Postures for lung capacity and nervous calm',
      'Sattvic Mountain Herb Teas & pure spring nutrition'
    ],
    dailySchedule: [
      { time: '06:00 AM', activity: 'Riverfront Breath & Japa' },
      { time: '08:30 AM', activity: 'Simple Ashram Breakfast' },
      { time: '01:00 PM', activity: 'Sattvic Dal & Organic Roti' },
      { time: '05:00 PM', activity: 'Candle Meditation (Trataka)' },
      { time: '07:30 PM', activity: 'Night Silence' }
    ],
    mealsIncluded: '3 Simple Himalayan Organic Farm Meals Daily',
    accommodationOptions: ['Quiet Hermitage Cell', 'River View Stone Cottage'],
    upcomingDates: ['Weekly arrivals every Friday'],
    photos: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
    requirements: ['Modest attire and respect for quiet contemplative ashram environment.']
  }
];

