'use client';

import React from 'react';
import Link from 'next/link';
import HomeTimePreview from './HomeTimePreview';

export default function HomeHero() {
  return (
    <section className="w-full max-w-7xl mx-auto py-6 md:py-12 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Headline and CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-hover" />
            <span className="text-xs font-mono font-black text-brand-accent-hover tracking-widest uppercase">
              GLOBAL TIME COORDINATION
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-txt-heading leading-tight">
            Plan Across<br />Time Zones<br />
            <span className="bg-linear-to-r from-grad-from via-grad-via to-grad-to bg-clip-text text-transparent">
              Without the Guesswork
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-txt-secondary leading-relaxed max-w-xl font-bold">
            Compare local times, find overlapping work hours, and schedule meetings across global teams—all in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full max-w-md">
            <Link
              href="/meeting-planner"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-extrabold text-sm sm:text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent border border-slate-950/5"
            >
              Plan a Meeting
            </Link>
            <Link
              href="/timezone-converter"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border-custom hover:border-brand-accent bg-surf-1 hover:bg-surf-2 text-txt-primary font-extrabold text-sm sm:text-base shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Compare Time Zones
            </Link>
          </div>

          {/* Supporting Audience Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-xs font-bold text-txt-muted border-t border-border-custom pt-6">
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>For Global Teams</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Remote Work</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Client Meetings</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>Travel</span>
            </div>

          </div>

        </div>

        {/* Right Column: Hero Live Clocks Card */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <HomeTimePreview initialClock1={{ city: 'London', country: 'United Kingdom', timezone: 'local' }} />
        </div>

      </div>
    </section>
  );
}
