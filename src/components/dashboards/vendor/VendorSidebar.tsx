'use client';

import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Store, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { YogaCentre } from '../../../types';

export type VendorTabKey = 
  | 'overview' 
  | 'bookings' 
  | 'customers' 
  | 'enquiries' 
  | 'courses' 
  | 'ledger' 
  | 'settlements' 
  | 'profile' 
  | 'settings';

interface VendorSidebarProps {
  activeTab: VendorTabKey;
  onTabChange: (tab: VendorTabKey) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeCentre: YogaCentre;
  counts: {
    pendingBookings: number;
    newEnquiries: number;
    totalCustomers: number;
  };
  onLogout: () => void;
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  activeCentre,
  counts,
  onLogout
}) => {
  const navItems = [
    { key: 'overview' as VendorTabKey, label: 'Overview', icon: TrendingUp },
    { 
      key: 'bookings' as VendorTabKey, 
      label: 'Bookings', 
      icon: Calendar, 
      badge: counts.pendingBookings > 0 ? counts.pendingBookings : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    { 
      key: 'customers' as VendorTabKey, 
      label: 'Customers', 
      icon: Users,
      badge: counts.totalCustomers > 0 ? counts.totalCustomers : undefined,
      badgeColor: 'bg-[#E6EDE2] text-[#263D32] border-[#A5B89A]/50'
    },
    { 
      key: 'enquiries' as VendorTabKey, 
      label: 'Enquiries', 
      icon: MessageSquare,
      badge: counts.newEnquiries > 0 ? counts.newEnquiries : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    { key: 'courses' as VendorTabKey, label: 'Courses & Packages', icon: BookOpen },
    { key: 'ledger' as VendorTabKey, label: 'Financial Records', icon: DollarSign },
    { key: 'settlements' as VendorTabKey, label: 'Settlements', icon: CreditCard },
    { key: 'profile' as VendorTabKey, label: 'Centre Profile', icon: Store },
    { key: 'settings' as VendorTabKey, label: 'Account Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-[#263D32] text-white border-r border-[#1E3228] transition-all duration-300 flex flex-col shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#1E3228] flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#536B50] flex items-center justify-center shrink-0 border border-[#A5B89A]/40 shadow-sm">
              <Building2 className="w-5 h-5 text-[#F7F5EE]" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A5B89A] block truncate">
                Vendor Portal
              </span>
              <h2 className="font-serif font-bold text-sm text-[#F7F5EE] truncate" title={activeCentre.name}>
                {activeCentre.name}
              </h2>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-xl bg-[#536B50] flex items-center justify-center border border-[#A5B89A]/40 shadow-sm" title={activeCentre.name}>
            <Building2 className="w-5 h-5 text-[#F7F5EE]" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#A5B89A] hover:text-white hover:bg-[#1E3228] transition cursor-pointer shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Centre Contract & Escrow Indicator */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-[#1E3228] border-b border-[#16271F] flex items-center space-x-2 text-[11px] text-[#A5B89A]">
          <ShieldCheck className="w-4 h-4 text-[#DCCDB5] shrink-0" />
          <span className="truncate">
            Contract: <strong className="text-white">{activeCentre.id}</strong> (15% Escrow)
          </span>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto" aria-label="Vendor Portal Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`w-full flex items-center rounded-xl text-xs font-semibold transition cursor-pointer group ${
                isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } ${
                isActive 
                  ? 'bg-[#536B50] text-[#F7F5EE] shadow-sm' 
                  : 'text-[#DCCDB5] hover:bg-[#1E3228] hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-[#A5B89A]'
                }`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge !== undefined && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-white/10 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-[#1E3228] space-y-2">
        <button
          onClick={onLogout}
          className={`w-full flex items-center text-xs font-semibold text-red-300 hover:text-red-100 hover:bg-red-950/40 rounded-xl transition cursor-pointer ${
            isCollapsed ? 'justify-center p-3' : 'space-x-3 px-3.5 py-2.5'
          }`}
          title="Sign Out of Vendor Portal"
        >
          <LogOut className="w-4 h-4 shrink-0 text-red-400" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>

        {!isCollapsed && (
          <div className="px-2 pt-1 text-[10px] text-[#A5B89A]/60 text-center flex items-center justify-center space-x-1">
            <Compass className="w-3 h-3 text-[#536B50]" />
            <span>YogaConnect India Partner Portal</span>
          </div>
        )}
      </div>
    </aside>
  );
};
