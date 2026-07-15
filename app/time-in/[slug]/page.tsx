import { resolveSlug } from '../../../utils/seoResolver';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import WorldClock from '@/components/WorldClock';
import Header from '@/components/Header';
import { DateTime } from 'luxon';
import {
  getDstDetail,
  getTimezoneFacts,
  POPULAR_CITIES_GEO,
  getCountryForTimezone,
  generateTimeInIntro,
  generateCityFAQs,
  generateRelatedLinksForCity
} from '../../../utils/seoContent';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 86400; // Cache pages for 24 hours (1 day)

export async function generateStaticParams() {
  const slugs = [
    'est', 'ist', 'pst', 'utc', 'gmt', 'cet', 'mst', 'cst', 'ast', 'sgt', 'jst', 'kst', 'aest',
    'london', 'new-york', 'tokyo', 'sydney', 'paris', 'dubai', 'los-angeles', 'mumbai', 'singapore', 'seoul', 'berlin', 'denver', 'halifax'
  ];
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveSlug(slug);
  
  if (!resolved) {
    return {
      title: "Local Time | MeetMyZone",
      description: "Check the local time and timezone offsets for major cities and regions worldwide."
    };
  }
  
  const city = resolved.cityName;
  const zoneName = resolved.zoneName;
  const country = POPULAR_CITIES_GEO[slug.toLowerCase()]?.country || getCountryForTimezone(zoneName);
  
  const title = `Current Time in ${city} | Live ${city} Clock | MeetMyZone`;
  const description = `Check the current local time in ${city}, ${country}. View the live clock, UTC offset, daylight saving information, working hours, and compare ${city} with other major cities.`;
  
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('cities', city);
  ogSearchParams.set('zones', zoneName);
  ogSearchParams.set('reference', city);
  const relativeOgUrl = `/api/og?${ogSearchParams.toString()}`;
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://meetmyzone.com/time-in/${slug.toLowerCase()}`,
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
          alt: `Current local time in ${city}`,
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

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolveSlug(slug);
  
  if (!resolved) {
    notFound();
  }
  
  const city = resolved.cityName;
  const zoneName = resolved.zoneName;
  const dst = getDstDetail(resolved);
  const country = POPULAR_CITIES_GEO[slug.toLowerCase()]?.country || getCountryForTimezone(zoneName);
  const geoInfo = POPULAR_CITIES_GEO[slug.toLowerCase()];
  const region = geoInfo?.region || zoneName.split('/')[0] || 'Global';
  
  const coordinates = geoInfo 
    ? `${Math.abs(geoInfo.lat).toFixed(4)}° ${geoInfo.lat >= 0 ? 'N' : 'S'}, ${Math.abs(geoInfo.lng).toFixed(4)}° ${geoInfo.lng >= 0 ? 'E' : 'W'}`
    : 'N/A';
  
  const intro = generateTimeInIntro(resolved, country);
  const faqs = generateCityFAQs(resolved, dst);
  const facts = getTimezoneFacts(resolved.slug, resolved.displayName, resolved.zoneName);
  const related = generateRelatedLinksForCity(resolved);

  // Compute offset representation
  const dtNow = DateTime.now().setZone(zoneName);
  const offsetMinutes = dtNow.offset;
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absOffsetMinutes / 60);
  const offsetMinsRemainder = absOffsetMinutes % 60;
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const offsetVal = `UTC${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinsRemainder).padStart(2, '0')}`;

  const getCombinedSchema = () => {
    const webpageSchema = {
      "@type": "WebPage",
      "@id": `https://meetmyzone.com/time-in/${slug}/#webpage`,
      "url": `https://meetmyzone.com/time-in/${slug}`,
      "name": `Current Time in ${city} | Live clock, DST, and UTC offset | MeetMyZone`,
      "description": `Check the current local time in ${city}, ${country}. View the live clock, UTC offset, daylight saving information, working hours, and compare ${city} with other major cities.`,
      "breadcrumb": {
        "@id": `https://meetmyzone.com/time-in/${slug}/#breadcrumb`
      }
    };

    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": `https://meetmyzone.com/time-in/${slug}/#breadcrumb`,
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
          "name": "Local Time",
          "item": `https://meetmyzone.com/time-in/${slug}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": city,
          "item": `https://meetmyzone.com/time-in/${slug}`
        }
      ]
    };

    const faqSchema = {
      "@type": "FAQPage",
      "@id": `https://meetmyzone.com/time-in/${slug}/#faq`,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    return {
      "@context": "https://schema.org",
      "@graph": [
        webpageSchema,
        breadcrumbSchema,
        faqSchema
      ]
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-txt-primary transition-colors duration-200">
      
      {/* Combined JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getCombinedSchema()).replace(/</g, '\\u003c') }}
      />

      {/* Shared Header Navigation */}
      <Header />

      {/* Above the Fold hero panel */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-6 flex-1 pb-16">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs sm:text-sm font-semibold text-txt-primary">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-brand-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded">
                Home
              </Link>
            </li>
            <li>
              <span className="text-txt-subtle select-none">/</span>
            </li>
            <li>
              <Link href="/current-time" className="hover:text-brand-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded">
                Local Time
              </Link>
            </li>
            <li>
              <span className="text-txt-subtle select-none">/</span>
            </li>
            <li aria-current="page" className="text-brand-accent truncate font-bold uppercase select-none">
              {city}
            </li>
          </ol>
        </nav>

        {/* H1 and Intro Paragraph */}
        <header className="flex flex-col gap-3 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Current Local Time in {city}
          </h1>
          <p className="text-sm sm:text-base text-slate-705 dark:text-slate-350 leading-relaxed">
            {intro}
          </p>
        </header>

        {/* Large live clock */}
        <div className="w-full my-2">
          <WorldClock
            singleCityMode={true}
            initialCity1={city}
            initialZone1={zoneName}
            initialCountry1={country}
          />
        </div>

        {/* Dynamic content sections grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mt-2">
          
          {/* Timezone Summary Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="premium-card p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-mono tracking-widest text-txt-secondary uppercase font-extrabold">Timezone</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{resolved.displayName}</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 font-mono truncate">{zoneName}</span>
            </div>

            <div className="premium-card p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-mono tracking-widest text-txt-secondary uppercase font-extrabold">UTC Offset</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono">{offsetVal}</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 truncate">Live offset check</span>
            </div>

            <div className="premium-card p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-mono tracking-widest text-txt-secondary uppercase font-extrabold">DST Status</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{dst.isCurrentlyDst ? 'Active' : 'Inactive'}</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 truncate">{dst.observeDst ? 'Observes DST' : 'No DST observed'}</span>
            </div>

            <div className="premium-card p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-mono tracking-widest text-txt-secondary uppercase font-extrabold">Country</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{country}</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 truncate">Sovereign nation</span>
            </div>

            <div className="premium-card p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-mono tracking-widest text-txt-secondary uppercase font-extrabold">Region</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{region}</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 truncate">Geographical sector</span>
            </div>

            <div className="premium-card p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-1 shadow-sm">
              <span className="text-[10px] font-mono tracking-widest text-txt-secondary uppercase font-extrabold">Coordinates</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-mono truncate">{coordinates}</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 truncate">Lat / Lng decimal</span>
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="lg:col-span-1 premium-card p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col justify-between gap-4 shadow-sm">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-brand-accent uppercase font-extrabold block">
                Standard Working Hours
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Availability Profile
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                Typical professional working hours in {city} span from <span className="font-extrabold text-slate-900 dark:text-white">9:00 AM to 5:00 PM</span>, Monday through Friday. Local lunch breaks usually happen between 12:00 PM and 1:00 PM.
              </p>
            </div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800/80 pt-3">
              Peak Collaboration Window: 09:00 - 17:00
            </div>
          </div>

        </div>

        {/* Educational Reference Section */}
        <section className="flex flex-col gap-6 mt-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Timezone profile & Travel Guide
          </h2>
          <div className="premium-card premium-card-static p-6 sm:p-8 rounded-2xl border-0 bg-white dark:bg-[#0f172a] grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-semibold">
            <div className="flex flex-col gap-3.5">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block mb-0.5">Standard Timezone Name</span>
                <span className="text-slate-650 dark:text-slate-350">{facts.fullName}</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block mb-0.5">UTC Baseline Offset</span>
                <span className="text-slate-650 dark:text-slate-350 font-mono font-bold">{facts.standardOffset}</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block mb-0.5">Geographic Coverage</span>
                <span className="text-slate-650 dark:text-slate-350 leading-relaxed">{facts.regions}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3.5">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block mb-0.5">Business & Financial Usage</span>
                <span className="text-slate-650 dark:text-slate-350 leading-relaxed">{facts.businessUsage}</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block mb-0.5">Travel Significance & Gateways</span>
                <span className="text-slate-650 dark:text-slate-350 leading-relaxed">{facts.travelRelevance}</span>
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block mb-0.5">Remote Collaboration Strategy</span>
                <span className="text-slate-650 dark:text-slate-350 leading-relaxed">{facts.remoteWork}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic FAQ List */}
        <section className="flex flex-col gap-6 mt-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div key={`city-faq-${index}`} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] rounded-2xl shadow-sm">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Content Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 dark:border-slate-800 pt-10 mt-10">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Related Timezone Converters
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold">
              {related.converters.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className="text-txt-primary hover:text-brand-accent transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded">
                    {link.label} &rarr;
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Related Local Time Pages
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold">
              {related.currentTimes.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className="text-txt-primary hover:text-brand-accent transition-colors duration-150 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded">
                    {link.label} &rarr;
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </main>

    </div>
  );
}
