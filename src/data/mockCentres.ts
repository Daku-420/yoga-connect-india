import { YogaCentre } from '../types';

export const mockCentres: YogaCentre[] = [
  {
    id: 'centre-1',
    name: 'Parmarth Niketan Sacred Ganges Ashram',
    slug: 'parmarth-niketan-rishikesh',
    tagline: 'Authentic Traditional Hatha, Pranayama & Meditation along the Sacred Ganges in Rishikesh',
    location: 'Swargashram, Tapovan, Rishikesh, Uttarakhand, India',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    coverImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewCount: 142,
    startingPriceUSD: 1250,
    foundedYear: 1942,
    certification: 'Yoga Alliance USA RYS 200 / 300 / 500',
    languages: ['English', 'Hindi', 'Sanskrit'],
    accommodationTypes: ['Private Deluxe Ashram Room', 'Shared Twin Cottage'],
    mealsIncluded: true,
    airportPickup: true,
    description: 'Situated on the holy banks of the River Ganges in Rishikesh, Parmarth Niketan is one of India\'s premier yoga ashrams offering authentic traditional Hatha yoga, pranayama, and meditation immersions.',
    history: 'Founded in 1942 by Pujya Swami Shukdevanandji Maharaj, Parmarth Niketan is the largest ashram in Rishikesh.',
    teachers: [],
    facilities: ['Ganges Facing Shala', 'Sattvic Organic Dining', 'Library', 'Ayurvedic Spa'],
    nearbyAttractions: ['Ram Jhula', 'Beatles Ashram', 'Ganga Aarti'],
    policies: {
      cancellation: '100% full refund up to 14 days before start date.',
      visa: 'Medical/Yoga Visa required for international travelers.',
      dressCode: 'Modest white or light-colored attire recommended.'
    },
    faqs: [
      {
        question: 'Are meals vegetarian?',
        answer: 'Yes, 3 sattvic organic vegetarian meals are served daily.'
      }
    ],
    mapCoords: {
      lat: 30.123,
      lng: 78.312
    },
    isVerified: true,
    isFeatured: true,
    commissionRatePercent: 15
  },
  {
    id: 'centre-2',
    name: 'Sivananda Oceanfront Yoga Sanctuary',
    slug: 'sivananda-oceanfront-goa',
    tagline: 'Sunset Vinyasa, Ocean Meditation & Ayurvedic Panchakarma Healing on Cliffside Beaches',
    location: 'Arambol Beach Cliff, North Goa, India',
    city: 'Goa',
    state: 'Goa',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.85,
    reviewCount: 98,
    startingPriceUSD: 1450,
    foundedYear: 1998,
    certification: 'Yoga Alliance USA RYS 200 & NABH Ayurveda',
    languages: ['English', 'French', 'German'],
    accommodationTypes: ['Sea View Villa', 'Bamboo Eco-Hut'],
    mealsIncluded: true,
    airportPickup: true,
    description: 'Experience cliffside oceanfront yoga in Arambol, Goa, combined with authentic Sivananda tradition, daily sunset meditation, and custom Ayurvedic therapies.',
    history: 'Established in 1998 to bring traditional Sivananda yoga principles to coastal Goa.',
    teachers: [],
    facilities: ['Ocean Deck', 'Ayurveda Doctor', 'Beach Shala'],
    nearbyAttractions: ['Arambol Sweet Water Lake', 'Mandrem Beach'],
    policies: {
      cancellation: '100% full refund up to 14 days before start date.',
      visa: 'Tourist or Yoga Visa valid for Goa stay.',
      dressCode: 'Comfortable beachwear and yoga attire.'
    },
    faqs: [
      {
        question: 'Is airport transfer included?',
        answer: 'Yes, complimentary pickup from Goa airport is included.'
      }
    ],
    mapCoords: {
      lat: 15.686,
      lng: 73.704
    },
    isVerified: true,
    isFeatured: true,
    commissionRatePercent: 15
  }
];
