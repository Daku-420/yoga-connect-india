import { MetadataRoute } from 'next';
import { mockAsanas } from '../data/mockAsanas';
import { mockBlogs } from '../data/mockBlogs';
import { mockCentres } from '../data/mockCentres';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yogaconnectindia.com';
  const currentDate = new Date().toISOString();

  // 1. Core High-Priority Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/journal/asanas`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
  ];

  // 2. Curated Asana Category & Movement Hubs
  const categoryHubs = [
    'beginner-yoga',
    'standing-poses',
    'seated-poses',
    'balancing-poses',
    'backbends',
    'forward-folds',
    'twists',
    'inversions',
    'restorative-poses',
    'meditation-poses',
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categoryHubs.map(cat => ({
    url: `${baseUrl}/journal/asanas/${cat}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. Published Asana Detail Pages (Strictly Published only)
  const asanaRoutes: MetadataRoute.Sitemap = mockAsanas
    .filter(a => a.editorialStatus === 'published')
    .map(asana => ({
      url: `${baseUrl}/journal/asanas/${asana.slug}`,
      lastModified: asana.lastUpdatedDate ? new Date(asana.lastUpdatedDate).toISOString() : currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  // 4. Published Journal Articles
  const blogRoutes: MetadataRoute.Sitemap = mockBlogs.map(blog => ({
    url: `${baseUrl}/journal/${blog.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // 5. Verified Retreat & Centre Pages
  const centreRoutes: MetadataRoute.Sitemap = mockCentres.map(centre => ({
    url: `${baseUrl}/centres/${centre.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...asanaRoutes,
    ...blogRoutes,
    ...centreRoutes,
  ];
}
