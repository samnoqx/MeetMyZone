import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: "Time Zone Tools for Global Coordination | MeetMyZone",
  description: "Compare time zones, check current local times, find overlapping working hours, and plan meetings across cities worldwide.",
  alternates: {
    canonical: "https://meetmyzone.com/tools",
  },
  openGraph: {
    title: "Time Zone Tools for Global Coordination | MeetMyZone",
    description: "Compare time zones, check current local times, find overlapping working hours, and plan meetings across cities worldwide.",
    type: "website",
    siteName: "MeetMyZone",
    url: "https://meetmyzone.com/tools"
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Zone Tools for Global Coordination | MeetMyZone",
    description: "Compare time zones, check current local times, find overlapping working hours, and plan meetings across cities worldwide."
  }
};

const tools = [
  {
    name: 'Meeting Planner',
    href: '/meeting-planner',
    description: 'Find perfect working hour overlaps for global teams. Schedule meetings across multiple time zones with ease.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Time Zone Converter',
    href: '/timezone-converter',
    description: 'Convert time zone offsets and DST schedules. Quickly translate any time between zones worldwide.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    name: 'City Time Converter',
    href: '/city-time-converter',
    description: 'Compare live local times between major global cities. See what time it is anywhere at a glance.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Current Time',
    href: '/current-time',
    description: 'Check current local times, IANA timezone names, UTC offsets, and daylight saving status worldwide.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ToolsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-txt-primary transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

          {/* Page Header */}
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-txt-heading leading-tight mb-4">
              Time Zone Tools for Global Coordination
            </h1>
            <p className="text-sm sm:text-base text-txt-secondary font-bold leading-relaxed max-w-2xl mx-auto">
              Compare time zones, check current local times, find overlapping working hours, and plan meetings across cities worldwide.
            </p>
          </div>

          {/* Tool Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group flex flex-col gap-4 p-6 rounded-2xl border border-border-custom bg-surf-1 hover:bg-surf-2 shadow-card hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent-hover group-hover:bg-brand-accent/20 transition-colors">
                  {tool.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-base sm:text-lg font-black text-txt-heading group-hover:text-brand-accent-hover transition-colors">
                    {tool.name}
                  </span>
                  <span className="text-xs sm:text-sm text-txt-secondary font-medium leading-relaxed">
                    {tool.description}
                  </span>
                </div>
                <span className="text-xs font-bold text-brand-accent-hover mt-auto flex items-center gap-1 group-hover:gap-2 transition-all">
                  Open Tool
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
