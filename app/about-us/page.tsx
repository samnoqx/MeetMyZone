import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

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

const HomeIcon = ({ size = 16 }: { size?: number }) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Sanitize and inject JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema).replace(/</g, '\\u003c') }}
      />
      
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition">
          <ArrowLeftIcon size={16} />
          <span>Back to Planner</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition font-medium">
          <HomeIcon size={16} />
          <span>Home</span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl dark:shadow-2xl">
          
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
                Built by a Developer, For Remote Teams
              </h1>
              <p className="text-xs sm:text-sm text-blue-500 dark:text-blue-400 font-medium">
                Designing visually intuitive solutions for global coordination challenges.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-200">
            
            <section className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-xl">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Core Editorial & Ownership Info
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="bg-teal-500/10 dark:bg-teal-600/20 border border-teal-500/20 text-teal-600 dark:text-teal-400 p-4 rounded-xl font-mono text-center w-full sm:w-auto">
                  <div className="font-extrabold text-sm">samnoqx</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-80">Creator & Systems Engineer</div>
                </div>
                <div className="flex-1 text-[11px] sm:text-xs">
                  <p className="mb-1"><strong>Affiliation:</strong> B.Tech Student in Computer Science and Engineering</p>
                  <p className="mb-1"><strong>Project Domain:</strong> meetmyzone.com</p>
                  <p><strong>Support Channel:</strong> <span className="font-semibold text-teal-600 dark:text-teal-400">support@meetmyzone.com</span></p>
                </div>
              </div>
            </section>
            
            <section className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                The Origin Story
              </h2>
              <p>
                MeetMyZone was born out of personal frustration during my first year as a B.Tech computer science and engineering student. As part of my coursework and extracurricular open-source projects, I regularly collaborated with other student developers, peers, and mentors across different parts of the world—including regions in San Francisco, London, Frankfurt, and Tokyo. I quickly realized how incredibly difficult it was to arrange simple video calls or coordination syncs without running into timezone calculation confusion.
              </p>
              <p>
                Every time we wanted to set up a meeting, we found ourselves wasting time exchanging messages, manually converting hours on our fingers, or searching the web to verify whether a specific location had transitioned to daylight saving time. When I looked for tools online, I found that existing timezone planners were either cluttered with heavy, distracting advertisements, locked behind payment systems, or relied on outdated table layouts designed in the early web era. 
              </p>
              <p>
                Instead of searching for a compromise solution, I decided to take it on as an engineering challenge. I wanted to apply the web development concepts I was learning in college to ship a real-world, premium-feeling application. I built this tool to solve my own timezone problems—and hopefully yours too.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                Why This Project Matters
              </h2>
              <p>
                For a computer science student, it is easy to copy tutorial templates and call it a day. MeetMyZone is different; it represents a commitment to building production-grade software that handles real-world complexity:
              </p>
              <ul className="list-disc list-inside ml-2 flex flex-col gap-3">
                <li>
                  <strong>🎯 Real-World Problem Solving:</strong> This isn&apos;t an academic clone. The slider matrix and dynamic coordinates system are designed to process complex daylight saving modifications (DST) and multi-city timezone changes on the fly.
                </li>
                <li>
                  <strong>💻 Modern Engineering:</strong> I built the application using Next.js 14 App Router, TypeScript, Tailwind CSS, and Luxon. Working with these industry-standard frameworks taught me how to manage client-side state transitions, handle hydration timing, and write performant web logic.
                </li>
                <li>
                  <strong>🌍 Open & Accessible:</strong> MeetMyZone is free forever, has no paywalls, and does not require users to register or sign up. It is made for students, freelancers, independent contractors, and remote teams globally.
                </li>
                <li>
                  <strong>📈 Continuous Learning:</strong> Shipping real code to production has taught me valuable lessons that classroom theory alone cannot cover—from resolving browser back/forward cache inconsistencies to design accessibility.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                My Commitment as a Student Developer
              </h2>
              <p>
                As a first-year engineering student, I want to prove that you don&apos;t need to be a massive tech corporation to ship software that is reliable, clean, and helpful. Every single feature inside MeetMyZone—from the 12/24-hour timeline display toggle to the carefully checked theme-specific gradients—is built on user feedback, iterative commits, and learning from design principles.
              </p>
              <p>
                This application serves as a core piece of my personal engineering portfolio, but it is also a tool I use on a daily basis to connect with classmates, work on hackathons, and plan project meetings. I am dedicated to maintaining this platform, checking timezone database accuracy with official IANA updates, and continually improving the user experience.
              </p>
            </section>

            <section className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                Let&apos;s Connect
              </h2>
              <p>
                Do you have feedback on the timeline sliders? Found an edge-case calculation bug for a particular location? Or perhaps you are a fellow developer who wants to collaborate on open-source web projects? 
              </p>
              <p>
                I review every message and support request personally. You can read more about how to get in touch on the dedicated <Link href="/contact-us" className="text-teal-600 hover:underline font-semibold">Contact Us</Link> page.
              </p>
            </section>

          </div>
        </article>
      </main>
    </div>
  );
}
