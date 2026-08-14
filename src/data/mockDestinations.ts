import { Destination } from '../types';

export const mockDestinations: Destination[] = [
  {
    id: 'dest-rishikesh',
    name: 'Rishikesh',
    slug: 'rishikesh',
    subtitle: 'The Yoga Capital of the World',
    coverImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    description: 'Set on the banks of the emerald Ganges River where the sacred Himalayas begin, Rishikesh is the holy birthplace of modern yoga, home to ancient ashrams, world-certified TTC academies, and Ganga Aarti ceremonies.',
    highlights: ['Sacred Ganges River', 'Beatles Ashram', 'Himalayan Foothills', 'Ganga Aarti Ceremonies', '100+ Certified Ashrams'],
    bestTimeToVisit: 'September to April',
    nearbyAirport: 'Dehradun Jolly Grant Airport (DED) - 35 mins',
    retreatCount: 42
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
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    description: 'Perched in the Dhauladhar pine forests of McLeod Ganj, home to His Holiness the Dalai Lama, offer deep Vipassana silent retreats and high-altitude Himalayan breathwork.',
    highlights: ['Dhauladhar Peaks', 'Residence of Dalai Lama', 'Vipassana Meditation', 'Pine Forest Trails', 'Tibetan Sound Bowls'],
    bestTimeToVisit: 'March to June & September to November',
    nearbyAirport: 'Gaggal Airport Kangra (DHM) - 40 mins',
    retreatCount: 19
  },

  {
    id: 'dest-mysore',
    name: 'Mysore',
    slug: 'mysore',
    subtitle: 'The Sacred Birthplace of Ashtanga Vinyasa Yoga',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    description: 'The historic royal city where T. Krishnamacharya and Pattabhi Jois developed Ashtanga Yoga. Dedicated practitioners from around the globe gather in Gokulam for self-paced Mysore practice.',
    highlights: ['Traditional Mysore Style', 'Gokulam Yoga Hub', 'Royal Mysore Palace', 'Sanskrit Philosophy', 'K. Pattabhi Jois Lineage'],
    bestTimeToVisit: 'October to March',
    nearbyAirport: 'Bengaluru Kempegowda (BLR) / Mysore (MYQ) - 2.5 hrs',
    retreatCount: 16
  },

  {
    id: 'dest-haridwar',
    name: 'Haridwar',
    slug: 'haridwar',
    subtitle: 'Sacred Gateway to the Gods & Ancient Vedic Ashrams',
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    description: 'One of the world\'s oldest living cities, Haridwar offers authentic spiritual immersion, daily Vedic fire rituals (yajnasa), and traditional Sivananda Hatha practices.',
    highlights: ['Har Ki Pauri Ghat', 'Vedic Yajna Rituals', 'Sacred Ganges Dip', 'Authentic Lineage Ashrams'],
    bestTimeToVisit: 'October to April',
    nearbyAirport: 'Dehradun Jolly Grant Airport (DED) - 40 mins',
    retreatCount: 14
  },

  {
    id: 'dest-dehradun',
    name: 'Dehradun',
    slug: 'dehradun',
    subtitle: 'Himalayan Foothill Valleys & Serene Wellness Sanctuaries',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    description: 'Tucked away in the Doon Valley, Dehradun offers tranquil luxury wellness estates surrounded by sal forests and organic tea plantations.',
    highlights: ['Doon Valley Scenery', 'Luxury Eco Retreats', 'Organic Tea Gardens', 'Mindfulness Walks'],
    bestTimeToVisit: 'October to May',
    nearbyAirport: 'Dehradun Jolly Grant Airport (DED) - 20 mins',
    retreatCount: 12
  },

  {
    id: 'dest-pondicherry',
    name: 'Pondicherry',
    slug: 'pondicherry',
    subtitle: 'French Colonial Heritage & Integral Yoga (Auroville)',
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    description: 'Where French colonial charm meets Sri Aurobindo\'s Integral Yoga and Matrimandir meditation dome in Auroville.',
    highlights: ['Auroville Matrimandir', 'Integral Yoga Philosophy', 'French Quarter Cafes', 'Coromandel Coast'],
    bestTimeToVisit: 'October to March',
    nearbyAirport: 'Chennai International Airport (MAA) - 2.5 hrs',
    retreatCount: 11
  },

  // Future Destinations
  {
    id: 'dest-bali',
    name: 'Bali (Ubud & Canggu)',
    slug: 'bali',
    subtitle: 'Island of the Gods & Jungle Shalas',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Coming Soon to YogaConnect - Tropical jungle sanctuaries, sound healing in Ubud, and rice field yoga platforms.',
    highlights: ['Ubud Jungle Shalas', 'Rice Terrace Views', 'Sound Domes', 'Balinese Flower Baths'],
    bestTimeToVisit: 'April to October',
    nearbyAirport: 'Denpasar Ngurah Rai (DPS)',
    retreatCount: 0,
    isUpcoming: true
  },

  {
    id: 'dest-nepal',
    name: 'Nepal (Pokhara & Kathmandu)',
    slug: 'nepal',
    subtitle: 'High Himalayan Mountain Peaks & Buddhist Monastic Retreats',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description: 'Coming Soon to YogaConnect - High altitude Annapurna mountain yoga, Tibetan monasteries, and sound healing.',
    highlights: ['Annapurna Views', 'Fewa Lake Meditation', 'Monastery Chanting', 'Sound Healing'],
    bestTimeToVisit: 'October to December & March to May',
    nearbyAirport: 'Kathmandu Tribhuvan (KTM) / Pokhara (PKR)',
    retreatCount: 0,
    isUpcoming: true
  }
];
