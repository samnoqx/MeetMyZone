"use client";
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 text-sm order-2 md:order-1">
          © 2026 MeetMyZone. All rights reserved.
        </p>
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
