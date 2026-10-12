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
    <div className="py-10 bg-[#F7F5EE] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Profile Header */}
        <div className="bg-white rounded-2xl p-8 border border-[#E2E5DD] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#263D32] text-[#F7F5EE] flex items-center justify-center font-serif font-bold text-2xl shadow-sm">
              EW
            </div>
            <div>
              <span className="bg-[#E6EDE2] text-[#263D32] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#A5B89A]/40">
                International Traveler Member
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#263D32] mt-1">
                Welcome, Emma Watson-Smith
              </h1>
              <span className="text-xs text-[#59665C]">Los Angeles, CA, USA • Member since 2026</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-[#F7F5EE] p-4 rounded-xl border border-[#E2E5DD] text-xs">
            <div>
              <span className="text-[#59665C] font-medium block">Active Bookings</span>
              <span className="font-serif font-bold text-lg text-[#263D32]">{bookings.length} Requests</span>
            </div>
            <div className="border-l border-[#E2E5DD] pl-3">
              <span className="text-[#59665C] font-medium block">Saved Wishlist</span>
              <span className="font-serif font-bold text-lg text-[#536B50]">{wishlist.length} Sanctuaries</span>
            </div>
          </div>
        </div>

        {/* Section 1: Active Booking Requests Pipeline */}
        <div className="bg-white rounded-2xl p-8 border border-[#E2E5DD] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-2xl text-[#263D32]">My Booking Requests</h2>
              <p className="text-xs text-[#59665C] mt-1">
                Requests are managed securely by our Platform Admin to guarantee zero spam and verified seat availability.
              </p>
            </div>
            <span className="bg-[#E6EDE2] text-[#286749] text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1 border border-[#A5B89A]/30">
              <ShieldCheck className="w-3.5 h-3.5 text-[#286749]" />
              <span>Escrow Protected</span>
            </span>
          </div>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="bg-[#F7F5EE]/60 p-6 rounded-xl border border-[#E2E5DD] flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs bg-[#E6EDE2] text-[#263D32] font-bold px-2 py-0.5 rounded border border-[#A5B89A]/40">
                        {b.referenceCode}
                      </span>

                      {/* Status Badges */}
                      {b.status === 'pending_admin' && (
                        <span className="bg-[#DCCDB5]/40 text-[#252C27] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#DCCDB5]">
                          <Clock className="w-3 h-3 text-[#536B50]" />
                          <span>Pending Admin Review</span>
                        </span>
                      )}

                      {b.status === 'assigned_to_centre' && (
                        <span className="bg-[#E6EDE2] text-[#263D32] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#A5B89A]/40">
                          <CheckCircle2 className="w-3 h-3 text-[#536B50]" />
                          <span>Seat Assigned at Ashram</span>
                        </span>
                      )}

                      {b.status === 'confirmed_paid' && (
                        <span className="bg-[#E6EDE2] text-[#286749] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-[#286749]/30">
                          <CheckCircle2 className="w-3 h-3 text-[#286749]" />
                          <span>Confirmed & Paid</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#263D32]">{b.courseTitle}</h3>
                    <span className="text-xs text-[#536B50] font-semibold block">{b.centreName}</span>

                    <div className="flex flex-wrap gap-4 text-xs text-[#59665C] pt-1">
                      <span>Start Date: <strong>{b.startDate}</strong></span>
                      <span>Duration: <strong>{b.durationDays} Days</strong></span>
                      <span>Room: <strong>{b.roomType}</strong></span>
                      <span>Travelers: <strong>{b.participantsCount} Person</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-[#59665C] font-semibold uppercase block">Total Package Amount</span>
                      <span className="font-serif font-bold text-2xl text-[#263D32]">{formatPrice(b.totalUSD)}</span>
                    </div>

                    <button 
                      onClick={() => alert(`Invoice Voucher downloaded for Reference ${b.referenceCode}`)}
                      className="bg-white hover:bg-[#E6EDE2] text-[#263D32] border border-[#E2E5DD] text-xs font-semibold px-3 py-2 rounded-lg transition flex items-center space-x-1 mt-2"
                    >
                      <Download className="w-3.5 h-3.5 text-[#536B50]" />
                      <span>Download Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#59665C] italic">No booking requests submitted yet.</p>
          )}
        </div>

        {/* Section 2: Wishlist Sanctuaries */}
        <div className="bg-white rounded-2xl p-8 border border-[#E2E5DD] shadow-sm space-y-6">
          <h2 className="font-serif font-bold text-2xl text-[#263D32]">Saved Wishlist ({wishlistedCentres.length})</h2>

          {wishlistedCentres.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wishlistedCentres.map((centre) => (
                <div key={centre.id} className="bg-[#F7F5EE]/60 p-4 rounded-xl border border-[#E2E5DD] flex items-center space-x-4">
                  <img src={centre.coverImage} alt={centre.name} className="w-24 h-24 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 space-y-1 text-xs">
                    <h4 className="font-serif font-bold text-base text-[#263D32]">{centre.name}</h4>
                    <span className="text-[#59665C] block">{centre.city}</span>
                    <span className="font-serif font-bold text-sm text-[#536B50] block">
                      From {formatPrice(centre.startingPriceUSD)}
                    </span>
                    <div className="pt-1 flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setSelectedCentreId(centre.id);
                          setActiveView('centre-detail');
                        }}
                        className="text-[#263D32] underline font-semibold hover:text-[#536B50]"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => toggleWishlist(centre.id)}
                        className="text-[#B42318] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#59665C] italic">Your wishlist is empty.</p>
          )}
        </div>

      </div>
    </div>
  );
};
