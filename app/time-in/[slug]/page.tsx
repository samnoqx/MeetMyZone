import TimeInPageContent from '@/components/TimeInPageContent';
import { TIME_IN_SLUGS, CITY_BY_SLUG } from '@/utils/cityDirectory';
import { resolveSlug } from '@/utils/seoResolver';
import type { Metadata } from 'next';
import { POPULAR_CITIES_GEO, getCountryForTimezone } from '@/utils/seoContent';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 86400; // Cache pages for 24 hours (1 day)

export async function generateStaticParams() {
  const slugs = TIME_IN_SLUGS;
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
  const country = CITY_BY_SLUG[slug.toLowerCase()]?.country || POPULAR_CITIES_GEO[slug.toLowerCase()]?.country || getCountryForTimezone(zoneName);
  
  const isZoneGuide = resolved.displayName !== city;
  const title = isZoneGuide
    ? `${resolved.displayName} Time Zone | Current Time in ${city} | MeetMyZone`
    : `Current Time in ${city} | Local Clock | MeetMyZone`;
  const description = isZoneGuide
    ? `Explore the ${resolved.displayName} time zone using the local clock in ${city}, ${country}. Check current UTC offsets and seasonal daylight saving changes for ${zoneName}.`
    : `Check the current time in ${city}, ${country}. View the live local clock, UTC offset, daylight saving status and time comparisons with other cities.`;
  
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
  return <TimeInPageContent slug={slug} initialInstant={new Date().toISOString()} />;
}
