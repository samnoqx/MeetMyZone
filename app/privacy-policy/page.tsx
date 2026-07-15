import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: "Privacy Policy | MeetMyZone",
  description: "Learn how MeetMyZone protects your privacy, minimizes data collection, manages cookies, supports Google AdSense compliance, and safeguards your information while using our global timezone planning platform.",
  alternates: {
    canonical: "https://meetmyzone.com/privacy-policy"
  }
};

const ArrowLeftIcon = ({ size = 16 }: { size?: number }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function PrivacyPolicyPage() {
  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy | MeetMyZone",
    "description": "Learn how MeetMyZone protects your privacy, minimizes data collection, manages cookies, supports Google AdSense compliance, and safeguards your information while using our global timezone planning platform.",
    "url": "https://meetmyzone.com/privacy-policy"
  };

  return (
    <div className="min-h-screen bg-background text-txt-primary flex flex-col font-sans transition-colors duration-200">
      
      {/* Sanitize and inject JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema).replace(/</g, '\\u003c') }}
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
                Privacy Policy
              </h1>
              <p className="text-sm sm:text-base text-brand-accent font-semibold">
                Protecting your privacy with transparency, security, and trust.
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
                1. General Overview & Privacy Commitment
              </h2>
              <p>
                At MeetMyZone, we follow a privacy-first philosophy. Our platform is designed to help users coordinate time zones globally while processing only the minimum information required to deliver our services. Most of our tools and functionalities operate fully without requiring user registration or account creation. We process data in strict compliance with applicable privacy laws, including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and Google AdSense publisher policies.
              </p>
              <p>
                If you have questions regarding this Privacy Policy or our practices, please contact us at <a href="mailto:support@meetmyzone.com" className="text-brand-accent hover:text-brand-accent-hover hover:underline transition duration-150 font-semibold">support@meetmyzone.com</a> or visit our <Link href="/contact-us" className="text-brand-accent hover:text-brand-accent-hover hover:underline transition duration-150 font-semibold">Contact Us</Link> page.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                2. Timezone Calculations & Zero Data Storage
              </h2>
              <p>
                MeetMyZone operates on a privacy-by-design architecture. The platform operates without mandatory user accounts, and all timezone conversions, timelines, and meeting layout calculations occur locally inside your browser sandbox.
              </p>
              <p>
                No planner history, added cities, or timeline sessions are permanently stored on MeetMyZone servers. Meeting layouts remain strictly in your browser memory. When you share a timeline layout, the layout parameters are compressed and encoded directly into the share link parameters. Because this configuration resides entirely within the generated URL itself, it is never transmitted to a database.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                3. Google AdSense & Third-Party Cookies
              </h2>
              <p>
                Advertising helps keep MeetMyZone free. To support platform development, we integrate third-party ad networks, primarily Google AdSense. Google and other vendors may display relevant advertisements using tracking tools like cookies and web beacons in accordance with Google&apos;s advertising policies.
              </p>
              <p>
                Google uses the DoubleClick DART cookie to serve personalized ads. You can opt out of the use of DART cookies by visiting the Google Advertising Privacy Policy:
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:text-brand-accent-hover hover:underline inline-block ml-1 font-semibold transition duration-150">https://policies.google.com/technologies/ads</a>.
              </p>
              <p className="mt-1">
                Please note that MeetMyZone has no access to or control over these advertising cookies managed by third-party vendors.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                4. Consent Management Platform (CMP)
              </h2>
              <p>
                MeetMyZone implements a Google-certified Consent Management Platform (CMP) to comply with data protection regulations, including the GDPR and UK GDPR. Visitors from the European Economic Area (EEA) and the United Kingdom are presented with a consent banner to customize or refuse data collection for advertising and analytics. Consent choices are stored locally and respected across third-party providers. You can modify your consent preferences at any time by clearing your browser cookies.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                5. Third-Party Privacy Policies
              </h2>
              <p>
                We advise you to consult the respective privacy policies of third-party advertising networks for detailed instructions on managing cookie preferences or opting out of tracking.
              </p>
              <p className="mt-1">
                You can manage or opt-out of personalized third-party cookies globally through these portals:
              </p>
              <ul className="list-disc list-inside ml-4 flex flex-col gap-1 mt-1 font-semibold">
                <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:text-brand-accent-hover hover:underline transition duration-150">Network Advertising Initiative (NAI) Opt-Out</a></li>
                <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:text-brand-accent-hover hover:underline transition duration-150">Digital Advertising Alliance (DAA) Choice Center</a></li>
                <li><a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:text-brand-accent-hover hover:underline transition duration-150">EDAA Consumer Opt-Out (Europe)</a></li>
              </ul>
              <p className="mt-2">
                This Privacy Policy applies only to MeetMyZone and its official services. It does not apply to external websites or third-party services linked from our platform. We encourage users to review the privacy policies of those external services before sharing personal information.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                6. GDPR Data Protection Rights
              </h2>
              <p>
                We want to ensure you are fully aware of all your data protection rights under the General Data Protection Regulation (GDPR). Every user is entitled to the following:
              </p>
              <ul className="list-disc list-inside ml-4 flex flex-col gap-1.5 mt-1">
                <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
                <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate, or complete information you believe is incomplete.</li>
                <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.</li>
              </ul>
              <p className="mt-1">
                Upon submitting a request, we have one month to respond. If you would like to exercise any of these rights, please contact our support team at <a href="mailto:support@meetmyzone.com" className="text-brand-accent hover:text-brand-accent-hover hover:underline font-semibold transition duration-150">support@meetmyzone.com</a>.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                7. CCPA Privacy Rights (Do Not Sell My Personal Information)
              </h2>
              <p>
                Under the California Consumer Privacy Act (CCPA), California consumers have the right to request that a business disclose the categories and specific pieces of personal data collected, request deletion of collected personal data, and opt out of the sale of personal data.
              </p>
              <p>
                MeetMyZone does not sell personal information. If you submit a request regarding your data, we have one month to respond. Please file your request through our <Link href="/contact-us" className="text-brand-accent hover:text-brand-accent-hover hover:underline font-semibold transition duration-150">Contact Us</Link> page.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                8. Information Collected through Support Requests
              </h2>
              <p>
                If you contact us directly via email, we receive the details of your inquiry, including your name, email address, and message content. This information is processed solely for customer support, addressing bug reports, feature requests, partnership discussions, and platform improvements. All support correspondence is securely handled and periodically deleted once resolved and no longer required.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                9. Children&apos;s Information
              </h2>
              <p>
                We prioritize protecting children online and encourage parents and guardians to guide and monitor online activity. MeetMyZone does not knowingly collect Personally Identifiable Information from children under the age of 13. If you believe your child has provided this type of information on our platform, please <Link href="/contact-us" className="text-brand-accent hover:text-brand-accent-hover hover:underline font-semibold transition duration-150">contact us</Link> immediately, and we will make every effort to promptly remove such records.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                10. Data We Do Not Collect
              </h2>
              <p>
                As part of our commitment to data minimization, MeetMyZone does not collect, process, or permanently store:
              </p>
              <ul className="list-disc list-inside ml-4 flex flex-col gap-1 mt-1 font-semibold text-slate-500 dark:text-slate-400">
                <li>Account passwords or login credentials.</li>
                <li>Credit card, billing, or payment information.</li>
                <li>Private timezone planning layouts and session histories.</li>
                <li>Background geolocation or device tracking metadata.</li>
                <li>Government-issued identification numbers (including passport and national ID information).</li>
                <li>Biometric information (including fingerprints, facial recognition data, and voiceprints).</li>
              </ul>
              <p className="mt-1">
                This rigorous alignment highlights MeetMyZone&apos;s continuous commitment to data minimization.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                11. Policy Updates
              </h2>
              <p>
                This Privacy Policy may be updated periodically to reflect platform improvements, new features, legal requirements, or security enhancements. Whenever significant updates are made, the Effective Date displayed at the top of this page will also be updated. We encourage users to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                12. Questions About Privacy
              </h2>
              <p>
                If you have questions regarding this Privacy Policy, your personal information, or your privacy rights, please contact our support team through the <Link href="/contact-us" className="text-brand-accent hover:text-brand-accent-hover hover:underline font-semibold transition duration-150">Contact Us</Link> page or by emailing <a href="mailto:support@meetmyzone.com" className="text-brand-accent hover:text-brand-accent-hover hover:underline font-semibold transition duration-150">support@meetmyzone.com</a>. We strive to respond to legitimate privacy inquiries promptly and professionally.
              </p>
            </section>

          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 text-center text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm max-w-xl mx-auto flex flex-col gap-1">
            <p>
              Thank you for choosing MeetMyZone.
            </p>
            <p>
              We are committed to building secure, privacy-first tools that simplify global time coordination while protecting your personal information with transparency, integrity, and respect.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
