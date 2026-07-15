import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { BLOG_POSTS } from '@/lib/blogData';
import BlogCategoryBadge from '@/components/BlogCategoryBadge';

export const metadata: Metadata = {
  title: 'Practical Guides for Global Time Coordination | MeetMyZone Blog',
  description:
    'Clear, practical advice for comparing time zones, finding overlapping working hours, and scheduling international meetings without the guesswork.',
  alternates: {
    canonical: 'https://meetmyzone.com/blog',
  },
};

export default function BlogIndexPage() {
  const featuredPosts = BLOG_POSTS.slice(0, 2);
  const latestPosts = BLOG_POSTS.slice(2, 5);

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'MeetMyZone Blog',
    description:
      'Clear, practical advice for comparing time zones, finding overlapping working hours, and scheduling international meetings without the guesswork.',
    url: 'https://meetmyzone.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'MeetMyZone',
    },
  };

  return (
    <div className="min-h-screen bg-background text-txt-primary flex flex-col font-sans transition-colors duration-200">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* Global Header */}
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* ── Hero Section ── */}
        <section className="flex flex-col gap-4 max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <span className="text-[10px] sm:text-xs font-mono font-black tracking-[0.2em] uppercase text-brand-accent-deep">
            Time Zone Guides
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-txt-heading leading-tight tracking-tight">
            Practical Guides for Global Time Coordination
          </h1>
          <p className="text-sm sm:text-base text-txt-secondary leading-relaxed font-medium max-w-xl mx-auto">
            Clear, practical advice for comparing time zones, finding
            overlapping working hours, and scheduling international meetings
            without the guesswork.
          </p>
        </section>

        {/* ── Featured Articles ── */}
        <section className="mb-12 sm:mb-16" aria-label="Featured articles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
                role="article"
                className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-border-custom bg-surf-1 shadow-card hover:shadow-card-hover hover:border-brand-accent hover:-translate-y-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-accent h-full transition-all duration-200"
              >
                {/* Category Badge */}
                <div className="flex flex-col gap-4">
                  <BlogCategoryBadge category={post.category} />

                  <h2 className="text-lg sm:text-xl font-extrabold text-txt-heading leading-snug tracking-tight group-hover:text-brand-accent-deep transition-colors duration-150">
                    {post.title}
                  </h2>

                  <p className="text-sm text-txt-secondary leading-relaxed font-medium">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="border-t border-border-soft pt-4 mt-auto flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-brand-accent tracking-widest uppercase">
                    Featured
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-black text-brand-accent-deep group-hover:text-brand-accent transition-colors"
                  >
                    Read Guide
                    <svg
                      className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Latest Guides ── */}
        <section aria-label="Latest guides">
          <h2 className="text-xl sm:text-2xl font-extrabold text-txt-heading tracking-tight mb-6">
            Latest Guides
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
                role="article"
                className="group flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-border-custom bg-surf-1 shadow-card hover:shadow-card-hover hover:border-brand-accent hover:-translate-y-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-accent h-full transition-all duration-200"
              >
                <div className="flex flex-col gap-3">
                  {/* Category Badge */}
                  <BlogCategoryBadge category={post.category} />

                  <h3 className="text-base sm:text-lg font-extrabold text-txt-heading leading-snug tracking-tight group-hover:text-brand-accent-deep transition-colors duration-150">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed font-medium">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="border-t border-border-soft pt-4 mt-auto flex items-center justify-end">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-black text-brand-accent-deep group-hover:text-brand-accent transition-colors"
                  >
                    Read Guide
                    <svg
                      className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
