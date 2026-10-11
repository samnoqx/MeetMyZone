import { normalizeParams } from '@/utils/planner';
import HomeClient from '@/app/HomeClient';
import { parseCitiesSlug, isTimezonePairing } from '@/utils/seoResolver';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default function TimezonePageContent({ cities, query = {} }: { cities: string; query?: Record<string, string | undefined> }) {
  const sParams = normalizeParams(query);
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
      <HomeClient initialDate={new Date().toISOString().slice(0, 10)} initialParams={initialParams} headerPrefix={breadcrumbPrefix} />
    </>
  );
}
