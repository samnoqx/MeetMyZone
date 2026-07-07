import HomeClient from './HomeClient';
import type { Metadata } from 'next';
import SEOSection from '@/components/SEOSection';

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
  const params = await searchParams;
  
  let title = "MeetMyZone — Global Time Zone Converter & Plan Perfect Meetings Worldwide";
  let description = "Instantly check live times across 190+ countries with MeetMyZone's precision World Clock, or visualize working-hour overlaps to find the perfect meeting slot. Save your favorite locations, share schedules with one click, and coordinate global teams—all for free, with no login required.";
  
  const citiesParam = params.cities;
  const dateParam = params.date;
  
  if (citiesParam) {
    const citiesList = citiesParam.split(',').map(c => decodeURIComponent(c.trim())).filter(Boolean);
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
    openGraph: {
      title,
      description,
      type: 'website',
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
  const resolvedParams = await searchParams;
  return (
    <>
      <HomeClient initialParams={resolvedParams} />
      <SEOSection />
    </>
  );
}
