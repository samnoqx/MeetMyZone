'use client';

import React from 'react';
import Link from 'next/link';

export default function HomeFinalCTA() {
  return (
    <section className="w-full max-w-7xl mx-auto mt-4 select-none">
      <div className="rounded-2xl border border-border-custom bg-background-secondary p-8 md:p-12 text-center flex flex-col items-center gap-5 shadow-sm">
        
        <h2 className="text-2xl sm:text-3xl font-black text-txt-heading tracking-tight leading-tight">
          Make Time Zones the Easy Part
        </h2>
        
        <p className="text-xs sm:text-sm text-txt-secondary max-w-2xl font-bold leading-relaxed">
          Compare times, coordinate schedules, and plan your next global meeting with colleagues or clients anywhere in the world.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full max-w-xs sm:max-w-md justify-center">
          <Link
            href="/meeting-planner"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-extrabold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent border border-slate-950/5"
          >
            Start Planning
          </Link>
          <Link
            href="/tools"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-border-custom bg-surf-1 hover:bg-surf-2 text-txt-primary font-extrabold text-xs shadow-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            Explore All Tools
          </Link>
        </div>

      </div>
    </section>
  );
}
