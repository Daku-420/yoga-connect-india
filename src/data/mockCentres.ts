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
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&w=1200&q=80'
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
    description: 'Situated on the holy banks of the River Ganges in Rishikesh, Parmarth Niketan is one of Uttarakhand\'s premier heritage ashrams. It offers classical Hatha yoga, authentic pranayama lineages, sacred Vedic fire ceremonies, and peaceful meditation immersions against the Himalayan foothills.',
    history: 'Founded in 1942 by Pujya Swami Shukdevanandji Maharaj, Parmarth Niketan is the largest traditional ashram in Rishikesh.',
    teachers: [
      {
        id: 't-1',
        name: 'Acharya Vishwajeet Shastri',
        title: 'Master of Classical Hatha & Pranayama',
        bio: 'Over 22 years teaching Patanjali Yoga Sutras, alignment, and Himalayan breathwork.',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        experienceYears: 22,
        specialties: ['Hatha Yoga', 'Pranayama', 'Yoga Sutras']
      },
      {
        id: 't-2',
        name: 'Dr. Meera Nautiyal',
        title: 'Ayurvedic Wellness & Anatomy Director',
        bio: 'BAMS physician specializing in yogic anatomy, pulse diagnosis, and restorative therapy.',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        experienceYears: 16,
        specialties: ['Ayurvedic Anatomy', 'Panchakarma', 'Therapeutic Yoga']
      }
    ],
    facilities: ['Ganges Facing Shala', 'Sattvic Organic Dining Hall', 'Spiritual Library', 'Ayurvedic Treatment Wing', 'Gardens & Meditation Kuti'],
    nearbyAttractions: ['Ram Jhula Suspension Bridge', 'Beatles Ashram (Chaurasi Kutia)', 'Parmarth Ganga Aarti'],
    policies: {
      cancellation: '100% full refund up to 14 days before start date via Escrow.',
      visa: 'Tourist or Yoga/Medical Visa valid for India.',
      dressCode: 'Modest white or muted natural fiber attire recommended.'
    },
    faqs: [
      {
        question: 'Are meals vegetarian and sattvic?',
        answer: 'Yes, three nutritious organic sattvic vegetarian meals cooked fresh with local Himalayan produce are served daily.'
      },
      {
        question: 'How does airport pickup work?',
        answer: 'Complimentary private driver pickup is coordinated from Dehradun Jolly Grant Airport (DED) directly to the ashram gates.'
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
    name: 'Veda5 Himalayan Ayurveda & Yoga Sanctuary',
    slug: 'veda5-rishikesh-himalayas',
    tagline: 'Authentic Panchakarma, Vinyasa & Silent Meditation in the Pristine Himalayan Foothills',
    location: 'Rattapani, Neelkanth Road, Rishikesh, Uttarakhand, India',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.94,
    reviewCount: 118,
    startingPriceUSD: 1480,
    foundedYear: 2017,
    certification: 'Yoga Alliance USA RYS 200 & NABH Certified Hospital',
    languages: ['English', 'Hindi', 'German'],
    accommodationTypes: ['Mountain View Balcony Suite', 'Single Eco Chalet'],
    mealsIncluded: true,
    airportPickup: true,
    description: 'Surrounded by pine-scented valleys above Rishikesh, Veda5 provides medical-grade Ayurvedic physician consultations alongside daily Hatha and gentle Vinyasa yoga sessions in panoramic open-air shalas.',
    history: 'Constructed sustainably with local mud and stone, Veda5 was awarded Best Ayurveda Retreat in India for ecological excellence.',
    teachers: [
      {
        id: 't-3',
        name: 'Yogi Anand Rawat',
        title: 'Senior Vinyasa & Meditation Guru',
        bio: 'Born in Garhwal Himalayas, trained under traditional Himalayan masters in Nada and Kundalini yoga.',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        experienceYears: 18,
        specialties: ['Himalayan Vinyasa', 'Mantra & Nada', 'Vipassana']
      }
    ],
    facilities: ['Panoramic Mountain Shala', 'NABH Certified Panchakarma Wing', 'Organic Farm-to-Table Bistro', 'Forest Walking Paths'],
    nearbyAttractions: ['Neelkanth Mahadev Temple', 'Patna Waterfall', 'Vashistha Cave'],
    policies: {
      cancellation: '100% full refund up to 14 days before arrival with Escrow guarantee.',
      visa: 'Standard Indian tourist or e-visa.',
      dressCode: 'Loose comfortable yoga clothing.'
    },
    faqs: [
      {
        question: 'Is a medical consultation included?',
        answer: 'Yes, a private consultation with our Chief Ayurvedic Vaidya (Physician) is conducted on Day 1 to map your bespoke dosha diet and herbal therapies.'
      }
    ],
    mapCoords: {
      lat: 30.145,
      lng: 78.341
    },
    isVerified: true,
    isFeatured: true,
    commissionRatePercent: 15
  },
  {
    id: 'centre-3',
    name: 'Uttarkashi Himalayan Hermitage & Tapasya Ashram',
    slug: 'uttarkashi-himalayan-hermitage',
    tagline: 'High Himalayan Mountain Solitude, Kundalini Sadhana & Traditional Hatha along the Bhagirathi River',
    location: 'Netala, Gangotri Route, Uttarkashi, Uttarakhand, India',
    city: 'Uttarkashi',
    state: 'Uttarakhand',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.88,
    reviewCount: 76,
    startingPriceUSD: 980,
    foundedYear: 1982,
    certification: 'Yoga Alliance USA RYS 200 / Traditional Gurukul Certified',
    languages: ['English', 'Hindi'],
    accommodationTypes: ['River View Stone Cottage', 'Quiet Hermitage Cell'],
    mealsIncluded: true,
    airportPickup: true,
    description: 'Set along the crystal-clear Bhagirathi river deep in the higher Garhwal Himalayas of Uttarkashi, this hermitage offers genuine peace for serious seekers, silent retreats, and classical Ashtanga and Hatha sadhana far away from crowds.',
    history: 'Originally established by wandering monks seeking deep silence near Gangotri, this sanctuary maintains pure monastic simplicity.',
    teachers: [
      {
        id: 't-4',
        name: 'Swami Dhyanananda',
        title: 'Lineage Custodian of Himalayan Kriya & Raja Yoga',
        bio: 'Spent 14 years in silence and intense meditation in higher Garhwal caves.',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        experienceYears: 28,
        specialties: ['Raja Yoga', 'Kriya Sadhana', 'Silence (Mauna)']
      }
    ],
    facilities: ['Riverfront Stone Shala', 'Meditation Caves', 'Pure Herb Garden', 'Mountain Spring Water Supply'],
    nearbyAttractions: ['Gangotri Glacier Base Route', 'Kashi Vishwanath Temple Uttarkashi', 'Dodi Tal Trek'],
    policies: {
      cancellation: 'Full refund 14 days prior to retreat.',
      visa: 'Indian tourist e-visa.',
      dressCode: 'Simple traditional attire.'
    },
    faqs: [
      {
        question: 'Is internet and mobile connectivity available?',
        answer: 'High-speed Wi-Fi is available in designated work areas, while residential huts remain tech-free for mental quietude.'
      }
    ],
    mapCoords: {
      lat: 30.726,
      lng: 78.435
    },
    isVerified: true,
    isFeatured: true,
    commissionRatePercent: 15
  },
  {
    id: 'centre-4',
    name: 'Ananda in the Himalayas Retreat Estate',
    slug: 'ananda-himalayas-narendra-nagar',
    tagline: 'World-Renowned Luxury Wellness, Bespoke Hatha Yoga & Vedantic Mindfulness above Rishikesh',
    location: 'Palace Estate, Narendra Nagar, Tehri Garhwal, Uttarakhand, India',
    city: 'Dehradun',
    state: 'Uttarakhand',
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.98,
    reviewCount: 210,
    startingPriceUSD: 2400,
    foundedYear: 2000,
    certification: 'Condé Nast Traveller #1 Destination Spa • Yoga Alliance Accredited',
    languages: ['English', 'Hindi', 'French', 'Japanese'],
    accommodationTypes: ['Palace View Deluxe Room', 'Private Valley Villa'],
    mealsIncluded: true,
    airportPickup: true,
    description: 'Set on a 100-acre Maharaja\'s palace estate overlooking the serene Ganges river valley and Rishikesh, Ananda integrates classical Hatha and Bihar School of Yoga techniques with holistic wellness and bespoke nutrition.',
    history: 'Built within the historic Viceregal Palace of the Maharaja of Tehri Garhwal.',
    teachers: [
      {
        id: 't-5',
        name: 'Acharya Sandeep Gairola',
        title: 'Head of Yogic Science & Vedanta Studies',
        bio: 'Trained at Bihar Yoga Bharati, bringing 20 years of bespoke posture correction and meditation instruction.',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
        experienceYears: 20,
        specialties: ['Bihar School Hatha', 'Yoga Nidra', 'Vedanta']
      }
    ],
    facilities: ['Viceregal Amphitheater', 'Himalayan Ridge Yoga Pavilion', '24,000 sq ft Hydrotherapy Spa', 'Golf Course & Nature Trails'],
    nearbyAttractions: ['Kunjapuri Sunrise Temple', 'Rishikesh Ghats', 'Rajaji National Park'],
    policies: {
      cancellation: 'Flexible cancellation up to 14 days prior with escrow security.',
      visa: 'Indian tourist e-visa.',
      dressCode: 'Provided traditional Kurta Pyjama or comfortable activewear.'
    },
    faqs: [
      {
        question: 'Are programs suitable for absolute beginners?',
        answer: 'Yes, every guest receives an individual assessment and tailor-made schedule suited to their physical condition and goals.'
      }
    ],
    mapCoords: {
      lat: 30.177,
      lng: 78.291
    },
    isVerified: true,
    isFeatured: true,
    commissionRatePercent: 15
  }
];
