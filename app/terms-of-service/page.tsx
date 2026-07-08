import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | MeetMyZone",
  description: "Read the Terms of Service for MeetMyZone. Understand the conditions of use, user responsibilities, prohibited activities, and legal disclaimers regarding timezone accuracy.",
  alternates: {
    canonical: "https://meetmyzone.com/terms-of-service"
  }
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-250">

      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition">
          <span>← Back to Planner</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition font-medium">
          <span>🏠 Home</span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl dark:shadow-2xl font-sans">

          {/* Logo & Headline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            <div className="flex flex-col items-center select-none shrink-0">
              <img src="/logo.png" alt="MeetMyZone Logo" className="h-20 md:h-24 w-auto object-contain" />
              <span className="font-black text-2xl md:text-3xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-cyan-400 -mt-3 md:-mt-4">
                MeetMyZone
              </span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Terms of Service
              </h1>
              <p className="text-xs sm:text-sm text-blue-500 dark:text-blue-400 font-medium">
                Last updated: July 2026. Legal terms and disclaimer of timezone calculations.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 text-xs sm:text-sm leading-relaxed text-slate-650 dark:text-slate-350">

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                1. Acceptance of Terms & Welcome to MeetMyZone
              </h2>
              <p>
                Welcome to MeetMyZone (accessible via meetmyzone.com). These Terms of Service outline the rules, conditions, and regulations governing your use of our timezone alignment tools, planning sliders, meeting organizers, and overall platform content.
              </p>
              <p className="mt-1">
                By accessing, browsing, or using this website, you accept and agree to comply fully with these terms. If you do not agree with any part of these Terms of Service, you must discontinue using our services immediately. Your continued use of the platform constitutes binding acceptance of these terms.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                2. Intended Use & License Grants
              </h2>
              <p>
                MeetMyZone provides a free, visual coordination utility designed to help remote workers, distributed team leads, and international organizations coordinate working hours, find overlap slots, and export calendar links.
              </p>
              <p className="mt-1">
                We grant you a personal, non-exclusive, non-transferable, revocable license to access and use our website and tools strictly for your personal or commercial meeting organization workflows. You may copy planning layout URLs containing encoded parameters to share availability tables with colleagues and teammates, but you do not acquire any ownership over the underlying mathematical matrices, database queries, visual assets, or source code.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                3. Accuracy Disclaimer & Critical Limitation of Liability
              </h2>
              <div className="border-l-4 border-amber-500 bg-amber-500/5 p-4 rounded-r-lg italic text-slate-600 dark:text-slate-400 font-medium">
                &quot;Timezone data is provided as-is; we are not liable for missed meetings, scheduling misunderstandings, calendar overlap issues, or operational disruptions arising from using this tool.&quot;
              </div>
              <p className="mt-2">
                While we make every effort to ensure the accuracy of all coordinate maps, daylight saving transitions, and regional calendar calculations by aligning our systems with updates from the official IANA database, local governments modify daylight saving boundaries or shift standard UTC offsets with short notice. MeetMyZone does not guarantee the complete error-free nature of all computations. Users are strongly encouraged to manually double-check critical global meeting times, especially around regional seasonal transition weeks.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                4. Prohibited Uses & Scraping Restrictions
              </h2>
              <p>
                As a condition of your use of MeetMyZone, you agree not to:
              </p>
              <ul className="list-disc list-inside ml-2 flex flex-col gap-1.5 mt-1">
                <li>Deploy automated scraping tools, crawlers, or extraction scripts to harvest data from our geocoding search processes or underlying database indices.</li>
                <li>Attempt to bypass, disable, or disrupt the visual layouts, client-side scripts, or routing patterns of the platform.</li>
                <li>Copy, reverse engineer, clone, or build derivative products using our layout configurations, color-coded working hour slider modules, or branding graphics without express written consent from the creators.</li>
                <li>Embed our visual timeline comparison in third-party frames or applications in a way that attempts to conceal or misrepresent the source of the tool.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                5. Third-Party Advertisements & Google AdSense Links
              </h2>
              <p>
                MeetMyZone incorporates third-party advertising services (including Google AdSense) to keep this utility free for all users. By using the site, you acknowledge that advertisements may contain outbound links to third-party pages. MeetMyZone is not responsible for the content, privacy policies, practices, or terms of any third-party links or services. Clicking on any third-party advertisement is at your own risk.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                6. Intellectual Property Rights
              </h2>
              <p>
                All proprietary algorithms, stylesheet models, graphics, logo icons (including the transparent monogram logo.png), website layout styling, HTML5 code, and copywriting contained on MeetMyZone are the exclusive intellectual property of the team and are protected by international copyright, trademark, and intellectual property laws. All rights not explicitly granted herein are reserved.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                7. Governing Law & Disclaimers of Warranties
              </h2>
              <p>
                This website and its tools are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, either express or implied, including, but not limited to, warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p className="mt-1">
                These Terms of Service shall be governed by, and construed in accordance with, the laws of the jurisdiction in which our team coordinates development, without giving effect to any principles of conflicts of law. You agree that any legal action arising out of or relating to these Terms shall be filed only in courts located in that state, and you hereby consent to the personal jurisdiction of such courts for the purpose of litigating any action.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                8. Modifying These Terms of Service
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify, update, or replace any part of these Terms of Service at any time. We will indicate the date of the latest update at the top of this document. It is your responsibility to review these terms periodically for changes. Your continued use of the website following the posting of modifications constitutes acceptance of the new Terms.
              </p>
            </section>

            <p className="mt-2 text-xs text-slate-450 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4">
              If you have any questions or require clarification regarding these Terms of Service, please reach out to us at <span className="font-semibold text-blue-500 dark:text-blue-400">support@meetmyzone.com</span> or write to us through our <Link href="/contact-us" className="text-teal-650 hover:underline">Contact Form</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
