'use client';

import React from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blogData';

export default function HomeGuides() {
  // Display the first 2 featured blog posts
  const featuredPosts = BLOG_POSTS.slice(0, 2);

  return (
    <section className="flex flex-col gap-8 w-full select-none border-t border-border-custom pt-10">
      
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-txt-heading leading-tight">
          Time Zone Guides
        </h2>
        <p className="text-xs sm:text-sm text-txt-secondary leading-normal font-bold">
          Practical guidance for international scheduling and global coordination.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto w-full mt-2">
        {featuredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col justify-between p-6 rounded-2xl border border-border-custom bg-surf-1 hover:border-brand-accent hover:-translate-y-1 shadow-card hover:shadow-card-hover transition-all duration-200"
          >
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono font-black text-brand-accent-hover uppercase tracking-widest">
                {post.category}
              </span>
              <h3 className="text-base sm:text-lg font-black text-txt-primary group-hover:text-brand-accent-hover transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed font-bold">
                {post.excerpt}
              </p>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-black text-brand-accent-hover mt-6 select-none">
              <span>Read Guide</span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}
