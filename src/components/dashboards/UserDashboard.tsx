import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Heart, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Download
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { 
    bookings, 
    centres, 
    wishlist, 
    toggleWishlist, 
    formatPrice, 
    setSelectedCentreId, 
    setActiveView,
    currency
  } = useApp();

  const wishlistedCentres = centres.filter(c => wishlist.includes(c.id));

  return (
    <div className="py-10 bg-sand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Profile Header */}
        <div className="bg-white rounded-3xl p-8 border border-sand-300 shadow-luxury flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-serif font-bold text-2xl shadow">
              EW
            </div>
            <div>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                International Traveler Member
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-sage-950 mt-1">
                Welcome, Emma Watson-Smith
              </h1>
              <span className="text-xs text-sage-600">Los Angeles, CA, USA • Member since 2026</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-sand-100 p-4 rounded-2xl border border-sand-200 text-xs">
            <div>
              <span className="text-sage-500 font-medium block">Active Bookings</span>
              <span className="font-serif font-bold text-lg text-sage-950">{bookings.length} Requests</span>
            </div>
            <div className="border-l border-sand-300 pl-3">
              <span className="text-sage-500 font-medium block">Saved Wishlist</span>
              <span className="font-serif font-bold text-lg text-terracotta-600">{wishlist.length} Sanctuaries</span>
            </div>
          </div>
        </div>

        {/* Section 1: Active Booking Requests Pipeline */}
        <div className="bg-white rounded-3xl p-8 border border-sand-300 shadow-luxury space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-2xl text-sage-950">My Booking Requests</h2>
              <p className="text-xs text-sage-600 mt-1">
                Requests are managed securely by our Platform Admin to guarantee zero spam and verified seat availability.
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Escrow Protected</span>
            </span>
          </div>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="bg-sand-50 p-6 rounded-2xl border border-sand-300 flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs bg-sand-200 text-sage-900 font-bold px-2 py-0.5 rounded">
                        {b.referenceCode}
                      </span>

                      {/* Status Badges */}
                      {b.status === 'pending_admin' && (
                        <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending Admin Review</span>
                        </span>
                      )}

                      {b.status === 'assigned_to_centre' && (
                        <span className="bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-teal-700" />
                          <span>Seat Assigned at Ashram</span>
                        </span>
                      )}

                      {b.status === 'confirmed_paid' && (
                        <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Confirmed & Paid</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl text-sage-950">{b.courseTitle}</h3>
                    <span className="text-xs text-terracotta-600 font-semibold block">{b.centreName}</span>

                    <div className="flex flex-wrap gap-4 text-xs text-sage-700 pt-1">
                      <span>Start Date: <strong>{b.startDate}</strong></span>
                      <span>Duration: <strong>{b.durationDays} Days</strong></span>
                      <span>Room: <strong>{b.roomType}</strong></span>
                      <span>Travelers: <strong>{b.participantsCount} Person</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-sage-500 font-semibold uppercase block">Total Package Amount</span>
                      <span className="font-serif font-bold text-2xl text-sage-950">{formatPrice(b.totalUSD)}</span>
                    </div>

                    <button 
                      onClick={() => alert(`Invoice Voucher downloaded for Reference ${b.referenceCode}`)}
                      className="bg-sand-200 hover:bg-sand-300 text-sage-900 text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center space-x-1 mt-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-sage-500 italic">No booking requests submitted yet.</p>
          )}
        </div>

        {/* Section 2: Wishlist Sanctuaries */}
        <div className="bg-white rounded-3xl p-8 border border-sand-300 shadow-luxury space-y-6">
          <h2 className="font-serif font-bold text-2xl text-sage-950">Saved Wishlist ({wishlistedCentres.length})</h2>

          {wishlistedCentres.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wishlistedCentres.map((centre) => (
                <div key={centre.id} className="bg-sand-50 p-4 rounded-2xl border border-sand-300 flex items-center space-x-4">
                  <img src={centre.coverImage} alt={centre.name} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 space-y-1 text-xs">
                    <h4 className="font-serif font-bold text-base text-sage-950">{centre.name}</h4>
                    <span className="text-sage-600 block">{centre.city}</span>
                    <span className="font-serif font-bold text-sm text-terracotta-600 block">
                      From {formatPrice(centre.startingPriceUSD)}
                    </span>
                    <div className="pt-1 flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCentreId(centre.id);
                          setActiveView('centre-detail');
                        }}
                        className="text-sage-900 underline font-semibold"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => toggleWishlist(centre.id)}
                        className="text-terracotta-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-sage-500 italic">Your wishlist is empty.</p>
          )}
        </div>

      </div>
    </div>
  );
};
