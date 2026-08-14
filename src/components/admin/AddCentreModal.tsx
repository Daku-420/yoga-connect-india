import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Building2, MapPin, DollarSign, Award, Image, Sparkles } from 'lucide-react';

export const AddCentreModal: React.FC = () => {
  const { isAddCentreOpen, setIsAddCentreOpen, addNewCentre, setActiveView, setSelectedCentreId } = useApp();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [city, setCity] = useState('Rishikesh');
  const [location, setLocation] = useState('');
  const [startingPriceUSD, setStartingPriceUSD] = useState(950);
  const [foundedYear, setFoundedYear] = useState(2018);
  const [certification, setCertification] = useState('Yoga Alliance USA RYS 200 / 300');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80');

  if (!isAddCentreOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'centre-custom-' + Date.now();
    const createdCentre = {
      id,
      name: name || 'Sivananda Sacred Yoga Ashram',
      slug: (name || 'sivananda-sacred-ashram').toLowerCase().replace(/\s+/g, '-'),
      tagline: tagline || 'Traditional Hatha, Pranayama & Meditation in Sacred India',
      location: location || `${city}, Uttarakhand, India`,
      city,
      state: city === 'Goa' ? 'Goa' : city === 'Kerala' ? 'Kerala' : 'Uttarakhand',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [coverImage],
      rating: 5.0,
      reviewCount: 1,
      startingPriceUSD: Number(startingPriceUSD),
      foundedYear: Number(foundedYear),
      certification,
      languages: ['English', 'Hindi'],
      accommodationTypes: ['Private Deluxe Mountain View', 'Shared Ashram Suite'],
      mealsIncluded: true,
      airportPickup: true,
      description: 'A serene spiritual sanctuary dedicated to traditional Vedic lineage yoga and high Himalayan meditation.',
      history: 'Founded by senior yoga practitioners to preserve traditional Indian yoga lineage.',
      teachers: [],
      facilities: ['Ganges View Shala', 'Organic Kitchen', 'Meditation Cave'],
      nearbyAttractions: ['Sacred River Ghats', 'Local Temples'],
      policies: {
        cancellation: 'Full refund up to 30 days prior.',
        visa: 'Official invitation letter provided.',
        dressCode: 'Modest white attire.'
      },
      faqs: [],
      mapCoords: { lat: 30.12, lng: 78.32 },
      isFeatured: true,
      isVerified: true,
      commissionRatePercent: 15
    };

    addNewCentre(createdCentre);
    setSelectedCentreId(id);
    setIsAddCentreOpen(false);
    setActiveView('retreats');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-sand-50 rounded-3xl max-w-xl w-full p-8 space-y-6 shadow-2xl border border-sand-300 max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-sand-300 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gold-500 text-sage-950 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta-600">Platform Owner Tool</span>
              <h3 className="font-serif font-bold text-2xl text-sage-950">Add A New Yoga Centre</h3>
            </div>
          </div>
          <button onClick={() => setIsAddCentreOpen(false)} className="text-sage-500 hover:text-sage-900"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-sage-800 block mb-1">Yoga Centre Name *</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Sivananda Sacred Himalayan Ashram" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full p-3 rounded-xl border border-sand-300 bg-white text-sm focus:ring-2 focus:ring-sage-500"
            />
          </div>

          <div>
            <label className="font-bold text-sage-800 block mb-1">Tagline / Subtitle *</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Traditional Hatha & Sound Baths overlooking the Ganges" 
              value={tagline} 
              onChange={e => setTagline(e.target.value)} 
              className="w-full p-3 rounded-xl border border-sand-300 bg-white text-sm focus:ring-2 focus:ring-sage-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-sage-800 block mb-1">City / Region *</label>
              <select 
                value={city} 
                onChange={e => setCity(e.target.value)}
                className="w-full p-3 rounded-xl border border-sand-300 bg-white text-sm focus:ring-2 focus:ring-sage-500"
              >
                <option value="Rishikesh">Rishikesh</option>
                <option value="Goa">Goa</option>
                <option value="Kerala">Kerala</option>
                <option value="Dharamshala">Dharamshala</option>
                <option value="Mysore">Mysore</option>
                <option value="Haridwar">Haridwar</option>
                <option value="Dehradun">Dehradun</option>
                <option value="Pondicherry">Pondicherry</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-sage-800 block mb-1">Full Location Address</label>
              <input 
                type="text" 
                placeholder="e.g. Tapovan, Rishikesh, Uttarakhand" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                className="w-full p-3 rounded-xl border border-sand-300 bg-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-sage-800 block mb-1">Starting Price (USD $) *</label>
              <input 
                type="number" 
                required 
                value={startingPriceUSD} 
                onChange={e => setStartingPriceUSD(Number(e.target.value))} 
                className="w-full p-3 rounded-xl border border-sand-300 bg-white text-sm"
              />
            </div>

            <div>
              <label className="font-bold text-sage-800 block mb-1">Founded Year</label>
              <input 
                type="number" 
                value={foundedYear} 
                onChange={e => setFoundedYear(Number(e.target.value))} 
                className="w-full p-3 rounded-xl border border-sand-300 bg-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-sage-800 block mb-1">Yoga Alliance Accreditation</label>
            <input 
              type="text" 
              value={certification} 
              onChange={e => setCertification(e.target.value)} 
              className="w-full p-3 rounded-xl border border-sand-300 bg-white text-sm"
            />
          </div>

          <div>
            <label className="font-bold text-sage-800 block mb-1">Cover Photo URL</label>
            <input 
              type="url" 
              value={coverImage} 
              onChange={e => setCoverImage(e.target.value)} 
              className="w-full p-3 rounded-xl border border-sand-300 bg-white text-xs font-mono"
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-terracotta-600 to-sage-900 text-white font-serif font-bold py-3.5 rounded-xl text-base shadow-xl flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Publish Yoga Centre Listing</span>
          </button>
        </form>
      </div>
    </div>
  );
};
