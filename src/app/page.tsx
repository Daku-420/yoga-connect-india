'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

// Homepage Components
import { HeroSection } from '../components/home/HeroSection';
import { QuickSearch } from '../components/home/QuickSearch';
import { FeaturedCentres } from '../components/home/FeaturedCentres';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { DestinationsSection } from '../components/home/DestinationsSection';
import { AIRetreatBanner } from '../components/home/AIRetreatBanner';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { BlogPreviewSection } from '../components/home/BlogPreviewSection';

// Page Views
import { RetreatSearchPage } from '../components/search/RetreatSearchPage';
import { CentreDetailPage } from '../components/detail/CentreDetailPage';
import { UserDashboard } from '../components/dashboards/UserDashboard';
import { CentreDashboard } from '../components/dashboards/CentreDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { BlogSection } from '../components/blog/BlogSection';

import { SupportPage } from '../components/support/SupportPage';

export default function HomePage() {
  const { activeView } = useApp();

  switch (activeView) {
    case 'retreats':
      return <RetreatSearchPage />;

    case 'centre-detail':
      return <CentreDetailPage />;

    case 'support':
      return <SupportPage />;

    case 'destinations':
      return (
        <div className="space-y-12 pb-16">
          <DestinationsSection />
          <FeaturedCentres />
        </div>
      );

    case 'blog':
    case 'blog-detail':
      return <BlogSection />;

    case 'user-dashboard':
      return <UserDashboard />;

    case 'centre-dashboard':
      return <CentreDashboard />;

    case 'admin-dashboard':
      return <AdminDashboard />;

    case 'home':
    default:
      return (
        <div className="space-y-0">
          <HeroSection />
          <QuickSearch />
          <FeaturedCentres />
          <WhyChooseUs />
          <DestinationsSection />
          <AIRetreatBanner />
          <TestimonialsSection />
          <BlogPreviewSection />
        </div>
      );
  }
}
