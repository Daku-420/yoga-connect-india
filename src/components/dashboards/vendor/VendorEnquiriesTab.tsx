'use client';

import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Mail, 
  Phone, 
  User, 
  BookOpen, 
  AlertCircle, 
  Send, 
  Eye, 
  X, 
  Check, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CentreEnquiry, Course, YogaCentre } from '../../../types';

interface VendorEnquiriesTabProps {
  activeCentre: YogaCentre;
  enquiries: CentreEnquiry[];
  courses: Course[];
  onUpdateEnquiry: (enquiryId: string, status: string, internalNotes?: string) => Promise<void>;
}

export const VendorEnquiriesTab: React.FC<VendorEnquiriesTabProps> = ({
  activeCentre,
  enquiries,
  courses,
  onUpdateEnquiry
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<CentreEnquiry | null>(null);
  const [internalNotesInput, setInternalNotesInput] = useState('');
  const [newStatusInput, setNewStatusInput] = useState<string>('new');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach(c => map.set(c.id, c));
    return map;
  }, [courses]);

  // Strict isolation: Only load enquiries belonging to activeCentre
  const myEnquiries = useMemo(() => {
    return enquiries.filter(e => e.centreId === activeCentre.id);
  }, [enquiries, activeCentre.id]);

  const filteredEnquiries = useMemo(() => {
    return myEnquiries.filter(e => {
      const q = searchQuery.toLowerCase().trim();
      const course = e.courseId ? courseMap.get(e.courseId) : null;
      const matchesSearch = !q ||
        e.customerName.toLowerCase().includes(q) ||
        e.customerEmail.toLowerCase().includes(q) ||
        (e.customerPhone && e.customerPhone.includes(q)) ||
        (e.message && e.message.toLowerCase().includes(q)) ||
        (course && course.title.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (statusFilter !== 'all' && e.status !== statusFilter) return false;

      return true;
    });
  }, [myEnquiries, searchQuery, statusFilter, courseMap]);

  const handleOpenDetail = (enquiry: CentreEnquiry) => {
    setSelectedEnquiry(enquiry);
    setInternalNotesInput(enquiry.internalNotes || '');
    setNewStatusInput(enquiry.status);
    setSuccessMsg('');
  };

  const handleSaveEnquiry = async () => {
    if (!selectedEnquiry) return;
    setIsSaving(true);
    setSuccessMsg('');
    try {
      await onUpdateEnquiry(selectedEnquiry.id, newStatusInput, internalNotesInput);
      setSelectedEnquiry(prev => prev ? {
        ...prev,
        status: newStatusInput as any,
        internalNotes: internalNotesInput,
        lastContactedAt: new Date().toISOString()
      } : null);
      setSuccessMsg('Enquiry status and internal notes updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(`Failed to save enquiry update: ${err.message || 'Error occurred'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" /> New Lead
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3 h-3 mr-1 text-blue-600" /> In Progress
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Send className="w-3 h-3 mr-1 text-purple-600" /> Contacted
          </span>
        );
      case 'converted':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Converted to Booking
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E5DD] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E6EDE2] text-[#263D32]">
              Inquiry Pipeline
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-500">
              {filteredEnquiries.length} queries assigned to your centre
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#263D32] mt-1">
            Enquiry &amp; Lead Management
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            Prospective sadhakas inquiring about teacher trainings, Ayurvedic retreats, or customized ashram stays at {activeCentre.name}.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E5DD] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search prospect by name, email, phone, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end text-xs">
          <span className="text-gray-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
          >
            <option value="all">All Enquiries</option>
            <option value="new">New Inquiries</option>
            <option value="in_progress">In Progress</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted to Booking</option>
            <option value="closed">Closed / Archived</option>
          </select>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-3">
        {filteredEnquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E5DD] p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#F7F5EE] flex items-center justify-center mx-auto mb-3 text-gray-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#263D32]">No enquiries found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              Direct inquiries from the website matchmaker and contact forms will be automatically assigned to your dashboard.
            </p>
          </div>
        ) : (
          filteredEnquiries.map(enq => {
            const course = enq.courseId ? courseMap.get(enq.courseId) : null;
            return (
              <div 
                key={enq.id}
                onClick={() => handleOpenDetail(enq)}
                className="bg-white rounded-2xl p-5 border border-[#E2E5DD] shadow-sm hover:border-[#536B50]/60 transition-all cursor-pointer group space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F7F5EE] pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E6EDE2] text-[#263D32] flex items-center justify-center font-bold text-sm shrink-0 border border-[#A5B89A]/30">
                      {enq.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#263D32] text-sm group-hover:text-[#536B50] transition-colors flex items-center">
                        {enq.customerName}
                        {enq.referenceCode && (
                          <span className="ml-2 font-mono text-[10px] bg-[#F7F5EE] px-1.5 py-0.5 rounded text-gray-500">
                            #{enq.referenceCode}
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-gray-500 flex items-center space-x-2">
                        <span>Received {new Date(enq.createdAt).toLocaleDateString()}</span>
                        {course && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-[#536B50]">{course.title}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(enq.status)}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(enq);
                      }}
                      className="px-3 py-1 bg-[#F7F5EE] hover:bg-[#E6EDE2] text-[#263D32] rounded-lg text-xs font-bold transition-colors"
                    >
                      Respond / Notes
                    </button>
                  </div>
                </div>

                {/* Message Excerpt */}
                <p className="text-xs text-gray-700 bg-[#F7F5EE]/60 p-3 rounded-xl border border-[#E2E5DD]/60 italic">
                  "{enq.message}"
                </p>

                {/* Footer details: Contact & Internal Notes */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-1 gap-2">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {enq.customerEmail}
                    </span>
                    {enq.customerPhone && (
                      <span className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {enq.customerPhone}
                      </span>
                    )}
                  </div>

                  {enq.internalNotes && (
                    <div className="text-[11px] text-[#536B50] font-medium flex items-center">
                      <MessageSquare className="w-3.5 h-3.5 mr-1" /> Has internal notes
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Enquiry Detail & Action Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#DCD6C8] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#263D32] text-white p-6 relative">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="absolute top-5 right-5 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#536B50] text-[#F7F5EE]">
                  Enquiry Dossier
                </span>
                {selectedEnquiry.referenceCode && (
                  <span className="font-mono text-xs text-gray-300">#{selectedEnquiry.referenceCode}</span>
                )}
              </div>

              <h3 className="text-xl font-serif font-bold text-[#F7F5EE] mt-1">
                {selectedEnquiry.customerName}
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Received on {new Date(selectedEnquiry.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
                  <span className="font-medium">{successMsg}</span>
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-[#F7F5EE] p-4 rounded-2xl border border-[#E2E5DD] space-y-2">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Contact Coordinates</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 block">Email:</span>
                    <a href={`mailto:${selectedEnquiry.customerEmail}`} className="font-bold text-[#263D32] hover:underline flex items-center mt-0.5">
                      <Mail className="w-3.5 h-3.5 mr-1 text-[#536B50]" /> {selectedEnquiry.customerEmail}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Phone:</span>
                    <span className="font-bold text-gray-800 flex items-center mt-0.5">
                      <Phone className="w-3.5 h-3.5 mr-1 text-[#536B50]" /> {selectedEnquiry.customerPhone || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inquiry Content */}
              <div>
                <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1">
                  Prospective Guest Inquiry Message
                </label>
                <div className="p-3 bg-white rounded-xl border border-[#E2E5DD] text-gray-800 leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="font-bold text-[#263D32] block mb-1">Update Status</label>
                <select
                  value={newStatusInput}
                  onChange={(e) => setNewStatusInput(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50] font-medium"
                >
                  <option value="new">New Lead (Needs Response)</option>
                  <option value="in_progress">In Progress (Evaluating Dates / Rooms)</option>
                  <option value="contacted">Contacted (Emailed / Called Guest)</option>
                  <option value="converted">Converted to Booking (Reservation Made)</option>
                  <option value="closed">Closed / Archived</option>
                </select>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="font-bold text-[#263D32] block mb-1">Internal Notes &amp; Follow-up Log</label>
                <textarea
                  rows={3}
                  value={internalNotesInput}
                  onChange={(e) => setInternalNotesInput(e.target.value)}
                  placeholder="Record call logs, price quotes discussed, or room availability notes here..."
                  className="w-full p-2.5 bg-[#F7F5EE] border border-[#E2E5DD] rounded-xl text-xs text-[#263D32] focus:outline-none focus:ring-2 focus:ring-[#536B50]"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#F7F5EE] px-6 py-4 border-t border-[#E2E5DD] flex items-center justify-between">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-medium border border-[#DCD6C8]"
              >
                Close
              </button>
              <button
                onClick={handleSaveEnquiry}
                disabled={isSaving}
                className="px-5 py-2 bg-[#536B50] hover:bg-[#263D32] text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center"
              >
                <Check className="w-4 h-4 mr-1.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
