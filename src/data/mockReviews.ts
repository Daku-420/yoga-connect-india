import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    centreId: 'centre-1', // Parmarth Niketan
    courseName: '7-Day Beginner Hatha Yoga Immersion',
    authorName: 'Sarah Jenkins',
    authorCountry: 'Australia',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    authorEmail: 'traveler.sarah@yogaconnect.in',
    rating: 5,
    date: 'October 2026',
    title: 'Transformational experience on the banks of Ganga',
    comment: 'An extraordinary sanctuary. The teachers possess deep lineage wisdom and taught with genuine care. The admin escrow team organized my private pickup from Dehradun airport flawlessly.',
    teacherRating: 5,
    foodRating: 5,
    stayRating: 5,
    isVerifiedBooking: true,
    bookingRef: 'YC-2026-8812'
  },
  {
    id: 'rev-2',
    centreId: 'centre-1', // Parmarth Niketan
    courseName: '200 Hour Multi-Style Yoga Teacher Training (RYS 200)',
    authorName: 'Marcus Vance',
    authorCountry: 'United Kingdom',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    authorEmail: 'traveler.marcus@yogaconnect.in',
    rating: 5,
    date: 'September 2026',
    title: 'Rigorous, authentic, and life-changing TTC curriculum',
    comment: 'The anatomical precision alongside Vedic philosophy made this 200h TTC one of the best investments of my life. Daily Ganga Aarti at twilight was unforgettable.',
    teacherRating: 5,
    foodRating: 4,
    stayRating: 5,
    isVerifiedBooking: true,
    bookingRef: 'YC-2026-4401'
  },
  {
    id: 'rev-3',
    centreId: 'centre-2', // Ananda in the Himalayas
    courseName: '14-Day Ayurvedic Panchakarma Detox Retreat',
    authorName: 'Elena Rostova',
    authorCountry: 'Germany',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    authorEmail: 'traveler.elena@yogaconnect.in',
    rating: 5,
    date: 'August 2026',
    title: 'World-class Ayurvedic clinical precision and serene luxury',
    comment: 'The pulse diagnosis and custom Dosha dining restored my digestion completely. The therapists are compassionate masters of classical Abhyanga.',
    teacherRating: 5,
    foodRating: 5,
    stayRating: 5,
    isVerifiedBooking: true,
    bookingRef: 'YC-2026-7299'
  }
];
