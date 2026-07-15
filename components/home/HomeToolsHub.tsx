'use client';

import React from 'react';
import Link from 'next/link';

export default function HomeToolsHub() {
  const hubs = [
    {
      title: 'Time Zone Converter',
      desc: 'Convert between global time zones and compare UTC offsets, DST changes, and local hours.',
      cta: 'View All Converters',
      href: '/timezone-converter',
      icon: (
        <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 4.03 3 9s-1.343 9-3 9m0-18c-1.657 0-3 4.03-3 9s1.343 9 3 9m-9-9a9 9 0 019-9" />
        </svg>
      ),
      links: [
        { label: 'GMT to EST', href: '/convert/gmt-to-est' },
        { label: 'UTC to IST', href: '/convert/utc-to-ist' },
        { label: 'EST to PST', href: '/convert/est-to-pst' },
        { label: 'CET to EST', href: '/convert/cet-to-est' }
      ]
    },
    {
      title: 'City Time Converter',
      desc: 'Compare local time between major cities and understand the live time difference.',
      cta: 'Explore City Converters',
      href: '/city-time-converter',
      icon: (
        <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      links: [
        { label: 'London to New York', href: '/convert/london-to-new-york' },
        { label: 'Tokyo to Sydney', href: '/convert/tokyo-to-sydney' },
        { label: 'Paris to New York', href: '/convert/paris-to-new-york' },
        { label: 'Singapore to London', href: '/convert/singapore-to-london' }
      ]
    },
    {
      title: 'Current Time',
      desc: 'Check the current local time, date, UTC offset, and DST status for any location.',
      cta: 'Check Current Time',
      href: '/current-time',
      icon: (
        <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      links: [
        { label: 'Time in London', href: '/time-in/london' },
        { label: 'Time in New York', href: '/time-in/new-york' },
        { label: 'Time in Tokyo', href: '/time-in/tokyo' },
        { label: 'Time in Paris', href: '/time-in/paris' }
      ]
    },
    {
      title: 'Meeting Planner',
      desc: 'Find working-hour overlap and coordinate meetings across multiple locations.',
      cta: 'Plan a Meeting',
      href: '/meeting-planner',
      icon: (
        <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bullets: [
        'Multiple locations comparison',
        'Working-hour overlap highlights',
        'Visual 24-hour schedules timeline'
      ]
    }
  ];

  return (
    <section className="flex flex-col gap-8 w-full select-none border-t border-border-custom pt-10">
      
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-txt-heading leading-tight">
          Explore Time Zone Tools
        </h2>
        <p className="text-xs sm:text-sm text-txt-secondary leading-normal font-bold">
          Use specialized tools for time conversion, city comparison, local time, and global planning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full mt-2">
        {hubs.map((hub) => (
          <div
            key={hub.title}
            className="group flex flex-col justify-between p-6 rounded-2xl border border-border-custom bg-surf-1 shadow-card hover:shadow-card-hover hover:border-brand-accent hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex flex-col gap-4">
              
              {/* Header area with yellow icon container */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-accent w-fit shadow-xs border border-slate-950/5 group-hover:scale-105 transition-transform duration-200 shrink-0">
                  {hub.icon}
                </div>
                <h3 className="text-base sm:text-lg font-black text-txt-primary leading-snug">
                  {hub.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed font-bold">
                {hub.desc}
              </p>

              {/* Dynamic links grid or bullets */}
              {hub.links ? (
                <div className="grid grid-cols-2 gap-2 border-t border-border-soft pt-4 mt-1">
                  {hub.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="rounded-lg py-1.5 px-1.5 text-center text-txt-secondary hover:text-brand-accent-hover bg-surf-2 border border-border-custom transition-all text-[11px] font-bold truncate"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : hub.bullets ? (
                <div className="flex flex-col gap-2 border-t border-border-soft pt-4 mt-1 text-xs font-bold text-txt-secondary">
                  {hub.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-brand-accent-hover font-black">&bull;</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              ) : null}

            </div>

            {/* Bottom CTA text link */}
            <Link
              href={hub.href}
              className="flex items-center gap-1 text-xs font-black text-brand-accent-hover mt-6 w-fit select-none"
            >
              <span>{hub.cta}</span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

          </div>
        ))}
      </div>

    </section>
  );
}
