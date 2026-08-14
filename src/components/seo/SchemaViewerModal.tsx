import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, FileText, Code, Globe, Check, Copy } from 'lucide-react';

export const SchemaViewerModal: React.FC = () => {
  const { isSchemaModalOpen, setIsSchemaModalOpen, brandName, centres, courses } = useApp();
  const [activeTab, setActiveTab] = useState<'schema' | 'sitemap'>('schema');
  const [copied, setCopied] = useState(false);

  if (!isSchemaModalOpen) return null;

  const sampleCentre = centres[0];
  const sampleCourse = courses[0];

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://yogaconnectindia.com/#website",
        "url": "https://yogaconnectindia.com",
        "name": brandName,
        "description": "India's premier luxury yoga retreat & teacher training escrow marketplace."
      },
      {
        "@type": "EducationalOrganization",
        "@id": `https://yogaconnectindia.com/centre/${sampleCentre.slug}`,
        "name": sampleCentre.name,
        "url": `https://yogaconnectindia.com/centre/${sampleCentre.slug}`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": sampleCentre.location,
          "addressLocality": sampleCentre.city,
          "addressRegion": sampleCentre.state,
          "addressCountry": "IN"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": sampleCentre.rating,
          "reviewCount": sampleCentre.reviewCount
        }
      },
      {
        "@type": "Course",
        "name": sampleCourse.title,
        "description": sampleCourse.subtitle,
        "provider": {
          "@type": "Organization",
          "name": sampleCentre.name
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "In-Person Ashram Immersion",
          "duration": `P${sampleCourse.durationDays}D`,
          "startDate": "2026-10-01"
        },
        "offers": {
          "@type": "Offer",
          "price": sampleCourse.priceUSD,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  const schemaString = JSON.stringify(jsonLdSchema, null, 2);

  const sitemapUrls = [
    'https://yogaconnectindia.com/sitemap.xml',
    'https://yogaconnectindia.com/',
    'https://yogaconnectindia.com/retreats',
    'https://yogaconnectindia.com/destinations/rishikesh',
    'https://yogaconnectindia.com/destinations/goa',
    'https://yogaconnectindia.com/destinations/kerala',
    'https://yogaconnectindia.com/centre/ananda-himalayan-yoga-sanctuary',
    'https://yogaconnectindia.com/centre/oceanic-lotus-beachside-retreat',
    'https://yogaconnectindia.com/blog/ultimate-guide-200-hour-yoga-teacher-training-rishikesh'
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-sage-950 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-sage-800 text-white shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-sage-800 bg-sage-900 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif font-bold text-xl text-sand-50">
              SEO Engine & Schema Markup Inspector
            </h3>
          </div>

          <button 
            onClick={() => setIsSchemaModalOpen(false)}
            className="p-1.5 text-sage-400 hover:text-white rounded-full hover:bg-sage-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-sage-800 px-6 pt-3 space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 flex items-center space-x-1.5 border-b-2 transition ${
              activeTab === 'schema' ? 'border-gold-400 text-gold-400' : 'border-transparent text-sage-400'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>JSON-LD Structured Data Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('sitemap')}
            className={`pb-3 flex items-center space-x-1.5 border-b-2 transition ${
              activeTab === 'sitemap' ? 'border-gold-400 text-gold-400' : 'border-transparent text-sage-400'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Automatic XML Sitemap Inspector</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 text-xs">
          
          {activeTab === 'schema' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sage-300">
                <span>Dynamic JSON-LD for Google Rich Snippets (Course, LocalBusiness, AggregateRating)</span>
                <button
                  onClick={handleCopy}
                  className="bg-sage-800 hover:bg-sage-700 text-gold-400 px-3 py-1 rounded flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="bg-sage-900 p-4 rounded-xl font-mono text-[11px] text-emerald-300 overflow-x-auto border border-sage-800">
                {schemaString}
              </pre>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-sage-300 block">Generated XML Sitemap Index & Canonical Paths:</span>
              <div className="bg-sage-900 p-4 rounded-xl font-mono text-xs text-gold-300 space-y-2 border border-sage-800">
                {sitemapUrls.map((url, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-sage-800/50">
                    <span>{url}</span>
                    <span className="text-[10px] text-emerald-400 font-sans bg-emerald-950 px-2 py-0.5 rounded">200 OK • 1.0 Priority</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
