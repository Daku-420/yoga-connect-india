'use client';

import React from 'react';
import { useApp } from '../src/context/AppContext';

// Homepage Components
import { HeroSection } from '../src/components/home/HeroSection';
import { QuickSearch } from '../src/components/home/QuickSearch';
import { FeaturedCentres } from '../src/components/home/FeaturedCentres';
import { WhyChooseUs } from '../src/components/home/WhyChooseUs';
import { DestinationsSection } from '../src/components/home/DestinationsSection';
import { TestimonialsSection } from '../src/components/home/TestimonialsSection';
import { BlogPreviewSection } from '../src/components/home/BlogPreviewSection';

// Page Views
import { RetreatSearchPage } from '../src/components/search/RetreatSearchPage';
import { CentreDetailPage } from '../src/components/detail/CentreDetailPage';
import { UserDashboard } from '../src/components/dashboards/UserDashboard';
import { CentreDashboard } from '../src/components/dashboards/CentreDashboard';
import { AdminDashboard } from '../src/components/dashboards/AdminDashboard';
import { BlogSection } from '../src/components/blog/BlogSection';
import { SupportPage } from '../src/components/support/SupportPage';

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
    case 'asanas':
      return <BlogSection initialSubView={activeView === 'asanas' ? 'asanas' : undefined} />;

    case 'user-dashboard':
      return <UserDashboard />;

    case 'centre-dashboard':
      return <CentreDashboard />;

    case 'admin-dashboard':
      return <AdminDashboard initialTab="centres" />;

    case 'home':
    default:
      return (
        <div className="space-y-0">
          <HeroSection />
          <QuickSearch />
          <FeaturedCentres />
          <WhyChooseUs />
          <DestinationsSection />
          <TestimonialsSection />
          <BlogPreviewSection />
        </div>
      );
  }
}
