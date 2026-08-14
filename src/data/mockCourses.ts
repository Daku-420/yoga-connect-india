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
    syllabus: ['Hatha Asana Alignment', 'Pranayama & Kriya', 'Yoga Philosophy & Sutras', 'Anatomy & Physiology', 'Teaching Methodology'],
    dailySchedule: [
      { time: '06:00 AM', activity: 'Pranayama & Meditation' },
      { time: '07:30 AM', activity: 'Morning Asana Practice' },
      { time: '09:30 AM', activity: 'Sattvic Breakfast' }
    ],
    mealsIncluded: '3 Sattvic Organic Vegetarian Meals Daily',
    accommodationOptions: ['Private Ashram Room', 'Shared Twin Room'],
    upcomingDates: ['Oct 1, 2026', 'Nov 1, 2026', 'Dec 1, 2026'],
    photos: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80'
    ],
    requirements: ['Open to all levels', 'Commitment to sattvic ashram rules']
  }
];
