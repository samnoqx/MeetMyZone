import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | MeetMyZone",
  description: "Read the Privacy Policy for MeetMyZone. Learn how we handle your timezone calculations, third-party cookies, Google AdSense integrations, and compliance under GDPR and CCPA.",
  alternates: {
    canonical: "https://meetmyzone.com/privacy-policy"
  }
};

export default function PrivacyPolicyPage() {
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
                Privacy Policy
              </h1>
              <p className="text-xs sm:text-sm text-blue-500 dark:text-blue-400 font-medium">
                Last updated: July 2026. Your privacy and advertising disclosures.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-350">
            
            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200">
                1. General Overview & Privacy Commitment
              </h2>
              <p>
                At MeetMyZone, accessible from meetmyzone.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document outline the types of information that is collected and recorded by MeetMyZone and how we use it. We are committed to processing all user information in strict accordance with global standards, including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and Google AdSense partner guidelines.
              </p>
              <p>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <span className="font-semibold text-blue-500 dark:text-blue-400">support@meetmyzone.com</span>.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200">
                2. Timezone Calculations & Zero Data Storage Policy
              </h2>
              <p>
                MeetMyZone operates as a client-side utility. All computations, calculations, and conversions you make on our visual planning grid are parsed entirely within your local browser sandbox using Javascript libraries (specifically Luxon and standard browser window components). We do not record, store, collect, or transmit:
              </p>
              <ul className="list-disc list-inside ml-2 flex flex-col gap-1 mt-1 font-mono text-[10px] sm:text-xs">
                <li>The cities and regions you search or add to your planner.</li>
                <li>The selected date and timeline hours you adjust on the slider matrix.</li>
                <li>The meeting event titles, descriptions, and durations you input in the scheduling popups.</li>
              </ul>
              <p className="mt-1">
                If you click on the share buttons, the configurations of your timezone matrix are compressed and encoded directly into URL query parameters. This allows you to share custom configurations with remote team members by copy-pasting the link. Because these configurations are written directly into the URL, they are never uploaded to a backend database or saved on our servers.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200">
                3. Google AdSense & Third-Party Cookies Disclosure
              </h2>
              <p>
                We integrate third-party advertising partners, including Google AdSense, to support our free timezone planning utility. To display relevant advertising campaigns, these third-party vendors use cookies and Web Beacons on our platform.
              </p>
              <p className="mt-1">
                Google, as a third-party vendor, uses cookies—specifically the DoubleClick DART cookie—to serve ads to visitors of meetmyzone.com based on their visits to our site and other pages on the internet. You can choose to decline the use of DART cookies by visiting the Google ad network and Content Network Privacy Policy at:
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-block ml-1 font-semibold">https://policies.google.com/technologies/ads</a>.
              </p>
              <p className="mt-2">
                These third-party ad networks use tracking technologies in the advertisements and links that appear on MeetMyZone, which are sent directly to your browser. They automatically receive your IP address when this happens. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content you see on websites that you visit. MeetMyZone has no access to or control over these cookies used by third-party advertisers.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200">
                4. Consent Management Platform (CMP) & GDPR/UK Compliance
              </h2>
              <p>
                To comply with Google AdSense rules and regional data protection regulations (such as GDPR in the European Economic Area and UK GDPR in the United Kingdom), MeetMyZone implements a Google-certified Consent Management Platform (CMP).
              </p>
              <p className="mt-1">
                When you access our platform from these regions, you will be presented with a consent banner allowing you to consent to, customize, or refuse the collection and use of personal data for personalized advertising and analytics. Your consent choices are securely stored and respected across all third-party advertising providers, including Google AdSense. You can review or modify your consent settings at any time by clearing your browser cookies or clicking the consent options link where available.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200">
                5. Third-Party Privacy Policies & Cookie Opt-Out
              </h2>
              <p>
                MeetMyZone&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
              <p className="mt-1">
                You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers&apos; respective websites.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200">
                6. GDPR Data Protection Rights
              </h2>
              <p>
                We want to make sure you are fully aware of all of your data protection rights under the General Data Protection Regulation (GDPR). Every user is entitled to the following rights:
              </p>
              <ul className="list-disc list-inside ml-2 flex flex-col gap-1.5 mt-1">
                <li><strong>The right to access</strong> – You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
                <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
                <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
                <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
                <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
              </ul>
              <p className="mt-1">
                If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200">
                7. CCPA Privacy Rights (Do Not Sell My Personal Information)
              </h2>
              <p>
                Under the California Consumer Privacy Act (CCPA), among other rights, California consumers have the right to:
              </p>
              <ul className="list-disc list-inside ml-2 flex flex-col gap-1 mt-1">
                <li>Request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
                <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
                <li>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data.</li>
              </ul>
              <p className="mt-1">
                MeetMyZone does not sell user data of any kind. If you submit a request regarding your data, we have one month to reply.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200">
                8. Information Collected via Support Queries
              </h2>
              <p>
                If you contact our support desk directly through our contact form or by email, we receive the details of your inquiry, including your name, email address, and subject content. This information is collected solely to answer your questions, resolve technical bugs, or address partnership requests. We store this information securely via our processing partner (Formspree) and delete correspondence logs periodically when they are no longer needed.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-850 dark:text-slate-200">
                9. Children&apos;s Information
              </h2>
              <p>
                Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
              </p>
              <p className="mt-1">
                MeetMyZone does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
