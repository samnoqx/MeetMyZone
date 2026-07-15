'use client';

import React from 'react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group select-none">
      <img
        src="/logo.png"
        alt="MeetMyZone Logo"
        className="h-[38.64px] md:h-12 lg:h-[46px] w-auto object-contain group-hover:scale-105 transition-transform"
      />
      <div className="h-[16.56px] md:h-5 flex items-center translate-y-[2px]">
        <img
          src="/wordmark.png"
          alt="MeetMyZone"
          className="h-[16.56px] md:h-5 w-auto object-contain dark:hidden"
        />
        <img
          src="/wordmark-dark.png"
          alt="MeetMyZone"
          className="h-[16.56px] md:h-5 w-auto object-contain hidden dark:block"
        />
      </div>
    </Link>
  );
}
