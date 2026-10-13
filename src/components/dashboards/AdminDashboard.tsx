import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus } from '../../types';
import { 
  Crown, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Lock, 
  TrendingUp, 
  FileText, 
  Gift, 
  Sparkles,
  Search,
  Bell,
  Sliders,
  PlusCircle
} from 'lucide-react';

import { PREDEFINED_QUESTION_TEMPLATES } from '../../data/mockMatchmakers';
import { AsanaManagerTab } from '../admin/AsanaManagerTab';

export const AdminDashboard: React.FC = () => {
  const { 
    bookings, 
    updateBookingStatus, 
    centres, 
    courses, 
    formatPrice,
    setIsSchemaModalOpen,
    setIsAddCentreOpen,
    matchmakerConfigs,
    setAdminMatchmakerDisabled,
    matchmakerAnalytics,
    matchmakerLeads,
    openCentreMatchmaker
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'centres' | 'revenue' | 'coupons' | 'matchmakers' | 'asanas'>('bookings');
  const [unmaskedBookingIds, setUnmaskedBookingIds] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('YOGA2026');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [couponList, setCouponList] = useState([
    { code: 'YOGA2026', discount: 10, usage: 48 },
    { code: 'NAMASTE15', discount: 15, usage: 19 }
  ]);

  const totalPlatformStarts = Object.values(matchmakerAnalytics).reduce((sum, s) => sum + s.startsCount, 0);
  const totalPlatformCompletions = Object.values(matchmakerAnalytics).reduce((sum, s) => sum + s.completionsCount, 0);
  const platformAvgConversion = totalPlatformCompletions > 0 
    ? ((matchmakerLeads.length / totalPlatformCompletions) * 100).toFixed(1)
    : '0.0';

  const toggleMask = (id: string) => {
    setUnmaskedBookingIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalGMV = bookings.reduce((sum, b) => sum + b.totalUSD, 0);
  const totalCommissionRevenue = totalGMV * 0.15; // 15% marketplace commission

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode) {
      setCouponList(prev => [...prev, { code: couponCode.toUpperCase(), discount: discountPercent, usage: 0 }]);
      setCouponCode('');
    }
  };

  return (
    <div className="py-10 bg-sage-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-purple-950 via-sage-900 to-purple-950 rounded-3xl p-8 border border-purple-800/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 text-sage-950 flex items-center justify-center font-bold shadow-xl">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-gold-400 text-sage-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Platform Owner Command Center
                </span>
                <span className="bg-purple-800 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  Full Escrow Control
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-sand-50 mt-1">
                YogaConnect India Master Control Panel
              </h1>
              <span className="text-xs text-sage-300">Managing Inquiries, Customer Privacy Escrow, Commissions & SEO</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddCentreOpen(true)}
              className="bg-gold-500 hover:bg-gold-400 text-sage-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Upload Centre (Admin)</span>
            </button>
            <button
              onClick={() => setIsSchemaModalOpen(true)}
              className="bg-sage-900 hover:bg-sage-800 text-gold-400 border border-gold-400/40 font-medium px-4 py-2.5 rounded-xl text-xs shadow transition flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Inspect SEO Schema</span>
            </button>
          </div>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-sage-900/60 p-5 rounded-2xl border border-sage-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sage-400 block">Total Booking Inquiries GMV</span>
            <span className="font-serif font-bold text-2xl text-gold-400">{formatPrice(totalGMV)}</span>
          </div>

          <div className="bg-sage-900/60 p-5 rounded-2xl border border-sage-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sage-400 block">Net Platform Commission (15%)</span>
            <span className="font-serif font-bold text-2xl text-emerald-400">{formatPrice(totalCommissionRevenue)}</span>
          </div>

          <div className="bg-sage-900/60 p-5 rounded-2xl border border-sage-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sage-400 block">Verified Ashrams Partnered</span>
            <span className="font-serif font-bold text-2xl text-white">{centres.length} Centres</span>
          </div>

          <div className="bg-sage-900/60 p-5 rounded-2xl border border-sage-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sage-400 block">Escrow Lead Pipeline</span>
            <span className="font-serif font-bold text-2xl text-[#A5B89A]">{bookings.length} Active Leads</span>
          </div>
        </div>

        {/* Tab Header Navigation */}
        <div className="border-b border-sage-800 flex space-x-6 text-sm font-semibold text-sage-300">
          {[
            { id: 'bookings', label: `Lead Pipeline & Escrow (${bookings.length})` },
            { id: 'matchmakers', label: `Centre Matchmaker Moderation (${centres.length})` },
            { id: 'centres', label: `Centre Approvals (${centres.length})` },
            { id: 'asanas', label: 'Asana Encyclopedia CMS' },
            { id: 'revenue', label: 'Revenue & Commissions' },
            { id: 'coupons', label: 'Coupon & Discount CMS' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-gold-400 text-gold-400'
                  : 'border-transparent text-sage-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Booking Lead Management */}
        {activeTab === 'bookings' && (
          <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-sand-50">Master Customer Lead Pipeline</h2>
                <p className="text-xs text-sage-300 mt-1">
                  You hold complete control of customer contact details. Unmask customer data when ready to assign or invoice.
                </p>
              </div>

              <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-800 flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Confidential Privilege</span>
              </span>
            </div>

            <div className="space-y-4">
              {bookings.map((b) => {
                const isUnmasked = unmaskedBookingIds.includes(b.id);

                return (
                  <div key={b.id} className="bg-sage-950 p-6 rounded-2xl border border-sage-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sage-800 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs bg-sage-800 text-gold-400 font-bold px-2.5 py-1 rounded">
                          {b.referenceCode}
                        </span>
                        <span className="text-xs font-serif font-bold text-white">{b.courseTitle}</span>
                        <span className="text-xs text-[#A5B89A]">({b.centreName})</span>
                      </div>

                      {/* Action Status Controls */}
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-sage-400 mr-1">Status:</span>
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                          className="bg-sage-800 text-white font-semibold text-xs rounded px-2.5 py-1 border border-sage-700 focus:outline-none cursor-pointer"
                        >
                          <option value="pending_admin">1. Pending Admin Review</option>
                          <option value="assigned_to_centre">2. Assigned to Ashram</option>
                          <option value="confirmed_paid">3. Confirmed & Paid</option>
                          <option value="cancelled">4. Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Sensitive Traveler Contact Box */}
                    <div className="bg-sage-900/80 p-4 rounded-xl border border-sage-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-gold-400">TRAVELER PRIVACY DATA:</span>
                          <button
                            onClick={() => toggleMask(b.id)}
                            className="bg-sage-800 hover:bg-sage-700 text-sage-200 text-[11px] px-2.5 py-0.5 rounded flex items-center space-x-1"
                          >
                            {isUnmasked ? <EyeOff className="w-3 h-3 text-[#DCCDB5]" /> : <Eye className="w-3 h-3 text-gold-400" />}
                            <span>{isUnmasked ? 'Mask Details' : 'Reveal Contact Info'}</span>
                          </button>
                        </div>

                        {isUnmasked ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-2 text-emerald-300">
                            <div>Name: <strong>{b.customerName}</strong></div>
                            <div>Email: <strong>{b.customerEmail}</strong></div>
                            <div>Phone: <strong>{b.customerPhone}</strong></div>
                            <div>Country: <strong>{b.customerCountry}</strong></div>
                          </div>
                        ) : (
                          <div className="text-xs text-sage-400 italic pt-1">
                            Contact details are masked from yoga centre. Click 'Reveal Contact Info' to unmask.
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-sage-400 font-semibold uppercase block">Package Value</span>
                        <span className="font-serif font-bold text-xl text-gold-400">{formatPrice(b.totalUSD)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Centre Approvals */}
        {activeTab === 'centres' && (
          <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-sand-50">Yoga Centre & Course Approvals</h2>
                <p className="text-xs text-sage-300">Upload centres on behalf of partner ashrams and manage active listings.</p>
              </div>
              <button
                onClick={() => setIsAddCentreOpen(true)}
                className="bg-gold-500 hover:bg-gold-400 text-sage-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Upload Centre On Behalf of Ashram</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {centres.map((centre) => (
                <div key={centre.id} className="bg-sage-950 p-6 rounded-2xl border border-sage-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif font-bold text-lg text-white">{centre.name}</h3>
                    <span className="bg-emerald-900 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      Verified Active
                    </span>
                  </div>
                  <p className="text-xs text-sage-300">{centre.location}</p>
                  <div className="text-xs text-gold-400 font-semibold">
                    Commission Rate: {centre.commissionRatePercent}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Revenue & Commission Tracker */}
        {activeTab === 'revenue' && (
          <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-6">
            <h2 className="font-serif font-bold text-2xl text-sand-50">Revenue & Commission Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-sage-950 p-6 rounded-2xl border border-sage-800 space-y-2">
                <span className="text-xs text-sage-400 font-semibold">Gross Booking Value (GMV)</span>
                <span className="font-serif font-bold text-3xl text-gold-400 block">{formatPrice(totalGMV)}</span>
                <p className="text-xs text-sage-300">Total volume of traveler bookings across all centres.</p>
              </div>

              <div className="bg-sage-950 p-6 rounded-2xl border border-sage-800 space-y-2">
                <span className="text-xs text-sage-400 font-semibold">Net Platform Revenue (15% Avg Fee)</span>
                <span className="font-serif font-bold text-3xl text-emerald-400 block">{formatPrice(totalCommissionRevenue)}</span>
                <p className="text-xs text-sage-300">Platform earnings retained from booking commissions.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Coupon Code CMS */}
        {activeTab === 'coupons' && (
          <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-6">
            <h2 className="font-serif font-bold text-2xl text-sand-50">Promo Coupon Code Management</h2>
            
            <form onSubmit={handleAddCoupon} className="flex flex-col sm:flex-row gap-3 bg-sage-950 p-4 rounded-xl border border-sage-800">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. EARLYBIRD15)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-sage-900 border border-sage-700 text-white text-xs p-3 rounded-lg flex-1"
              />
              <input
                type="number"
                placeholder="Discount %"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="bg-sage-900 border border-sage-700 text-white text-xs p-3 rounded-lg w-28"
              />
              <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-sage-950 font-bold px-6 py-3 rounded-lg text-xs">
                Create Promo Code
              </button>
            </form>

            <div className="space-y-2">
              {couponList.map((c, i) => (
                <div key={i} className="bg-sage-950 p-4 rounded-xl border border-sage-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-gold-400 text-sm">{c.code}</span>
                    <span className="text-sage-400 ml-3">{c.discount}% Discount</span>
                  </div>
                  <span className="text-sage-400">{c.usage} Times Used</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Centre Matchmakers & Moderation */}
        {activeTab === 'matchmakers' && (
          <div className="bg-sage-900/50 p-8 rounded-3xl border border-sage-800 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-gold-400 text-sage-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Platform Governance
                  </span>
                  <span className="bg-purple-900 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded">
                    Lead Isolation & Rule Enforcement
                  </span>
                </div>
                <h2 className="font-serif font-bold text-2xl text-sand-50 mt-1">
                  Centre Matchmaker Management & Compliance
                </h2>
                <p className="text-xs text-sage-300">
                  Inspect questionnaires published by individual ashrams, enforce platform standards, and review platform-wide conversion metrics.
                </p>
              </div>
            </div>

            {/* Platform Aggregate Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-sage-950 p-5 rounded-2xl border border-sage-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sage-400 block">Total Quizzes Started</span>
                <span className="font-serif font-bold text-3xl text-gold-400">{totalPlatformStarts}</span>
                <span className="text-[10px] text-sage-400 block">Across all registered centres</span>
              </div>

              <div className="bg-sage-950 p-5 rounded-2xl border border-sage-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sage-400 block">Total Quizzes Completed</span>
                <span className="font-serif font-bold text-3xl text-emerald-400">{totalPlatformCompletions}</span>
                <span className="text-[10px] text-sage-400 block">Full questionnaires submitted</span>
              </div>

              <div className="bg-sage-950 p-5 rounded-2xl border border-sage-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sage-400 block">Total Direct Leads Generated</span>
                <span className="font-serif font-bold text-3xl text-sand-50">{matchmakerLeads.length}</span>
                <span className="text-[10px] text-sage-400 block">Inquiries routed to centres</span>
              </div>

              <div className="bg-sage-950 p-5 rounded-2xl border border-sage-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sage-400 block">Platform Conversion Rate</span>
                <span className="font-serif font-bold text-3xl text-gold-400">{platformAvgConversion}%</span>
                <span className="text-[10px] text-sage-400 block">Leads / Completed quizzes</span>
              </div>
            </div>

            {/* Centre Moderation Table */}
            <div className="bg-sage-950 rounded-2xl border border-sage-800 overflow-hidden">
              <div className="p-5 border-b border-sage-800 flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-sand-50">
                  Registered Ashram Matchmakers
                </h3>
                <span className="text-xs text-sage-400">
                  Private leads are strictly isolated per centre
                </span>
              </div>

              <div className="divide-y divide-sage-800/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sage-900/60 text-sage-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-4">Centre Name & Location</th>
                      <th className="p-4">Matchmaker Status</th>
                      <th className="p-4">Questions</th>
                      <th className="p-4">Starts / Completions</th>
                      <th className="p-4">Leads</th>
                      <th className="p-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-800/40">
                    {centres.map((c) => {
                      const cfg = matchmakerConfigs[c.id];
                      const stats = matchmakerAnalytics[c.id];
                      const centreLeadsCount = matchmakerLeads.filter(l => l.centreId === c.id).length;
                      const isSuspended = cfg?.adminDisabled;

                      return (
                        <tr key={c.id} className="hover:bg-sage-900/40 transition">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img src={c.coverImage} alt={c.name} className="w-9 h-9 rounded-lg object-cover border border-sage-700 shrink-0" />
                              <div>
                                <strong className="text-white block font-serif text-sm">{c.name}</strong>
                                <span className="text-sage-400 text-[11px]">{c.city}, Uttarakhand</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            {isSuspended ? (
                              <span className="bg-red-950 text-red-200 border border-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                Suspended by Admin
                              </span>
                            ) : cfg?.isEnabled ? (
                              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full capitalize">
                                {cfg.status}
                              </span>
                            ) : (
                              <span className="bg-stone-800 text-stone-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                                Disabled by Ashram
                              </span>
                            )}
                          </td>

                          <td className="p-4">
                            <span className="font-mono text-sage-200">{cfg?.questions?.length || 0} Questions</span>
                          </td>

                          <td className="p-4">
                            <span className="font-mono text-sage-300">
                              {stats?.startsCount || 0} starts / {stats?.completionsCount || 0} done
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-gold-400 font-mono">
                              {centreLeadsCount} Leads
                            </span>
                          </td>

                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => openCentreMatchmaker(c.id)}
                              className="bg-sage-800 hover:bg-sage-700 text-white font-medium text-[11px] px-3 py-1.5 rounded-lg border border-sage-700 transition"
                            >
                              Review Live
                            </button>

                            {isSuspended ? (
                              <button
                                onClick={() => setAdminMatchmakerDisabled(c.id, false)}
                                className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-bold text-[11px] px-3 py-1.5 rounded-lg border border-emerald-700 transition"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const reason = prompt('Enter violation or moderation reason for deactivating this questionnaire:');
                                  if (reason) setAdminMatchmakerDisabled(c.id, true, reason);
                                }}
                                className="bg-red-950 hover:bg-red-900 text-red-300 font-bold text-[11px] px-3 py-1.5 rounded-lg border border-red-800 transition"
                              >
                                Disable Policy Violation
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Global Question Templates Library */}
            <div className="bg-sage-950 p-6 rounded-2xl border border-sage-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-sand-50">
                    Platform Predefined Question Templates ({PREDEFINED_QUESTION_TEMPLATES.length})
                  </h3>
                  <p className="text-xs text-sage-400">
                    Available in all ashram dashboards for 1-click inclusion and customization.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {PREDEFINED_QUESTION_TEMPLATES.map((tmpl, idx) => (
                  <div key={idx} className="bg-sage-900/60 p-4 rounded-xl border border-sage-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-gold-400 px-2 py-0.5 rounded bg-sage-800">
                        {tmpl.type.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-sage-400">{tmpl.options.length} Options</span>
                    </div>
                    <strong className="text-white block font-serif text-sm">{tmpl.text}</strong>
                    <p className="text-sage-400 text-[11px]">{tmpl.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB: Asana Encyclopedia CMS */}
        {activeTab === 'asanas' && <AsanaManagerTab />}

      </div>
    </div>
  );
};
