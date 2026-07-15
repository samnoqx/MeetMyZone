import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { BLOG_POSTS, getBlogPostBySlug, getAllBlogSlugs } from '@/lib/blogData';
import BlogCategoryBadge from '@/components/BlogCategoryBadge';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | MeetMyZone',
    };
  }

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `https://meetmyzone.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Find other posts for "More Guides" section
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    publisher: {
      '@type': 'Organization',
      name: 'MeetMyZone',
      logo: {
        '@type': 'ImageObject',
        url: 'https://meetmyzone.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://meetmyzone.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-background text-txt-primary flex flex-col font-sans transition-colors duration-200">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* Global Header */}
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative">
        {/* Back to Blog */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-txt-muted hover:text-brand-accent-deep transition-colors w-fit mb-6 xl:mb-0 xl:fixed xl:top-24 xl:left-[calc(50%-560px)] xl:z-40"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All Guides
        </Link>

        <article className="bg-surf-1 border border-border-custom rounded-2xl p-6 sm:p-10 shadow-card">
          {/* Article Header */}
          <div className="flex flex-col gap-4 border-b border-border-soft pb-6 mb-8">
            {/* Category Badge */}
            <BlogCategoryBadge category={post.category} />

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-txt-heading leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt as lead paragraph */}
            <p className="text-sm sm:text-base text-txt-secondary leading-relaxed font-medium">
              {post.excerpt}
            </p>
          </div>

          {/* Article Body */}
          <div className="text-sm sm:text-base text-txt-secondary leading-relaxed font-medium flex flex-col gap-5 min-h-[120px]">
            {post.content ? (
              post.content
            ) : (
              /* PLACEHOLDER: Full article content to be written */
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4 border border-border-soft rounded-xl bg-background">
                <svg
                  className="w-8 h-8 text-brand-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <p className="text-sm text-txt-muted font-bold">
                  This guide is being prepared.
                </p>
              </div>
            )}
          </div>

          {/* Related Tools */}
          {post.relatedTools.length > 0 && (
            <div className="border-t border-border-soft pt-8 mt-10">
              <h2 className="text-base font-extrabold text-txt-heading mb-4">
                Related Tools
              </h2>
              <div className="flex flex-wrap gap-3">
                {post.relatedTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-custom bg-background hover:border-brand-accent hover:shadow-card-hover text-sm font-bold text-txt-primary hover:text-brand-accent-deep transition-all duration-150"
                  >
                    {tool.label}
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="border-t border-border-soft pt-8 mt-10 text-center flex flex-col gap-4 items-center">
            <h2 className="font-extrabold text-base sm:text-lg text-txt-heading">
              Plan Your Next Global Meeting
            </h2>
            <p className="text-xs sm:text-sm text-txt-muted max-w-md leading-relaxed font-medium">
              Add your team&apos;s locations, compare working hours visually,
              and find the best meeting time — no guesswork required.
            </p>
            <Link
              href="/meeting-planner"
              className="mt-2 inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-black px-6 py-3 rounded-full text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all"
            >
              Open Meeting Planner
            </Link>
          </div>
        </article>

        {/* More Guides */}
        {otherPosts.length > 0 && (
          <section className="mt-12" aria-label="More guides">
            <h2 className="text-lg sm:text-xl font-extrabold text-txt-heading tracking-tight mb-5">
              More Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {otherPosts.map((other) => (
                <Link
                  key={other.slug}
                  href={`/blog/${other.slug}`}
                  className="group flex flex-col gap-3 p-5 rounded-2xl border border-border-custom bg-surf-1 shadow-card hover:shadow-card-hover hover:border-brand-accent hover:-translate-y-1 transition-all duration-200"
                >
                  <BlogCategoryBadge category={other.category} />
                  <span className="text-sm sm:text-base font-extrabold text-txt-heading group-hover:text-brand-accent-deep transition-colors leading-snug">
                    {other.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-brand-accent-deep mt-auto">
                    Read Guide
                    <svg
                      className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
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
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
