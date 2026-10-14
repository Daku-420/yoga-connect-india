'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Phone, 
  Mail, 
  User, 
  BookOpen, 
  DollarSign, 
  Lock, 
  ShieldCheck, 
  Check, 
  X, 
  Sparkles,
  FileSpreadsheet,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { BookingRequest, Course, YogaCentre, BookingStatus } from '../../../types';

interface VendorBookingsTabProps {
  activeCentre: YogaCentre;
  bookings: BookingRequest[];
  courses: Course[];
  formatPrice: (amount: number) => string;
  onUpdateBookingStatus: (bookingId: string, newStatus: BookingStatus, vendorNotes?: string) => Promise<void>;
}

export const VendorBookingsTab: React.FC<VendorBookingsTabProps> = ({
  activeCentre,
  bookings,
  courses,
  formatPrice,
  onUpdateBookingStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Detail Modal State
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [vendorNotesInput, setVendorNotesInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Course map for easy lookup
  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach(c => map.set(c.id, c));
    return map;
  }, [courses]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const course = courseMap.get(b.courseId);
      const matchesSearch = !q || 
        b.id.toLowerCase().includes(q) ||
        (b.guestName || b.customerName || '').toLowerCase().includes(q) ||
        (b.guestEmail || b.customerEmail || '').toLowerCase().includes(q) ||
        (course?.title.toLowerCase().includes(q) ?? false);

      if (!matchesSearch) return false;

      // Status Filter
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;

      // Course Filter
      if (courseFilter !== 'all' && b.courseId !== courseFilter) return false;

      // Payment Status Filter
      if (paymentFilter !== 'all') {
        const pStatus = b.paymentStatus || (b.status === 'confirmed_paid' ? 'paid_full' : 'unverified_pending');
        if (pStatus !== paymentFilter) return false;
      }

      // Date Filter
      if (dateFilter !== 'all') {
        const bookingDate = new Date(b.startDate || b.createdAt).getTime();
        const now = Date.now();
        if (dateFilter === 'upcoming') {
          if (bookingDate < now) return false;
        } else if (dateFilter === 'past') {
          if (bookingDate >= now) return false;
        } else if (dateFilter === '30days') {
          if (bookingDate < now - 30 * 86400000 || bookingDate > now + 30 * 86400000) return false;
        }
      }

      return true;
    });
  }, [bookings, searchQuery, statusFilter, courseFilter, paymentFilter, dateFilter, courseMap]);

  // Customer Contact Disclosure: Only revealed when legitimately assigned & not cancelled/unassigned
  const isContactDisclosed = (booking: BookingRequest) => {
    return (
      booking.centreId === activeCentre.id &&
      booking.status !== 'cancelled' &&
      booking.status !== 'pending_admin'
    );
  };

  const maskContact = (val: string, type: 'email' | 'phone') => {
    if (type === 'email') {
      const parts = val.split('@');
      if (parts.length < 2) return '••••@••••.com';
      return `${parts[0].slice(0, 2)}••••@${parts[1]}`;
    }
    return val.length > 5 ? `${val.slice(0, 3)}••••${val.slice(-2)}` : '••••••••••';
  };

  const handleOpenDetail = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setVendorNotesInput(booking.vendorNotes || '');
    setActionSuccessMsg('');
  };

  const handleStatusUpdate = async (newStatus: BookingStatus) => {
    if (!selectedBooking) return;
    setIsUpdating(true);
    setActionSuccessMsg('');
    try {
      await onUpdateBookingStatus(selectedBooking.id, newStatus, vendorNotesInput);
      setSelectedBooking(prev => prev ? { ...prev, status: newStatus, vendorNotes: vendorNotesInput } : null);
      setActionSuccessMsg(`Booking status successfully updated to ${newStatus.replace('_', ' ')}.`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(`Failed to update booking status: ${err.message || 'Error occurred'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedBooking) return;
    setIsUpdating(true);
    try {
      await onUpdateBookingStatus(selectedBooking.id, selectedBooking.status, vendorNotesInput);
      setSelectedBooking(prev => prev ? { ...prev, vendorNotes: vendorNotesInput } : null);
      setActionSuccessMsg('Internal vendor notes saved successfully.');
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(`Failed to save notes: ${err.message || 'Error occurred'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // CSV Export for Vendor's Authorized Bookings
  const handleExportCSV = () => {
    const headers = [
      'Booking ID',
      'Guest Name',
      'Course',
      'Start Date',
      'End Date',
      'Participants',
      'Total Amount (USD)',
      'Payment Status',
      'Booking Status',
      'Created At'
    ];
    const rows = filteredBookings.map(b => {
      const course = courseMap.get(b.courseId);
      return [
        `"${b.id}"`,
        `"${b.guestName || b.customerName || 'Guest'}"`,
        `"${course?.title || 'Yoga Immersion'}"`,
        `"${b.startDate || '-'}"`,
        `"${b.endDate || '-'}"`,
        b.participantsCount || 1,
        b.totalPriceUSD || 0,
        `"${b.paymentStatus || (b.status === 'confirmed_paid' ? 'paid_full' : 'unverified_pending')}"`,
        `"${b.status}"`,
        `"${new Date(b.createdAt).toLocaleDateString()}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeCentre.name.replace(/\s+/g, '_')}_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed_paid':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Confirmed & Paid
          </span>
        );
      case 'assigned_to_centre':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" /> Action Required (Assigned)
          </span>
        );
      case 'pending_admin':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Admin Review
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status?: string, bookingStatus?: BookingStatus) => {
    const s = status || (bookingStatus === 'confirmed_paid' ? 'paid_full' : 'unverified_pending');
    switch (s) {
      case 'paid_full':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Paid in Full</span>;
      case 'paid_deposit':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">Deposit Received</span>;
      case 'refunded':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">Refunded</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">Unverified / Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Stats */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E6EDE2] text-[#263D32]">
              Reservations Roster
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-500">
              {filteredBookings.length} of {bookings.length} records shown
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#263D32] mt-1">
            Booking Management
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Real-time reservations for {activeCentre.name}. All customer disclosures follow platform privacy policies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 bg-[#F7F5EE] hover:bg-[#ECE8DD] text-[#263D32] rounded-xl text-xs font-bold border border-[#DCD6C8] transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E5DD] shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, guest name, course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
            >
              <option value="all">All Booking Statuses</option>
              <option value="confirmed_paid">Confirmed &amp; Paid</option>
              <option value="assigned_to_centre">Assigned to Centre (Action Required)</option>
              <option value="pending_admin">Pending Admin Review</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
            >
              <option value="all">All Courses / Packages</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid_full">Paid in Full</option>
              <option value="paid_deposit">Paid Deposit</option>
              <option value="unverified_pending">Unverified / Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Date Filter Badges */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto text-xs">
          <span className="text-gray-400 font-medium">Timeline:</span>
          {['all', 'upcoming', '30days', 'past'].map(opt => (
            <button
              key={opt}
              onClick={() => setDateFilter(opt)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                dateFilter === opt
                  ? 'bg-[#263D32] text-white'
                  : 'bg-[#F7F5EE] text-gray-600 hover:bg-[#ECE8DD]'
              }`}
            >
              {opt === 'all' ? 'All Dates' : opt === 'upcoming' ? 'Upcoming' : opt === '30days' ? '±30 Days' : 'Past Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-[#E2E5DD] shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F7F5EE] flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#263D32]">No matching bookings found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              {bookings.length === 0 
                ? 'Your centre does not have any bookings yet. Bookings from guests will show up here in real time.'
                : 'Try adjusting your search criteria or resetting filters to see your reservations.'}
            </p>
            {bookings.length > 0 && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCourseFilter('all');
                  setPaymentFilter('all');
                  setDateFilter('all');
                }}
                className="mt-3 px-3.5 py-1.5 bg-[#536B50] text-white rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EE] text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-[#E2E5DD]">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Course / Immersion</th>
                  <th className="py-3 px-4">Dates &amp; Pax</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5DD]">
                {filteredBookings.map(b => {
                  const course = courseMap.get(b.courseId);
                  const disclosed = isContactDisclosed(b);
                  return (
                    <tr 
                      key={b.id} 
                      className="hover:bg-[#FAF9F5] transition-colors cursor-pointer group"
                      onClick={() => handleOpenDetail(b)}
                    >
                      <td className="py-3 px-4 font-mono font-medium text-gray-600">
                        <span className="bg-[#F7F5EE] px-2 py-1 rounded border border-[#E2E5DD]">
                          {b.id.slice(0, 13)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-[#263D32] flex items-center">
                          {b.guestName || b.customerName}
                          {!disclosed && (
                            <span title="Contact info masked until booking confirmed" className="ml-1 text-gray-400">
                              <Lock className="w-3 h-3 inline" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {disclosed ? (b.guestEmail || b.customerEmail) : maskContact(b.guestEmail || b.customerEmail, 'email')}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-800 line-clamp-1">
                          {course?.title || 'Yoga Immersion'}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Category: {course?.category || 'Teacher Training'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-700">
                          {b.startDate ? new Date(b.startDate).toLocaleDateString() : 'Flexible Start'}
                          {b.endDate && ` → ${new Date(b.endDate).toLocaleDateString()}`}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {b.participantsCount || 1} Participant{(b.participantsCount || 1) > 1 ? 's' : ''}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-[#263D32]">
                        {formatPrice(b.totalPriceUSD || b.totalUSD || 0)}
                      </td>

                      <td className="py-3 px-4">
                        {getPaymentBadge(b.paymentStatus, b.status)}
                      </td>

                      <td className="py-3 px-4">
                        {getStatusBadge(b.status)}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenDetail(b)}
                          className="px-3 py-1 bg-white hover:bg-[#F7F5EE] text-[#536B50] rounded-lg border border-[#A5B89A]/60 font-semibold text-xs shadow-sm transition-colors inline-flex items-center"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#DCD6C8] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#263D32] text-white p-6 relative">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-5 right-5 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#536B50] text-[#F7F5EE]">
                  Reservation Audit
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="font-mono text-xs text-gray-300">{selectedBooking.id}</span>
              </div>

              <h3 className="text-xl font-serif font-bold text-[#F7F5EE] mt-1">
                {courseMap.get(selectedBooking.courseId)?.title || 'Yoga Program Reservation'}
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Booked on {new Date(selectedBooking.createdAt).toLocaleDateString()} for {activeCentre.name}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {actionSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                  <span className="font-medium">{actionSuccessMsg}</span>
                </div>
              )}

              {/* Status & Payment Overview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                  <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Status</span>
                  <div>{getStatusBadge(selectedBooking.status)}</div>
                </div>

                <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                  <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Payment</span>
                  <div>{getPaymentBadge(selectedBooking.paymentStatus, selectedBooking.status)}</div>
                </div>

                <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                  <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Total Fee</span>
                  <div className="text-sm font-bold text-[#263D32]">
                    {formatPrice(selectedBooking.totalPriceUSD || selectedBooking.totalUSD || 0)}
                  </div>
                </div>

                <div className="bg-[#F7F5EE] p-3 rounded-xl border border-[#E2E5DD]">
                  <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Participants</span>
                  <div className="text-sm font-bold text-gray-700">
                    {selectedBooking.participantsCount || 1} Guest{(selectedBooking.participantsCount || 1) > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Customer Info & Privacy Banner */}
              <div className="bg-white rounded-2xl p-4 border border-[#E2E5DD] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#263D32] flex items-center">
                    <User className="w-4 h-4 mr-1.5 text-[#536B50]" /> Guest Contact Profile
                  </h4>
                  {isContactDisclosed(selectedBooking) ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Disclosed Under Confirmed Booking Policy
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      <Lock className="w-3 h-3 mr-1" /> Contact Masked (Pending Confirmation)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-gray-400 text-[10px] uppercase font-bold">Full Name</label>
                    <p className="font-bold text-gray-800 text-sm">{selectedBooking.guestName || selectedBooking.customerName}</p>
                  </div>

                  <div>
                    <label className="text-gray-400 text-[10px] uppercase font-bold">Email Address</label>
                    <p className="font-medium text-gray-700 flex items-center mt-0.5">
                      <Mail className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {isContactDisclosed(selectedBooking) 
                        ? (selectedBooking.guestEmail || selectedBooking.customerEmail) 
                        : maskContact(selectedBooking.guestEmail || selectedBooking.customerEmail, 'email')}
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-400 text-[10px] uppercase font-bold">Phone / WhatsApp</label>
                    <p className="font-medium text-gray-700 flex items-center mt-0.5">
                      <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {isContactDisclosed(selectedBooking) 
                        ? (selectedBooking.guestPhone || selectedBooking.customerPhone || 'Not provided')
                        : maskContact(selectedBooking.guestPhone || selectedBooking.customerPhone || '9876543210', 'phone')}
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-400 text-[10px] uppercase font-bold">Assigned Centre</label>
                    <p className="font-semibold text-[#536B50] mt-0.5">{activeCentre.name}</p>
                  </div>
                </div>

                {!isContactDisclosed(selectedBooking) && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start">
                    <AlertCircle className="w-4 h-4 mr-1.5 shrink-0 text-amber-600 mt-0.5" />
                    <span>
                      Customer direct telephone and personal email are protected by platform privacy rules. Once you confirm this booking or once the admin marks it active, full credentials unlock automatically.
                    </span>
                  </div>
                )}
              </div>

              {/* Course & Schedule Details */}
              <div className="bg-white rounded-2xl p-4 border border-[#E2E5DD] shadow-sm space-y-3">
                <h4 className="font-bold text-[#263D32] flex items-center">
                  <BookOpen className="w-4 h-4 mr-1.5 text-[#536B50]" /> Course Schedule &amp; Dates
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-[10px] uppercase font-bold">Start Date</label>
                    <p className="font-bold text-gray-800">
                      {selectedBooking.startDate ? new Date(selectedBooking.startDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Flexible'}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-[10px] uppercase font-bold">End Date</label>
                    <p className="font-bold text-gray-800">
                      {selectedBooking.endDate ? new Date(selectedBooking.endDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Determined on arrival'}
                    </p>
                  </div>
                </div>

                {selectedBooking.specialRequirements && (
                  <div className="pt-2 border-t border-[#E2E5DD]">
                    <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">
                      Customer Special Requirements / Health Notes
                    </label>
                    <div className="p-3 bg-[#F7F5EE] rounded-xl text-gray-700 italic border border-[#E2E5DD]">
                      "{selectedBooking.specialRequirements}"
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Vendor Notes */}
              <div className="bg-white rounded-2xl p-4 border border-[#E2E5DD] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#263D32] flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1.5 text-[#536B50]" /> Private Ashram / Centre Notes
                  </label>
                  <button
                    onClick={handleSaveNotes}
                    disabled={isUpdating}
                    className="px-3 py-1 bg-[#536B50] hover:bg-[#263D32] text-white rounded-lg font-bold text-[11px] transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={vendorNotesInput}
                  onChange={(e) => setVendorNotesInput(e.target.value)}
                  placeholder="Record room assignments, diet preferences, or arrival details here (private to your centre staff)..."
                  className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                />
              </div>

              {/* Permitted Status Actions for Vendor */}
              <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E2E5DD] space-y-3">
                <h4 className="font-bold text-[#263D32]">Authorized Centre Actions</h4>
                <p className="text-[11px] text-gray-500">
                  You can confirm acceptance of this guest or mark their training retreat completed once concluded. Financial modifications require administrative review.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedBooking.status === 'assigned_to_centre' && (
                    <button
                      onClick={() => handleStatusUpdate('confirmed_paid')}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs inline-flex items-center shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Accept &amp; Confirm Booking
                    </button>
                  )}

                  {selectedBooking.status === 'confirmed_paid' && (
                    <button
                      onClick={() => handleStatusUpdate('completed')}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs inline-flex items-center shadow-sm transition-colors"
                    >
                      <Sparkles className="w-4 h-4 mr-1.5" /> Mark Training Completed
                    </button>
                  )}

                  {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to decline / cancel this reservation? This will trigger notification to administration.')) {
                          handleStatusUpdate('cancelled');
                        }
                      }}
                      disabled={isUpdating}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold text-xs border border-rose-200 transition-colors inline-flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" /> Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#F7F5EE] px-6 py-4 border-t border-[#E2E5DD] flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                Audit Trail ID: <span className="font-mono">{selectedBooking.id}</span>
              </span>
              <button
                onClick={() => setSelectedBooking(null)}
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
