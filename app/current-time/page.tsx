import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { resolveSlug } from '../../utils/seoResolver';
import CurrentTimeHubClient, { ClockItem } from './CurrentTimeHubClient';
import Header from '@/components/Header';
import CurrentTimeClocksHeroCard from '@/components/CurrentTimeClocksHeroCard';

export const revalidate = 86400; // Cache for 24 hours

export const metadata: Metadata = {
  title: "Current Local Times | Live Clocks Directory | MeetMyZone",
  description: "Discover current local times, IANA timezone names, UTC offsets, and daylight saving status for major cities and regions worldwide.",
  alternates: {
    canonical: "https://meetmyzone.com/current-time",
  },
  openGraph: {
    title: "Current Local Times | Live Clocks Directory | MeetMyZone",
    description: "Discover current local times, IANA timezone names, UTC offsets, and daylight saving status for major cities and regions worldwide.",
    type: "website",
    siteName: "MeetMyZone",
    url: "https://meetmyzone.com/current-time"
  },
  twitter: {
    card: "summary_large_image",
    title: "Current Local Times | Live Clocks Directory | MeetMyZone",
    description: "Discover current local times, IANA timezone names, UTC offsets, and daylight saving status for major cities and regions worldwide."
  }
};

export default async function Page() {
  const slugs = [
    'london', 'new-york', 'tokyo', 'sydney', 'paris', 'dubai', 'los-angeles', 'mumbai', 'singapore', 'seoul', 'berlin', 'denver', 'halifax',
    'est', 'ist', 'pst', 'utc', 'gmt', 'cet', 'mst', 'cst', 'ast', 'sgt', 'jst', 'kst', 'aest'
  ];

  const clockData = slugs.map(slug => {
    const resolved = resolveSlug(slug);
    if (!resolved) return null;
    return {
      slug,
      displayName: resolved.displayName,
      cityName: resolved.cityName,
      zoneName: resolved.zoneName
    };
  }).filter(Boolean);

  const getCombinedSchema = () => {
    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": "https://meetmyzone.com/current-time/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://meetmyzone.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Current Time",
          "item": "https://meetmyzone.com/current-time"
        }
      ]
    };

    const collectionSchema = {
      "@type": "CollectionPage",
      "@id": "https://meetmyzone.com/current-time/#collectionpage",
      "url": "https://meetmyzone.com/current-time",
      "name": "Current Local Times | MeetMyZone",
      "description": "Discover current local times, IANA timezone names, UTC offsets, and daylight saving status for major cities and regions worldwide.",
      "numberOfItems": clockData.length
    };

    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumbSchema,
        collectionSchema
      ]
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-txt-primary transition-colors duration-150">
      
      {/* Combined Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getCombinedSchema()).replace(/</g, '\\u003c') }}
      />

      {/* Shared Header Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-6 flex-1 pb-16">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs sm:text-sm font-semibold text-txt-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-brand-accent-hover transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="text-txt-subtle">/</span>
            </li>
            <li aria-current="page" className="text-brand-accent-hover truncate font-bold">
              Current Time
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-6">
          
          {/* Left Column: Headline and description */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-txt-heading leading-tight">
              Current Local Times
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary leading-relaxed font-medium">
              Check the current local time, date, UTC offsets, and daylight saving status for major capitals, timezone abbreviations, and cities worldwide.
            </p>
          </div>

          {/* Right Column: Reused Hero Time Comparison Card configured as Dashboard */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <CurrentTimeClocksHeroCard />
          </div>

        </header>

        {/* Client side interactive search & groupings list */}
        <CurrentTimeHubClient clocks={clockData as ClockItem[]} />

      </main>

    </div>
  );
}
