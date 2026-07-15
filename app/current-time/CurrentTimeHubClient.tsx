'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import PremiumCard from '@/components/PremiumCard';

export interface ClockItem {
  slug: string;
  displayName: string;
  cityName: string;
  zoneName: string;
}

interface Props {
  clocks: ClockItem[];
}

const SearchIcon = () => (
  <svg className="w-5 h-5 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const POPULAR_SLUGS = ['london', 'new-york', 'tokyo', 'paris', 'dubai', 'sydney'];

export default function CurrentTimeHubClient({ clocks }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filter clocks by query matching
  const filteredClocks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return clocks;

    return clocks.filter(c => {
      return (
        c.slug.toLowerCase().includes(q) ||
        c.displayName.toLowerCase().includes(q) ||
        c.cityName.toLowerCase().includes(q) ||
        c.zoneName.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, clocks]);

  // 2. Separate into "Popular" and "All" list
  const popularClocks = useMemo(() => {
    return filteredClocks.filter(c => POPULAR_SLUGS.includes(c.slug));
  }, [filteredClocks]);

  // 3. Group all filtered clocks alphabetically by their city/display name
  const groupedClocks = useMemo(() => {
    const groups: Record<string, ClockItem[]> = {};

    filteredClocks.forEach(c => {
      const letter = c.displayName.charAt(0).toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(c);
    });

    const sortedKeys = Object.keys(groups).sort();
    const sortedGroups: { letter: string; items: ClockItem[] }[] = [];

    sortedKeys.forEach(key => {
      const sortedItems = groups[key].sort((a, b) => 
        a.displayName.localeCompare(b.displayName)
      );
      sortedGroups.push({
        letter: key,
        items: sortedItems
      });
    });

    return sortedGroups;
  }, [filteredClocks]);

  return (
    <div className="flex flex-col gap-10">
      
      {/* Search Input bar */}
      <div className="relative w-full max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search location clock (e.g. London, Tokyo, EST)..."
          aria-label="Search current time clock list"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-5 py-3.5 border border-border-custom bg-surf-1 rounded-2xl text-sm sm:text-base focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25 text-txt-primary placeholder:text-txt-subtle shadow-sm transition-all"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-txt-muted hover:text-brand-accent-hover transition-colors uppercase cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Popular Section (Wrapped inside one featured container) */}
      {popularClocks.length > 0 && (
        <section className="flex flex-col gap-5">
          <h2 className="text-lg sm:text-xl font-black text-txt-heading flex items-center gap-2">
            <span className="p-1 rounded-md bg-brand-accent-surface text-brand-accent-hover">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </span>
            Popular Clocks & Timezones
          </h2>
          
          <div className="p-6 sm:p-8 rounded-3xl bg-surf-2 border border-border-custom shadow-sm flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularClocks.map((c) => (
                <PremiumCard
                  key={`pop-${c.slug}`}
                  className="premium-card p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover"
                  title={`Time in ${c.displayName}`}
                  description={`Get local current time, offsets, DST adjustments, and calendar overlap status in ${c.displayName} (${c.zoneName}).`}
                  cta={
                    <Link
                      href={`/time-in/${c.slug}`}
                      className="w-full py-2 mt-4 bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-extrabold text-xs rounded-lg transition-colors shadow-sm cursor-pointer text-center active:scale-[0.98] border border-slate-950/5 block"
                    >
                      View Live Clock
                    </Link>
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Grouped Directory */}
      <section className="flex flex-col gap-8 border-t border-border-custom pt-8">
        
        {groupedClocks.length === 0 ? (
          <div className="text-center py-10 flex flex-col gap-2">
            <p className="text-sm font-semibold text-txt-primary">No matching clocks found</p>
            <p className="text-xs text-txt-muted">Try searching for other major locations or abbreviation names</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {groupedClocks.map((group) => (
              <div key={`group-${group.letter}`} className="flex flex-col gap-4">
                
                {/* Large Letter Indicator */}
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-txt-muted select-none">
                    {group.letter}
                  </span>
                  <div className="flex-1 h-px bg-border-custom" />
                </div>

                {/* Cards for this letter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map((c) => (
                    <PremiumCard
                      key={`all-${c.slug}`}
                      className="premium-card p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover"
                      title={`Time in ${c.displayName}`}
                      description={`Get local current time, offsets, DST adjustments, and calendar overlap status in ${c.displayName} (${c.zoneName}).`}
                      cta={
                        <Link
                          href={`/time-in/${c.slug}`}
                          className="w-full py-2 mt-4 bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-extrabold text-xs rounded-lg transition-colors shadow-sm cursor-pointer text-center active:scale-[0.98] border border-slate-950/5 block"
                        >
                          View Live Clock
                        </Link>
                      }
                    />
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
