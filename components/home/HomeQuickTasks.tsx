'use client';

import React from 'react';
import Link from 'next/link';

export default function HomeQuickTasks() {
  const tasks = [
    {
      title: 'Compare Time Zones',
      desc: 'See exact time differences, UTC offsets, and DST changes.',
      href: '/timezone-converter',
      icon: (
        <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M18 9a5 5 0 11-10 0 5 5 0 0110 0z" />
        </svg>
      )
    },
    {
      title: 'Find a Meeting Time',
      desc: 'Find practical working-hour overlap across locations.',
      href: '/meeting-planner',
      icon: (
        <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Check Current Time',
      desc: 'View current time, date, UTC offset, and DST status.',
      href: '/current-time',
      icon: (
        <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Coordinate Multiple Locations',
      desc: 'Compare global teams, clients, and offices in one view.',
      href: '/meeting-planner',
      icon: (
        <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="flex flex-col gap-8 w-full select-none border-t border-border-custom pt-10">
      
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-txt-heading leading-tight">
          What do you need to do?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full mt-2">
        {tasks.map((task) => (
          <Link
            key={task.title}
            href={task.href}
            className="group flex flex-col justify-between p-6 rounded-2xl border border-border-custom bg-surf-1 hover:border-brand-accent shadow-card hover:shadow-card-hover hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <div className="flex flex-col gap-4">
              {/* Yellow Icon container */}
              <div className="p-2.5 rounded-xl bg-brand-accent w-fit shadow-sm border border-slate-950/5 group-hover:scale-105 transition-transform duration-200">
                {task.icon}
              </div>
              <h3 className="text-base sm:text-lg font-black text-txt-primary group-hover:text-brand-accent-hover transition-colors leading-snug">
                {task.title}
              </h3>
              <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed font-bold">
                {task.desc}
              </p>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-black text-brand-accent-hover mt-6 select-none">
              <span>Go to tool</span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}
