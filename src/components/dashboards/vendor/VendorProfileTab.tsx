'use client';

import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Clock, 
  CheckCircle2, 
  Save, 
  Upload, 
  Sparkles, 
  Building2, 
  Instagram, 
  Facebook, 
  Youtube,
  ShieldCheck,
  Check
} from 'lucide-react';
import { YogaCentre } from '../../../types';

interface VendorProfileTabProps {
  activeCentre: YogaCentre;
  onUpdateCentreProfile: (centreId: string, updates: Partial<YogaCentre>) => Promise<void>;
}

export const VendorProfileTab: React.FC<VendorProfileTabProps> = ({
  activeCentre,
  onUpdateCentreProfile
}) => {
  const [name, setName] = useState(activeCentre.name || '');
  const [tagline, setTagline] = useState(activeCentre.tagline || '');
  const [location, setLocation] = useState(activeCentre.location || '');
  const [address, setAddress] = useState(activeCentre.address || '');
  const [description, setDescription] = useState(activeCentre.description || '');
  const [contactEmail, setContactEmail] = useState(activeCentre.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(activeCentre.contactPhone || '');
  const [websiteUrl, setWebsiteUrl] = useState(activeCentre.websiteUrl || '');
  const [instagram, setInstagram] = useState(activeCentre.socialLinks?.instagram || '');
  const [facebook, setFacebook] = useState(activeCentre.socialLinks?.facebook || '');
  const [youtube, setYoutube] = useState(activeCentre.socialLinks?.youtube || '');
  const [operatingHours, setOperatingHours] = useState(activeCentre.operatingHours || '05:30 AM - 08:30 PM IST');
  const [facilities, setFacilities] = useState<string[]>(
    activeCentre.facilities || ['Ganga View Yoga Shala', 'Organic Ayurvedic Dining', 'Meditation Caves', 'Ayurvedic Spa & Panchakarma', 'Library & Sanskrit Texts']
  );
  const [newFacilityInput, setNewFacilityInput] = useState('');
  const [imageUrl, setImageUrl] = useState(activeCentre.coverImage || activeCentre.image || '');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddFacility = () => {
    if (!newFacilityInput.trim()) return;
    if (!facilities.includes(newFacilityInput.trim())) {
      setFacilities([...facilities, newFacilityInput.trim()]);
    }
    setNewFacilityInput('');
  };

  const handleRemoveFacility = (fac: string) => {
    setFacilities(facilities.filter(f => f !== fac));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await onUpdateCentreProfile(activeCentre.id, {
        name,
        tagline,
        location,
        address,
        description,
        contactEmail,
        contactPhone,
        websiteUrl,
        socialLinks: {
          instagram,
          facebook,
          youtube
        },
        operatingHours,
        facilities,
        image: imageUrl
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(`Failed to save profile: ${err.message || 'Error occurred'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E6EDE2] text-[#263D32]">
              Listing Profile
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-500">
              Verified Yoga Sanctuary
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#263D32] mt-1">
            Centre Profile Management
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Update sanctuary details, amenities, contact coordinates, and photography showcased to seekers on Yoga Connect India.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> Changes Published Live
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Sanctuary Info */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center">
            <Building2 className="w-4 h-4 mr-2 text-[#536B50]" /> Sanctuary Identity &amp; Branding
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#263D32] block mb-1">Ashram / Centre Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">Short Tagline / Philosophy</label>
              <input
                type="text"
                placeholder="e.g. Traditional Vedic Wisdom by the Sacred Ganges"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#263D32] block mb-1">Sanctuary Story &amp; Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your ashram lineage, guru traditions, peaceful surroundings, and spiritual ambiance..."
              className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="font-bold text-[#263D32] block mb-1">Cover Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
            />
            {imageUrl && (
              <div className="mt-2 h-32 w-full max-w-sm rounded-xl overflow-hidden border border-[#E2E5DD]">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Location & Contact Coordinates */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-[#536B50]" /> Location &amp; Contact Channels
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#263D32] block mb-1">Region / City</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Rishikesh, Uttarakhand"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">Full Physical Postal Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, Ashram Ghat, Pin Code"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">Official Reception Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@yourashram.org"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">Direct Telephone / WhatsApp</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] block mb-1">Operating Hours / Ashram Schedule</label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                placeholder="e.g. 05:00 AM - 09:00 PM IST"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>
          </div>
        </div>

        {/* Social Presence */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center">
            <Globe className="w-4 h-4 mr-2 text-[#536B50]" /> Social Links &amp; Media Presence
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-[#263D32] flex items-center mb-1">
                <Instagram className="w-3.5 h-3.5 mr-1 text-pink-600" /> Instagram Handle / URL
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@ashram or url"
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] flex items-center mb-1">
                <Facebook className="w-3.5 h-3.5 mr-1 text-blue-600" /> Facebook Page URL
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>

            <div>
              <label className="font-bold text-[#263D32] flex items-center mb-1">
                <Youtube className="w-3.5 h-3.5 mr-1 text-red-600" /> YouTube Channel
              </label>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
              />
            </div>
          </div>
        </div>

        {/* Facilities & Amenities */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-[#263D32] flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-[#536B50]" /> Ashram Facilities &amp; Amenities
          </h3>

          <div className="flex flex-wrap gap-2">
            {facilities.map(fac => (
              <span
                key={fac}
                className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[#F7F5EE] text-[#263D32] border border-[#E2E5DD] font-medium"
              >
                {fac}
                <button
                  type="button"
                  onClick={() => handleRemoveFacility(fac)}
                  className="ml-2 text-gray-400 hover:text-rose-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 max-w-md pt-2">
            <input
              type="text"
              placeholder="e.g. Sound Healing Dome, Herbal Garden"
              value={newFacilityInput}
              onChange={(e) => setNewFacilityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFacility();
                }
              }}
              className="flex-1 p-2 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddFacility}
              className="px-4 py-2 bg-[#536B50] hover:bg-[#263D32] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Add Facility
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-[#536B50] hover:bg-[#263D32] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving to Database...' : 'Save Sanctuary Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
