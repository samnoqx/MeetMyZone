'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import PremiumCard from '@/components/PremiumCard';

export interface ResolvedPairingItem {
  slug: string;
  sourceDisplayName: string;
  sourceCityName: string;
  targetDisplayName: string;
  targetCityName: string;
}

interface Props {
  pairings: ResolvedPairingItem[];
}

const SearchIcon = () => (
  <svg className="w-5 h-5 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const POPULAR_SLUGS = ['london-to-new-york', 'tokyo-to-london', 'paris-to-new-york', 'singapore-to-london', 'sydney-to-tokyo'];

export default function CityTimeConverterHubClient({ pairings }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filter pairings by query matching
  const filteredPairings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return pairings;

    return pairings.filter(p => {
      return (
        p.slug.toLowerCase().includes(q) ||
        p.sourceDisplayName.toLowerCase().includes(q) ||
        p.sourceCityName.toLowerCase().includes(q) ||
        p.targetDisplayName.toLowerCase().includes(q) ||
        p.targetCityName.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, pairings]);

  // 2. Separate into "Popular" and "All" list
  const popularPairings = useMemo(() => {
    return filteredPairings.filter(p => POPULAR_SLUGS.includes(p.slug));
  }, [filteredPairings]);

  // 3. Group all filtered pairings alphabetically by their source city name
  const groupedPairings = useMemo(() => {
    const groups: Record<string, ResolvedPairingItem[]> = {};

    filteredPairings.forEach(p => {
      const letter = p.sourceDisplayName.charAt(0).toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(p);
    });

    const sortedKeys = Object.keys(groups).sort();
    const sortedGroups: { letter: string; items: ResolvedPairingItem[] }[] = [];

    sortedKeys.forEach(key => {
      const sortedItems = groups[key].sort((a, b) => 
        a.sourceDisplayName.localeCompare(b.sourceDisplayName) ||
        a.targetDisplayName.localeCompare(b.targetDisplayName)
      );
      sortedGroups.push({
        letter: key,
        items: sortedItems
      });
    });

    return sortedGroups;
  }, [filteredPairings]);

  return (
    <div className="flex flex-col gap-10">
      
      {/* Search Input bar */}
      <div className="relative w-full max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search city converter (e.g. London, New York)..."
          aria-label="Search city time converter list"
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
      {popularPairings.length > 0 && (
        <section className="flex flex-col gap-5">
          <h2 className="text-lg sm:text-xl font-black text-txt-heading flex items-center gap-2">
            <span className="p-1 rounded-md bg-brand-accent-surface text-brand-accent-hover">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </span>
            Popular City Time Converters
          </h2>
          
          <div className="p-6 sm:p-8 rounded-3xl bg-surf-2 border border-border-custom shadow-sm flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPairings.map((p) => (
                <PremiumCard
                  key={`pop-${p.slug}`}
                  className="premium-card p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover"
                  title={`${p.sourceDisplayName} to ${p.targetDisplayName}`}
                  description={`Compare local times, time differences, and find the best meeting overlap between ${p.sourceDisplayName} and ${p.targetDisplayName}.`}
                  cta={
                    <Link
                      href={`/convert/${p.slug}`}
                      className="w-full py-2 mt-4 bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-extrabold text-xs rounded-lg transition-colors shadow-sm cursor-pointer text-center active:scale-[0.98] border border-slate-950/5 block"
                    >
                      Open Converter
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
        
        {groupedPairings.length === 0 ? (
          <div className="text-center py-10 flex flex-col gap-2">
            <p className="text-sm font-semibold text-txt-primary">No matching city converters found</p>
            <p className="text-xs text-txt-muted">Try searching for other major cities like London, Tokyo, or New York</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {groupedPairings.map((group) => (
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
                  {group.items.map((p) => (
                    <PremiumCard
                      key={`all-${p.slug}`}
                      className="premium-card p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover"
                      title={`${p.sourceDisplayName} to ${p.targetDisplayName}`}
                      description={`Compare local times, time differences, and find the best meeting overlap between ${p.sourceDisplayName} and ${p.targetDisplayName}.`}
                      cta={
                        <Link
                          href={`/convert/${p.slug}`}
                          className="w-full py-2 mt-4 bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-extrabold text-xs rounded-lg transition-colors shadow-sm cursor-pointer text-center active:scale-[0.98] border border-slate-950/5 block"
                        >
                          Open Converter
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
