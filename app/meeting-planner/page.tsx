import { normalizeParams, parsePlannerList } from '@/utils/planner';
import HomeClient from '../HomeClient';
import type { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    cities?: string;
    zones?: string;
    reference?: string;
    workStart?: string;
    workEnd?: string;
    date?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = normalizeParams(await searchParams);
  
  let title = "Meeting Planner Across Time Zones | MeetMyZone";
  let description = "Plan meetings across time zones. Choose cities and a date, compare working-hour overlaps with DST adjustments, and share or export a calendar invitation.";
  
  const citiesParam = params.cities;
  const dateParam = params.date;
  
  if (citiesParam) {
    const citiesList = parsePlannerList(citiesParam);
    if (citiesList.length > 0) {
      const formattedCities = citiesList.join(', ');
      title = `Timezone Planner: ${formattedCities} | MeetMyZone`;
      description = `Visual meeting planner for ${formattedCities}${dateParam ? ` on ${dateParam}` : ''}. Compare schedules, view working hour overlaps, and schedule meetings.`;
    }
  }
  
  // Construct search parameters for the dynamic Open Graph image
  const ogSearchParams = new URLSearchParams();
  if (citiesParam) ogSearchParams.set('cities', citiesParam);
  if (params.zones) ogSearchParams.set('zones', params.zones);
  if (dateParam) ogSearchParams.set('date', dateParam);
  if (params.workStart) ogSearchParams.set('workStart', params.workStart);
  if (params.workEnd) ogSearchParams.set('workEnd', params.workEnd);
  if (params.reference) ogSearchParams.set('reference', params.reference);

  const relativeOgUrl = `/api/og?${ogSearchParams.toString()}`;

  return {
    title,
    description,
    alternates: {
      canonical: 'https://meetmyzone.com/meeting-planner',
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
          alt: `Timezone timeline overview for ${title}`,
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

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = normalizeParams(await searchParams);

  const breadcrumbPrefix = (
    <nav aria-label="Breadcrumb" className="text-xs sm:text-sm font-semibold text-txt-muted mb-1">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-brand-accent-hover transition-colors">
            Home
          </Link>
        </li>
        <li>
          <span className="text-txt-subtle">/</span>
        </li>
        <li aria-current="page" className="text-brand-accent-hover font-bold truncate">
          Meeting Planner
        </li>
      </ol>
    </nav>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            "@id": "https://meetmyzone.com/meeting-planner#application",
            name: "MeetMyZone Meeting Planner",
            url: "https://meetmyzone.com/meeting-planner",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web browser",
            description: "Plan international meetings by comparing local times and shared working hours for a selected date.",
            featureList: ["Compare participant cities", "Date-aware daylight saving adjustments", "Working-hour overlap timeline", "Calendar invitation export"],
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://meetmyzone.com" },
              { "@type": "ListItem", position: 2, name: "Meeting Planner", item: "https://meetmyzone.com/meeting-planner" },
            ],
          },
        ],
      }) }} />
      <HomeClient initialDate={new Date().toISOString().slice(0, 10)} initialParams={resolvedParams} headerPrefix={breadcrumbPrefix} meetingOnly />
    </>
  );
}
