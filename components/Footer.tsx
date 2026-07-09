"use client";
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-1 order-2 md:order-1 text-center md:text-left">
          <p className="text-slate-500 text-sm">
            © 2026 MeetMyZone. All rights reserved.
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-sans tracking-wide">
            Timezone calculations are powered by the standard IANA Time Zone Database.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium order-1 md:order-2">
          <Link href="/about-us" className="text-slate-400 hover:text-white transition-colors">About Us</Link>
          <Link href="/contact-us" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link>
          <Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
        </nav>
      </div>
    </footer>
  );
}
