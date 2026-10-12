'use client';

import React from 'react';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FilterModal } from '../components/search/FilterModal';
import { CourseDrawer } from '../components/detail/CourseDrawer';
import { BookingModal } from '../components/booking/BookingModal';
import { AIRetreatQuizModal } from '../components/ai/AIRetreatQuizModal';
import { SchemaViewerModal } from '../components/seo/SchemaViewerModal';
import { AddCentreModal } from '../components/admin/AddCentreModal';
import { LiveChatWidget } from '../components/support/LiveChatWidget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>YogaConnect India | Discover Authentic Yoga Retreats & Teacher Training</title>
        <meta name="description" content="Discover verified yoga centres, traditional ashrams, and transformative retreats across Uttarakhand on YogaConnect India. 100% Admin Escrow protected booking." />
        <meta property="og:title" content="YogaConnect India | Discover Authentic Yoga Retreats & Teacher Training" />
        <meta property="og:description" content="Connect with authentic yoga ashrams, certified teacher training programs, and wellness retreats across Uttarakhand. 100% Admin Escrow protection." />
        <meta property="og:site_name" content="YogaConnect India" />
        <meta name="twitter:title" content="YogaConnect India | Discover Authentic Yoga Retreats & Teacher Training" />
        <meta name="twitter:description" content="Connect with authentic yoga ashrams, certified teacher training programs, and wellness retreats across Uttarakhand." />
      </head>
      <body className="antialiased selection:bg-[#536B50] selection:text-white">
        <AppProvider>
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>

          {/* Global Modals & Chat */}
          <FilterModal />
          <CourseDrawer />
          <BookingModal />
          <AIRetreatQuizModal />
          <SchemaViewerModal />
          <AddCentreModal />
          <LiveChatWidget />
        </AppProvider>
      </body>
    </html>
  );
}
