import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import HomeHero from '@/components/home/HomeHero';
import HomeQuickTasks from '@/components/home/HomeQuickTasks';
import HomeWorldTime from '@/components/home/HomeWorldTime';
import HomeMeetingOverlap from '@/components/home/HomeMeetingOverlap';
import HomeUseCases from '@/components/home/HomeUseCases';
import HomeToolsHub from '@/components/home/HomeToolsHub';
import HomeGuides from '@/components/home/HomeGuides';
import HomeFinalCTA from '@/components/home/HomeFinalCTA';

export const revalidate = 86400; // Cache homepage for 24 hours (1 day)

export const metadata: Metadata = {
  title: "Time Zone Converter & Meeting Planner | MeetMyZone",
  description: "Convert time zones, compare local times, and plan meetings across cities worldwide. MeetMyZone makes global time coordination simple and accurate.",
  alternates: {
    canonical: "https://meetmyzone.com",
  },
  openGraph: {
    title: "Time Zone Converter & Meeting Planner | MeetMyZone",
    description: "Convert time zones, compare local times, and plan meetings across cities worldwide. MeetMyZone makes global time coordination simple and accurate.",
    type: "website",
    siteName: "MeetMyZone",
    url: "https://meetmyzone.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Zone Converter & Meeting Planner | MeetMyZone",
    description: "Convert time zones, compare local times, and plan meetings across cities worldwide. MeetMyZone makes global time coordination simple and accurate."
  }
};

export default async function Page() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://meetmyzone.com/#organization",
    "name": "MeetMyZone",
    "url": "https://meetmyzone.com",
    "logo": "https://meetmyzone.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@meetmyzone.com",
      "contactType": "customer support"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-txt-primary transition-colors duration-150 relative overflow-hidden">
      
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Global Navigation Header */}
      <Header />

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-4 md:mt-8 flex flex-col gap-14 flex-1 pb-16 z-10">
        
        {/* Hero Section */}
        <HomeHero />

        {/* Quick Task Navigation Cards */}
        <HomeQuickTasks />

        {/* Interactive World Time Comparison */}
        <HomeWorldTime />

        {/* Meeting Overlap Visual Timeline */}
        <HomeMeetingOverlap />

        {/* User Persona / Workflow Use Cases */}
        <HomeUseCases />

        {/* Internal Linking SEO Tools Hub */}
        <HomeToolsHub />

        {/* Practical Guides and Blog Grid */}
        <HomeGuides />

        {/* Bottom CTA Banner */}
        <HomeFinalCTA />

      </main>

    </div>
  );
}
