import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import ContactForm from '../../components/ContactForm';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: "Contact Us | MeetMyZone",
  description: "Get in touch with the MeetMyZone support team. Submit bug reports, feature requests, or general inquiries directly to our developer.",
  alternates: {
    canonical: "https://meetmyzone.com/contact-us"
  }
};

const ArrowLeftIcon = ({ size = 16 }: { size?: number }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const HomeIcon = ({ size = 16 }: { size?: number }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export default function ContactUsPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us | MeetMyZone",
    "description": "Get in touch with the MeetMyZone support team. Submit bug reports, feature requests, or general inquiries.",
    "url": "https://meetmyzone.com/contact-us",
    "mainEntity": {
      "@type": "Organization",
      "name": "MeetMyZone",
      "url": "https://meetmyzone.com",
      "logo": "https://meetmyzone.com/logo.png"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Sanitize and inject JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema).replace(/</g, '\\u003c') }}
      />

      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition">
          <ArrowLeftIcon size={16} />
          <span>Back to Planner</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition font-medium">
            <HomeIcon size={16} />
            <span>Home</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center gap-6">
        
        {/* Brand & Centered Header (Card/Box Style) */}
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md dark:shadow-xl flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-1 justify-center">
            <img src="/logo.png" alt="MeetMyZone Logo" className="h-20 md:h-24 w-auto object-contain -mr-4 md:-mr-6" />
            <span className="font-black text-3xl sm:text-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600 dark:from-white dark:to-cyan-400">
              MeetMyZone
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
            Contact Us
          </h1>
        </div>

        {/* The Client Form Component */}
        <ContactForm />

        {/* Detailed Copy & AdSense Compliance Sections */}
        <div className="w-full max-w-lg mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex flex-col gap-6 border-t border-slate-200 dark:border-slate-800 pt-8 leading-relaxed font-sans">
          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              Response SLA & Support Scope
            </h2>
            <p>
              As an independent student developer currently in my first year of a B.Tech program, I handle all operational maintenance and support tasks for MeetMyZone personally. Because I balance ongoing university lecture schedules, exams, and lab routines with the maintenance of this tool, I typically reply to incoming emails within **24 to 48 hours**. Security-related vulnerabilities or critical calculations anomalies will be prioritized.
            </p>
            <p>
              When reporting calculation inconsistencies or daylight saving shift discrepancies, please specify the exact location cities, reference times, and parameters utilized in your planner view. This facilitates replication on my end, allowing me to push updates to the production branch sooner.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
              Secure Cloudflare Infrastructure
            </h2>
            <p>
              Privacy and data minimization are core principles of MeetMyZone. I do not integrate third-party contact databases or marketing form processors. The contact email is managed through Cloudflare Email Routing. Any message you transmit is forwarded directly to my personal developer inbox with transit security protocols active. I never save, store, or sell metadata headers or message content.
            </p>
          </section>

          {/* Internal Footer Navigation Links */}
          <section className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-slate-200 dark:border-slate-800 pt-6 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            <Link href="/privacy-policy" className="hover:text-teal-600 transition">
              Privacy Policy
            </Link>
            <Link href="/about-us" className="hover:text-teal-600 transition">
              About My Mission
            </Link>
            <Link href="/" className="hover:text-teal-600 transition">
              Timezone Planner
            </Link>
          </section>
        </div>

      </main>
    </div>
  );
}
