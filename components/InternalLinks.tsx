import React from 'react';
import Link from 'next/link';

interface PopularPairing {
  slug: string;
  label: string;
}

const POPULAR_PAIRINGS: PopularPairing[] = [
  { slug: 'est-to-ist', label: 'EST to IST Converter' },
  { slug: 'pst-to-est', label: 'PST to EST Converter' },
  { slug: 'utc-to-ist', label: 'UTC to IST Converter' },
  { slug: 'gmt-to-est', label: 'GMT to EST Converter' },
  { slug: 'cet-to-est', label: 'CET to EST Converter' },
  { slug: 'sgt-to-est', label: 'SGT to EST Converter' },
  { slug: 'mst-to-est', label: 'MST to EST Converter' },
  { slug: 'cst-to-est', label: 'CST to EST Converter' },
  { slug: 'ast-to-est', label: 'AST to EST Converter' },
  { slug: 'jst-to-aest', label: 'JST to AEST Converter' },
  { slug: 'kst-to-jst', label: 'KST to JST Converter' },
  { slug: 'london-to-new-york', label: 'London to New York Time' },
  { slug: 'tokyo-to-london', label: 'Tokyo to London Time' },
  { slug: 'paris-to-new-york', label: 'Paris to New York Time' },
  { slug: 'singapore-to-london', label: 'Singapore to London Time' },
  { slug: 'sydney-to-tokyo', label: 'Sydney to Tokyo Time' }
];

export default function InternalLinks() {
  return (
    <div className="border-t border-slate-200 dark:border-slate-800/80 pt-10 mt-10 w-full">
      <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mb-5 tracking-tight">
        Popular Time Zone Overlap Calculations
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {POPULAR_PAIRINGS.map((pairing) => (
          <Link
            key={pairing.slug}
            href={`/convert/${pairing.slug}`}
            className="text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-cyan-400 transition duration-150 font-medium hover:underline truncate"
          >
            {pairing.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
