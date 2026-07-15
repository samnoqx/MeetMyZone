import HomeClient from '../../HomeClient';
import { parseCitiesSlug, isTimezonePairing } from '../../../utils/seoResolver';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    cities: string;
  }>;
  searchParams: Promise<{
    reference?: string;
    workStart?: string;
    workEnd?: string;
    date?: string;
  }>;
}

export const revalidate = 86400; // Cache pages for 24 hours (1 day)

export async function generateStaticParams() {
  return [
    { cities: 'est-to-ist' },
    { cities: 'ist-to-est' },
    { cities: 'pst-to-est' },
    { cities: 'est-to-pst' },
    { cities: 'utc-to-ist' },
    { cities: 'ist-to-utc' },
    { cities: 'gmt-to-est' },
    { cities: 'est-to-gmt' },
    { cities: 'cet-to-est' },
    { cities: 'est-to-cet' },
    { cities: 'london-to-new-york' },
    { cities: 'new-york-to-london' },
    { cities: 'singapore-to-est' },
    { cities: 'est-to-singapore' },
    { cities: 'sgt-to-est' },
    { cities: 'est-to-sgt' },
    { cities: 'mst-to-est' },
    { cities: 'est-to-mst' },
    { cities: 'cst-to-est' },
    { cities: 'est-to-cst' },
    { cities: 'ast-to-est' },
    { cities: 'est-to-ast' },
    { cities: 'jst-to-aest' },
    { cities: 'aest-to-jst' },
    { cities: 'kst-to-jst' },
    { cities: 'jst-to-kst' },
    { cities: 'tokyo-to-london' },
    { cities: 'london-to-tokyo' },
    { cities: 'paris-to-new-york' },
    { cities: 'new-york-to-paris' },
    { cities: 'singapore-to-london' },
    { cities: 'london-to-singapore' },
    { cities: 'sydney-to-tokyo' },
    { cities: 'tokyo-to-sydney' },
    { cities: 'los-angeles-to-new-york' },
    { cities: 'new-york-to-los-angeles' }
  ];
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { cities } = await params;
  const sParams = await searchParams;
  const resolved = parseCitiesSlug(cities);
  
  if (resolved.length === 0) {
    return {
      title: "Time Zone Converter | MeetMyZone",
      description: "Compare timezone schedules and identify optimal overlap working hours to plan international meetings."
    };
  }
  
  const formattedCities = resolved.map(c => c.cityName).join(', ');
  const title = `Timezone Planner: ${formattedCities} | MeetMyZone`;
  const description = `Compare schedules and find the best timezone overlap to plan meetings across ${formattedCities}${sParams.date ? ` on ${sParams.date}` : ''}. Easy visual meeting planner.`;
  
  // Construct search parameters for the dynamic Open Graph image
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('cities', resolved.map(c => c.cityName).join(','));
  ogSearchParams.set('zones', resolved.map(c => c.timezone).join(','));
  if (sParams.reference) ogSearchParams.set('reference', sParams.reference);
  if (sParams.workStart) ogSearchParams.set('workStart', sParams.workStart);
  if (sParams.workEnd) ogSearchParams.set('workEnd', sParams.workEnd);
  if (sParams.date) ogSearchParams.set('date', sParams.date);
  
  const relativeOgUrl = `/api/og?${ogSearchParams.toString()}`;
  
  // Prevent duplicate content penalty by canonicalizing 2-city queries to the dedicated convert page
  const canonicalUrl = resolved.length === 2
    ? `https://meetmyzone.com/convert/${resolved[0].cityName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-to-${resolved[1].cityName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}`
    : `https://meetmyzone.com/timezone/${cities}`;
  
  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'MeetMyZone',
      images: [
        {
          url: relativeOgUrl,
          width: 1200,
          height: 630,
          alt: `Timezone timeline overview for ${formattedCities}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [relativeOgUrl],
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { cities } = await params;
  const sParams = await searchParams;
  const resolved = parseCitiesSlug(cities);
  
  if (resolved.length === 0) {
    notFound();
  }
  
  const initialParams = {
    cities: resolved.map(c => c.cityName).join(','),
    zones: resolved.map(c => c.timezone).join(','),
    reference: sParams.reference || resolved[0].cityName,
    workStart: sParams.workStart,
    workEnd: sParams.workEnd,
    date: sParams.date,
  };

  const isTz = resolved.length === 2 && isTimezonePairing(`${resolved[0].cityName.toLowerCase()}-to-${resolved[1].cityName.toLowerCase()}`);
  const citiesDisplay = resolved.map(c => c.cityName).join(' to ');

  const breadcrumbPrefix = (
    <nav aria-label="Breadcrumb" className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <span className="text-slate-400 dark:text-slate-650">/</span>
        </li>
        <li>
          <Link href={isTz ? "/timezone-converter" : "/city-time-converter"} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            {isTz ? "Time Zone Converter" : "City Time Converter"}
          </Link>
        </li>
        <li>
          <span className="text-slate-400 dark:text-slate-650">/</span>
        </li>
        <li aria-current="page" className="text-teal-600 dark:text-teal-400 font-bold truncate max-w-[200px] sm:max-w-none">
          {resolved.map(c => c.cityName).join(' to ')}
        </li>
      </ol>
    </nav>
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `https://meetmyzone.com/timezone/${cities}/#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://meetmyzone.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": isTz ? "Time Zone Converter" : "City Time Converter",
        "item": isTz ? "https://meetmyzone.com/timezone-converter" : "https://meetmyzone.com/city-time-converter"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": citiesDisplay,
        "item": `https://meetmyzone.com/timezone/${cities}`
      }
    ]
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <HomeClient initialParams={initialParams} headerPrefix={breadcrumbPrefix} />
    </>
  );
}
