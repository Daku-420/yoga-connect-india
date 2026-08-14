'use client';

import React from 'react';
import './globals.css';
import { AppProvider } from '../src/context/AppContext';
import { Navbar } from '../src/components/layout/Navbar';
import { Footer } from '../src/components/layout/Footer';
import { FilterModal } from '../src/components/search/FilterModal';
import { CourseDrawer } from '../src/components/detail/CourseDrawer';
import { BookingModal } from '../src/components/booking/BookingModal';
import { AIRetreatQuizModal } from '../src/components/ai/AIRetreatQuizModal';
import { SchemaViewerModal } from '../src/components/seo/SchemaViewerModal';
import { LiveChatWidget } from '../src/components/support/LiveChatWidget';
import { AddCentreModal } from '../src/components/admin/AddCentreModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>YogaConnect India | Discover Authentic Yoga Retreats & Teacher Training</title>
        <meta name="description" content="Compare certified yoga centres in Rishikesh, Goa, Kerala & Dharamshala. Book 200h/300h TTC & Panchakarma retreats through 100% Admin Escrow protection." />
      </head>
      <body className="antialiased selection:bg-terracotta-500 selection:text-white">
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
