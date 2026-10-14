'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { BookingRequest, Course, YogaCentre } from '../../../types';

interface VendorCustomersTabProps {
  activeCentre: YogaCentre;
  bookings: BookingRequest[];
  courses: Course[];
  formatPrice: (amount: number) => string;
  onSelectBookingDetail?: (booking: BookingRequest) => void;
}

interface CustomerRecord {
  email: string;
  name: string;
  phone: string;
  totalBookings: number;
  completedBookings: number;
  totalSpendUSD: number;
  firstBookingDate: string;
  lastBookingDate: string;
  bookings: BookingRequest[];
  isDisclosed: boolean;
}

export const VendorCustomersTab: React.FC<VendorCustomersTabProps> = ({
  activeCentre,
  bookings,
  courses,
  formatPrice,
  onSelectBookingDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'spend' | 'bookings'>('recent');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Group strictly by centre's own bookings
  const customers = useMemo(() => {
    const map = new Map<string, CustomerRecord>();

    bookings.forEach(b => {
      // Must be this centre's booking
      if (b.centreId !== activeCentre.id) return;

      const gEmail = b.guestEmail || b.customerEmail || '';
      const gName = b.guestName || b.customerName || 'Guest';
      const gPhone = b.guestPhone || b.customerPhone || '';

      const emailKey = gEmail.toLowerCase().trim();
      if (!emailKey) return;
      const existing = map.get(emailKey);

      const isBookingDisclosed = b.status !== 'cancelled' && b.status !== 'pending_admin';

      if (!existing) {
        map.set(emailKey, {
          email: gEmail,
          name: gName,
          phone: gPhone,
          totalBookings: 1,
          completedBookings: b.status === 'completed' ? 1 : 0,
          totalSpendUSD: b.totalPriceUSD || b.totalUSD || 0,
          firstBookingDate: b.createdAt,
          lastBookingDate: b.createdAt,
          bookings: [b],
          isDisclosed: isBookingDisclosed
        });
      } else {
        existing.totalBookings += 1;
        if (b.status === 'completed') existing.completedBookings += 1;
        existing.totalSpendUSD += b.totalPriceUSD || b.totalUSD || 0;
        if (new Date(b.createdAt) < new Date(existing.firstBookingDate)) {
          existing.firstBookingDate = b.createdAt;
        }
        if (new Date(b.createdAt) > new Date(existing.lastBookingDate)) {
          existing.lastBookingDate = b.createdAt;
        }
        existing.bookings.push(b);
        if (isBookingDisclosed) existing.isDisclosed = true;
      }
    });

    return Array.from(map.values());
  }, [bookings, activeCentre.id]);

  // Course map for lookup
  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach(c => map.set(c.id, c));
    return map;
  }, [courses]);

  // Filter & Sort
  const filteredCustomers = useMemo(() => {
    return customers
      .filter(c => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'spend') return b.totalSpendUSD - a.totalSpendUSD;
        if (sortBy === 'bookings') return b.totalBookings - a.totalBookings;
        return new Date(b.lastBookingDate).getTime() - new Date(a.lastBookingDate).getTime();
      });
  }, [customers, searchQuery, sortBy]);

  const maskContact = (val: string, type: 'email' | 'phone') => {
    if (type === 'email') {
      const parts = val.split('@');
      if (parts.length < 2) return '••••@••••.com';
      return `${parts[0].slice(0, 2)}••••@${parts[1]}`;
    }
    return val.length > 5 ? `${val.slice(0, 3)}••••${val.slice(-2)}` : '••••••••••';
  };

  const handleExportCSV = () => {
    const headers = [
      'Customer Name',
      'Email (Authorized)',
      'Phone (Authorized)',
      'Total Bookings',
      'Completed Stays',
      'Lifetime Spend (USD)',
      'First Reservation Date',
      'Last Reservation Date'
    ];

    const rows = filteredCustomers.map(c => [
      `"${c.name}"`,
      `"${c.isDisclosed ? c.email : maskContact(c.email, 'email')}"`,
      `"${c.isDisclosed ? (c.phone || '-') : maskContact(c.phone || '9876543210', 'phone')}"`,
      c.totalBookings,
      c.completedBookings,
      c.totalSpendUSD,
      `"${new Date(c.firstBookingDate).toLocaleDateString()}"`,
      `"${new Date(c.lastBookingDate).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeCentre.name.replace(/\s+/g, '_')}_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E6EDE2] text-[#263D32]">
              Sadhaka Directory
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-500">
              {filteredCustomers.length} verified guests
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#263D32] mt-1">
            Customer Directory
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Directory of yoga practitioners who have reserved immersions with {activeCentre.name}. Cross-centre privacy rules are strictly enforced.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 bg-[#F7F5EE] hover:bg-[#ECE8DD] text-[#263D32] rounded-xl text-xs font-bold border border-[#DCD6C8] transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Guests CSV
          </button>
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E5DD] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end text-xs">
          <span className="text-gray-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
          >
            <option value="recent">Most Recent Booking</option>
            <option value="spend">Highest Lifetime Spend</option>
            <option value="bookings">Most Bookings</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#E2E5DD] shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F7F5EE] flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#263D32]">No customers found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              Customers will automatically appear here once guests book courses or retreats at {activeCentre.name}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EE] text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-[#E2E5DD]">
                <tr>
                  <th className="py-3 px-4">Guest Details</th>
                  <th className="py-3 px-4">Contact Channel</th>
                  <th className="py-3 px-4 text-center">Bookings</th>
                  <th className="py-3 px-4">Lifetime Spend</th>
                  <th className="py-3 px-4">Last Reserved</th>
                  <th className="py-3 px-4 text-right">History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5DD]">
                {filteredCustomers.map(c => (
                  <tr 
                    key={c.email}
                    className="hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                    onClick={() => setSelectedCustomer(c)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#E6EDE2] text-[#263D32] flex items-center justify-center font-bold text-sm shrink-0 border border-[#A5B89A]/40">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#263D32] text-sm flex items-center">
                            {c.name}
                            {c.completedBookings > 0 && (
                              <span title="Completed previous retreat with your centre" className="ml-1 text-amber-500">
                                <Sparkles className="w-3.5 h-3.5 inline" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            First visited: {new Date(c.firstBookingDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-700">
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          <span>{c.isDisclosed ? c.email : maskContact(c.email, 'email')}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-[11px]">
                          <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          <span>
                            {c.isDisclosed 
                              ? (c.phone || 'No phone recorded') 
                              : maskContact(c.phone || '9876543210', 'phone')}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F7F5EE] text-[#263D32] border border-[#E2E5DD]">
                        {c.totalBookings} reservation{c.totalBookings > 1 ? 's' : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#263D32]">
                      {formatPrice(c.totalSpendUSD)}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      {new Date(c.lastBookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(c);
                        }}
                        className="px-3 py-1 bg-white hover:bg-[#F7F5EE] text-[#536B50] rounded-lg border border-[#A5B89A]/60 font-semibold text-xs shadow-sm transition-colors inline-flex items-center"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#DCD6C8] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#263D32] text-white p-6 relative">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-5 right-5 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#536B50] text-[#F7F5EE] flex items-center justify-center font-serif font-bold text-xl border border-[#A5B89A]/40">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#F7F5EE]">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Practitioner at {activeCentre.name} • {selectedCustomer.totalBookings} total booking(s)
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
              {/* Metrics Bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                  <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Lifetime Value</span>
                  <div className="text-base font-bold text-[#263D32]">
                    {formatPrice(selectedCustomer.totalSpendUSD)}
                  </div>
                </div>

                <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                  <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Completed Stays</span>
                  <div className="text-base font-bold text-gray-800">
                    {selectedCustomer.completedBookings}
                  </div>
                </div>

                <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                  <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">First Joined</span>
                  <div className="text-xs font-bold text-gray-700 mt-1">
                    {new Date(selectedCustomer.firstBookingDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-4 border border-[#E2E5DD] space-y-2">
                <h4 className="font-bold text-[#263D32] flex items-center">
                  <User className="w-4 h-4 mr-1.5 text-[#536B50]" /> Verified Contact Profile
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Email</span>
                    <span className="font-semibold text-gray-800 flex items-center mt-0.5">
                      <Mail className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {selectedCustomer.isDisclosed ? selectedCustomer.email : maskContact(selectedCustomer.email, 'email')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Phone</span>
                    <span className="font-semibold text-gray-800 flex items-center mt-0.5">
                      <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {selectedCustomer.isDisclosed 
                        ? (selectedCustomer.phone || 'Not recorded') 
                        : maskContact(selectedCustomer.phone || '9876543210', 'phone')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complete Booking History for Active Centre */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#263D32] flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-[#536B50]" /> Reservations with {activeCentre.name}
                </h4>
                <div className="space-y-2">
                  {selectedCustomer.bookings.map(b => {
                    const course = courseMap.get(b.courseId);
                    return (
                      <div 
                        key={b.id} 
                        className="bg-[#F7F5EE] p-3.5 rounded-xl border border-[#E2E5DD] flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-[#263D32] text-xs">
                            {course?.title || 'Yoga Immersion Program'}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5 flex items-center space-x-2">
                            <span>{b.startDate ? new Date(b.startDate).toLocaleDateString() : 'Flexible'}</span>
                            <span>•</span>
                            <span>{formatPrice(b.totalPriceUSD || b.totalUSD || 0)}</span>
                            <span>•</span>
                            <span className="capitalize font-medium text-emerald-800">{b.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-gray-400 bg-white px-2 py-1 rounded border border-[#E2E5DD]">
                          {b.id.slice(0, 10)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#F7F5EE] px-6 py-4 border-t border-[#E2E5DD] flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-white text-[#263D32] hover:bg-gray-100 rounded-xl text-xs font-bold border border-[#DCD6C8]"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
