import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Building2, MapPin, Award, Sparkles, CheckCircle2 } from 'lucide-react';

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
      name: name || 'Himalayan Heritage Yoga Ashram',
      slug: (name || 'himalayan-heritage-ashram').toLowerCase().replace(/\s+/g, '-'),
      tagline: tagline || 'Traditional Classical Hatha, Pranayama & Meditation in Uttarakhand',
      location: location || `${city}, Uttarakhand, India`,
      city,
      state: ['Goa', 'Kerala'].includes(city) ? city : 'Uttarakhand',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [coverImage],
      rating: 5.0,
      reviewCount: 1,
      startingPriceUSD: Number(startingPriceUSD),
      foundedYear: Number(foundedYear),
      certification,
      languages: ['English', 'Hindi'],
      accommodationTypes: ['Private Deluxe Mountain View Room', 'Shared Ashram Cottage'],
      mealsIncluded: true,
      airportPickup: true,
      description: 'A serene Himalayan sanctuary dedicated to classical yogic science, authentic pranayama, and quiet meditation.',
      history: 'Founded by dedicated yoga practitioners to preserve Himalayan lineage traditions.',
      teachers: [],
      facilities: ['Ganges / Mountain View Shala', 'Sattvic Organic Kitchen', 'Meditation Pavilions'],
      nearbyAttractions: ['Sacred River Ghats', 'Local Mountain Temples'],
      policies: {
        cancellation: '100% full refund up to 14 days prior via Escrow.',
        visa: 'Official visa confirmation letter provided.',
        dressCode: 'Modest natural fiber attire.'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F7F5EE] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E2E5DD] max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#E2E5DD] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#536B50] text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#536B50] block">
                Centre Partnership Application
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#263D32]">
                List Your Centre in Uttarakhand
              </h3>
            </div>
          </div>

          <button 
            onClick={() => setIsAddCentreOpen(false)} 
            className="p-1.5 text-[#59665C] hover:text-[#263D32] rounded-full hover:bg-[#E6EDE2] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#263D32] block mb-1">Centre / Ashram Name *</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Sivananda Sacred Himalayan Ashram" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full p-3 rounded-xl border border-[#E2E5DD] bg-white text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-[#263D32] block mb-1">Tagline / Core Specialty *</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Classical Hatha & Silent Meditation overlooking the Ganges" 
              value={tagline} 
              onChange={e => setTagline(e.target.value)} 
              className="w-full p-3 rounded-xl border border-[#E2E5DD] bg-white text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#263D32] block mb-1">City / Region *</label>
              <select 
                value={city} 
                onChange={e => setCity(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E2E5DD] bg-white text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
              >
                <option value="Rishikesh">Rishikesh</option>
                <option value="Uttarkashi">Uttarkashi</option>
                <option value="Dehradun">Dehradun</option>
                <option value="Haridwar">Haridwar</option>
                <option value="Nainital">Nainital & Almora</option>
                <option value="Goa">Goa (Partner)</option>
                <option value="Kerala">Kerala (Partner)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#263D32] block mb-1">Location Address</label>
              <input 
                type="text" 
                placeholder="e.g. Tapovan, Rishikesh, Uttarakhand" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                className="w-full p-3 rounded-xl border border-[#E2E5DD] bg-white text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#263D32] block mb-1">Starting Price (USD $) *</label>
              <input 
                type="number" 
                required 
                value={startingPriceUSD} 
                onChange={e => setStartingPriceUSD(Number(e.target.value))} 
                className="w-full p-3 rounded-xl border border-[#E2E5DD] bg-white text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-[#263D32] block mb-1">Founded Year</label>
              <input 
                type="number" 
                value={foundedYear} 
                onChange={e => setFoundedYear(Number(e.target.value))} 
                className="w-full p-3 rounded-xl border border-[#E2E5DD] bg-white text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#263D32] block mb-1">Accreditation / Affiliation</label>
            <input 
              type="text" 
              value={certification} 
              onChange={e => setCertification(e.target.value)} 
              className="w-full p-3 rounded-xl border border-[#E2E5DD] bg-white text-sm focus:ring-2 focus:ring-[#536B50] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-[#263D32] block mb-1">Cover Photo URL</label>
            <input 
              type="url" 
              value={coverImage} 
              onChange={e => setCoverImage(e.target.value)} 
              className="w-full p-3 rounded-xl border border-[#E2E5DD] bg-white text-xs font-mono focus:ring-2 focus:ring-[#536B50] focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-[#536B50] hover:bg-[#40563E] text-white font-medium py-3.5 rounded-xl text-sm shadow-sm flex items-center justify-center space-x-2 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Submit Centre Listing for Verification</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
