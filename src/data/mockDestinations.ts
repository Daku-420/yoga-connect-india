import { Destination } from '../types';

export const mockDestinations: Destination[] = [
  {
    id: 'dest-rishikesh',
    name: 'Rishikesh',
    slug: 'rishikesh',
    subtitle: 'The Yoga Capital of the World & Gateway to the Garhwal Himalayas',
    coverImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    description: 'Set on the sacred banks of the emerald Ganges River where the Himalayas begin, Rishikesh is the ancient spiritual capital of yoga. Home to century-old traditional ashrams, world-certified TTC academies, and daily riverfront Ganga Aarti rituals.',
    highlights: ['Sacred Ganges River', 'Beatles Ashram (Chaurasi Kutia)', 'Himalayan Foothills', 'Ganga Aarti Ceremonies', '100+ Certified Ashrams'],
    bestTimeToVisit: 'September to April',
    nearbyAirport: 'Dehradun Jolly Grant Airport (DED) - 35 mins',
    retreatCount: 42
  },
  {
    id: 'dest-uttarkashi',
    name: 'Uttarkashi',
    slug: 'uttarkashi',
    subtitle: 'High Himalayan Mountain Solitude & Sacred Ganga Source',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    description: 'A serene mountain sanctuary along the Bhagirathi river, Uttarkashi is renowned for serious yogic sadhana, noble silence (mauna) retreats, and meditation caves away from commercial bustle.',
    highlights: ['Bhagirathi River Sadhana', 'Pristine Pine Forests', 'Meditation Caves', 'Gangotri Pilgrim Route', 'Unspoiled High Valleys'],
    bestTimeToVisit: 'March to June & September to November',
    nearbyAirport: 'Dehradun Jolly Grant Airport (DED) - 4.5 hrs scenic drive',
    retreatCount: 18
  },
  {
    id: 'dest-dehradun',
    name: 'Dehradun & Mussoorie',
    slug: 'dehradun',
    subtitle: 'Himalayan Foothill Valleys & Luxury Forest Sanctuaries',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    description: 'Nestled between the Ganges and Yamuna rivers in the lush Doon Valley, Dehradun offers tranquil luxury wellness estates, organic tea gardens, and high-ridge mountain pavilions.',
    highlights: ['Doon Valley Forests', 'Palace Wellness Estates', 'Organic Tea Gardens', 'Fresh Mountain Air', 'Mindfulness Walks'],
    bestTimeToVisit: 'Year-round (Best: October to May)',
    nearbyAirport: 'Dehradun Jolly Grant Airport (DED) - 20 mins',
    retreatCount: 16
  },
  {
    id: 'dest-haridwar',
    name: 'Haridwar',
    slug: 'haridwar',
    subtitle: 'Sacred Gateway of the Gods & Ancient Vedic Lineages',
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    description: 'One of the world\'s seven sacred holiest cities, Haridwar is celebrated for authentic Vedic ashrams, traditional Sanskrit philosophy schools, and daily fire pujas at Har Ki Pauri.',
    highlights: ['Har Ki Pauri Ghat', 'Vedic Yajna Ceremonies', 'Sacred Ganges Immersion', 'Ancient Lineage Masters'],
    bestTimeToVisit: 'October to April',
    nearbyAirport: 'Dehradun Jolly Grant Airport (DED) - 40 mins',
    retreatCount: 14
  },
  {
    id: 'dest-nainital',
    name: 'Nainital & Almora',
    slug: 'nainital',
    subtitle: 'Kumaon Himalayan Silence, High Pine Ridges & Lake Meditation',
    coverImage: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&w=800&q=80',
    description: 'Perched in the peaceful Kumaon hills overlooking Nanda Devi and snow-capped peaks, Almora and Nainital offer deep creative silence, pine forest walking meditation, and tranquil retreats.',
    highlights: ['Nanda Devi Himalayan Views', 'Crank\'s Ridge Heritage', 'Pine Forest Solitude', 'Pure Mountain Spring Water'],
    bestTimeToVisit: 'March to June & September to November',
    nearbyAirport: 'Pantnagar Airport (PGH) - 1.5 hrs / Delhi (DEL) - 6 hrs',
    retreatCount: 12
  },
  {
    id: 'dest-goa',
    name: 'Goa',
    slug: 'goa',
    subtitle: 'Oceanfront Vinyasa, Sunset Yoga & Beach Sanctuaries',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Blissful tropical shores meet modern alignment yoga, sound baths, organic superfood cafes, and luxury eco-resorts on North Goa\'s peaceful Mandrem and Ashwem beaches.',
    highlights: ['Pristine Beaches', 'Oceanfront Yoga Shalas', 'Sound Baths & Ecstatic Dance', 'Organic Vegan Cafes', 'Sunset Meditation'],
    bestTimeToVisit: 'October to May',
    nearbyAirport: 'Mopa International Airport (GOX) / Dabolim (GOI) - 45 mins',
    retreatCount: 28
  },
  {
    id: 'dest-kerala',
    name: 'Kerala',
    slug: 'kerala',
    subtitle: 'God\'s Own Country & Birthplace of Ayurveda',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Lush tropical backwaters, coconut palm groves, and centuries-old Ayurvedic hospitals offering authentic Panchakarma body rejuvenation alongside restorative Gentle Hatha.',
    highlights: ['Authentic Panchakarma', 'Tropical Backwaters', 'Ayurvedic Physicians', 'Coconut Palm Gardens', 'Herbal Massages'],
    bestTimeToVisit: 'September to March',
    nearbyAirport: 'Trivandrum International Airport (TRV) / Cochin (COK) - 30 mins',
    retreatCount: 35
  },
  {
    id: 'dest-dharamshala',
    name: 'Dharamshala',
    slug: 'dharamshala',
    subtitle: 'High Himalayan Mountain Solitude & Tibetan Meditation',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    description: 'Perched in the Dhauladhar pine forests of McLeod Ganj, home to His Holiness the Dalai Lama, offer deep Vipassana silent retreats and high-altitude Himalayan breathwork.',
    highlights: ['Dhauladhar Peaks', 'Residence of Dalai Lama', 'Vipassana Meditation', 'Pine Forest Trails', 'Tibetan Sound Bowls'],
    bestTimeToVisit: 'March to June & September to November',
    nearbyAirport: 'Gaggal Airport Kangra (DHM) - 40 mins',
    retreatCount: 19
  }
];
