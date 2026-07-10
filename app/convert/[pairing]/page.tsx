import { parsePairing } from '../../../utils/seoResolver';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import ConverterClient from './ConverterClient';
import ThemeToggle from '@/components/ThemeToggle';
import {
  calculateTimeDifference,
  calculateOverlapAndRecommendation,
  getDstDetail,
  getTimezoneFacts,
  generateDynamicIntro,
  generateFAQs,
  generateRelatedConverters,
  generateRelatedCities
} from '../../../utils/seoContent';

interface PageProps {
  params: Promise<{
    pairing: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { pairing: 'est-to-ist' },
    { pairing: 'ist-to-est' },
    { pairing: 'pst-to-est' },
    { pairing: 'est-to-pst' },
    { pairing: 'utc-to-ist' },
    { pairing: 'ist-to-utc' },
    { pairing: 'gmt-to-est' },
    { pairing: 'est-to-gmt' },
    { pairing: 'cet-to-est' },
    { pairing: 'est-to-cet' },
    { pairing: 'london-to-new-york' },
    { pairing: 'new-york-to-london' },
    { pairing: 'singapore-to-est' },
    { pairing: 'est-to-singapore' },
    { pairing: 'sgt-to-est' },
    { pairing: 'est-to-sgt' },
    { pairing: 'mst-to-est' },
    { pairing: 'est-to-mst' },
    { pairing: 'cst-to-est' },
    { pairing: 'est-to-cst' },
    { pairing: 'ast-to-est' },
    { pairing: 'est-to-ast' },
    { pairing: 'jst-to-aest' },
    { pairing: 'aest-to-jst' },
    { pairing: 'kst-to-jst' },
    { pairing: 'jst-to-kst' },
    { pairing: 'tokyo-to-london' },
    { pairing: 'london-to-tokyo' },
    { pairing: 'paris-to-new-york' },
    { pairing: 'new-york-to-paris' },
    { pairing: 'singapore-to-london' },
    { pairing: 'london-to-singapore' },
    { pairing: 'sydney-to-tokyo' },
    { pairing: 'tokyo-to-sydney' }
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pairing } = await params;
  const resolved = parsePairing(pairing);
  
  if (!resolved) {
    return {
      title: "Time Zone Converter | MeetMyZone",
      description: "Compare timezone schedules and identify optimal overlap working hours to plan international meetings."
    };
  }
  
  const zoneA = resolved.zoneA;
  const zoneB = resolved.zoneB;
  const nameA = zoneA.displayName.toUpperCase();
  const nameB = zoneB.displayName.toUpperCase();
  const cityA = zoneA.cityName;
  const cityB = zoneB.cityName;
  
  const title = `${nameA} to ${nameB} Converter | Live Time Difference & Meeting Planner | MeetMyZone`;
  const description = `Convert ${nameA} to ${nameB} instantly using our live time converter. Compare business hours overlap, plan team meetings, and align schedules for free.`;
  
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('cities', `${cityA},${cityB}`);
  ogSearchParams.set('zones', `${zoneA.zoneName},${zoneB.zoneName}`);
  ogSearchParams.set('reference', cityA);
  const relativeOgUrl = `/api/og?${ogSearchParams.toString()}`;
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://meetmyzone.com/convert/${pairing.toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: relativeOgUrl,
          width: 1200,
          height: 630,
          alt: `Timezone overlap comparison for ${nameA} and ${nameB}`,
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
  const { pairing } = await params;
  const resolved = parsePairing(pairing);
  
  if (!resolved) {
    notFound();
  }
  
  const zoneA = resolved.zoneA;
  const zoneB = resolved.zoneB;

  const diff = calculateTimeDifference(zoneA, zoneB);
  const overlap = calculateOverlapAndRecommendation(zoneA, zoneB);
  const dstA = getDstDetail(zoneA);
  const dstB = getDstDetail(zoneB);
  const intro = generateDynamicIntro(zoneA, zoneB);
  const faqs = generateFAQs(zoneA, zoneB, diff.diffText, overlap.recommendation, dstA, dstB);
  const factsA = getTimezoneFacts(zoneA.slug, zoneA.displayName, zoneA.zoneName);
  const factsB = getTimezoneFacts(zoneB.slug, zoneB.displayName, zoneB.zoneName);
  const relatedConverters = generateRelatedConverters(zoneA, zoneB);
  const relatedCities = generateRelatedCities(zoneA, zoneB);

  const getCombinedSchema = () => {
    const softwareSchema = {
      "@type": "SoftwareApplication",
      "@id": "https://meetmyzone.com/#software-application",
      "name": "MeetMyZone Time Zone Converter",
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      },
      "description": "MeetMyZone is a premium visual timezone meeting planner and timezone converter that aligns team working hours side-by-side on an interactive timeline grid."
    };

    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": `https://meetmyzone.com/convert/${pairing}/#breadcrumb`,
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
          "name": "Converters",
          "item": `https://meetmyzone.com/convert/${pairing}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${zoneA.displayName.toUpperCase()} to ${zoneB.displayName.toUpperCase()}`,
          "item": `https://meetmyzone.com/convert/${pairing}`
        }
      ]
    };

    const faqSchema = {
      "@type": "FAQPage",
      "@id": `https://meetmyzone.com/convert/${pairing}/#faq`,
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
        softwareSchema,
        breadcrumbSchema,
        faqSchema
      ]
    };
  };
  
  return (
    <div>
      <div className="flex-1 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex flex-col justify-start pb-20 font-sans selection:bg-teal-500/30 selection:text-teal-600 dark:selection:text-teal-300 transition-colors duration-200 min-h-screen">
        
        {/* Combined JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getCombinedSchema()).replace(/</g, '\\u003c') }}
        />

        {/* Minimal Navigation Bar */}
        <nav className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-900">
          <Link href="/" className="flex items-center gap-1 md:gap-3 group select-none -ml-3 md:ml-0">
            <img
              src="/logo.png"
              alt="MeetMyZone Logo"
              className="h-20 md:h-24 w-auto object-contain group-hover:scale-105 transition-transform my-auto -mr-8 md:-mr-8"
            />
            <span className="font-black text-2xl md:text-3xl tracking-tight leading-normal bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-cyan-400 group-hover:opacity-90 transition-opacity">
              MeetMyZone
            </span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/blog"
              className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-extrabold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Blog
            </Link>
            <ThemeToggle />
          </div>
        </nav>

        {/* Hero Title & Description block */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8 mb-4">
          <header className="flex flex-col gap-3.5 max-w-4xl">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-slate-400 dark:text-slate-600">/</span>
                </li>
                <li>
                  <span className="text-slate-600 dark:text-slate-400">Converters</span>
                </li>
                <li>
                  <span className="text-slate-400 dark:text-slate-600">/</span>
                </li>
                <li aria-current="page" className="text-teal-600 dark:text-teal-400 truncate max-w-[200px] sm:max-w-none font-bold">
                  {zoneA.displayName.toUpperCase()} to {zoneB.displayName.toUpperCase()}
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {zoneA.displayName.toUpperCase()} to {zoneB.displayName.toUpperCase()} Time Converter
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {intro}
            </p>
          </header>
        </div>



        {/* Standalone Live Converter Interface (preloaded above-the-fold) */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-6">
          <ConverterClient
            key={pairing}
            initialCities={[zoneA.cityName, zoneB.cityName]}
            initialCityTimezones={{
              [zoneA.cityName]: zoneA.zoneName,
              [zoneB.cityName]: zoneB.zoneName
            }}
            initialReferenceCity={zoneA.cityName}
          />
        </div>

        {/* Dynamic SEO Landing Page Content Section */}
        <section className="bg-slate-100/50 dark:bg-[#020617] border-t border-slate-300 dark:border-slate-900 py-12 md:py-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-16 text-slate-900 dark:text-slate-100">
            

            {/* Business Hours & Meeting recommendations */}
            <div className="premium-card p-6 sm:p-8 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Working Hours Overlap & Meeting Recommendations
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-2">
                <div className="lg:col-span-2 flex flex-col gap-3">
                  <p className="text-sm sm:text-base text-slate-750 dark:text-slate-300 leading-relaxed font-semibold">
                    {overlap.recommendation}
                  </p>
                </div>

                <div className="lg:col-span-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-4 rounded-xl flex flex-col gap-3 font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <span className="text-[10px] font-mono tracking-widest text-slate-600 dark:text-slate-400 uppercase font-extrabold block">
                    Timezone Overlap Summary
                  </span>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-300 dark:border-slate-800">
                    <span>Overlap Hours:</span>
                    <span className="font-extrabold text-teal-605 dark:text-teal-450">{overlap.overlapHoursCount} Hours</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-300 dark:border-slate-800">
                    <span>{zoneA.displayName} Slot:</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{overlap.overlapRangeA}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span>{zoneB.displayName} Slot:</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{overlap.overlapRangeB}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daylight Saving Time (DST) Section */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Daylight Saving Time (DST) Differences
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* DST zone A */}
                <div className="premium-card p-6 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {zoneA.displayName.toUpperCase()} DST Schedule
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    {dstA.description}
                  </p>
                </div>

                {/* DST zone B */}
                <div className="premium-card p-6 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {zoneB.displayName.toUpperCase()} DST Schedule
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    {dstB.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Educational / Context Section */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Timezone Reference & Educational Profiles
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Profile A */}
              <div className="premium-card p-6 sm:p-8 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-4">
                <h4 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-800 pb-2">
                  What is {zoneA.displayName.toUpperCase()}?
                </h4>
                <div className="flex flex-col gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Timezone Standard Name:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{factsA.fullName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Offset reference:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">{factsA.standardOffset}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Geographic coverage:</span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{factsA.regions}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Business & Financial role:</span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{factsA.businessUsage}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Travel significance:</span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{factsA.travelRelevance}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Remote operations role:</span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{factsA.remoteWork}</span>
                  </div>
                </div>
              </div>

              {/* Profile B */}
              <div className="premium-card p-6 sm:p-8 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-4">
                <h4 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-800 pb-2">
                  What is {zoneB.displayName.toUpperCase()}?
                </h4>
                <div className="flex flex-col gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Timezone Standard Name:</span>
                    <span className="text-slate-705 dark:text-slate-300 font-semibold">{factsB.fullName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Offset reference:</span>
                    <span className="text-slate-750 dark:text-slate-300 font-mono font-bold">{factsB.standardOffset}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Geographic coverage:</span>
                    <span className="text-slate-705 dark:text-slate-300 leading-relaxed font-semibold">{factsB.regions}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Business & Financial role:</span>
                    <span className="text-slate-705 dark:text-slate-300 leading-relaxed font-semibold">{factsB.businessUsage}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Travel significance:</span>
                    <span className="text-slate-755 dark:text-slate-300 leading-relaxed font-semibold">{factsB.travelRelevance}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Remote operations role:</span>
                    <span className="text-slate-705 dark:text-slate-300 leading-relaxed font-semibold">{factsB.remoteWork}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Frequently Asked Questions (FAQ) Accordion style */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-500 dark:text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequently Asked Questions (FAQ)
            </h3>
            
            <div className="flex flex-col gap-4">
              {faqs.map((faq, index) => (
                <div key={`faq-${index}`} className="p-5 border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] rounded-xl">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                    {faq.question}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-300 dark:border-slate-800 pt-12">
            
            {/* Related timezone converters */}
            <div className="flex flex-col gap-4">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Related Timezone Converters
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400">
                {relatedConverters.map((link) => (
                  <li key={link.url}>
                    <Link href={link.url} className="hover:underline transition-all">
                      {link.label} &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related cities converters */}
            <div className="flex flex-col gap-4">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Related Cities Comparisons
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400">
                {relatedCities.map((link) => (
                  <li key={link.url}>
                    <Link href={link.url} className="hover:underline transition-all">
                      {link.label} &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </section>

      </div>
    </div>
  );
}
