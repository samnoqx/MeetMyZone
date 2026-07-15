import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: "About Us | MeetMyZone",
  description: "Discover the origin story and mission behind MeetMyZone, a visual timezone meeting planner built by a B.Tech student to solve scheduling problems.",
  alternates: {
    canonical: "https://meetmyzone.com/about-us"
  }
};

const ArrowLeftIcon = ({ size = 16 }: { size?: number }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);


export default function AboutUsPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Us | MeetMyZone",
    "description": "Discover the origin story and mission behind MeetMyZone, a visual timezone meeting planner built by a B.Tech student to solve scheduling problems.",
    "url": "https://meetmyzone.com/about-us",
    "mainEntity": {
      "@type": "Organization",
      "name": "MeetMyZone",
      "url": "https://meetmyzone.com",
      "logo": "https://meetmyzone.com/logo.png"
    }
  };

  return (
    <div className="min-h-screen bg-background text-txt-primary flex flex-col font-sans transition-colors duration-200">
      
      {/* Sanitize and inject JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema).replace(/</g, '\\u003c') }}
      />
      
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-border-custom flex justify-between items-center bg-background">
        <Link href="/" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-brand-accent transition duration-200">
          <ArrowLeftIcon size={16} />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center pr-8 sm:pr-10">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl dark:shadow-2xl">
          
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
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                About Us
              </h1>
              <p className="text-sm sm:text-base text-brand-accent font-semibold">
                Built to Make Global Time Coordination Simple
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-200">
            
            <p>
              MeetMyZone is a software platform dedicated to helping people coordinate time across cities, countries, and time zones with confidence. Whether you&apos;re scheduling an international meeting, planning remote collaboration, comparing business hours, or simply checking the current local time anywhere in the world, MeetMyZone provides reliable tools designed to make global time management easier.
            </p>
            <p>
              Our goal is straightforward: remove the complexity of timezone calculations so individuals, businesses, students, freelancers, and distributed teams can focus on productive communication instead of manual conversions.
            </p>

            <section className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-xl">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Who We Are
              </h2>
              <p>
                MeetMyZone develops practical tools that simplify global scheduling and time coordination. Our platform combines accuracy, usability, and performance to deliver a modern experience for anyone working across multiple time zones.
              </p>
              <p>
                We continuously improve our products by refining user experience, expanding features, and ensuring our calculations stay aligned with official timezone standards and daylight saving time (DST) updates.
              </p>
              <p>
                Every feature is designed with simplicity, speed, and reliability in mind.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                What We Build
              </h2>
              <p>
                MeetMyZone offers a growing collection of productivity tools designed for international collaboration, including:
              </p>
              <ul className="list-disc list-inside ml-2 flex flex-col gap-3 text-slate-600 dark:text-slate-200">
                <li>Meeting Planner</li>
                <li>Time Zone Converter</li>
                <li>City Time Converter</li>
                <li>Current Local Time</li>
                <li>World Clock</li>
                <li>Business Hour Overlap Tools</li>
                <li>Time Difference Comparison</li>
                <li>Global Scheduling Utilities</li>
              </ul>
              <p>
                These tools are built to support professionals, remote teams, freelancers, students, educators, travelers, businesses, and anyone who works across different regions of the world.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                Our Mission
              </h2>
              <p>
                Our mission is to make global time coordination accessible, accurate, and effortless.
              </p>
              <p>
                As work, education, and communication become increasingly international, scheduling across multiple time zones should not be difficult. MeetMyZone is committed to building tools that eliminate confusion and help users make informed scheduling decisions quickly.
              </p>
              <p>
                We believe technology should simplify everyday tasks through clean design, reliable calculations, and an intuitive user experience.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                Why MeetMyZone Matters
              </h2>
              <p>
                Modern organizations often collaborate across continents, making accurate timezone coordination essential. Even small scheduling mistakes can affect meetings, project deadlines, customer support, and business communication.
              </p>
              <p>
                MeetMyZone helps reduce these challenges by providing clear visual comparisons, business-hour overlap calculations, current local time information, and reliable timezone conversion tools that support confident decision-making.
              </p>
              <p>
                Our platform is designed to serve both occasional users and professionals who rely on accurate scheduling every day.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                Our Commitment
              </h2>
              <p>
                MeetMyZone is committed to delivering a dependable platform that users can trust.
              </p>
              <p>
                We continuously work to:
              </p>
              <ul className="list-disc list-inside ml-2 flex flex-col gap-3 text-slate-600 dark:text-slate-200">
                <li>Maintain accurate timezone calculations.</li>
                <li>Keep daylight saving time (DST) information up to date.</li>
                <li>Improve platform performance and accessibility.</li>
                <li>Expand our collection of scheduling and timezone tools.</li>
                <li>Deliver a consistent experience across desktop and mobile devices.</li>
                <li>Build features that solve real-world coordination challenges.</li>
              </ul>
              <p>
                Our focus is on creating practical software that remains simple, reliable, and easy to use.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                Accuracy & Reliability
              </h2>
              <p>
                Timezone data changes periodically as governments update regional time policies and daylight saving rules.
              </p>
              <p>
                MeetMyZone is designed to reflect these changes using recognized timezone standards, helping users access reliable scheduling information whenever possible. While every effort is made to maintain accuracy, we continuously monitor improvements and refine the platform to provide dependable results.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                Privacy & User Trust
              </h2>
              <p>
                User trust is an important part of everything we build.
              </p>
              <p>
                MeetMyZone is committed to respecting user privacy and providing a transparent experience. Our platform is designed to deliver useful tools without unnecessary complexity, and we continually work to improve security, performance, and overall reliability.
              </p>
              <p>
                For detailed information about how information is handled, please review our <Link href="/privacy-policy" className="text-brand-accent hover:text-brand-accent-hover hover:underline font-semibold">Privacy Policy</Link> and <Link href="/terms-of-service" className="text-brand-accent hover:text-brand-accent-hover hover:underline font-semibold">Terms of Service</Link>.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                Looking Ahead
              </h2>
              <p>
                MeetMyZone continues to evolve as new tools, improvements, and features are introduced.
              </p>
              <p>
                Our long-term vision is to become a trusted destination for global time coordination by providing accurate, user-friendly solutions that help individuals and organizations schedule confidently across time zones.
              </p>
              <p>
                We remain committed to continuous improvement, thoughtful product development, and delivering practical value to users around the world.
              </p>
            </section>

            <section className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                Contact Us
              </h2>
              <p>
                We welcome feedback, suggestions, partnership inquiries, and support requests.
              </p>
              <p>
                If you have questions about MeetMyZone or need assistance using any of our tools, please visit our <Link href="/contact-us" className="text-brand-accent hover:text-brand-accent-hover hover:underline font-semibold">Contact Us</Link> page. Our team reviews inquiries carefully and values feedback that helps improve the platform.
              </p>
            </section>

          </div>
        </article>
      </main>
    </div>
  );
}
