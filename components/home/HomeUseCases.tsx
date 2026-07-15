'use client';

import React from 'react';

export default function HomeUseCases() {
  const useCases = [
    {
      title: 'Global Teams',
      desc: 'Coordinate colleagues across offices, departments, and continents seamlessly.',
      icon: (
        <svg className="w-5 h-5 text-txt-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 4.03 3 9s-1.343 9-3 9m0-18c-1.657 0-3 4.03-3 9s1.343 9 3 9m-9-9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      title: 'Client Meetings',
      desc: 'Find practical client meeting slots without endless email threads or alignment errors.',
      icon: (
        <svg className="w-5 h-5 text-txt-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      )
    },
    {
      title: 'Remote Work',
      desc: 'Check live overlapping hours to optimize real-time collaboration or daily handoffs.',
      icon: (
        <svg className="w-5 h-5 text-txt-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: 'Travel & Call Planning',
      desc: 'Check exact time shifts and local dates before departures, flights, or international family calls.',
      icon: (
        <svg className="w-5 h-5 text-txt-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    }
  ];

  return (
    <section className="flex flex-col gap-8 w-full select-none border-t border-border-custom pt-10">
      
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-txt-heading leading-tight">
          Built for Work, Travel, and Everyday Coordination
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full mt-2">
        {useCases.map((uc) => (
          <div
            key={uc.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-border-custom bg-background-secondary shadow-sm"
          >
            <div className="p-2.5 rounded-xl bg-surf-1 w-fit border border-border-custom shadow-xs">
              {uc.icon}
            </div>
            <h3 className="text-base font-black text-txt-primary leading-snug font-sans">
              {uc.title}
            </h3>
            <p className="text-xs sm:text-sm text-txt-secondary font-bold leading-relaxed">
              {uc.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
