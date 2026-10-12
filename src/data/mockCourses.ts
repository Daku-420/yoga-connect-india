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
  }
];
