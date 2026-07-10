import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: "MeetMyZone Blog | Global Time Zone Strategy & Remote Work Guides",
  description: "Expert insights, technical guides, and scheduling advice covering remote work logistics, daylight saving transitions, DST compliance, and digital nomad planning.",
  alternates: {
    canonical: "https://meetmyzone.com/blog"
  }
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  cluster: string;
  keywords: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "remote-work-hours-overlap-engineering-teams",
    title: "How to Coordinate Working Hours Overlap for Distributed Engineering Teams",
    excerpt: "Learn how to calculate maximum working overlaps, establish healthy core hours, and design async developer pipelines across global offsets.",
    date: "July 2026",
    readTime: "8 min read",
    cluster: "Remote Work Logistics",
    keywords: ["working hours overlap", "remote engineering schedules", "timezone overlap calculator"]
  },
  {
    slug: "managing-global-payroll-deadlines-timezone-shifts",
    title: "Managing Global Payroll Deadlines Across Multiple Time Zone Shifts",
    excerpt: "A guide for HR operations managers on managing banking settlement cuts, automated payroll runs, and daylight saving shifts without payment delay.",
    date: "July 2026",
    readTime: "6 min read",
    cluster: "International Business Compliance",
    keywords: ["global payroll timezone compliance", "banking cut-off times", "DST payroll delays"]
  },
  {
    slug: "daylight-saving-time-cron-jobs-server-scheduling",
    title: "How Daylight Saving Time Transitions Affect Cron Jobs and Server Schedules",
    excerpt: "Technical analysis of DST overlap risks on backend schedules. Learn how to design robust cron systems using UTC and offset-aware timers.",
    date: "July 2026",
    readTime: "10 min read",
    cluster: "Time Zone Technical Mechanics",
    keywords: ["daylight saving cron job error", "DST server time synchronization", "UTC cron jobs"]
  },
  {
    slug: "best-timezone-digital-nomads-usa-clients",
    title: "Choosing the Best Timezone Overlap for Digital Nomads with USA Clients",
    excerpt: "Strategic guide on choosing geographical bases in Latin America, Europe, or Asia to maintain a healthy 4-hour overlap with US EST/PST clients.",
    date: "July 2026",
    readTime: "7 min read",
    cluster: "Global Travel & Nomad Planning",
    keywords: ["digital nomad timezone strategy", "US client timezone overlap", "work overlap remote base"]
  },
  {
    slug: "developers-guide-timezone-abbreviations-offsets",
    title: "A Developer's Guide to Timezone Abbreviations and Standard Offsets",
    excerpt: "Demystifying GMT, UTC, EST, IST, and the IANA database. Learn why abbreviations are not unique and how to store offsets safely in database structures.",
    date: "July 2026",
    readTime: "9 min read",
    cluster: "Time Zone Technical Mechanics",
    keywords: ["timezone abbreviations reference", "IANA database timezone guide", "GMT vs UTC for developers"]
  }
];

export default function BlogIndexPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "MeetMyZone Blog",
    "description": "Expert insights, technical guides, and scheduling advice covering remote work logistics, daylight saving transitions, DST compliance, and digital nomad planning.",
    "url": "https://meetmyzone.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "MeetMyZone"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Sanitize and inject JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema).replace(/</g, '\\u003c') }}
      />
      
      {/* Header Nav */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition">
          <span>← Back to Planner</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600 dark:from-white dark:to-cyan-400">
            MeetMyZone Blog
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex flex-col gap-6 text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
            Global Time Zones & Distributed Work Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Resources, guidelines, and articles explaining the mechanics of daylight saving shifts, remote work productivity, timezone math, and global operational compliance.
          </p>
        </div>

        {/* Blog Post List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.slug} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md hover:shadow-lg dark:shadow-2xl transition-all duration-200"
            >
              <div className="flex flex-col gap-3">
                {/* Meta details */}
                <div className="flex items-center justify-between gap-2 text-[10px] sm:text-xs">
                  <span className="bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900 px-2 py-0.5 rounded-full font-bold">
                    {post.cluster}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight hover:text-teal-600 dark:hover:text-cyan-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans mt-1">
                  {post.excerpt}
                </p>
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-6 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{post.date}</span>
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="text-xs font-bold text-teal-600 hover:text-teal-500 dark:text-cyan-400 dark:hover:text-teal-300 flex items-center gap-1 hover:underline"
                >
                  Read Article &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
