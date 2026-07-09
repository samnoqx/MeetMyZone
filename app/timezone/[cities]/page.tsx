import HomeClient from '../../HomeClient';
import { parseCitiesSlug } from '../../../utils/seoResolver';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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

export async function generateStaticParams() {
  return [];
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
  
  // Use first two resolved cities for the SEO pairing details if available
  return (
    <>
      <HomeClient initialParams={initialParams} />
    </>
  );
}
