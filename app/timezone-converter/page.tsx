import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ALL_PAIRINGS, isTimezonePairing, parsePairing } from '../../utils/seoResolver';
import TimezoneConverterHubClient, { ResolvedPairingItem } from './TimezoneConverterHubClient';
import Header from '@/components/Header';
import TimezoneConverterHeroCard from '@/components/TimezoneConverterHeroCard';

export const revalidate = 86400; // Cache for 24 hours

export const metadata: Metadata = {
  title: "Time Zone Converters | Compare World Time Zones | MeetMyZone",
  description: "Convert between global time zones using MeetMyZone's precision converter directory. View live clocks, UTC offsets, daylight saving details, and plan timezone-aligned meetings.",
  alternates: {
    canonical: "https://meetmyzone.com/timezone-converter",
  },
  openGraph: {
    title: "Time Zone Converters | Compare World Time Zones | MeetMyZone",
    description: "Convert between global time zones using MeetMyZone's precision converter directory. View live clocks, UTC offsets, daylight saving details, and plan timezone-aligned meetings.",
    type: "website",
    siteName: "MeetMyZone",
    url: "https://meetmyzone.com/timezone-converter"
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Zone Converters | Compare World Time Zones | MeetMyZone",
    description: "Convert between global time zones using MeetMyZone's precision converter directory. View live clocks, UTC offsets, daylight saving details, and plan timezone-aligned meetings."
  }
};

export default async function Page() {
  const tzSlugs = ALL_PAIRINGS.filter(isTimezonePairing);

  // Pre-resolve pairing data on the server to prevent heavy client-side lookups
  const pairingsData = tzSlugs.map(slug => {
    const resolved = parsePairing(slug);
    if (!resolved) return null;
    return {
      slug,
      sourceDisplayName: resolved.zoneA.displayName,
      sourceCityName: resolved.zoneA.cityName,
      targetDisplayName: resolved.zoneB.displayName,
      targetCityName: resolved.zoneB.cityName
    };
  }).filter(Boolean) as ResolvedPairingItem[];

  const getCombinedSchema = () => {
    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": "https://meetmyzone.com/timezone-converter/#breadcrumb",
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
          "name": "Time Zone Converter",
          "item": "https://meetmyzone.com/timezone-converter"
        }
      ]
    };

    const collectionSchema = {
      "@type": "CollectionPage",
      "@id": "https://meetmyzone.com/timezone-converter/#collectionpage",
      "url": "https://meetmyzone.com/timezone-converter",
      "name": "Time Zone Converters | MeetMyZone",
      "description": "Convert between global time zones using MeetMyZone's precision converter directory. View live clocks, UTC offsets, daylight saving details, and plan timezone-aligned meetings.",
      "numberOfItems": pairingsData.length
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
              Time Zone Converter
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-6">
          
          {/* Left Column: Headline and description */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-txt-heading leading-tight">
              Time Zone Converter
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary leading-relaxed font-medium">
              Compare global time zones instantly using MeetMyZone&apos;s precision converter directory. Our visual meeting planner makes it simple to align schedules, identify optimal daylight saving time (DST) offsets, and check live clocks side-by-side. Avoid timezone coordination mistakes, check business hour overlaps, and schedule cross-border collaboration slots easily. Find your converter tool using our search box or browse alphabetical listings to get started for free.
            </p>
          </div>

          {/* Right Column: Reused Hero Time Comparison Card */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <TimezoneConverterHeroCard
              initialClock1={{
                city: 'UTC',
                country: 'Coordinated Universal Time',
                timezone: 'UTC',
                region: 'Universal'
              }}
              initialClock2={{
                city: 'EST',
                country: 'Eastern Standard Time',
                timezone: 'America/New_York',
                region: 'United States & Canada'
              }}
              storageKeyPrefix="wc_converter"
            />
          </div>

        </header>

        {/* Client side interactive search & groupings list */}
        <TimezoneConverterHubClient pairings={pairingsData} />

      </main>

    </div>
  );
}
