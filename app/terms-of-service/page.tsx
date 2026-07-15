import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: "Terms of Service | MeetMyZone",
  description: "Read the Terms of Service for MeetMyZone. Understand the conditions of use, user responsibilities, prohibited activities, and legal disclaimers regarding timezone accuracy.",
  alternates: {
    canonical: "https://meetmyzone.com/terms-of-service"
  }
};

const ArrowLeftIcon = ({ size = 16 }: { size?: number }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function TermsOfServicePage() {
  const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service | MeetMyZone",
    "description": "Read the Terms of Service for MeetMyZone. Understand the conditions of use, user responsibilities, prohibited activities, and legal disclaimers regarding timezone accuracy.",
    "url": "https://meetmyzone.com/terms-of-service"
  };

  return (
    <div className="min-h-screen bg-background text-txt-primary flex flex-col font-sans transition-colors duration-200">
      
      {/* Sanitize and inject JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema).replace(/</g, '\\u003c') }}
      />

      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-border-custom flex justify-between items-center bg-background">
        <Link href="/" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-brand-accent transition duration-200 font-medium">
          <ArrowLeftIcon size={16} />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center pr-8 sm:pr-10">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl dark:shadow-2xl font-sans mb-12">
          
          {/* Logo & Headline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            <div className="flex flex-col items-center select-none shrink-0 gap-1">
              <img src="/logo.png" alt="MeetMyZone Logo" className="h-12 w-auto object-contain" />
              <div className="h-6 md:h-[30px] flex items-center">
                <img
                  src="/wordmark.png"
                  alt="MeetMyZone"
                  className="h-6 md:h-[30px] w-auto object-contain dark:hidden"
                />
                <img
                  src="/wordmark-dark.png"
                  alt="MeetMyZone"
                  className="h-6 md:h-[30px] w-auto object-contain hidden dark:block"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Terms of Service
              </h1>
              <p className="text-sm sm:text-base text-brand-accent font-semibold">
                Clear rules for using MeetMyZone safely, fairly, and responsibly.
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                <span>Effective: July 15, 2026</span>
                <span>•</span>
                <span>Updated: July 15, 2026</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-200">
            
            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                1. Acceptance of Terms
              </h2>
              <p>
                Welcome to MeetMyZone (&quot;the Platform&quot;), available at meetmyzone.com. These Terms of Service govern your access to and use of our timezone planning tools, meeting coordination utilities, visual scheduling features, and all related services provided through this website.
              </p>
              <p>
                By accessing or using MeetMyZone, you acknowledge that you have read, understood, and agreed to these Terms. If you do not agree with any portion of these Terms, please discontinue use of the Platform immediately.
              </p>
              <p>
                These Terms apply to all visitors, users, and organizations accessing MeetMyZone.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                2. License to Use the Platform
              </h2>
              <p>
                MeetMyZone grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for lawful personal, educational, or commercial scheduling purposes.
              </p>
              <p>
                You may:
              </p>
              <ul className="list-disc list-inside ml-4 flex flex-col gap-1 mt-1 font-semibold">
                <li>Use the timezone planning tools.</li>
                <li>Create and share planner URLs.</li>
                <li>Export planning layouts.</li>
                <li>Coordinate meetings across different time zones.</li>
              </ul>
              <p className="mt-1">
                You may not claim ownership of any algorithms, interface components, design assets, source code, branding, or proprietary technologies belonging to MeetMyZone.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                3. Timezone Accuracy Disclaimer
              </h2>
              <div className="border-l-4 border-brand-accent bg-brand-accent-surface p-4 rounded-r-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed my-2">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Important Accuracy Notice:</p>
                MeetMyZone uses internationally recognized timezone databases, including the IANA Time Zone Database, to provide reliable timezone calculations. Although we continuously update our systems to maintain accuracy, timezone laws, daylight saving rules, and government regulations may change without notice. Users remain responsible for independently verifying important meeting times before making business, legal, medical, travel, or financial decisions.
              </div>
              <p>
                MeetMyZone shall not be liable for missed meetings, scheduling conflicts, incorrect planning decisions, or any indirect damages resulting from the use of our calculations.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                4. Acceptable Use Policy
              </h2>
              <p>
                To maintain platform integrity, users agree not to:
              </p>
              <ul className="list-disc list-inside ml-4 flex flex-col gap-1 mt-1 font-semibold">
                <li>Reverse engineer the Platform.</li>
                <li>Copy or redistribute proprietary code.</li>
                <li>Use automated scraping software.</li>
                <li>Attempt unauthorized access.</li>
                <li>Interfere with system security.</li>
                <li>Abuse exported planner URLs.</li>
                <li>Use MeetMyZone for unlawful activities.</li>
                <li>Misrepresent ownership of MeetMyZone content.</li>
              </ul>
              <p className="mt-1">
                Violation of these Terms may result in restricted access without prior notice.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                5. Third-Party Services and Advertising
              </h2>
              <p>
                MeetMyZone may display advertisements provided by trusted third-party advertising partners, including Google AdSense. Advertisements, external websites, and third-party services operate under their own policies. MeetMyZone is not responsible for external content, products, privacy practices, or services offered by third parties.
              </p>
              <p>
                For Google&apos;s advertising practices, users may review:
              </p>
              <ul className="list-disc list-inside ml-4 flex flex-col gap-1 mt-1 font-semibold">
                <li>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:text-brand-accent-hover hover:underline transition duration-150">
                    Google Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:text-brand-accent-hover hover:underline transition duration-150">
                    Google Ad Settings
                  </a>
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                6. Intellectual Property
              </h2>
              <p>
                All software, algorithms, interface designs, graphics, logos, branding, icons, documentation, written content, and visual elements of MeetMyZone are protected by copyright, trademark, and applicable intellectual property laws.
              </p>
              <p>
                Unless explicitly permitted in writing, no part of MeetMyZone may be copied, reproduced, modified, redistributed, sold, licensed, or incorporated into another product or commercial service. All rights not expressly granted remain reserved.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                7. Disclaimer of Warranties
              </h2>
              <p>
                MeetMyZone is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
              </p>
              <p>
                While we strive to provide accurate and reliable services, we do not guarantee uninterrupted availability, complete accuracy, or error-free operation. To the fullest extent permitted by law, MeetMyZone disclaims all warranties, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                8. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by applicable law, MeetMyZone shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from the use or inability to use the Platform.
              </p>
              <p>
                This includes, but is not limited to:
              </p>
              <ul className="list-disc list-inside ml-4 flex flex-col gap-1 mt-1 font-semibold">
                <li>Missed meetings</li>
                <li>Scheduling conflicts</li>
                <li>Data loss</li>
                <li>Business interruption</li>
                <li>Financial losses</li>
                <li>Productivity losses</li>
              </ul>
              <p className="mt-1">
                Your use of MeetMyZone is entirely at your own risk.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                9. Governing Law
              </h2>
              <p>
                These Terms shall be governed by the applicable laws of the jurisdiction in which MeetMyZone operates, unless mandatory consumer protection laws require otherwise. Any legal disputes relating to these Terms shall be resolved under the applicable courts of that jurisdiction.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                10. Changes to These Terms
              </h2>
              <p>
                MeetMyZone may update these Terms periodically to reflect new features, legal requirements, security improvements, or operational changes. Whenever significant updates occur, the Effective Date, Last Updated date, and Version Number at the top of this page will also be updated. Users are encouraged to review these Terms periodically.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                11. Contact
              </h2>
              <p>
                If you have questions regarding these Terms of Service, please contact us through our <Link href="/contact-us" className="text-brand-accent hover:text-brand-accent-hover hover:underline transition duration-150 font-semibold">Contact Us</Link> page or by emailing: <a href="mailto:support@meetmyzone.com" className="text-brand-accent hover:text-brand-accent-hover hover:underline transition duration-150 font-semibold">support@meetmyzone.com</a>.
              </p>
            </section>

          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 text-center text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm max-w-xl mx-auto flex flex-col gap-1">
            <p>
              Thank you for choosing MeetMyZone.
            </p>
            <p>
              We are committed to building reliable, privacy-first, and easy-to-use timezone planning tools that help individuals, remote teams, educators, freelancers, and businesses coordinate across the world with confidence.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
