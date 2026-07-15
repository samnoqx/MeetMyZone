'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-footer-bg border-t border-border-custom py-12 mt-auto text-sm transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Footer content grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          
          {/* Left Column: Brand Info */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group select-none w-fit">
              <img
                src="/logo.png"
                alt="MeetMyZone Logo"
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <div className="h-[18px] flex items-center translate-y-[4px]">
                <img
                  src="/wordmark.png"
                  alt="MeetMyZone"
                  className="h-[18px] w-auto object-contain dark:hidden"
                />
                <img
                  src="/wordmark-dark.png"
                  alt="MeetMyZone"
                  className="h-[18px] w-auto object-contain hidden dark:block"
                />
              </div>
            </Link>
            <p className="text-xs text-txt-muted font-bold leading-relaxed max-w-xs">
              Making global time coordination simple, accurate, and effortless.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-txt-primary uppercase tracking-wider">Product</span>
            <Link href="/meeting-planner" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">Meeting Planner</Link>
            <Link href="/timezone-converter" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">Time Zone Converter</Link>
            <Link href="/city-time-converter" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">City Time Converter</Link>
            <Link href="/current-time" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">Current Time</Link>
          </div>

          {/* Column 3: Time Tools */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-txt-primary uppercase tracking-wider">Time Tools</span>
            <Link href="/convert/gmt-to-est" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">GMT to EST</Link>
            <Link href="/convert/utc-to-ist" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">UTC to IST</Link>
            <Link href="/convert/est-to-pst" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">EST to PST</Link>
            <Link href="/convert/cet-to-est" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">CET to EST</Link>
          </div>

          {/* Column 4: Resources */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-txt-primary uppercase tracking-wider">Resources</span>
            <Link href="/about-us" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">About Us</Link>
            <Link href="/contact-us" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">Contact Us</Link>
            <Link href="/blog" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">Guides</Link>
          </div>

          {/* Column 5: Legal */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-txt-primary uppercase tracking-wider">Legal</span>
            <Link href="/privacy-policy" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-txt-secondary hover:text-brand-accent-hover transition-colors font-medium">Terms of Service</Link>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="border-t border-border-custom pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-txt-muted font-bold">
            &copy; {currentYear} MeetMyZone. All rights reserved.
          </span>
          <span className="text-xs text-txt-muted font-bold text-center md:text-right">
            Time zone calculations use the IANA Time Zone Database.
          </span>
        </div>

      </div>
    </footer>
  );
}
