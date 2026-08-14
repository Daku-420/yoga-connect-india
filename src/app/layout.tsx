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

          {/* Global Modals */}
          <FilterModal />
          <CourseDrawer />
          <BookingModal />
          <AIRetreatQuizModal />
          <SchemaViewerModal />
          <AddCentreModal />
        </AppProvider>
      </body>
    </html>
  );
}
