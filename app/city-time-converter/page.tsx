import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ALL_PAIRINGS, isTimezonePairing, parsePairing } from '../../utils/seoResolver';
import CityTimeConverterHubClient, { ResolvedPairingItem } from './CityTimeConverterHubClient';
import Header from '@/components/Header';
import CityTimeConverterHeroCard from '@/components/CityTimeConverterHeroCard';

export const revalidate = 86400; // Cache for 24 hours

export const metadata: Metadata = {
  title: "City Time Converters | Compare World Cities | MeetMyZone",
  description: "Compare local times and working-hour overlaps between major cities worldwide. View live clocks, DST status, and plan international meetings.",
  alternates: {
    canonical: "https://meetmyzone.com/city-time-converter",
  },
  openGraph: {
    title: "City Time Converters | Compare World Cities | MeetMyZone",
    description: "Compare local times and working-hour overlaps between major cities worldwide. View live clocks, DST status, and plan international meetings.",
    type: "website",
    siteName: "MeetMyZone",
    url: "https://meetmyzone.com/city-time-converter"
  },
  twitter: {
    card: "summary_large_image",
    title: "City Time Converters | Compare World Cities | MeetMyZone",
    description: "Compare local times and working-hour overlaps between major cities worldwide. View live clocks, DST status, and plan international meetings."
  }
};

export default async function Page() {
  const citySlugs = ALL_PAIRINGS.filter(slug => !isTimezonePairing(slug));

  const pairingsData = citySlugs.map(slug => {
    const resolved = parsePairing(slug);
    if (!resolved) return null;
    return {
      slug,
      sourceDisplayName: resolved.zoneA.cityName,
      sourceCityName: resolved.zoneA.cityName,
      targetDisplayName: resolved.zoneB.cityName,
      targetCityName: resolved.zoneB.cityName
    };
  }).filter(Boolean);

  const getCombinedSchema = () => {
    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": "https://meetmyzone.com/city-time-converter/#breadcrumb",
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
          "name": "City Time Converter",
          "item": "https://meetmyzone.com/city-time-converter"
        }
      ]
    };

    const collectionSchema = {
      "@type": "CollectionPage",
      "@id": "https://meetmyzone.com/city-time-converter/#collectionpage",
      "url": "https://meetmyzone.com/city-time-converter",
      "name": "City Time Converters | MeetMyZone",
      "description": "Compare local times and working-hour overlaps between major cities worldwide. View live clocks, DST status, and plan international meetings.",
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
              City Time Converter
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-6">
          
          {/* Left Column: Headline and description */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-txt-heading leading-tight">
              City Time Converter
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary leading-relaxed font-medium">
              Compare local times and working-hour overlaps between major cities worldwide. Check live clocks, daylight saving time (DST) status, and plan international meetings easily without timezone coordination mistakes.
            </p>
          </div>

          {/* Right Column: Reused Hero Time Comparison Card */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <CityTimeConverterHeroCard
              initialClock1={{
                city: 'London',
                country: 'United Kingdom',
                timezone: 'Europe/London'
              }}
              initialClock2={{
                city: 'Paris',
                country: 'France',
                timezone: 'Europe/Paris'
              }}
              storageKeyPrefix="wc_city"
            />
          </div>

        </header>

        {/* Client side interactive search & groupings list */}
        <CityTimeConverterHubClient pairings={pairingsData as ResolvedPairingItem[]} />

      </main>

    </div>
  );
}
